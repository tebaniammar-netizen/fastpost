# Manuel Opérateur & Guide d'Utilisation Caisse FastFood

Guide pratique destiné aux équipes de service, caissiers et gestionnaires de restaurant.

---

## 1. Prise de Poste & Ouverture de Caisse

1. **Allumage du Terminal :**
   - L'application `:app-pos` démarre automatiquement en plein écran.
   - Saisir le **Code PIN** personnel à 4 chiffres (ex: `1234`).
2. **Saisie du Fond de Caisse Initial :**
   - Le système affiche la boîte de dialogue *"Ouverture de Session de Caisse"*.
   - Compter les espèces présentes dans le tiroir (monnaie de départ, ex: `150,00 €`).
   - Saisir le montant et valider. L'heure et l'opérateur sont consignés dans le journal d'audit.

---

## 2. Enregistrement d'une Commande

1. **Sélection du Mode de Service :**
   - Choisir entre **SUR PLACE**, **À EMPORTER** ou **LIVRAISON** (impacte la TVA et le ticket cuisine).
2. **Composition du Panier :**
   - Naviguer par catégories (Burgers, Menus, Accompagnements, Boissons, Desserts).
   - Cliquer sur un produit : la modale d'options permet de sélectionner la **Variante** (ex: *Double Steak*), les **Suppléments** (ex: *Bacon croustillant +1.50€*) et de saisir une **Note Cuisine** spécifique (ex: *Sans oignons, bien cuit*).
3. **Application de Remise Commerciale :**
   - Cliquer sur le bouton Remise. Si la remise dépasse 20%, la saisie du **Code PIN Superviseur** d'un gestionnaire est automatiquement demandée.

---

## 3. Encaissement & Tiroir-Caisse

1. **Choix du Mode de Règlement :**
   - **Carte Bancaire :** Saisir le montant partiel ou total.
   - **Espèces :** Utiliser les touches rapides de billets (10€, 20€, 50€). Le système calcule immédiatement la **monnaie à rendre** en gros caractères verts.
2. **Validation :**
   - Le ticket client thermique est imprimé avec mentions légales et TVA.
   - Le bon de production est transmis instantanément à la cuisine KDS.
   - Le tiroir-caisse s'ouvre automatiquement par impulsion électrique RJ12.

---

## 4. Utilisation de l'Écran Cuisine (KDS)

1. Les commandes s'affichent instantanément dans la colonne **"1. REÇUES / EN ATTENTE"** avec le numéro `#042`.
2. Le chronomètre dynamique change de couleur selon l'ancienneté :
   - **Vert :** Moins de 5 minutes.
   - **Ambre :** Entre 5 et 10 minutes.
   - **Rouge clignotant :** Plus de 10 minutes (urgence de service).
3. Cliquer sur **"Démarrer Prépa ➔"** pour basculer en colonne **"2. EN PRÉPARATION"**.
4. Une fois assemblée au passe, cliquer sur **"Prête au Passe ➔"**.
5. Lors de la remise au client, cliquer sur **"Remise Client ✓"**.

---

## 5. Fin de Service & Clôture Fiscale Z

1. **Arrêt des Encaissements :**
   - Cliquer sur le menu d'administration et sélectionner **"Clôturer la Session"**.
2. **Comptage Physique des Espèces :**
   - Compter l'ensemble des billets et pièces présents dans le tiroir-caisse.
   - Saisir le montant physique compté.
3. **Contrôle d'Écart de Caisse :**
   - Le système compare le montant théorique et le montant physique.
   - Si un écart existe, un motif justificatif obligatoire doit être saisi.
4. **Impression du Rapport Z :**
   - Le système imprime le ticket officiel de clôture Z (totaux HT, TVA, TTC, ventilation des paiements, grand total perpétuel).
   - La session est verrouillée et transmise de manière inaltérable dans les archives fiscales.
