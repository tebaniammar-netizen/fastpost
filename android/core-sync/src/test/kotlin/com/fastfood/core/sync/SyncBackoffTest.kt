package com.fastfood.core.sync

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class SyncBackoffTest {

    @Test
    fun testExponentialBackoffIncreasesUntilCap() {
        // Tentative 0: 1000 ms (1s)
        assertEquals(1000L, WebSocketSyncClient.calculateExponentialBackoff(0))

        // Tentative 1: 2000 ms (2s)
        assertEquals(2000L, WebSocketSyncClient.calculateExponentialBackoff(1))

        // Tentative 2: 4000 ms (4s)
        assertEquals(4000L, WebSocketSyncClient.calculateExponentialBackoff(2))

        // Tentative 3: 8000 ms (8s)
        assertEquals(8000L, WebSocketSyncClient.calculateExponentialBackoff(3))

        // Tentative 4: 16000 ms (16s)
        assertEquals(16000L, WebSocketSyncClient.calculateExponentialBackoff(4))

        // Tentative 5: 32000 ms (32s)
        assertEquals(32000L, WebSocketSyncClient.calculateExponentialBackoff(5))

        // Tentative 6 et plus : Plafond à 60000 ms (60s)
        assertEquals(60000L, WebSocketSyncClient.calculateExponentialBackoff(6))
        assertEquals(60000L, WebSocketSyncClient.calculateExponentialBackoff(10))
    }

    @Test
    fun testSyncEngineStateDefaultValues() {
        val state = SyncEngineState()
        assertEquals(ConnectionStatus.DISCONNECTED, state.connectionStatus)
        assertEquals(0, state.pendingOutboxCount)
        assertTrue(state.lastSyncTimestampUtc == null)
        assertTrue(!state.isSyncing)
    }
}
