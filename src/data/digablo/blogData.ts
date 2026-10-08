export interface DigabloBlogPost {
  id: string;
  slug: string;
  titre: string;
  categorie: 'CONSEILS' | 'FISCALITE' | 'TECHNIQUE' | 'AFRIQUE' | 'GESTION';
  datePublication: string;
  tempsLecture: string;
  resume: string;
  contenuMarkdown: string;
}

export const DIGABLO_BLOG_POSTS: DigabloBlogPost[] = [
  {
    id: 'blog-1',
    slug: 'facturation-electronique-france-2026-tpe',
    titre: 'Comment préparer votre TPE à la facturation électronique 2026',
    categorie: 'FISCALITE',
    datePublication: '2026-09-15',
    tempsLecture: '5 min de lecture',
    resume: 'À partir de septembre 2026, la facturation électronique et le e-reporting deviennent obligatoires pour les TPE et PME françaises. Voici ce que cela change concrètement pour votre caisse enregistreuse.',
    contenuMarkdown: `### Ce que change la réforme de septembre 2026 pour votre commerce

La réforme fiscale impose deux obligations majeures pour tous les commerçants assujettis à la TVA en France :
1. **La réception et l’émission de factures électroniques** au format structuré (Factur-X, UBL).
2. **Le e-reporting de caisse** : la transmission périodique et automatisée du récapitulatif des données de ventes aux particuliers (B2C) vers l’administration fiscale.

### Pourquoi votre caisse enregistreuse doit être conforme

Une caisse traditionnelle à rouleau papier ou un fichier Excel ne suffiront plus. Vous risquez des pénalités financières en cas de contrôle fiscal.

Avec **digabloPos**, votre caisse génère automatiquement :
- Des rapports Z journaliers inaltérables scellés en SHA-256.
- Les données nécessaires pour le e-reporting B2C prêtes à l’export pour votre expert-comptable.
- La numérotation continue sans rupture des tickets de caisse.`
  },
  {
    id: 'blog-2',
    slug: 'caisse-enregistreuse-hors-ligne',
    titre: 'Caisse enregistreuse hors-ligne : ce qui se passe vraiment quand le réseau coupe',
    categorie: 'TECHNIQUE',
    datePublication: '2026-08-20',
    tempsLecture: '4 min de lecture',
    resume: 'Un samedi soir à 20h30, votre box internet plante en plein coup de feu. Votre logiciel de caisse est-il capable de continuer à encaisser sans internet ?',
    contenuMarkdown: `### Le piège des caisses "100% Cloud"

La majorité des logiciels de caisse modernes vendus sur abonnement reposent sur un modèle centralisé dans le cloud. Lorsque le Wi-Fi de votre restaurant ou food truck saute, que se passe-t-il ?
- La caisse affiche une roue de chargement infinie.
- Les boutons d’encaissement se grisent.
- Les commandes ne partent plus vers la cuisine.
- Vos serveurs sont obligés de reprendre un carnet papier en catastrophe.

### La solution : l’architecture Offline-First (ACID SQLite)

**digabloPos** a été développé avec une philosophie inverse : **l’appareil physique est le maître de la donnée**.
- Chaque produit, ticket, paiement et mouvement de stock est stocké dans une base SQLite locale sur votre tablette ou téléphone.
- Aucun appel réseau bloquant n’est nécessaire pour finaliser une vente.
- Dès que la connexion 4G/Wi-Fi est rétablie, les événements sont poussés en arrière-plan sans aucune intervention humaine.`
  },
  {
    id: 'blog-3',
    slug: 'gerer-stock-bar-restaurant',
    titre: 'Comment gérer le stock d’un bar-restaurant sans y laisser sa marge',
    categorie: 'GESTION',
    datePublication: '2026-07-10',
    tempsLecture: '6 min de lecture',
    resume: 'Pertes de fûts de bière, bouteilles ouvertes sans vente enregistrée, ingrédients périmés : découvrez comment suivre votre stock au centime près.',
    contenuMarkdown: `### Le coût caché des "doses approximatives" et de la démarque inconnue

Dans un bar ou un restaurant, les marges se jouent sur la gestion des matières premières :
- Un steak haché trop cuit jeté sans être noté en perte.
- Une dose de cocktail généreuse qui fait perdre 30% de marge sur la bouteille de gin.
- Des ruptures de stock en plein rush qui vous obligent à refuser des commandes clients.

### Automatiser le déstockage à chaque commande

En liant vos fiches techniques directement aux boutons de caisse de **digabloPos**, chaque vente déduit les grammages exacts. Vous connaissez en temps réel la valeur de votre réserve et identifiez immédiatement les écarts d’inventaire.`
  },
  {
    id: 'blog-4',
    slug: 'caisse-restaurant-plusieurs-serveurs-hors-ligne',
    titre: 'Caisse pour restaurant à plusieurs serveurs, sans internet et sur vos téléphones',
    categorie: 'TECHNIQUE',
    datePublication: '2026-06-05',
    tempsLecture: '5 min de lecture',
    resume: 'Comment équiper 4 serveurs avec leurs propres smartphones pour prendre les commandes en terrasse sans box internet et sans abonnement hors de prix.',
    contenuMarkdown: `### Pourquoi payer 5 iPads et 150 € par mois ?

Pour beaucoup de jeunes restaurateurs et gérants de terrasses d’été, l’achat de 4 terminaux dédiés représente un investissement de plus de 2 500 €.

Avec **digabloPos** :
- Chaque serveur installe l’application sur son smartphone Android ou tablette économique.
- Les serveurs sont connectés en réseau local via un point d’accès Wi-Fi (même sans abonnement internet actif !).
- Les bons partent en direct vers l’écran cuisine KDS ou l’imprimante thermique du passe.`
  }
];
