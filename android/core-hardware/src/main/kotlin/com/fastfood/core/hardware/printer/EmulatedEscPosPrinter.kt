package com.fastfood.core.hardware.printer

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.nio.charset.Charset
import javax.inject.Inject
import javax.inject.Singleton

data class PrintedJob(
    val id: String = java.util.UUID.randomUUID().toString(),
    val timestampUtc: Long = System.currentTimeMillis(),
    val rawBytesCount: Int,
    val decodedText: String,
    val didTriggerDrawer: Boolean,
    val didCutPaper: Boolean
)

@Singleton
class EmulatedEscPosPrinter @Inject constructor() : PrinterDriver {

    override val name: String = "Émulateur Virtuel ESC/POS (80mm)"
    override val isConnected: Boolean = true

    private val _printedJobs = MutableStateFlow<List<PrintedJob>>(emptyList())
    val printedJobs: StateFlow<List<PrintedJob>> = _printedJobs.asStateFlow()

    private val _drawerOpenCount = MutableStateFlow(0)
    val drawerOpenCount: StateFlow<Int> = _drawerOpenCount.asStateFlow()

    override suspend fun printRawBytes(bytes: ByteArray): Boolean {
        // Détecte les impulsions tiroir (0x1B 0x70)
        var hasDrawerKick = false
        var hasCutPaper = false

        for (i in 0 until bytes.size - 2) {
            if (bytes[i] == 0x1B.toByte() && bytes[i + 1] == 0x70.toByte()) {
                hasDrawerKick = true
                _drawerOpenCount.value += 1
            }
            if (bytes[i] == 0x1D.toByte() && bytes[i + 1] == 0x56.toByte()) {
                hasCutPaper = true
            }
        }

        // Nettoie les octets de commande ESC/POS pour obtenir le texte lisible
        val textBuilder = StringBuilder()
        var i = 0
        while (i < bytes.size) {
            val b = bytes[i].toInt() and 0xFF
            if (b == 0x1B || b == 0x1D) {
                // Ignore commandes d'échappement ESC/GS
                i += 2
            } else if (b >= 32 || b == 10 || b == 13) {
                textBuilder.append(bytes[i].toInt().toChar())
                i++
            } else {
                i++
            }
        }

        val job = PrintedJob(
            rawBytesCount = bytes.size,
            decodedText = textBuilder.toString(),
            didTriggerDrawer = hasDrawerKick,
            didCutPaper = hasCutPaper
        )

        _printedJobs.value = listOf(job) + _printedJobs.value
        return true
    }

    override suspend fun openCashDrawer(): Boolean {
        val pulseCmd = EscPosCommandBuilder().openCashDrawer().toByteArray()
        return printRawBytes(pulseCmd)
    }

    override suspend fun cutPaper(fullCut: Boolean): Boolean {
        val cutCmd = EscPosCommandBuilder().cutPaper(fullCut).toByteArray()
        return printRawBytes(cutCmd)
    }

    fun clearHistory() {
        _printedJobs.value = emptyList()
    }
}
