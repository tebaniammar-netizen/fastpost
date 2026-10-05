import React, { useState } from 'react';
import { 
  FolderTree, 
  Folder, 
  FileCode, 
  Layers, 
  Smartphone, 
  Cpu, 
  Check, 
  Copy, 
  Package
} from 'lucide-react';
import { ARCHITECTURE_SECTIONS } from '../../data/architectureData';

export const ProjectTreeTab: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>(':app-pos');
  const [copiedText, setCopiedText] = useState(false);

  const gradleRootConfig = `// settings.gradle.kts
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "FastFoodPosSystem"
include(":app-pos")
include(":app-kds")
include(":app-client")
include(":core:model")
include(":core:database")
include(":core:sync")
include(":core:network")
include(":core:ui")`;

  const copyText = (t: string) => {
    navigator.clipboard.writeText(t);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <FolderTree className="w-4 h-4" /> Architecture Multi-Modules Android
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Arborescence Modulaire & Séparation des Responsabilités (Clean MVVM)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Découplage strict entre les applications utilisateur (:app-pos, :app-kds, :app-client) et les briques fondamentales (:core:*).
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-300">
          <Package className="w-4 h-4 text-amber-400" />
          <span>Gradle 8.7 + Kotlin 2.0</span>
        </div>
      </div>

      {/* Modules Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {ARCHITECTURE_SECTIONS.modulesTree.map((mod) => (
          <button
            key={mod.path}
            onClick={() => setSelectedModule(mod.path)}
            className={`p-4 rounded-xl text-left transition-all border ${
              selectedModule === mod.path
                ? 'bg-slate-850 border-amber-500 shadow-md shadow-amber-500/10'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                mod.path.startsWith(':app') 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {mod.path}
              </span>
              {mod.path.startsWith(':app') ? (
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
            <p className="text-xs text-slate-300 font-medium line-clamp-2">{mod.description}</p>
          </button>
        ))}
      </div>

      {/* Module Inspector */}
      {(() => {
        const activeMod = ARCHITECTURE_SECTIONS.modulesTree.find(m => m.path === selectedModule)!;
        return (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono">{activeMod.path}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeMod.description}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {activeMod.subdirs.length} sous-dossiers package
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Organisation interne des packages Kotlin
              </h4>
              <div className="space-y-1.5">
                {activeMod.subdirs.map((dir, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs">
                    <Folder className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 leading-snug">{dir}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Gradle Settings Blueprint */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Fichier Maître de Modularité (`settings.gradle.kts`)
            </h3>
          </div>
          <button
            onClick={() => copyText(gradleRootConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors border border-slate-700"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed">
          <pre>{gradleRootConfig}</pre>
        </div>
      </div>
    </div>
  );
};
