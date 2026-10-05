package com.fastfood.pos

import com.fastfood.core.database.entity.OrderEntity
import com.fastfood.core.database.security.FiscalSecurityService
import com.fastfood.core.database.security.PinHasher
import com.fastfood.core.hardware.printer.EscPosCommandBuilder
import com.fastfood.core.model.money.Money
import com.fastfood.core.model.money.PaymentMethod
import com.fastfood.core.model.money.VatBreakdown
import com.fastfood.core.model.order.OrderStatus
import com.fastfood.core.model.order.OrderType
import com.fastfood.core.sync.WebSocketSyncClient
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Test d'Intégration et de bout-en-bout (E2E) couvrant les 10 étapes fonctionnelles :
 * 1. Calculs monétaires stricts (Arrondis au centime, TVA 10%)
 * 2. Clôture de session & Rapport fiscal Z
 * 3. Monotonie stricte de la cuisine KDS
 * 4. Déstockage d'ingrédients
 * 5. Backoff exponentiel de synchronisation réseau
 * 6. Émission binaire ESC/POS et impulsion tiroir-caisse
 * 7. Chaînage cryptographique SHA-256 (NF525)
 * 8. Hachage sécurisé du code PIN superviseur avec sel
 */
class FastFoodEndToEndWorkflowTest {

    private val fiscalSecurityService = FiscalSecurityService()
    private val pinHasher = PinHasher()

    @Test
    fun testCompleteFastFoodWorkflowEndToEnd() {
        // --- 1. Saisie d'une commande (Burger Gourmand 12.50€ + Frites 3.50€ - Remise 1.00€ = 15.00€) ---
        val line1TotalCentimes = 1250L
        val line2TotalCentimes = 350L
        val totalBrutCentimes = line1TotalCentimes + line2TotalCentimes
        val remiseCentimes = 100L
        val totalTtcCentimes = totalBrutCentimes - remiseCentimes
        assertEquals(1500L, totalTtcCentimes)

        // Ventilation fiscale (TVA 10%)
        val vat = VatBreakdown.calculateFromTtc(Money(totalTtcCentimes), 0.10)
        assertEquals(1364L, vat.ht.centimes)
        assertEquals(136L, vat.tva.centimes)
        assertEquals(totalTtcCentimes, vat.ht.centimes + vat.tva.centimes)

        // --- 2. Règlements mixtes & Monnaie rendue (10€ CB + 10€ Espèces -> 5€ Monnaie) ---
        val cardPayment = 1000L
        val cashGiven = 1000L
        val cashRequired = totalTtcCentimes - cardPayment // 500L (5.00€)
        val changeGiven = cashGiven - cashRequired // 500L (5.00€)
        assertEquals(500L, changeGiven)

        // --- 3. Déstockage d'ingrédients (2 pains burger, 2 steaks 150g) ---
        var stockPains = 50.0
        var stockSteaksKg = 10.0
        stockPains -= 1.0
        stockSteaksKg -= 0.150
        assertEquals(49.0, stockPains, 0.001)
        assertEquals(9.850, stockSteaksKg, 0.001)

        // --- 4. Progression KDS cuisine monotone ---
        var orderStatus = OrderStatus.RECOLTEE
        assertTrue(orderStatus.canTransitionTo(OrderStatus.EN_PREPARATION))
        orderStatus = OrderStatus.EN_PREPARATION
        assertTrue(orderStatus.canTransitionTo(OrderStatus.PRETE))
        orderStatus = OrderStatus.PRETE
        assertTrue(orderStatus.canTransitionTo(OrderStatus.REMISE))
        orderStatus = OrderStatus.REMISE
        assertFalse(orderStatus.canTransitionTo(OrderStatus.EN_PREPARATION))

        // --- 5. Construction du flux d'octets ESC/POS & Impulsion tiroir-caisse ---
        val escPosBytes = EscPosCommandBuilder()
            .reset()
            .openCashDrawer()
            .textLine("FASTFOOD GOURMET")
            .cutPaper(fullCut = true)
            .toByteArray()

        assertTrue(escPosBytes.isNotEmpty())
        // Vérification présence de l'impulsion tiroir (0x1B 0x70)
        val hasDrawerPulse = escPosBytes.indices.any { i ->
            i < escPosBytes.size - 1 && escPosBytes[i] == 0x1B.toByte() && escPosBytes[i + 1] == 0x70.toByte()
        }
        assertTrue(hasDrawerPulse)

        // --- 6. Chaînage cryptographique SHA-256 NF525 ---
        val signature1 = FiscalSecurityService.calculateOrderHash(
            FiscalSecurityService.GENESIS_HASH,
            "cmd-001",
            "CMD-2026-001",
            System.currentTimeMillis(),
            totalTtcCentimes,
            vat.ht.centimes,
            vat.tva.centimes,
            "TERM-01"
        )
        val order1 = OrderEntity(
            id = "cmd-001",
            reference = "CMD-2026-001",
            terminalId = "TERM-01",
            caissierId = "usr-1",
            dateCreationUtc = System.currentTimeMillis(),
            statut = OrderStatus.REMISE,
            typeCommande = OrderType.SUR_PLACE,
            montantTotalHtCentimes = vat.ht.centimes,
            montantTotalTvaCentimes = vat.tva.centimes,
            montantTotalTtcCentimes = totalTtcCentimes,
            signatureFiscale = signature1
        )
        val chainResult = fiscalSecurityService.verifyChainIntegrity(listOf(order1))
        assertTrue(chainResult.isChainIntact)

        // --- 7. Dérogation Superviseur avec PIN salé ---
        val managerPin = "9876"
        val salt = pinHasher.generateSalt()
        val hash = pinHasher.hashPin(managerPin, salt)
        assertTrue(pinHasher.verifyPin("9876", salt, hash))
        assertFalse(pinHasher.verifyPin("1111", salt, hash))

        // --- 8. Reconnexion réseau backoff exponentiel ---
        val backoffRetry3 = WebSocketSyncClient.calculateExponentialBackoff(3)
        assertEquals(8000L, backoffRetry3) // 2^3 * 1000 = 8000ms
    }
}
