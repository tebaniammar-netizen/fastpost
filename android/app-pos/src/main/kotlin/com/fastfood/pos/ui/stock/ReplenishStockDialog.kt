package com.fastfood.pos.ui.stock

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import com.fastfood.core.database.entity.IngredientEntity

@Composable
fun ReplenishStockDialog(
    ingredient: IngredientEntity,
    onDismiss: () -> Unit,
    onConfirm: (Double, String?, String?) -> Unit
) {
    var quantityText by remember { mutableStateOf("10.0") }
    var supplierText by remember { mutableStateOf("Métro Cash & Carry") }
    var invoiceRef by remember { mutableStateOf("BL-2026-${(1000..9999).random()}") }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color(0xFF0F172A),
            modifier = Modifier.padding(16.dp).fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "RÉAPPROVISIONNEMENT",
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 17.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${ingredient.nom} • Stock actuel : ${ingredient.stockActuel} ${ingredient.unite}",
                    color = Color(0xFFFFB300),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = quantityText,
                    onValueChange = { quantityText = it },
                    label = { Text("Quantité reçue (${ingredient.unite})", color = Color(0xFF94A3B8)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFFFFB300),
                        unfocusedBorderColor = Color(0xFF334155)
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = supplierText,
                    onValueChange = { supplierText = it },
                    label = { Text("Fournisseur", color = Color(0xFF94A3B8)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFFFFB300),
                        unfocusedBorderColor = Color(0xFF334155)
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = invoiceRef,
                    onValueChange = { invoiceRef = it },
                    label = { Text("N° Bon de Livraison / Facture", color = Color(0xFF94A3B8)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFFFFB300),
                        unfocusedBorderColor = Color(0xFF334155)
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(20.dp))

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
                            val qty = quantityText.toDoubleOrNull() ?: 0.0
                            if (qty > 0) {
                                onConfirm(qty, supplierText.takeIf { it.isNotBlank() }, invoiceRef.takeIf { it.isNotBlank() })
                            }
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
                    ) {
                        Text("Valider Entrée", color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
