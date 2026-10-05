package com.fastfood.core.sync

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

data class LocalHubEndpoint(
    val host: String,
    val port: Int,
    val isDiscovered: Boolean = false
)

@Singleton
class LocalHubDiscovery @Inject constructor(
    private val context: Context
) {
    private val nsdManager = context.getSystemService(Context.NSD_SERVICE) as? NsdManager

    private val _hubEndpoint = MutableStateFlow(
        LocalHubEndpoint(host = "192.168.1.100", port = 8080, isDiscovered = false)
    )
    val hubEndpoint: StateFlow<LocalHubEndpoint> = _hubEndpoint.asStateFlow()

    private val serviceType = "_fastfood-hub._tcp."

    private val discoveryListener = object : NsdManager.DiscoveryListener {
        override fun onStartDiscoveryFailed(serviceType: String?, errorCode: Int) {
            Log.e("FastFood-NSD", "Discovery start failed: $errorCode")
        }

        override fun onStopDiscoveryFailed(serviceType: String?, errorCode: Int) {
            Log.e("FastFood-NSD", "Discovery stop failed: $errorCode")
        }

        override fun onDiscoveryStarted(serviceType: String?) {
            Log.d("FastFood-NSD", "Service discovery started for: $serviceType")
        }

        override fun onDiscoveryStopped(serviceType: String?) {
            Log.d("FastFood-NSD", "Service discovery stopped")
        }

        override fun onServiceFound(serviceInfo: NsdServiceInfo?) {
            if (serviceInfo?.serviceType == serviceType) {
                nsdManager?.resolveService(serviceInfo, object : NsdManager.ResolveListener {
                    override fun onResolveFailed(serviceInfo: NsdServiceInfo?, errorCode: Int) {
                        Log.e("FastFood-NSD", "Resolve failed: $errorCode")
                    }

                    override fun onServiceResolved(resolvedInfo: NsdServiceInfo?) {
                        resolvedInfo?.host?.hostAddress?.let { hostIp ->
                            _hubEndpoint.value = LocalHubEndpoint(
                                host = hostIp,
                                port = resolvedInfo.port,
                                isDiscovered = true
                            )
                            Log.i("FastFood-NSD", "Local Hub découvert: $hostIp:${resolvedInfo.port}")
                        }
                    }
                })
            }
        }

        override fun onServiceLost(serviceInfo: NsdServiceInfo?) {
            Log.w("FastFood-NSD", "Service perdu: ${serviceInfo?.serviceName}")
        }
    }

    fun startDiscovery() {
        try {
            nsdManager?.discoverServices(serviceType, NsdManager.PROTOCOL_DNS_SD, discoveryListener)
        } catch (e: Exception) {
            Log.w("FastFood-NSD", "mDNS non supporté dans cet environnement, utilisation du fallback IP")
        }
    }

    fun stopDiscovery() {
        try {
            nsdManager?.stopServiceDiscovery(discoveryListener)
        } catch (e: Exception) {
            // Ignorer si non démarré
        }
    }
}
