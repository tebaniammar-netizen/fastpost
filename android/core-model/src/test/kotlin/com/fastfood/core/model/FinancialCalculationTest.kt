package com.fastfood.core.model

import com.fastfood.core.model.money.Money
import com.fastfood.core.model.order.*
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Assert.assertFalse
import org.junit.Test

class FinancialCalculationTest {

    @Test
    fun testMoneyArithmeticAndZeroOverflow() {
        val m1 = Money(1550L) // 15.50 €
        val m2 = Money(450L)  // 4.50 €
        
        val sum = m1 + m2
        assertEquals(2000L, sum.centimes)

        val diff = m1 - m2
        assertEquals(1100L, diff.centimes)

        val mult = m2 * 3
        assertEquals(1350L, mult.centimes)
    }

    @Test
    fun testTvaCalculationStrictRounding() {
        // Produit vendu 10.00 € TTC à un taux de 10.0% (1000 bp)
        val ttc = Money(1000L)
        val ht = ttc.calculateHt(1000)
        val tva = ttc.calculateTva(1000)

        // 1000 / 1.10 = 909.0909 -> arrondi 909 centimes (9.09 €)
        // TVA = 1000 - 909 = 91 centimes (0.91 €)
        assertEquals(909L, ht.centimes)
        assertEquals(91L, tva.centimes)
        assertEquals(ttc.centimes, (ht + tva).centimes)
    }

    @Test
    fun testOrderLineWithMultipleExtras() {
        val burgerBase = Money(890L) // 8.90 €
        val extraBacon = OrderExtra("ext-1", "Bacon", Money(150L))
        val extraCheddar = OrderExtra("ext-2", "Cheddar", Money(100L))

        val line = OrderLine(
            id = "line-1",
            produitId = "prod-1",
            produitNomSnapshot = "Burger Classic",
            prixUnitaire = burgerBase,
            quantite = 2,
            extras = listOf(extraBacon, extraCheddar)
        )

        // Prix unitaire = 890 + 150 + 100 = 1140 centimes (11.40 €)
        // Total pour 2 unités = 1140 * 2 = 2280 centimes (22.80 €)
        assertEquals(2280L, line.totalLigne.centimes)
    }

    @Test
    fun testOrderStatusMonotonicTransition() {
        // RECOLTEE -> EN_PREPARATION -> PRETE -> REMISE
        assertTrue(OrderStatus.RECOLTEE.canTransitionTo(OrderStatus.EN_PREPARATION))
        assertTrue(OrderStatus.EN_PREPARATION.canTransitionTo(OrderStatus.PRETE))
        assertTrue(OrderStatus.PRETE.canTransitionTo(OrderStatus.REMISE))

        // Rétrogradations interdites
        assertFalse(OrderStatus.PRETE.canTransitionTo(OrderStatus.EN_PREPARATION))
        assertFalse(OrderStatus.REMISE.canTransitionTo(OrderStatus.RECOLTEE))
    }

    @Test
    fun testOrderTotalWithAuthorizedDiscount() {
        val line = OrderLine(
            id = "line-1",
            produitId = "prod-1",
            produitNomSnapshot = "Menu Maxi",
            prixUnitaire = Money(1500L),
            quantite = 1
        )

        val order = Order(
            id = "cmd-test",
            numeroJour = 1,
            referenceUnique = "CMD-001",
            typeCommande = OrderType.SUR_PLACE,
            lignes = listOf(line),
            remise = Money(300L), // 3.00 € de remise
            sessionCaisseId = "sess-1",
            caissierId = "usr-1",
            terminalId = "term-1"
        )

        assertEquals(1500L, order.totalBrutTtc.centimes)
        assertEquals(1200L, order.totalNetTtc.centimes)
    }
}
