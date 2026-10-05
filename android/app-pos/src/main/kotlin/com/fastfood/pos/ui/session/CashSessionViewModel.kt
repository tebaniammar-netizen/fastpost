package com.fastfood.pos.ui.session

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fastfood.core.database.entity.CashSessionEntity
import com.fastfood.core.database.repository.SessionRepository
import com.fastfood.core.database.repository.ZReportData
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CashSessionUiState(
    val isLoading: Boolean = false,
    val activeSession: CashSessionEntity? = null,
    val theoreticalCashCentimes: Long = 0L,
    val cardTotalCentimes: Long = 0L,
    val isOpeningDialogOpen: Boolean = false,
    val isClosingDialogOpen: Boolean = false,
    val zReportData: ZReportData? = null,
    val errorMessage: String? = null
)

@HiltViewModel
class CashSessionViewModel @Inject constructor(
    private val sessionRepository: SessionRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CashSessionUiState(isLoading = true))
    val uiState: StateFlow<CashSessionUiState> = _uiState.asStateFlow()

    init {
        observeActiveSession()
    }

    private fun observeActiveSession() {
        viewModelScope.launch {
            sessionRepository.getActiveSessionFlow().collect { session ->
                _uiState.update { it.copy(activeSession = session, isLoading = false) }
                if (session != null) {
                    refreshFinancialTotals(session.id)
                }
            }
        }
    }

    fun refreshFinancialTotals(sessionId: String) {
        viewModelScope.launch {
            val theoCash = sessionRepository.getTheoreticalCash(sessionId)
            val cardTot = sessionRepository.getCardTotal(sessionId)
            _uiState.update {
                it.copy(
                    theoreticalCashCentimes = theoCash,
                    cardTotalCentimes = cardTot
                )
            }
        }
    }

    fun openSession(initialFloatCentimes: Long) {
        viewModelScope.launch {
            try {
                sessionRepository.openSession(
                    terminalId = "TERM-01",
                    caissierId = "usr-caissier-1",
                    initialFloatCentimes = initialFloatCentimes
                )
                _uiState.update { it.copy(isOpeningDialogOpen = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(errorMessage = e.message) }
            }
        }
    }

    fun closeSession(countedCashCentimes: Long, notes: String?) {
        val current = _uiState.value.activeSession ?: return
        viewModelScope.launch {
            try {
                sessionRepository.closeSession(current.id, countedCashCentimes, notes)
                val zReport = sessionRepository.getZReport(current.id)
                _uiState.update {
                    it.copy(
                        isClosingDialogOpen = false,
                        zReportData = zReport
                    )
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(errorMessage = e.message) }
            }
        }
    }

    fun openCloseSessionDialog() {
        val session = _uiState.value.activeSession ?: return
        refreshFinancialTotals(session.id)
        _uiState.update { it.copy(isClosingDialogOpen = true) }
    }

    fun dismissCloseSessionDialog() {
        _uiState.update { it.copy(isClosingDialogOpen = false) }
    }

    fun openOpenSessionDialog() {
        _uiState.update { it.copy(isOpeningDialogOpen = true) }
    }

    fun dismissOpenSessionDialog() {
        _uiState.update { it.copy(isOpeningDialogOpen = false) }
    }

    fun dismissZReport() {
        _uiState.update { it.copy(zReportData = null) }
    }
}
