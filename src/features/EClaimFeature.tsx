import { useState } from 'preact/hooks'
import { useEClaim } from '@/hooks/useEClaim'
import type { EClaimCheckResult, SDKCallbacks } from '@/types'

interface Props {
  callbacks?: Pick<SDKCallbacks, 'onResultEClaim'>
}

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

function EClaimResult({
  result,
  onReset,
  onSave,
}: {
  result: EClaimCheckResult
  onReset: () => void
  onSave: () => void
}) {
  return (
    <div class="feature-result">
      <div class={`eclaim-status ${result.eligible ? 'eclaim-status--eligible' : 'eclaim-status--ineligible'}`}>
        <div class="eclaim-status-icon">
          {result.eligible ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>
        <div>
          <p class="eclaim-status-title">{result.eligible ? 'Klaim Dapat Diajukan' : 'Tidak Memenuhi Syarat'}</p>
          <p class="eclaim-status-sub">
            {result.diagnosis} · {result.icdCode}
          </p>
        </div>
      </div>

      {result.eligible && (
        <div class="eclaim-cost-row">
          <div class="eclaim-cost-item">
            <p class="eclaim-cost-label">Estimasi Biaya</p>
            <p class="eclaim-cost-value">{formatRupiah(result.estimatedCost)}</p>
          </div>
          <div class="eclaim-cost-divider" />
          <div class="eclaim-cost-item">
            <p class="eclaim-cost-label">Ditanggung</p>
            <p class="eclaim-cost-value eclaim-cost-value--covered">{formatRupiah(result.coveredAmount)}</p>
          </div>
        </div>
      )}

      <div class="eclaim-notes">
        <p class="eclaim-notes-title">Catatan</p>
        {result.notes.map((note, i) => (
          <div key={i} class="eclaim-note-item">
            <span class="eclaim-note-dot" />
            <p>{note}</p>
          </div>
        ))}
      </div>

      {result.eligible && (
        <div class="eclaim-code">
          <span class="eclaim-code-label">Kode Klaim</span>
          <span class="eclaim-code-value">{result.claimCode}</span>
        </div>
      )}

      <div class="feature-actions">
        <button class="btn btn-secondary btn-sm" onClick={onReset}>
          Cek Baru
        </button>
        {result.eligible && (
          <button class="btn btn-primary btn-sm" onClick={onSave}>
            Ajukan Klaim
          </button>
        )}
      </div>
    </div>
  )
}

export function EClaimFeature({ callbacks }: Props) {
  const { state, result, error, check, save, reset } = useEClaim(callbacks)
  const [form, setForm] = useState({ patientId: '', icdCode: '', diagnosis: '' })

  const setField = (k: keyof typeof form) => (e: Event) =>
    setForm(f => ({ ...f, [k]: (e.target as HTMLInputElement).value }))

  const QUICK = [
    { diagnosis: 'Demam Tifoid', icdCode: 'A01.0' },
    { diagnosis: 'Pneumonia Komunitas', icdCode: 'J18.9' },
    { diagnosis: 'Diabetes Melitus Tipe 2', icdCode: 'E11.9' },
  ]

  return (
    <div class="feature-layout">
      <div class="feature-header">
        <h2 class="feature-title">E-Claim Check</h2>
        <p class="feature-subtitle">Periksa kelayakan klaim BPJS / asuransi sebelum submission</p>
      </div>

      {state === 'IDLE' && (
        <div class="feature-form">
          <label class="form-label">No. Pasien / BPJS</label>
          <input
            class="form-input"
            placeholder="Contoh: P-2024-001"
            value={form.patientId}
            onInput={setField('patientId')}
          />
          <label class="form-label">Diagnosis</label>
          <input
            class="form-input"
            placeholder="Contoh: Demam Tifoid"
            value={form.diagnosis}
            onInput={setField('diagnosis')}
          />
          <label class="form-label">Kode ICD-10</label>
          <input class="form-input" placeholder="Contoh: A01.0" value={form.icdCode} onInput={setField('icdCode')} />
          <div class="form-suggestions">
            {QUICK.map(q => (
              <button
                key={q.icdCode}
                class="suggestion-chip"
                onClick={() => {
                  const next = { ...form, diagnosis: q.diagnosis, icdCode: q.icdCode }
                  setForm(next)
                  check(next.patientId || 'P-DEMO', next.icdCode, next.diagnosis)
                }}
              >
                {q.icdCode} · {q.diagnosis}
              </button>
            ))}
          </div>
          <button
            class="btn btn-primary btn-full"
            onClick={() => check(form.patientId || 'P-DEMO', form.icdCode, form.diagnosis)}
            disabled={!form.diagnosis.trim()}
          >
            Cek Eligibilitas
          </button>
        </div>
      )}

      {state === 'CHECKING' && (
        <div class="feature-loading">
          <div class="loading-spinner" />
          <p class="loading-text">Memeriksa eligibilitas...</p>
          <p class="loading-sub">Menghubungi sistem BPJS</p>
        </div>
      )}

      {state === 'DONE' && result && <EClaimResult result={result} onReset={reset} onSave={save} />}

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
