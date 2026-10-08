export interface CompetitorComparison {
  id: string;
  slug: string;
  concurrentNom: string;
  concurrentLogo: string;
  verdictCourt: string;
  prixConcurrent: string;
  commissionConcurrent: string;
  modeHorsLigneConcurrent: string;
  pointsFortsDigablo: string[];
  pointsFaiblesConcurrent: string[];
  tableauComparatif: {
    critere: string;
    digablo: string;
    concurrent: string;
    avantageDigablo: boolean;
  }[];
}

export const COMPETITOR_COMPARISONS: CompetitorComparison[] = [
  {
    id: 'comp-1',
    slug: 'digablo-vs-loyverse',
    concurrentNom: 'Loyverse',
    concurrentLogo: 'Loyverse POS',
    verdictCourt: 'Loyverse limite le hors-ligne et n’accepte qu’une seule devise. DigabloPos offre un hors-ligne complet et le support multi-devises natif.',
    prixConcurrent: 'Gratuit de base, modules de 5$ à 25$/mois',
    commissionConcurrent: '0% (passerelle externe requise)',
    modeHorsLigneConcurrent: 'Partiel (ventes uniquement, remboursements et cartes impossibles)',
    pointsFortsDigablo: [
      'Mode hors-ligne 100% complet (ventes, remboursements, stock, tickets)',
      'Multi-devises natif (FCFA, EUR, USD, MAD)',
      'Écran client d’appel avec carillon sonore intégré',
      'Architecture SQLite locale ultra-rapide sans dépendance cloud'
    ],
    pointsFaiblesConcurrent: [
      'Hors-ligne partiel qui bloque les fonctionnalités critiques en cas de coupure',
      'Une seule devise par compte, inadapté aux zones frontalières',
      'Tarifs des modules d’inventaire élevés à long terme'
    ],
    tableauComparatif: [
      { critere: 'Prix de base', digablo: 'Gratuit à vie (0 $)', concurrent: 'Gratuit', avantageDigablo: false },
      { critere: 'Mode hors-ligne', digablo: 'Complet (ACID SQLite)', concurrent: 'Partiel (ventes simples)', avantageDigablo: true },
      { critere: 'Support multi-devises', digablo: 'Inclus (FCFA, EUR, USD...)', concurrent: 'Non (1 seule devise)', avantageDigablo: true },
      { critere: 'Écran client déporté TV', digablo: 'Inclus avec carillon sonore', concurrent: 'App séparée payante', avantageDigablo: true },
      { critere: 'Gestion des fiches recettes', digablo: 'Inclus avec déstockage', concurrent: 'Module payant 25$/mois', avantageDigablo: true },
      { critere: 'Matériel requis', digablo: 'Libre (toute imprimante ESC/POS)', concurrent: 'Libre', avantageDigablo: false }
    ]
  },
  {
    id: 'comp-2',
    slug: 'digablo-vs-sumup',
    concurrentNom: 'SumUp Caisse',
    concurrentLogo: 'SumUp Caisse (ex-Tiller)',
    verdictCourt: 'SumUp prélève 1,75% sur chaque paiement carte et facture un abonnement mensuel élevé. DigabloPos est à 0% de commission.',
    prixConcurrent: 'À partir de 39 € / mois + matériel',
    commissionConcurrent: '1,75 % sur chaque paiement par carte',
    modeHorsLigneConcurrent: 'Limité à quelques heures de cache',
    pointsFortsDigablo: [
      '0% de commission prélevée sur vos paiements',
      'Zéro abonnement obligatoire : plan gratuit à vie',
      'Liberté totale du matériel d’impression et des terminaux bancaires',
      'Indépendance totale face aux commissions bancaires'
    ],
    pointsFaiblesConcurrent: [
      'Coût annuel astronomique avec les commissions de 1,75%',
      'Abonnement logiciel récurrent obligatoire',
      'Dépendance forte à la connexion cloud de SumUp'
    ],
    tableauComparatif: [
      { critere: 'Coût logiciel', digablo: '0 € / mois', concurrent: 'Dès 39 € / mois', avantageDigablo: true },
      { critere: 'Commission carte bancaire', digablo: '0 % (aucune)', concurrent: '1,75 % par vente', avantageDigablo: true },
      { critere: 'Engagement', digablo: 'Sans aucun engagement', concurrent: '12 à 24 mois souvent exigés', avantageDigablo: true },
      { critere: 'Autonomie hors-ligne', digablo: 'Illimitée (base locale)', concurrent: 'Limitée', avantageDigablo: true }
    ]
  },
  {
    id: 'comp-3',
    slug: 'digablo-vs-square',
    concurrentNom: 'Square POS',
    concurrentLogo: 'Square',
    verdictCourt: 'Square bloque l’utilisation de votre propre matériel et prélève 1,65% à chaque tap de carte. DigabloPos fonctionne avec votre matériel existant sans commission.',
    prixConcurrent: 'Gratuit logiciel, mais matériel fermé',
    commissionConcurrent: '1,65 % par paiement carte en présentiel',
    modeHorsLigneConcurrent: 'Mode hors-ligne limité à 24 heures maximum',
    pointsFortsDigablo: [
      'Compatible avec n’importe quelle imprimante et tiroir-caisse standard',
      '0% de frais de transaction',
      'Hors-ligne permanent sans limite de 24 heures',
      'Idéal pour l’Europe et l’Afrique'
    ],
    pointsFaiblesConcurrent: [
      'Obligation d’acheter les terminaux Square propriétaires',
      'Commission prélevée sur chaque paiement',
      'Non disponible dans de nombreux pays d’Afrique et marchés émergents'
    ],
    tableauComparatif: [
      { critere: 'Frais par transaction', digablo: '0 %', concurrent: '1,65 % par paiement', avantageDigablo: true },
      { critere: 'Liberté du matériel', digablo: 'Universel (Epson, Bluetooth...)', concurrent: 'Matériel Square fermé', avantageDigablo: true },
      { critere: 'Disponibilité internationale', digablo: 'Monde entier (FCFA, EUR...)', concurrent: 'Restreinte à quelques pays', avantageDigablo: true },
      { critere: 'Limite hors-ligne', digablo: 'Aucune limite', concurrent: '24h maximum', avantageDigablo: true }
    ]
  },
  {
    id: 'comp-4',
    slug: 'digablo-vs-laddition',
    concurrentNom: "L'Addition",
    concurrentLogo: "L'Addition",
    verdictCourt: "L'Addition impose l'écosystème Apple iPad très coûteux et un abonnement dès 49€/mois. DigabloPos tourne sur n'importe quel appareil Android/PC avec un plan gratuit.",
    prixConcurrent: 'À partir de 49 € / mois + achat d’iPads',
    commissionConcurrent: 'Variables selon TPE lié',
    modeHorsLigneConcurrent: 'Réseau local sur Mac mini serveur requis',
    pointsFortsDigablo: [
      'Fonctionne sur simple tablette ou smartphone Android économique',
      'Plan gratuit à vie pour démarrer sans apport financier',
      'Pas besoin de serveur Mac mini coûteux dans le restaurant',
      'Multi-métiers : Fast-food, bar, commerce, food truck'
    ],
    pointsFaiblesConcurrent: [
      'Nécessite d’acheter du matériel Apple très coûteux',
      'Abonnement mensuel de 49 € à 99 € / mois',
      'Réservé uniquement aux restaurants traditionnels'
    ],
    tableauComparatif: [
      { critere: 'Abonnement', digablo: '0 € (Gratuit à vie)', concurrent: '49 € à 99 € / mois', avantageDigablo: true },
      { critere: 'Matériel requis', digablo: 'Android, PC ou tablette', concurrent: 'iPad Apple obligatoire', avantageDigablo: true },
      { critere: 'Installation', digablo: 'En 2 minutes en autonomie', concurrent: 'Intervention technique requise', avantageDigablo: true }
    ]
  }
];
