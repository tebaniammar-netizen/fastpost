package com.fastfood.core.model.order

import com.fastfood.core.model.money.Money

enum class OrderType {
    SUR_PLACE,
    A_EMPORTER,
    LIVRAISON
}

enum class OrderStatus {
    RECOLTEE,
    EN_PREPARATION,
    PRETE,
    REMISE,
    ANNULEE;

    /**
     * Règle de monotonie des statuts en cuisine :
     * Une commande ne peut jamais être rétrogradée vers un état antérieur
     */
    fun canTransitionTo(next: OrderStatus): Boolean {
        if (this == ANNULEE) return false
        if (next == ANNULEE) return this != REMISE
        return next.ordinal >= this.ordinal
    }
}

enum class PaymentMethod {
    ESPECES,
    CARTE_BANCAIRE,
    TITRE_RESTAURANT,
    FIDELITE
}

enum class PaymentStatus {
    EN_ATTENTE,
    VALIDE,
    REFUSE,
    REMBOURSE
}

enum class SyncStatus {
    PENDING,
    SYNCED,
    FAILED,
    CONFLICT
}

enum class UserRole {
    ADMINISTRATEUR,
    GESTIONNAIRE,
    CAISSIER,
    CUISINIER,
    LIVREUR,
    CLIENT
}

data class OrderExtra(
    val id: String,
    val nom: String,
    val prix: Money
)

data class OrderLine(
    val id: String,
    val produitId: String,
    val produitNomSnapshot: String,
    val varianteNomSnapshot: String? = null,
    val prixUnitaire: Money,
    val quantite: Int,
    val extras: List<OrderExtra> = emptyList(),
    val notePreparation: String? = null
) {
    init {
        require(quantite > 0) { "La quantité doit être supérieure à 0: $quantite" }
    }

    val totalLigne: Money
        get() {
            val totalExtras = extras.fold(Money.ZERO) { acc, extra -> acc + extra.prix }
            return (prixUnitaire + totalExtras) * quantite
        }
}

data class Payment(
    val id: String,
    val commandeId: String,
    val modePaiement: PaymentMethod,
    val montant: Money,
    val monnaieRendue: Money = Money.ZERO,
    val statut: PaymentStatus = PaymentStatus.VALIDE,
    val referenceExterne: String? = null,
    val datePaiementUtc: Long = System.currentTimeMillis(),
    val caissierId: String
)

data class Order(
    val id: String,
    val numeroJour: Int,
    val referenceUnique: String,
    val dateCreationUtc: Long = System.currentTimeMillis(),
    val typeCommande: OrderType,
    val statut: OrderStatus = OrderStatus.RECOLTEE,
    val lignes: List<OrderLine>,
    val remise: Money = Money.ZERO,
    val remiseMotif: String? = null,
    val remiseAuteurId: String? = null,
    val sessionCaisseId: String,
    val caissierId: String,
    val terminalId: String,
    val clientNom: String? = null,
    val clientTelephone: String? = null,
    val paiements: List<Payment> = emptyList(),
    val syncStatus: SyncStatus = SyncStatus.PENDING,
    val syncAttempts: Int = 0
) {
    val totalBrutTtc: Money
        get() = lignes.fold(Money.ZERO) { acc, ligne -> acc + ligne.totalLigne }

    val totalNetTtc: Money
        get() {
            val brut = totalBrutTtc
            return if (remise >= brut) Money.ZERO else brut - remise
        }

    val totalPaye: Money
        get() = paiements
            .filter { it.statut == PaymentStatus.VALIDE }
            .fold(Money.ZERO) { acc, p -> acc + p.montant }

    val estTotalementPayee: Boolean
        get() = totalPaye >= totalNetTtc && totalNetTtc > Money.ZERO
}
