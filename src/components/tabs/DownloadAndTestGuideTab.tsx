import React, { useState } from 'react';
import { 
  Download, 
  Play, 
  Terminal, 
  Smartphone, 
  CheckCircle2, 
  PackageCheck, 
  Monitor, 
  Flame, 
  ShieldCheck, 
  FolderDown, 
  ArrowRight, 
  ExternalLink,
  Loader2,
  Copy,
  Printer
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../../utils/downloadProjectZip';
import { ANDROID_FILES_TO_EXPORT } from '../../data/androidSourceFiles';

interface DownloadAndTestGuideTabProps {
  onGoToSimulator: () => void;
  onGoToCodeExplorer: () => void;
}

export const DownloadAndTestGuideTab: React.FC<DownloadAndTestGuideTabProps> = ({
  onGoToSimulator,
  onGoToCodeExplorer
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadAndroidProjectZip(ANDROID_FILES_TO_EXPORT);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('Erreur téléchargement ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> 11 ÉTAPES DÉVELOPPÉES AVEC SUCCÈS
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Comment Tester & Télécharger l&apos;Application FastFood
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Deux options sont à votre disposition : tester le système immédiatement dans ce navigateur grâce au simulateur interactif complet, ou télécharger le code source natif Android complet (.ZIP) pour l&apos;exécuter dans Android Studio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Compression du projet...</span>
                </>
              ) : (
                <>
                  <FolderDown className="w-5 h-5 text-slate-950" />
                  <span>Télécharger le Projet Android (.ZIP)</span>
                </>
              )}
            </button>

            <button
              onClick={onGoToSimulator}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Tester en Direct (Simulateur)</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Archive ZIP téléchargée avec succès dans votre dossier Téléchargements ! Décompressez-la puis ouvrez-la dans Android Studio.</span>
          </div>
        )}
      </div>

      {/* Grid: 2 Test Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Method 1: Web Simulator */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Méthode 1 : Tester en Direct dans le Navigateur</h3>
                <p className="text-xs text-slate-400">Immédiat, sans installation logicielle requise</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Le simulateur embarqué reproduit fidèlement le fonctionnement des terminaux de caisse et de l&apos;écran cuisine KDS :
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Composer une commande :</strong> Burgers avec variantes (Double steak), suppléments (Bacon +1.50€) et notes cuisine (<em>Sans oignons</em>).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Encaisser :</strong> Choisissez Espèces (touches 10€, 20€, 50€ avec calcul automatique de la monnaie) ou Carte Bancaire.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Matériel simulé :</strong> Observez l&apos;ouverture automatique du tiroir-caisse RJ12 et le massicotage thermique du ticket.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Écran Cuisine KDS :</strong> Visualisez la commande dans la colonne <em>En attente</em>, démarrez la préparation et suivez le chronomètre d&apos;urgence.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Mode Hors-Ligne :</strong> Cliquez sur le bouton Réseau en haut pour simuler une coupure Internet et constater la persistance locale continue.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onGoToSimulator}
            className="w-full py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ouvrir l&apos;Onglet Simulateur POS / KDS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Method 2: Android Studio */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Méthode 2 : Tester sur Tablette / Android Studio</h3>
                <p className="text-xs text-slate-400">Pour développeurs & déploiement réel en restaurant</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Le projet Android natif est prêt à être importé dans <strong>Android Studio (Ladybug, Koala ou version ultérieure)</strong> :
            </p>

            <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside">
              <li>Cliquez sur <strong>&quot;Télécharger le Projet Android (.ZIP)&quot;</strong> ci-dessus.</li>
              <li>Décompressez le fichier <code>fastfood-pos-android-project-*.zip</code>.</li>
              <li>Ouvrez Android Studio ➔ <strong>File &gt; Open...</strong> et sélectionnez le dossier décompressé.</li>
              <li>Laissez Gradle synchroniser les dépendances (Kotlin 2.0, Room 2.6.1, Hilt).</li>
              <li>Sélectionnez la configuration de démarrage <strong><code>app-pos</code></strong> (pour la caisse) ou <strong><code>app-kds</code></strong> (pour l&apos;écran cuisine).</li>
              <li>Cliquez sur <strong>Run (▶)</strong> pour lancer sur un émulateur tablette ou sur une tablette tactile connectée en USB.</li>
            </ol>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Commandes Terminal rapides :</div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-amber-300">
              <span>./gradlew :app-pos:assembleDebug</span>
              <button 
                onClick={() => copyToClipboard('./gradlew :app-pos:assembleDebug', 'cmd1')}
                className="text-slate-400 hover:text-white"
                title="Copier la commande"
              >
                {copiedCmd === 'cmd1' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Package Contents Checklist */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-amber-400" />
          Contenu de l&apos;Archive ZIP Téléchargeable (6 Modules Android)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <div className="font-bold text-amber-400">📱 :app-pos</div>
            <p className="text-slate-400 text-[11px]">Application caisse tactile, catalogue produits, encaissement multi-moyens, clôtures fiscales Z, gestion des stocks et dérogations superviseur.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <div className="font-bold text-amber-400">🍳 :app-kds</div>
            <p className="text-slate-400 text-[11px]">Application écran cuisine Kanban paysage, tickets avec numéros géants #042, chronomètre d&apos;urgence vert/orange/rouge et règle de monotonie.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <div className="font-bold text-emerald-400">🗄️ :core-database</div>
            <p className="text-slate-400 text-[11px]">Base SQLite Room locale avec 11 entités relationnelles, DAOs réactifs (Flow), seeders fast-food et chaînage cryptographique SHA-256 NF525.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <div className="font-bold text-emerald-400">💶 :core-model</div>
            <p className="text-slate-400 text-[11px]">Modèles de domaine purs, classe immuable Money en centimes entiers (Long), calcul unitaire de TVA 10% sans dérive de virgule flottante.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <div className="font-bold text-sky-400">🖨️ :core-hardware</div>
            <p className="text-slate-400 text-[11px]">Pilote d&apos;impression thermique ESC/POS 80mm/58mm via socket TCP 9100, massicotage automatique et impulsion tiroir-caisse RJ12.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <div className="font-bold text-sky-400">📡 :core-sync</div>
            <p className="text-slate-400 text-[11px]">Pattern Transactional Outbox, découverte zéro-config mDNS du Hub local, communication WebSocket duplex et reconnexion backoff exponentiel.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Conforme norme NF525 et Article 286 du Code Général des Impôts (Inaltérabilité & Traçabilité).
          </span>
          <button 
            onClick={onGoToCodeExplorer}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Explorer les 25+ fichiers sources unitairement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
