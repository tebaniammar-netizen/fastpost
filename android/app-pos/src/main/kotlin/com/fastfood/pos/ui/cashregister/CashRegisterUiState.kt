package com.fastfood.pos.ui.cashregister

import com.fastfood.core.database.entity.CategoryEntity
import com.fastfood.core.database.entity.ProductEntity
import com.fastfood.core.database.entity.ProductExtraEntity
import com.fastfood.core.database.entity.ProductVariantEntity
import com.fastfood.core.model.money.Money
import com.fastfood.core.model.order.OrderType
import java.util.UUID

data class CartLineItemUiModel(
    val cartItemId: String = UUID.randomUUID().toString(),
    val productId: String,
    val productNom: String,
    val variantId: String? = null,
    val variantNom: String? = null,
    val extras: List<ProductExtraEntity> = emptyList(),
    val quantite: Int = 1,
    val prixUnitaireCentimes: Long,
    val notePreparation: String? = null
) {
    val totalLigneCentimes: Long
        get() = prixUnitaireCentimes * quantite

    val formattedTotal: String
        get() = Money(totalLigneCentimes).formatEuro()
}

data class CashRegisterUiState(
    val isLoading: Boolean = false,
    val categories: List<CategoryEntity> = emptyList(),
    val selectedCategory: CategoryEntity? = null,
    val products: List<ProductEntity> = emptyList(),
    val cartItems: List<CartLineItemUiModel> = emptyList(),
    val orderType: OrderType = OrderType.SUR_PLACE,
    val customerName: String = "",
    val discountCentimes: Long = 0L,
    val discountReason: String? = null,
    val activeProductForCustomization: ProductEntity? = null,
    val productVariants: List<ProductVariantEntity> = emptyList(),
    val productExtras: List<ProductExtraEntity> = emptyList(),
    val isSupervisorAuthDialogOpen: Boolean = false,
    val isPaymentDialogOpen: Boolean = false,
    val errorMessage: String? = null
) {
    val subtotalCentimes: Long
        get() = cartItems.sumOf { it.totalLigneCentimes }

    val totalTtcCentimes: Long
        get() = maxOf(0L, subtotalCentimes - discountCentimes)

    // Calcul précis HT à 10%
    val totalHtCentimes: Long
        get() = Math.round(totalTtcCentimes / 1.10)

    val totalTvaCentimes: Long
        get() = totalTtcCentimes - totalHtCentimes

    val formattedSubtotal: String
        get() = Money(subtotalCentimes).formatEuro()

    val formattedTotalTtc: String
        get() = Money(totalTtcCentimes).formatEuro()

    val formattedDiscount: String
        get() = Money(discountCentimes).formatEuro()

    val formattedTva: String
        get() = Money(totalTvaCentimes).formatEuro()
}
