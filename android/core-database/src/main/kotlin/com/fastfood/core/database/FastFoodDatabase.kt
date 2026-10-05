package com.fastfood.core.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase
import com.fastfood.core.database.converters.RoomConverters
import com.fastfood.core.database.dao.*
import com.fastfood.core.database.entity.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        CategoryEntity::class,
        ProductEntity::class,
        ProductVariantEntity::class,
        ProductExtraEntity::class,
        IngredientEntity::class,
        RecipeLineEntity::class,
        CashSessionEntity::class,
        OrderEntity::class,
        OrderLineEntity::class,
        PaymentEntity::class,
        SyncOutboxEntity::class,
        AuditLogEntity::class
    ],
    version = 1,
    exportSchema = true
)
@TypeConverters(RoomConverters::class)
abstract class FastFoodDatabase : RoomDatabase() {

    abstract fun categoryDao(): CategoryDao
    abstract fun productDao(): ProductDao
    abstract fun ingredientDao(): IngredientDao
    abstract fun orderDao(): OrderDao
    abstract fun paymentDao(): PaymentDao
    abstract fun cashSessionDao(): CashSessionDao
    abstract fun syncOutboxDao(): SyncOutboxDao
    abstract fun auditLogDao(): AuditLogDao

    companion object {
        private const val DATABASE_NAME = "fastfood_pos.db"

        @Volatile
        private var INSTANCE: FastFoodDatabase? = null

        fun getInstance(context: Context, onDatabaseCreated: (() -> Unit)? = null): FastFoodDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    FastFoodDatabase::class.java,
                    DATABASE_NAME
                )
                .addCallback(object : Callback() {
                    override fun onCreate(db: SupportSQLiteDatabase) {
                        super.onCreate(db)
                        onDatabaseCreated?.invoke()
                    }
                })
                .fallbackToDestructiveMigration() // Pour le développement initial
                .build()
                INSTANCE = instance
                instance
            }
        }

        fun createInMemory(context: Context): FastFoodDatabase {
            return Room.inMemoryDatabaseBuilder(
                context.applicationContext,
                FastFoodDatabase::class.java
            )
            .allowMainThreadQueries()
            .build()
        }
    }
}
