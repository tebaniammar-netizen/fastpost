package com.fastfood.core.hardware.printer

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.InetSocketAddress
import java.net.Socket

class NetworkEscPosPrinter(
    val ipAddress: String,
    val port: Int = 9100,
    override val name: String = "Imprimante Réseau ($ipAddress:$port)"
) : PrinterDriver {

    override var isConnected: Boolean = false
        private set

    override suspend fun printRawBytes(bytes: ByteArray): Boolean = withContext(Dispatchers.IO) {
        var socket: Socket? = null
        try {
            socket = Socket()
            socket.connect(InetSocketAddress(ipAddress, port), 3000) // 3s timeout
            socket.soTimeout = 5000
            val output = socket.getOutputStream()
            output.write(bytes)
            output.flush()
            isConnected = true
            true
        } catch (e: Exception) {
            Log.e("FastFood-Printer", "Erreur impression sur $ipAddress:$port : ${e.message}")
            isConnected = false
            false
        } finally {
            try { socket?.close() } catch (_: Exception) {}
        }
    }

    override suspend fun openCashDrawer(): Boolean {
        val pulseCmd = EscPosCommandBuilder().openCashDrawer().toByteArray()
        return printRawBytes(pulseCmd)
    }

    override suspend fun cutPaper(fullCut: Boolean): Boolean {
        val cutCmd = EscPosCommandBuilder().cutPaper(fullCut).toByteArray()
        return printRawBytes(cutCmd)
    }
}
