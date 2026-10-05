import React, { useState } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Server, 
  WifiOff, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Layers, 
  Coins, 
  Zap, 
  Copy, 
  Check, 
  Workflow
} from 'lucide-react';
import { ARCHITECTURE_SECTIONS } from '../../data/architectureData';

export const ArchitectureTab: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Spécification Maître Phase 1
            </span>
            <span className="text-xs text-slate-400">Architecture & Stratégie Hors-Ligne Prioritaire</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Système FastFood POS Android Multi-Appareils
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Conception d&apos;une suite logicielle Android native (Kotlin, Jetpack Compose, Room, WorkManager)
            permettant l&apos;encaissement à haute cadence, la gestion de cuisine (KDS), la commande client et la traçabilité
            totale des stocks sans aucune dépendance obligatoire à Internet.
          </p>
        </div>
      </div>

      {/* 4 Piliers Fondamentaux */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Les 4 Piliers Directeurs de l&apos;Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARCHITECTURE_SECTIONS.overview.principles.map((p, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm flex items-center justify-center">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagramme de Flux Offline-First & Idempotence */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Cycle de Vie d&apos;une Commande & Pipeline Transactionnel (ACID + Outbox)
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Zéro Perte de Données
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-6">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Étape 1</span>
              <h4 className="text-sm font-semibold text-white mt-1">Validation Caisse Tactile</h4>
              <p className="text-xs text-slate-400 mt-2">
                Le caissier encaisse le panier. Génération UUID v4 mondialement unique + Numéro de jour court (#042).
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Latence 0 ms (UI non bloquée)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Étape 2</span>
              <h4 className="text-sm font-semibold text-white mt-1">Transaction SQLite Room</h4>
              <p className="text-xs text-slate-400 mt-2">
                Écriture atomique @Transaction :<br />
                • Inscription `commandes` & `lignes`<br />
                • Inscription `paiements`<br />
                • Déstockage immédiat matières<br />
                • Inscription dans `sync_outbox`
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Garanti ACID 100%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Étape 3</span>
              <h4 className="text-sm font-semibold text-white mt-1">Diffusion Hub Local (KDS)</h4>
              <p className="text-xs text-slate-400 mt-2">
                Ktor Embedded Server & mDNS : notification temps réel envoyée aux écrans cuisine KDS sur le Wi-Fi local sans routeur Internet.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] text-blue-400 flex items-center gap-1">
              <Server className="w-3.5 h-3.5" /> Latence &lt; 50 ms
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Étape 4</span>
              <h4 className="text-sm font-semibold text-white mt-1">WorkManager Cloud</h4>
              <p className="text-xs text-slate-400 mt-2">
                Tâche de fond persistante réessayant jusqu&apos;à confirmation serveur avec backoff exponentiel. Dépilement outbox idempotent.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] text-purple-400 flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Résilience pannes
            </div>
          </div>
        </div>

        {/* Détail Double Transport */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 mt-4 text-xs sm:text-sm text-slate-300">
          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-400" />
            Double Transport : Hub Local Autonome vs Serveur Distant
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Pour garantir une continuité d&apos;exploitation même si la box internet de la boutique est coupée, l&apos;application caisse principale
            active un serveur local Ktor (sur le port 8080 en réseau local) ou communique avec un mini-hub Raspberry/tablette locale.
            Les écrans cuisine (KDS) découvrent ce service via le protocole standard Android <code>NsdManager</code> (Network Service Discovery).
            Si le Hub local est indisponible, chaque caisse continue à stocker ses opérations localement dans Room sans aucun arrêt de service.
          </p>
        </div>
      </div>

      {/* Règles Financières et Traçabilité des Stocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Règles Financières Strictes
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Montants en entiers stricts (Centimes) :</strong> 10.50 € est toujours stocké sous la valeur <code>1050</code>.
                Élimination absolue des erreurs d&apos;arrondi IEEE 754 des nombres à virgule flottante.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Instantané immuable des prix :</strong> Chaque ligne de commande enregistre un snapshot complet du libellé et du prix unitaire.
                Toute réévaluation ultérieure du catalogue ne modifie jamais l&apos;historique comptable.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Statuts de paiement fiables :</strong> Distinction formelle entre <code>EN_ATTENTE</code> (envoi TPE),
                <code>VALIDE</code> (acquittement du protocole bancaire) et <code>REFUSE</code>. Aucune validation fictive.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Interdiction de suppression :</strong> Aucune commande ou paiement n&apos;est supprimé. Les erreurs sont corrigées
                par contre-passation (annulation tracée avec motif obligatoire et horodatage UTC).
              </span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Gestion des Stocks & Déduction Recettes
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Calcul basé sur la nomenclature (Bill of Materials) :</strong> Chaque burger consomme exactement les ingrédients spécifiés
                (ex: 1 pain brioché, 2 steaks 150g, 2 tranches cheddar, 30ml sauce).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Suppléments & Variantes pris en compte :</strong> Les extras (bacon, sauce supplémentaire) déduisent immédiatement
                leur ingrédient correspondant.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Seuils d&apos;alerte temps réel :</strong> Indicateur visuel immédiat en caisse quand un ingrédient passe sous le seuil minimal
                pour avertir l&apos;opérateur avant rupture totale.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Mouvements de stock historisés :</strong> Distingue <code>VENTE</code>, <code>PERTE</code>, <code>LIVRAISON_FOURNISSEUR</code>
                et <code>INVENTAIRE_RECTIFICATIF</code> avec identifiant utilisateur responsable.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Résolution des conflits et limites documentées */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40">
        <h3 className="text-base font-bold text-rose-300 mb-2 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          Règles de Conflits & Limites Techniques du Mode Hors-Ligne
        </h3>
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>1. Commandes Clientes Distantes (Click & Collect / Livraison) :</strong> Conformément au cahier des charges,
            une commande émise par un client distant sur son smartphone ne peut physiquement pas être prise en compte par le restaurant
            si le restaurant n&apos;a aucun accès réseau (ni local ni 4G/Fibre). L&apos;application cliente affiche un avertissement clair et
            n&apos;affiche jamais de confirmation avant d&apos;avoir reçu l&apos;ACK signé du serveur central ou du restaurant.
          </p>
          <p>
            <strong>2. Conflit de statut de préparation KDS :</strong> Si deux cuisiniers modifient simultanément l&apos;état d&apos;un ticket,
            la règle de priorité déterministe est la monotonie du cycle de vie :
            <code>RECOLTEE &lt; EN_PREPARATION &lt; PRETE &lt; REMISE</code>. Une commande marquée <em>PRETE</em> ne peut pas être rétrogradée en
            <em>EN_PREPARATION</em> par une synchronisation différée.
          </p>
          <p>
            <strong>3. Conflit financier :</strong> Si deux caisses créent des commandes avec le même numéro de ticket de jour suite à une coupure
            (ex: deux commandes #42 sur caisse A et caisse B), l&apos;UUID mondial garantit l&apos;unicité en base de données. Le préfixe de terminal
            (ex: <code>CMD-20261002-C01-042</code> et <code>CMD-20261002-C02-042</code>) empêche toute collision de référence.
          </p>
        </div>
      </div>
    </div>
  );
};
