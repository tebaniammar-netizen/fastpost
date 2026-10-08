import React, { useState } from 'react';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  Zap, 
  WifiOff, 
  Coins, 
  Smartphone,
  Layers,
  HelpCircle
} from 'lucide-react';
import { COMPETITOR_COMPARISONS, CompetitorComparison } from '../../data/digablo/comparisonsData';

interface ComparisonPageProps {
  onOpenLiveSimulator: () => void;
  setCurrentPage: (page: string) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  onOpenLiveSimulator,
  setCurrentPage
}) => {
  const [selectedComp, setSelectedComp] = useState<CompetitorComparison>(COMPETITOR_COMPARISONS[0]);

  return (
    <div className="py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Comparatif Transparent du Marché</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Comment FastFood POS se compare aux solutions traditionnelles ?
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Découvrez en toute franchise les différences réelles d’architecture, de coûts cachés, de dépendance cloud et de matériel entre notre système et le reste du marché.
        </p>
      </div>

      {/* Competitor Selector Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {COMPETITOR_COMPARISONS.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedComp(c)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedComp.id === c.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            FastFood POS vs {c.concurrentNom}
          </button>
        ))}
      </div>

      {/* Main Comparison Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Le Verdict Rapide
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              FastFood POS face à {selectedComp.concurrentNom}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {selectedComp.verdictCourt}
            </p>
          </div>

          <button
            onClick={onOpenLiveSimulator}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2 self-start lg:self-auto shrink-0"
          >
            <Smartphone className="w-4 h-4" />
            <span>Tester notre caisse en direct</span>
          </button>
        </div>

        {/* 3 Metrics comparison boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Prix Mensuel</div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400">FastFood POS :</span>
                <span className="text-lg font-black text-emerald-400 ml-1">0 € / mois</span>
              </div>
              <div>
                <span className="text-xs text-slate-400">{selectedComp.concurrentNom} :</span>
                <span className="text-sm font-semibold text-rose-400 ml-1">{selectedComp.prixConcurrent}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Commission Ventes</div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400">FastFood POS :</span>
                <span className="text-lg font-black text-emerald-400 ml-1">0%</span>
              </div>
              <div>
                <span className="text-xs text-slate-400">{selectedComp.concurrentNom} :</span>
                <span className="text-sm font-semibold text-rose-400 ml-1">{selectedComp.commissionConcurrent}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Hors-Ligne (Rush)</div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400">FastFood POS :</span>
                <span className="text-lg font-black text-emerald-400 ml-1">100% ACID</span>
              </div>
              <div>
                <span className="text-xs text-slate-400">{selectedComp.concurrentNom} :</span>
                <span className="text-sm font-semibold text-amber-400 ml-1">{selectedComp.modeHorsLigneConcurrent}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Criteria Table */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-white">Tableau comparatif critère par critère :</h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold">
                <tr>
                  <th className="p-4">Critère Clé</th>
                  <th className="p-4 text-emerald-400 bg-emerald-500/10">FastFood POS (Notre Solution)</th>
                  <th className="p-4 text-slate-300">{selectedComp.concurrentNom}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {selectedComp.tableauComparatif.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{row.critere}</td>
                    <td className="p-4 bg-emerald-500/5 font-bold text-emerald-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{row.digablo}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        {row.avantageDigablo ? (
                          <X className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <Check className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span>{row.concurrent}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pros and Cons Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Avantages décisifs de FastFood POS</span>
            </h4>
            <div className="space-y-2">
              {selectedComp.pointsFortsDigablo.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
            <h4 className="font-bold text-rose-300 text-sm flex items-center gap-2">
              <X className="w-4 h-4 text-rose-400" />
              <span>Limites constatées chez {selectedComp.concurrentNom}</span>
            </h4>
            <div className="space-y-2">
              {selectedComp.pointsFaiblesConcurrent.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
