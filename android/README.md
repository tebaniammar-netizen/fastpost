# FastFood Native Android POS & KDS System (NF525 Compliant)

Système de caisse enregistreuse tactile native et écran cuisine (KDS) pour la restauration rapide, développé sous **Kotlin 2.0**, **Jetpack Compose**, **Android Room (SQLite)** et **Hilt DI**, conçu pour fonctionner sans interruption en environnement déconnecté avec conformité fiscale inaltérable (NF525).

---

## 1. Architecture Multi-Modules

Le projet respecte une séparation stricte des responsabilités découpée en 6 modules Gradle :

```
├── android/
│   ├── app-pos/          # Application Caisse Tactile (Point de Vente)
│   ├── app-kds/          # Application Écran Cuisine (Kitchen Display System)
│   ├── core-model/       # Modèles de domaine purs, Money en centimes, Enums
│   ├── core-database/    # Room DB, 11 Entités, DAO, Migrations, Cryptographie NF525
│   ├── core-hardware/    # Pilote ESC/POS, Impulsion tiroir-caisse RJ12, Émulateur
│   └── core-sync/        # Outbox Pattern, Découverte mDNS, WebSocket duplex
```

---

## 2. Piliers Fonctionnels & Techniques

### A. Rigueur Monétaire & Arrondis Fiscaux
- Tous les montants sont manipulés en **centimes entiers (`Long`)** via la classe immuable `Money`.
- Élimination absolue des dérives d'arrondis des flottants (`Double`/`Float`).
- Calcul unitaire de la TVA à 10% avec la formule légale :
  $$\text{Montant HT} = \text{round}\left(\frac{\text{TTC} \times 100}{110}\right)$$
  $$\text{TVA} = \text{TTC} - \text{Montant HT}$$

### B. Conformité Fiscale NF525 & Article 286 du CGI
- **Inaltérabilité :** Toute modification de commande validée est interdite. Les annulations génèrent une ligne d'avoir contradictoire.
- **Chaînage SHA-256 :** Chaque ticket porte une signature cryptographique chaînée avec le hash du ticket précédent :
  $$\text{Signature} = \text{SHA256}(\text{PrevHash} \parallel \text{Id} \parallel \text{Ref} \parallel \text{DateUTC} \parallel \text{TTC} \parallel \text{HT} \parallel \text{TVA} \parallel \text{TerminalId})$$
- **Rapport Z Fiscal :** Clôture journalière ineffaçable avec grand total cumulatif perpétuel (**Grand Total non réinitialisable**).
- **Journal d'Audit :** Consigne chaque événement système (ouverture session, clôture, dérogations superviseur, écarts de caisse, inventaires).

### C. Écran Cuisine KDS & Monotonie
- Affichage en colonnes Kanban adaptées aux écrans tactiles 16:9 paysage.
- Règle de transition monotone stricte : `RECOLTEE` ➔ `EN_PREPARATION` ➔ `PRETE` ➔ `REMISE`.
- Codes couleur d'ancienneté en temps réel (< 5 min Vert, 5-10 min Ambre, > 10 min Rouge clignotant).

### D. Mode Déconnecté & Résilience Réseau
- **Transactional Outbox Pattern :** Les ventes sont immédiatement commitées dans SQLite localement, puis inscrites dans la table `sync_outbox`.
- **Découverte mDNS :** Détection automatique du serveur Local Hub en restaurant via le protocole DNS-SD (`_fastfood-hub._tcp`).
- **Reconnexion avec Backoff Exponentiel :** Les connexions WebSocket reprennent automatiquement avec un délai doublant à chaque échec (1s, 2s, 4s, 8s... jusqu'à 60s max).

### E. Matériel de Caisse & ESC/POS
- Pilote pour imprimantes thermiques 80 mm et 58 mm (Epson, Star Micronics, Bixolon, Munbyn) sur socket TCP direct (port `9100`).
- Découpe automatique du papier (`0x1D 0x56 0x42 0x00`).
- Commande d'impulsion pour ouverture automatisée du tiroir-caisse connecté en RJ12 (`0x1B 0x70 0x00 0x19 0xFA`).

---

## 3. Commandes Gradle pour la Compilation et les Tests

```bash
# Compiler l'ensemble des modules
./gradlew build

# Exécuter l'ensemble de la suite de tests unitaires et E2E
./gradlew test

# Générer l'APK de débogage pour la caisse tactile
./gradlew :app-pos:assembleDebug

# Générer l'APK de débogage pour l'écran cuisine KDS
./gradlew :app-kds:assembleDebug

# Générer les bundles de production signés (AAB)
./gradlew :app-pos:bundleRelease
./gradlew :app-kds:bundleRelease
```

---

## 4. Matrice des Rôles et Autorisations (RBAC)

| Rôle | Encaissement | Dérogation Remise > 20% | Annulation Vente | Réappro Stock | Clôture Fiscale Z |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Caissier** | Oui | Non (Code PIN Requis) | Non (PIN Requis) | Non | Non |
| **Gestionnaire** | Oui | Oui | Oui | Oui | Oui |
| **Cuisinier** | Non | Non | Non | Consultation | Non |
| **Administrateur**| Oui | Oui | Oui | Oui | Oui |
