package com.fastfood.core.sync

import android.util.Log
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import okhttp3.*
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

enum class ConnectionStatus {
    DISCONNECTED,
    CONNECTING,
    CONNECTED
}

@Singleton
class WebSocketSyncClient @Inject constructor(
    private val localHubDiscovery: LocalHubDiscovery
) {
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val client: OkHttpClient = OkHttpClient.Builder()
        .pingInterval(15, TimeUnit.SECONDS)
        .connectTimeout(5, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    private var webSocket: WebSocket? = null
    private var isIntentionalClose = false
    private var reconnectAttempts = 0

    private val _connectionStatus = MutableStateFlow(ConnectionStatus.DISCONNECTED)
    val connectionStatus: StateFlow<ConnectionStatus> = _connectionStatus.asStateFlow()

    private var onInboundMessageReceived: ((String) -> Unit)? = null

    fun setInboundListener(listener: (String) -> Unit) {
        this.onInboundMessageReceived = listener
    }

    fun connect() {
        if (_connectionStatus.value == ConnectionStatus.CONNECTED || _connectionStatus.value == ConnectionStatus.CONNECTING) {
            return
        }

        isIntentionalClose = false
        _connectionStatus.value = ConnectionStatus.CONNECTING

        val endpoint = localHubDiscovery.hubEndpoint.value
        val url = "ws://${endpoint.host}:${endpoint.port}/ws/sync"
        val request = Request.Builder().url(url).build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                Log.i("FastFood-WS", "WebSocket connecté au Local Hub ($url)")
                _connectionStatus.value = ConnectionStatus.CONNECTED
                reconnectAttempts = 0
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                Log.d("FastFood-WS", "Message reçu du Hub: $text")
                onInboundMessageReceived?.invoke(text)
            }

            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                webSocket.close(1000, null)
                _connectionStatus.value = ConnectionStatus.DISCONNECTED
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                Log.w("FastFood-WS", "Erreur WebSocket: ${t.message}. Tentative de reconnexion...")
                _connectionStatus.value = ConnectionStatus.DISCONNECTED
                scheduleReconnect()
            }
        })
    }

    fun send(payloadJson: String): Boolean {
        if (_connectionStatus.value != ConnectionStatus.CONNECTED) return false
        return webSocket?.send(payloadJson) ?: false
    }

    private fun scheduleReconnect() {
        if (isIntentionalClose) return
        scope.launch {
            val delayMs = calculateExponentialBackoff(reconnectAttempts)
            reconnectAttempts++
            Log.d("FastFood-WS", "Reconnexion dans ${delayMs}ms (Tentative #$reconnectAttempts)")
            delay(delayMs)
            connect()
        }
    }

    fun disconnect() {
        isIntentionalClose = true
        webSocket?.close(1000, "Normal closure")
        _connectionStatus.value = ConnectionStatus.DISCONNECTED
    }

    companion object {
        fun calculateExponentialBackoff(attempt: Int): Long {
            val base = 1000L // 1 seconde
            val maxDelay = 60000L // 60 secondes max
            val multiplier = 1L shl (attempt.coerceAtMost(6)) // 2^attempt
            return (base * multiplier).coerceAtMost(maxDelay)
        }
    }
}
