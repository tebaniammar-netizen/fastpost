import React, { useState } from 'react';
import { 
  Receipt, 
  WifiOff, 
  Printer, 
  Tv, 
  Boxes, 
  ShieldCheck, 
  ChefHat, 
  Users, 
  BarChart3, 
  Coins, 
  Sparkles, 
  Check, 
  ArrowRight,
  Filter,
  Layers,
  Smartphone
} from 'lucide-react';
import { DIGABLO_FEATURES, DigabloFeature } from '../../data/digablo/featuresData';

interface FeaturesPageProps {
  onOpenLiveSimulator: () => void;
  setCurrentPage: (page: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  onOpenLiveSimulator,
  setCurrentPage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFeature, setSelectedFeature] = useState<DigabloFeature | null>(null);

  const categories = [
    { id: 'ALL', label: 'Toutes les fonctionnalités' },
    { id: 'VENTE', label: 'Encaissement & Vente' },
    { id: 'HARDWARE', label: 'Matériel & Périphériques' },
    { id: 'STOCK', label: 'Stocks & Recettes' },
    { id: 'SYNC', label: 'Hors-Ligne & Sync' },
    { id: 'EQUIPE', label: 'Équipe & Gestion' },
    { id: 'FISCALITE', label: 'Fiscalité & Rapports' },
  ];

  const filteredFeatures = selectedCategory === 'ALL'
    ? DIGABLO_FEATURES
    : DIGABLO_FEATURES.filter(f => f.categorie === selectedCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Receipt': return <Receipt className="w-6 h-6 text-amber-400" />;
      case 'WifiOff': return <WifiOff className="w-6 h-6 text-sky-400" />;
      case 'Printer': return <Printer className="w-6 h-6 text-emerald-400" />;
      case 'Tv': return <Tv className="w-6 h-6 text-purple-400" />;
      case 'Boxes': return <Boxes className="w-6 h-6 text-rose-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-indigo-400" />;
      case 'ChefHat': return <ChefHat className="w-6 h-6 text-amber-400" />;
      case 'Users': return <Users className="w-6 h-6 text-teal-400" />;
      case 'BarChart3': return <BarChart3 className="w-6 h-6 text-blue-400" />;
      case 'Coins': return <Coins className="w-6 h-6 text-amber-400" />;
      default: return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="py-8 sm:py-12 space-y-12">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Catalogue Complet des Fonctionnalités</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Tout ce dont votre commerce a besoin pour tourner à plein régime
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Pensé sur le terrain avec de vrais commerçants. Aucun gadget inutile, seulement des outils fiables, rapides et 100% opérationnels en situation de rush.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feat) => (
          <div
            key={feat.id}
            className="group relative bg-slate-900/80 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(feat.icone)}
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 uppercase tracking-wider">
                  {feat.categorie}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {feat.nom}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {feat.shortDesc}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                {feat.pointsForts.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800/60 flex items-center justify-between">
              <button
                onClick={() => setSelectedFeature(feat)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group/btn"
              >
                <span>Détails complets</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenLiveSimulator}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Tester dans le simulateur tactile"
              >
                <Smartphone className="w-3 h-3 text-amber-400" />
                <span>Tester</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-rose-500/10 rounded-2xl p-8 border border-amber-500/20 text-center space-y-4">
        <h3 className="text-2xl font-black text-white">Envie de voir tout cela en action ?</h3>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Testez le parcours réel en moins de 30 secondes : composez une commande burger/tacos, imprimez le ticket fiscal et observez le statut se mettre à jour sur l’écran TV déporté.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenLiveSimulator}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Lancer le simulateur tactile immédiat</span>
          </button>
          <button
            onClick={() => setCurrentPage('pricing')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
          >
            Voir les tarifs (Gratuit à vie)
          </button>
        </div>
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  {getIcon(selectedFeature.icone)}
                </div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 uppercase">
                    {selectedFeature.categorie}
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    {selectedFeature.nom}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <p className="leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {selectedFeature.fullDesc}
              </p>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                  Points forts & Garanties opérationnelles :
                </h4>
                <div className="space-y-2">
                  {selectedFeature.pointsForts.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedFeature(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setSelectedFeature(null);
                  onOpenLiveSimulator();
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Tester dans la caisse</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
