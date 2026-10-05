import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Ticket, 
  CheckCircle, 
  Clock, 
  Layers, 
  RefreshCw, 
  AlertCircle, 
  ChefHat, 
  Receipt, 
  DollarSign, 
  Percent, 
  Lock, 
  ArrowRight,
  Flame,
  UserCheck
} from 'lucide-react';
import { 
  Product, 
  CartLineItem, 
  OrderEntity, 
  Ingredient, 
  SyncEvent, 
  AuditLog, 
  OrderType,
  PaymentMethod,
  OrderStatus
} from '../../types/pos';
import { 
  formatCentimesToEuro, 
  formatTimeAgo, 
  getStatusBadgeColor 
} from '../../utils/formatters';

interface InteractiveSimulatorTabProps {
  categories: any[];
  products: Product[];
  ingredients: Ingredient[];
  orders: OrderEntity[];
  syncEvents: SyncEvent[];
  auditLogs: AuditLog[];
  isOnline: boolean;
  onNewOrderCreated: (order: OrderEntity, events: SyncEvent[], audit: AuditLog[]) => void;
  onOrderStatusUpdated: (orderId: string, newStatus: OrderStatus) => void;
  onSyncQueueProcessed: () => void;
  onUpdateIngredients: (updated: Ingredient[]) => void;
}

