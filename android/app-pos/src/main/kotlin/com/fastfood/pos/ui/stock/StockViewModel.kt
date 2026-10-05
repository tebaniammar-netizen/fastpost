package com.fastfood.pos.ui.stock

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fastfood.core.database.entity.IngredientEntity
import com.fastfood.core.database.repository.StockRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class StockUiState(
    val isLoading: Boolean = false,
    val ingredients: List<IngredientEntity> = emptyList(),
    val filterOnlyLowStock: Boolean = false,
    val searchQuery: String = "",
    val activeIngredientForReplenish: IngredientEntity? = null,
    val activeIngredientForInventory: IngredientEntity? = null,
    val errorMessage: String? = null
) {
    val filteredIngredients: List<IngredientEntity>
        get() = ingredients.filter { ing ->
            val matchQuery = searchQuery.isBlank() || ing.nom.contains(searchQuery, ignoreCase = true)
            val matchLow = !filterOnlyLowStock || ing.stockActuel <= ing.seuilAlerte
            matchQuery && matchLow
        }

    val lowStockCount: Int
        get() = ingredients.count { it.stockActuel <= it.seuilAlerte }
}

@HiltViewModel
class StockViewModel @Inject constructor(
    private val stockRepository: StockRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(StockUiState(isLoading = true))
    val uiState: StateFlow<StockUiState> = _uiState.asStateFlow()

    init {
        loadIngredients()
    }

    private fun loadIngredients() {
        viewModelScope.launch {
            stockRepository.getAllIngredientsFlow()
                .catch { e -> _uiState.update { it.copy(errorMessage = e.message, isLoading = false) } }
                .collect { list ->
                    _uiState.update { it.copy(ingredients = list, isLoading = false) }
                }
        }
    }

    fun setSearchQuery(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
    }

    fun toggleFilterOnlyLowStock() {
        _uiState.update { it.copy(filterOnlyLowStock = !it.filterOnlyLowStock) }
    }

    fun openReplenishDialog(ingredient: IngredientEntity) {
        _uiState.update { it.copy(activeIngredientForReplenish = ingredient) }
    }

    fun dismissReplenishDialog() {
        _uiState.update { it.copy(activeIngredientForReplenish = null) }
    }

    fun confirmReplenishment(quantity: Double, supplier: String?, invoiceNumber: String?) {
        val ingredient = _uiState.value.activeIngredientForReplenish ?: return
        viewModelScope.launch {
            try {
                stockRepository.replenishStock(
                    ingredientId = ingredient.id,
                    quantiteAjoutee = quantity,
                    fournisseur = supplier,
                    numeroBonLivraison = invoiceNumber,
                    userId = "usr-manager-1"
                )
                dismissReplenishDialog()
            } catch (e: Exception) {
                _uiState.update { it.copy(errorMessage = e.message) }
            }
        }
    }

    fun openInventoryAdjustmentDialog(ingredient: IngredientEntity) {
        _uiState.update { it.copy(activeIngredientForInventory = ingredient) }
    }

    fun dismissInventoryAdjustmentDialog() {
        _uiState.update { it.copy(activeIngredientForInventory = null) }
    }

    fun confirmInventoryAdjustment(physicalCount: Double, reason: String) {
        val ingredient = _uiState.value.activeIngredientForInventory ?: return
        viewModelScope.launch {
            try {
                stockRepository.adjustInventory(
                    ingredientId = ingredient.id,
                    stockReelPhysique = physicalCount,
                    motif = reason,
                    userId = "usr-manager-1"
                )
                dismissInventoryAdjustmentDialog()
            } catch (e: Exception) {
                _uiState.update { it.copy(errorMessage = e.message) }
            }
        }
    }
}
