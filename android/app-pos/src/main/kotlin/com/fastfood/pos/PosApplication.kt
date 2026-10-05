package com.fastfood.pos

import android.app.Application
import com.fastfood.core.database.FastFoodDatabase
import com.fastfood.core.database.seed.DatabaseDemoSeeder
import dagger.hilt.android.HiltAndroidApp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltAndroidApp
class PosApplication : Application() {

    private val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    @Inject
    lateinit var database: FastFoodDatabase

    override fun onCreate() {
        super.onCreate()
        // Amorce les données de démonstration au premier lancement si la base est vide
        applicationScope.launch {
            DatabaseDemoSeeder.seedDatabaseIfEmpty(database)
        }
    }
}
