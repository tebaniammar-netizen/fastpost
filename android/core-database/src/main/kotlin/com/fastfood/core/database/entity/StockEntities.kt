package com.fastfood.core.database.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import com.fastfood.core.model.stock.StockUnit
import java.util.UUID

@Entity(
    tableName = "ingredients",
    indices = [Index(value = ["nom"])]
)
data class IngredientEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "nom")
    val nom: String,

    @ColumnInfo(name = "unite")
    val unite: StockUnit,

    @ColumnInfo(name = "stock_actuel")
    val stockActuel: Double,

    @ColumnInfo(name = "seuil_alerte")
    val seuilAlerte: Double,

    @ColumnInfo(name = "cout_unitaire_centimes")
    val coutUnitaireCentimes: Long
)

@Entity(
    tableName = "recette_lignes",
    foreignKeys = [
        ForeignKey(
            entity = ProductEntity::class,
            parentColumns = ["id"],
            childColumns = ["produit_id"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = IngredientEntity::class,
            parentColumns = ["id"],
            childColumns = ["ingredient_id"],
            onDelete = ForeignKey.RESTRICT
        )
    ],
    indices = [
        Index(value = ["produit_id"]),
        Index(value = ["ingredient_id"])
    ]
)
data class RecipeLineEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "produit_id")
    val produitId: String,

    @ColumnInfo(name = "variante_id")
    val varianteId: String? = null,

    @ColumnInfo(name = "ingredient_id")
    val ingredientId: String,

    @ColumnInfo(name = "quantite_requise")
    val quantiteRequise: Double
)
