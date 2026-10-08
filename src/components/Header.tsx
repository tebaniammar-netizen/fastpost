import React from 'react';
import { 
  Layers, 
  Database, 
  FolderTree, 
  CheckCircle2, 
  Terminal, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  Smartphone,
  Flame,
  FileCode,
  FolderDown,
  Download,
  Globe,
  Settings
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  pendingSyncCount: number;
  onDirectDownloadZip?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
  setIsOnline,
  pendingSyncCount,
  onDirectDownloadZip
}) => {
  const tabs = [
    { id: 'showcase', label: '🌐 Site Vitrine Commercial (digabloPos)', icon: Globe, highlight: true },
    { id: 'simulator', label: '📱 SIMULATEUR TACTILE (Caisse & Cuisine)', icon: Smartphone, highlight: true },
    { id: 'settings', label: '⚙️ Paramètres Caisse & Matériel', icon: Settings, highlight: true },
    { id: 'guide', label: '📦 Télécharger le Projet (.ZIP)', icon: FolderDown, highlight: true },
    { id: 'architecture', label: '1. Architecture & Sync', icon: Layers },
    { id: 'database', label: '2. Schéma Room SQLite', icon: Database },
    { id: 'code', label: '3. Code Source Android', icon: FileCode },
    { id: 'tree', label: '4. Arborescence Modules', icon: FolderTree },
    { id: 'tests', label: '5. Plan de Tests & Qualité', icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-black text-xl">
              <Flame className="w-6 h-6 animate-pulse text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">FastFood POS</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Android Native
                </span>
                <span className="hidden md:inline-flex items-center text-xs text-slate-400">
                  <Smartphone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Kotlin + Compose + Room
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Système Point de Vente & Écosystème Hors-Ligne Prioritaire
              </p>
            </div>
          </div>

          {/* Network Simulator & State */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsOnline(!isOnline)}
              title="Cliquez pour simuler une coupure ou reprise de réseau"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isOnline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Réseau Hub/Cloud : Connecté</span>
                  <span className="sm:hidden">En ligne</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Réseau : Hors-ligne (Room Actif)</span>
                  <span className="sm:hidden">Hors-ligne</span>
                </>
              )}
            </button>

            {pendingSyncCount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                {pendingSyncCount} en attente
              </span>
            )}

            <div className="hidden lg:flex items-center text-xs text-slate-400 gap-1 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ACID SQLite 100%</span>
            </div>

            {onDirectDownloadZip && (
              <button
                onClick={onDirectDownloadZip}
                title="Télécharger l'archive ZIP complète du projet Android natif"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Télécharger ZIP</span>
                <span className="sm:hidden">ZIP</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-800/60 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : tab.highlight
                    ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : tab.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
