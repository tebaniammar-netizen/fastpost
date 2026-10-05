package com.fastfood.core.database.repository

import com.fastfood.core.database.dao.AuditLogDao
import com.fastfood.core.database.dao.CashSessionDao
import com.fastfood.core.database.dao.PaymentDao
import com.fastfood.core.database.entity.AuditLogEntity
import com.fastfood.core.database.entity.CashSessionEntity
import com.fastfood.core.model.order.UserRole
import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

data class ZReportData(
    val session: CashSessionEntity,
    val totalVentesCentimes: Long,
    val totalHtCentimes: Long,
    val totalTvaCentimes: Long,
    val totalEspecesCentimes: Long,
    val totalCarteCentimes: Long,
    val ecartCentimes: Long,
    val nombreVentes: Int
)

interface SessionRepository {
    fun getActiveSessionFlow(): Flow<CashSessionEntity?>
    suspend fun getActiveSession(): CashSessionEntity?
    suspend fun openSession(
        terminalId: String,
        caissierId: String,
        initialFloatCentimes: Long
    ): CashSessionEntity
    suspend fun getTheoreticalCash(sessionId: String): Long
    suspend fun getCardTotal(sessionId: String): Long
    suspend fun closeSession(
        sessionId: String,
        countedCashCentimes: Long,
        notes: String?
    ): CashSessionEntity
    suspend fun getZReport(sessionId: String): ZReportData
}

@Singleton
class SessionRepositoryImpl @Inject constructor(
    private val cashSessionDao: CashSessionDao,
    private val paymentDao: PaymentDao,
    private val auditLogDao: AuditLogDao
) : SessionRepository {

    override fun getActiveSessionFlow(): Flow<CashSessionEntity?> = cashSessionDao.getActiveSessionFlow()

    override fun getActiveSession(): CashSessionEntity? = kotlinx.coroutines.runBlocking {
        cashSessionDao.getActiveSession()
    }

    override suspend fun openSession(
        terminalId: String,
        caissierId: String,
        initialFloatCentimes: Long
    ): CashSessionEntity {
        val sessionId = UUID.randomUUID().toString()
        val session = CashSessionEntity(
            id = sessionId,
            terminalId = terminalId,
            caissierId = caissierId,
            dateOuvertureUtc = System.currentTimeMillis(),
            dateClotureUtc = null,
            fondInitialCentimes = initialFloatCentimes,
            totalEspecesTheoriqueCentimes = initialFloatCentimes,
            totalEspecesCompteCentimes = null,
            ecartCentimes = null,
            statut = "OUVERTE"
        )

        cashSessionDao.openSession(session)

        // Traçabilité Audit
        auditLogDao.insertAuditLog(
            AuditLogEntity(
                id = UUID.randomUUID().toString(),
                dateUtc = System.currentTimeMillis(),
                action = "OUVERTURE_CAISSE",
                utilisateurId = caissierId,
                utilisateurRole = UserRole.CAISSIER,
                entiteType = "SESSION_CAISSE",
                entiteId = sessionId,
                detailsJson = "{\"fondInitialCentimes\":$initialFloatCentimes,\"terminalId\":\"$terminalId\"}"
            )
        )

        return session
    }

    override suspend fun getTheoreticalCash(sessionId: String): Long {
        val session = cashSessionDao.getActiveSession() ?: return 0L
        val cashSales = paymentDao.getTotalCashForSession(sessionId) ?: 0L
        return session.fondInitialCentimes + cashSales
    }

    override suspend fun getCardTotal(sessionId: String): Long {
        return paymentDao.getTotalCardForSession(sessionId) ?: 0L
    }

    override suspend fun closeSession(
        sessionId: String,
        countedCashCentimes: Long,
        notes: String?
    ): CashSessionEntity {
        val session = cashSessionDao.getActiveSession() ?: throw IllegalStateException("Aucune session active")
        val cashSales = paymentDao.getTotalCashForSession(sessionId) ?: 0L
        val theoreticalCash = session.fondInitialCentimes + cashSales
        val discrepancy = countedCashCentimes - theoreticalCash

        val closedSession = session.copy(
            dateClotureUtc = System.currentTimeMillis(),
            totalEspecesTheoriqueCentimes = theoreticalCash,
            totalEspecesCompteCentimes = countedCashCentimes,
            ecartCentimes = discrepancy,
            statut = "CLOTUREE"
        )

        cashSessionDao.closeSession(closedSession)

        // Piste d'audit inaltérable obligatoire
        auditLogDao.insertAuditLog(
            AuditLogEntity(
                id = UUID.randomUUID().toString(),
                dateUtc = System.currentTimeMillis(),
                action = "CLOTURE_CAISSE",
                utilisateurId = session.caissierId,
                utilisateurRole = UserRole.CAISSIER,
                entiteType = "SESSION_CAISSE",
                entiteId = sessionId,
                detailsJson = "{\"theorique\":$theoreticalCash,\"compte\":$countedCashCentimes,\"ecart\":$discrepancy,\"notes\":\"$notes\"}"
            )
        )

        return closedSession
    }

    override suspend fun getZReport(sessionId: String): ZReportData {
        val session = cashSessionDao.getActiveSession() ?: throw IllegalStateException("Session introuvable")
        val cashSales = paymentDao.getTotalCashForSession(sessionId) ?: 0L
        val cardSales = paymentDao.getTotalCardForSession(sessionId) ?: 0L
        val totalSales = cashSales + cardSales
        val ht = Math.round(totalSales / 1.10)
        val tva = totalSales - ht
        val theoreticalCash = session.fondInitialCentimes + cashSales
        val discrepancy = (session.totalEspecesCompteCentimes ?: theoreticalCash) - theoreticalCash

        return ZReportData(
            session = session,
            totalVentesCentimes = totalSales,
            totalHtCentimes = ht,
            totalTvaCentimes = tva,
            totalEspecesCentimes = cashSales,
            totalCarteCentimes = cardSales,
            ecartCentimes = discrepancy,
            nombreVentes = 0 // Calculé via orderDao si besoin
        )
    }
}
