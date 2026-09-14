import { useState } from 'preact/hooks'
import type { LiveRecorderState, SoapLiveDraft, SoapRecommendationType } from '@/types'
import type { SoapFieldKey, BatchSOAPPayload } from '@/hooks/useSpeechToSOAP'
import { RecorderVisualizer } from '../common/WaveRecordView'
import { VitalSignLivePanel } from './VitalSignLivePanel'
import { DiagnoseProcedureLivePanel } from './DiagnoseProcedureLivePanel'
import { PrescriptionLivePanel } from './PrescriptionLivePanel'
import { LaboratoryLivePanel } from './LaboratoryLivePanel'
import { AccordionSection } from '../common/Accordion'

interface Props {
  state: LiveRecorderState
  soapDraft: SoapLiveDraft
  recordingDuration: number
  recommendationLoading: Record<SoapRecommendationType, boolean>
  onStart: () => void
  onStop: () => void
  onGenerateRecommendation: (type: SoapRecommendationType) => void
  onSave: (payload: BatchSOAPPayload) => void
  onReset: () => void
}

// Sama seperti sections di SoapResultView.tsx (fitur lama) — S/O/A/P dengan
// warna yang sama, supaya tampilannya konsisten walau ini file terpisah.
const SECTIONS = [
  { key: 'S', label: 'Subjective', color: 'blue' },
  { key: 'O', label: 'Objective', color: 'green' },
  { key: 'A', label: 'Assessment', color: 'orange' },
  { key: 'P', label: 'Plan', color: 'purple' },
] as const

