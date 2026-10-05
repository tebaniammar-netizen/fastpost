package com.fastfood.core.hardware.drawer

import com.fastfood.core.hardware.printer.PrinterDriver
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CashDrawerController @Inject constructor(
    private val printerDriver: PrinterDriver
) {
    suspend fun openCashDrawer(): Boolean {
        return printerDriver.openCashDrawer()
    }
}
