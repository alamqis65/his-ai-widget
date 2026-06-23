import { useState } from 'preact/hooks'
import { useClinicalPathway } from '@/hooks/useClinicalPathway'
import type { ClinicalPathwayResult, SDKCallbacks } from '@/types'

interface Props {
  callbacks?: Pick<SDKCallbacks, 'onResultPathway'>
}

function PathwayResult({
  result,
  onReset,
  onSave,
}: {
  result: ClinicalPathwayResult
  onReset: () => void
  onSave: () => void
}) {
  return (
    <div class="feature-result">
      <div class="feature-result-header">
        <div class="result-badge result-badge--green">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Pathway Selesai
        </div>
        <p class="result-meta">
          {result.totalDays} hari · {result.diagnosis}
        </p>
      </div>
      <div class="pathway-steps">
        {result.steps.map((step, i) => (
          <div key={i} class="pathway-step">
            <div class="pathway-step-day">{step.day}</div>
            <div class="pathway-step-body">
              {step.activities.length > 0 && (
                <div class="pathway-group">
                  <p class="pathway-group-label">Aktivitas</p>
                  {step.activities.map((a, j) => (
                    <p key={j} class="pathway-item">
                      · {a}
                    </p>
                  ))}
                </div>
              )}
              {step.medications && step.medications.length > 0 && (
                <div class="pathway-group">
                  <p class="pathway-group-label pathway-group-label--blue">Obat</p>
                  {step.medications.map((m, j) => (
                    <p key={j} class="pathway-item">
                      · {m}
                    </p>
                  ))}
                </div>
              )}
              {step.assessments && step.assessments.length > 0 && (
                <div class="pathway-group">
                  <p class="pathway-group-label pathway-group-label--purple">Pemeriksaan</p>
                  {step.assessments.map((a, j) => (
                    <p key={j} class="pathway-item">
                      · {a}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div class="feature-actions">
        <button class="btn btn-secondary btn-sm" onClick={onReset}>
          Buat Baru
        </button>
        <button class="btn btn-primary btn-sm" onClick={onSave}>
          Simpan ke HIS
        </button>
      </div>
    </div>
  )
}

export function ClinicalPathwayFeature({ callbacks }: Props) {
  const { state, result, error, generate, save, reset } = useClinicalPathway(callbacks)
  const [diagnosis, setDiagnosis] = useState('')

  const SUGGESTIONS = ['Demam Tifoid', 'Pneumonia Komunitas', 'Diabetes Melitus', 'Hipertensi']

  return (
    <div class="feature-layout">
      <div class="feature-header">
        <h2 class="feature-title">Clinical Pathway</h2>
        <p class="feature-subtitle">Generate rencana perawatan terstruktur berdasarkan diagnosis</p>
      </div>

      {state === 'IDLE' && (
        <div class="feature-form">
          <label class="form-label">Diagnosis Utama</label>
          <input
            class="form-input"
            type="text"
            placeholder="Contoh: Demam Tifoid, Pneumonia..."
            value={diagnosis}
            onInput={e => setDiagnosis((e.target as HTMLInputElement).value)}
            onKeyDown={e => e.key === 'Enter' && generate(diagnosis)}
          />
          <div class="form-suggestions">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                class="suggestion-chip"
                onClick={() => {
                  setDiagnosis(s)
                  generate(s)
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <button class="btn btn-primary btn-full" onClick={() => generate(diagnosis)} disabled={!diagnosis.trim()}>
            Generate Pathway
          </button>
        </div>
      )}

      {state === 'GENERATING' && (
        <div class="feature-loading">
          <div class="loading-spinner" />
          <p class="loading-text">Membuat clinical pathway...</p>
          <p class="loading-sub">Menyusun rencana perawatan untuk {diagnosis}</p>
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
