package com.fastfood.pos.ui.cashregister

import com.fastfood.core.database.entity.CategoryEntity
import com.fastfood.core.database.entity.ProductEntity
import com.fastfood.core.database.entity.ProductExtraEntity
import com.fastfood.core.database.repository.CatalogRepository
import com.fastfood.core.model.order.OrderType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class CashRegisterViewModelTest {

    private val testDispatcher = StandardTestDispatcher()

    // Fake repository
    private val fakeCategory = CategoryEntity(id = "cat-1", nom = "Burgers", icone = "burger", ordreAffichage = 1)
    private val fakeProduct = ProductEntity(
        id = "prod-1",
        categorieId = "cat-1",
        nom = "Double Smash",
        prixBaseCentimes = 990L
    )

    private val fakeRepo = object : CatalogRepository {
        override fun getCategories() = flowOf(listOf(fakeCategory))
        override fun getProductsByCategory(categoryId: String) = flowOf(listOf(fakeProduct))
        override suspend fun getVariantsForProduct(productId: String) = emptyList<com.fastfood.core.database.entity.ProductVariantEntity>()
        override suspend fun getAllExtras() = listOf(
            ProductExtraEntity(id = "ext-1", nom = "Bacon", prixCentimes = 150L)
        )
    }

    private lateinit var viewModel: CashRegisterViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        viewModel = CashRegisterViewModel(fakeRepo)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun testAddToCartCalculatesTotalsAccuratelyInCents() = runTest {
        testDispatcher.scheduler.advanceUntilIdle()

        val extra = ProductExtraEntity(id = "ext-1", nom = "Bacon", prixCentimes = 150L)
        
        viewModel.addCustomizedItemToCart(
            product = fakeProduct,
            selectedVariant = null,
            selectedExtras = listOf(extra),
            prepNote = "Sans oignons"
        )

        val state = viewModel.uiState.value
        assertEquals(1, state.cartItems.size)
        
        // Prix unitaire = 990 + 150 = 1140 centimes (11.40 €)
        assertEquals(1140L, state.subtotalCentimes)
        assertEquals(1140L, state.totalTtcCentimes)
        assertEquals("Sans oignons", state.cartItems[0].notePreparation)
    }

    @Test
    fun testSupervisorDiscountVerification() = runTest {
        testDispatcher.scheduler.advanceUntilIdle()

        // Code PIN erroné
        val rejected = viewModel.applyAuthorizedDiscount("0000", 200L, "Remise test")
        assertFalse(rejected)
        assertEquals(0L, viewModel.uiState.value.discountCentimes)

        // Code PIN valide
        val accepted = viewModel.applyAuthorizedDiscount("1234", 200L, "Remise test")
        assertTrue(accepted)
        assertEquals(200L, viewModel.uiState.value.discountCentimes)
    }

    @Test
    fun testUpdateQuantityModifiesTotals() = runTest {
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.addCustomizedItemToCart(
            product = fakeProduct,
            selectedVariant = null,
            selectedExtras = emptyList(),
            prepNote = null
        )

        val itemId = viewModel.uiState.value.cartItems[0].cartItemId
        
        // Augmentation de la quantité à 3
        viewModel.updateCartItemQuantity(itemId, 2)
        assertEquals(3, viewModel.uiState.value.cartItems[0].quantite)
        assertEquals(2970L, viewModel.uiState.value.totalTtcCentimes) // 990 * 3
    }
}
