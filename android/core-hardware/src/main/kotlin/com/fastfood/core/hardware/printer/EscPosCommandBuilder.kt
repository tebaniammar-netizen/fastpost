package com.fastfood.core.hardware.printer

import com.fastfood.core.database.dao.OrderWithDetails
import com.fastfood.core.database.entity.CashSessionEntity
import com.fastfood.core.model.money.Money
import java.io.ByteArrayOutputStream
import java.nio.charset.Charset
import java.text.SimpleDateFormat
import java.util.*

class EscPosCommandBuilder(private val charset: Charset = Charset.forName("CP850")) {

    private val stream = ByteArrayOutputStream()

    fun reset(): EscPosCommandBuilder {
        stream.write(byteArrayOf(0x1B, 0x40)) // ESC @ (Initialisation)
        return this
    }

    fun alignLeft(): EscPosCommandBuilder {
        stream.write(byteArrayOf(0x1B, 0x61, 0x00))
        return this
    }

    fun alignCenter(): EscPosCommandBuilder {
        stream.write(byteArrayOf(0x1B, 0x61, 0x01))
        return this
    }

    fun alignRight(): EscPosCommandBuilder {
        stream.write(byteArrayOf(0x1B, 0x61, 0x02))
        return this
    }

    fun setBold(enable: Boolean): EscPosCommandBuilder {
        stream.write(byteArrayOf(0x1B, 0x45, if (enable) 0x01 else 0x00))
        return this
    }

    fun setDoubleSize(enable: Boolean): EscPosCommandBuilder {
        stream.write(byteArrayOf(0x1D, 0x21, if (enable) 0x11 else 0x00))
        return this
    }

    fun text(str: String): EscPosCommandBuilder {
        stream.write(str.toByteArray(charset))
        return this
    }

    fun textLine(str: String = ""): EscPosCommandBuilder {
        stream.write(str.toByteArray(charset))
        stream.write(0x0A) // LF
        return this
    }

    fun twoColumnLine(left: String, right: String, totalColumns: Int = 42): EscPosCommandBuilder {
        val spacesCount = maxOf(1, totalColumns - left.length - right.length)
        val line = left + " ".repeat(spacesCount) + right
        return textLine(line)
    }

    fun feedLines(count: Int = 3): EscPosCommandBuilder {
        repeat(count) { stream.write(0x0A) }
        return this
    }

    fun cutPaper(fullCut: Boolean = false): EscPosCommandBuilder {
        feedLines(3)
        if (fullCut) {
            stream.write(byteArrayOf(0x1D, 0x56, 0x42, 0x00)) // GS V 'B' 0
        } else {
            stream.write(byteArrayOf(0x1D, 0x56, 0x01)) // Découpe partielle
        }
        return this
    }

    /**
     * Commande standard d'impulsion pour tiroir-caisse RJ12/RJ11 :
     * ESC p m t1 t2 (0x1B 0x70 0x00 0x19 0xFA) -> 50ms d'activation, 500ms d'attente
     */
    fun openCashDrawer(): EscPosCommandBuilder {
        stream.write(byteArrayOf(0x1B, 0x70, 0x00, 0x19, 0xFA.toByte()))
        return this
    }

    fun toByteArray(): ByteArray = stream.toByteArray()

    // ====== CONSTRUCTEURS DE TICKETS FASTFOOD ======

