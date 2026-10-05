package com.fastfood.pos.ui.security

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
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

@Composable
fun SupervisorPinDialog(
    actionTitle: String,
    onDismiss: () -> Unit,
    onConfirmPin: (String) -> Unit
) {
    var enteredPin by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color(0xFF0F172A),
            modifier = Modifier.padding(16.dp).width(340.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFEF4444).copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("🔒", fontSize = 20.sp)
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "DÉROGATION SUPERVISEUR",
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 16.sp
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = actionTitle,
                    color = Color(0xFFFFB300),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )

                Spacer(modifier = Modifier.height(16.dp))

                // PIN Dots
                Row(
                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    repeat(4) { index ->
                        val isFilled = index < enteredPin.length
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .clip(CircleShape)
                                .background(if (isFilled) Color(0xFFFFB300) else Color(0xFF334155))
                                .border(1.dp, if (isFilled) Color(0xFFFFB300) else Color(0xFF475569), CircleShape)
                        )
                    }
                }

                if (errorMessage != null) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = errorMessage!!, color = Color(0xFFEF4444), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Clavier numérique tactile 3x4
                val keys = listOf(
                    listOf("1", "2", "3"),
                    listOf("4", "5", "6"),
                    listOf("7", "8", "9"),
                    listOf("C", "0", "✓")
                )

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    keys.forEach { row ->
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            row.forEach { key ->
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(48.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(
                                            when (key) {
                                                "✓" -> Color(0xFF10B981)
                                                "C" -> Color(0xFF334155)
                                                else -> Color(0xFF1E293B)
                                            }
                                        )
                                        .clickable {
                                            errorMessage = null
                                            when (key) {
                                                "C" -> enteredPin = ""
                                                "✓" -> {
                                                    if (enteredPin.length == 4) {
                                                        onConfirmPin(enteredPin)
                                                    } else {
                                                        errorMessage = "Le code PIN doit comporter 4 chiffres"
                                                    }
                                                }
                                                else -> {
                                                    if (enteredPin.length < 4) {
                                                        enteredPin += key
                                                        if (enteredPin.length == 4) {
                                                            onConfirmPin(enteredPin)
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = key,
                                        color = if (key == "✓") Color(0xFF0F172A) else Color.White,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 18.sp
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                TextButton(onClick = onDismiss) {
                    Text("Annuler l'action", color = Color(0xFF94A3B8), fontSize = 12.sp)
                }
            }
        }
    }
}
