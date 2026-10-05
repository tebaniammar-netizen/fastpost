package com.fastfood.core.database.security

import com.fastfood.core.database.entity.OrderEntity
import java.security.MessageDigest
import javax.inject.Inject
import javax.inject.Singleton

data class FiscalHashBlock(
    val orderId: String,
    val previousHash: String,
    val currentHash: String,
    val isValid: Boolean
)

data class FiscalChainVerificationResult(
    val isChainIntact: Boolean,
    val totalVerifiedBlocks: Int,
    val compromisedBlockId: String? = null
)

@Singleton
class FiscalSecurityService @Inject constructor() {

    companion object {
        const val GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

        fun sha256(input: String): String {
            val bytes = MessageDigest.getInstance("SHA-256").digest(input.toByteArray(Charsets.UTF_8))
            return bytes.joinToString("") { "%02x".format(it) }
        }

        fun calculateOrderHash(
            previousHash: String,
            orderId: String,
            reference: String,
            dateUtc: Long,
            totalTtcCentimes: Long,
            totalHtCentimes: Long,
            totalTvaCentimes: Long,
            terminalId: String
        ): String {
            val raw = "$previousHash|$orderId|$reference|$dateUtc|$totalTtcCentimes|$totalHtCentimes|$totalTvaCentimes|$terminalId"
            return sha256(raw)
        }
    }

    /**
     * Vérifie l'intégrité séquentielle de la chaîne fiscale NF525.
     * Tout montant altéré, supprimé ou inséré rétroactivement invalide la chaîne.
     */
    fun verifyChainIntegrity(orders: List<OrderEntity>): FiscalChainVerificationResult {
        if (orders.isEmpty()) {
            return FiscalChainVerificationResult(isChainIntact = true, totalVerifiedBlocks = 0)
        }

        var expectedPreviousHash = GENESIS_HASH

        for ((index, order) in orders.withIndex()) {
            // Le premier bloc part du Genesis Hash
            if (index == 0 && !order.signatureFiscale.isNullOrBlank()) {
                val computedFirst = calculateOrderHash(
                    GENESIS_HASH,
                    order.id,
                    order.reference,
                    order.dateCreationUtc,
                    order.montantTotalTtcCentimes,
                    order.montantTotalHtCentimes,
                    order.montantTotalTvaCentimes,
                    order.terminalId
                )
                if (order.signatureFiscale != computedFirst) {
                    return FiscalChainVerificationResult(
                        isChainIntact = false,
                        totalVerifiedBlocks = index,
                        compromisedBlockId = order.id
                    )
                }
                expectedPreviousHash = order.signatureFiscale
                continue
            }

            if (!order.signatureFiscale.isNullOrBlank()) {
                val computedHash = calculateOrderHash(
                    expectedPreviousHash,
                    order.id,
                    order.reference,
                    order.dateCreationUtc,
                    order.montantTotalTtcCentimes,
                    order.montantTotalHtCentimes,
                    order.montantTotalTvaCentimes,
                    order.terminalId
                )

                if (order.signatureFiscale != computedHash) {
                    return FiscalChainVerificationResult(
                        isChainIntact = false,
                        totalVerifiedBlocks = index,
                        compromisedBlockId = order.id
                    )
                }
                expectedPreviousHash = order.signatureFiscale
            }
        }

        return FiscalChainVerificationResult(
            isChainIntact = true,
            totalVerifiedBlocks = orders.size
        )
    }
}
