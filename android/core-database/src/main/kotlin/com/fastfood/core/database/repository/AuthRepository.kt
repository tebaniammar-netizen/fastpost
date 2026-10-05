package com.fastfood.core.database.repository

import com.fastfood.core.database.dao.AuditLogDao
import com.fastfood.core.database.dao.UserDao
import com.fastfood.core.database.entity.AuditLogEntity
import com.fastfood.core.database.entity.UserEntity
import com.fastfood.core.database.security.PinHasher
import com.fastfood.core.model.order.UserRole
import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

interface AuthRepository {
    fun getAllActiveUsersFlow(): Flow<List<UserEntity>>
    suspend fun authenticateWithPin(userId: String, pin: String): UserEntity?
    suspend fun verifyManagerOverride(pin: String, reason: String, performedByUserId: String): Boolean
    suspend fun logSecurityAction(action: String, userId: String, role: UserRole, details: String)
}

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val userDao: UserDao,
    private val auditLogDao: AuditLogDao,
    private val pinHasher: PinHasher
) : AuthRepository {

    override fun getAllActiveUsersFlow(): Flow<List<UserEntity>> = userDao.getAllActiveUsersFlow()

    override suspend fun authenticateWithPin(userId: String, pin: String): UserEntity? {
        val user = userDao.getUserById(userId) ?: return null
        if (!user.actif) return null

        val isValid = pinHasher.verifyPin(pin, user.pinSalt, user.pinHash)
        if (isValid) {
            logSecurityAction("CONNEXION_UTILISATEUR", user.id, user.role, "Connexion réussie")
            return user
        } else {
            logSecurityAction("ECHEC_CONNEXION", user.id, user.role, "Tentative de code PIN erroné")
            return null
        }
    }

    override suspend fun verifyManagerOverride(pin: String, reason: String, performedByUserId: String): Boolean {
        val managers = userDao.getUsersByRole(UserRole.GESTIONNAIRE)
        for (mgr in managers) {
            if (pinHasher.verifyPin(pin, mgr.pinSalt, mgr.pinHash)) {
                // Dérogation autorisée et tracée
                logSecurityAction(
                    "DEROGATION_SUPERVISEUR_ACCORDEE",
                    mgr.id,
                    mgr.role,
                    "{\"motif\":\"$reason\",\"demandePar\":\"$performedByUserId\"}"
                )
                return true
            }
        }

        logSecurityAction(
            "DEROGATION_SUPERVISEUR_REFUSEE",
            performedByUserId,
            UserRole.CAISSIER,
            "{\"motif\":\"$reason\",\"status\":\"PIN_INVALIDE\"}"
        )
        return false
    }

    override suspend fun logSecurityAction(action: String, userId: String, role: UserRole, details: String) {
        auditLogDao.insertAuditLog(
            AuditLogEntity(
                id = UUID.randomUUID().toString(),
                dateUtc = System.currentTimeMillis(),
                action = action,
                utilisateurId = userId,
                utilisateurRole = role,
                entiteType = "SECURITE",
                entiteId = userId,
                detailsJson = details
            )
        )
    }
}
