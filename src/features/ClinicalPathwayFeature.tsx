import { useState } from 'preact/hooks'
import { useClinicalPathway } from '@/hooks/useClinicalPathway'
import { useMasterDiagnoses } from '@/hooks/useMasterDiagnoses'
import type { SDKCallbacks, DiagnosisMaster } from '@/types'

import { PathwayResult } from '@/components/clinical-pathway/PathwayResult'
import { DiagnosisAutocomplete } from '@/components/clinical-pathway/DiagnosisAutocomplete'

interface Props {
  callbacks?: Pick<SDKCallbacks, 'onResultPathway'>
  age?: number
  isBPJS?: boolean
  departmentId?: string
}

export function ClinicalPathwayFeature({ callbacks, age, isBPJS, departmentId }: Props) {
  const { state, result, error, generate, save, reset } = useClinicalPathway(callbacks)
  const { diagnoses, loading: loadingDiagnoses, error: errorDiagnoses } = useMasterDiagnoses()

  // Context Mock Settings
  // const [showSettings, setShowSettings] = useState(false)
  // const [regNo, setRegNo] = useState('TEST/001/RD')
  // const [tipeKunjungan, setTipeKunjungan] = useState('Rawat Darurat')
  // const [age, setAge] = useState(55)
  // const [isBpjs, setIsBpjs] = useState(false)

  // Form State
  const [targetHari, setTargetHari] = useState(3)
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisMaster | null>(null)

  // Auto set targetHari = 1 when Rawat Jalan
  // useEffect(() => {
  //   if (tipeKunjungan === 'Rawat Jalan') {
  //     setTargetHari(1)
  //   }
  // }, [tipeKunjungan])

  const handleGenerate = () => {
    if (!selectedDiagnosis) return
    generate({
      diagnosa_id: selectedDiagnosis.id,
      tipe_kunjungan: departmentId || '',
      is_bpjs: isBPJS || false,
      age_in_years: age || 0,
      target_hari_dokter: targetHari,
    })
  }

  return (
    <div class="feature-layout clinical-pathway-root">
      <div class="feature-header clinical-pathway-header">
        <div>
          <h2 class="feature-title">Clinical Pathway</h2>
          <p class="feature-subtitle">Generate rencana perawatan terstruktur berdasarkan diagnosis</p>
        </div>
      </div>

      {state === 'IDLE' && (
        <div class="feature-form">
          <label class="form-label">Diagnosis Utama</label>
          {loadingDiagnoses ? (
            <div class="pathway-diagnoses-loading">Memuat Master Diagnosa...</div>
          ) : errorDiagnoses ? (
            <div class="pathway-diagnoses-error">Error: {errorDiagnoses}</div>
          ) : (
            <DiagnosisAutocomplete
              diagnoses={diagnoses}
              selectedDiagnosis={selectedDiagnosis}
              onSelectDiagnosis={setSelectedDiagnosis}
            />
          )}

          {departmentId !== 'OUTPATIENT' && (
            <div class="pathway-target-hari-field">
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

          <div class="pathway-generate-action">
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

      {state === 'DONE' && result && (
        <PathwayResult result={result} diagnosis={selectedDiagnosis} onReset={reset} onSave={save} />
      )}

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
