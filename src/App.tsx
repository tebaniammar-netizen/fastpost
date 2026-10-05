/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ArchitectureTab } from './components/tabs/ArchitectureTab';
import { DatabaseSchemaTab } from './components/tabs/DatabaseSchemaTab';
import { ProjectTreeTab } from './components/tabs/ProjectTreeTab';
import { TestPlanTab } from './components/tabs/TestPlanTab';
import { InteractiveSimulatorTab } from './components/tabs/InteractiveSimulatorTab';
import { CodeExplorerTab } from './components/tabs/CodeExplorerTab';
import { DownloadAndTestGuideTab } from './components/tabs/DownloadAndTestGuideTab';
import { CustomerDisplayScreen } from './components/simulator/CustomerDisplayScreen';
import { downloadAndroidProjectZip } from './utils/downloadProjectZip';
import { ANDROID_FILES_TO_EXPORT } from './data/androidSourceFiles';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_INGREDIENTS, 
  INITIAL_ORDERS,
  INITIAL_CASH_SESSION
} from './data/mockData';
import { OrderEntity, Ingredient, SyncEvent, AuditLog, OrderStatus, Product, Category } from './types/pos';
import { CheckCircle2, Terminal, Code2, Rocket, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('simulator');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Check if standalone secondary screen mode (TV mode) is requested in URL
  const [isStandaloneTv, setIsStandaloneTv] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.location.search.includes('display=tv') || 
           window.location.search.includes('mode=customer') ||
           window.location.hash.includes('customer-display');
  });

  // Live state for interactive simulator
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [orders, setOrders] = useState<OrderEntity[]>(INITIAL_ORDERS);

  // Broadcast inter-window channel (instant synchronization between POS on screen 1 and TV on screen 2)
  const broadcastOrders = (updatedOrders: OrderEntity[]) => {
    try {
      const channel = new BroadcastChannel('fastfood_orders_bus');
      channel.postMessage({ type: 'ORDERS_UPDATED', orders: updatedOrders });
      channel.close();
    } catch {}
    try {
      localStorage.setItem('fastfood_live_orders', JSON.stringify(updatedOrders));
    } catch {}
  };

  useEffect(() => {
    // Read cached orders if present
    try {
      const cached = localStorage.getItem('fastfood_live_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
        }
      }
    } catch {}

    // Listen to inter-tab / inter-window broadcast
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('fastfood_orders_bus');
      channel.onmessage = (event) => {
        if (event.data?.type === 'ORDERS_UPDATED' && Array.isArray(event.data.orders)) {
          setOrders(event.data.orders);
        }
      };
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'fastfood_live_orders' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      channel?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddCategory = (newCat: Category) => {
    setCategories(prev => [...prev, newCat]);
  };

  const handleAddIngredient = (newIng: Ingredient) => {
    setIngredients(prev => [...prev, newIng]);
  };

  const handleUpdateIngredient = (updated: Ingredient) => {
    setIngredients(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const handleDeleteIngredient = (ingredientId: string) => {
    setIngredients(prev => prev.filter(i => i.id !== ingredientId));
  };
  
  // Initial sync queue events
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([
    {
      id: 'evt-init-01',
      aggregateType: 'ORDER',
      aggregateId: 'cmd-001',
      eventType: 'ORDER_CREATED',
      payloadJson: '{"referenceUnique":"CMD-20261002-C01-041","totalTtcCentimes":2370}',
      timestampUtc: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      status: 'SYNCED',
      retryCount: 0,
      target: 'LOCAL_HUB'
    },
    {
      id: 'evt-init-02',
      aggregateType: 'PAYMENT',
      aggregateId: 'pay-001',
      eventType: 'PAYMENT_RECORDED',
      payloadJson: '{"mode":"CARTE_BANCAIRE","montantCentimes":2370}',
      timestampUtc: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
      status: 'SYNCED',
      retryCount: 0,
      target: 'REMOTE_CLOUD'
    }
  ]);

  // Initial audit log
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'aud-001',
      dateUtc: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      action: 'OUVERTURE_CAISSE',
      utilisateurId: 'usr-caissier-1',
      utilisateurRole: 'CAISSIER',
      entiteType: 'SESSION_CAISSE',
      entiteId: INITIAL_CASH_SESSION.id,
      details: 'Ouverture avec fond de caisse initial de 150.00 €'
    },
    {
      id: 'aud-002',
      dateUtc: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
      action: 'VENTE_ENCAISSEE',
      utilisateurId: 'usr-caissier-1',
      utilisateurRole: 'CAISSIER',
      entiteType: 'COMMANDE',
      entiteId: 'cmd-001',
      details: 'Commande CMD-20261002-C01-041 de 23.70 € encaissée par CB'
    }
  ]);

  const pendingSyncCount = syncEvents.filter(e => e.status === 'PENDING').length;

  const handleNewOrderCreated = (newOrder: OrderEntity, newEvents: SyncEvent[], newAudit: AuditLog[]) => {
    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    setSyncEvents([...newEvents, ...syncEvents]);
    setAuditLogs([...newAudit, ...auditLogs]);
    broadcastOrders(nextOrders);
  };

  const handleOrderStatusUpdated = (orderId: string, newStatus: OrderStatus) => {
    const nextOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, statut: newStatus };
      }
      return o;
    });
    setOrders(nextOrders);
    broadcastOrders(nextOrders);

    const statusEvt: SyncEvent = {
      id: `evt-${Date.now()}-status`,
      aggregateType: 'ORDER',
      aggregateId: orderId,
      eventType: 'ORDER_STATUS_CHANGED',
      payloadJson: JSON.stringify({ orderId, newStatus }),
      timestampUtc: new Date().toISOString(),
      status: isOnline ? 'SYNCED' : 'PENDING',
      retryCount: 0,
      target: 'LOCAL_HUB'
    };
    setSyncEvents([statusEvt, ...syncEvents]);
  };

  const handleSyncQueueProcessed = () => {
    setSyncEvents(prev => prev.map(e => ({
      ...e,
      status: 'SYNCED',
      retryCount: e.status === 'PENDING' ? e.retryCount + 1 : e.retryCount
    })));
  };

  // If running in Standalone Secondary Screen Mode (TV / Moniteur Déporté)
  if (isStandaloneTv) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans selection:bg-amber-500 selection:text-slate-950">
        <CustomerDisplayScreen
          orders={orders}
          onOrderStatusUpdated={handleOrderStatusUpdated}
          isStandalone={true}
          onExitStandalone={() => {
            window.location.search = '';
            setIsStandaloneTv(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        pendingSyncCount={pendingSyncCount}
        onDirectDownloadZip={() => downloadAndroidProjectZip(ANDROID_FILES_TO_EXPORT)}
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4">
        {activeTab === 'architecture' && <ArchitectureTab />}
        {activeTab === 'database' && <DatabaseSchemaTab />}
        {activeTab === 'code' && <CodeExplorerTab />}
        {activeTab === 'tree' && <ProjectTreeTab />}
        {activeTab === 'tests' && <TestPlanTab />}
        {activeTab === 'guide' && (
          <DownloadAndTestGuideTab
            onGoToSimulator={() => setActiveTab('simulator')}
            onGoToCodeExplorer={() => setActiveTab('code')}
          />
        )}
        {activeTab === 'simulator' && (
          <InteractiveSimulatorTab
            categories={categories}
            products={products}
            ingredients={ingredients}
            orders={orders}
            syncEvents={syncEvents}
            auditLogs={auditLogs}
            isOnline={isOnline}
            onNewOrderCreated={handleNewOrderCreated}
            onOrderStatusUpdated={handleOrderStatusUpdated}
            onSyncQueueProcessed={handleSyncQueueProcessed}
            onUpdateIngredients={setIngredients}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            onAddIngredient={handleAddIngredient}
            onUpdateIngredient={handleUpdateIngredient}
            onDeleteIngredient={handleDeleteIngredient}
          />
        )}
      </main>

      {/* Phase Roadmap Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">État du Système FastFood :</span>
            <span className="text-emerald-300 font-bold">100% Finalisé & Prêt pour Production (Étapes 1 à 11 Complètes)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Étape 1-2 : Architecture & Room OK
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Étape 3 : Caisse Tactile OK
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Étape 4 : Ventes & Arrondis OK
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Étape 5 : Sessions & Rapport Z OK
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Étape 6 : Cuisine KDS OK
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Étape 7 : Stocks & Alertes OK
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Étape 8 : Sync & Outbox OK
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Étape 9 : ESC/POS & Tiroir OK
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Étape 10 : NF525 & SHA-256 OK
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Étape 11 : Tests E2E & Documentation OK
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
