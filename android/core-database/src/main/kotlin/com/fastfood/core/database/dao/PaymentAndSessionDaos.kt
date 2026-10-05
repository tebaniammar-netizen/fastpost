package com.fastfood.core.database.dao

import androidx.room.*
import com.fastfood.core.database.entity.AuditLogEntity
import com.fastfood.core.database.entity.CashSessionEntity
import com.fastfood.core.database.entity.PaymentEntity
import com.fastfood.core.database.entity.SyncOutboxEntity
import com.fastfood.core.model.order.SyncStatus
import kotlinx.coroutines.flow.Flow

@Dao
interface PaymentDao {

    @Query("SELECT * FROM paiements WHERE commande_id = :orderId")
    suspend fun getPaymentsForOrder(orderId: String): List<PaymentEntity>

    @Query("SELECT SUM(montant_centimes) FROM paiements WHERE session_caisse_id = :sessionId AND mode_paiement = 'ESPECES' AND statut = 'VALIDE'")
    suspend fun getTotalCashForSession(sessionId: String): Long?

    @Query("SELECT SUM(montant_centimes) FROM paiements WHERE session_caisse_id = :sessionId AND mode_paiement = 'CARTE_BANCAIRE' AND statut = 'VALIDE'")
    suspend fun getTotalCardForSession(sessionId: String): Long?

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertPayment(payment: PaymentEntity)
}

@Dao
interface CashSessionDao {

    @Query("SELECT * FROM sessions_caisse WHERE statut = 'OUVERTE' ORDER BY date_ouverture_utc DESC LIMIT 1")
    fun getActiveSessionFlow(): Flow<CashSessionEntity?>

    @Query("SELECT * FROM sessions_caisse WHERE statut = 'OUVERTE' ORDER BY date_ouverture_utc DESC LIMIT 1")
    suspend fun getActiveSession(): CashSessionEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun openSession(session: CashSessionEntity)

    @Update
    suspend fun closeSession(session: CashSessionEntity)
}

@Dao
interface SyncOutboxDao {

    @Query("SELECT * FROM sync_outbox WHERE status = 'PENDING' ORDER BY timestamp_utc ASC LIMIT :limit")
    suspend fun getPendingEvents(limit: Int = 50): List<SyncOutboxEntity>

    @Query("SELECT COUNT(*) FROM sync_outbox WHERE status = 'PENDING'")
    fun getPendingCountFlow(): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun enqueueEvent(event: SyncOutboxEntity)

    @Query("UPDATE sync_outbox SET status = :status, retry_count = retry_count + 1, last_error = :error WHERE id = :eventId")
    suspend fun markEventStatus(eventId: String, status: SyncStatus, error: String? = null)

    @Query("SELECT EXISTS(SELECT 1 FROM sync_outbox WHERE aggregate_id = :aggregateId AND event_type = :eventType AND status = 'SYNCED')")
    suspend fun hasAlreadySynced(aggregateId: String, eventType: String): Boolean
}

@Dao
interface AuditLogDao {

    @Query("SELECT * FROM journal_audit ORDER BY date_utc DESC")
    fun getAuditLogsFlow(): Flow<List<AuditLogEntity>>

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertAuditLog(log: AuditLogEntity)
}
