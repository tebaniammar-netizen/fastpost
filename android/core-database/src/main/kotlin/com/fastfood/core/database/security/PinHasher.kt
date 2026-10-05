package com.fastfood.core.database.security

import java.security.MessageDigest
import java.security.SecureRandom
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PinHasher @Inject constructor() {

    fun generateSalt(): String {
        val random = SecureRandom()
        val salt = ByteArray(16)
        random.nextBytes(salt)
        return salt.joinToString("") { "%02x".format(it) }
    }

    fun hashPin(pin: String, salt: String): String {
        val combined = "$salt:$pin:FASTFOOD_SALT_KEY"
        val bytes = MessageDigest.getInstance("SHA-256").digest(combined.toByteArray(Charsets.UTF_8))
        return bytes.joinToString("") { "%02x".format(it) }
    }

    fun verifyPin(pin: String, salt: String, expectedHash: String): Boolean {
        val computed = hashPin(pin, salt)
        return MessageDigest.isEqual(computed.toByteArray(), expectedHash.toByteArray())
    }
}
