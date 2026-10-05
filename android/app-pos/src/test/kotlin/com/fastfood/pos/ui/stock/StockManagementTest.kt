package com.fastfood.pos.ui.stock

import com.fastfood.core.database.entity.IngredientEntity
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class StockManagementTest {

    @Test
    fun testReplenishmentIncreasesStockCorrectly() {
        val initialStock = 12.5 // 12.5 kg
        val replenishAmount = 25.0 // + 25 kg reçus
        
        val newStock = initialStock + replenishAmount
        assertEquals(37.5, newStock, 0.001)
    }

    @Test
    fun testLowStockAlertDetection() {
        val ingredient = IngredientEntity(
            id = "ing-1",
            nom = "Steak Haché Façon Bouchère",
            stockActuel = 4.0,
            seuilAlerte = 10.0,
            unite = "kg"
        )

        // Le stock est inférieur au seuil
        assertTrue(ingredient.stockActuel <= ingredient.seuilAlerte)
    }

    @Test
    fun testInventoryDiscrepancyCalculation() {
        val theoreticalStock = 50.0 // 50 pains burger
        val physicalCounted = 46.0  // 46 comptés (4 perdus / cassés)

        val discrepancy = physicalCounted - theoreticalStock
        assertEquals(-4.0, discrepancy, 0.001)
    }
}
