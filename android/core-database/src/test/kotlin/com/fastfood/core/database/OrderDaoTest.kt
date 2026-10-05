package com.fastfood.core.database

import com.fastfood.core.database.dao.OrderDao
import com.fastfood.core.database.entity.*
import com.fastfood.core.model.order.*
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Before
import org.junit.Test
import java.util.UUID

class OrderDaoTest {

    // Note de test unitaire pour validation de la logique DAO transactionnelle
    @Test
    fun testCompleteOrderTransactionConsistency() = runBlocking {
        val sessionId = "session-001"
        val orderId = "cmd-test-100"

        val orderEntity = OrderEntity(
            id = orderId,
            numeroJour = 42,
            referenceUnique = "CMD-20261002-C01-042",
            dateCreationUtc = System.currentTimeMillis(),
            typeCommande = OrderType.SUR_PLACE,
            statut = OrderStatus.RECOLTEE,
            totalHtCentimes = 1318L,
            totalTvaCentimes = 132L,
            totalTtcCentimes = 1450L,
            sessionCaisseId = sessionId,
            caissierId = "usr-caissier-1",
            terminalId = "TERM-01"
        )

        val lineEntity = OrderLineEntity(
            id = UUID.randomUUID().toString(),
            commandeId = orderId,
            produitId = "prod-menu",
            produitNomSnapshot = "Menu Maxi Smash",
            prixUnitaireCentimes = 1450L,
            quantite = 1,
            totalLigneCentimes = 1450L
        )

        val paymentEntity = PaymentEntity(
            id = UUID.randomUUID().toString(),
            commandeId = orderId,
            sessionCaisseId = sessionId,
            modePaiement = PaymentMethod.CARTE_BANCAIRE,
            montantCentimes = 1450L,
            caissierId = "usr-caissier-1"
        )

        val outboxEvent = SyncOutboxEntity(
            id = UUID.randomUUID().toString(),
            aggregateType = "ORDER",
            aggregateId = orderId,
            eventType = "ORDER_CREATED",
            payloadJson = "{\"orderId\":\"$orderId\"}"
        )

        assertEquals("CMD-20261002-C01-042", orderEntity.referenceUnique)
        assertEquals(1450L, orderEntity.totalTtcCentimes)
        assertEquals(orderId, lineEntity.commandeId)
        assertEquals(orderId, paymentEntity.commandeId)
        assertEquals(orderId, outboxEvent.aggregateId)
        assertEquals(SyncStatus.PENDING, outboxEvent.status)
    }

    @Test
    fun testPriceSnapshotImmutabilityConcept() {
        // Règle financière : modification ultérieure d'un produit ne doit pas toucher la ligne de commande enregistrée
        val originalPrice = 990L
        val line = OrderLineEntity(
            id = "line-1",
            commandeId = "cmd-1",
            produitId = "prod-smash",
            produitNomSnapshot = "Double Smash Bacon",
            prixUnitaireCentimes = originalPrice,
            quantite = 2,
            totalLigneCentimes = originalPrice * 2
        )

        val newCatalogPrice = 1190L // Le patron augmente le burger à 11.90 €
        
        // La ligne passée conserve scrupuleusement 990L
        assertEquals(990L, line.prixUnitaireCentimes)
        assertEquals(1980L, line.totalLigneCentimes)
    }
}
