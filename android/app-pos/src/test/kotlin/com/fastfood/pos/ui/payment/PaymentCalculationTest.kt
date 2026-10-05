package com.fastfood.pos.ui.payment

import com.fastfood.core.model.money.Money
import org.junit.Assert.assertEquals
import org.junit.Test

class PaymentCalculationTest {

    @Test
    fun testCashChangeCalculationStrict() {
        val totalTtc = 1450L // 14.50 €
        val cashGiven = 2000L // Billet de 20.00 €

        val cashChange = maxOf(0L, cashGiven - totalTtc)
        assertEquals(550L, cashChange) // 5.50 € rendus
        assertEquals("5,50\u00A0€", Money(cashChange).formatEuro())
    }

    @Test
    fun testExactCashGivenGivesZeroChange() {
        val totalTtc = 1450L
        val cashGiven = 1450L

        val cashChange = maxOf(0L, cashGiven - totalTtc)
        assertEquals(0L, cashChange)
    }

    @Test
    fun testDailyCyclicOrderNumberFormatting() {
        val dailyNum = 42
        val formatted = String.format("%03d", dailyNum)
        assertEquals("042", formatted)
        
        val dateStr = "20261002"
        val terminalId = "C01"
        val reference = "CMD-$dateStr-$terminalId-$formatted"
        assertEquals("CMD-20261002-C01-042", reference)
    }
}
