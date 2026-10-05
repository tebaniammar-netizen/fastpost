import { Category, Product, Ingredient, OrderEntity, CashSession } from '../types/pos';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', nom: 'Burgers & Spéciaux', icone: 'Sandwich', ordreAffichage: 1 },
  { id: 'cat-2', nom: 'Menus Fast & Tasty', icone: 'UtensilsCrossed', ordreAffichage: 2 },
  { id: 'cat-3', nom: 'Accompagnements', icone: 'Layers', ordreAffichage: 3 },
  { id: 'cat-4', nom: 'Boissons Fraîches', icone: 'CupSoda', ordreAffichage: 4 },
  { id: 'cat-5', nom: 'Desserts & Glaces', icone: 'IceCream', ordreAffichage: 5 },
  { id: 'cat-6', nom: 'Sauces Maison', icone: 'Sparkles', ordreAffichage: 6 },
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'ing-1', nom: 'Pain Brioché Sésame', unite: 'piece', stockActuel: 120, seuilAlerte: 25, coutUnitaireCentimes: 35 },
  { id: 'ing-2', nom: 'Steak Pur Bœuf 150g', unite: 'piece', stockActuel: 95, seuilAlerte: 20, coutUnitaireCentimes: 140 },
  { id: 'ing-3', nom: 'Tranches de Cheddar Fondu', unite: 'piece', stockActuel: 240, seuilAlerte: 50, coutUnitaireCentimes: 25 },
  { id: 'ing-4', nom: 'Bacon Fumé Croustillant', unite: 'piece', stockActuel: 180, seuilAlerte: 40, coutUnitaireCentimes: 30 },
  { id: 'ing-5', nom: 'Sauce Barbecue Fumée', unite: 'ml', stockActuel: 3500, seuilAlerte: 800, coutUnitaireCentimes: 1 },
  { id: 'ing-6', nom: 'Pommes de Terre Frites', unite: 'g', stockActuel: 18500, seuilAlerte: 4000, coutUnitaireCentimes: 2 },
  { id: 'ing-7', nom: 'Filet de Poulet Pané Croustillant', unite: 'piece', stockActuel: 75, seuilAlerte: 15, coutUnitaireCentimes: 110 },
  { id: 'ing-8', nom: 'Sirop Soda Cola', unite: 'ml', stockActuel: 15000, seuilAlerte: 3000, coutUnitaireCentimes: 1 }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    categorieId: 'cat-1',
    nom: 'Double Smash Bacon Burger',
    description: 'Deux steaks smashés croustillants, double cheddar affiné, bacon fumé, oignons confits.',
    prixBaseCentimes: 990, // 9.90 €
    tvaTauxPourcent: 10.0,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    disponible: true,
    variantes: [
      { id: 'var-1', nom: 'Standard (Double)', prixCentimes: 990 },
      { id: 'var-2', nom: 'Triple Viande XL', prixCentimes: 1250 }
    ],
    extrasDisponibles: [
      { id: 'ext-1', nom: 'Extra Tranche Cheddar', prixCentimes: 120 },
      { id: 'ext-2', nom: 'Extra Double Bacon', prixCentimes: 180 },
      { id: 'ext-3', nom: 'Jalapeños Grillés', prixCentimes: 90 }
    ],
    recetteDeBase: [
      { ingredientId: 'ing-1', quantite: 1 },
      { ingredientId: 'ing-2', quantite: 2 },
      { ingredientId: 'ing-3', quantite: 2 },
      { ingredientId: 'ing-4', quantite: 2 },
      { ingredientId: 'ing-5', quantite: 30 }
    ]
  },
  {
    id: 'prod-2',
    categorieId: 'cat-1',
    nom: 'Crispy Chicken Ranch',
    description: 'Filet de poulet doré pané aux corn-flakes, salade iceberg, sauce ranch maison.',
    prixBaseCentimes: 890, // 8.90 €
    tvaTauxPourcent: 10.0,
    imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
    disponible: true,
    variantes: [
      { id: 'var-3', nom: 'Classique', prixCentimes: 890 },
      { id: 'var-4', nom: 'Épicé Pepper', prixCentimes: 920 }
    ],
    extrasDisponibles: [
      { id: 'ext-1', nom: 'Extra Tranche Cheddar', prixCentimes: 120 },
      { id: 'ext-2', nom: 'Extra Double Bacon', prixCentimes: 180 }
    ],
    recetteDeBase: [
      { ingredientId: 'ing-1', quantite: 1 },
      { ingredientId: 'ing-7', quantite: 1 },
      { ingredientId: 'ing-3', quantite: 1 }
    ]
  },
  {
    id: 'prod-3',
    categorieId: 'cat-2',
    nom: 'Menu Maxi Smash + Frites + Boisson',
    description: 'Le Double Smash Burger accompagné d’une grande portion de frites et boisson 50cl.',
    prixBaseCentimes: 1450, // 14.50 €
    tvaTauxPourcent: 10.0,
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',
    disponible: true,
    variantes: [
      { id: 'var-5', nom: 'Menu Standard', prixCentimes: 1450 },
      { id: 'var-6', nom: 'Menu XL King Size', prixCentimes: 1690 }
    ],
    extrasDisponibles: [
      { id: 'ext-1', nom: 'Extra Tranche Cheddar', prixCentimes: 120 },
      { id: 'ext-2', nom: 'Extra Double Bacon', prixCentimes: 180 }
    ],
    recetteDeBase: [
      { ingredientId: 'ing-1', quantite: 1 },
      { ingredientId: 'ing-2', quantite: 2 },
      { ingredientId: 'ing-3', quantite: 2 },
      { ingredientId: 'ing-6', quantite: 250 },
      { ingredientId: 'ing-8', quantite: 50 }
    ]
  },
  {
    id: 'prod-4',
    categorieId: 'cat-3',
    nom: 'Frites Maison Rustiques',
    description: 'Pommes de terre coupées épaisses avec leur peau, frites en 2 bains, sel de Guérande.',
    prixBaseCentimes: 380, // 3.80 €
    tvaTauxPourcent: 10.0,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    disponible: true,
    variantes: [
      { id: 'var-7', nom: 'Moyenne (180g)', prixCentimes: 380 },
      { id: 'var-8', nom: 'Grande (280g)', prixCentimes: 490 }
    ],
    extrasDisponibles: [
      { id: 'ext-4', nom: 'Nappage Sauce Fromagère Chaude', prixCentimes: 150 },
      { id: 'ext-5', nom: 'Brisures de Bacon Dorées', prixCentimes: 120 }
    ],
    recetteDeBase: [
      { ingredientId: 'ing-6', quantite: 200 }
    ]
  },
  {
    id: 'prod-5',
    categorieId: 'cat-4',
    nom: 'Cola Frais Pression 50cl',
    description: 'Servi ultra-frais avec glaçons et tranche de citron bio.',
    prixBaseCentimes: 320, // 3.20 €
    tvaTauxPourcent: 10.0,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    disponible: true,
    variantes: [
      { id: 'var-9', nom: 'Moyen 33cl', prixCentimes: 280 },
      { id: 'var-10', nom: 'Grand 50cl', prixCentimes: 320 }
    ],
    extrasDisponibles: [],
    recetteDeBase: [
      { ingredientId: 'ing-8', quantite: 50 }
    ]
  },
  {
    id: 'prod-6',
    categorieId: 'cat-5',
    nom: 'Sundae Caramel Beurre Salé & Noix de Pécan',
    description: 'Crème glacée onctueuse au lait entier, filet de caramel chaud, brisures de noix torréfiées.',
    prixBaseCentimes: 420, // 4.20 €
    tvaTauxPourcent: 10.0,
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
    disponible: true,
    variantes: [],
    extrasDisponibles: [
      { id: 'ext-6', nom: 'Double Nappage Caramel', prixCentimes: 90 }
    ],
    recetteDeBase: []
  }
];

