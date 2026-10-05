package com.fastfood.pos.ui.payment

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import com.fastfood.core.model.order.PaymentMethod

@Composable
fun PaymentDialog(
    totalTtcCentimes: Long,
    onDismiss: () -> Unit,
    onConfirmPayment: (PaymentMethod, Long, String?) -> Unit
) {
    var selectedMethod by remember { mutableStateOf(PaymentMethod.CARTE_BANCAIRE) }
    var cashGivenCentimes by remember { mutableStateOf(totalTtcCentimes) }
    var cardAuthCode by remember { mutableStateOf("CB-AUTH-${(100000..999999).random()}") }

    val cashChangeCentimes = remember(cashGivenCentimes, totalTtcCentimes) {
        maxOf(0L, cashGivenCentimes - totalTtcCentimes)
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
                    Text(
                        text = "ENCAISSEMENT COMMANDE",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                    IconButton(onClick = onDismiss) {
                        Text("✕", color = Color(0xFF94A3B8), fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Montant Net à payer
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF1E293B))
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("NET À PAYER", color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text(
                            text = Money(totalTtcCentimes).formatEuro(),
                            color = Color(0xFFFFB300),
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Mode de paiement selection
                Text("MODE DE RÈGLEMENT", color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(
                        PaymentMethod.CARTE_BANCAIRE to "Carte Bancaire",
                        PaymentMethod.ESPECES to "Espèces",
                        PaymentMethod.TITRE_RESTAURANT to "Titre Resto"
                    ).forEach { (method, label) ->
                        val isSelected = selectedMethod == method
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(10.dp))
                                .background(if (isSelected) Color(0xFFFFB300).copy(alpha = 0.2f) else Color(0xFF1E293B))
                                .border(
                                    width = if (isSelected) 2.dp else 1.dp,
                                    color = if (isSelected) Color(0xFFFFB300) else Color(0xFF334155),
                                    shape = RoundedCornerShape(10.dp)
                                )
                                .clickable { selectedMethod = method }
                                .padding(vertical = 12.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = label,
                                color = if (isSelected) Color.White else Color(0xFF94A3B8),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Détail spécifique espèces
                if (selectedMethod == PaymentMethod.ESPECES) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color(0xFF1E293B))
                            .padding(14.dp)
                    ) {
                        Text("BILLETS REÇUS", color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            listOf(1000L, 2000L, 5000L).forEach { amountCents ->
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(Color(0xFF0F172A))
                                        .clickable { cashGivenCentimes = amountCents }
                                        .padding(vertical = 8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = Money(amountCents).formatEuro(),
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp
                                    )
                                }
                            }
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color(0xFFFFB300).copy(alpha = 0.2f))
                                    .clickable { cashGivenCentimes = totalTtcCentimes }
                                    .padding(vertical = 8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "Compte exact",
                                    color = Color(0xFFFFB300),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 11.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        HorizontalDivider(color = Color(0xFF334155))
                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Rendu de monnaie :", color = Color(0xFF94A3B8), fontSize = 13.sp)
                            Text(
                                text = Money(cashChangeCentimes).formatEuro(),
                                color = Color(0xFF10B981),
                                fontWeight = FontWeight.Black,
                                fontSize = 18.sp
                            )
                        }
                    }
                } else if (selectedMethod == PaymentMethod.CARTE_BANCAIRE) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color(0xFF1E293B))
                            .padding(14.dp)
                    ) {
                        Column {
                            Text("COMMUNICATION TPE BANCAIRE", color = Color(0xFF94A3B8), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("Autorisation : $cardAuthCode", color = Color(0xFF38BDF8), fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text("Prêt pour insertion ou sans-contact client", color = Color(0xFF64748B), fontSize = 11.sp)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Bouton de validation de la transaction
                Button(
                    onClick = {
                        val ref = if (selectedMethod == PaymentMethod.CARTE_BANCAIRE) cardAuthCode else null
                        onConfirmPayment(selectedMethod, cashGivenCentimes, ref)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
                ) {
                    Text(
                        text = "Valider la Vente & Émettre Ticket",
                        color = Color(0xFF0F172A),
                        fontWeight = FontWeight.Black,
                        fontSize = 15.sp
                    )
                }
            }
        }
    }
}
