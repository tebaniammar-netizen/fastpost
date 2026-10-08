import React, { useState } from 'react';
import { 
  Flame, 
  UtensilsCrossed, 
  Pizza, 
  Coffee, 
  Truck, 
  Store, 
  ArrowRight, 
  Check, 
  Star, 
  Quote, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { DIGABLO_USE_CASES, DigabloUseCase } from '../../data/digablo/useCasesData';

interface UseCasesPageProps {
  onOpenLiveSimulator: () => void;
  setCurrentPage: (page: string) => void;
}

export const UseCasesPage: React.FC<UseCasesPageProps> = ({
  onOpenLiveSimulator,
  setCurrentPage
}) => {
  const [activeUseCase, setActiveUseCase] = useState<DigabloUseCase>(DIGABLO_USE_CASES[0]);

  const getUseCaseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-rose-400" />;
      case 'Pizza': return <Pizza className="w-5 h-5 text-orange-400" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-amber-500" />;
      case 'Truck': return <Truck className="w-5 h-5 text-sky-400" />;
      case 'Store': return <Store className="w-5 h-5 text-emerald-400" />;
      default: return <Flame className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Store className="w-3.5 h-3.5" />
          <span>Adapté à votre Métier</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Une caisse optimisée pour votre rythme de travail
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Que vous teniez un fast-food avec 120 commandes à l’heure, un restaurant avec plan de salle ou un food truck nomade sans Wi-Fi, FastFood POS s’adapte à votre réalité.
        </p>
      </div>

      {/* Sector Selector Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DIGABLO_USE_CASES.map((uc) => (
          <button
            key={uc.id}
            onClick={() => setActiveUseCase(uc)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeUseCase.id === uc.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {getUseCaseIcon(uc.icone)}
            <span>{uc.nomCourt}</span>
          </button>
        ))}
      </div>

      {/* Main Focus Card for the Selected Sector */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider inline-block">
              {activeUseCase.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {activeUseCase.titre}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {activeUseCase.accroche}
            </p>
          </div>

          <button
            onClick={onOpenLiveSimulator}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2 self-start lg:self-auto shrink-0"
          >
            <Smartphone className="w-4 h-4" />
            <span>Tester en direct pour {activeUseCase.nomCourt}</span>
          </button>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {activeUseCase.metriques.map((m, idx) => (
            <div key={idx} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                {m.valeur}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Two-column details: Features & Merchant Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Fonctionnalités indispensables pour {activeUseCase.nomCourt}</span>
            </h3>
            <div className="space-y-3">
              {activeUseCase.fonctionnalitesCles.map((f, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-200 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 p-6 rounded-2xl border border-amber-500/20">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Quote className="w-6 h-6" />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
                « {activeUseCase.citationCommercant.texte} »
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">
                  {activeUseCase.citationCommercant.nom}
                </div>
                <div className="text-xs text-amber-400/90 font-medium">
                  {activeUseCase.citationCommercant.commerce}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-400">
                Avis Vérifié
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of all other sectors */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Tous les secteurs couverts :</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIGABLO_USE_CASES.map((uc) => (
            <div
              key={uc.id}
              onClick={() => setActiveUseCase(uc)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeUseCase.id === uc.id
                  ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  {getUseCaseIcon(uc.icone)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{uc.nomCourt}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{uc.badge}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
