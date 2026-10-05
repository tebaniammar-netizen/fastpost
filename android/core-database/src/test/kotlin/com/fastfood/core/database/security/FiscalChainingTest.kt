package com.fastfood.core.database.security

import com.fastfood.core.database.entity.OrderEntity
import com.fastfood.core.model.order.OrderStatus
import com.fastfood.core.model.order.OrderType
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class FiscalChainingTest {

    private val fiscalSecurityService = FiscalSecurityService()
    private val pinHasher = PinHasher()

    @Test
    fun testSha256Determinism() {
        val hash1 = FiscalSecurityService.sha256("TEST_FASTFOOD_DATA")
        val hash2 = FiscalSecurityService.sha256("TEST_FASTFOOD_DATA")
        assertEquals(hash1, hash2)
        assertEquals(64, hash1.length) // SHA-256 produit 64 caractères hexadécimaux
    }

    @Test
    fun testSaltedPinHashingAndVerification() {
        val pin = "1234"
        val salt = pinHasher.generateSalt()
        val hash = pinHasher.hashPin(pin, salt)

        // PIN correct
        assertTrue(pinHasher.verifyPin(pin, salt, hash))

        // PIN erroné
        assertFalse(pinHasher.verifyPin("9999", salt, hash))
        assertFalse(pinHasher.verifyPin("0000", salt, hash))
    }

    @Test
    fun testFiscalChainVerificationDetectsTampering() {
        val order1Hash = FiscalSecurityService.calculateOrderHash(
            FiscalSecurityService.GENESIS_HASH,
            "ord-1",
            "CMD-2026-001",
            100000L,
            1580L,
            1436L,
            144L,
            "TERM-01"
        )

        val order1 = OrderEntity(
            id = "ord-1",
            reference = "CMD-2026-001",
            terminalId = "TERM-01",
            caissierId = "usr-1",
            dateCreationUtc = 100000L,
            statut = OrderStatus.REMISE,
            typeCommande = OrderType.SUR_PLACE,
            montantTotalHtCentimes = 1436L,
            montantTotalTvaCentimes = 144L,
            montantTotalTtcCentimes = 1580L,
            signatureFiscale = order1Hash
        )

        val order2Hash = FiscalSecurityService.calculateOrderHash(
            order1Hash,
            "ord-2",
            "CMD-2026-002",
            105000L,
            2450L,
            2227L,
            223L,
            "TERM-01"
        )

        val order2 = OrderEntity(
            id = "ord-2",
            reference = "CMD-2026-002",
            terminalId = "TERM-01",
            caissierId = "usr-1",
            dateCreationUtc = 105000L,
            statut = OrderStatus.REMISE,
            typeCommande = OrderType.A_EMPORTER,
            montantTotalHtCentimes = 2227L,
            montantTotalTvaCentimes = 223L,
            montantTotalTtcCentimes = 2450L,
            signatureFiscale = order2Hash
        )

        // Chaîne initiale valide
        val validResult = fiscalSecurityService.verifyChainIntegrity(listOf(order1, order2))
        assertTrue(validResult.isChainIntact)
        assertEquals(2, validResult.totalVerifiedBlocks)

        // Altération frauduleuse du montant de la commande 1 (15,80€ modifié en 10,00€)
        val tamperedOrder1 = order1.copy(montantTotalTtcCentimes = 1000L)
        val corruptedResult = fiscalSecurityService.verifyChainIntegrity(listOf(tamperedOrder1, order2))
        assertFalse(corruptedResult.isChainIntact)
        assertEquals("ord-1", corruptedResult.compromisedBlockId)
    }
}
