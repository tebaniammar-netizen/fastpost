package com.fastfood.core.database.di

import android.content.Context
import com.fastfood.core.database.FastFoodDatabase
import com.fastfood.core.database.dao.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideFastFoodDatabase(@ApplicationContext context: Context): FastFoodDatabase {
        return FastFoodDatabase.getInstance(context)
    }

    @Provides
    fun provideCategoryDao(database: FastFoodDatabase): CategoryDao = database.categoryDao()

    @Provides
    fun provideProductDao(database: FastFoodDatabase): ProductDao = database.productDao()

    @Provides
    fun provideIngredientDao(database: FastFoodDatabase): IngredientDao = database.ingredientDao()

    @Provides
    fun provideOrderDao(database: FastFoodDatabase): OrderDao = database.orderDao()

    @Provides
    fun providePaymentDao(database: FastFoodDatabase): PaymentDao = database.paymentDao()

    @Provides
    fun provideCashSessionDao(database: FastFoodDatabase): CashSessionDao = database.cashSessionDao()

    @Provides
    fun provideSyncOutboxDao(database: FastFoodDatabase): SyncOutboxDao = database.syncOutboxDao()

    @Provides
    fun provideAuditLogDao(database: FastFoodDatabase): AuditLogDao = database.auditLogDao()

    @Provides
    @Singleton
    fun provideCatalogRepository(
        categoryDao: CategoryDao,
        productDao: ProductDao
    ): com.fastfood.core.database.repository.CatalogRepository {
        return com.fastfood.core.database.repository.CatalogRepositoryImpl(categoryDao, productDao)
    }

    @Provides
    @Singleton
    fun provideOrderRepository(
        orderDao: OrderDao,
        ingredientDao: IngredientDao,
        syncOutboxDao: SyncOutboxDao
    ): com.fastfood.core.database.repository.OrderRepository {
        return com.fastfood.core.database.repository.OrderRepositoryImpl(orderDao, ingredientDao, syncOutboxDao)
    }

    @Provides
    @Singleton
    fun provideSessionRepository(
        cashSessionDao: CashSessionDao,
        paymentDao: PaymentDao,
        auditLogDao: AuditLogDao
    ): com.fastfood.core.database.repository.SessionRepository {
        return com.fastfood.core.database.repository.SessionRepositoryImpl(cashSessionDao, paymentDao, auditLogDao)
    }

    @Provides
    @Singleton
    fun provideStockRepository(
        ingredientDao: IngredientDao,
        auditLogDao: AuditLogDao
    ): com.fastfood.core.database.repository.StockRepository {
        return com.fastfood.core.database.repository.StockRepositoryImpl(ingredientDao, auditLogDao)
    }

    @Provides
    @Singleton
    fun provideAuthRepository(
        userDao: UserDao,
        auditLogDao: AuditLogDao,
        pinHasher: com.fastfood.core.database.security.PinHasher
    ): com.fastfood.core.database.repository.AuthRepository {
        return com.fastfood.core.database.repository.AuthRepositoryImpl(userDao, auditLogDao, pinHasher)
    }
}
