package com.fastfood.pos.ui.cashregister

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fastfood.core.database.entity.CategoryEntity
import com.fastfood.core.database.entity.ProductEntity
import com.fastfood.core.database.entity.ProductExtraEntity
import com.fastfood.core.database.entity.ProductVariantEntity
import com.fastfood.core.database.repository.CatalogRepository
import com.fastfood.core.model.order.OrderType
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CashRegisterViewModel @Inject constructor(
    private val catalogRepository: CatalogRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CashRegisterUiState(isLoading = true))
    val uiState: StateFlow<CashRegisterUiState> = _uiState.asStateFlow()

    init {
        loadCategories()
    }

    private fun loadCategories() {
        viewModelScope.launch {
            catalogRepository.getCategories()
                .catch { e -> _uiState.update { it.copy(errorMessage = e.message, isLoading = false) } }
                .collect { categories ->
                    val defaultCat = categories.firstOrNull()
                    _uiState.update {
                        it.copy(
                            categories = categories,
                            selectedCategory = it.selectedCategory ?: defaultCat,
                            isLoading = false
                        )
                    }
                    if (defaultCat != null && _uiState.value.products.isEmpty()) {
                        selectCategory(defaultCat)
                    }
                }
        }
    }

    fun selectCategory(category: CategoryEntity) {
        _uiState.update { it.copy(selectedCategory = category) }
        viewModelScope.launch {
            catalogRepository.getProductsByCategory(category.id)
                .catch { e -> _uiState.update { it.copy(errorMessage = e.message) } }
                .collect { products ->
                    _uiState.update { it.copy(products = products) }
                }
        }
    }

    fun openProductCustomization(product: ProductEntity) {
        viewModelScope.launch {
            val variants = catalogRepository.getVariantsForProduct(product.id)
            val extras = catalogRepository.getAllExtras()
            _uiState.update {
                it.copy(
                    activeProductForCustomization = product,
                    productVariants = variants,
                    productExtras = extras
                )
            }
        }
    }

    fun closeProductCustomization() {
        _uiState.update { it.copy(activeProductForCustomization = null) }
    }

    fun addCustomizedItemToCart(
        product: ProductEntity,
        selectedVariant: ProductVariantEntity?,
        selectedExtras: List<ProductExtraEntity>,
        prepNote: String?
    ) {
        val basePrice = selectedVariant?.let { product.prixBaseCentimes + it.prixDifferentielCentimes }
            ?: product.prixBaseCentimes
        val extrasPrice = selectedExtras.sumOf { it.prixCentimes }
        val unitPrice = basePrice + extrasPrice

        val lineItem = CartLineItemUiModel(
            productId = product.id,
            productNom = product.nom,
            variantId = selectedVariant?.id,
            variantNom = selectedVariant?.nom,
            extras = selectedExtras,
            quantite = 1,
            prixUnitaireCentimes = unitPrice,
            notePreparation = prepNote?.takeIf { it.isNotBlank() }
        )

        _uiState.update { state ->
            state.copy(
                cartItems = state.cartItems + lineItem,
                activeProductForCustomization = null
            )
        }
    }

    fun updateCartItemQuantity(cartItemId: String, delta: Int) {
        _uiState.update { state ->
            val updated = state.cartItems.mapNotNull { item ->
                if (item.cartItemId == cartItemId) {
                    val newQty = item.quantite + delta
                    if (newQty <= 0) null else item.copy(quantite = newQty)
                } else {
                    item
                }
            }
            state.copy(cartItems = updated)
        }
    }

    fun removeCartItem(cartItemId: String) {
        _uiState.update { state ->
            state.copy(cartItems = state.cartItems.filterNot { it.cartItemId === cartItemId })
        }
    }

    fun setOrderType(type: OrderType) {
        _uiState.update { it.copy(orderType = type) }
    }

    fun setCustomerName(name: String) {
        _uiState.update { it.copy(customerName = name) }
    }

    fun openSupervisorAuthDialog() {
        _uiState.update { it.copy(isSupervisorAuthDialogOpen = true) }
    }

    fun closeSupervisorAuthDialog() {
        _uiState.update { it.copy(isSupervisorAuthDialogOpen = false) }
    }

    fun applyAuthorizedDiscount(pin: String, discountAmountCentimes: Long, reason: String): Boolean {
        // Validation stricte du code PIN superviseur (1234 en environnement de démo)
        if (pin == "1234") {
            _uiState.update {
                it.copy(
                    discountCentimes = discountAmountCentimes,
                    discountReason = reason,
                    isSupervisorAuthDialogOpen = false
                )
            }
            return true
        }
        return false
    }

    fun clearCart() {
        _uiState.update {
            it.copy(
                cartItems = emptyList(),
                discountCentimes = 0L,
                discountReason = null,
                customerName = ""
            )
        }
    }

    fun openPaymentDialog() {
        if (_uiState.value.cartItems.isNotEmpty()) {
            _uiState.update { it.copy(isPaymentDialogOpen = true) }
        }
    }

    fun closePaymentDialog() {
        _uiState.update { it.copy(isPaymentDialogOpen = false) }
    }
}
