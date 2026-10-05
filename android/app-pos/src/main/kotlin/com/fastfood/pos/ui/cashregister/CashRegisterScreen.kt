package com.fastfood.pos.ui.cashregister

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.fastfood.pos.ui.cashregister.components.CartPanel
import com.fastfood.pos.ui.cashregister.components.CategorySelector
import com.fastfood.pos.ui.cashregister.components.ProductCard
import com.fastfood.pos.ui.cashregister.components.ProductCustomizationDialog

@Composable
fun CashRegisterScreen(
    viewModel: CashRegisterViewModel,
    onNavigateToKitchenKds: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()

    // Dialog Supervisor Auth
    var supervisorPin by remember { mutableStateOf("") }
    var pinError by remember { mutableStateOf(false) }

    Row(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A))
            .padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Left Column: Catalog (Categories + Product Grid)
        Column(
            modifier = Modifier
                .weight(1.8f)
                .fillMaxHeight()
        ) {
            // Top Bar: Brand, Session info, and KDS switch button
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "FastFood POS",
                        color = Color(0xFFFFB300),
                        fontWeight = FontWeight.Black,
                        fontSize = 20.sp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(Color(0xFF10B981).copy(alpha = 0.2f))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "TERM-01 • SESSION OUVERTE",
                            color = Color(0xFF10B981),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Button(
                    onClick = onNavigateToKitchenKds,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B))
                ) {
                    Text("Vue Cuisine KDS ➔", color = Color(0xFF38BDF8), fontSize = 12.sp)
                }
            }

            // Categories
            CategorySelector(
                categories = uiState.categories,
                selectedCategory = uiState.selectedCategory,
                onCategorySelected = { viewModel.selectCategory(it) }
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Products Grid
            if (uiState.isLoading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Color(0xFFFFB300))
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(3),
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(uiState.products, key = { it.id }) { product ->
                        ProductCard(
                            product = product,
                            onClick = { viewModel.openProductCustomization(product) }
                        )
                    }
                }
            }
        }

        // Right Column: Cart & Totals
        CartPanel(
            uiState = uiState,
            onOrderTypeChange = { viewModel.setOrderType(it) },
            onCustomerNameChange = { viewModel.setCustomerName(it) },
            onQuantityChange = { id, delta -> viewModel.updateCartItemQuantity(id, delta) },
            onRemoveItem = { id -> viewModel.removeCartItem(id) },
            onOpenDiscount = { viewModel.openSupervisorAuthDialog() },
            onClearCart = { viewModel.clearCart() },
            onCheckout = { viewModel.openPaymentDialog() },
            modifier = Modifier.weight(1.2f)
        )
    }

    // Modal Personnalisation
    if (uiState.activeProductForCustomization != null) {
        ProductCustomizationDialog(
            product = uiState.activeProductForCustomization!!,
            variants = uiState.productVariants,
            extras = uiState.productExtras,
            onDismiss = { viewModel.closeProductCustomization() },
            onConfirm = { variant, extras, note ->
                viewModel.addCustomizedItemToCart(
                    uiState.activeProductForCustomization!!,
                    variant,
                    extras,
                    note
                )
            }
        )
    }

    // Modal Superviseur Remise
    if (uiState.isSupervisorAuthDialogOpen) {
        Dialog(onDismissRequest = { viewModel.closeSupervisorAuthDialog() }) {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color(0xFF1E293B),
                modifier = Modifier.padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Autorisation Superviseur",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Entrez le PIN Gestionnaire pour accorder 2.00 € de remise (Démo : 1234)",
                        color = Color(0xFF94A3B8),
                        fontSize = 12.sp,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(14.dp))

                    OutlinedTextField(
                        value = supervisorPin,
                        onValueChange = {
                            supervisorPin = it
                            pinError = false
                        },
                        placeholder = { Text("Code PIN", color = Color(0xFF64748B)) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = Color(0xFFFFB300),
                            unfocusedBorderColor = Color(0xFF334155)
                        ),
                        singleLine = true
                    )

                    if (pinError) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("Code PIN incorrect", color = Color(0xFFF87171), fontSize = 11.sp)
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = {
                                supervisorPin = ""
                                viewModel.closeSupervisorAuthDialog()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0F172A))
                        ) {
                            Text("Annuler")
                        }

                        Button(
                            onClick = {
                                val success = viewModel.applyAuthorizedDiscount(supervisorPin, 200L, "Remise commerciale 2€")
                                if (!success) {
                                    pinError = true
                                } else {
                                    supervisorPin = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFB300))
                        ) {
                            Text("Valider", color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
