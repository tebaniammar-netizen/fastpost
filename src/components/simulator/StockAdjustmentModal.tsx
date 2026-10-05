import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Boxes, 
  DollarSign,
  Truck,
  RotateCcw
} from 'lucide-react';
import { Ingredient } from '../../types/pos';
import { formatCentimesToEuro } from '../../utils/formatters';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  onSave: (updated: Ingredient, motif: string) => void;
  onDelete?: (ingredientId: string) => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  ingredient,
  onSave,
  onDelete
}) => {
  const [stockActuel, setStockActuel] = useState<number>(0);
  const [seuilAlerte, setSeuilAlerte] = useState<number>(10);
  const [coutEuro, setCoutEuro] = useState<string>('0.50');
  const [motif, setMotif] = useState<'LIVRAISON' | 'INVENTAIRE' | 'PERTE'>('LIVRAISON');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (ingredient) {
      setStockActuel(ingredient.stockActuel);
      setSeuilAlerte(ingredient.seuilAlerte);
      setCoutEuro((ingredient.coutUnitaireCentimes / 100).toFixed(2));
      setMotif('LIVRAISON');
      setErrorMessage('');
    }
  }, [ingredient, isOpen]);

  if (!isOpen || !ingredient) return null;

  const handleQuickAdd = (amount: number) => {
    setStockActuel(prev => Math.max(0, prev + amount));
  };

  const handleSave = () => {
    const costNum = parseFloat(coutEuro);
    if (isNaN(costNum) || costNum < 0) {
      setErrorMessage('Veuillez saisir un coût unitaire valide.');
      return;
    }

    const updated: Ingredient = {
      ...ingredient,
      stockActuel: Math.max(0, stockActuel),
      seuilAlerte: Math.max(0, seuilAlerte),
      coutUnitaireCentimes: Math.round(costNum * 100)
    };

    let motifLabel = 'Réapprovisionnement fournisseur';
    if (motif === 'INVENTAIRE') motifLabel = 'Rectification inventaire manuel';
    if (motif === 'PERTE') motifLabel = 'Démarque inconnue / Perte';

    onSave(updated, motifLabel);
    onClose();
  };

  const diffFromInitial = stockActuel - ingredient.stockActuel;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                Ajuster le Stock • {ingredient.nom}
              </h3>
              <p className="text-xs text-slate-400">
                Gestion des Ingrédients • Décompte automatique en temps réel
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
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Current Stock & Quick Add Buttons */}
        <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Stock Actuel en Réserve :</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-amber-400">
                {stockActuel}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {ingredient.unite}
              </span>
              {diffFromInitial !== 0 && (
                <span className={`text-xs font-mono font-bold ml-2 ${diffFromInitial > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ({diffFromInitial > 0 ? `+${diffFromInitial}` : diffFromInitial})
                </span>
              )}
            </div>
          </div>

          {/* Quick Adjustment Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-850">
            <span className="text-[11px] text-slate-500 w-full sm:w-auto font-medium">Ajout rapide :</span>
            <button
              type="button"
              onClick={() => handleQuickAdd(10)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono transition-colors"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(50)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono transition-colors"
            >
              +50
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(100)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono transition-colors"
            >
              +100
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(500)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono transition-colors"
            >
              +500
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(-5)}
              className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono transition-colors ml-auto"
            >
              -5
            </button>
            <button
              type="button"
              onClick={() => setStockActuel(ingredient.stockActuel)}
              title="Réinitialiser"
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Manual Stock Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Nouveau Stock Précis ({ingredient.unite})
            </label>
            <input
              type="number"
              min="0"
              value={stockActuel}
              onChange={(e) => setStockActuel(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Alert Threshold */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Seuil d&apos;Alerte Rupture ({ingredient.unite})
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

        {/* Unit Cost & Reason */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Unit Cost */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              Coût Unitaire HT (€)
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

          {/* Reason / Motif */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Motif de l&apos;Ajustement
            </label>
            <select
              value={motif}
              onChange={(e) => setMotif(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="LIVRAISON">Livraison / Réception Fournisseur</option>
              <option value="INVENTAIRE">Régularisation d&apos;Inventaire</option>
              <option value="PERTE">Perte / Avarie / Casse</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Confirmez-vous la suppression de l'ingrédient "${ingredient.nom}" ?`)) {
                  onDelete(ingredient.id);
                  onClose();
                }
              }}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer l&apos;ingrédient</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer le Stock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
