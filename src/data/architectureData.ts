export const ARCHITECTURE_SECTIONS = {
  overview: {
    title: "1. Cahier des Charges & Principes Directeurs",
    summary: "Système de point de vente et d'écosystème FastFood Android offline-first, hautement résilient, sans perte de données, avec synchronisation hybride (Hub local P2P + Cloud distant).",
    principles: [
      {
        title: "Hors-Ligne Prioritaire Absolu (Offline-First)",
        description: "Toutes les lectures et écritures de la caisse s'effectuent directement dans la base SQLite locale via Room dans une transaction ACID. Aucun blocage réseau n'est toléré lors d'une prise de commande ou d'un encaissement."
      },
      {
        title: "Immutabilité Financière & Traçabilité Complète",
        description: "Tous les montants monétaires sont stockés en entiers stricts (centimes d'euros/devise). Aucune ligne de commande ou paiement validé n'est écrasé ni supprimé. Les annulations sont modélisées par des contre-passations horodatées."
      },
      {
        title: "Idempotence & Queue de Synchronisation",
        description: "Chaque opération métier génère un événement unique (UUID v4) dans une table `sync_outbox`. La réémission de messages ne produit jamais de doublon de commande, de paiement ou de déstockage."
      },
      {
        title: "Double Transport de Synchronisation (Hybride)",
        description: "Transport 1: Hub Réseau Local (mDNS / NSD + Ktor Server embarqué sur la caisse maîtresse ou serveur local) pour une latence < 50ms entre Caisses et KDS sans Internet. Transport 2: Backend Cloud distant via WorkManager pour consolidation multi-sites et commandes en ligne."
      }
    ]
  },
  databaseSchema: [
    {
      tableName: "categories",
      description: "Catégories de produits du menu (Burgers, Boissons, Menus, Desserts, Sauces)",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "Identifiant immuable généré côté client" },
        { name: "nom", type: "TEXT", nullable: false, note: "Ex: 'Burgers Gourmets'" },
        { name: "icone", type: "TEXT", nullable: false, note: "Nom ressource drawable ou clé icône" },
        { name: "ordre_affichage", type: "INTEGER", nullable: false, note: "Position de tri dans la caisse" },
        { name: "est_actif", type: "INTEGER (BOOLEAN)", nullable: false, note: "Visibilité dans le catalogue" },
        { name: "derniere_maj_utc", type: "INTEGER", nullable: false, note: "Timestamp epoch millisecondes" }
      ],
      indices: ["CREATE INDEX idx_categories_ordre ON categories(ordre_affichage)"]
    },
    {
      tableName: "produits",
      description: "Articles vendables au comptoir ou sur l'application client",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "Identifiant unique UUID v4" },
        { name: "categorie_id", type: "TEXT (FK)", nullable: false, note: "Référence vers categories(id)" },
        { name: "nom", type: "TEXT", nullable: false, note: "Ex: 'Double Bacon Cheddar'" },
        { name: "description", type: "TEXT", nullable: true, note: "Ingrédients et mentions allergènes" },
        { name: "prix_base_centimes", type: "INTEGER", nullable: false, note: "Prix en centimes entiers (Ex: 850 = 8.50€)" },
        { name: "tva_taux_bp", type: "INTEGER", nullable: false, note: "Taux TVA en points de base (ex: 1000 pour 10.0%, 550 pour 5.5%)" },
        { name: "image_url", type: "TEXT", nullable: true, note: "Chemin cache local ou URI" },
        { name: "disponible", type: "INTEGER (BOOLEAN)", nullable: false, note: "Disponibilité immédiate en cuisine" },
        { name: "version", type: "INTEGER", nullable: false, note: "Contrôle optimiste de version du catalogue" }
      ],
      foreignKeys: ["FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE RESTRICT"],
      indices: ["CREATE INDEX idx_produits_categorie ON produits(categorie_id)"]
    },
    {
      tableName: "produit_variantes",
      description: "Tailles et variantes d'un produit (Simple, Double, Menu XL, etc.)",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "Identifiant UUID" },
        { name: "produit_id", type: "TEXT (FK)", nullable: false, note: "Référence vers produits(id)" },
        { name: "nom", type: "TEXT", nullable: false, note: "Ex: 'Menu Maxi'" },
        { name: "prix_differentiel_centimes", type: "INTEGER", nullable: false, note: "Surcoût ou prix fixe en centimes" },
        { name: "ordre", type: "INTEGER", nullable: false, note: "Ordre d'affichage" }
      ],
      foreignKeys: ["FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE"]
    },
    {
      tableName: "produit_extras",
      description: "Suppléments configurables (Cheddar fondu, Bacon grillé, Oignons frits)",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "Identifiant UUID" },
        { name: "nom", type: "TEXT", nullable: false, note: "Ex: 'Extra Bacon'" },
        { name: "prix_centimes", type: "INTEGER", nullable: false, note: "Prix en centimes entiers" },
        { name: "ingredient_id", type: "TEXT (FK)", nullable: true, note: "Liaison stock direct pour déduction" }
      ]
    },
    {
      tableName: "ingredients",
      description: "Matières premières pour le calcul des coûts et la déduction automatique des stocks",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "Identifiant UUID" },
        { name: "nom", type: "TEXT", nullable: false, note: "Ex: 'Steak Haché Pur Bœuf 150g'" },
        { name: "unite", type: "TEXT", nullable: false, note: "ENUM: 'g', 'ml', 'piece'" },
        { name: "stock_actuel", type: "REAL", nullable: false, note: "Quantité en stock mesurée" },
        { name: "seuil_alerte", type: "REAL", nullable: false, note: "Seuil déclenchant notification de réapprovisionnement" },
        { name: "cout_unitaire_centimes", type: "INTEGER", nullable: false, note: "Coût d'achat moyen pondéré en centimes" }
      ]
    },
    {
      tableName: "recette_lignes",
      description: "Définition de la composition d'un produit en ingrédients",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "UUID" },
        { name: "produit_id", type: "TEXT (FK)", nullable: false, note: "Référence produit" },
        { name: "variante_id", type: "TEXT (FK)", nullable: true, note: "Optionnel si spécifique à une variante" },
        { name: "ingredient_id", type: "TEXT (FK)", nullable: false, note: "Référence ingrédient" },
        { name: "quantite_requise", type: "REAL", nullable: false, note: "Grammes, ml ou unités consommées par vente" }
      ],
      foreignKeys: [
        "FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE",
        "FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT"
      ]
    },
    {
      tableName: "commandes",
      description: "En-tête de commande avec numéro d'appel jour et totaux figés",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "Identifiant unique mondial UUID v4" },
        { name: "numero_jour", type: "INTEGER", nullable: false, note: "Numéro court cyclique pour appel cuisine/client (1 à 999)" },
        { name: "reference_unique", type: "TEXT", nullable: false, note: "Code unique traçable (ex: 'CMD-20261002-C01-042')" },
        { name: "date_creation_utc", type: "INTEGER", nullable: false, note: "Epoch millisecondes" },
        { name: "type_commande", type: "TEXT", nullable: false, note: "ENUM: SUR_PLACE, A_EMPORTER, LIVRAISON" },
        { name: "statut", type: "TEXT", nullable: false, note: "ENUM: RECOLTEE, EN_PREPARATION, PRETE, REMISE, ANNULEE" },
        { name: "total_ht_centimes", type: "INTEGER", nullable: false, note: "Total HT calculé et figé" },
        { name: "total_tva_centimes", type: "INTEGER", nullable: false, note: "Montant TVA figé" },
        { name: "total_ttc_centimes", type: "INTEGER", nullable: false, note: "Montant net à payer en centimes" },
        { name: "remise_centimes", type: "INTEGER", nullable: false, note: "Valeur de la remise appliquée" },
        { name: "remise_motif", type: "TEXT", nullable: true, note: "Justification obligatoire" },
        { name: "remise_auteur_id", type: "TEXT", nullable: true, note: "ID du responsable ayant autorisé la remise" },
        { name: "session_caisse_id", type: "TEXT (FK)", nullable: false, note: "Rattachement à la session de caisse en cours" },
        { name: "caissier_id", type: "TEXT", nullable: false, note: "ID de l'opérateur" },
        { name: "terminal_id", type: "TEXT", nullable: false, note: "ID matériel de la tablette / caisse" },
        { name: "client_nom", type: "TEXT", nullable: true, note: "Nom du client pour appel commande" },
        { name: "sync_status", type: "TEXT", nullable: false, note: "ENUM: PENDING, SYNCED, FAILED, CONFLICT" },
        { name: "sync_attempts", type: "INTEGER", nullable: false, note: "Compteur de tentatives" }
      ],
      indices: [
        "CREATE INDEX idx_cmd_date ON commandes(date_creation_utc)",
        "CREATE INDEX idx_cmd_statut ON commandes(statut)",
        "CREATE INDEX idx_cmd_sync ON commandes(sync_status)"
      ]
    },
    {
      tableName: "commande_lignes",
      description: "Détail de chaque produit vendu avec snapshot immuable de prix",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "Identifiant UUID de la ligne" },
        { name: "commande_id", type: "TEXT (FK)", nullable: false, note: "Référence vers commandes(id)" },
        { name: "produit_id", type: "TEXT", nullable: false, note: "ID du produit original (audit)" },
        { name: "produit_nom_snapshot", type: "TEXT", nullable: false, note: "Nom figé au moment de la vente" },
        { name: "variante_nom_snapshot", type: "TEXT", nullable: true, note: "Variante figée" },
        { name: "prix_unitaire_centimes", type: "INTEGER", nullable: false, note: "Prix unitaire effectif à la date de vente" },
        { name: "quantite", type: "INTEGER", nullable: false, note: "Nombre d'unités" },
        { name: "total_ligne_centimes", type: "INTEGER", nullable: false, note: "Total de la ligne TTC en centimes" },
        { name: "extras_json", type: "TEXT", nullable: true, note: "JSON des suppléments avec leurs prix unitaires figés" },
        { name: "note_preparation", type: "TEXT", nullable: true, note: "Instruction cuisine (ex: 'Sans oignons')" }
      ],
      foreignKeys: ["FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE"]
    },
    {
      tableName: "paiements",
      description: "Paiements ventilés par moyen de paiement avec horodatage strict",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "UUID unique de transaction" },
        { name: "commande_id", type: "TEXT (FK)", nullable: false, note: "Commande rattachée" },
        { name: "session_caisse_id", type: "TEXT (FK)", nullable: false, note: "Session de caisse active" },
        { name: "mode_paiement", type: "TEXT", nullable: false, note: "ENUM: ESPECES, CARTE_BANCAIRE, TITRE_RESTAURANT, FIDELITE" },
        { name: "montant_centimes", type: "INTEGER", nullable: false, note: "Montant encaissé en centimes" },
        { name: "monnaie_rendue_centimes", type: "INTEGER", nullable: false, note: "Rendu de monnaie pour espèces" },
        { name: "statut", type: "TEXT", nullable: false, note: "ENUM: EN_ATTENTE, VALIDE, REFUSE, REMBOURSE" },
        { name: "reference_externe", type: "TEXT", nullable: true, note: "Numéro autorisation TPE / passerelle CB" },
        { name: "date_paiement_utc", type: "INTEGER", nullable: false, note: "Epoch millisecondes" },
        { name: "caissier_id", type: "TEXT", nullable: false, note: "Opérateur ayant encaissé" }
      ],
      foreignKeys: [
        "FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE RESTRICT",
        "FOREIGN KEY (session_caisse_id) REFERENCES sessions_caisse(id) ON DELETE RESTRICT"
      ]
    },
    {
      tableName: "sessions_caisse",
      description: "Périodes d'activité de caisse avec contrôle du fond de caisse et écarts",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "UUID de session" },
        { name: "terminal_id", type: "TEXT", nullable: false, note: "ID du matériel" },
        { name: "caissier_id", type: "TEXT", nullable: false, note: "ID utilisateur à l'ouverture" },
        { name: "date_ouverture_utc", type: "INTEGER", nullable: false, note: "Timestamp ouverture" },
        { name: "date_cloture_utc", type: "INTEGER", nullable: true, note: "Timestamp clôture" },
        { name: "fond_initial_centimes", type: "INTEGER", nullable: false, note: "Espèces au tiroir-caisse à l'ouverture" },
        { name: "total_especes_theorique_centimes", type: "INTEGER", nullable: false, note: "Calculé automatiquement (Fond + Ventes Espèces)" },
        { name: "total_especes_compte_centimes", type: "INTEGER", nullable: true, note: "Compté physiquement à la clôture" },
        { name: "ecart_centimes", type: "INTEGER", nullable: true, note: "Différence (Compté - Théorique)" },
        { name: "statut", type: "TEXT", nullable: false, note: "ENUM: OUVERTE, CLOTUREE" }
      ]
    },
    {
      tableName: "sync_outbox",
      description: "File persistante des événements à synchroniser en local ou vers le Cloud (Idempotence)",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "Identifiant d'événement unique" },
        { name: "aggregate_type", type: "TEXT", nullable: false, note: "ORDER, PAYMENT, STOCK_MOVEMENT, CASH_SESSION" },
        { name: "aggregate_id", type: "TEXT", nullable: false, note: "ID de l'entité concernée" },
        { name: "event_type", type: "TEXT", nullable: false, note: "Ex: 'ORDER_CREATED', 'PAYMENT_RECORDED', 'ORDER_STATUS_CHANGED'" },
        { name: "payload_json", type: "TEXT", nullable: false, note: "Données complètes sérialisées" },
        { name: "timestamp_utc", type: "INTEGER", nullable: false, note: "Date de création de l'événement" },
        { name: "status", type: "TEXT", nullable: false, note: "ENUM: PENDING, IN_FLIGHT, COMPLETED, FAILED" },
        { name: "target", type: "TEXT", nullable: false, note: "ENUM: LOCAL_HUB, REMOTE_CLOUD, BOTH" },
        { name: "retry_count", type: "INTEGER", nullable: false, note: "Nombre d'échecs rencontrés" },
        { name: "last_error", type: "TEXT", nullable: true, note: "Message technique d'exception pour diagnostic" }
      ],
      indices: ["CREATE INDEX idx_sync_status ON sync_outbox(status, target)"]
    },
    {
      tableName: "journal_audit",
      description: "Historique inaltérable de sécurité de toutes les actions sensibles",
      primaryKey: "id (VARCHAR UUID)",
      columns: [
        { name: "id", type: "TEXT (UUID)", nullable: false, note: "UUID" },
        { name: "date_utc", type: "INTEGER", nullable: false, note: "Timestamp immuable" },
        { name: "action", type: "TEXT", nullable: false, note: "Ex: 'REMISE_ACCORDEE', 'COMMANDE_ANNULEE', 'CLOTURE_CAISSE', 'STOCK_AJUSTE'" },
        { name: "utilisateur_id", type: "TEXT", nullable: false, note: "Identifiant de l'auteur" },
        { name: "utilisateur_role", type: "TEXT", nullable: false, note: "Rôle de l'auteur" },
        { name: "entite_type", type: "TEXT", nullable: false, note: "Nom de la table ou de l'agrégat" },
        { name: "entite_id", type: "TEXT", nullable: false, note: "Clé de l'entité" },
        { name: "details_json", type: "TEXT", nullable: false, note: "Données avant/après et motif" }
      ]
    }
  ],
  modulesTree: [
    {
      path: ":app-pos",
      description: "Application principale pour les caisses tactiles de comptoir et bornes d'encaissement",
      subdirs: [
        "src/main/kotlin/com/fastfood/pos/ui/cashregister/ (Écran tactile, grille catalogue, pavé numérique)",
        "src/main/kotlin/com/fastfood/pos/ui/cart/ (Gestion panier, variantes, notes)",
        "src/main/kotlin/com/fastfood/pos/ui/payment/ (Ventilation paiements, calcul rendu espèces, interface TPE)",
        "src/main/kotlin/com/fastfood/pos/ui/session/ (Ouverture/clôture de caisse, comptage billets)",
        "src/main/kotlin/com/fastfood/pos/ui/history/ (Historique commandes, réimpression ticket)",
        "src/main/kotlin/com/fastfood/pos/ui/reports/ (Rapports X et Z de caisse, export CSV)"
      ]
    },
    {
      path: ":app-kds",
      description: "Application Kitchen Display System pour les écrans de préparation en cuisine",
      subdirs: [
        "src/main/kotlin/com/fastfood/kds/ui/kitchen/ (Colonnes: Reçue -> En préparation -> Prête -> Remise)",
        "src/main/kotlin/com/fastfood/kds/ui/ticket/ (Tickets cuisine avec code couleur de retard et suppléments en gras)",
        "src/main/kotlin/com/fastfood/kds/service/ (Écouteur réseau local SSE/WebSocket du hub cuisine)"
      ]
    },
    {
      path: ":app-client",
      description: "Application mobile pour commande client (Click & Collect ou Borne)",
      subdirs: [
        "src/main/kotlin/com/fastfood/client/ui/catalog/ (Parcours produit gourmand, personnalisation)",
        "src/main/kotlin/com/fastfood/client/ui/tracking/ (Suivi live statut commande avec accusé de réception formel)",
        "src/main/kotlin/com/fastfood/client/ui/history/ (Historique client et fidélité)"
      ]
    },
    {
      path: ":core:database",
      description: "Moteur de persistance local Room SQLite avec migrations versionnées et typage fort",
      subdirs: [
        "src/main/kotlin/com/fastfood/core/database/entity/ (Toutes les entités Room)",
        "src/main/kotlin/com/fastfood/core/database/dao/ (OrderDao, ProductDao, StockDao, SessionDao, SyncDao)",
        "src/main/kotlin/com/fastfood/core/database/converters/ (Date, Enums, Centimes TypeConverters)",
        "src/main/kotlin/com/fastfood/core/database/FastFoodDatabase.kt (Définition de la BDD et migrations v1 -> v2)"
      ]
    },
    {
      path: ":core:sync",
      description: "Moteur de synchronisation bidirectionnelle offline-first et gestionnaire de file d'attente",
      subdirs: [
        "src/main/kotlin/com/fastfood/core/sync/outbox/ (SyncQueueManager, EnqueueEventsWorker)",
        "src/main/kotlin/com/fastfood/core/sync/workers/ (WorkManager PeriodicSyncWorker, ImmediateSyncWorker)",
        "src/main/kotlin/com/fastfood/core/sync/localhub/ (Ktor Embedded Server & mDNS discovery pour fonctionnement sans Internet)",
        "src/main/kotlin/com/fastfood/core/sync/conflict/ (Moteur de résolution déterministe sans suppression financière)"
      ]
    },
    {
      path: ":core:model",
      description: "Modèles de domaine purs, calculs financiers en centimes et règles métier indépendantes de la plateforme",
      subdirs: [
        "src/main/kotlin/com/fastfood/core/model/order/ (Calculs totaux, TVA, ventilations)",
        "src/main/kotlin/com/fastfood/core/model/money/ (MoneyValue class en centimes entiers)",
        "src/main/kotlin/com/fastfood/core/model/recipe/ (Calcul déstockage par vente)",
        "src/main/kotlin/com/fastfood/core/model/auth/ (Permissions par rôle et jetons de session)"
      ]
    },
    {
      path: ":core:ui",
      description: "Système de design Material 3 adapté au tactile restaurant (gros boutons tactiles, contrastes élevés)",
      subdirs: [
        "src/main/kotlin/com/fastfood/core/ui/theme/ (Couleurs, typographie, espacements)",
        "src/main/kotlin/com/fastfood/core/ui/components/ (Numpad, CartSummary, BadgeStatut, Dialogs)"
      ]
    }
  ],
  testingStrategy: [
    {
      category: "1. Tests Unitaires de Précision Financière",
      tools: "JUnit 5 + Truth / AssertJ",
      cases: [
        "Calcul des totaux de lignes avec multiples suppléments sans débordement de virgule flottante",
        "Ventilation stricte de la TVA multi-taux (ex: 10% sur sandwich vs 5.5% sur eau minérale) au centime près",
        "Calcul du rendu de monnaie : validation que le montant rendu + montant payé = total attendu",
        "Application de remises en pourcentage et en montant fixe avec vérification du plancher à 0€"
      ]
    },
    {
      category: "2. Tests de Persistance Room & Migrations",
      tools: "Room Testing Artifact + Roborazzi / Robolectric",
      cases: [
        "Insertion transactionnelle d'une commande avec 10 lignes et 2 paiements atomiques",
        "Règle d'intégrité référentielle : interdiction de supprimer une catégorie contenant des produits vendus",
        "Test de migration de schéma Room de la version 1 à la version 2 sans perte de tickets de caisse",
        "Snapshot de prix : modification du prix d'un burger dans le catalogue -> vérification que le ticket passé conserve l'ancien prix"
      ]
    },
    {
      category: "3. Tests d'Idempotence et File de Synchronisation",
      tools: "Turbine + TestCoroutineDispatcher + MockWebServer",
      cases: [
        "Rejeu répété 5 fois du même événement `PAYMENT_RECORDED` -> aucun double encaissement en base",
        "Comportement en cas de perte de réseau au milieu d'un envoi : reprise automatique avec WorkManager sans doublon",
        "Résolution de conflit d'état KDS : priorité à l'état le plus avancé dans le cycle de vie de la commande",
        "Déduction des stocks : vérification que la consommation de matières premières n'est exécutée qu'une seule fois par commande"
      ]
    },
    {
      category: "4. Tests d'Autorisation et Audit de Sécurité",
      tools: "JUnit 5 + MockK",
      cases: [
        "Tentative d'application d'une remise > 10% par un caissier sans code PIN/token superviseur -> levée d'exception `UnauthorizedDiscountException`",
        "Clôture de caisse avec écart négatif : génération obligatoire d'une entrée inaltérable dans le journal d'audit",
        "Chiffrement sécurisé du stockage des secrets d'authentification (Keystore Android)"
      ]
    }
  ]
};
