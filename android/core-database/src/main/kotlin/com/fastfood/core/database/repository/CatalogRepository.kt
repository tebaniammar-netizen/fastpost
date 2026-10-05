package com.fastfood.core.database.repository

import com.fastfood.core.database.dao.CategoryDao
import com.fastfood.core.database.dao.ProductDao
import com.fastfood.core.database.entity.CategoryEntity
import com.fastfood.core.database.entity.ProductEntity
import com.fastfood.core.database.entity.ProductExtraEntity
import com.fastfood.core.database.entity.ProductVariantEntity
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

interface CatalogRepository {
    fun getCategories(): Flow<List<CategoryEntity>>
    fun getProductsByCategory(categoryId: String): Flow<List<ProductEntity>>
    suspend fun getVariantsForProduct(productId: String): List<ProductVariantEntity>
    suspend fun getAllExtras(): List<ProductExtraEntity>
}

@Singleton
class CatalogRepositoryImpl @Inject constructor(
    private val categoryDao: CategoryDao,
    private val productDao: ProductDao
) : CatalogRepository {

    override fun getCategories(): Flow<List<CategoryEntity>> {
        return categoryDao.getAllActiveCategoriesFlow()
    }

    override fun getProductsByCategory(categoryId: String): Flow<List<ProductEntity>> {
        return productDao.getProductsByCategoryFlow(categoryId)
    }

    override fun getVariantsForProduct(productId: String): List<ProductVariantEntity> {
        return productDao.getVariantsForProduct(productId)
    }

    override fun getAllExtras(): List<ProductExtraEntity> {
        return productDao.getAllExtras()
    }
}
