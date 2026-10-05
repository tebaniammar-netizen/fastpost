package com.fastfood.core.database.dao

import androidx.room.*
import com.fastfood.core.database.entity.IngredientEntity
import com.fastfood.core.database.entity.RecipeLineEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface IngredientDao {

    @Query("SELECT * FROM ingredients ORDER BY nom ASC")
    fun getAllIngredientsFlow(): Flow<List<IngredientEntity>>

    @Query("SELECT * FROM ingredients WHERE stock_actuel <= seuil_alerte ORDER BY stock_actuel ASC")
    fun getAlertIngredientsFlow(): Flow<List<IngredientEntity>>

    @Query("SELECT * FROM ingredients WHERE id = :id")
    suspend fun getIngredientById(id: String): IngredientEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertIngredients(ingredients: List<IngredientEntity>)

    @Query("UPDATE ingredients SET stock_actuel = stock_actuel - :quantite WHERE id = :ingredientId")
    suspend fun deductStock(ingredientId: String, quantite: Double)

    @Query("UPDATE ingredients SET stock_actuel = stock_actuel + :quantite WHERE id = :ingredientId")
    suspend fun addStock(ingredientId: String, quantite: Double)

    @Query("SELECT * FROM recette_lignes WHERE produit_id = :productId")
    suspend fun getRecipeForProduct(productId: String): List<RecipeLineEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecipeLines(lines: List<RecipeLineEntity>)
}
