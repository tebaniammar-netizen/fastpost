import React, { useState } from 'react';
import { 
  Building2, 
  Printer, 
  Tv, 
  Coins, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Download, 
  Upload, 
  Receipt, 
  SlidersHorizontal,
  Wifi,
  Radio,
  FileText
} from 'lucide-react';
import { PosSettings, DEFAULT_POS_SETTINGS } from '../../types/pos';

interface SettingsViewProps {
  settings: PosSettings;
  onUpdateSettings: (newSettings: PosSettings) => void;
  onResetSettings: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings
}) => {
  const [currentTab, setCurrentTab] = useState<'STORE' | 'HARDWARE' | 'DISPLAY' | 'FINANCE' | 'SECURITY' | 'DATA'>('STORE');
  const [formData, setFormData] = useState<PosSettings>({ ...settings });
  const [showPin, setShowPin] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [drawerTestOpen, setDrawerTestOpen] = useState(false);
  const [testPrintSuccess, setTestPrintSuccess] = useState(false);

  const handleChange = <K extends keyof PosSettings>(key: K, value: PosSettings[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Sound chime test using Web Audio API
  const playTestChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Bell 1: high tone (880Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Bell 2: deeper chime (587.33Hz - D5)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(587.33, now + 0.25);
      gain2.gain.setValueAtTime(0.25, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.25);
      osc2.stop(now + 1.2);
    } catch {}
  };

  const handleTestCashDrawer = () => {
    setDrawerTestOpen(true);
    playTestChime();
    setTimeout(() => setDrawerTestOpen(false), 3000);
  };

  const handleTestPrinter = () => {
    setTestPrintSuccess(true);
    setTimeout(() => setTestPrintSuccess(false), 3500);
  };

  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `fastfood_pos_config_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6">
      {/* Title & Global Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Paramètres & Configuration de la Caisse
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personnalisez vos coordonnées commerciales, vos imprimantes thermiques, vos devises et vos codes de sécurité.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onResetSettings}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            title="Réinitialiser aux valeurs d'usine"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Valeurs d&apos;usine</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les Paramètres</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Paramètres enregistrés avec succès ! Toutes les modifications sont actives immédiatement sur la caisse, l&apos;écran TV et les tickets.</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setCurrentTab('STORE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            currentTab === 'STORE'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Établissement & Tickets</span>
        </button>

        <button
          onClick={() => setCurrentTab('HARDWARE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            currentTab === 'HARDWARE'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>2. Imprimantes & Tiroir</span>
        </button>

        <button
          onClick={() => setCurrentTab('DISPLAY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            currentTab === 'DISPLAY'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>3. Écran TV & Carillon</span>
        </button>

        <button
          onClick={() => setCurrentTab('FINANCE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            currentTab === 'FINANCE'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>4. Devises & TVA</span>
        </button>

        <button
          onClick={() => setCurrentTab('SECURITY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            currentTab === 'SECURITY'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>5. Code PIN & Sécurité</span>
        </button>

        <button
          onClick={() => setCurrentTab('DATA')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            currentTab === 'DATA'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>6. Sauvegarde & Données</span>
        </button>
      </div>

      {/* CONTENT TAB 1: ÉTABLISSEMENT */}
      {currentTab === 'STORE' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Identité Commerciale & Mentions du Ticket</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ces informations apparaissent sur tous les tickets imprimés, les factures et les rapports Z fiscaux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Nom du Restaurant / Commerce</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={e => handleChange('storeName', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                placeholder="Ex: FastFood Gourmet"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Téléphone du Point de Vente</label>
              <input
                type="text"
                value={formData.storePhone}
                onChange={e => handleChange('storePhone', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                placeholder="Ex: +33 1 42 68 00 00"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Adresse Complète</label>
              <input
                type="text"
                value={formData.storeAddress}
                onChange={e => handleChange('storeAddress', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                placeholder="Ex: 12 Rue de la République, 75001 Paris"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Numéro SIRET</label>
              <input
                type="text"
                value={formData.storeSiret}
                onChange={e => handleChange('storeSiret', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                placeholder="Ex: 849 201 928 00014"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Numéro TVA Intracommunautaire</label>
              <input
                type="text"
                value={formData.storeTvaNumber}
                onChange={e => handleChange('storeTvaNumber', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                placeholder="Ex: FR 32 849201928"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Message d&apos;accueil (Haut de ticket)</label>
              <input
                type="text"
                value={formData.receiptHeaderMessage}
                onChange={e => handleChange('receiptHeaderMessage', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                placeholder="Ex: Bienvenue au FastFood Gourmet !"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Message de remerciement (Bas de ticket)</label>
              <input
                type="text"
                value={formData.receiptFooterMessage}
                onChange={e => handleChange('receiptFooterMessage', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                placeholder="Ex: Merci pour votre confiance. À très bientôt !"
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTENT TAB 2: HARDWARE & IMPRESSION */}
      {currentTab === 'HARDWARE' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-amber-400" />
              <span>Imprimantes Thermiques ESC/POS & Tiroir-Caisse</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configuration universelle compatible Epson, Munbyn, Star Micronics, Sunmi, Xprinter (Bluetooth, LAN ou USB).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Type de Connexion Imprimante</label>
              <div className="grid grid-cols-3 gap-2">
                {(['NETWORK_WIFI', 'BLUETOOTH', 'USB'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('printerType', type)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      formData.printerType === type
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {type === 'NETWORK_WIFI' ? 'Wi-Fi / LAN' : type === 'BLUETOOTH' ? 'Bluetooth' : 'USB'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Largeur du Rouleau Papier</label>
              <div className="grid grid-cols-2 gap-2">
                {([80, 58] as const).map(width => (
                  <button
                    key={width}
                    type="button"
                    onClick={() => handleChange('paperWidthMm', width)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      formData.paperWidthMm === width
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {width} mm standard
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Adresse IP & Port (Imprimante Réseau)</label>
              <input
                type="text"
                value={formData.printerIpAddress}
                onChange={e => handleChange('printerIpAddress', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                placeholder="192.168.1.100:9100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Nombre d&apos;exemplaires par ticket</label>
              <select
                value={formData.numberOfReceiptCopies}
                onChange={e => handleChange('numberOfReceiptCopies', Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
              >
                <option value={1}>1 exemplaire (Client uniquement)</option>
                <option value={2}>2 exemplaires (Client + Double commerçant)</option>
              </select>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-white block">Impression automatique du ticket client</span>
                <span className="text-xs text-slate-400">Lance automatiquement l&apos;impression dès validation de l&apos;encaissement.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.autoPrintReceiptOnPayment}
                onChange={e => handleChange('autoPrintReceiptOnPayment', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-white block">Impression du bon cuisine séparé</span>
                <span className="text-xs text-slate-400">Imprime immédiatement un ticket de préparation pour le poste cuisson/burger.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.printKitchenTicketOnPayment}
                onChange={e => handleChange('printKitchenTicketOnPayment', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-white block">Ouverture automatique du tiroir-caisse</span>
                <span className="text-xs text-slate-400">Envoie l&apos;impulsion électrique RJ11 (ESC p 0) lors des encaissements en espèces.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.autoOpenCashDrawer}
                onChange={e => handleChange('autoOpenCashDrawer', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Hardware Live Tests */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleTestPrinter}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Tester l&apos;impression d&apos;un ticket démo</span>
            </button>

            <button
              type="button"
              onClick={handleTestCashDrawer}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Tester l&apos;impulsion d&apos;ouverture tiroir</span>
            </button>

            {drawerTestOpen && (
              <span className="text-xs text-emerald-400 font-bold animate-pulse">
                🔓 [CLIC-CLAC] Impulsion RJ11 envoyée : Tiroir physique ouvert !
              </span>
            )}

            {testPrintSuccess && (
              <span className="text-xs text-amber-300 font-bold animate-pulse">
                🖨️ Envoi ESC/POS réussi (32 octets transmis vers {formData.printerIpAddress}) !
              </span>
            )}
          </div>
        </div>
      )}

      {/* CONTENT TAB 3: ÉCRAN CLIENT (TV) */}
      {currentTab === 'DISPLAY' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-amber-400" />
              <span>Afficheur Client Déporté (TV & Moniteur)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Diffuse en temps réel les numéros prêts et en préparation pour fluidifier l&apos;attente au comptoir.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Message défilant au bas de l&apos;écran TV</label>
              <input
                type="text"
                value={formData.customerDisplayMarqueeText}
                onChange={e => handleChange('customerDisplayMarqueeText', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                placeholder="Ex: 🍔 Nos recettes sont préparées à la commande avec des ingrédients frais"
              />
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-white block">Carillon sonore lors d&apos;une commande prête</span>
                <span className="text-xs text-slate-400">Joue un double carillon mélodieux sur les haut-parleurs de la TV lorsqu&apos;une commande passe à l&apos;état Prête.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.customerDisplayChimeEnabled}
                onChange={e => handleChange('customerDisplayChimeEnabled', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </label>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={playTestChime}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Tester le carillon sonore (Ding-Dong)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.open(window.location.pathname + '?display=tv', '_blank');
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ouvrir l&apos;écran TV sur un 2ème moniteur plein écran</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT TAB 4: DEVISES & FISCALITÉ */}
      {currentTab === 'FINANCE' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>Devise & Taux de TVA Réglementaires</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configuration de la monnaie légale et des taux de taxes appliqués selon le mode de consommation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Devise Principale du Système</label>
              <select
                value={formData.currency}
                onChange={e => {
                  const val = e.target.value as PosSettings['currency'];
                  const symbols: Record<string, string> = {
                    EUR: '€',
                    USD: '$',
                    FCFA: 'FCFA',
                    MAD: 'DH',
                    DZD: 'DA',
                    GBP: '£',
                    CHF: 'CHF'
                  };
                  handleChange('currency', val);
                  handleChange('currencySymbol', symbols[val] || '€');
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
              >
                <option value="EUR">Euro (€ - France, Belgique, Espagne)</option>
                <option value="USD">Dollar ($ - US & International)</option>
                <option value="FCFA">Franc CFA (XOF / XAF - Afrique de l&apos;Ouest & Centrale)</option>
                <option value="MAD">Dirham Marocain (DH / MAD)</option>
                <option value="DZD">Dinar Algérien (DA / DZD)</option>
                <option value="CHF">Franc Suisse (CHF)</option>
                <option value="GBP">Livre Sterling (£ - UK)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Symbole Monétaire Actif</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={e => handleChange('currencySymbol', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Taux TVA : Vente à emporter / Livraison (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.defaultTvaRateEmporter}
                onChange={e => handleChange('defaultTvaRateEmporter', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500">Taux réduit standard : 5.5%</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Taux TVA : Consommation sur place (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.defaultTvaRateSurPlace}
                onChange={e => handleChange('defaultTvaRateSurPlace', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500">Taux intermédiaire standard restauration : 10.0%</span>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT TAB 5: SÉCURITÉ & PIN */}
      {currentTab === 'SECURITY' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Contrôles d&apos;Accès & Code PIN Superviseur</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sécurisez les opérations sensibles (remises, annulations, clôture journalière rapport Z).
            </p>
          </div>

          <div className="max-w-md space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">Code PIN Superviseur / Gérant</label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={8}
                value={formData.supervisorPin}
                onChange={e => handleChange('supervisorPin', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-base font-mono tracking-widest focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Code par défaut pour cette démonstration : <strong className="text-amber-400 font-mono">1234</strong>
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-white block">Exiger le PIN pour appliquer une remise commerciale</span>
                <span className="text-xs text-slate-400">Empêche les caissiers d&apos;accorder des réductions sans approbation du responsable.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.requirePinForDiscount}
                onChange={e => handleChange('requirePinForDiscount', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-white block">Exiger le PIN pour annuler ou rembourser une commande</span>
                <span className="text-xs text-slate-400">Obligatoire pour la conformité anti-fraude fiscale NF525.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.requirePinForRefund}
                onChange={e => handleChange('requirePinForRefund', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-white block">Exiger le PIN pour ouvrir le tiroir-caisse hors vente</span>
                <span className="text-xs text-slate-400">Trace chaque ouverture sans encaissement dans le journal d&apos;audit légal.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.requirePinForOpenDrawerWithoutSale}
                onChange={e => handleChange('requirePinForOpenDrawerWithoutSale', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* CONTENT TAB 6: SAUVEGARDE & DONNÉES */}
      {currentTab === 'DATA' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Sauvegarde & Exportation de la Configuration</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Exportez vos paramètres pour les transférer sur un autre terminal ou les conserver en lieu sûr.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleExportConfig}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Exporter le fichier de configuration (.JSON)</span>
            </button>

            <button
              type="button"
              onClick={onResetSettings}
              className="px-5 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Restaurer tous les paramètres d&apos;origine</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
