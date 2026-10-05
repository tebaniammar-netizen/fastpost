package com.fastfood.core.model.money

import java.text.NumberFormat
import java.util.Locale

/**
 * Représente un montant financier immuable stocké en centimes entiers stricts (Long).
 * Interdit toute dérive de précision décimale IEEE 754.
 */
@JvmInline
value class Money(val centimes: Long) : Comparable<Money> {

    init {
        require(centimes >= 0) { "Un montant financier brut ne peut pas être négatif: $centimes" }
    }

    operator fun plus(other: Money): Money = Money(this.centimes + other.centimes)

    operator fun minus(other: Money): Money {
        val result = this.centimes - other.centimes
        require(result >= 0) { "Soustraction financière négative interdite ($centimes - ${other.centimes})" }
        return Money(result)
    }

    operator fun times(factor: Int): Money {
        require(factor >= 0) { "Multiplicateur de quantité négatif interdit: $factor" }
        return Money(this.centimes * factor)
    }

    override fun compareTo(other: Money): Int = this.centimes.compareTo(other.centimes)

    /**
     * Formate en devise locale française (ex: "14,50 €")
     */
    fun formatEuro(): String {
        val format = NumberFormat.getCurrencyInstance(Locale.FRANCE)
        return format.format(centimes / 100.0)
    }

    /**
     * Calcule le montant HT à partir du montant TTC pour un taux de TVA en points de base.
     * Ex: 1000 points de base = 10.0% -> multiplicateur 1.10
     */
    fun calculateHt(tvaBasisPoints: Int): Money {
        val rate = 1.0 + (tvaBasisPoints / 10000.0)
        val htVal = Math.round(centimes / rate)
        return Money(htVal)
    }

    /**
     * Calcule la part de TVA
     */
    fun calculateTva(tvaBasisPoints: Int): Money {
        val ht = calculateHt(tvaBasisPoints)
        return this - ht
    }

    companion object {
        val ZERO = Money(0L)

        fun fromEuro(euros: Double): Money {
            require(euros >= 0.0) { "Montant en euros négatif interdit: $euros" }
            return Money(Math.round(euros * 100.0))
        }

        fun fromCentimes(cents: Long): Money = Money(cents)
    }
}