function fmt(s: number) {
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

// Satu bagian SOAP (mis. draft.S = { keluhan_utama: '...', gejala_lain: '...' })
// ditampilkan sebagai daftar field sederhana. Sengaja dibuat versi ringan
// sendiri di sini (bukan reuse normalizeContent dari SoapResultView.tsx yang
// lama, karena fungsi itu tidak diekspor) — nilai di soapDraft selalu string
// per sub-field, jadi tidak perlu logic serumit versi lama yang menangani
// array/objek bersarang.
function renderSection(section: Record<string, any>) {
  const entries = Object.entries(section).filter(([, v]) => v != null && v !== '')

  if (entries.length === 0) {
    return <p style="margin:0;color:var(--text-3);font-size:12px">Menunggu transkrip...</p>
  }

  return (
    <div class="soap-field-group">
      {entries.map(([key, value]) => (
        <div class="soap-field" key={key}>
          <p class="soap-field-title">{key.replace(/_/g, ' ')}</p>
          <div class="soap-field-body">{String(value)}</div>
        </div>
      ))}
    </div>
  )
}

// Which SoapFieldKey currently support batch checkbox selection here — sama
// pola-nya dengan BatchSelections di SoapResultView.tsx (fitur lama).
type BatchSelections = Partial<Record<SoapFieldKey, any[]>>

export function LiveSoapView({
  state,
  soapDraft,
  recordingDuration,
  recommendationLoading,
  onStart,
  onStop,
  onGenerateRecommendation,
  onSave,
  onReset,
}: Props) {
  const [selections, setSelections] = useState<BatchSelections>({})
  const [anamesaChecked, setAnamesaChecked] = useState(false)

  const handleSelectionChange = (key: SoapFieldKey, items: any[]) => {
    setSelections(prev => ({ ...prev, [key]: items }))
  }

  const selectedCount = Object.values(selections).reduce((sum, items) => sum + (items?.length ?? 0), 0)

  const handleSaveAll = () => {
    const payload: BatchSOAPPayload = {}
    if (anamesaChecked && soapDraft.anamesa) payload.anamesa = soapDraft.anamesa
    if (selections.DIAGNOSE?.length) payload.sugest_diagnosis = selections.DIAGNOSE
    if (selections.PROCEDURE?.length) payload.sugest_procedures = selections.PROCEDURE
    if (selections.VITALSIGN?.length) payload.sugest_VitalSign = selections.VITALSIGN
    if (selections.PRESCRIPTION?.length) payload.rekomendasi_resep = selections.PRESCRIPTION
    if (selections.LABORATORY?.length) payload.suggested_labs = selections.LABORATORY
    onSave(payload)
  }

  // IDLE: belum mulai rekam sama sekali — tampilkan tombol mulai saja, belum
  // ada SOAP apa pun untuk ditampilkan.
  if (state === 'IDLE') {
    return (
      <div class="recorder-view">
        <div class="recorder-ring">
          <button class="recorder-btn recorder-btn--start" onClick={onStart} aria-label="Mulai merekam">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="currentColor" stroke-width="2" fill="none" />
              <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" stroke-width="2" />
              <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center;margin-top:10px">
          <p class="recorder-status-text">Siap merekam</p>
          <p class="recorder-hint">
            SOAP akan mulai tampil dan diperbarui otomatis begitu anda mulai berbicara dengan pasien.
          </p>
        </div>
      </div>
    )
  }

  const isLive = state === 'LIVE'

  return (
    <div class="soap-result">
      {/* Indikator rekaman. Tetap tampil di REVIEW (tanpa tombol berhenti)
          supaya durasi rekaman terakhir masih kelihatan. */}
      <div class="soap-result-header">
        <div class="result-badge result-badge--green">
          {isLive ? (
            <>
              <span class="rec-dot" /> Merekam · {fmt(recordingDuration)}
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Selesai merekam · {fmt(recordingDuration)}
            </>
          )}
        </div>
        {isLive && (
          <button class="btn btn-secondary btn-sm" onClick={onStop}>
            Berhenti
          </button>
        )}
      </div>

      {isLive && <RecorderVisualizer isRecording={isLive} />}

      {/* TRANSCRIPT DIPINDAHKAN KE ATAS AGAR SELALU TERLIHAT */}
      <div>
        <AccordionSection
          label="Transkripsi"
          text={soapDraft.transcript ? soapDraft.transcript : 'Sedang mendengarkan... (Silakan bicara)'}
          defaultOpen={true}
        />
        <AccordionSection
          label="Anamesa"
          text={soapDraft.anamesa ? soapDraft.anamesa : 'Sedang mendengarkan... (Silakan bicara)'}
          defaultOpen={true}
          selectable
          checked={anamesaChecked}
          onToggleCheck={() => setAnamesaChecked(v => !v)}
        />
      </div>

      <div class="soap-sections">
        {SECTIONS.map(s => (
          <div key={s.key} class={`soap-section soap-section--${s.color}`}>
            <div class="soap-section-head">
              <span class="soap-section-icon">{s.key}</span>
              <span class="soap-section-label">{s.label}</span>
            </div>
            <div class="soap-section-content">
              {renderSection(soapDraft[s.key])}

              {s.key === 'A' && (
                <DiagnoseProcedureLivePanel
                  diagnoses={soapDraft.DIAGNOSE}
                  procedures={soapDraft.PROCEDURE}
                  onSelectionChange={handleSelectionChange}
                  onGenerateRecommendation={() => onGenerateRecommendation('DIAGNOSE')}
                  loading={recommendationLoading.DIAGNOSE}
                />
              )}

              {s.key === 'O' && (
                <VitalSignLivePanel
                  vitalSigns={soapDraft.VITALSIGN}
                  onSelectionChange={handleSelectionChange}
                  onGenerateRecommendation={() => onGenerateRecommendation('VITALSIGN')}
                  loading={recommendationLoading.VITALSIGN}
                />
              )}

              {s.key === 'P' && (
                <>
                  <PrescriptionLivePanel
                    prescriptions={soapDraft.PRESCRIPTION}
                    onSelectionChange={handleSelectionChange}
                    onGenerateRecommendation={() => onGenerateRecommendation('PRESCRIPTION')}
                    loading={recommendationLoading.PRESCRIPTION}
                  />
                  <LaboratoryLivePanel
                    laboratories={soapDraft.LABORATORY}
                    onSelectionChange={handleSelectionChange}
                    onGenerateRecommendation={() => onGenerateRecommendation('LABORATORY')}
                    loading={recommendationLoading.LABORATORY}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* "Simpan ke HIS" baru muncul setelah rekaman berhenti (REVIEW) —
          selagi masih LIVE, data masih bisa berubah tiap saat. */}
      {!isLive && (
        <div class="soap-actions">
          <button class="btn btn-secondary btn-sm" onClick={onReset}>
            Rekam Baru
          </button>
          <button
            class="btn btn-primary btn-primary-custom btn-sm"
            onClick={handleSaveAll}
            disabled={selectedCount === 0}
            title={selectedCount === 0 ? 'Centang minimal satu data untuk disimpan' : 'Simpan data terpilih ke HIS'}
          >
            Simpan ke HIS{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </button>
        </div>
      )}
    </div>
  )
}
