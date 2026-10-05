package com.fastfood.core.sync

import android.util.Log
import com.fastfood.core.database.dao.OrderDao
import com.fastfood.core.database.dao.SyncOutboxDao
import com.fastfood.core.database.entity.SyncOutboxEntity
import com.fastfood.core.model.order.OrderStatus
import com.fastfood.core.model.order.SyncStatus
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.json.JSONObject
import javax.inject.Inject
import javax.inject.Singleton

data class SyncEngineState(
    val connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED,
    val pendingOutboxCount: Int = 0,
    val lastSyncTimestampUtc: Long? = null,
    val isSyncing: Boolean = false,
    val errorMessage: String? = null
)

@Singleton
class SyncEngine @Inject constructor(
    private val syncOutboxDao: SyncOutboxDao,
    private val orderDao: OrderDao,
    private val webSocketSyncClient: WebSocketSyncClient,
    private val localHubDiscovery: LocalHubDiscovery
) {
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    private val _engineState = MutableStateFlow(SyncEngineState())
    val engineState: StateFlow<SyncEngineState> = _engineState.asStateFlow()

    init {
        setupInboundMessageHandler()
        monitorConnectionAndOutbox()
    }

    fun start() {
        localHubDiscovery.startDiscovery()
        webSocketSyncClient.connect()
    }

    fun stop() {
        webSocketSyncClient.disconnect()
        localHubDiscovery.stopDiscovery()
    }

    private fun setupInboundMessageHandler() {
        webSocketSyncClient.setInboundListener { rawMessage ->
            try {
                val json = JSONObject(rawMessage)
                val eventType = json.optString("eventType")
                val payload = json.optJSONObject("payload") ?: return@setInboundListener

                when (eventType) {
                    "ORDER_STATUS_CHANGED" -> {
                        val orderId = payload.getString("orderId")
                        val newStatusStr = payload.getString("newStatus")
                        val newStatus = OrderStatus.valueOf(newStatusStr)
                        scope.launch {
                            orderDao.updateOrderStatus(orderId, newStatus)
                            Log.d("FastFood-SyncEngine", "Mise à jour statut commande reçue: $orderId -> $newStatus")
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e("FastFood-SyncEngine", "Erreur parsing message entrant: ${e.message}")
            }
        }
    }

    private fun monitorConnectionAndOutbox() {
        scope.launch {
            launch {
                webSocketSyncClient.connectionStatus.collect { status ->
                    _engineState.value = _engineState.value.copy(connectionStatus = status)
                    if (status == ConnectionStatus.CONNECTED) {
                        flushOutbox()
                    }
                }
            }

            launch {
                syncOutboxDao.getPendingEventsFlow().collect { pendingList ->
                    _engineState.value = _engineState.value.copy(pendingOutboxCount = pendingList.size)
                    if (webSocketSyncClient.connectionStatus.value == ConnectionStatus.CONNECTED && pendingList.isNotEmpty()) {
                        flushOutbox()
                    }
                }
            }
        }
    }

    /**
     * Dépile la file d'attente transactionnelle Outbox et l'envoie via WebSocket.
     */
    suspend fun flushOutbox() = withContext(Dispatchers.IO) {
        if (_engineState.value.isSyncing) return@withContext
        _engineState.value = _engineState.value.copy(isSyncing = true)

        try {
            val pendingEvents = syncOutboxDao.getPendingEvents(batchSize = 25)
            for (event in pendingEvents) {
                val frame = JSONObject().apply {
                    put("id", event.id)
                    put("aggregateType", event.aggregateType)
                    put("aggregateId", event.aggregateId)
                    put("eventType", event.eventType)
                    put("payload", JSONObject(event.payloadJson))
                    put("timestampUtc", event.timestampUtc)
                }.toString()

                val sent = webSocketSyncClient.send(frame)
                if (sent) {
                    syncOutboxDao.markEventAsSynced(event.id)
                    _engineState.value = _engineState.value.copy(lastSyncTimestampUtc = System.currentTimeMillis())
                } else {
                    syncOutboxDao.incrementRetryCount(event.id)
                    break
                }
            }
        } catch (e: Exception) {
            _engineState.value = _engineState.value.copy(errorMessage = e.message)
        } finally {
            _engineState.value = _engineState.value.copy(isSyncing = false)
        }
    }
}
