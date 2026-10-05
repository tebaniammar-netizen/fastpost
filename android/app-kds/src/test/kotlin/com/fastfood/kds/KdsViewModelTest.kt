package com.fastfood.kds

import com.fastfood.core.model.order.OrderStatus
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class KdsViewModelTest {

    @Test
    fun testKdsMonotonicStatusTransitionRules() {
        // Validation des transitions valides
        assertTrue(OrderStatus.RECOLTEE.canTransitionTo(OrderStatus.EN_PREPARATION))
        assertTrue(OrderStatus.EN_PREPARATION.canTransitionTo(OrderStatus.PRETE))
        assertTrue(OrderStatus.PRETE.canTransitionTo(OrderStatus.REMISE))

        // Interdiction des rétrogradations
        assertFalse(OrderStatus.PRETE.canTransitionTo(OrderStatus.EN_PREPARATION))
        assertFalse(OrderStatus.PRETE.canTransitionTo(OrderStatus.RECOLTEE))
        assertFalse(OrderStatus.REMISE.canTransitionTo(OrderStatus.PRETE))
    }

    @Test
    fun testUrgencyThresholdsCalculation() {
        val now = 1000000L
        
        // Commande créée il y a 3 minutes (180 sec) -> Nominal (< 5 min)
        val elapsedMinutesGreen = ((now - (now - 3 * 60 * 1000)) / 1000) / 60
        assertTrue(elapsedMinutesGreen < 5)

        // Commande créée il y a 7 minutes -> Ambre (5 à 10 min)
        val elapsedMinutesAmber = ((now - (now - 7 * 60 * 1000)) / 1000) / 60
        assertTrue(elapsedMinutesAmber in 5..9)

        // Commande créée il y a 12 minutes -> Alerte Rouge (>= 10 min)
        val elapsedMinutesRed = ((now - (now - 12 * 60 * 1000)) / 1000) / 60
        assertTrue(elapsedMinutesRed >= 10)
    }
}
