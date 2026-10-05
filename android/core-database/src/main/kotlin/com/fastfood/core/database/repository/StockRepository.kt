package com.fastfood.core.database.repository

import com.fastfood.core.database.dao.AuditLogDao
import com.fastfood.core.database.dao.IngredientDao
import com.fastfood.core.database.entity.AuditLogEntity
import com.fastfood.core.database.entity.IngredientEntity
import com.fastfood.core.database.entity.RecipeLineEntity
import com.fastfood.core.model.order.UserRole
import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

data class RecipeItemDetail(
    val recipeLine: RecipeLineEntity,
    val ingredientNom: String,
    val stockDisponible: Double,
    val unite: String
)

interface StockRepository {
    fun getAllIngredientsFlow(): Flow<List<IngredientEntity>>
    fun getLowStockIngredientsFlow(): Flow<List<IngredientEntity>>
    suspend fun getIngredientById(id: String): IngredientEntity?
    suspend fun replenishStock(
        ingredientId: String,
        quantiteAjoutee: Double,
        fournisseur: String?,
        numeroBonLivraison: String?,
        userId: String
    ): IngredientEntity
    suspend fun adjustInventory(
        ingredientId: String,
        stockReelPhysique: Double,
        motif: String,
        userId: String
    ): IngredientEntity
    suspend fun getRecipeForProduct(productId: String): List<RecipeLineEntity>
}

@Singleton
class StockRepositoryImpl @Inject constructor(
    private val ingredientDao: IngredientDao,
    private val auditLogDao: AuditLogDao
) : StockRepository {

    override fun getAllIngredientsFlow(): Flow<List<IngredientEntity>> = ingredientDao.getAllIngredientsFlow()

    override fun getLowStockIngredientsFlow(): Flow<List<IngredientEntity>> = ingredientDao.getLowStockIngredientsFlow()

    override suspend fun getIngredientById(id: String): IngredientEntity? = ingredientDao.getIngredientById(id)

    override suspend fun replenishStock(
        ingredientId: String,
        quantiteAjoutee: Double,
        fournisseur: String?,
        numeroBonLivraison: String?,
        userId: String
    ): IngredientEntity {
        require(quantiteAjoutee > 0) { "La quantité réapprovisionnée doit être strictement positive" }
        
        val ingredient = ingredientDao.getIngredientById(ingredientId) 
            ?: throw IllegalArgumentException("Ingrédient introuvable : $ingredientId")
        
        val nouveauStock = ingredient.stockActuel + quantiteAjoutee
        val updated = ingredient.copy(stockActuel = nouveauStock)
        ingredientDao.updateIngredient(updated)

        // Traçabilité d'entrée en stock
        auditLogDao.insertAuditLog(
            AuditLogEntity(
                id = UUID.randomUUID().toString(),
                dateUtc = System.currentTimeMillis(),
                action = "REAPPROVISIONNEMENT_STOCK",
                utilisateurId = userId,
                utilisateurRole = UserRole.GESTIONNAIRE,
                entiteType = "INGREDIENT",
                entiteId = ingredientId,
                detailsJson = "{\"quantiteAjoutee\":$quantiteAjoutee,\"nouveauStock\":$nouveauStock,\"fournisseur\":\"$fournisseur\",\"bl\":\"$numeroBonLivraison\"}"
            )
        )

        return updated
    }

    override suspend fun adjustInventory(
        ingredientId: String,
        stockReelPhysique: Double,
        motif: String,
        userId: String
    ): IngredientEntity {
        require(stockReelPhysique >= 0) { "Le stock physique ne peut pas être négatif" }

        val ingredient = ingredientDao.getIngredientById(ingredientId)
            ?: throw IllegalArgumentException("Ingrédient introuvable : $ingredientId")

        val ecart = stockReelPhysique - ingredient.stockActuel
        val updated = ingredient.copy(stockActuel = stockReelPhysique)
        ingredientDao.updateIngredient(updated)

        // Traçabilité d'écart d'inventaire
        auditLogDao.insertAuditLog(
            AuditLogEntity(
                id = UUID.randomUUID().toString(),
                dateUtc = System.currentTimeMillis(),
                action = "INVENTAIRE_RECTIFICATIF",
                utilisateurId = userId,
                utilisateurRole = UserRole.GESTIONNAIRE,
                entiteType = "INGREDIENT",
                entiteId = ingredientId,
                detailsJson = "{\"ancienStock\":${ingredient.stockActuel},\"stockReel\":$stockReelPhysique,\"ecart\":$ecart,\"motif\":\"$motif\"}"
            )
        )

        return updated
    }

    override suspend fun getRecipeForProduct(productId: String): List<RecipeLineEntity> {
        return ingredientDao.getRecipeForProduct(productId)
    }
}
