package com.fastfood.core.database.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(
    tableName = "categories",
    indices = [Index(value = ["ordre_affichage"])]
)
data class CategoryEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "nom")
    val nom: String,

    @ColumnInfo(name = "icone")
    val icone: String,

    @ColumnInfo(name = "ordre_affichage")
    val ordreAffichage: Int,

    @ColumnInfo(name = "est_actif")
    val estActif: Boolean = true,

    @ColumnInfo(name = "derniere_maj_utc")
    val derniereMajUtc: Long = System.currentTimeMillis()
)

@Entity(
    tableName = "produits",
    foreignKeys = [
        ForeignKey(
            entity = CategoryEntity::class,
            parentColumns = ["id"],
            childColumns = ["categorie_id"],
            onDelete = ForeignKey.RESTRICT
        )
    ],
    indices = [Index(value = ["categorie_id"])]
)
data class ProductEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "categorie_id")
    val categorieId: String,

    @ColumnInfo(name = "nom")
    val nom: String,

    @ColumnInfo(name = "description")
    val description: String? = null,

    @ColumnInfo(name = "prix_base_centimes")
    val prixBaseCentimes: Long, // Stocké en centimes entiers stricts

    @ColumnInfo(name = "tva_taux_bp")
    val tvaTauxBp: Int = 1000, // 1000 points de base = 10.0%

    @ColumnInfo(name = "image_url")
    val imageUrl: String? = null,

    @ColumnInfo(name = "disponible")
    val disponible: Boolean = true,

    @ColumnInfo(name = "version")
    val version: Int = 1
)

@Entity(
    tableName = "produit_variantes",
    foreignKeys = [
        ForeignKey(
            entity = ProductEntity::class,
            parentColumns = ["id"],
            childColumns = ["produit_id"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index(value = ["produit_id"])]
)
data class ProductVariantEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "produit_id")
    val produitId: String,

    @ColumnInfo(name = "nom")
    val nom: String,

    @ColumnInfo(name = "prix_differentiel_centimes")
    val prixDifferentielCentimes: Long = 0L,

    @ColumnInfo(name = "ordre")
    val ordre: Int = 0
)

@Entity(
    tableName = "produit_extras",
    indices = [Index(value = ["nom"])]
)
data class ProductExtraEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String = UUID.randomUUID().toString(),

    @ColumnInfo(name = "nom")
    val nom: String,

    @ColumnInfo(name = "prix_centimes")
    val prixCentimes: Long,

    @ColumnInfo(name = "ingredient_id")
    val ingredientId: String? = null
)
