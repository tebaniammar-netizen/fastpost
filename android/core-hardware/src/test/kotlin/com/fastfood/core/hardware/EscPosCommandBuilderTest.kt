package com.fastfood.core.hardware

import com.fastfood.core.hardware.printer.EscPosCommandBuilder
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class EscPosCommandBuilderTest {

    @Test
    fun testInitSequence() {
        val bytes = EscPosCommandBuilder().reset().toByteArray()
        assertArrayEquals(byteArrayOf(0x1B, 0x40), bytes)
    }

    @Test
    fun testCashDrawerPulseSequence() {
        val bytes = EscPosCommandBuilder().openCashDrawer().toByteArray()
        // ESC p 0 25 250 (0x1B 0x70 0x00 0x19 0xFA)
        assertArrayEquals(byteArrayOf(0x1B, 0x70, 0x00, 0x19, 0xFA.toByte()), bytes)
    }

    @Test
    fun testPaperCutSequence() {
        val bytes = EscPosCommandBuilder().cutPaper(fullCut = true).toByteArray()
        // Contient GS V 'B' 0 (0x1D 0x56 0x42 0x00)
        assertTrue(bytes.size >= 4)
        val last4 = bytes.takeLast(4).toByteArray()
        assertArrayEquals(byteArrayOf(0x1D, 0x56, 0x42, 0x00), last4)
    }

    @Test
    fun testTwoColumnAlignmentFormatting() {
        val builder = EscPosCommandBuilder()
        builder.twoColumnLine("TOTAL TTC :", "15,80 €", totalColumns = 30)
        val text = String(builder.toByteArray())
        
        assertTrue(text.startsWith("TOTAL TTC :"))
        assertTrue(text.contains("15,80 €"))
        assertEquals(31, text.length) // 30 caractères + '\n' (0x0A)
    }
}
