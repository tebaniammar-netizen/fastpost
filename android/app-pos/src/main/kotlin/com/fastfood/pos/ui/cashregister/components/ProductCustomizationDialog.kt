package com.fastfood.pos.ui.cashregister.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.fastfood.core.database.entity.ProductEntity
import com.fastfood.core.database.entity.ProductExtraEntity
import com.fastfood.core.database.entity.ProductVariantEntity
import com.fastfood.core.model.money.Money

@Composable
fun ProductCustomizationDialog(
    product: ProductEntity,
    variants: List<ProductVariantEntity>,
    extras: List<ProductExtraEntity>,
    onDismiss: () -> Unit,
    onConfirm: (ProductVariantEntity?, List<ProductExtraEntity>, String?) -> Unit
) {
    var selectedVariant by remember { mutableStateOf(variants.firstOrNull()) }
    val selectedExtras = remember { mutableStateListOf<ProductExtraEntity>() }
    var prepNote by remember { mutableStateOf("") }

    val calculatedPrice = remember(selectedVariant, selectedExtras.toList()) {
        val base = selectedVariant?.let { product.prixBaseCentimes + it.prixDifferentielCentimes }
            ?: product.prixBaseCentimes
        val extrasSum = selectedExtras.sumOf { it.prixCentimes }
        Money(base + extrasSum)
    }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color(0xFF0F172A),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .fillMaxWidth()
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = product.nom,
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                        Text(
                            text = calculatedPrice.formatEuro(),
                            color = Color(0xFFFFB300),
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 16.sp
                        )
                    }

                    IconButton(onClick = onDismiss) {
                        Text("✕", color = Color(0xFF94A3B8), fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                LazyColumn(
                    modifier = Modifier.weight(1f, fill = false),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Section Formule / Variantes
                    if (variants.isNotEmpty()) {
                        item {
                            Text(
                                text = "CHOISIR LA FORMULE",
                                color = Color(0xFF94A3B8),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                variants.forEach { variant ->
                                    val isSelected = selectedVariant?.id == variant.id
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(if (isSelected) Color(0xFFFFB300).copy(alpha = 0.2f) else Color(0xFF1E293B))
                                            .border(
                                                width = if (isSelected) 2.dp else 1.dp,
                                                color = if (isSelected) Color(0xFFFFB300) else Color(0xFF334155),
                                                shape = RoundedCornerShape(12.dp)
                                            )
                                            .clickable { selectedVariant = variant }
                                            .padding(12.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                            Text(
                                                text = variant.nom,
                                                color = if (isSelected) Color.White else Color(0xFF94A3B8),
                                                fontWeight = FontWeight.SemiBold,
                                                fontSize = 13.sp
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Section Suppléments / Extras
                    if (extras.isNotEmpty()) {
                        item {
                            Text(
                                text = "SUPPLÉMENTS",
                                color = Color(0xFF94A3B8),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                extras.forEach { extra ->
                                    val isSelected = selectedExtras.any { it.id == extra.id }
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(RoundedCornerShape(10.dp))
                                            .background(if (isSelected) Color(0xFFFFB300).copy(alpha = 0.15f) else Color(0xFF1E293B))
                                            .border(
                                                width = 1.dp,
                                                color = if (isSelected) Color(0xFFFFB300) else Color(0xFF334155),
                                                shape = RoundedCornerShape(10.dp)
                                            )
                                            .clickable {
                                                if (isSelected) {
                                                    selectedExtras.removeAll { it.id == extra.id }
                                                } else {
                                                    selectedExtras.add(extra)
                                                }
                                            }
                                            .padding(horizontal = 14.dp, vertical = 10.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = extra.nom,
                                            color = Color.White,
                                            fontSize = 13.sp
                                        )
                                        Text(
                                            text = "+${Money(extra.prixCentimes).formatEuro()}",
                                            color = Color(0xFFFFB300),
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp
                                        )
                                    }
                                }
                            }
                        }
                    }

                    // Section Note de préparation
                    item {
                        Text(
                            text = "NOTE CUISINE",
                            color = Color(0xFF94A3B8),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        OutlinedTextField(
                            value = prepNote,
                            onValueChange = { prepNote = it },
                            placeholder = { Text("Ex: Sans oignons, bien cuit...", color = Color(0xFF64748B), fontSize = 13.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White,
                                focusedBorderColor = Color(0xFFFFB300),
                                unfocusedBorderColor = Color(0xFF334155)
                            ),
                            singleLine = true
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Action buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B))
                    ) {
                        Text("Annuler", color = Color(0xFF94A3B8))
                    }

                    Button(
                        onClick = {
                            onConfirm(selectedVariant, selectedExtras.toList(), prepNote.takeIf { it.isNotBlank() })
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFB300))
                    ) {
                        Text("Ajouter", color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
