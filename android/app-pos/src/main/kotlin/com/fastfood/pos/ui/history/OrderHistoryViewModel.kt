package com.fastfood.pos.ui.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fastfood.core.database.dao.OrderWithDetails
import com.fastfood.core.database.repository.OrderRepository
import com.fastfood.core.model.order.OrderStatus
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class OrderHistoryUiState(
    val isLoading: Boolean = false,
    val orders: List<OrderWithDetails> = emptyList(),
    val searchQuery: String = "",
    val filterStatus: OrderStatus? = null,
    val selectedOrderForReceipt: OrderWithDetails? = null,
    val errorMessage: String? = null
) {
    val filteredOrders: List<OrderWithDetails>
        get() = orders.filter { item ->
            val matchQuery = searchQuery.isBlank() ||
                item.order.referenceUnique.contains(searchQuery, ignoreCase = true) ||
                (item.order.clientNom?.contains(searchQuery, ignoreCase = true) == true) ||
                item.order.numeroJour.toString() == searchQuery.trim()

            val matchStatus = filterStatus == null || item.order.statut == filterStatus
            matchQuery && matchStatus
        }
}

@HiltViewModel
class OrderHistoryViewModel @Inject constructor(
    private val orderRepository: OrderRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(OrderHistoryUiState(isLoading = true))
    val uiState: StateFlow<OrderHistoryUiState> = _uiState.asStateFlow()

    init {
        loadHistory()
    }

    private fun loadHistory() {
        viewModelScope.launch {
            orderRepository.getAllOrders()
                .catch { e -> _uiState.update { it.copy(errorMessage = e.message, isLoading = false) } }
                .collect { list ->
                    _uiState.update { it.copy(orders = list, isLoading = false) }
                }
        }
    }

    fun setSearchQuery(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
    }

    fun setFilterStatus(status: OrderStatus?) {
        _uiState.update { it.copy(filterStatus = status) }
    }

    fun selectOrderForReceipt(order: OrderWithDetails?) {
        _uiState.update { it.copy(selectedOrderForReceipt = order) }
    }
}
