package com.fastfood.pos.ui.history

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import com.fastfood.core.model.money.Money
import com.fastfood.core.model.order.OrderStatus
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun OrderHistoryScreen(
    viewModel: OrderHistoryViewModel,
    onBackToCashRegister: () -> Unit,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A))
            .padding(16.dp)
    ) {
        // Top Navigation
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBackToCashRegister) {
                    Text("⬅", color = Color(0xFFFFB300), fontSize = 20.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "Historique des Commandes & Tickets",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                    Text(
                        text = "${uiState.filteredOrders.size} commande(s) trouvée(s)",
                        color = Color(0xFF94A3B8),
                        fontSize = 12.sp
                    )
                }
            }

            Button(
                onClick = onBackToCashRegister,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B))
            ) {
                Text("Retour Caisse", color = Color(0xFFFFB300), fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Search & Filters Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { viewModel.setSearchQuery(it) },
                placeholder = { Text("Recherche par n° (#042), référence ou nom de client...", color = Color(0xFF64748B), fontSize = 13.sp) },
                modifier = Modifier.weight(1f),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = Color(0xFFFFB300),
                    unfocusedBorderColor = Color(0xFF334155)
                ),
                singleLine = true
            )

            // Status Filter Pills
            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                item {
                    FilterPill(
                        label = "Tous",
                        isSelected = uiState.filterStatus == null,
                        onClick = { viewModel.setFilterStatus(null) }
                    )
                }
                items(OrderStatus.values()) { status ->
                    FilterPill(
                        label = status.name,
                        isSelected = uiState.filterStatus == status,
                        onClick = { viewModel.setFilterStatus(status) }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // List of Orders
        if (uiState.isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Color(0xFFFFB300))
            }
        } else if (uiState.filteredOrders.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Aucune commande correspondante.", color = Color(0xFF64748B), fontSize = 14.sp)
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(uiState.filteredOrders, key = { it.order.id }) { item ->
                    OrderHistoryRow(
                        orderWithDetails = item,
                        onClick = { viewModel.selectOrderForReceipt(item) }
                    )
                }
            }
        }
    }

    // Modal Ticket Receipt
    if (uiState.selectedOrderForReceipt != null) {
        TicketReceiptDialog(
            orderWithDetails = uiState.selectedOrderForReceipt!!,
            onDismiss = { viewModel.selectOrderForReceipt(null) }
        )
    }
}

@Composable
fun FilterPill(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(if (isSelected) Color(0xFFFFB300) else Color(0xFF1E293B))
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Text(
            text = label,
            color = if (isSelected) Color(0xFF0F172A) else Color(0xFF94A3B8),
            fontWeight = FontWeight.Bold,
            fontSize = 11.sp
        )
    }
}

@Composable
fun OrderHistoryRow(
    orderWithDetails: OrderWithDetails,
    onClick: () -> Unit
) {
    val order = orderWithDetails.order
    val dateStr = SimpleDateFormat("HH:mm", Locale.FRANCE).format(Date(order.dateCreationUtc))

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFF1E293B))
            .clickable { onClick() }
            .padding(14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFFFFB300).copy(alpha = 0.15f))
                    .padding(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Text(
                    text = "#${String.format("%03d", order.numeroJour)}",
                    color = Color(0xFFFFB300),
                    fontWeight = FontWeight.Black,
                    fontSize = 14.sp
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column {
                Text(
                    text = order.referenceUnique,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
                Text(
                    text = "$dateStr • ${order.clientNom ?: "Client Comptoir"} • ${order.typeCommande}",
                    color = Color(0xFF94A3B8),
                    fontSize = 11.sp
                )
            }
        }

        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(
                        when (order.statut) {
                            OrderStatus.REMISE -> Color(0xFF10B981).copy(alpha = 0.15f)
                            OrderStatus.PRETE -> Color(0xFF38BDF8).copy(alpha = 0.15f)
                            OrderStatus.EN_PREPARATION -> Color(0xFFF59E0B).copy(alpha = 0.15f)
                            else -> Color(0xFF64748B).copy(alpha = 0.15f)
                        }
                    )
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = order.statut.name,
                    color = when (order.statut) {
                        OrderStatus.REMISE -> Color(0xFF10B981)
                        OrderStatus.PRETE -> Color(0xFF38BDF8)
                        OrderStatus.EN_PREPARATION -> Color(0xFFF59E0B)
                        else -> Color(0xFF94A3B8)
                    },
                    fontWeight = FontWeight.Bold,
                    fontSize = 10.sp
                )
            }

            Text(
                text = Money(order.totalTtcCentimes).formatEuro(),
                color = Color.White,
                fontWeight = FontWeight.Black,
                fontSize = 15.sp
            )

            Text("➔", color = Color(0xFF64748B), fontSize = 14.sp)
        }
    }
}
