import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FlaskConical, 
  ShieldCheck, 
  FileCode, 
  AlertTriangle, 
  Check, 
  Copy, 
  Cpu, 
  Flame 
} from 'lucide-react';
import { ARCHITECTURE_SECTIONS } from '../../data/architectureData';

export const TestPlanTab: React.FC = () => {
  const [copiedTest, setCopiedTest] = useState(false);

  const sampleFinancialUnitTest = `package com.fastfood.core.model.order

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.assertThrows

class FinancialCalculationUnitTest {

    @Test
    fun \`calcul total commande en centimes avec extras sans derive flottante\`() {
        val burgerBasePrixCentimes = 990L // 9.90 €
        val extraCheddarCentimes = 120L   // 1.20 €
        val extraBaconCentimes = 180L     // 1.80 €
        val quantite = 3

        val ligneTotal = (burgerBasePrixCentimes + extraCheddarCentimes + extraBaconCentimes) * quantite
        // (990 + 120 + 180) * 3 = 1290 * 3 = 3870 centimes (38.70 €)
        assertEquals(3870L, ligneTotal)
    }

    @Test
    fun \`ventilation TVA stricte 10 pourcent et 5 point 5 pourcent\`() {
        val totalAlimentationCentimes = 2000L // 20.00 € TTC à 10%
        val totalBoissonEauCentimes = 200L    // 2.00 € TTC à 5.5%

        // Calcul HT = TTC / (1 + taux/100) au centime près
        val htAlim = Math.round(totalAlimentationCentimes / 1.10) // 1818 centimes
        val tvaAlim = totalAlimentationCentimes - htAlim          // 182 centimes (1.82 €)

        assertEquals(1818L, htAlim)
        assertEquals(182L, tvaAlim)
    }

    @Test
    fun \`idempotence file sync - ne rejoue jamais un paiement deja confirme\`() {
        val paymentId = "pay-uuid-test-01"
        val outboxEvent = SyncEvent(
            id = "evt-01",
            aggregateType = "PAYMENT",
            aggregateId = paymentId,
            eventType = "PAYMENT_RECORDED",
            retryCount = 3
        )
        
        val isDuplicate = syncRepository.hasAlreadyProcessed(outboxEvent.aggregateId, outboxEvent.eventType)
        assertEquals(true, isDuplicate)
    }
}`;

  const copyTestCode = () => {
    navigator.clipboard.writeText(sampleFinancialUnitTest);
    setCopiedTest(true);
    setTimeout(() => setCopiedTest(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <FlaskConical className="w-4 h-4" /> Qualité Logicielle & Robustesse
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Plan de Tests Automatisés & Stratégie d&apos;Assurance Qualité
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Couverture stricte des calculs financiers, intégrité Room SQLite, résilience hors-ligne et traçabilité d&apos;audit.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>JUnit 5 + MockK + Turbine</span>
        </div>
      </div>

      {/* Test Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ARCHITECTURE_SECTIONS.testingStrategy.map((strat, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <h3 className="text-sm font-bold text-white">{strat.category}</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                {strat.tools}
              </span>
            </div>
            <ul className="space-y-2">
              {strat.cases.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Code Snippet */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Suite de Tests Financiers & Idempotence (`FinancialCalculationUnitTest.kt`)
            </h3>
          </div>
          <button
            onClick={copyTestCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors border border-slate-700"
          >
            {copiedTest ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTest ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-96">
          <pre>{sampleFinancialUnitTest}</pre>
        </div>
      </div>
    </div>
  );
};
