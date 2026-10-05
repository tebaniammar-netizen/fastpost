package com.fastfood.pos.ui.session

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
import com.fastfood.core.database.repository.ZReportData
import com.fastfood.core.model.money.Money
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ZReportDialog(
    zReportData: ZReportData,
    onDismiss: () -> Unit,
    onPrintZReport: () -> Unit = {}
) {
    val session = zReportData.session
    val dateOuverture = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.FRANCE).format(Date(session.dateOuvertureUtc))
    val dateCloture = session.dateClotureUtc?.let {
        SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.FRANCE).format(Date(it))
    } ?: "En cours"

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = Color(0xFF0F172A),
            modifier = Modifier.padding(16.dp).fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(20.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Ticket Z Paper Layout
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
                        text = "RAPPORT DE CLÔTURE Z",
                        color = Color.Black,
                        fontWeight = FontWeight.Black,
                        fontSize = 16.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "FASTFOOD GOURMET PARIS",
                        color = Color(0xFF475569),
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "Terminal : ${session.terminalId} • Opérateur : ${session.caissierId}",
                        color = Color(0xFF64748B),
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "Ouvert: $dateOuverture",
                        color = Color(0xFF64748B),
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "Clôturé: $dateCloture",
                        color = Color(0xFF64748B),
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace
                    )

                    Spacer(modifier = Modifier.height(8.dp))
                    Text("--------------------------------", color = Color(0xFF94A3B8), fontFamily = FontFamily.Monospace)

                    // Synthèse CA
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("CHIFFRE D'AFFAIRES TTC :", color = Color.Black, fontWeight = FontWeight.Black, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(zReportData.totalVentesCentimes).formatEuro(), color = Color.Black, fontWeight = FontWeight.Black, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Dont Total HT :", color = Color(0xFF475569), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(zReportData.totalHtCentimes).formatEuro(), color = Color.Black, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Dont TVA 10% :", color = Color(0xFF475569), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(zReportData.totalTvaCentimes).formatEuro(), color = Color.Black, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text("--- VENTILATION RÈGLEMENTS ---", color = Color(0xFF64748B), fontSize = 10.sp, fontFamily = FontFamily.Monospace)

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Ventes Carte Bancaire :", color = Color(0xFF334155), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(zReportData.totalCarteCentimes).formatEuro(), color = Color.Black, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Ventes Espèces :", color = Color(0xFF334155), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(zReportData.totalEspecesCentimes).formatEuro(), color = Color.Black, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text("--- CONTRÔLE TIROIR-CAISSE ---", color = Color(0xFF64748B), fontSize = 10.sp, fontFamily = FontFamily.Monospace)

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Fond de caisse initial :", color = Color(0xFF475569), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(session.fondInitialCentimes).formatEuro(), color = Color.Black, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Espèces théoriques :", color = Color(0xFF475569), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(session.totalEspecesTheoriqueCentimes).formatEuro(), color = Color.Black, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Espèces comptées :", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        Text(Money(session.totalEspecesCompteCentimes ?: session.totalEspecesTheoriqueCentimes).formatEuro(), color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("ÉCART DE CAISSE :", color = if (zReportData.ecartCentimes == 0L) Color(0xFF059669) else Color(0xFFDC2626), fontWeight = FontWeight.Black, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                        Text(
                            (if (zReportData.ecartCentimes > 0) "+" else "") + Money(zReportData.ecartCentimes).formatEuro(),
                            color = if (zReportData.ecartCentimes == 0L) Color(0xFF059669) else Color(0xFFDC2626),
                            fontWeight = FontWeight.Black,
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text("Signature du caissier :", color = Color(0xFF64748B), fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("________________________", color = Color(0xFF94A3B8), fontFamily = FontFamily.Monospace)
                }

                Spacer(modifier = Modifier.height(16.dp))

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
                        onClick = onPrintZReport,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFB300))
                    ) {
                        Text("🖨️ Imprimer Rapport Z", color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
