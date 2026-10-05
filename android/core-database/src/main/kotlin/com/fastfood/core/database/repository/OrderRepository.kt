package com.fastfood.core.database.repository

import com.fastfood.core.database.dao.IngredientDao
import com.fastfood.core.database.dao.OrderDao
import com.fastfood.core.database.dao.OrderWithDetails
import com.fastfood.core.database.dao.SyncOutboxDao
import com.fastfood.core.database.entity.*
import com.fastfood.core.model.order.OrderStatus
import com.fastfood.core.model.order.PaymentMethod
import com.fastfood.core.model.order.PaymentStatus
import com.fastfood.core.model.order.SyncStatus
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

interface OrderRepository {
    fun getAllOrders(): Flow<List<OrderWithDetails>>
    fun getActiveKitchenOrders(): Flow<List<OrderWithDetails>>
    suspend fun getOrderById(orderId: String): OrderWithDetails?
    suspend fun getNextDailyOrderNumber(): Int
    suspend fun createAndCheckoutOrder(
        sessionId: String,
        caissierId: String,
        terminalId: String,
        orderType: com.fastfood.core.model.order.OrderType,
        clientNom: String?,
        clientTelephone: String?,
        discountCentimes: Long,
        discountReason: String?,
        cartItems: List<com.fastfood.pos.ui.cashregister.CartLineItemUiModel>,
        paymentMethod: PaymentMethod,
        cashGivenCentimes: Long,
        cardReference: String?
    ): OrderEntity
}

@Singleton
class OrderRepositoryImpl @Inject constructor(
    private val orderDao: OrderDao,
    private val ingredientDao: IngredientDao,
    private val syncOutboxDao: SyncOutboxDao
) : OrderRepository {

    override fun getAllOrders(): Flow<List<OrderWithDetails>> = orderDao.getAllOrdersWithDetailsFlow()

    override fun getActiveKitchenOrders(): Flow<List<OrderWithDetails>> = orderDao.getActiveKitchenOrdersFlow()

    override fun getOrderById(orderId: String): OrderWithDetails? = kotlinx.coroutines.runBlocking {
        orderDao.getOrderWithDetailsById(orderId)
    }

    override suspend fun getNextDailyOrderNumber(): Int {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)
        val startOfDay = calendar.timeInMillis
        val countToday = orderDao.getCountOrdersToday(startOfDay)
        return countToday + 1
    }

    override suspend fun createAndCheckoutOrder(
        sessionId: String,
        caissierId: String,
        terminalId: String,
        orderType: com.fastfood.core.model.order.OrderType,
        clientNom: String?,
        clientTelephone: String?,
        discountCentimes: Long,
        discountReason: String?,
        cartItems: List<com.fastfood.pos.ui.cashregister.CartLineItemUiModel>,
        paymentMethod: PaymentMethod,
        cashGivenCentimes: Long,
        cardReference: String?
    ): OrderEntity {
        val orderId = UUID.randomUUID().toString()
        val dailyNum = getNextDailyOrderNumber()
        val dateStr = SimpleDateFormat("yyyyMMdd", Locale.FRANCE).format(Date())
        val reference = "CMD-$dateStr-$terminalId-${String.format("%03d", dailyNum)}"
        val now = System.currentTimeMillis()

        val subtotal = cartItems.sumOf { it.totalLigneCentimes }
        val totalTtc = maxOf(0L, subtotal - discountCentimes)
        val totalHt = Math.round(totalTtc / 1.10)
        val totalTva = totalTtc - totalHt

        val cashChange = if (paymentMethod == PaymentMethod.ESPECES) {
            maxOf(0L, cashGivenCentimes - totalTtc)
        } else {
            0L
        }

        val orderEntity = OrderEntity(
            id = orderId,
            numeroJour = dailyNum,
            referenceUnique = reference,
            dateCreationUtc = now,
            typeCommande = orderType,
            statut = OrderStatus.RECOLTEE,
            totalHtCentimes = totalHt,
            totalTvaCentimes = totalTva,
            totalTtcCentimes = totalTtc,
            remiseCentimes = discountCentimes,
            remiseMotif = discountReason,
            sessionCaisseId = sessionId,
            caissierId = caissierId,
            terminalId = terminalId,
            clientNom = clientNom,
            clientTelephone = clientTelephone,
            syncStatus = SyncStatus.PENDING,
            syncAttempts = 0
        )

        val lineEntities = cartItems.map { item ->
            OrderLineEntity(
                id = UUID.randomUUID().toString(),
                commandeId = orderId,
                produitId = item.productId,
                produitNomSnapshot = item.productNom,
                varianteNomSnapshot = item.variantNom,
                prixUnitaireCentimes = item.prixUnitaireCentimes,
                quantite = item.quantite,
                totalLigneCentimes = item.totalLigneCentimes,
                extrasJson = if (item.extras.isNotEmpty()) item.extras.joinToString(",") { it.nom } else null,
                notePreparation = item.notePreparation
            )
        }

        val paymentEntity = PaymentEntity(
            id = UUID.randomUUID().toString(),
            commandeId = orderId,
            sessionCaisseId = sessionId,
            modePaiement = paymentMethod,
            montantCentimes = totalTtc,
            monnaieRendueCentimes = cashChange,
            statut = PaymentStatus.VALIDE,
            referenceExterne = cardReference,
            datePaiementUtc = now,
            caissierId = caissierId
        )

        val outboxEvent = SyncOutboxEntity(
            id = UUID.randomUUID().toString(),
            aggregateType = "ORDER",
            aggregateId = orderId,
            eventType = "ORDER_CREATED",
            payloadJson = "{\"reference\":\"$reference\",\"totalTtcCentimes\":$totalTtc}",
            timestampUtc = now,
            status = SyncStatus.PENDING,
            target = "LOCAL_HUB",
            retryCount = 0
        )

        // Transaction atomique dans Room
        orderDao.insertCompleteOrderTransaction(
            order = orderEntity,
            lines = lineEntities,
            payments = listOf(paymentEntity),
            outboxEvent = outboxEvent
        )

        // Déstockage automatique des matières premières selon les recettes
        for (item in cartItems) {
            val recipes = ingredientDao.getRecipeForProduct(item.productId)
            for (rec in recipes) {
                ingredientDao.deductStock(rec.ingredientId, rec.quantiteRequise * item.quantite)
            }
        }

        return orderEntity
    }
}
