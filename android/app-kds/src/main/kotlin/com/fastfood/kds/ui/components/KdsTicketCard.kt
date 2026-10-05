package com.fastfood.kds.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
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
import com.fastfood.core.database.dao.OrderWithDetails
import com.fastfood.core.model.order.OrderStatus
import com.fastfood.core.model.order.OrderType

@Composable
fun KdsTicketCard(
    orderWithDetails: OrderWithDetails,
    currentTimeMillis: Long,
    onAdvanceStatus: (String, OrderStatus) -> Unit,
    modifier: Modifier = Modifier
) {
    val order = orderWithDetails.order
    val lines = orderWithDetails.lines

    val elapsedSeconds = maxOf(0L, (currentTimeMillis - order.dateCreationUtc) / 1000)
    val elapsedMinutes = elapsedSeconds / 60
    val elapsedRemainingSec = elapsedSeconds % 60
    val timeFormatted = String.format("%02d:%02d", elapsedMinutes, elapsedRemainingSec)

    // Code couleur d'urgence KDS
    val (bannerColor, bannerBg) = when {
        elapsedMinutes >= 10 -> Color(0xFFEF4444) to Color(0xFFEF4444).copy(alpha = 0.2f) // Rouge alerte
        elapsedMinutes >= 5 -> Color(0xFFF59E0B) to Color(0xFFF59E0B).copy(alpha = 0.2f)  // Ambre
        else -> Color(0xFF10B981) to Color(0xFF10B981).copy(alpha = 0.15f)                // Vert nominal
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFF1E293B))
            .border(1.5.dp, bannerColor.copy(alpha = 0.6f), RoundedCornerShape(16.dp))
            .padding(14.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            // Header: Numéro de commande + Chrono d'attente
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "#${String.format("%03d", order.numeroJour)}",
                        color = Color.White,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(
                                when (order.typeCommande) {
                                    OrderType.SUR_PLACE -> Color(0xFF38BDF8).copy(alpha = 0.2f)
                                    OrderType.A_EMPORTER -> Color(0xFFFFB300).copy(alpha = 0.2f)
                                    OrderType.LIVRAISON -> Color(0xFFA855F7).copy(alpha = 0.2f)
                                }
                            )
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = when (order.typeCommande) {
                                OrderType.SUR_PLACE -> "SUR PLACE"
                                OrderType.A_EMPORTER -> "À EMPORTER"
                                OrderType.LIVRAISON -> "LIVRAISON"
                            },
                            color = when (order.typeCommande) {
                                OrderType.SUR_PLACE -> Color(0xFF38BDF8)
                                OrderType.A_EMPORTER -> Color(0xFFFFB300)
                                OrderType.LIVRAISON -> Color(0xFFA855F7)
                            },
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp
                        )
                    }
                }

                // Chrono d'attente
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(bannerBg)
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "⏱ $timeFormatted",
                        color = bannerColor,
                        fontWeight = FontWeight.Black,
                        fontSize = 14.sp
                    )
                }
            }

            if (!order.clientNom.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "Client : ${order.clientNom}",
                    color = Color(0xFF94A3B8),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }

            Spacer(modifier = Modifier.height(10.dp))
            HorizontalDivider(color = Color(0xFF334155), thickness = 1.dp)
            Spacer(modifier = Modifier.height(10.dp))

            // Articles à fabriquer
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                lines.forEach { line ->
                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(Color(0xFFFFB300))
                                    .padding(2.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "${line.quantite}x",
                                    color = Color(0xFF0F172A),
                                    fontWeight = FontWeight.Black,
                                    fontSize = 11.sp
                                )
                            }

                            Spacer(modifier = Modifier.width(8.dp))

                            Text(
                                text = line.produitNomSnapshot,
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        }

                        if (!line.varianteNomSnapshot.isNullOrBlank()) {
                            Text(
                                text = "    ↳ ${line.varianteNomSnapshot}",
                                color = Color(0xFF38BDF8),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }

                        if (!line.extrasJson.isNullOrBlank()) {
                            Text(
                                text = "    + ${line.extrasJson}",
                                color = Color(0xFF34D399),
                                fontSize = 11.sp
                            )
                        }

                        if (!line.notePreparation.isNullOrBlank()) {
                            Box(
                                modifier = Modifier
                                    .padding(top = 4.dp, start = 12.dp)
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(Color(0xFFF59E0B).copy(alpha = 0.2f))
                                    .border(1.dp, Color(0xFFF59E0B), RoundedCornerShape(6.dp))
                                    .padding(horizontal = 8.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "⚠️ ${line.notePreparation}",
                                    color = Color(0xFFFFC107),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 11.sp
                                )
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Bouton de progression
        val buttonLabel = when (order.statut) {
            OrderStatus.RECOLTEE -> "Démarrer Prépa ➔"
            OrderStatus.EN_PREPARATION -> "Prête au Passe ➔"
            OrderStatus.PRETE -> "Remise Client ✓"
            else -> ""
        }

        val buttonColor = when (order.statut) {
            OrderStatus.RECOLTEE -> Color(0xFF38BDF8)
            OrderStatus.EN_PREPARATION -> Color(0xFF10B981)
            OrderStatus.PRETE -> Color(0xFFFFB300)
            else -> Color(0xFF64748B)
        }

        Button(
            onClick = { onAdvanceStatus(order.id, order.statut) },
            modifier = Modifier.fillMaxWidth().height(44.dp),
            colors = ButtonDefaults.buttonColors(containerColor = buttonColor)
        ) {
            Text(
                text = buttonLabel,
                color = Color(0xFF0F172A),
                fontWeight = FontWeight.Black,
                fontSize = 13.sp
            )
        }
    }
}
