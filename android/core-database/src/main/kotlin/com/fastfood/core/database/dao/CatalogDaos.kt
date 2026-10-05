package com.fastfood.core.database.dao

import androidx.room.*
import com.fastfood.core.database.entity.CategoryEntity
import com.fastfood.core.database.entity.ProductEntity
import com.fastfood.core.database.entity.ProductExtraEntity
import com.fastfood.core.database.entity.ProductVariantEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CategoryDao {

    @Query("SELECT * FROM categories WHERE est_actif = 1 ORDER BY ordre_affichage ASC")
    fun getAllActiveCategoriesFlow(): Flow<List<CategoryEntity>>

    @Query("SELECT * FROM categories WHERE id = :id")
    suspend fun getCategoryById(id: String): CategoryEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCategories(categories: List<CategoryEntity>)

    @Update
    suspend fun updateCategory(category: CategoryEntity)
}

@Dao
interface ProductDao {

    @Query("SELECT * FROM produits WHERE disponible = 1 ORDER BY nom ASC")
    fun getAllAvailableProductsFlow(): Flow<List<ProductEntity>>

    @Query("SELECT * FROM produits WHERE categorie_id = :categoryId AND disponible = 1 ORDER BY nom ASC")
    fun getProductsByCategoryFlow(categoryId: String): Flow<List<ProductEntity>>

    @Query("SELECT * FROM produits WHERE id = :id")
    suspend fun getProductById(id: String): ProductEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProducts(products: List<ProductEntity>)

    @Query("SELECT * FROM produit_variantes WHERE produit_id = :productId ORDER BY ordre ASC")
    suspend fun getVariantsForProduct(productId: String): List<ProductVariantEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertVariants(variants: List<ProductVariantEntity>)

    @Query("SELECT * FROM produit_extras ORDER BY nom ASC")
    suspend fun getAllExtras(): List<ProductExtraEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExtras(extras: List<ProductExtraEntity>)
}
