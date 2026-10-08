export interface DigabloUseCase {
  id: string;
  slug: string;
  titre: string;
  nomCourt: string;
  badge: string;
  accroche: string;
  description: string;
  metriques: { valeur: string; label: string }[];
  fonctionnalitesCles: string[];
  citationCommercant: { nom: string; commerce: string; texte: string };
  icone: string;
}

export const DIGABLO_USE_CASES: DigabloUseCase[] = [
  {
    id: 'uc-1',
    slug: 'fast-food',
    nomCourt: 'Fast-Food & Burger',
    titre: 'Logiciel de Caisse pour Fast-Food et Restauration Rapide',
    badge: 'Au coup de feu, chaque seconde compte',
    accroche: 'Encaissement éclair en moins de 5 secondes, transmission instantanée en cuisine KDS et appel client sur écran TV.',
    description: 'Conçu pour tenir les pics de fréquentation du midi et du soir. Gestion des menus avec formules, sauces et cuissons, impression ticket cuisine séparée et double écran d’appel pour fluidifier le comptoir de retrait.',
    metriques: [
      { valeur: '< 5s', label: 'Temps d’encaissement moyen' },
      { valeur: '+20%', label: 'Hausse du panier moyen via options' },
      { valeur: '0%', label: 'Commission sur vos ventes' },
      { valeur: '100%', label: 'Autonome sans internet' }
    ],
    fonctionnalitesCles: [
      'Menu burger, tacos et formules à choix multiples',
      'Écran cuisine KDS en temps réel avec chronomètre',
      'Écran géant d’appel client déporté pour salle et comptoir',
      'Déstockage automatique des steaks, pains et frites'
    ],
    citationCommercant: {
      nom: 'Karim B.',
      commerce: 'Le Burger Gourmand, Lyon',
      texte: 'Pendant le rush de 12h30, on envoie 80 commandes à l’heure sans un seul bug. L’écran client au-dessus du comptoir a supprimé la cohue des clients qui attendaient debout.'
    },
    icone: 'Flame'
  },
  {
    id: 'uc-2',
    slug: 'restaurant',
    nomCourt: 'Restaurant Traditionnel',
    titre: 'Logiciel de Caisse pour Restaurant & Brasserie',
    badge: 'Service en salle fluide et additions sans erreur',
    accroche: 'Gérez votre plan de salle, envoyez les réclames en cuisine et partagez l’addition entre convives en quelques clics.',
    description: 'Suivez le statut de chaque table (entrée, plat, dessert, café), gérez plusieurs serveurs sur un même service et évitez les confusions d’additions.',
    metriques: [
      { valeur: '100%', label: 'Tables synchronisées' },
      { valeur: '3 clics', label: 'Pour diviser une note' },
      { valeur: '0 €', label: 'Matériel obligatoire' },
      { valeur: 'NF525', label: 'Conformité fiscale certifiée' }
    ],
    fonctionnalitesCles: [
      'Plan de salle interactif avec codes couleurs par statut',
      'Division d’addition par couvert ou montant égal',
      'Bons de commande cuisine avec notes de cuisson',
      'Rapport Z de clôture journalière automatique'
    ],
    citationCommercant: {
      nom: 'Hélène & Marc',
      commerce: 'Brasserie Le Central, Nantes',
      texte: 'Nos serveurs prennent les commandes sur tablette. Quand le Wi-Fi a sauté samedi soir, la caisse a continué sans broncher. Nos comptes sont toujours au centime près.'
    },
    icone: 'UtensilsCrossed'
  },
  {
    id: 'uc-3',
    slug: 'cafe-bar',
    nomCourt: 'Café & Bar / Lounge',
    titre: 'Logiciel de Caisse pour Bar, Café et Lounge',
    badge: 'Vitesse maximale au comptoir',
    accroche: 'Prenez les commandes au vol, gérez les ardoises clients et appliquez vos tarifs Happy Hour automatiquement.',
    description: 'Une caisse taillée pour la rapidité au comptoir. Touches rapides pour boissons favorites, gestion des notes ouvertes et encaissement sans friction.',
    metriques: [
      { valeur: '2s', label: 'Pour valider un café ou une pinte' },
      { valeur: '1 clic', label: 'Pour basculer en Happy Hour' },
      { valeur: '0 frais', label: 'Aucun abonnement contraignant' },
      { valeur: 'PIN', label: 'Traçabilité de chaque barman' }
    ],
    fonctionnalitesCles: [
      'Touches d’accès rapide pour boissons populaires',
      'Gestion des ardoises et comptes clients réguliers',
      'Tarification Happy Hour automatique selon l’heure',
      'Comptage de caisse rapide en fin de soirée'
    ],
    citationCommercant: {
      nom: 'Alexandre P.',
      commerce: 'Le Barbu Café, Bordeaux',
      texte: 'C’est ultra rapide pour encaisser les cafés du matin ou les bières du vendredi soir. La gestion des ardoises clients est propre et sans prise de tête.'
    },
    icone: 'Coffee'
  },
  {
    id: 'uc-4',
    slug: 'food-truck',
    nomCourt: 'Food Truck & Éphémère',
    titre: 'Logiciel de Caisse pour Food Truck & Restauration Mobile',
    badge: '100% autonome, zéro dépendance réseau',
    accroche: 'Installez-vous n’importe où : sur un marché, un festival ou au bord de la route. Encaissez sans Wi-Fi sur batterie.',
    description: 'Le food truck a des contraintes uniques : pas de box internet fixe, batterie limitée, espace restreint. Digablo tourne sur simple tablette ou smartphone Android avec imprimante thermique Bluetooth.',
    metriques: [
      { valeur: '0 Watt', label: 'De box internet requise' },
      { valeur: 'Bluetooth', label: 'Impression ticket sur batterie' },
      { valeur: '100%', label: 'Hors-ligne garanti' },
      { valeur: '0 €', label: 'Pour démarrer immédiatement' }
    ],
    fonctionnalitesCles: [
      'Fonctionne sur simple smartphone ou tablette Android',
      'Impression ticket sans fil via imprimante Bluetooth 58mm',
      'Synchronisation cloud dès que vous retrouvez de la 4G/5G',
      'Statistiques des ventes par emplacement géographique'
    ],
    citationCommercant: {
      nom: 'Stéphane V.',
      commerce: 'Street Burritos Food Truck, Toulouse',
      texte: 'Sur les festivals en plein champ où il n’y a aucun réseau, toutes les autres caisses cloud plantent. Avec Digablo, j’encaisse toute la journée sans me soucier du réseau.'
    },
    icone: 'Truck'
  },
  {
    id: 'uc-5',
    slug: 'grocery',
    nomCourt: 'Épicerie & Supérette',
    titre: 'Logiciel de Caisse pour Épicerie, Supérette et Vrac',
    badge: 'Catalogue riche et scan code-barres fluide',
    accroche: 'Gérez des milliers de références, scannez vos articles au code-barres et suivez vos alertes de réassort.',
    description: 'Une caisse pensée pour les commerces de proximité avec une grande variété d’articles. Recherche instantanée, gestion des codes EAN et suivi précis de la marge.',
    metriques: [
      { valeur: '10 000+', label: 'Références gérées sans ralentissement' },
      { valeur: 'Scan rapide', label: 'Compatible toutes douchettes' },
      { valeur: 'Multi-TVA', label: 'Gestion automatique 5.5%, 10%, 20%' },
      { valeur: 'Stock net', label: 'Alerte rupture immédiate' }
    ],
    fonctionnalitesCles: [
      'Scan de code-barres par douchette USB, Bluetooth ou caméra',
      'Recherche prédictive ultra-rapide par nom ou code article',
      'Régularisation d’inventaire et gestion des pertes',
      'Rapports détaillés des marges et produits les plus vendus'
    ],
    citationCommercant: {
      nom: 'Amina D.',
      commerce: 'L’Épicerie du Quartier, Marseille',
      texte: 'J’ai plus de 3 000 articles en rayon. La recherche et le scan sont instantanés. Les alertes de stock m’évitent de me retrouver à court de produits essentiels.'
    },
    icone: 'Store'
  },
  {
    id: 'uc-6',
    slug: 'bakery',
    nomCourt: 'Boulangerie & Pâtisserie',
    titre: 'Logiciel de Caisse pour Boulangerie et Pâtisserie',
    badge: 'Rapidité des transactions et gestion des formules midi',
    accroche: 'Fluidifiez la file d’attente du matin et du midi. Formules sandwich + boisson + dessert calculées automatiquement.',
    description: 'Des dizaines de clients pressés à 8h et à 12h. La caisse doit répondre au quart de tour avec rendu de monnaie immédiat et boutons favoris baguettes et viennoiseries.',
    metriques: [
      { valeur: '3s', label: 'Par transaction baguette' },
      { valeur: 'Formules', label: 'Application automatique des packs midi' },
      { valeur: 'Fidélité', label: 'Fidélisation clients intégrée' },
      { valeur: 'Clôture Z', label: 'En 30 secondes en fin de journée' }
    ],
    fonctionnalitesCles: [
      'Boutons visuels pour viennoiseries et pains du jour',
      'Détection automatique des formules déjeuner',
      'Paiements mixtes (Titres-restaurants + Espèces)',
      'Compteur de caisse et pesée rapide'
    ],
    citationCommercant: {
      nom: 'Guillaume L.',
      commerce: 'Boulangerie L’Épi d’Or, Lille',
      texte: 'À 7h30 du matin, on n’a pas le temps de cliquer 4 fois pour une baguette tradition. Avec Digablo, en un tap c’est encaissé et le client a son rendu de monnaie.'
    },
    icone: 'Croissant'
  }
];
