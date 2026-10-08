export type OrderType = 'SUR_PLACE' | 'A_EMPORTER' | 'LIVRAISON';

export type OrderStatus = 'RECOLTEE' | 'EN_PREPARATION' | 'PRETE' | 'REMISE' | 'ANNULEE';

export type PaymentMethod = 'ESPECES' | 'CARTE_BANCAIRE' | 'TITRE_RESTAURANT' | 'FIDELITE';

export type PaymentStatus = 'EN_ATTENTE' | 'VALIDE' | 'REFUSE' | 'REMBOURSE';

export type SyncStatus = 'PENDING' | 'SYNCED' | 'FAILED' | 'CONFLICT';

export type UserRole = 'ADMINISTRATEUR' | 'GESTIONNAIRE' | 'CAISSIER' | 'CUISINIER' | 'LIVREUR' | 'CLIENT';

export interface Ingredient {
  id: string; // UUID
  nom: string;
  unite: 'g' | 'ml' | 'piece';
  stockActuel: number;
  seuilAlerte: number;
  coutUnitaireCentimes: number;
}

export interface RecipeItem {
  ingredientId: string;
  quantite: number;
}

export interface ProductExtra {
  id: string;
  nom: string;
  prixCentimes: number;
  recipeIngredients?: RecipeItem[];
}

export interface ProductVariant {
  id: string;
  nom: string; // e.g. "Simple", "Double", "Menu XL"
  prixCentimes: number;
  recipeIngredients?: RecipeItem[];
}

export interface Product {
  id: string; // UUID
  categorieId: string;
  nom: string;
  description: string;
  prixBaseCentimes: number;
  tvaTauxPourcent: number; // e.g. 10.0 ou 5.5
  imageUrl: string;
  disponible: boolean;
  variantes: ProductVariant[];
  extrasDisponibles: ProductExtra[];
  recetteDeBase: RecipeItem[];
}

export interface Category {
  id: string;
  nom: string;
  icone: string;
  ordreAffichage: number;
}

export interface CartLineItem {
  cartItemId: string; // client-side unique id
  productId: string;
  productNom: string;
  variantId?: string;
  variantNom?: string;
  extras: ProductExtra[];
  quantite: number;
  prixUnitaireCentimes: number;
  totalLigneCentimes: number;
  notePreparation?: string;
}

export interface OrderEntity {
  id: string; // UUID
  numeroCommandeJour: number; // Ex: #042
  referenceUnique: string; // Ex: CMD-20261002-042
  dateCreationUtc: string; // ISO
  typeCommande: OrderType;
  statut: OrderStatus;
  totalHtCentimes: number;
  totalTvaCentimes: number;
  totalTtcCentimes: number;
  remiseCentimes: number;
  remiseRaison?: string;
  remiseAuteurId?: string;
  caissierId: string;
  caisseId: string;
  clientNom?: string;
  clientTelephone?: string;
  notesGenerales?: string;
  syncStatus: SyncStatus;
  syncAttempts: number;
  derniereErreurSync?: string;
  items: CartLineItem[];
  paiements: PaymentEntity[];
}

export interface PaymentEntity {
  id: string; // UUID
  commandeId: string;
  modePaiement: PaymentMethod;
  montantCentimes: number;
  monnaieRendueCentimes: number;
  statut: PaymentStatus;
  referenceTransaction?: string;
  datePaiementUtc: string;
  auteurId: string;
}

export interface CashSession {
  id: string; // UUID
  caisseId: string;
  caissierId: string;
  dateOuvertureUtc: string;
  dateClotureUtc?: string;
  fondCaisseInitialCentimes: number;
  totalEspecesCompteCentimes?: number;
  totalEspecesTheoriqueCentimes: number;
  totalCarteCentimes: number;
  ecartCentimes?: number;
  statut: 'OUVERTE' | 'CLOTUREE';
  notesCloture?: string;
}

