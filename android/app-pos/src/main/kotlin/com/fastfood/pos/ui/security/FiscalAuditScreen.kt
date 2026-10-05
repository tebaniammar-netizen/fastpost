package com.fastfood.pos.ui.security

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fastfood.core.database.entity.AuditLogEntity
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun FiscalAuditScreen(
    auditLogs: List<AuditLogEntity>,
    isChainValid: Boolean,
    onVerifyChain: () -> Unit,
    onExportFiscalArchive: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
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
                        text = "Conformité Fiscale NF525 & Journal d'Audit",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                    Text(
                        text = "Traçabilité inaltérable des encaissements et dérogations (Art. 286 du CGI)",
                        color = Color(0xFF94A3B8),
                        fontSize = 12.sp
                    )
                }
            }

            // Statut de la chaîne
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(
                        if (isChainValid) Color(0xFF10B981).copy(alpha = 0.2f)
                        else Color(0xFFEF4444).copy(alpha = 0.2f)
                    )
                    .border(
                        1.dp,
                        if (isChainValid) Color(0xFF10B981) else Color(0xFFEF4444),
                        RoundedCornerShape(8.dp)
                    )
                    .padding(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Text(
                    text = if (isChainValid) "✓ CHAÎNE FISCALE INTÈGRE" else "⚠️ CORRUPTION DÉTECTÉE",
                    color = if (isChainValid) Color(0xFF10B981) else Color(0xFFEF4444),
                    fontWeight = FontWeight.Black,
                    fontSize = 11.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Actions Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Button(
                onClick = onVerifyChain,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B)),
                modifier = Modifier.weight(1f)
            ) {
                Text("Vérifier signatures SHA-256", color = Color(0xFFFFB300), fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }

            Button(
                onClick = onExportFiscalArchive,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B)),
                modifier = Modifier.weight(1f)
            ) {
                Text("Exporter Fichier FEC / Clôtures", color = Color.White, fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Audit Log Stream
        if (auditLogs.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Aucun événement d'audit enregistré.", color = Color(0xFF64748B), fontSize = 14.sp)
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(auditLogs, key = { it.id }) { log ->
                    AuditLogRow(log = log)
                }
            }
        }
    }
}

@Composable
fun AuditLogRow(log: AuditLogEntity) {
    val dateStr = SimpleDateFormat("dd/MM/yyyy HH:mm:ss", Locale.FRANCE).format(Date(log.dateUtc))

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(Color(0xFF1E293B))
            .border(1.dp, Color(0xFF334155), RoundedCornerShape(10.dp))
            .padding(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(
                            when {
                                log.action.contains("SUPPRESSION") || log.action.contains("REFUSEE") -> Color(0xFFEF4444).copy(alpha = 0.2f)
                                log.action.contains("OUVERTURE") || log.action.contains("CLOTURE") -> Color(0xFFFFB300).copy(alpha = 0.2f)
                                else -> Color(0xFF38BDF8).copy(alpha = 0.2f)
                            }
                        )
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = log.action,
                        color = when {
                            log.action.contains("SUPPRESSION") || log.action.contains("REFUSEE") -> Color(0xFFEF4444)
                            log.action.contains("OUVERTURE") || log.action.contains("CLOTURE") -> Color(0xFFFFB300)
                            else -> Color(0xFF38BDF8)
                        },
                        fontWeight = FontWeight.Black,
                        fontSize = 10.sp
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                Text(
                    text = "Opérateur : ${log.utilisateurId} [${log.utilisateurRole}]",
                    color = Color(0xFF94A3B8),
                    fontSize = 11.sp
                )
            }

            Text(
                text = dateStr,
                color = Color(0xFF64748B),
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace
            )
        }

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = "Détails: ${log.detailsJson}",
            color = Color.White,
            fontSize = 12.sp,
            fontFamily = FontFamily.Monospace
        )
    }
}
