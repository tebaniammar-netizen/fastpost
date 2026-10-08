import React from 'react';
import { 
  Flame, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  Lock,
  Tv,
  Receipt
} from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  onOpenLiveSimulator: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentPage,
  onOpenLiveSimulator
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Brand & Identity */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white font-black shadow-md shadow-amber-500/20">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                digablo<span className="text-amber-400">Pos</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              La caisse enregistreuse moderne qui tient le rush et garde vos comptes en règle. 100% hors-ligne, multi-devises et sans aucune commission sur vos ventes.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Conforme NF525 & 2026</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-[11px]">
                0% Commission
              </span>
            </div>
          </div>

          {/* Column 2: Produit & Modules */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Produit
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setCurrentPage('features')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Fonctionnalités POS
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('pricing')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Tarifs & Plan Gratuit
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('compare')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Comparatifs Logiciels
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('download')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Télécharger l&apos;App
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenLiveSimulator} 
                  className="text-amber-400 hover:underline font-bold text-left flex items-center gap-1"
                >
                  <span>📱 Simulateur Tactile Direct</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Secteurs d'activité */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Secteurs
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage('use-cases')} className="hover:text-amber-400 transition-colors text-left">
                  Fast-Food & Burger
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('use-cases')} className="hover:text-amber-400 transition-colors text-left">
                  Restaurants & Brasseries
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('use-cases')} className="hover:text-amber-400 transition-colors text-left">
                  Bars, Cafés & Lounge
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('use-cases')} className="hover:text-amber-400 transition-colors text-left">
                  Food Trucks & Éphémères
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('use-cases')} className="hover:text-amber-400 transition-colors text-left">
                  Épiceries & Supérettes
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('use-cases')} className="hover:text-amber-400 transition-colors text-left">
                  Boulangeries & Pâtisseries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Ressources & Légal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Ressources
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage('blog')} className="hover:text-amber-400 transition-colors text-left">
                  Blog & Guides Métier
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('blog')} className="hover:text-amber-400 transition-colors text-left">
                  Facture Électronique 2026
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('compare')} className="hover:text-amber-400 transition-colors text-left">
                  vs Loyverse
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('compare')} className="hover:text-amber-400 transition-colors text-left">
                  vs SumUp Caisse
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('compare')} className="hover:text-amber-400 transition-colors text-left">
                  vs Square
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with legal & copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} digabloPos. Tous droits réservés. Système de caisse autonome certifié hors-ligne.
          </div>
          <div className="flex items-center gap-4">
            <span>Chiffrement AES & SHA-256</span>
            <span>•</span>
            <span>Conformité Fiscale NF525</span>
            <span>•</span>
            <span>0% Commission Bancaire</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