export const INITIAL_ORDERS: OrderEntity[] = [
  {
    id: 'cmd-001',
    numeroCommandeJour: 41,
    referenceUnique: 'CMD-20261002-C01-041',
    dateCreationUtc: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    typeCommande: 'SUR_PLACE',
    statut: 'REMISE',
    totalHtCentimes: 2155,
    totalTvaCentimes: 215,
    totalTtcCentimes: 2370,
    remiseCentimes: 0,
    caissierId: 'usr-caissier-1',
    caisseId: 'TERM-01-COMPTOIR',
    clientNom: 'Thomas B.',
    syncStatus: 'SYNCED',
    syncAttempts: 1,
    items: [
      {
        cartItemId: 'item-1',
        productId: 'prod-3',
        productNom: 'Menu Maxi Smash + Frites + Boisson',
        variantNom: 'Menu XL King Size',
        extras: [{ id: 'ext-1', nom: 'Extra Tranche Cheddar', prixCentimes: 120 }],
        quantite: 1,
        prixUnitaireCentimes: 1810,
        totalLigneCentimes: 1810,
        notePreparation: 'Bien cuit'
      },
      {
        cartItemId: 'item-2',
        productId: 'prod-5',
        productNom: 'Cola Frais Pression 50cl',
        extras: [],
        quantite: 1,
        prixUnitaireCentimes: 320,
        totalLigneCentimes: 320
      }
    ],
    paiements: [
      {
        id: 'pay-001',
        commandeId: 'cmd-001',
        modePaiement: 'CARTE_BANCAIRE',
        montantCentimes: 2370,
        monnaieRendueCentimes: 0,
        statut: 'VALIDE',
        referenceTransaction: 'CB-AUTH-984321',
        datePaiementUtc: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
        auteurId: 'usr-caissier-1'
      }
    ]
  },
  {
    id: 'cmd-002',
    numeroCommandeJour: 42,
    referenceUnique: 'CMD-20261002-C01-042',
    dateCreationUtc: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    typeCommande: 'A_EMPORTER',
    statut: 'EN_PREPARATION',
    totalHtCentimes: 1645,
    totalTvaCentimes: 165,
    totalTtcCentimes: 1810,
    remiseCentimes: 0,
    caissierId: 'usr-caissier-1',
    caisseId: 'TERM-01-COMPTOIR',
    clientNom: 'Sarah M.',
    syncStatus: 'SYNCED',
    syncAttempts: 1,
    items: [
      {
        cartItemId: 'item-3',
        productId: 'prod-1',
        productNom: 'Double Smash Bacon Burger',
        extras: [{ id: 'ext-2', nom: 'Extra Double Bacon', prixCentimes: 180 }],
        quantite: 1,
        prixUnitaireCentimes: 1170,
        totalLigneCentimes: 1170,
        notePreparation: 'Sans oignons confits SVP'
      },
      {
        cartItemId: 'item-4',
        productId: 'prod-4',
        productNom: 'Frites Maison Rustiques',
        variantNom: 'Grande (280g)',
        extras: [{ id: 'ext-4', nom: 'Nappage Sauce Fromagère Chaude', prixCentimes: 150 }],
        quantite: 1,
        prixUnitaireCentimes: 640,
        totalLigneCentimes: 640
      }
    ],
    paiements: [
      {
        id: 'pay-002',
        commandeId: 'cmd-002',
        modePaiement: 'ESPECES',
        montantCentimes: 2000,
        monnaieRendueCentimes: 190,
        statut: 'VALIDE',
        datePaiementUtc: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
        auteurId: 'usr-caissier-1'
      }
    ]
  },
  {
    id: 'cmd-003',
    numeroCommandeJour: 43,
    referenceUnique: 'CMD-20261002-C01-043',
    dateCreationUtc: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    typeCommande: 'SUR_PLACE',
    statut: 'RECOLTEE',
    totalHtCentimes: 1318,
    totalTvaCentimes: 132,
    totalTtcCentimes: 1450,
    remiseCentimes: 0,
    caissierId: 'usr-caissier-1',
    caisseId: 'TERM-01-COMPTOIR',
    clientNom: 'Karim L.',
    syncStatus: 'PENDING',
    syncAttempts: 0,
    items: [
      {
        cartItemId: 'item-5',
        productId: 'prod-2',
        productNom: 'Crispy Chicken Ranch',
        extras: [],
        quantite: 1,
        prixUnitaireCentimes: 890,
        totalLigneCentimes: 890
      },
      {
        cartItemId: 'item-6',
        productId: 'prod-5',
        productNom: 'Cola Frais Pression 50cl',
        extras: [],
        quantite: 1,
        prixUnitaireCentimes: 320,
        totalLigneCentimes: 320
      }
    ],
    paiements: [
      {
        id: 'pay-003',
        commandeId: 'cmd-003',
        modePaiement: 'TITRE_RESTAURANT',
        montantCentimes: 1450,
        monnaieRendueCentimes: 0,
        statut: 'VALIDE',
        datePaiementUtc: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        auteurId: 'usr-caissier-1'
      }
    ]
  }
];

export const INITIAL_CASH_SESSION: CashSession = {
  id: 'sess-20261002-01',
  caisseId: 'TERM-01-COMPTOIR',
  caissierId: 'usr-caissier-1',
  dateOuvertureUtc: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  fondCaisseInitialCentimes: 15000, // 150.00 €
  totalEspecesTheoriqueCentimes: 16810, // 150.00€ + 18.10€ de vente cmd-002
  totalCarteCentimes: 2370, // 23.70€
  statut: 'OUVERTE'
};
