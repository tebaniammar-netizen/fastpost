import React, { useState } from 'react';
import { 
  Flame, 
  Menu, 
  X, 
  ChevronDown, 
  Download, 
  Tablet, 
  Layers, 
  Receipt, 
  Tv, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenLiveSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  onOpenLiveSimulator
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'features', label: 'Fonctionnalités' },
    { id: 'use-cases', label: 'Secteurs' },
    { id: 'pricing', label: 'Tarifs' },
    { id: 'compare', label: 'Comparatif' },
    { id: 'download', label: 'Télécharger' },
    { id: 'blog', label: 'Blog & Guides' },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  digablo<span className="text-amber-400">Pos</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Gratuit à vie
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Caisse Enregistreuse Hors-Ligne & Conforme
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Live POS Simulator Direct Access Button */}
            <button
              type="button"
              onClick={onOpenLiveSimulator}
              title="Tester la caisse enregistreuse tactile, la cuisine et l'écran TV en direct"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all hover:scale-105 shadow-md shadow-amber-500/5 cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>📱 Ouvrir la Caisse (Démo)</span>
            </button>

            {/* Start Free CTA Button */}
            <button
              type="button"
              onClick={() => handleNavClick('download')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <span>Commencer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center sm:hidden gap-2">
            <button
              type="button"
              onClick={onOpenLiveSimulator}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold"
            >
              📱 Caisse
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-5 space-y-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                  currentPage === link.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenLiveSimulator();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>📱 Ouvrir la Caisse Tactile Directe</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('download')}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Commencer Gratuitement ($0 à vie)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
