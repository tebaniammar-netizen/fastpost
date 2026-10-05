package com.fastfood.pos.ui.cashregister.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fastfood.core.model.order.OrderType
import com.fastfood.pos.ui.cashregister.CartLineItemUiModel
import com.fastfood.pos.ui.cashregister.CashRegisterUiState

@Composable
fun CartPanel(
    uiState: CashRegisterUiState,
    onOrderTypeChange: (OrderType) -> Unit,
    onCustomerNameChange: (String) -> Unit,
    onQuantityChange: (String, Int) -> Unit,
    onRemoveItem: (String) -> Unit,
    onOpenDiscount: () -> Unit,
    onClearCart: () -> Unit,
    onCheckout: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxHeight()
            .clip(RoundedCornerShape(20.dp))
            .background(Color(0xFF1E293B))
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f, fill = false)) {
            // Header & Order Type Toggle
            Text(
                text = "COMMANDE EN COURS",
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Order Type Buttons
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(Color(0xFF0F172A))
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                OrderType.values().forEach { type ->
                    val isSelected = uiState.orderType == type
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSelected) Color(0xFFFFB300) else Color.Transparent)
                            .clickable { onOrderTypeChange(type) }
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = when (type) {
                                OrderType.SUR_PLACE -> "Sur Place"
                                OrderType.A_EMPORTER -> "À Emporter"
                                OrderType.LIVRAISON -> "Livraison"
                            },
                            color = if (isSelected) Color(0xFF0F172A) else Color(0xFF94A3B8),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Customer Name Field
            OutlinedTextField(
                value = uiState.customerName,
                onValueChange = onCustomerNameChange,
                placeholder = { Text("Nom du client (appel)", color = Color(0xFF64748B), fontSize = 12.sp) },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = Color(0xFFFFB300),
                    unfocusedBorderColor = Color(0xFF334155)
                ),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Cart Items List
            if (uiState.cartItems.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Panier vide.\nTouchez un produit pour commencer.",
                        color = Color(0xFF64748B),
                        fontSize = 13.sp,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f, fill = false),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(uiState.cartItems, key = { it.cartItemId }) { item ->
                        CartItemRow(
                            item = item,
                            onQuantityChange = { delta -> onQuantityChange(item.cartItemId, delta) }
                        )
                    }
                }
            }
        }

        // Totals & Checkout Bottom Block
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 12.dp)
        ) {
            HorizontalDivider(color = Color(0xFF334155), thickness = 1.dp)
            Spacer(modifier = Modifier.height(8.dp))

            // Subtotal HT
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Sous-total HT", color = Color(0xFF94A3B8), fontSize = 12.sp)
                Text(uiState.formattedSubtotal, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            }

            // TVA
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("TVA (10%)", color = Color(0xFF94A3B8), fontSize = 12.sp)
                Text(uiState.formattedTva, color = Color.White, fontSize = 12.sp)
            }

            // Remise si présente
            if (uiState.discountCentimes > 0) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Remise accordée", color = Color(0xFFF87171), fontSize = 12.sp)
                    Text("-${uiState.formattedDiscount}", color = Color(0xFFF87171), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Total TTC Net
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("TOTAL TTC", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                Text(
                    uiState.formattedTotalTtc,
                    color = Color(0xFFFFB300),
                    fontWeight = FontWeight.Black,
                    fontSize = 20.sp
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = onOpenDiscount,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFFFB300)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155))
                ) {
                    Text("Remise", fontSize = 12.sp)
                }

                Button(
                    onClick = onCheckout,
                    enabled = uiState.cartItems.isNotEmpty(),
                    modifier = Modifier.weight(2f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFFFB300),
                        contentColor = Color(0xFF0F172A),
                        disabledContainerColor = Color(0xFF334155)
                    )
                ) {
                    Text("Encaisser", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }
        }
    }
}

@Composable
fun CartItemRow(
    item: CartLineItemUiModel,
    onQuantityChange: (Int) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(Color(0xFF0F172A))
            .padding(10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = item.productNom,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp
            )
            if (!item.variantNom.isNullOrBlank()) {
                Text(
                    text = item.variantNom,
                    color = Color(0xFFFFB300),
                    fontSize = 11.sp
                )
            }
            if (item.extras.isNotEmpty()) {
                Text(
                    text = "+ ${item.extras.joinToString(", ") { it.nom }}",
                    color = Color(0xFF94A3B8),
                    fontSize = 11.sp
                )
            }
            if (!item.notePreparation.isNullOrBlank()) {
                Text(
                    text = "⚠️ ${item.notePreparation}",
                    color = Color(0xFFF59E0B),
                    fontSize = 11.sp
                )
            }
            Text(
                text = item.formattedTotal,
                color = Color(0xFFFFB300),
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp
            )
        }

        // Stepper - / +
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(Color(0xFF1E293B))
                    .clickable { onQuantityChange(-1) },
                contentAlignment = Alignment.Center
            ) {
                Text("-", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            }

            Text(
                text = item.quantite.toString(),
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp
            )

            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(Color(0xFF1E293B))
                    .clickable { onQuantityChange(1) },
                contentAlignment = Alignment.Center
            ) {
                Text("+", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            }
        }
    }
}