    fun buildCustomerReceipt(
        orderWithDetails: OrderWithDetails,
        cashGivenCentimes: Long = 0L
    ): ByteArray {
        val order = orderWithDetails.order
        val lines = orderWithDetails.lines
        val dateFormatted = SimpleDateFormat("dd/MM/yyyy HH:mm:ss", Locale.FRANCE).format(Date(order.dateCreationUtc))

        reset()
            .alignCenter()
            .setBold(true)
            .setDoubleSize(true)
            .textLine("FASTFOOD GOURMET")
            .setDoubleSize(false)
            .textLine("75001 Paris • Tél: 01 42 00 00 00")
            .textLine("SIRET : 889 123 456 00012 • TVA : FR12889123456")
            .textLine("------------------------------------------")
            .alignLeft()
            .setBold(true)
            .textLine("COMMANDE N° #${String.format("%03d", order.numeroJour)}  [${order.typeCommande.label}]")
            .setBold(false)
            .textLine("Réf : ${order.reference}")
            .textLine("Date : $dateFormatted")
            .textLine("Caisse : ${order.terminalId} • Caissier : ${order.caissierId}")
            if (!order.clientNom.isNullOrBlank()) {
                textLine("Client : ${order.clientNom}")
            }
        textLine("------------------------------------------")

        // Lignes d'articles
        for (item in lines) {
            val qteText = "${item.quantite}x ${item.produitNomSnapshot}"
            val totalText = Money(item.totalLigneCentimes).formatEuro()
            twoColumnLine(qteText, totalText)

            if (!item.varianteNomSnapshot.isNullOrBlank()) {
                textLine("   ↳ ${item.varianteNomSnapshot}")
            }
            if (!item.extrasJson.isNullOrBlank()) {
                textLine("   + ${item.extrasJson}")
            }
            if (!item.notePreparation.isNullOrBlank()) {
                textLine("   * Note: ${item.notePreparation}")
            }
        }

        textLine("------------------------------------------")
            .setBold(true)
            .twoColumnLine("TOTAL TTC :", Money(order.montantTotalTtcCentimes).formatEuro())
            .setBold(false)
            .twoColumnLine("Dont Total HT :", Money(order.montantTotalHtCentimes).formatEuro())
            .twoColumnLine("Dont TVA (10.0%) :", Money(order.montantTotalTvaCentimes).formatEuro())

        if (order.remiseCentimes > 0) {
            twoColumnLine("Remise accordée :", "-${Money(order.remiseCentimes).formatEuro()}")
        }

        // Paiements & Monnaie
        orderWithDetails.payments.forEach { p ->
            twoColumnLine("Paiement [${p.moyenPaiement.label}] :", Money(p.montantCentimes).formatEuro())
        }

        if (order.monnaieRendueCentimes > 0) {
            twoColumnLine("Espèces remises :", Money(cashGivenCentimes).formatEuro())
            twoColumnLine("Monnaie rendue :", Money(order.monnaieRendueCentimes).formatEuro())
        }

        textLine("------------------------------------------")
            .alignCenter()
            .textLine("Merci de votre visite et bon appétit !")
            .textLine("Conservez ce ticket pour le retrait")
            .cutPaper(false)

        return toByteArray()
    }

    fun buildKitchenTicket(orderWithDetails: OrderWithDetails): ByteArray {
        val order = orderWithDetails.order
        val lines = orderWithDetails.lines
        val timeFormatted = SimpleDateFormat("HH:mm:ss", Locale.FRANCE).format(Date(order.dateCreationUtc))

        reset()
            .alignCenter()
            .setDoubleSize(true)
            .setBold(true)
            .textLine("CUISINE FASTFOOD")
            .textLine("#${String.format("%03d", order.numeroJour)}")
            .setDoubleSize(false)
            .textLine("[${order.typeCommande.label}] - $timeFormatted")
            .textLine("==========================================")
            .alignLeft()

        for (item in lines) {
            setBold(true)
            textLine("${item.quantite}x ${item.produitNomSnapshot}")
            setBold(false)

            if (!item.varianteNomSnapshot.isNullOrBlank()) {
                textLine("   ↳ ${item.varianteNomSnapshot}")
            }
            if (!item.extrasJson.isNullOrBlank()) {
                textLine("   + ${item.extrasJson}")
            }
            if (!item.notePreparation.isNullOrBlank()) {
                setBold(true)
                textLine("   >> AVERTISSEMENT : ${item.notePreparation}")
                setBold(false)
            }
            textLine()
        }

        alignCenter()
            .textLine("==========================================")
            .cutPaper(true)

        return toByteArray()
    }
}
