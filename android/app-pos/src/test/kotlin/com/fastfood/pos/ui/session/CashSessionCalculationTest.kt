package com.fastfood.pos.ui.session

import com.fastfood.core.model.money.Money
import org.junit.Assert.assertEquals
import org.junit.Test

class CashSessionCalculationTest {

    @Test
    fun testTheoreticalCashBalance() {
        val fondInitial = 15000L // 150.00 €
        val ventesEspeces = 3280L // 32.80 € encaissés en espèces

        val theoreticalCash = fondInitial + ventesEspeces
        assertEquals(18280L, theoreticalCash) // 182.80 € attendus dans le tiroir
        assertEquals("182,80\u00A0€", Money(theoreticalCash).formatEuro())
    }

    @Test
    fun testCashDiscrepancyCalculation() {
        val theoreticalCash = 18280L
        val countedCashShort = 17780L // 5.00 € manquants

        val discrepancyShort = countedCashShort - theoreticalCash
        assertEquals(-500L, discrepancyShort)

        val countedCashOver = 18580L // 3.00 € en trop
        val discrepancyOver = countedCashOver - theoreticalCash
        assertEquals(300L, discrepancyOver)
    }

    @Test
    fun testZReportFinancialTaxesBreakdown() {
        val totalVentes = 25000L // 250.00 € TTC à 10%
        val ht = Math.round(totalVentes / 1.10)
        val tva = totalVentes - ht

        assertEquals(22727L, ht) // 227.27 € HT
        assertEquals(2273L, tva)  // 22.73 € TVA
        assertEquals(totalVentes, ht + tva)
    }
}
