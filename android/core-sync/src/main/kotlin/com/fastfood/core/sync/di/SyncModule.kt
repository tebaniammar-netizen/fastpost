package com.fastfood.core.sync.di

import android.content.Context
import com.fastfood.core.database.dao.OrderDao
import com.fastfood.core.database.dao.SyncOutboxDao
import com.fastfood.core.sync.LocalHubDiscovery
import com.fastfood.core.sync.SyncEngine
import com.fastfood.core.sync.WebSocketSyncClient
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object SyncModule {

    @Provides
    @Singleton
    fun provideLocalHubDiscovery(
        @ApplicationContext context: Context
    ): LocalHubDiscovery {
        return LocalHubDiscovery(context)
    }

    @Provides
    @Singleton
    fun provideWebSocketSyncClient(
        localHubDiscovery: LocalHubDiscovery
    ): WebSocketSyncClient {
        return WebSocketSyncClient(localHubDiscovery)
    }

    @Provides
    @Singleton
    fun provideSyncEngine(
        syncOutboxDao: SyncOutboxDao,
        orderDao: OrderDao,
        webSocketSyncClient: WebSocketSyncClient,
        localHubDiscovery: LocalHubDiscovery
    ): SyncEngine {
        return SyncEngine(syncOutboxDao, orderDao, webSocketSyncClient, localHubDiscovery)
    }
}
