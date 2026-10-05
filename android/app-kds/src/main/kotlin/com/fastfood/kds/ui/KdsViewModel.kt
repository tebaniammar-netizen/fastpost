package com.fastfood.kds.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fastfood.core.database.dao.OrderDao
import com.fastfood.core.database.dao.OrderWithDetails
import com.fastfood.core.database.entity.SyncOutboxEntity
import com.fastfood.core.model.order.OrderStatus
import com.fastfood.core.model.order.SyncStatus
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject

data class KdsUiState(
    val isLoading: Boolean = false,
    val allActiveOrders: List<OrderWithDetails> = emptyList(),
    val currentTimeMillis: Long = System.currentTimeMillis(),
    val errorMessage: String? = null
) {
    val receivedOrders: List<OrderWithDetails>
        get() = allActiveOrders.filter { it.order.statut == OrderStatus.RECOLTEE }

    val preparingOrders: List<OrderWithDetails>
        get() = allActiveOrders.filter { it.order.statut == OrderStatus.EN_PREPARATION }

    val readyOrders: List<OrderWithDetails>
        get() = allActiveOrders.filter { it.order.statut == OrderStatus.PRETE }
}

@HiltViewModel
class KdsViewModel @Inject constructor(
    private val orderDao: OrderDao
) : ViewModel() {

    private val _uiState = MutableStateFlow(KdsUiState(isLoading = true))
    val uiState: StateFlow<KdsUiState> = _uiState.asStateFlow()

    init {
        observeActiveOrders()
        startElapsedTicker()
    }

    private fun observeActiveOrders() {
        viewModelScope.launch {
            orderDao.getActiveKitchenOrdersFlow()
                .catch { e -> _uiState.update { it.copy(errorMessage = e.message, isLoading = false) } }
                .collect { list ->
                    _uiState.update { it.copy(allActiveOrders = list, isLoading = false) }
                }
        }
    }

    private fun startElapsedTicker() {
        viewModelScope.launch {
            while (isActive) {
                delay(1000) // Ticker chaque seconde pour le calcul du temps écoulé
                _uiState.update { it.copy(currentTimeMillis = System.currentTimeMillis()) }
            }
        }
    }

    /**
     * Règle de monotonie stricte KDS :
     * RECOLTEE -> EN_PREPARATION -> PRETE -> REMISE
     */
    fun advanceOrderStatus(orderId: String, currentStatus: OrderStatus) {
        val nextStatus = when (currentStatus) {
            OrderStatus.RECOLTEE -> OrderStatus.EN_PREPARATION
            OrderStatus.EN_PREPARATION -> OrderStatus.PRETE
            OrderStatus.PRETE -> OrderStatus.REMISE
            else -> return
        }

        require(currentStatus.canTransitionTo(nextStatus)) {
            "Transition de statut interdite : $currentStatus vers $nextStatus"
        }

        viewModelScope.launch {
            // 1. Mise à jour de statut dans la base Room locale
            orderDao.updateOrderStatus(orderId, nextStatus)

            // 2. Émission d'un événement Outbox pour synchronisation WebSocket / HTTP
            val outboxEvent = SyncOutboxEntity(
                id = UUID.randomUUID().toString(),
                aggregateType = "ORDER",
                aggregateId = orderId,
                eventType = "ORDER_STATUS_CHANGED",
                payloadJson = "{\"orderId\":\"$orderId\",\"oldStatus\":\"$currentStatus\",\"newStatus\":\"$nextStatus\"}",
                timestampUtc = System.currentTimeMillis(),
                status = SyncStatus.PENDING,
                target = "LOCAL_HUB",
                retryCount = 0
            )
            orderDao.insertOutboxEvent(outboxEvent)
        }
    }
}
