package com.fastfood.pos.ui.stock

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import com.fastfood.core.database.entity.IngredientEntity

@Composable
fun StockScreen(
    viewModel: StockViewModel,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF0F172A))
            .padding(16.dp)
    ) {
        // Top Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) {
                    Text("⬅", color = Color(0xFFFFB300), fontSize = 20.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "Gestion des Stocks & Ingrédients",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                    Text(
                        text = "${uiState.filteredIngredients.size} matière(s) première(s) suivie(s)",
                        color = Color(0xFF94A3B8),
                        fontSize = 12.sp
                    )
                }
            }

            if (uiState.lowStockCount > 0) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFFEF4444).copy(alpha = 0.2f))
                        .border(1.dp, Color(0xFFEF4444), RoundedCornerShape(8.dp))
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = "⚠️ ${uiState.lowStockCount} INGRÉDIENT(S) CRITIQUES",
                        color = Color(0xFFEF4444),
                        fontWeight = FontWeight.Black,
                        fontSize = 11.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Search & Filters
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { viewModel.setSearchQuery(it) },
                placeholder = { Text("Rechercher un ingrédient (Pain, Steak, Cheddar...)", color = Color(0xFF64748B), fontSize = 13.sp) },
                modifier = Modifier.weight(1f),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = Color(0xFFFFB300),
                    unfocusedBorderColor = Color(0xFF334155)
                ),
                singleLine = true
            )

            // Bouton bascule Alertes
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(10.dp))
                    .background(if (uiState.filterOnlyLowStock) Color(0xFFEF4444) else Color(0xFF1E293B))
                    .clickable { viewModel.toggleFilterOnlyLowStock() }
                    .padding(horizontal = 14.dp, vertical = 12.dp)
            ) {
                Text(
                    text = if (uiState.filterOnlyLowStock) "Afficher Tous" else "Seuils Critiques",
                    color = if (uiState.filterOnlyLowStock) Color.White else Color(0xFF94A3B8),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // List of Ingredients
        if (uiState.isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Color(0xFFFFB300))
            }
        } else if (uiState.filteredIngredients.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Aucun ingrédient correspondant.", color = Color(0xFF64748B), fontSize = 14.sp)
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(uiState.filteredIngredients, key = { it.id }) { ing ->
                    IngredientRow(
                        ingredient = ing,
                        onReplenish = { viewModel.openReplenishDialog(ing) },
                        onAdjust = { viewModel.openInventoryAdjustmentDialog(ing) }
                    )
                }
            }
        }
    }

    // Modal Réapprovisionnement
    if (uiState.activeIngredientForReplenish != null) {
        ReplenishStockDialog(
            ingredient = uiState.activeIngredientForReplenish!!,
            onDismiss = { viewModel.dismissReplenishDialog() },
            onConfirm = { qty, sup, inv -> viewModel.confirmReplenishment(qty, sup, inv) }
        )
    }

    // Modal Ajustement Inventaire
    if (uiState.activeIngredientForInventory != null) {
        InventoryAdjustmentDialog(
            ingredient = uiState.activeIngredientForInventory!!,
            onDismiss = { viewModel.dismissInventoryAdjustmentDialog() },
            onConfirm = { count, reason -> viewModel.confirmInventoryAdjustment(count, reason) }
        )
    }
}

@Composable
fun IngredientRow(
    ingredient: IngredientEntity,
    onReplenish: () -> Unit,
    onAdjust: () -> Unit
) {
    val isCritical = ingredient.stockActuel <= ingredient.seuilAlerte
    val ratio = if (ingredient.seuilAlerte > 0) ingredient.stockActuel / (ingredient.seuilAlerte * 3.0) else 1.0
    val progress = ratio.coerceIn(0.0, 1.0).toFloat()

    val barColor = when {
        isCritical -> Color(0xFFEF4444)
        progress < 0.5f -> Color(0xFFF59E0B)
        else -> Color(0xFF10B981)
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFF1E293B))
            .border(
                width = if (isCritical) 1.5.dp else 1.dp,
                color = if (isCritical) Color(0xFFEF4444).copy(alpha = 0.5f) else Color(0xFF334155),
                shape = RoundedCornerShape(12.dp)
            )
            .padding(14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = ingredient.nom,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
                if (isCritical) {
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(Color(0xFFEF4444).copy(alpha = 0.2f))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text("SEUIL BAS", color = Color(0xFFEF4444), fontSize = 9.sp, fontWeight = FontWeight.Black)
                    }
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Stock : ${ingredient.stockActuel} ${ingredient.unite} (Seuil d'alerte : ${ingredient.seuilAlerte} ${ingredient.unite})",
                color = Color(0xFF94A3B8),
                fontSize = 12.sp
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Jauge de stock
            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier
                    .fillMaxWidth(0.8f)
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = barColor,
                trackColor = Color(0xFF0F172A)
            )
        }

        // Actions
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Button(
                onClick = onReplenish,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981).copy(alpha = 0.2f)),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Text("+ Réappro", color = Color(0xFF10B981), fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }

            Button(
                onClick = onAdjust,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF334155)),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Text("Inventaire", color = Color(0xFFFFB300), fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}
