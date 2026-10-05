package com.fastfood.core.hardware.printer

interface PrinterDriver {
    val name: String
    val isConnected: Boolean
    suspend fun printRawBytes(bytes: ByteArray): Boolean
    suspend fun openCashDrawer(): Boolean
    suspend fun cutPaper(fullCut: Boolean = false): Boolean
}
