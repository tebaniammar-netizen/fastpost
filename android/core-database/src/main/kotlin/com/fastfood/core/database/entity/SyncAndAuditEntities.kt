package com.fastfood.core.database.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import com.fastfood.core.model.order.SyncStatus
import com.fastfood.core.model.order.UserRole
import java.util.UUID

@Entity(
    tableName = "sync_outbox",
    indices = [
        Index(value = ["status", "target"]),
        Index(value = ["timestamp_utc"])
    ]
)
data class SyncOutboxEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "aggregate_type")
    val aggregateType: String, // ORDER, PAYMENT, STOCK_MOVEMENT, CASH_SESSION

    @ColumnInfo(name = "aggregate_id")
    val aggregateId: String,

    @ColumnInfo(name = "event_type")
    val eventType: String, // ORDER_CREATED, PAYMENT_RECORDED, ORDER_STATUS_CHANGED

    @ColumnInfo(name = "payload_json")
    val payloadJson: String,

    @ColumnInfo(name = "timestamp_utc")
    val timestampUtc: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "status")
    val status: SyncStatus = SyncStatus.PENDING,

    @ColumnInfo(name = "target")
    val target: String = "LOCAL_HUB", // LOCAL_HUB, REMOTE_CLOUD, BOTH

    @ColumnInfo(name = "retry_count")
    val retryCount: Int = 0,

    @ColumnInfo(name = "last_error")
    val lastError: String? = null
)

@Entity(
    tableName = "journal_audit",
    indices = [
        Index(value = ["date_utc"]),
        Index(value = ["utilisateur_id"]),
        Index(value = ["action"])
    ]
)
data class AuditLogEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "date_utc")
    val dateUtc: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "action")
    val action: String, // REMISE_ACCORDEE, COMMANDE_ANNULEE, CLOTURE_CAISSE, VENTE_ENCAISSEE

    @ColumnInfo(name = "utilisateur_id")
    val utilisateurId: String,

    @ColumnInfo(name = "utilisateur_role")
    val utilisateurRole: UserRole,

    @ColumnInfo(name = "entite_type")
    val entiteType: String,

    @ColumnInfo(name = "entite_id")
    val entiteId: String,

    @ColumnInfo(name = "details_json")
    val detailsJson: String
)
