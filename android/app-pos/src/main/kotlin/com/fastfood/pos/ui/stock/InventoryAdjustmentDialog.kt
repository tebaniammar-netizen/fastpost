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
fun InventoryAdjustmentDialog(
    ingredient: IngredientEntity,
    onDismiss: () -> Unit,
    onConfirm: (Double, String) -> Unit
) {
    var physicalCountText by remember { mutableStateOf(ingredient.stockActuel.toString()) }
    var reasonText by remember { mutableStateOf("Inventaire tournant hebdomadaire") }

    val currentPhysical = physicalCountText.toDoubleOrNull() ?: ingredient.stockActuel
    val discrepancy = currentPhysical - ingredient.stockActuel

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
                    text = "INVENTAIRE RECTIFICATIF",
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 17.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${ingredient.nom} • Stock théorique : ${ingredient.stockActuel} ${ingredient.unite}",
                    color = Color(0xFF94A3B8),
                    fontSize = 12.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Écart calculé
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(
                            if (discrepancy == 0.0) Color(0xFF10B981).copy(alpha = 0.15f)
                            else if (discrepancy < 0) Color(0xFFEF4444).copy(alpha = 0.15f)
                            else Color(0xFFF59E0B).copy(alpha = 0.15f)
                        )
                        .padding(12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("ÉCART D'INVENTAIRE", color = Color(0xFF94A3B8), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text(
                            text = (if (discrepancy > 0) "+" else "") + String.format("%.2f %s", discrepancy, ingredient.unite),
                            color = if (discrepancy == 0.0) Color(0xFF10B981)
                            else if (discrepancy < 0) Color(0xFFEF4444)
                            else Color(0xFFF59E0B),
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = physicalCountText,
                    onValueChange = { physicalCountText = it },
                    label = { Text("Stock physique compté (${ingredient.unite})", color = Color(0xFF94A3B8)) },
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
                    value = reasonText,
                    onValueChange = { reasonText = it },
                    label = { Text("Motif de l'ajustement / casse / perte", color = Color(0xFF94A3B8)) },
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
                            val count = physicalCountText.toDoubleOrNull()
                            if (count != null && count >= 0) {
                                onConfirm(count, reasonText.ifBlank { "Inventaire périodique" })
                            }
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFB300))
                    ) {
                        Text("Enregistrer Écart", color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
