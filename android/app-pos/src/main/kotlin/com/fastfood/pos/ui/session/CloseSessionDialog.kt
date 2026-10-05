package com.fastfood.pos.ui.session

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import com.fastfood.core.model.money.Money

@Composable
fun CloseSessionDialog(
    theoreticalCashCentimes: Long,
    onDismiss: () -> Unit,
    onConfirmClose: (Long, String?) -> Unit
) {
    var countedCashCentimes by remember { mutableStateOf(theoreticalCashCentimes) }
    var notes by remember { mutableStateOf("") }

    val discrepancyCentimes = remember(countedCashCentimes, theoreticalCashCentimes) {
        countedCashCentimes - theoreticalCashCentimes
    }

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
                    text = "CLÔTURE DE CAISSE (TICKET Z)",
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 17.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Comptage physique des espèces du tiroir-caisse.",
                    color = Color(0xFF94A3B8),
                    fontSize = 12.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Grille Comparaison Théorique vs Compté
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Théorique
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color(0xFF1E293B))
                            .padding(12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("ESPÈCES THÉORIQUES", color = Color(0xFF94A3B8), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text(
                                text = Money(theoreticalCashCentimes).formatEuro(),
                                color = Color.White,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    // Écart
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                if (discrepancyCentimes == 0L) Color(0xFF10B981).copy(alpha = 0.15f)
                                else if (discrepancyCentimes < 0) Color(0xFFEF4444).copy(alpha = 0.15f)
                                else Color(0xFFF59E0B).copy(alpha = 0.15f)
                            )
                            .border(
                                1.dp,
                                if (discrepancyCentimes == 0L) Color(0xFF10B981)
                                else if (discrepancyCentimes < 0) Color(0xFFEF4444)
                                else Color(0xFFF59E0B),
                                RoundedCornerShape(12.dp)
                            )
                            .padding(12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("ÉCART DE CAISSE", color = Color(0xFF94A3B8), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text(
                                text = (if (discrepancyCentimes > 0) "+" else "") + Money(Math.abs(discrepancyCentimes)).formatEuro(),
                                color = if (discrepancyCentimes == 0L) Color(0xFF10B981)
                                else if (discrepancyCentimes < 0) Color(0xFFEF4444)
                                else Color(0xFFF59E0B),
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Bouton simulation comptage rapide
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Button(
                        onClick = { countedCashCentimes = theoreticalCashCentimes },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B))
                    ) {
                        Text("Compte juste", fontSize = 11.sp, color = Color(0xFFFFB300))
                    }
                    Button(
                        onClick = { countedCashCentimes = maxOf(0L, theoreticalCashCentimes - 500L) }, // -5.00€
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B))
                    ) {
                        Text("Simuler -5 €", fontSize = 11.sp, color = Color(0xFFF87171))
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Justification
                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    placeholder = { Text("Justification de l'écart ou observation...", color = Color(0xFF64748B), fontSize = 12.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFFFFB300),
                        unfocusedBorderColor = Color(0xFF334155)
                    ),
                    maxLines = 2
                )

                Spacer(modifier = Modifier.height(18.dp))

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
                        onClick = { onConfirmClose(countedCashCentimes, notes.takeIf { it.isNotBlank() }) },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444))
                    ) {
                        Text("Clôturer la Caisse", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
