import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  HelpCircle, 
  ChevronDown, 
  Calculator, 
  Smartphone, 
  TrendingDown,
  Coins
} from 'lucide-react';
import { FREE_PLAN, OPTIONAL_MODULES, PRICING_FAQ } from '../../data/digablo/pricingData';

interface PricingPageProps {
  onOpenLiveSimulator: () => void;
  setCurrentPage: (page: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onOpenLiveSimulator,
  setCurrentPage
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(15000); // 15,000 € / month
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  // Competitor commission rate (typically 1.75% for SumUp/Square or 79€/mo + transaction fee)
  const sumUpCommission = monthlyRevenue * 0.0175;
  const standardPosCostYear = (79 * 12) + (sumUpCommission * 12);
  const digabloCostYear = 0; // 0€ per year on free plan
  const yearlySavings = Math.round(standardPosCostYear - digabloCostYear);

  const toggleModule = (id: string) => {
    setSelectedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const totalOptionalMonthly = selectedModules.reduce((sum, modId) => {
    const mod = OPTIONAL_MODULES.find(m => m.id === modId);
    return sum + (mod ? mod.prixMensuel : 0);
  }, 0);

  return (
    <div className="py-8 sm:py-12 space-y-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Coins className="w-3.5 h-3.5" />
          <span>Tarification 100% Transparente</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          0 € par mois. 0 % de commission. Pas de frais cachés.
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Pourquoi payer 80 € à 150 € par mois pour une caisse qui bloque quand le Wi-Fi saute ? Avec FastFood POS, commencez gratuitement et ne payez que si vous grossissez.
        </p>
      </div>

      {/* Free Plan Card + Addons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Plan Card (Free Plan) */}
        <div className="lg:col-span-2 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border-2 border-amber-500/50 p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-rose-600 text-slate-950 font-black text-xs uppercase px-6 py-1.5 rounded-bl-2xl shadow-md">
            Formule Recommandée
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {FREE_PLAN.badge}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                0 €
              </span>
              <span className="text-slate-400 font-semibold text-lg">
                / mois à vie
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {FREE_PLAN.description}
            </p>
          </div>

          {/* Included Features Grid */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Inclus sans restriction :
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FREE_PLAN.pointsInclus.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onOpenLiveSimulator}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Tester la caisse immédiatement (Sans inscription)</span>
            </button>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Pas de carte de crédit requise
            </span>
          </div>
        </div>

        {/* Optional Add-on Modules */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Modules Optionnels</h3>
            <p className="text-xs text-slate-400">
              Activez uniquement ce dont vous avez besoin, résiliable sans préavis.
            </p>
          </div>

          <div className="space-y-3">
            {OPTIONAL_MODULES.map((mod) => {
              const isChecked = selectedModules.includes(mod.id);
              return (
                <div
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{mod.nom}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">{mod.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-amber-400 text-sm">
                        +{mod.prixMensuel} €
                      </div>
                      <div className="text-[10px] text-slate-500">{mod.unite}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedModules.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Total modules :</span>
              <span className="text-lg font-black text-amber-400">{totalOptionalMonthly} € / mois</span>
            </div>
          )}
        </div>
      </div>

      {/* ROI & Savings Calculator vs Traditional POS */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 rounded-3xl border border-amber-500/20 p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulateur d’Économies Réelles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Combien perdez-vous chaque mois en commissions et abonnements ?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Faites glisser votre chiffre d’affaires mensuel estimé :
          </p>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Chiffre d’affaires mensuel :</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{monthlyRevenue.toLocaleString('fr-FR')} €</span>
          </div>
          <input
            type="range"
            min="3000"
            max="60000"
            step="1000"
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>3 000 €</span>
            <span>25 000 €</span>
            <span>60 000 €</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400">Coût annuel moyen avec autre caisse</div>
            <div className="text-2xl font-black text-rose-400 mt-1">
              ~ {Math.round(standardPosCostYear).toLocaleString('fr-FR')} € / an
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Abonnement + com. carte (1.75%)</div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400">Coût annuel avec FastFood POS</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              0 € / an
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Sans commission ni abonnement</div>
          </div>

          <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/30">
            <div className="text-xs text-amber-300 font-semibold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              Économies nettes dans votre poche
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
              + {yearlySavings.toLocaleString('fr-FR')} € / an
            </div>
            <div className="text-[11px] text-amber-300/80 mt-1">De marge brute préservée</div>
          </div>
        </div>
      </div>

      {/* Pricing FAQ */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Questions Fréquentes sur les Tarifs
          </h2>
          <p className="text-slate-400 text-sm">
            Toutes les réponses pour choisir en toute sérénité.
          </p>
        </div>

        <div className="space-y-3">
          {PRICING_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-amber-400 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {faq.reponse}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
