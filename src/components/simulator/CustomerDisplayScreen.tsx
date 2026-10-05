import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  Search, 
  Bell, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Utensils,
  ExternalLink,
  Copy,
  Check,
  Monitor,
  Cast,
  ArrowLeft,
  X
} from 'lucide-react';
import { OrderEntity, OrderStatus } from '../../types/pos';
import { formatCentimesToEuro, formatTimeAgo } from '../../utils/formatters';

interface CustomerDisplayScreenProps {
  orders: OrderEntity[];
  onOrderStatusUpdated?: (orderId: string, newStatus: OrderStatus) => void;
  isStandalone?: boolean;
  onExitStandalone?: () => void;
}

export const CustomerDisplayScreen: React.FC<CustomerDisplayScreenProps> = ({
  orders,
  onOrderStatusUpdated,
  isStandalone = false,
  onExitStandalone
}) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTicket, setSearchTicket] = useState('');
  const [lastReadyOrderNumber, setLastReadyOrderNumber] = useState<number | null>(null);
  const [isPopoutModalOpen, setIsPopoutModalOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);

  // Standalone TV URL computation
  const getStandaloneUrl = () => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    return `${base}?display=tv`;
  };

  const handleOpenStandaloneWindow = () => {
    const url = getStandaloneUrl();
    window.open(url, 'FastFoodCustomerTV', 'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no');
    setIsPopoutModalOpen(false);
  };

  const handleCopyUrl = () => {
    const url = getStandaloneUrl();
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Audio Chime using Web Audio API (Synthesizes a pleasant fast-food pickup ding-dong)
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Note 1: High tone (E5 ~ 659 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.6);

      // Note 2: Lower tone (C5 ~ 523 Hz) slightly delayed
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, ctx.currentTime + 0.25);
      gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Detect when a new order becomes ready to play sound & flash
  const prevReadyIdsRef = useRef<string[]>([]);
  useEffect(() => {
    const currentReadyOrders = orders.filter(o => o.statut === 'PRETE');
    const currentReadyIds = currentReadyOrders.map(o => o.id);
    
    // Check if there is any new ready order
    const newlyReady = currentReadyOrders.find(o => !prevReadyIdsRef.current.includes(o.id));
    if (newlyReady && prevReadyIdsRef.current.length > 0) {
      setLastReadyOrderNumber(newlyReady.numeroCommandeJour);
      playChime();
    }
    prevReadyIdsRef.current = currentReadyIds;
  }, [orders, soundEnabled]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      screenRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Filter orders by status
  const inPreparationOrders = orders.filter(o => o.statut === 'EN_PREPARATION' || o.statut === 'RECOLTEE');
  const readyOrders = orders.filter(o => o.statut === 'PRETE');
  const recentDeliveredOrders = orders.filter(o => o.statut === 'REMISE').slice(0, 6);

  // Search single order for customer tracking bar
  const searchedOrder = searchTicket.trim() 
    ? orders.find(o => 
        o.numeroCommandeJour.toString() === searchTicket.trim() ||
        o.referenceUnique.toLowerCase().includes(searchTicket.trim().toLowerCase()) ||
        (o.clientNom && o.clientNom.toLowerCase().includes(searchTicket.trim().toLowerCase()))
      )
    : null;

  return (
    <div 
      ref={screenRef} 
      className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}
    >
      {/* Top Banner / TV Display Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Tv className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ÉCRAN D&apos;APPEL CLIENTS
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                Comptoir de Retrait
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Affichage haute visibilité pour salle de restaurant • Notification sonore carillon
            </p>
          </div>
        </div>

        {/* Time, Sound Toggle, Popout & Fullscreen */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Standalone status indicator */}
          {isStandalone ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Écran Déporté Autonome</span>
              <span className="sm:hidden">Déporté TV</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsPopoutModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>DÉPORTER SUR 2ÈME ÉCRAN / TV</span>
            </button>
          )}

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-sm shadow-inner flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentTime}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playChime();
            }}
            title={soundEnabled ? 'Désactiver le carillon sonore' : 'Activer le carillon sonore'}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={playChime}
            title="Tester le carillon audio de restaurant"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Tester Son</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Quitter le mode plein écran' : 'Mode Plein Écran pour TV'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isStandalone && onExitStandalone && (
            <button
              type="button"
              onClick={onExitStandalone}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Retour Caisse</span>
            </button>
          )}
        </div>
      </div>

      {/* Flashing Alert Banner when a new order is ready */}
      {lastReadyOrderNumber && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-emerald-500/20 to-emerald-500/30 border-2 border-emerald-500 text-center animate-pulse shadow-lg shadow-emerald-500/10">
          <div className="flex items-center justify-center gap-2 text-white font-black text-lg sm:text-xl">
            <Bell className="w-6 h-6 text-amber-400 animate-bounce" />
            <span>COMMANDE <span className="font-mono text-amber-300 text-2xl">#{lastReadyOrderNumber}</span> PRÊTE AU COMPTOIR !</span>
          </div>
        </div>
      )}

      {/* Main Dual-Column Display Screen (In Prep vs Ready) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COLUMN 1: EN PRÉPARATION (Orange / Ambre) */}
        <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    EN PRÉPARATION
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold">
                    Vos plats sont en cours de cuisson
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-black font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {inPreparationOrders.length}
              </span>
            </div>

            {/* List of Numbers In Prep */}
            <div className="mt-6">
              {inPreparationOrders.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <Utensils className="w-10 h-10 mx-auto text-slate-700" />
                  <p className="text-sm font-semibold">Toutes les commandes sont prêtes !</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {inPreparationOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-105"
                    >
                      <span className="text-4xl sm:text-5xl font-black font-mono text-amber-400 tracking-tight">
                        #{order.numeroCommandeJour}
                      </span>
                      {order.clientNom && (
                        <span className="text-xs text-slate-300 font-bold mt-1 truncate max-w-full">
                          {order.clientNom}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">
                        {order.typeCommande === 'SUR_PLACE' ? 'Sur place' : 'À emporter'}
                      </span>

                      {/* Quick Advance Button for Simulator Demo */}
                      {onOrderStatusUpdated && (
                        <button
                          type="button"
                          onClick={() => onOrderStatusUpdated(order.id, 'PRETE')}
                          className="mt-2.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition-all"
                        >
                          Passer à Prêt 🛎️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            Merci de patienter jusqu&apos;à l&apos;appel de votre numéro
          </div>
        </div>

        {/* COLUMN 2: PRÊT À RETIRER (Vert Émeraude - Grande Visibilité) */}
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-400 tracking-wide flex items-center gap-2">
                    <span>PRÊT À RETIRER</span>
                    <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                  </h3>
                  <p className="text-xs text-emerald-300 font-semibold">
                    Présentez votre ticket au comptoir
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-black font-mono bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20">
                {readyOrders.length}
              </span>
            </div>

            {/* List of Numbers Ready */}
            <div className="mt-6">
              {readyOrders.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <Bell className="w-10 h-10 mx-auto text-slate-700" />
                  <p className="text-sm font-semibold">Aucune commande en attente de retrait</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {readyOrders.map((order) => {
                    const isNewest = order.numeroCommandeJour === lastReadyOrderNumber;
                    return (
                      <div
                        key={order.id}
                        className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl transition-all relative overflow-hidden ${
                          isNewest
                            ? 'bg-emerald-950/60 border-2 border-emerald-400 scale-105 shadow-emerald-500/20 ring-4 ring-emerald-500/20'
                            : 'bg-slate-950 border border-emerald-500/40'
                        }`}
                      >
                        {isNewest && (
                          <span className="absolute top-1 px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 animate-pulse">
                            Appel
                          </span>
                        )}
                        <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight mt-1">
                          #{order.numeroCommandeJour}
                        </span>
                        {order.clientNom && (
                          <span className="text-xs text-white font-bold mt-1 truncate max-w-full">
                            {order.clientNom}
                          </span>
                        )}
                        <span className="text-[10px] text-emerald-300/80 mt-1 uppercase font-semibold">
                          Comptoir Retrait
                        </span>

                        {/* Quick Delivered Button for Simulator Demo */}
                        {onOrderStatusUpdated && (
                          <button
                            type="button"
                            onClick={() => onOrderStatusUpdated(order.id, 'REMISE')}
                            className="mt-2.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-all"
                          >
                            Remise effectuée ✓
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-emerald-400 font-semibold">
            🛎️ Présentez votre numéro au comptoir avec votre ticket de caisse
          </div>
        </div>
      </div>

      {/* Customer Ticket Self-Service Tracker */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Vous avez un ticket ? Suivez votre commande en direct
              </h4>
              <p className="text-xs text-slate-400">
                Saisissez votre numéro de commande pour visualiser son étape de préparation
              </p>
            </div>
          </div>

          {/* Quick Ticket Input */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: 41 ou 42..."
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-36 sm:w-44"
              />
              {searchTicket && (
                <button
                  onClick={() => setSearchTicket('')}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Searched Order Progress Display */}
        {searchedOrder ? (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono text-amber-400">
                  #{searchedOrder.numeroCommandeJour}
                </span>
                <div>
                  <div className="text-sm font-bold text-white">
                    {searchedOrder.clientNom || 'Client'} • {searchedOrder.typeCommande === 'SUR_PLACE' ? 'Sur place' : 'À emporter'}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Réf: {searchedOrder.referenceUnique} • Total: {formatCentimesToEuro(searchedOrder.totalTtcCentimes)}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {searchedOrder.statut === 'PRETE' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 animate-pulse">
                    🛎️ Votre commande est prête ! Rendez-vous au comptoir
                  </span>
                )}
                {searchedOrder.statut === 'EN_PREPARATION' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ⏳ En cours de préparation en cuisine
                  </span>
                )}
                {searchedOrder.statut === 'REMISE' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                    ✅ Commande déjà remise • Bon appétit !
                  </span>
                )}
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[
                { label: 'Payée & Validée', active: true },
                { label: 'En cuisine', active: searchedOrder.statut === 'EN_PREPARATION' || searchedOrder.statut === 'PRETE' || searchedOrder.statut === 'REMISE' },
                { label: 'Prête au comptoir', active: searchedOrder.statut === 'PRETE' || searchedOrder.statut === 'REMISE' },
                { label: 'Remise au client', active: searchedOrder.statut === 'REMISE' },
              ].map((step, idx) => (
                <div key={idx} className="space-y-1.5 text-center">
                  <div className={`h-2 rounded-full transition-all ${step.active ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                  <div className={`text-[11px] font-bold ${step.active ? 'text-white' : 'text-slate-500'}`}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Items List */}
            <div className="pt-3 border-t border-slate-900 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-slate-400 text-[11px]">Contenu de votre plateau :</div>
              <div className="flex flex-wrap gap-2">
                {searchedOrder.items.map((item) => (
                  <span key={item.cartItemId} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <span className="font-bold text-amber-400">{item.quantite}x</span> {item.productNom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : searchTicket ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
            Aucune commande trouvée avec le numéro &quot;{searchTicket}&quot;.
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>💡 <strong>Astuce :</strong> Tapez le numéro d&apos;une commande existante (ex: 41) pour tester le suivi client interactif.</span>
            <div className="flex gap-1.5">
              {orders.slice(0, 3).map(o => (
                <button
                  key={o.id}
                  onClick={() => setSearchTicket(o.numeroCommandeJour.toString())}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono font-bold text-xs"
                >
                  #{o.numeroCommandeJour}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Delivered Orders Marquee */}
      {recentDeliveredOrders.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
            Commandes récemment servies :
          </span>
          <div className="flex items-center gap-3">
            {recentDeliveredOrders.map(o => (
              <span key={o.id} className="font-mono text-slate-400 line-through">
                #{o.numeroCommandeJour}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: DEPORT ONTO SECONDARY SCREEN / TV */}
      {isPopoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Déporter sur un 2ème Écran ou TV
                  </h3>
                  <p className="text-xs text-slate-400">
                    Affichage autonome dédié pour comptoir et salle de restaurant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPopoutModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Button */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-950 to-slate-950 border border-amber-500/30 text-center space-y-3">
              <div className="text-xs text-amber-300 font-semibold">
                Vous avez un 2ème écran branché en HDMI / DisplayPort / USB-C ?
              </div>
              <button
                type="button"
                onClick={handleOpenStandaloneWindow}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Ouvrir la Fenêtre Déportée Immédiatement</span>
              </button>
              <p className="text-[11px] text-slate-400">
                Ouvre une fenêtre épurée sans barre de menu, prête à être glissée sur votre 2ème moniteur.
              </p>
            </div>

            {/* Direct URL for Smart TV or Tablet */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Cast className="w-4 h-4 text-amber-400" />
                <span>URL directe pour Smart TV ou Tablette autonome :</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={getStandaloneUrl()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    copiedUrl
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
            </div>

            {/* Step by step guide */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Comment ça fonctionne en restaurant :</span>
              </div>
              <ul className="space-y-2 text-slate-400 text-[11px] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>Ouvrez la fenêtre déportée et glissez-la sur votre moniteur client ou téléviseur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>Appuyez sur la touche <strong>F11</strong> de votre clavier pour passer en plein écran total.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span>Gardez votre caisse ouverte : la synchronisation inter-fenêtres est <strong>100% en direct</strong>. Dès qu&apos;une commande passe à prête, la TV sonne et l&apos;affiche !</span>
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsPopoutModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
