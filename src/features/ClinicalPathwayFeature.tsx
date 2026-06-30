import { useState, useEffect } from 'preact/hooks'
import { useClinicalPathway } from '@/hooks/useClinicalPathway'
import { useMasterDiagnoses } from '@/hooks/useMasterDiagnoses'
import type { SDKCallbacks, DiagnosisMaster } from '@/types'

import { PathwayResult } from '@/components/clinical-pathway/PathwayResult'
import { ContextSettingsPanel } from '@/components/clinical-pathway/ContextSettingsPanel'
import { DiagnosisAutocomplete } from '@/components/clinical-pathway/DiagnosisAutocomplete'

interface Props {
  callbacks?: Pick<SDKCallbacks, 'onResultPathway'>
}

export function ClinicalPathwayFeature({ callbacks }: Props) {
  const { state, result, error, generate, save, reset } = useClinicalPathway(callbacks)
  const { diagnoses, loading: loadingDiagnoses, error: errorDiagnoses } = useMasterDiagnoses()
  
  // Context Mock Settings
  const [showSettings, setShowSettings] = useState(false)
  const [regNo, setRegNo] = useState('TEST/001/RD')
  const [tipeKunjungan, setTipeKunjungan] = useState('Rawat Darurat')
  const [age, setAge] = useState(55)
  const [isBpjs, setIsBpjs] = useState(false)
  
  // Form State
  const [targetHari, setTargetHari] = useState(3)
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisMaster | null>(null)
  
  // Auto set targetHari = 1 when Rawat Jalan
  useEffect(() => {
    if (tipeKunjungan === 'Rawat Jalan') {
      setTargetHari(1)
    }
  }, [tipeKunjungan])

  const handleGenerate = () => {
    if (!selectedDiagnosis) return
    generate({
      registration_no: regNo,
      diagnosa_id: selectedDiagnosis.id,
      tipe_kunjungan: tipeKunjungan,
      is_bpjs: isBpjs,
      age_in_years: age,
      target_hari_dokter: targetHari
    })
  }

  return (
    <div class="feature-layout" style={{ position: 'relative' }}>
      <div class="feature-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 class="feature-title">Clinical Pathway</h2>
          <p class="feature-subtitle">Generate rencana perawatan terstruktur berdasarkan diagnosis</p>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}
          title="Context Settings (Mock)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>

      {showSettings && (
        <ContextSettingsPanel
          regNo={regNo}
          setRegNo={setRegNo}
          tipeKunjungan={tipeKunjungan}
          setTipeKunjungan={setTipeKunjungan}
          age={age}
          setAge={setAge}
          isBpjs={isBpjs}
          setIsBpjs={setIsBpjs}
        />
      )}

      {state === 'IDLE' && (
        <div class="feature-form">
          <label class="form-label">Diagnosis Utama</label>
          {loadingDiagnoses ? (
            <div style={{ padding: '8px', color: '#64748b', fontSize: '13px' }}>Memuat Master Diagnosa...</div>
          ) : errorDiagnoses ? (
            <div style={{ padding: '8px', color: '#ef4444', fontSize: '13px' }}>Error: {errorDiagnoses}</div>
          ) : (
            <DiagnosisAutocomplete 
              diagnoses={diagnoses} 
              selectedDiagnosis={selectedDiagnosis} 
              onSelectDiagnosis={setSelectedDiagnosis} 
            />
          )}

          {tipeKunjungan !== 'Rawat Jalan' && (
            <div style={{ marginTop: '16px' }}>
              <label class="form-label">Target Hari Dokter</label>
              <input
                class="form-input"
                type="number"
                min="1"
                placeholder="Target rawat inap/observasi (hari)"
                value={targetHari}
                onInput={e => setTargetHari(parseInt((e.target as HTMLInputElement).value) || 1)}
              />
            </div>
          )}

          <div style={{ marginTop: '24px' }}>
            <button
              class="btn btn-primary btn-primary-custom btn-full"
              onClick={handleGenerate}
              disabled={!selectedDiagnosis}
            >
              Generate Pathway
            </button>
          </div>
        </div>
      )}

      {state === 'GENERATING' && (
        <div class="feature-loading">
          <div class="loading-spinner" />
          <p class="loading-text">Membuat clinical pathway...</p>
          <p class="loading-sub">Menyusun rencana perawatan untuk {selectedDiagnosis?.name || 'Pasien'}</p>
        </div>
      )}

      {state === 'DONE' && result && <PathwayResult result={result} onReset={reset} onSave={save} />}

      {state === 'ERROR' && (
        <div class="feature-error">
          <p>{error}</p>
          <button class="btn btn-secondary btn-sm" onClick={reset}>
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  )
}

