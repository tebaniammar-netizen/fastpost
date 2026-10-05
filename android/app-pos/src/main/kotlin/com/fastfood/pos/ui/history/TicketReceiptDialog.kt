package com.fastfood.pos.ui.history

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.fastfood.core.database.dao.OrderWithDetails
import com.fastfood.core.model.money.Money
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun TicketReceiptDialog(
    orderWithDetails: OrderWithDetails,
    onDismiss: () -> Unit,
    onPrintTicket: () -> Unit = {}
) {
    val order = orderWithDetails.order
    val lines = orderWithDetails.lines
    val payments = orderWithDetails.payments
    val dateStr = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.FRANCE).format(Date(order.dateCreationUtc))

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = Color(0xFF0F172A),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Ticket Paper container (White background like thermal paper)
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFFF8FAFC))
                        .border(1.dp, Color(0xFFCBD5E1), RoundedCornerShape(8.dp))
                        .padding(16.dp)
                        .verticalScroll(rememberScrollState()),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "FASTFOOD BURGER & CO",
                        color = Color.Black,
                        fontWeight = FontWeight.Black,
                        fontSize = 15.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "12 Rue des Gourmets, 75001 Paris",
                        color = Color(0xFF475569),
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "SIRET: 893 421 982 00014 - TVA FR12893421982",
                        color = Color(0xFF64748B),
                        fontSize = 9.sp,
                        fontFamily = FontFamily.Monospace
                    )

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "--------------------------------",
                        color = Color(0xFF94A3B8),
                        fontFamily = FontFamily.Monospace
                    )

                    // Numéro d'appel et Référence
                    Text(
                        text = "COMMANDE #${String.format("%03d", order.numeroJour)}",
                        color = Color.Black,
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = order.referenceUnique,
                        color = Color(0xFF334155),
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "$dateStr • ${order.typeCommande}",
                        color = Color(0xFF64748B),
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    if (!order.clientNom.isNullOrBlank()) {
                        Text(
                            text = "Client : ${order.clientNom}",
                            color = Color(0xFF334155),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "--------------------------------",
                        color = Color(0xFF94A3B8),
                        fontFamily = FontFamily.Monospace
                    )

                    // Lignes
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        lines.forEach { line ->
                            Column {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "${line.quantite}x ${line.produitNomSnapshot}",
                                        color = Color.Black,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        fontFamily = FontFamily.Monospace
                                    )
                                    Text(
                                        text = Money(line.totalLigneCentimes).formatEuro(),
                                        color = Color.Black,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }
                                if (!line.varianteNomSnapshot.isNullOrBlank()) {
                                    Text(
                                        text = "   [${line.varianteNomSnapshot}]",
                                        color = Color(0xFF475569),
                                        fontSize = 10.sp,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }
                                if (!line.extrasJson.isNullOrBlank()) {
                                    Text(
                                        text = "   + ${line.extrasJson}",
                                        color = Color(0xFF475569),
                                        fontSize = 10.sp,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }
                                if (!line.notePreparation.isNullOrBlank()) {
                                    Text(
                                        text = "   Note: ${line.notePreparation}",
                                        color = Color(0xFFD97706),
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "--------------------------------",
                        color = Color(0xFF94A3B8),
                        fontFamily = FontFamily.Monospace
                    )

                    // Totaux fiscaux
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Total HT :", color = Color(0xFF475569), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(order.totalHtCentimes).formatEuro(), color = Color.Black, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("TVA collectée (10%) :", color = Color(0xFF475569), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(order.totalTvaCentimes).formatEuro(), color = Color.Black, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }
                    if (order.remiseCentimes > 0) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Remise accordée :", color = Color(0xFFDC2626), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                            Text("-${Money(order.remiseCentimes).formatEuro()}", color = Color(0xFFDC2626), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("TOTAL NET TTC :", color = Color.Black, fontWeight = FontWeight.Black, fontSize = 14.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(order.totalTtcCentimes).formatEuro(), color = Color.Black, fontWeight = FontWeight.Black, fontSize = 15.sp, fontFamily = FontFamily.Monospace)
                    }

                    // Paiements
                    Spacer(modifier = Modifier.height(6.dp))
                    payments.forEach { pay ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Payé via ${pay.modePaiement} :", color = Color(0xFF334155), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                            Text(Money(pay.montantCentimes).formatEuro(), color = Color.Black, fontSize = 11.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                        }
                        if (pay.monnaieRendueCentimes > 0) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Monnaie rendue :", color = Color(0xFF059669), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                                Text(Money(pay.monnaieRendueCentimes).formatEuro(), color = Color(0xFF059669), fontSize = 11.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Merci de votre visite et à très bientôt !", color = Color(0xFF64748B), fontSize = 10.sp, fontFamily = FontFamily.Monospace)
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
                        Text("Fermer", color = Color(0xFF94A3B8))
                    }

                    Button(
                        onClick = onPrintTicket,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFB300))
                    ) {
                        Text("🖨️ Imprimer", color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
