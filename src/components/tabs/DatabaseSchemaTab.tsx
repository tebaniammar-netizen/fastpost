import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  Layers, 
  Code, 
  Copy, 
  Check, 
  Table2, 
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { ARCHITECTURE_SECTIONS } from '../../data/architectureData';

export const DatabaseSchemaTab: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('commandes');
  const [copiedCode, setCopiedCode] = useState(false);

  const currentTable = ARCHITECTURE_SECTIONS.databaseSchema.find(t => t.tableName === selectedTable) || ARCHITECTURE_SECTIONS.databaseSchema[0];

  const sampleKotlinEntity = `package com.fastfood.core.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ColumnInfo
import androidx.room.ForeignKey
import androidx.room.Index
import java.util.UUID

@Entity(
    tableName = "commandes",
    foreignKeys = [
        ForeignKey(
            entity = CashSessionEntity::class,
            parentColumns = ["id"],
            childColumns = ["session_caisse_id"],
            onDelete = ForeignKey.RESTRICT
        )
    ],
    indices = [
        Index(value = ["date_creation_utc"]),
        Index(value = ["statut"]),
        Index(value = ["sync_status"])
    ]
)
data class OrderEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "numero_jour")
    val numeroJour: Int, // Ex: 42

    @ColumnInfo(name = "reference_unique")
    val referenceUnique: String, // Ex: "CMD-20261002-C01-042"

    @ColumnInfo(name = "date_creation_utc")
    val dateCreationUtc: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "type_commande")
    val typeCommande: OrderType, // SUR_PLACE, A_EMPORTER, LIVRAISON

    @ColumnInfo(name = "statut")
    val statut: OrderStatus, // RECOLTEE, EN_PREPARATION, PRETE, REMISE, ANNULEE

    @ColumnInfo(name = "total_ht_centimes")
    val totalHtCentimes: Long,

    @ColumnInfo(name = "total_tva_centimes")
    val totalTvaCentimes: Long,

    @ColumnInfo(name = "total_ttc_centimes")
    val totalTtcCentimes: Long, // Stocké en centimes entiers (ex: 1550 = 15.50€)

    @ColumnInfo(name = "remise_centimes")
    val remiseCentimes: Long = 0L,

    @ColumnInfo(name = "remise_motif")
    val remiseMotif: String? = null,

    @ColumnInfo(name = "session_caisse_id")
    val sessionCaisseId: String,

    @ColumnInfo(name = "caissier_id")
    val caissierId: String,

    @ColumnInfo(name = "terminal_id")
    val terminalId: String,

    @ColumnInfo(name = "client_nom")
    val clientNom: String? = null,

    @ColumnInfo(name = "sync_status")
    val syncStatus: SyncStatus = SyncStatus.PENDING,

    @ColumnInfo(name = "sync_attempts")
    val syncAttempts: Int = 0
)`;

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" /> Persistance Locale SQLite / Room
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Schéma Relationnel & Entités Room Versionnées
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {ARCHITECTURE_SECTIONS.databaseSchema.length} tables métier complètes avec intégrité référentielle, indexation pour requêtes &lt; 5ms et stockage monétaire en centimes.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Room Database v1.0.0</span>
        </div>
      </div>

      {/* Table Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ARCHITECTURE_SECTIONS.databaseSchema.map((table) => (
          <button
            key={table.tableName}
            onClick={() => setSelectedTable(table.tableName)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedTable === table.tableName
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>{table.tableName}</span>
          </button>
        ))}
      </div>

      {/* Selected Table Details */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white font-mono">{currentTable.tableName}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Primary Key: {currentTable.primaryKey}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{currentTable.description}</p>
          </div>
          {currentTable.foreignKeys && currentTable.foreignKeys.length > 0 && (
            <div className="text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
              {currentTable.foreignKeys[0]}
            </div>
          )}
        </div>

        {/* Columns Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 pr-4 font-semibold">Colonne Room / SQL</th>
                <th className="pb-3 px-4 font-semibold">Type de Données</th>
                <th className="pb-3 px-4 font-semibold">Contrainte</th>
                <th className="pb-3 pl-4 font-semibold">Règle Métier & Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {currentTable.columns.map((col, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 pr-4 text-amber-300 font-bold flex items-center gap-1.5">
                    {col.name === 'id' && <Key className="w-3 h-3 text-amber-400" />}
                    {col.name}
                  </td>
                  <td className="py-2.5 px-4 text-blue-400 font-semibold">{col.type}</td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      col.nullable ? 'bg-slate-800 text-slate-400' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {col.nullable ? 'NULLABLE' : 'NOT NULL'}
                    </span>
                  </td>
                  <td className="py-2.5 pl-4 text-slate-300 font-sans text-xs">{col.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Indices & Optimization */}
        {currentTable.indices && currentTable.indices.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Index SQL d&apos;Accélération (Recherche & Filtres)
            </h4>
            <div className="space-y-1">
              {currentTable.indices.map((idx, i) => (
                <div key={i} className="text-xs font-mono text-emerald-400 bg-slate-900/60 p-2 rounded border border-slate-800">
                  {idx}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kotlin Room Implementation Example */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Implémentation Kotlin Room Réelle (`OrderEntity.kt`)
            </h3>
          </div>
          <button
            onClick={() => copyCode(sampleKotlinEntity)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors border border-slate-700"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copié !' : 'Copier le code'}</span>
          </button>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-96">
          <pre>{sampleKotlinEntity}</pre>
        </div>
      </div>
    </div>
  );
};
