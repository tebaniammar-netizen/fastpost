import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  Tag, 
  Layers, 
  Percent, 
  Check, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Product, Category, Ingredient, RecipeItem, ProductVariant, ProductExtra } from '../../types/pos';
import { formatCentimesToEuro } from '../../utils/formatters';

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  onDelete?: (productId: string) => void;
  editingProduct: Product | null;
  categories: Category[];
  ingredients: Ingredient[];
  onOpenNewCategoryModal: () => void;
}

const PRESET_IMAGES = [
  { label: 'Burger Gourmet', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', emoji: '🍔' },
  { label: 'Tacos / Wrap', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', emoji: '🌯' },
  { label: 'Frites & Sides', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80', emoji: '🍟' },
  { label: 'Poulet Pané / Nuggets', url: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80', emoji: '🍗' },
  { label: 'Boisson Fraîche', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', emoji: '🥤' },
  { label: 'Dessert & Glace', url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80', emoji: '🍦' },
  { label: 'Pizza & Focaccia', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', emoji: '🍕' },
  { label: 'Salade Fraîcheur', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', emoji: '🥗' },
  { label: 'Café & Chaud', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', emoji: '☕' },
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingProduct,
  categories,
  ingredients,
  onOpenNewCategoryModal
}) => {
  const [nom, setNom] = useState('');
  const [categorieId, setCategorieId] = useState(categories[0]?.id || 'cat-1');
  const [description, setDescription] = useState('');
  const [prixTtcEuro, setPrixTtcEuro] = useState('8.50');
  const [tvaTaux, setTvaTaux] = useState<number>(10.0);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [disponible, setDisponible] = useState(true);
  
  // Recipe items: array of { ingredientId, quantite }
  const [recipe, setRecipe] = useState<RecipeItem[]>([]);
  
  // Simple variants (e.g. Solo vs Menu XL)
  const [variantes, setVariantes] = useState<ProductVariant[]>([]);
  const [newVariantNom, setNewVariantNom] = useState('');
  const [newVariantPrixEuro, setNewVariantPrixEuro] = useState('');

  // Extras
  const [extras, setExtras] = useState<ProductExtra[]>([]);
  const [newExtraNom, setNewExtraNom] = useState('');
  const [newExtraPrixEuro, setNewExtraPrixEuro] = useState('');

  // Tab inside modal
  const [activeTab, setActiveTab] = useState<'INFO' | 'RECETTE' | 'OPTIONS'>('INFO');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setNom(editingProduct.nom);
      setCategorieId(editingProduct.categorieId);
      setDescription(editingProduct.description);
      setPrixTtcEuro((editingProduct.prixBaseCentimes / 100).toFixed(2));
      setTvaTaux(editingProduct.tvaTauxPourcent);
      setImageUrl(editingProduct.imageUrl);
      setDisponible(editingProduct.disponible);
      setRecipe(editingProduct.recetteDeBase ? [...editingProduct.recetteDeBase] : []);
      setVariantes(editingProduct.variantes ? [...editingProduct.variantes] : []);
      setExtras(editingProduct.extrasDisponibles ? [...editingProduct.extrasDisponibles] : []);
    } else {
      setNom('');
      setCategorieId(categories[0]?.id || 'cat-1');
      setDescription('');
      setPrixTtcEuro('8.50');
      setTvaTaux(10.0);
      setImageUrl(PRESET_IMAGES[0].url);
      setDisponible(true);
      setRecipe([]);
      setVariantes([]);
      setExtras([]);
    }
    setErrorMessage('');
    setActiveTab('INFO');
  }, [editingProduct, isOpen, categories]);

  if (!isOpen) return null;

  const handleToggleRecipeIngredient = (ingredientId: string) => {
    setRecipe(prev => {
      const exists = prev.find(r => r.ingredientId === ingredientId);
      if (exists) {
        return prev.filter(r => r.ingredientId !== ingredientId);
      } else {
        return [...prev, { ingredientId, quantite: 1 }];
      }
    });
  };

  const handleUpdateRecipeQuantity = (ingredientId: string, delta: number) => {
    setRecipe(prev => prev.map(r => {
      if (r.ingredientId === ingredientId) {
        const nextQty = Math.max(1, r.quantite + delta);
        return { ...r, quantite: nextQty };
      }
      return r;
    }));
  };

  const handleAddVariant = () => {
    if (!newVariantNom.trim()) return;
    const priceNum = parseFloat(newVariantPrixEuro);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const newV: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      nom: newVariantNom.trim(),
      prixCentimes: Math.round(priceNum * 100)
    };
    setVariantes(prev => [...prev, newV]);
    setNewVariantNom('');
    setNewVariantPrixEuro('');
  };

  const handleRemoveVariant = (id: string) => {
    setVariantes(prev => prev.filter(v => v.id !== id));
  };

  const handleAddExtra = () => {
    if (!newExtraNom.trim()) return;
    const priceNum = parseFloat(newExtraPrixEuro);
    if (isNaN(priceNum) || priceNum < 0) return;

    const newE: ProductExtra = {
      id: `ext-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      nom: newExtraNom.trim(),
      prixCentimes: Math.round(priceNum * 100)
    };
    setExtras(prev => [...prev, newE]);
    setNewExtraNom('');
    setNewExtraPrixEuro('');
  };

  const handleRemoveExtra = (id: string) => {
    setExtras(prev => prev.filter(e => e.id !== id));
  };

  const handleSave = () => {
    if (!nom.trim()) {
      setErrorMessage('Le nom du produit est obligatoire.');
      setActiveTab('INFO');
      return;
    }

    const priceNum = parseFloat(prixTtcEuro);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage('Veuillez saisir un prix valide supérieur à 0 €.');
      setActiveTab('INFO');
      return;
    }

    const finalProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      nom: nom.trim(),
      categorieId,
      description: description.trim() || 'Produit frais préparé à la commande.',
      prixBaseCentimes: Math.round(priceNum * 100),
      tvaTauxPourcent: tvaTaux,
      imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
      disponible,
      recetteDeBase: recipe,
      variantes: variantes,
      extrasDisponibles: extras
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-5 shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
              </h3>
              <p className="text-xs text-slate-400">
                Catalogue Restaurant • Visible en Caisse et Déstocké en Cuisine
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

        {/* Tab selection */}
        <div className="flex border-b border-slate-800 text-xs font-bold gap-2">
          <button
            onClick={() => setActiveTab('INFO')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'INFO'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Informations & Prix
          </button>
          <button
            onClick={() => setActiveTab('RECETTE')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'RECETTE'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Recette & Stocks
            {recipe.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
                {recipe.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('OPTIONS')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'OPTIONS'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Variantes & Extras
            {(variantes.length > 0 || extras.length > 0) && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-amber-400 border border-slate-700">
                {variantes.length + extras.length}
              </span>
            )}
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: INFO & PRICING */}
        {activeTab === 'INFO' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Nom du Produit <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Double Cheese Smash, Tacos Maxi..."
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Catégorie Caisse <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={onOpenNewCategoryModal}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3 h-3" /> Nouvelle
                  </button>
                </div>
                <select
                  value={categorieId}
                  onChange={(e) => setCategorieId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & TVA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  Prix de Vente TTC (€) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    placeholder="8.50"
                    value={prixTtcEuro}
                    onChange={(e) => setPrixTtcEuro(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-3.5 pr-8 py-2.5 text-xs font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-blue-400" />
                  Taux de TVA Applicable
                </label>
                <select
                  value={tvaTaux}
                  onChange={(e) => setTvaTaux(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value={10.0}>10.0 % (Restauration immédiate / Sur place)</option>
                  <option value={5.5}>5.5 % (À emporter / Produits scellés)</option>
                  <option value={20.0}>20.0 % (Boissons alcoolisées / Taux standard)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Description / Ingrédients visibles
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Deux steaks smashés, cheddar affiné, sauce maison, salade fraîche..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Image Selection Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Illustration Visuelle</span>
                <span className="text-[11px] text-slate-500 font-normal">Cliquez pour choisir un visuel</span>
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {PRESET_IMAGES.map((preset, idx) => {
                  const isSelected = imageUrl === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-white font-bold shadow-md shadow-amber-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xl">{preset.emoji}</span>
                      <span className="text-[10px] truncate max-w-full">{preset.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Image URL input */}
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Ou collez une URL d'image personnalisée (https://...)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Disponible à la vente en Caisse</div>
                <div className="text-[11px] text-slate-400">Désactiver si rupture temporaire de service</div>
              </div>
              <button
                type="button"
                onClick={() => setDisponible(!disponible)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  disponible ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    disponible ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: RECIPE & INGREDIENT DEDUCTION */}
        {activeTab === 'RECETTE' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <span className="font-bold">Déstockage Automatique :</span> À chaque encaissement de ce produit, les ingrédients sélectionnés ci-dessous seront automatiquement décomptés du stock SQLite !
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Sélectionnez les ingrédients composant ce produit :
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ingredients.map((ing) => {
                  const recipeItem = recipe.find(r => r.ingredientId === ing.id);
                  const isIncluded = !!recipeItem;

                  return (
                    <div
                      key={ing.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isIncluded
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleRecipeIngredient(ing.id)}
                        className="flex items-center gap-2 flex-1 text-left"
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                          isIncluded ? 'bg-amber-500 border-amber-500 text-slate-950 font-black' : 'border-slate-700'
                        }`}>
                          {isIncluded && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{ing.nom}</div>
                          <div className="text-[10px] text-slate-400">Stock: {ing.stockActuel} {ing.unite}</div>
                        </div>
                      </button>

                      {isIncluded && recipeItem && (
                        <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                          <button
                            type="button"
                            onClick={() => handleUpdateRecipeQuantity(ing.id, -1)}
                            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-bold text-amber-400 min-w-8 text-center">
                            {recipeItem.quantite} {ing.unite === 'piece' ? 'pce' : ing.unite}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateRecipeQuantity(ing.id, 1)}
                            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VARIANTS & EXTRAS */}
        {activeTab === 'OPTIONS' && (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {/* Variants */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Variantes / Formats (Optionnel)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Ex: Solo (8.90 €), Menu Normal (11.50 €), Menu XL (13.00 €)
                </p>
              </div>

              {/* Add Variant Form */}
              <div className="flex gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="text"
                  placeholder="Nom (ex: Menu XL)"
                  value={newVariantNom}
                  onChange={(e) => setNewVariantNom(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <input
                  type="number"
                  step="0.10"
                  placeholder="Prix € (ex: 12.50)"
                  value={newVariantPrixEuro}
                  onChange={(e) => setNewVariantPrixEuro(e.target.value)}
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>

              {/* List of existing variants */}
              {variantes.length > 0 && (
                <div className="space-y-1.5">
                  {variantes.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                    >
                      <span className="font-semibold text-white">{v.nom}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-amber-400 font-bold">
                          {formatCentimesToEuro(v.prixCentimes)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(v.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Extras */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Suppléments & Extras Proposés
                </h4>
                <p className="text-[11px] text-slate-400">
                  Ex: Extra Cheddar (+1.20 €), Double Bacon (+1.80 €)
                </p>
              </div>

              {/* Add Extra Form */}
              <div className="flex gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="text"
                  placeholder="Nom (ex: Sauce Fromagère)"
                  value={newExtraNom}
                  onChange={(e) => setNewExtraNom(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <input
                  type="number"
                  step="0.10"
                  placeholder="Prix € (ex: 1.00)"
                  value={newExtraPrixEuro}
                  onChange={(e) => setNewExtraPrixEuro(e.target.value)}
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddExtra}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>

              {/* List of existing extras */}
              {extras.length > 0 && (
                <div className="space-y-1.5">
                  {extras.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                    >
                      <span className="font-semibold text-white">{e.nom}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-amber-400 font-bold">
                          +{formatCentimesToEuro(e.prixCentimes)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExtra(e.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          {editingProduct && onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Confirmez-vous la suppression définitive du produit "${editingProduct.nom}" ?`)) {
                  onDelete(editingProduct.id);
                  onClose();
                }
              }}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer le produit</span>
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
              <span>{editingProduct ? 'Enregistrer les modifications' : 'Créer et ajouter au catalogue'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
