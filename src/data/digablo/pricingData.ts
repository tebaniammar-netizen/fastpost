export interface PricingPlan {
  id: string;
  nom: string;
  prixMensuel: number; // 0 for free plan
  badge: string;
  description: string;
  pointsInclus: string[];
  ctaTexte: string;
  estPopulaire: boolean;
}

export interface OptionalModule {
  id: string;
  nom: string;
  prixMensuel: number;
  unite: string;
  description: string;
  benefice: string;
}

export const FREE_PLAN: PricingPlan = {
  id: 'plan-gratuit',
  nom: 'Plan Gratuit à Vie',
  prixMensuel: 0,
  badge: 'Idéal pour démarrer sans risque',
  description: 'Toutes les fonctionnalités essentielles pour encaisser et gérer votre commerce au quotidien, sans limite de temps.',
  pointsInclus: [
    'Commandes et encaissements illimités',
    'Mode hors-ligne complet (zéro panne internet)',
    'Paiements espèces, CB, titres-resto, mobile money',
    'Jusqu’à 2 comptes employés avec codes PIN',
    'Rapports Z conformes et historique 30 jours',
    'Plan de salle et gestion des tables',
    'Impression thermique 80mm / 58mm universelle',
    'Écran client et suivi de commande',
    '0% de commission prélevée sur vos ventes'
  ],
  ctaTexte: 'Commencer gratuitement',
  estPopulaire: true
};

export const OPTIONAL_MODULES: OptionalModule[] = [
  {
    id: 'mod-reports',
    nom: 'Rapports & Statistiques Illimités',
    prixMensuel: 20,
    unite: '/mois',
    description: 'Historique des ventes à vie, export comptable automatisé, analyse des marges et comparatifs mensuels.',
    benefice: 'Prêt pour votre expert-comptable'
  },
  {
    id: 'mod-employees',
    nom: 'Employés Supplémentaires',
    prixMensuel: 5,
    unite: '/mois par employé',
    description: 'Ajoutez autant de serveurs, cuisiniers ou caissiers que nécessaire avec gestion fine des droits et codes PIN.',
    benefice: 'Pour les équipes de plus de 2 personnes'
  },
  {
    id: 'mod-stock',
    nom: 'Module Stock Avancé & Ingrédients',
    prixMensuel: 15,
    unite: '/mois',
    description: 'Fiches techniques recettes, déstockage automatique des matières premières, valorisation d’inventaire et alertes réassort.',
    benefice: 'Maîtrise totale de votre food-cost'
  },
  {
    id: 'mod-notifications',
    nom: 'Notifications Push & Alertes Mobile',
    prixMensuel: 10,
    unite: '/mois',
    description: 'Recevez sur votre téléphone les alertes de fin de service, annulations de commande suspectes et récapitulatif du chiffre d’affaires.',
    benefice: 'Suivez votre restaurant à distance'
  },
  {
    id: 'mod-reservations',
    nom: 'Réservations & Planning',
    prixMensuel: 10,
    unite: '/mois',
    description: 'Cahier de réservations connecté au plan de salle, gestion des créneaux horaires et fiches clients.',
    benefice: 'Fin des doubles réservations'
  },
  {
    id: 'mod-currency',
    nom: 'Multi-Devises (FCFA / EUR / USD)',
    prixMensuel: 10,
    unite: '/mois',
    description: 'Gestion de plusieurs devises avec conversion instantanée à la caisse et sur le ticket pour le commerce transfrontalier.',
    benefice: 'Idéal Afrique de l’Ouest et Centrale'
  }
];

export const PRICING_FAQ = [
  {
    q: 'digabloPos est-il réellement gratuit ?',
    a: 'Oui, à 100%. Le plan gratuit vous permet d’encaisser sans limite de nombre de commandes ni de chiffre d’affaires, pour toujours. Il n’y a aucune carte bancaire requise à l’inscription.'
  },
  {
    q: 'Y a-t-il des frais ou commissions cachés sur les transactions ?',
    a: 'Non, absolument aucun frais (0%). Contrairement à Square ou SumUp qui prélèvent entre 1,65% et 1,75% sur chaque encaissement carte bancaire, digabloPos ne prend aucune commission sur votre chiffre d’affaires.'
  },
  {
    q: 'Puis-je activer ou désactiver des modules optionnels quand je veux ?',
    a: 'Oui. Les modules optionnels sont sans engagement de durée. Vous pouvez en activer un pour la saison haute d’été et le désactiver en hiver en 1 clic.'
  },
  {
    q: 'Combien ça coûte pour une équipe de 5 personnes ?',
    a: 'Le plan gratuit inclut déjà 2 employés. Pour 3 employés supplémentaires, cela vous coûte seulement 3 x 5$ = 15$/mois au total, tout le reste restant gratuit !'
  }
];
