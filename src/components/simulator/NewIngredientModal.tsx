import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Layers, 
  DollarSign, 
  AlertCircle, 
  Check 
} from 'lucide-react';
import { Ingredient } from '../../types/pos';

interface NewIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newIngredient: Ingredient) => void;
}

export const NewIngredientModal: React.FC<NewIngredientModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [nom, setNom] = useState('');
  const [unite, setUnite] = useState<'piece' | 'g' | 'ml'>('piece');
  const [stockInitial, setStockInitial] = useState<number>(100);
  const [seuilAlerte, setSeuilAlerte] = useState<number>(20);
  const [coutEuro, setCoutEuro] = useState<string>('0.50');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!nom.trim()) {
      setErrorMessage('Le nom de l\'ingrédient est obligatoire.');
      return;
    }

    const costNum = parseFloat(coutEuro);
    if (isNaN(costNum) || costNum < 0) {
      setErrorMessage('Veuillez saisir un coût unitaire valide.');
      return;
    }

    const newIng: Ingredient = {
      id: `ing-${Date.now()}`,
      nom: nom.trim(),
      unite,
      stockActuel: Math.max(0, stockInitial),
      seuilAlerte: Math.max(1, seuilAlerte),
      coutUnitaireCentimes: Math.round(costNum * 100)
    };

    onAdd(newIng);
    // Reset form
    setNom('');
    setStockInitial(100);
    setSeuilAlerte(20);
    setCoutEuro('0.50');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                Nouvel Ingrédient de Réserve
              </h3>
              <p className="text-xs text-slate-400">
                Suivi précis des stocks et décompte automatique
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Ingredient Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Nom de l&apos;Ingrédient <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Tortillas de blé 30cm, Sauce Algérienne..."
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Unit selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Unité de Mesure
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUnite('piece')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  unite === 'piece'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Pièces (unités)
              </button>
              <button
                type="button"
                onClick={() => setUnite('g')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  unite === 'g'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Grammes (g)
              </button>
              <button
                type="button"
                onClick={() => setUnite('ml')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  unite === 'ml'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Millilitres (ml)
              </button>
            </div>
          </div>

          {/* Initial Stock & Alert Threshold */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Stock Initial ({unite})
              </label>
              <input
                type="number"
                min="0"
                value={stockInitial}
                onChange={(e) => setStockInitial(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Seuil Alerte Mini
              </label>
              <input
                type="number"
                min="1"
                value={seuilAlerte}
                onChange={(e) => setSeuilAlerte(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Cost */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              Coût Unitaire Moyen HT (€)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={coutEuro}
                onChange={(e) => setCoutEuro(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-8 py-2.5 text-xs font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Ajouter l&apos;Ingrédient</span>
          </button>
        </div>
      </div>
    </div>
  );
};
