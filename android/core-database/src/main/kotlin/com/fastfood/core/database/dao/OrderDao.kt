package com.fastfood.core.database.dao

import androidx.room.*
import com.fastfood.core.database.entity.*
import com.fastfood.core.model.order.OrderStatus
import com.fastfood.core.model.order.SyncStatus
import kotlinx.coroutines.flow.Flow

data class OrderWithDetails(
    @Embedded val order: OrderEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "commande_id"
    )
    val lines: List<OrderLineEntity>,
    @Relation(
        parentColumn = "id",
        entityColumn = "commande_id"
    )
    val payments: List<PaymentEntity>
)

@Dao
interface OrderDao {

    @Transaction
    @Query("SELECT * FROM commandes ORDER BY date_creation_utc DESC")
    fun getAllOrdersWithDetailsFlow(): Flow<List<OrderWithDetails>>

    @Transaction
    @Query("SELECT * FROM commandes WHERE statut NOT IN ('REMISE', 'ANNULEE') ORDER BY date_creation_utc ASC")
    fun getActiveKitchenOrdersFlow(): Flow<List<OrderWithDetails>>

    @Transaction
    @Query("SELECT * FROM commandes WHERE id = :orderId")
    suspend fun getOrderWithDetailsById(orderId: String): OrderWithDetails?

    @Query("SELECT COUNT(*) FROM commandes WHERE date_creation_utc >= :startOfDayUtc")
    suspend fun getCountOrdersToday(startOfDayUtc: Long): Int

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertOrderEntity(order: OrderEntity)

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertOrderLines(lines: List<OrderLineEntity>)

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertPayments(payments: List<PaymentEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOutboxEvent(event: SyncOutboxEntity)

    @Query("UPDATE commandes SET statut = :newStatus WHERE id = :orderId")
    suspend fun updateOrderStatus(orderId: String, newStatus: OrderStatus)

    @Query("UPDATE commandes SET sync_status = :status, sync_attempts = sync_attempts + 1 WHERE id = :orderId")
    suspend fun updateOrderSyncStatus(orderId: String, status: SyncStatus)

    /**
     * Transaction atomique complète d'encaissement d'une commande :
     * 1. Insertion de la commande
     * 2. Insertion de toutes les lignes
     * 3. Insertion du ou des paiements
     * 4. Inscription de l'événement dans la file outbox
     */
    @Transaction
    suspend fun insertCompleteOrderTransaction(
        order: OrderEntity,
        lines: List<OrderLineEntity>,
        payments: List<PaymentEntity>,
        outboxEvent: SyncOutboxEntity
    ) {
        insertOrderEntity(order)
        insertOrderLines(lines)
        insertPayments(payments)
        insertOutboxEvent(outboxEvent)
    }
}
