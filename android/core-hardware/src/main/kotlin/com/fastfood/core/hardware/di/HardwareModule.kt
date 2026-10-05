package com.fastfood.core.hardware.di

import com.fastfood.core.hardware.drawer.CashDrawerController
import com.fastfood.core.hardware.printer.EmulatedEscPosPrinter
import com.fastfood.core.hardware.printer.PrinterDriver
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object HardwareModule {

    @Provides
    @Singleton
    fun providePrinterDriver(
        emulatedPrinter: EmulatedEscPosPrinter
    ): PrinterDriver {
        return emulatedPrinter
    }

    @Provides
    @Singleton
    fun provideCashDrawerController(
        printerDriver: PrinterDriver
    ): CashDrawerController {
        return CashDrawerController(printerDriver)
    }
}
