package com.fastfood.core.model.stock

import com.fastfood.core.model.money.Money

enum class StockUnit {
    GRAMME,
    MILLILITRE,
    PIECE
}

enum class StockMovementType {
    VENTE_COMMANDE,
    LIVRAISON_FOURNISSEUR,
    PERTE_CUISINE,
    INVENTAIRE_RECTIFICATIF,
    ANNULATION_COMMANDE
}

data class StockIngredient(
    val id: String,
    val nom: String,
    val unite: StockUnit,
    val stockActuel: Double,
    val seuilAlerte: Double,
    val coutUnitaire: Money
) {
    val estEnAlerte: Boolean
        get() = stockActuel <= seuilAlerte
}

data class RecipeComponent(
    val ingredientId: String,
    val quantiteRequise: Double
)