export const InteractiveSimulatorTab: React.FC<InteractiveSimulatorTabProps> = ({
  categories,
  products,
  ingredients,
  orders,
  syncEvents,
  auditLogs,
  isOnline,
  onNewOrderCreated,
  onOrderStatusUpdated,
  onSyncQueueProcessed,
  onUpdateIngredients
}) => {
  const [subView, setSubView] = useState<'POS' | 'KDS' | 'STOCKS' | 'SYNC_OUTBOX' | 'AUDIT'>('POS');
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-1');
  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('SUR_PLACE');
  const [discountCentimes, setDiscountCentimes] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>('');
  
  // Customization modal state
  const [activeProductForCustomization, setActiveProductForCustomization] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [linePrepNote, setLinePrepNote] = useState<string>('');

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMethod>('CARTE_BANCAIRE');
  const [cashGivenCentimes, setCashGivenCentimes] = useState<number>(0);
  const [isSupervisorAuthOpen, setIsSupervisorAuthOpen] = useState<boolean>(false);
  const [supervisorPin, setSupervisorPin] = useState<string>('');

  // Totals calculation in cents
  const subtotalCentimes = cart.reduce((acc, item) => acc + item.totalLigneCentimes, 0);
  const totalTtcCentimes = Math.max(0, subtotalCentimes - discountCentimes);
  const totalHtCentimes = Math.round(totalTtcCentimes / 1.10);
  const totalTvaCentimes = totalTtcCentimes - totalHtCentimes;
  const cashChangeCentimes = paymentMode === 'ESPECES' ? Math.max(0, cashGivenCentimes - totalTtcCentimes) : 0;

  // Open customization modal
  const handleProductClick = (product: Product) => {
    setActiveProductForCustomization(product);
    setSelectedVariantId(product.variantes.length > 0 ? product.variantes[0].id : null);
    setSelectedExtras([]);
    setLinePrepNote('');
  };

  // Confirm product into cart
  const handleConfirmAddToCart = () => {
    if (!activeProductForCustomization) return;

    const prod = activeProductForCustomization;
    const variant = prod.variantes.find(v => v.id === selectedVariantId);
    const extras = prod.extrasDisponibles.filter(e => selectedExtras.includes(e.id));
    
    const basePrice = variant ? variant.prixCentimes : prod.prixBaseCentimes;
    const extrasPrice = extras.reduce((sum, e) => sum + e.prixCentimes, 0);
    const unitPrice = basePrice + extrasPrice;

    const newItem: CartLineItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: prod.id,
      productNom: prod.nom,
      variantId: variant?.id,
      variantNom: variant?.nom,
      extras: extras,
      quantite: 1,
      prixUnitaireCentimes: unitPrice,
      totalLigneCentimes: unitPrice,
      notePreparation: linePrepNote.trim() || undefined
    };

    setCart([...cart, newItem]);
    setActiveProductForCustomization(null);
  };

  // Modify cart item quantity
  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantite + delta;
        if (newQty <= 0) return null;
        return {
          ...item,
          quantite: newQty,
          totalLigneCentimes: item.prixUnitaireCentimes * newQty
        };
      }
      return item;
    }).filter(Boolean) as CartLineItem[]);
  };

  // Apply discount with supervisor PIN validation
  const handleApplyDiscount = () => {
    if (supervisorPin === '1234') {
      setDiscountCentimes(200); // 2.00 € de remise autorisée
      setIsSupervisorAuthOpen(false);
      setSupervisorPin('');
    } else {
      alert('Code PIN Superviseur incorrect (Entrez 1234 pour cette démo).');
    }
  };

  // Complete Payment and generate Order + Event + Stock deduction
  const handleCompleteOrder = () => {
    if (cart.length === 0) return;
    if (paymentMode === 'ESPECES' && cashGivenCentimes < totalTtcCentimes) {
      alert("Le montant en espèces donné est insuffisant pour couvrir le montant total.");
      return;
    }

    const orderId = `cmd-${Date.now()}`;
    const nextOrderNumber = orders.length + 41;
    const reference = `CMD-20261002-C01-${String(nextOrderNumber).padStart(3, '0')}`;
    const nowIso = new Date().toISOString();

    const newOrder: OrderEntity = {
      id: orderId,
      numeroCommandeJour: nextOrderNumber,
      referenceUnique: reference,
      dateCreationUtc: nowIso,
      typeCommande: orderType,
      statut: 'RECOLTEE',
      totalHtCentimes,
      totalTvaCentimes,
      totalTtcCentimes,
      remiseCentimes: discountCentimes,
      caissierId: 'usr-caissier-1',
      caisseId: 'TERM-01-COMPTOIR',
      clientNom: customerName.trim() || 'Client Comptoir',
      syncStatus: isOnline ? 'SYNCED' : 'PENDING',
      syncAttempts: isOnline ? 1 : 0,
      items: [...cart],
      paiements: [
        {
          id: `pay-${Date.now()}`,
          commandeId: orderId,
          modePaiement: paymentMode,
          montantCentimes: totalTtcCentimes,
          monnaieRendueCentimes: cashChangeCentimes,
          statut: 'VALIDE',
          datePaiementUtc: nowIso,
          auteurId: 'usr-caissier-1'
        }
      ]
    };

    // Deduction of ingredients
    const updatedIngredients = [...ingredients];
    cart.forEach(cartItem => {
      const prod = products.find(p => p.id === cartItem.productId);
      if (prod && prod.recetteDeBase) {
        prod.recetteDeBase.forEach(ri => {
          const ing = updatedIngredients.find(i => i.id === ri.ingredientId);
          if (ing) {
            ing.stockActuel = Math.max(0, ing.stockActuel - (ri.quantite * cartItem.quantite));
          }
        });
      }
    });
    onUpdateIngredients(updatedIngredients);

    // Sync Events (idempotent outbox)
    const eventOrder: SyncEvent = {
      id: `evt-${Date.now()}-1`,
      aggregateType: 'ORDER',
      aggregateId: orderId,
      eventType: 'ORDER_CREATED',
      payloadJson: JSON.stringify(newOrder),
      timestampUtc: nowIso,
      status: isOnline ? 'SYNCED' : 'PENDING',
      retryCount: 0,
      target: 'LOCAL_HUB'
    };

    const eventPayment: SyncEvent = {
      id: `evt-${Date.now()}-2`,
      aggregateType: 'PAYMENT',
      aggregateId: newOrder.paiements[0].id,
      eventType: 'PAYMENT_RECORDED',
      payloadJson: JSON.stringify(newOrder.paiements[0]),
      timestampUtc: nowIso,
      status: isOnline ? 'SYNCED' : 'PENDING',
      retryCount: 0,
      target: 'REMOTE_CLOUD'
    };

    // Audit Log
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      dateUtc: nowIso,
      action: 'VENTE_ENCAISSEE',
      utilisateurId: 'usr-caissier-1',
      utilisateurRole: 'CAISSIER',
      entiteType: 'COMMANDE',
      entiteId: orderId,
      details: `Vente ${reference} de ${formatCentimesToEuro(totalTtcCentimes)} via ${paymentMode}`
    };

    onNewOrderCreated(newOrder, [eventOrder, eventPayment], [audit]);

    // Reset UI
    setCart([]);
    setDiscountCentimes(0);
    setCustomerName('');
    setIsPaymentModalOpen(false);
    setCashGivenCentimes(0);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Visual Guide Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 text-xs text-slate-300 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Mode d&apos;Emploi du Simulateur : Comment ça marche ?
            </h2>
          </div>
          <span className="text-[11px] text-amber-300 font-semibold">
            POS = Caisse Enregistreuse • KDS = Écran Cuisine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] leading-relaxed">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-amber-400 block mb-1">1. Prise de commande (Caisse)</strong>
            Cliquez sur un produit (ex: <em>Burger Gourmet</em>), sélectionnez vos options (<em>Double Steak, Bacon</em>) et ajoutez au panier.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-emerald-400 block mb-1">2. Règlement & Monnaie</strong>
            Cliquez sur le bouton vert <strong>« Encaisser »</strong> dans la colonne de droite, puis choisissez <em>Espèces</em> ou <em>Carte Bancaire</em>.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-sky-400 block mb-1">3. Passez en Cuisine (KDS)</strong>
            Cliquez sur le sous-onglet <strong>« Écran Cuisine (KDS) »</strong> juste en-dessous pour voir le bon arriver avec son chronomètre !
          </div>
        </div>
      </div>

      {/* Sub-navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSubView('POS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subView === 'POS' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Caisse Tactile (POS)</span>
          </button>
          <button
            onClick={() => setSubView('KDS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subView === 'KDS' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Écran Cuisine (KDS)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-amber-400 border border-slate-700">
              {orders.filter(o => o.statut !== 'REMISE' && o.statut !== 'ANNULEE').length}
            </span>
          </button>
          <button
            onClick={() => setSubView('STOCKS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subView === 'STOCKS' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Stocks & Recettes</span>
          </button>
          <button
            onClick={() => setSubView('SYNC_OUTBOX')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subView === 'SYNC_OUTBOX' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>File Sync Outbox</span>
            {syncEvents.filter(e => e.status === 'PENDING').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-extrabold animate-pulse">
                {syncEvents.filter(e => e.status === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setSubView('AUDIT')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subView === 'AUDIT' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Audit & Sécurité</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Session Caisse #01 Ouverte</span>
        </div>
      </div>

      {/* VIEW 1: CAISSE TACTILE (POS) */}
      {subView === 'POS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Categories + Product Catalog */}
          <div className="lg:col-span-7 space-y-4">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                    selectedCategory === c.id
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {c.nom}
                </button>
              ))}
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products
                .filter(p => p.categorieId === selectedCategory)
                .map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="group bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold text-xs font-mono">
                        {formatCentimesToEuro(product.prixBaseCentimes)}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {product.nom}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Column: Ticket / Cart Summary */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">Commande en cours</h3>
                </div>
                {/* Order Type Toggle */}
                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-semibold">
                  <button
                    onClick={() => setOrderType('SUR_PLACE')}
                    className={`px-2 py-1 rounded ${orderType === 'SUR_PLACE' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    Sur Place
                  </button>
                  <button
                    onClick={() => setOrderType('A_EMPORTER')}
                    className={`px-2 py-1 rounded ${orderType === 'A_EMPORTER' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    À Emporter
                  </button>
                  <button
                    onClick={() => setOrderType('LIVRAISON')}
                    className={`px-2 py-1 rounded ${orderType === 'LIVRAISON' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    Livraison
                  </button>
                </div>
              </div>

              {/* Client Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Nom du client (optionnel pour l'appel)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-slate-800/80 max-h-64 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    Aucun article dans le panier. Touchez un produit à gauche pour l&apos;ajouter.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartItemId} className="py-2.5 flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{item.productNom}</span>
                          {item.variantNom && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                              {item.variantNom}
                            </span>
                          )}
                        </div>
                        {item.extras.length > 0 && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            + {item.extras.map(e => e.nom).join(', ')}
                          </div>
                        )}
                        {item.notePreparation && (
                          <div className="text-[10px] text-amber-400 italic mt-0.5">
                            Note : {item.notePreparation}
                          </div>
                        )}
                        <div className="text-xs font-mono text-slate-400 mt-0.5">
                          {formatCentimesToEuro(item.prixUnitaireCentimes)} x {item.quantite}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-white">{item.quantite}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-xs font-mono text-amber-300 min-w-[50px] text-right">
                          {formatCentimesToEuro(item.totalLigneCentimes)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart Bottom Summary */}
            <div className="border-t border-slate-800 pt-3 mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Sous-total HT (10%)</span>
                <span className="font-mono">{formatCentimesToEuro(totalHtCentimes)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>TVA collectée</span>
                <span className="font-mono">{formatCentimesToEuro(totalTvaCentimes)}</span>
              </div>
              {discountCentimes > 0 && (
                <div className="flex justify-between text-xs text-rose-400">
                  <span>Remise accordée</span>
                  <span className="font-mono">-{formatCentimesToEuro(discountCentimes)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white border-t border-slate-800/80 pt-2">
                <span>Total Net TTC</span>
                <span className="font-mono text-amber-400 text-lg">{formatCentimesToEuro(totalTtcCentimes)}</span>
              </div>

              {/* Actions row */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsSupervisorAuthOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors border border-slate-700"
                >
                  <Percent className="w-3.5 h-3.5 text-amber-400" />
                  <span>Remise</span>
                </button>
                <button
                  disabled={cart.length === 0}
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40 disabled:pointer-events-none"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Encaisser {formatCentimesToEuro(totalTtcCentimes)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ÉCRAN CUISINE (KDS) */}
      {subView === 'KDS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Kitchen Display System (KDS Cuisine)</h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Tri automatique chronologique FIFO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Ktor Local Hub : Connecté</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Colonne 1: Reçues */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
                <span>REÇUE EN CUISINE</span>
                <span>{orders.filter(o => o.statut === 'RECOLTEE').length}</span>
              </div>
              {orders.filter(o => o.statut === 'RECOLTEE').map(order => (
                <div key={order.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-amber-400">#{order.numeroCommandeJour}</span>
                    <span className="text-[11px] text-slate-400">{formatTimeAgo(order.dateCreationUtc)}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-semibold">{order.clientNom} • {order.typeCommande}</div>
                  <div className="border-t border-slate-800 pt-2 space-y-1">
                    {order.items.map(it => (
                      <div key={it.cartItemId} className="text-xs text-slate-200">
                        <span className="font-bold text-amber-300">{it.quantite}x</span> {it.productNom}
                        {it.notePreparation && (
                          <div className="text-[11px] text-rose-400 font-bold">⚠️ {it.notePreparation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onOrderStatusUpdated(order.id, 'EN_PREPARATION')}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Lancer préparation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Colonne 2: En Préparation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs">
                <span>EN PRÉPARATION</span>
                <span>{orders.filter(o => o.statut === 'EN_PREPARATION').length}</span>
              </div>
              {orders.filter(o => o.statut === 'EN_PREPARATION').map(order => (
                <div key={order.id} className="p-4 rounded-xl bg-slate-900 border border-blue-500/40 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-blue-400">#{order.numeroCommandeJour}</span>
                    <span className="text-[11px] text-slate-400">{formatTimeAgo(order.dateCreationUtc)}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-semibold">{order.clientNom} • {order.typeCommande}</div>
                  <div className="border-t border-slate-800 pt-2 space-y-1">
                    {order.items.map(it => (
                      <div key={it.cartItemId} className="text-xs text-slate-200">
                        <span className="font-bold text-blue-300">{it.quantite}x</span> {it.productNom}
                        {it.notePreparation && (
                          <div className="text-[11px] text-rose-400 font-bold">⚠️ {it.notePreparation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onOrderStatusUpdated(order.id, 'PRETE')}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Marquer Prête</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Colonne 3: Prêtes au comptoir */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                <span>PRÊTE AU COMPTOIR</span>
                <span>{orders.filter(o => o.statut === 'PRETE').length}</span>
              </div>
              {orders.filter(o => o.statut === 'PRETE').map(order => (
                <div key={order.id} className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-emerald-400">#{order.numeroCommandeJour}</span>
                    <span className="text-[11px] text-slate-400">{formatTimeAgo(order.dateCreationUtc)}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-semibold">{order.clientNom} • {order.typeCommande}</div>
                  <button
                    onClick={() => onOrderStatusUpdated(order.id, 'REMISE')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Remettre au client</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Colonne 4: Clôturées */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 text-slate-400 font-bold text-xs">
                <span>HISTORIQUE RÉCENT</span>
                <span>{orders.filter(o => o.statut === 'REMISE').length}</span>
              </div>
              {orders.filter(o => o.statut === 'REMISE').slice(0, 4).map(order => (
                <div key={order.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between font-mono">
                    <span>#{order.numeroCommandeJour} - {order.referenceUnique}</span>
                    <span className="text-emerald-400">Remise</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{order.clientNom} • {formatCentimesToEuro(order.totalTtcCentimes)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: GESTION DES STOCKS & RECETTES */}
      {subView === 'STOCKS' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Nomenclature des Ingrédients & Déstockage Automatique
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">
              Chaque burger ou extra vendu déduit instantanément et de façon immuable la quantité exacte d&apos;ingrédients en base SQLite Room.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {ingredients.map((ing) => {
                const isLow = ing.stockActuel <= ing.seuilAlerte;
                return (
                  <div 
                    key={ing.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      isLow ? 'bg-rose-950/20 border-rose-500/50' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-white">{ing.nom}</span>
                      {isLow && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                          Alerte Seuil
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-2xl font-black font-mono text-amber-400">
                        {ing.stockActuel}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{ing.unite}</span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                      <span>Seuil mini: {ing.seuilAlerte} {ing.unite}</span>
                      <span>Coût: {formatCentimesToEuro(ing.coutUnitaireCentimes)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: FILE DE SYNCHRONISATION OUTBOX */}
      {subView === 'SYNC_OUTBOX' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-amber-400" />
                  File d&apos;Attente Idempotente (`sync_outbox`)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enregistre chaque mutation pour rejeu résilient par WorkManager sans jamais dupliquer de montant ou de déstockage.
                </p>
              </div>
              <button
                disabled={!isOnline || syncEvents.filter(e => e.status === 'PENDING').length === 0}
                onClick={onSyncQueueProcessed}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Dépiler et Synchroniser la file</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3 pr-3">Event UUID</th>
                    <th className="pb-3 px-3">Agrégat</th>
                    <th className="pb-3 px-3">Type d&apos;Événement</th>
                    <th className="pb-3 px-3">Cible Transport</th>
                    <th className="pb-3 px-3">Statut Sync</th>
                    <th className="pb-3 pl-3">Payload Aperçu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {syncEvents.map((evt) => {
                    const badge = getStatusBadgeColor(evt.status);
                    return (
                      <tr key={evt.id} className="hover:bg-slate-850/50">
                        <td className="py-2.5 pr-3 text-amber-400">{evt.id}</td>
                        <td className="py-2.5 px-3 text-slate-300">{evt.aggregateType}</td>
                        <td className="py-2.5 px-3 text-blue-400 font-bold">{evt.eventType}</td>
                        <td className="py-2.5 px-3 text-slate-400">{evt.target}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {evt.status}
                          </span>
                        </td>
                        <td className="py-2.5 pl-3 text-slate-400 max-w-xs truncate font-sans text-[11px]">
                          {evt.payloadJson}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: JOURNAL D'AUDIT & SÉCURITÉ */}
      {subView === 'AUDIT' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Journal d&apos;Audit Inaltérable & Traçabilité Caissier</h3>
            </div>
            <p className="text-xs text-slate-400">
              Conformité fiscale et sécurité : chaque clôture, remise, annulation et encaissement est signé et stocké avec rôle et identifiant d&apos;opérateur.
            </p>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-400 font-mono">[{log.action}]</span>{' '}
                    <span className="text-slate-300">{log.details}</span>
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    {log.utilisateurRole} ({log.utilisateurId}) • {new Date(log.dateUtc).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: PRODUCT CUSTOMIZATION (Variantes & Extras) */}
      {activeProductForCustomization && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{activeProductForCustomization.nom}</h3>
                <p className="text-xs text-slate-400">{activeProductForCustomization.description}</p>
              </div>
              <button
                onClick={() => setActiveProductForCustomization(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Variantes selection */}
            {activeProductForCustomization.variantes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Choisir la Formule / Taille :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeProductForCustomization.variantes.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        selectedVariantId === v.id
                          ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs">{v.nom}</div>
                      <div className="text-xs font-mono text-amber-400 font-bold mt-1">
                        {formatCentimesToEuro(v.prixCentimes)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extras selection */}
            {activeProductForCustomization.extrasDisponibles.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Suppléments & Extras :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeProductForCustomization.extrasDisponibles.map(e => {
                    const isSelected = selectedExtras.includes(e.id);
                    return (
                      <button
                        key={e.id}
                        onClick={() => {
                          setSelectedExtras(prev =>
                            isSelected ? prev.filter(x => x !== e.id) : [...prev, e.id]
                          );
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-medium">{e.nom}</span>
                        <span className="text-xs font-mono text-amber-400">+{formatCentimesToEuro(e.prixCentimes)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Preparation Note */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Note de préparation cuisine :
              </label>
              <input
                type="text"
                placeholder="Ex: Sans oignons, bien cuit, sauce à part..."
                value={linePrepNote}
                onChange={(e) => setLinePrepNote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveProductForCustomization(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmAddToCart}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PAIEMENT & ENCAISSEMENT */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Enregistrement du Paiement</h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Montant Net à Payer</span>
              <div className="text-3xl font-black text-amber-400 font-mono">
                {formatCentimesToEuro(totalTtcCentimes)}
              </div>
            </div>

            {/* Mode selection */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMode('CARTE_BANCAIRE')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  paymentMode === 'CARTE_BANCAIRE'
                    ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span className="text-xs">Carte Bancaire</span>
              </button>
              <button
                onClick={() => setPaymentMode('ESPECES')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  paymentMode === 'ESPECES'
                    ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-400" />
                <span className="text-xs">Espèces</span>
              </button>
              <button
                onClick={() => setPaymentMode('TITRE_RESTAURANT')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  paymentMode === 'TITRE_RESTAURANT'
                    ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Ticket className="w-5 h-5 text-blue-400" />
                <span className="text-xs">Titre Resto</span>
              </button>
            </div>

            {/* Espèces calcul rendu de monnaie */}
            {paymentMode === 'ESPECES' && (
              <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Espèces reçues :</label>
                  <div className="flex gap-2">
                    {[1000, 2000, 5000].map(cents => (
                      <button
                        key={cents}
                        onClick={() => setCashGivenCentimes(cents)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white border border-slate-700"
                      >
                        {formatCentimesToEuro(cents)}
                      </button>
                    ))}
                    <button
                      onClick={() => setCashGivenCentimes(totalTtcCentimes)}
                      className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40"
                    >
                      Compte Exact
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Rendu de monnaie calculé :</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {formatCentimesToEuro(cashChangeCentimes)}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleCompleteOrder}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Valider la Vente & Émettre Ticket</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: SUPERVISOR PIN AUTH */}
      {isSupervisorAuthOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Autorisation Superviseur</h3>
            </div>
            <p className="text-xs text-slate-400">
              Une autorisation de rôle GESTIONNAIRE est requise pour accorder une remise en caisse. (Code démo : 1234)
            </p>
            <input
              type="password"
              placeholder="Code PIN à 4 chiffres"
              value={supervisorPin}
              onChange={(e) => setSupervisorPin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-center text-lg tracking-widest text-white font-mono focus:outline-none focus:border-amber-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsSupervisorAuthOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyDiscount}
                className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                Valider Remise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