export interface SyncEvent {
  id: string; // UUID
  aggregateType: 'ORDER' | 'PAYMENT' | 'STOCK_MOVEMENT' | 'CASH_SESSION' | 'AUDIT_LOG';
  aggregateId: string;
  eventType: string; // Ex: ORDER_CREATED, PAYMENT_RECORDED, STOCK_DEDUCTED
  payloadJson: string;
  timestampUtc: string;
  status: SyncStatus;
  retryCount: number;
  target: 'LOCAL_HUB' | 'REMOTE_CLOUD';
  lastError?: string;
}

export interface AuditLog {
  id: string;
  dateUtc: string;
  action: string;
  utilisateurId: string;
  utilisateurRole: UserRole;
  entiteType: string;
  entiteId: string;
  details: string;
}

export interface PosSettings {
  // 1. Établissement
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  storeSiret: string;
  storeTvaNumber: string;
  receiptHeaderMessage: string;
  receiptFooterMessage: string;
  
  // 2. Financier & Devises
  currency: 'EUR' | 'USD' | 'FCFA' | 'MAD' | 'DZD' | 'GBP' | 'CHF';
  currencySymbol: string;
  defaultTvaRateSurPlace: number;
  defaultTvaRateEmporter: number;
  defaultTvaRateBoissonsAlcool: number;
  autoRoundCash: boolean;

  // 3. Matériel & Impression ESC/POS
  printerType: 'BLUETOOTH' | 'NETWORK_WIFI' | 'USB';
  printerIpAddress: string;
  paperWidthMm: 80 | 58;
  autoPrintReceiptOnPayment: boolean;
  printKitchenTicketOnPayment: boolean;
  autoOpenCashDrawer: boolean;
  numberOfReceiptCopies: number;

  // 4. Écran Client Déporté (TV)
  customerDisplayChimeEnabled: boolean;
  customerDisplayMarqueeText: string;
  customerDisplayTheme: 'DARK_MODERN' | 'VIBRANT_GOLD' | 'CLEAN_MINIMAL';

  // 5. Sécurité & PIN Superviseur
  supervisorPin: string;
  requirePinForDiscount: boolean;
  requirePinForRefund: boolean;
  requirePinForOpenDrawerWithoutSale: boolean;
  requirePinForZReport: boolean;

  // 6. Données & Sync
  syncFrequencySeconds: number;
  soundEffectsEnabled: boolean;
}

export const DEFAULT_POS_SETTINGS: PosSettings = {
  storeName: 'FastFood Gourmet POS',
  storeAddress: '12 Rue de la République, 75001 Paris',
  storePhone: '+33 1 42 68 00 00',
  storeEmail: 'contact@fastfoodgourmet.fr',
  storeSiret: '849 201 928 00014',
  storeTvaNumber: 'FR 32 849201928',
  receiptHeaderMessage: 'Bienvenue au FastFood Gourmet !',
  receiptFooterMessage: 'Merci pour votre confiance. À très bientôt !',
  currency: 'EUR',
  currencySymbol: '€',
  defaultTvaRateSurPlace: 10.0,
  defaultTvaRateEmporter: 5.5,
  defaultTvaRateBoissonsAlcool: 20.0,
  autoRoundCash: false,
  printerType: 'NETWORK_WIFI',
  printerIpAddress: '192.168.1.100:9100',
  paperWidthMm: 80,
  autoPrintReceiptOnPayment: true,
  printKitchenTicketOnPayment: true,
  autoOpenCashDrawer: true,
  numberOfReceiptCopies: 1,
  customerDisplayChimeEnabled: true,
  customerDisplayMarqueeText: '🍔 Nos recettes sont préparées à la commande avec des ingrédients frais',
  customerDisplayTheme: 'DARK_MODERN',
  supervisorPin: '1234',
  requirePinForDiscount: true,
  requirePinForRefund: true,
  requirePinForOpenDrawerWithoutSale: true,
  requirePinForZReport: true,
  syncFrequencySeconds: 0,
  soundEffectsEnabled: true
};
