export interface DigabloFeature {
  id: string;
  slug: string;
  nom: string;
  categorie: 'VENTE' | 'HARDWARE' | 'STOCK' | 'EQUIPE' | 'SYNC' | 'FISCALITE';
  shortDesc: string;
  fullDesc: string;
  pointsForts: string[];
  icone: string;
}

export const DIGABLO_FEATURES: DigabloFeature[] = [
  {
    id: 'feat-1',
    slug: 'cash-register',
    nom: 'Point de Vente & Caisse Enregistreuse',
    categorie: 'VENTE',
    shortDesc: 'Encaissement ultra-rapide en moins de 5 secondes, adapté aux rushs intenses.',
    fullDesc: 'Une interface pensée pour les professionnels du commerce et de la restauration. Prise de commande tactile instantanée, gestion des menus, options et suppléments, encaissement multi-moyens (espèces, carte, titres-restaurant, mobile money) et rendu de monnaie automatique.',
    pointsForts: [
      'Encaissement en moins de 5 secondes par client',
      'Calcul automatique du rendu de monnaie et des taxes',
      'Prise en compte des remises, avoirs et notes de frais',
      'Interface personnalisable par catégories et visuels produits'
    ],
    icone: 'Receipt'
  },
  {
    id: 'feat-2',
    slug: 'offline-mode',
    nom: 'Mode Hors-Ligne Total (100% Offline-First)',
    categorie: 'SYNC',
    shortDesc: 'Votre caisse continue d’encaisser même sans aucune connexion internet.',
    fullDesc: 'Conçu avec une architecture locale SQLite Room stricte. Aucune coupure internet ne bloque vos ventes. Dès que le réseau ou le Wi-Fi revient, toutes les transactions sont automatiquement synchronisées sans conflit et sans perte de données.',
    pointsForts: [
      'Fonctionne 100% hors-ligne sans box internet active',
      'Synchronisation automatique dès le rétablissement du réseau',
      'Protection contre les pannes Wi-Fi lors des services du samedi soir',
      'Base locale chiffrée et ultra-rapide'
    ],
    icone: 'WifiOff'
  },
  {
    id: 'feat-3',
    slug: 'thermal-printing',
    nom: 'Impression Thermique ESC/POS & Tiroir-Caisse',
    categorie: 'HARDWARE',
    shortDesc: 'Compatible avec toutes les imprimantes tickets 80mm/58mm via Bluetooth, Wi-Fi, Ethernet et USB.',
    fullDesc: 'Impression instantanée de tickets de caisse légaux avec logo, mentions légales TVA, scellement fiscal et QR code. Déclenchement automatique de l’impulsion électrique d’ouverture du tiroir-caisse à l’encaissement en espèces.',
    pointsForts: [
      'Support universel ESC/POS (Epson, Star Micronics, Munbyn, Sunmi, Xprinter)',
      'Connexions Bluetooth, USB, Réseau LAN et Wi-Fi',
      'Impression de tickets cuisine séparés par poste de préparation',
      'Ouverture tiroir-caisse configurable par impulsion RJ11'
    ],
    icone: 'Printer'
  },
  {
    id: 'feat-4',
    slug: 'customer-display',
    nom: 'Écran Client Déporté (TV & Moniteur Comptoir)',
    categorie: 'HARDWARE',
    shortDesc: 'Affichage géant des commandes prêtes et en cours de préparation avec carillon sonore.',
    fullDesc: 'Projettez sur un second moniteur, une tablette ou une Smart TV l’état d’avancement des commandes. Colonnes "En préparation" et "Prêt à retirer" avec signal sonore "Ding-Dong" et suivi par ticket.',
    pointsForts: [
      'Double colonne haute visibilité pour salle de restaurant',
      'Carillon sonore automatique à chaque commande prête',
      'Mode autonome déportable sur n’importe quelle Smart TV ou écran HDMI',
      'Suivi en direct du numéro de ticket pour les clients'
    ],
    icone: 'Tv'
  },
  {
    id: 'feat-5',
    slug: 'inventory-management',
    nom: 'Gestion des Stocks & Déstockage Ingrédients',
    categorie: 'STOCK',
    shortDesc: 'Décompte automatique des stocks et matières premières à chaque vente.',
    fullDesc: 'Gérez vos fiches recettes et nomenclatures. Chaque burger, boisson ou plat vendu décompte automatiquement les grammes, millilitres ou pièces nécessaires en réserve. Alertes de réapprovisionnement automatiques.',
    pointsForts: [
      'Déstockage unitaire et par recette à la seconde',
      'Alertes visuelles en cas de franchissement du seuil critique',
      'Valorisation comptable du stock HT en temps réel',
      'Gestion des entrées fournisseurs, pertes et régularisations d’inventaire'
    ],
    icone: 'Boxes'
  },
  {
    id: 'feat-6',
    slug: 'table-management',
    nom: 'Plan de Salle & Gestion de Tables',
    categorie: 'VENTE',
    shortDesc: 'Organisation visuelle des tables, suivi des couverts et transfert d’addition.',
    fullDesc: 'Visualisez l’état de votre restaurant en un coup d’œil : tables libres, occupées, en attente de paiement. Associez des commandes aux tables, séparez les additions et envoyez les réclames en cuisine.',
    pointsForts: [
      'Plan de salle interactif adapté aux restaurants et bars',
      'Gestion des serveurs par table et suivi du temps d’occupation',
      'Partage et division d’addition en plusieurs paiements',
      'Envoi des suites et réclames vers les postes de cuisine'
    ],
    icone: 'LayoutGrid'
  },
  {
    id: 'feat-7',
    slug: 'employee-management',
    nom: 'Gestion des Employés & Codes PIN',
    categorie: 'EQUIPE',
    shortDesc: 'Contrôle des accès, permissions avancées et traçabilité des opérations sensibles.',
    fullDesc: 'Attribuez un code PIN unique à chaque membre d’équipe (serveur, caissier, cuisinier, responsable). Contrôlez les autorisations d’annulation, de remise ou d’ouverture de tiroir avec un journal d’audit inaltérable.',
    pointsForts: [
      'Connexion rapide par code PIN 4 chiffres',
      'Contrôle des remises avec validation responsable',
      'Historique nominatif de chaque action en caisse',
      'Rapports de vente individuels par serveur'
    ],
    icone: 'Users'
  },
  {
    id: 'feat-8',
    slug: 'e-invoicing',
    nom: 'Conformité Fiscale NF525 & Facture 2026',
    categorie: 'FISCALITE',
    shortDesc: 'Rapports Z inaltérables, clôture journalière et préparation réforme 2026.',
    fullDesc: 'Respectez scrupuleusement les exigences légales : inaltérabilité, sécurisation, conservation et archivage des données de caisse. Scellement cryptographique SHA-256 et génération automatique des rapports X et Z.',
    pointsForts: [
      'Rapport Z de clôture journalière certifié et horodaté',
      'Chaînage cryptographique SHA-256 des tickets de vente',
      'Export comptable conforme FEC et e-reporting',
      'Prêt pour la facturation électronique 2026'
    ],
    icone: 'ShieldCheck'
  },
  {
    id: 'feat-9',
    slug: 'multi-currency',
    nom: 'Multi-Devises & Double Affichage',
    categorie: 'VENTE',
    shortDesc: 'Encaissez en FCFA, EUR, USD, MAD ou devises locales avec taux paramétrable.',
    fullDesc: 'Idéal pour le commerce international, les zones frontalières et les marchés d’Afrique de l’Ouest et Centrale. Double affichage sur l’écran et sur le ticket de caisse avec conversion automatique.',
    pointsForts: [
      'Support du FCFA (XOF/XAF), Euro, Dollar, Dirham, etc.',
      'Double affichage de l’addition et du rendu de monnaie',
      'Taux de change paramétrable en un clic',
      'Paiements mixtes acceptés'
    ],
    icone: 'Coins'
  },
  {
    id: 'feat-10',
    slug: 'barcode-scanner',
    nom: 'Scanner Code-Barres & Douchette',
    categorie: 'HARDWARE',
    shortDesc: 'Lecture instantanée des codes EAN-13, EAN-8 et QR codes via douchette USB ou caméra.',
    fullDesc: 'Accélérez les passages en caisse dans les commerces de détail, épiceries et supérettes. Compatible avec toutes les douchettes filaires, sans fil Bluetooth ou directement avec l’appareil photo de votre smartphone.',
    pointsForts: [
      'Scan ultra-rapide des articles pré-enregistrés',
      'Compatible avec les douchettes USB et Bluetooth standard',
      'Mode scan continu pour les inventaires',
      'Génération et impression d’étiquettes code-barres personnalisées'
    ],
    icone: 'Scan'
  }
];
