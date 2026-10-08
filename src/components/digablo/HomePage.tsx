import React, { useState } from 'react';
import { 
  Flame, 
  ShieldCheck, 
  WifiOff, 
  MessageCircle, 
  ArrowRight, 
  CheckCircle2, 
  Receipt, 
  Tv, 
  ChefHat, 
  Boxes, 
  Coins, 
  Users, 
  Lock, 
  Zap, 
  Sparkles, 
  Download, 
  ChevronRight, 
  HelpCircle,
  Clock,
  Printer,
  ShoppingBag,
  Store,
  Truck,
  Coffee,
  UtensilsCrossed,
  Layers
} from 'lucide-react';
import { DIGABLO_FEATURES } from '../../data/digablo/featuresData';
import { DIGABLO_USE_CASES } from '../../data/digablo/useCasesData';
import { FREE_PLAN, PRICING_FAQ } from '../../data/digablo/pricingData';
import { COMPETITOR_COMPARISONS } from '../../data/digablo/comparisonsData';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  onOpenLiveSimulator: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  onOpenLiveSimulator
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Conçu pour tourner tous les jours • Rush garanti</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              La caisse qui tient le rush et garde vos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400">
                comptes en règle
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Sans internet, avec toute votre équipe, et un ticket conforme à chaque vente. Vos données restent exportables quand vous voulez.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300 pt-2">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Conforme fiscalement</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <WifiOff className="w-4 h-4 text-amber-400" />
                <span>Marche 100% sans internet</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <MessageCircle className="w-4 h-4 text-sky-400" />
                <span>Un humain répond sur WhatsApp</span>
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={onOpenLiveSimulator}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>Tester la Caisse en Direct</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage('download')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Télécharger l&apos;Application ($0 à vie)</span>
              </button>
            </div>
          </div>

          {/* Interactive Feature Preview Teaser Banner */}
          <div className="mt-12 max-w-5xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">&lt; 5s</div>
                <div className="text-xs text-slate-400 font-semibold mt-1">Encaissement moyen</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">0 %</div>
                <div className="text-xs text-slate-400 font-semibold mt-1">Commission sur vos ventes</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="text-2xl sm:text-3xl font-black font-mono text-sky-400">100 %</div>
                <div className="text-xs text-slate-400 font-semibold mt-1">Hors-ligne sans internet</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400">0 €</div>
                <div className="text-xs text-slate-400 font-semibold mt-1">Matériel obligatoire</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LES 3 CHOSES QU'ON NE RATE JAMAIS (Les 3 Piliers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Ce qui compte quand c&apos;est votre argent
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trois choses qu&apos;on ne rate jamais
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pilier 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Vos comptes en règle, sans y penser
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chaque vente est enregistrée dans les règles. Le rapport Z de clôture et le ticket conforme sont générés tout seuls, prêts pour votre comptable ou un contrôle.
              </p>
            </div>
            <ul className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rapport Z de clôture journalière</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ticket conforme et QR Code fiscal</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Historique inaltérable chaîné</span>
              </li>
            </ul>
          </div>

          {/* Pilier 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                La connexion tombe, vous continuez
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Coupure internet un samedi soir, box qui rame : la caisse encaisse quand même. Tout se resynchronise dès que le réseau revient, sans une vente perdue.
              </p>
            </div>
            <ul className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Encaissement 100% hors-ligne</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Synchro automatique au retour réseau</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Aucune vente ni ticket perdu</span>
              </li>
            </ul>
          </div>

          {/* Pilier 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Qui a fait quoi, vous le savez
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chaque employé a son code PIN et ses droits. Annulation, remise, remboursement : tout est tracé, nommé, daté. Plus de trou dans la caisse sans explication.
              </p>
            </div>
            <ul className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Code PIN individuel 4 chiffres</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Autorisation manager pour remises</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Journal d&apos;audit infalsifiable</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. SECTEURS D'ACTIVITÉ PHARE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Adapté à votre métier
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Des fonctionnalités taillées pour chaque secteur
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('use-cases')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Voir tous les secteurs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIGABLO_USE_CASES.slice(0, 6).map((uc) => (
            <div
              key={uc.id}
              onClick={() => setCurrentPage('use-cases')}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-[11px] font-bold border border-amber-500/20">
                    {uc.nomCourt}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {uc.titre}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {uc.accroche}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-emerald-400">
                  {uc.metriques[0].valeur}
                </span>
                <span className="text-[11px] text-slate-500">
                  {uc.metriques[0].label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPARATIF RAPIDE AVEC LES AUTRES SOLUTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Comparatif transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pourquoi les commerçants choisissent digabloPos
            </h2>
            <p className="text-xs text-slate-400">
              Face à Loyverse, SumUp ou Square, comparez ce qui compte vraiment sur un an d&apos;exercice.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="pb-4 pr-4">Critère clé</th>
                  <th className="pb-4 px-4 text-amber-400 font-extrabold text-sm">digabloPos</th>
                  <th className="pb-4 px-4 text-slate-300">Loyverse</th>
                  <th className="pb-4 px-4 text-slate-300">SumUp Caisse</th>
                  <th className="pb-4 pl-4 text-slate-300">Square</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Prix logiciel de base</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">0 $ / mois à vie</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">0 $ / mois</td>
                  <td className="py-3.5 px-4 text-rose-400 font-mono">Dès 39 € / mois</td>
                  <td className="py-3.5 pl-4 text-slate-400 font-mono">0 € / mois</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Commission par carte</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">0 % (aucune)</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">0 % (passerelle tierce)</td>
                  <td className="py-3.5 px-4 text-rose-400 font-mono font-bold">1,75 % par vente</td>
                  <td className="py-3.5 pl-4 text-rose-400 font-mono font-bold">1,65 % par vente</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Mode hors-ligne</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">Complet (ACID SQLite)</td>
                  <td className="py-3.5 px-4 text-amber-400">Partiel (ventes simples)</td>
                  <td className="py-3.5 px-4 text-rose-400">Limité au cache court</td>
                  <td className="py-3.5 pl-4 text-amber-400">24 heures maximum</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Écran client d&apos;appel déporté</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">Inclus avec sonnerie TV</td>
                  <td className="py-3.5 px-4 text-slate-400">Application séparée payante</td>
                  <td className="py-3.5 px-4 text-slate-400">Option payante</td>
                  <td className="py-3.5 pl-4 text-slate-400">Matériel Square dédié</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Support multi-devises (FCFA, EUR...)</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">Inclus en natif</td>
                  <td className="py-3.5 px-4 text-rose-400">1 seule devise</td>
                  <td className="py-3.5 px-4 text-rose-400">1 seule devise</td>
                  <td className="py-3.5 pl-4 text-rose-400">1 seule devise</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setCurrentPage('compare')}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Voir le comparatif complet détaillé</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. TARIFS SIMPLES & PLAN GRATUIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Zéro engagement, zéro surprise
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tarifs simples et transparents
          </h2>
          <p className="text-xs text-slate-400">
            Commencez gratuitement avec toutes les fonctionnalités essentielles. Ajoutez des modules uniquement si vous grandissez.
          </p>
        </div>

        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wider shadow-md">
            Plan Gratuit à Vie
          </span>

          <div className="text-center space-y-2 pt-2 pb-6 border-b border-slate-800">
            <div className="text-5xl font-black font-mono text-white">
              0 $ <span className="text-lg font-normal text-slate-400">/ mois</span>
            </div>
            <p className="text-xs text-slate-400">
              Commandes illimitées • Aucun frais de transaction • 0% de commission
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6">
            {FREE_PLAN.pointsInclus.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentPage('download')}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm text-center shadow-lg shadow-amber-500/20 transition-all active:scale-98"
            >
              Créer mon compte gratuit
            </button>
            <button
              onClick={() => setCurrentPage('pricing')}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 text-center"
            >
              Voir les modules optionnels
            </button>
          </div>
        </div>
      </section>

      {/* 6. FAQ DE RÉASSURANCE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Questions Fréquentes
          </h2>
          <p className="text-xs text-slate-400">
            Tout ce que vous devez savoir avant de lancer votre service avec digabloPos.
          </p>
        </div>

        <div className="space-y-3">
          {PRICING_FAQ.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <span className={`text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. CTA FINAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 p-8 sm:p-12 text-center text-slate-950 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Essayez sur votre prochain service
            </h2>
            <p className="text-xs sm:text-sm font-medium text-amber-100 max-w-xl mx-auto">
              Rejoignez des milliers de commerçants, restaurants et food trucks qui encaissent sans stress et sans commission.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenLiveSimulator}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Tester la caisse en direct</span>
              </button>
              <button
                onClick={() => setCurrentPage('download')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-lg transition-transform active:scale-95"
              >
                Télécharger l&apos;application
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
