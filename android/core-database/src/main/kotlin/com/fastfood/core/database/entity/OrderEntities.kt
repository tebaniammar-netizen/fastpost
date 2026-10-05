package com.fastfood.core.database.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import com.fastfood.core.model.order.*
import java.util.UUID

@Entity(
    tableName = "sessions_caisse",
    indices = [
        Index(value = ["date_ouverture_utc"]),
        Index(value = ["statut"])
    ]
)
data class CashSessionEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "terminal_id")
    val terminalId: String,

    @ColumnInfo(name = "caissier_id")
    val caissierId: String,

    @ColumnInfo(name = "date_ouverture_utc")
    val dateOuvertureUtc: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "date_cloture_utc")
    val dateClotureUtc: Long? = null,

    @ColumnInfo(name = "fond_initial_centimes")
    val fondInitialCentimes: Long,

    @ColumnInfo(name = "total_especes_theorique_centimes")
    val totalEspecesTheoriqueCentimes: Long = fondInitialCentimes,

    @ColumnInfo(name = "total_especes_compte_centimes")
    val totalEspecesCompteCentimes: Long? = null,

    @ColumnInfo(name = "ecart_centimes")
    val ecartCentimes: Long? = null,

    @ColumnInfo(name = "statut")
    val statut: String = "OUVERTE"
)

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
        Index(value = ["sync_status"]),
        Index(value = ["reference_unique"], unique = true)
    ]
)
data class OrderEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "numero_jour")
    val numeroJour: Int, // Ex: #042

    @ColumnInfo(name = "reference_unique")
    val referenceUnique: String, // Ex: "CMD-20261002-C01-042"

    @ColumnInfo(name = "date_creation_utc")
    val dateCreationUtc: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "type_commande")
    val typeCommande: OrderType,

    @ColumnInfo(name = "statut")
    val statut: OrderStatus = OrderStatus.RECOLTEE,

    @ColumnInfo(name = "total_ht_centimes")
    val totalHtCentimes: Long,

    @ColumnInfo(name = "total_tva_centimes")
    val totalTvaCentimes: Long,

    @ColumnInfo(name = "total_ttc_centimes")
    val totalTtcCentimes: Long,

    @ColumnInfo(name = "remise_centimes")
    val remiseCentimes: Long = 0L,

    @ColumnInfo(name = "remise_motif")
    val remiseMotif: String? = null,

    @ColumnInfo(name = "remise_auteur_id")
    val remiseAuteurId: String? = null,

    @ColumnInfo(name = "session_caisse_id")
    val sessionCaisseId: String,

    @ColumnInfo(name = "caissier_id")
    val caissierId: String,

    @ColumnInfo(name = "terminal_id")
    val terminalId: String,

    @ColumnInfo(name = "client_nom")
    val clientNom: String? = null,

    @ColumnInfo(name = "client_telephone")
    val clientTelephone: String? = null,

    @ColumnInfo(name = "sync_status")
    val syncStatus: SyncStatus = SyncStatus.PENDING,

    @ColumnInfo(name = "sync_attempts")
    val syncAttempts: Int = 0
)

@Entity(
    tableName = "commande_lignes",
    foreignKeys = [
        ForeignKey(
            entity = OrderEntity::class,
            parentColumns = ["id"],
            childColumns = ["commande_id"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [
        Index(value = ["commande_id"]),
        Index(value = ["produit_id"])
    ]
)
data class OrderLineEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "commande_id")
    val commandeId: String,

    @ColumnInfo(name = "produit_id")
    val produitId: String,

    @ColumnInfo(name = "produit_nom_snapshot")
    val produitNomSnapshot: String,

    @ColumnInfo(name = "variante_nom_snapshot")
    val varianteNomSnapshot: String? = null,

    @ColumnInfo(name = "prix_unitaire_centimes")
    val prixUnitaireCentimes: Long,

    @ColumnInfo(name = "quantite")
    val quantite: Int,

    @ColumnInfo(name = "total_ligne_centimes")
    val totalLigneCentimes: Long,

    @ColumnInfo(name = "extras_json")
    val extrasJson: String? = null,

    @ColumnInfo(name = "note_preparation")
    val notePreparation: String? = null
)

@Entity(
    tableName = "paiements",
    foreignKeys = [
        ForeignKey(
            entity = OrderEntity::class,
            parentColumns = ["id"],
            childColumns = ["commande_id"],
            onDelete = ForeignKey.RESTRICT
        ),
        ForeignKey(
            entity = CashSessionEntity::class,
            parentColumns = ["id"],
            childColumns = ["session_caisse_id"],
            onDelete = ForeignKey.RESTRICT
        )
    ],
    indices = [
        Index(value = ["commande_id"]),
        Index(value = ["session_caisse_id"]),
        Index(value = ["date_paiement_utc"])
    ]
)
data class PaymentEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "commande_id")
    val commandeId: String,

    @ColumnInfo(name = "session_caisse_id")
    val sessionCaisseId: String,

    @ColumnInfo(name = "mode_paiement")
    val modePaiement: PaymentMethod,

    @ColumnInfo(name = "montant_centimes")
    val montantCentimes: Long,

    @ColumnInfo(name = "monnaie_rendue_centimes")
    val monnaieRendueCentimes: Long = 0L,

    @ColumnInfo(name = "statut")
    val statut: PaymentStatus = PaymentStatus.VALIDE,

    @ColumnInfo(name = "reference_externe")
    val referenceExterne: String? = null,

    @ColumnInfo(name = "date_paiement_utc")
    val datePaiementUtc: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "caissier_id")
    val caissierId: String
)
