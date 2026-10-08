import React from 'react';
import { 
  Download, 
  Smartphone, 
  Terminal, 
  FolderDown, 
  CheckCircle2, 
  Play, 
  ShieldCheck, 
  Laptop, 
  FileCode, 
  ExternalLink,
  Cpu
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../../utils/downloadProjectZip';
import { ANDROID_FILES_TO_EXPORT } from '../../data/androidSourceFiles';

interface DownloadPageProps {
  onOpenLiveSimulator: () => void;
  onGoToCodeExplorer: () => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({
  onOpenLiveSimulator,
  onGoToCodeExplorer
}) => {
  const handleDownload = () => {
    downloadAndroidProjectZip(ANDROID_FILES_TO_EXPORT);
  };

  return (
    <div className="py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Download className="w-3.5 h-3.5" />
          <span>Téléchargement & Installation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Téléchargez le projet et lancez-le en local
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Projet complet Android Studio prêt à compiler (Jetpack Compose, Room SQLite, 6 modules Gradle, 100% Kotlin 2.0).
        </p>
      </div>

      {/* Primary Download Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 rounded-3xl border border-amber-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl max-w-3xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-amber-500/20">
          <FolderDown className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Archive Complète Android Studio (.ZIP)
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Contient les 6 modules (app-pos, app-kds, core-model, core-database, core-hardware, core-sync), la configuration Gradle 4 Go de RAM et tous les fichiers Kotlin.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={handleDownload}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Télécharger le ZIP du Projet</span>
          </button>

          <button
            onClick={onOpenLiveSimulator}
            className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Tester immédiatement sur le Web</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Compatible Windows, macOS, Linux
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Gradle 8.7 & Kotlin 2.0
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Room 2.6.1 SQLite
          </span>
        </div>
      </div>

      {/* Step by Step Guide for Android Studio */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h3 className="text-xl font-bold text-white text-center">
          Comment ouvrir le projet dans Android Studio en 3 étapes :
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-white text-base">Décompresser le ZIP</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extrayez l’archive téléchargée dans un dossier accessible de votre ordinateur (ex: <code className="text-amber-300">C:\Projets\FastFoodPOS</code>).
            </p>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-white text-base">Ouvrir dans Android Studio</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lancez Android Studio, cliquez sur <strong>File &gt; Open</strong> et sélectionnez le dossier extrait. Laissez Gradle synchroniser les dépendances.
            </p>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-white text-base">Lancer sur Émulateur ou Tablette</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sélectionnez le module <strong>app-pos</strong> en haut, choisissez votre émulateur Pixel Tablet ou branchez votre appareil en USB, puis appuyez sur <strong>Play (▶)</strong> !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
