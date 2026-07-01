import type { ClinicalPathwayResult } from '@/types'

interface PathwayResultProps {
  result: ClinicalPathwayResult
  onReset: () => void
  onSave: () => void
}

export function PathwayResult({ result, onReset, onSave }: PathwayResultProps) {
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
        <button class="btn btn-primary btn-primary-custom btn-sm" onClick={onSave}>
          Simpan ke HIS
        </button>
      </div>
    </div>
  )
}
