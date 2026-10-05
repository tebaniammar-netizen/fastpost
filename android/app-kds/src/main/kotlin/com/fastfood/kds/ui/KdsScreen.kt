package com.fastfood.kds.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.fastfood.core.database.dao.OrderWithDetails
import com.fastfood.core.model.order.OrderStatus
import com.fastfood.kds.ui.components.KdsTicketCard
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun KdsScreen(
    viewModel: KdsViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val timeNow = SimpleDateFormat("HH:mm:ss", Locale.FRANCE).format(Date(uiState.currentTimeMillis))

    val lateOrdersCount = remember(uiState.allActiveOrders, uiState.currentTimeMillis) {
        uiState.allActiveOrders.count {
            (uiState.currentTimeMillis - it.order.dateCreationUtc) > 10 * 60 * 1000
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A))
            .padding(14.dp)
    ) {
        // KDS Header Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFF1E293B))
                .padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "FastFood KDS • Écran Cuisine",
                    color = Color(0xFFFFB300),
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black
                )
                Spacer(modifier = Modifier.width(16.dp))

                // Badges d'état de charge
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(Color(0xFF38BDF8).copy(alpha = 0.2f))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "${uiState.allActiveOrders.size} EN COURS",
                        color = Color(0xFF38BDF8),
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp
                    )
                }

                if (lateOrdersCount > 0) {
                    Spacer(modifier = Modifier.width(8.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(Color(0xFFEF4444).copy(alpha = 0.25f))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "⚠️ $lateOrdersCount EN RETARD (>10m)",
                            color = Color(0xFFEF4444),
                            fontWeight = FontWeight.Black,
                            fontSize = 11.sp
                        )
                    }
                }
            }

            // Horloge en direct
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "HEURE : $timeNow",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // 3 Landscape Kanban Columns
        Row(
            modifier = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Colonne 1: Reçues
            KdsKanbanColumn(
                title = "1. REÇUES / EN ATTENTE",
                count = uiState.receivedOrders.size,
                headerColor = Color(0xFF38BDF8),
                orders = uiState.receivedOrders,
                currentTimeMillis = uiState.currentTimeMillis,
                onAdvanceStatus = { id, s -> viewModel.advanceOrderStatus(id, s) },
                modifier = Modifier.weight(1f)
            )

            // Colonne 2: En préparation
            KdsKanbanColumn(
                title = "2. EN PRÉPARATION (GRILL)",
                count = uiState.preparingOrders.size,
                headerColor = Color(0xFFF59E0B),
                orders = uiState.preparingOrders,
                currentTimeMillis = uiState.currentTimeMillis,
                onAdvanceStatus = { id, s -> viewModel.advanceOrderStatus(id, s) },
                modifier = Modifier.weight(1f)
            )

            // Colonne 3: Prêtes au passe
            KdsKanbanColumn(
                title = "3. PRÊTES AU PASSE",
                count = uiState.readyOrders.size,
                headerColor = Color(0xFF10B981),
                orders = uiState.readyOrders,
                currentTimeMillis = uiState.currentTimeMillis,
                onAdvanceStatus = { id, s -> viewModel.advanceOrderStatus(id, s) },
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
fun KdsKanbanColumn(
    title: String,
    count: Int,
    headerColor: Color,
    orders: List<OrderWithDetails>,
    currentTimeMillis: Long,
    onAdvanceStatus: (String, OrderStatus) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxHeight()
            .clip(RoundedCornerShape(14.dp))
            .background(Color(0xFF0B132B).copy(alpha = 0.6f))
            .padding(10.dp)
    ) {
        // En-tête de colonne
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                color = headerColor,
                fontWeight = FontWeight.Black,
                fontSize = 13.sp
            )
            Box(
                modifier = Modifier
                    .size(24.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(headerColor.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = count.toString(),
                    color = headerColor,
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp
                )
            }
        }

        if (orders.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Aucune commande",
                    color = Color(0xFF475569),
                    fontSize = 12.sp
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(orders, key = { it.order.id }) { item ->
                    KdsTicketCard(
                        orderWithDetails = item,
                        currentTimeMillis = currentTimeMillis,
                        onAdvanceStatus = onAdvanceStatus
                    )
                }
            }
        }
    }
}
