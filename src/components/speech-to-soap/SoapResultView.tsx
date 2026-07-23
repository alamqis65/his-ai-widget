import { useState } from 'preact/hooks'
import type {
  SOAPResult,
  SuggestedDiagnosis,
  SuggestedProcedure,
  SuggestedTTV,
  SuggestedPrescription,
  SuggestedLaboratory,
} from '@/types'
import { JSX } from 'preact/jsx-runtime'
import { SuggestionPanel } from './DiagnoseProcedurePanel'
import { VitalSignsPanel } from './VitalSignPanel'
import { PrescriptionPanel } from './prescriptionPanel'
import { LaboratoryPanel } from './laboratoryPanel'
import type { SoapFieldKey, BatchSOAPPayload } from '@/hooks/useSpeechToSOAP'
import { AccordionSection } from '../common/Accordion'

interface Props {
  result: SOAPResult
  onReset: () => void
  /** Fired once by "Simpan ke HIS" with only the fields the user checked. */
  onSave: (payload: BatchSOAPPayload) => void
}

function prettifySOAPText(text: string): JSX.Element {
  const lines = text
    .split(/\n+/)
    .map(l => l.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean)

  return (
    <ul class="soap-list">
      {lines.map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ul>
  )
}

function planToText(plan: any): string {
  if (!plan) return ''

  if (typeof plan === 'string') return plan

  return Object.entries(plan)
    .filter(([, v]) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => {
      const label = k.replace(/_/g, ' ')
      const value = Array.isArray(v) ? v.join(', ') : String(v)
      return `${label}: ${value}`
    })
    .join('\n')
}

function normalizeContent(content: any): JSX.Element | string {
  if (content == null) return ''

  // String
  if (typeof content === 'string') {
    return prettifySOAPText(content)
  }

  // Primitive
  if (typeof content === 'number' || typeof content === 'boolean') {
    return String(content)
  }

  // Array
  if (Array.isArray(content)) {
    if (content.length === 0) {
      return <span>-</span>
    }

    // array string / number
    if (typeof content[0] !== 'object' || content[0] === null) {
      return (
        <ul class="soap-list">
          {content.map((item, idx) => (
            <li key={idx}>{String(item)}</li>
          ))}
        </ul>
      )
    }

    // array object -> one card per entry
    return (
      <div class="soap-array">
        {content.map((item, idx) => (
          <div class="soap-card" key={idx}>
            {normalizeContent(item)}
          </div>
        ))}
      </div>
    )
  }

  // Object -> stacked "title then paragraph" fields instead of a two-column
  // table, so long values don't get squeezed against a crowded left column.
  return (
    <div class="soap-field-group">
      {Object.entries(content).map(([k, v]) => {
        // skip kalau null/undefined
        if (!v) return null

        // kalau array kosong, skip juga
        if (Array.isArray(v) && v.length === 0) return null

        return (
          <div class="soap-field" key={k}>
            <p class="soap-field-title">{k.replace(/_/g, ' ')}</p>
            <div class="soap-field-body">{normalizeContent(v)}</div>
          </div>
        )
      })}
    </div>
  )
}

// Which SoapFieldKey currently support batch checkbox selection.
// Adding a new checkable field elsewhere (prescription, doctor instruction)
// only requires: 1) a panel that calls onSelectionChange with its key here,
// and 2) one extra line in handleSaveAll's payload assembly below.
type BatchSelections = Partial<Record<SoapFieldKey, any[]>>

export function SoapResultView({ result, onReset, onSave }: Props) {
  const { soap, anamesa, transcriptUsed, sugest_diagnosis, sugest_procedures, sugest_VitalSign } = result

  const [anamesaChecked, setAnamesaChecked] = useState(false)
  const [planChecked, setPlanChecked] = useState(false)
  const [selections, setSelections] = useState<BatchSelections>({})

  const handleSelectionChange = (key: SoapFieldKey, items: any[]) => {
    setSelections(prev => ({ ...prev, [key]: items }))
  }

  const selectedCount =
    (anamesaChecked && anamesa ? 1 : 0) +
    (planChecked && soap.Plan ? 1 : 0) +
    Object.values(selections).reduce((sum, items) => sum + (items?.length ?? 0), 0)

  const handleSaveAll = () => {
    const payload: BatchSOAPPayload = {}

    if (anamesaChecked && anamesa) payload.anamesa = anamesa
    if (planChecked && soap.Plan) payload.rencana_plan = planToText(soap.Plan)
    if (selections.DIAGNOSE?.length) payload.sugest_diagnosis = selections.DIAGNOSE as SuggestedDiagnosis[]
    if (selections.PROCEDURE?.length) payload.sugest_procedures = selections.PROCEDURE as SuggestedProcedure[]
    if (selections.VITALSIGN?.length) payload.sugest_VitalSign = selections.VITALSIGN as SuggestedTTV[]
    if (selections.PRESCRIPTION?.length) payload.rekomendasi_resep = selections.PRESCRIPTION as SuggestedPrescription[]
    if (selections.LABORATORY?.length) payload.suggested_labs = selections.LABORATORY as SuggestedLaboratory[]

    onSave(payload)
  }

  const sections = [
    {
      key: 'S',
      label: 'Subjective',
      content: normalizeContent(soap.Subjective),
      color: 'blue',
    },
    {
      key: 'O',
      label: 'Objective',
      content: normalizeContent(soap.Objective),
      color: 'green',
    },
    {
      key: 'A',
      label: 'Assessment',
      content: normalizeContent(soap.Assessment),
      color: 'orange',
    },
    {
      key: 'P',
      label: 'Plan',
      content: normalizeContent(''),
      color: 'purple',
    },
  ] as const

  return (
    <div class="soap-result">
      <div class="soap-result-header">
        <div class="result-badge result-badge--green">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Generate Selesai
        </div>
        <span class="soap-result-ts">
          {result.generatedAt.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <AccordionSection label="Transkripsi" text={transcriptUsed} defaultOpen={false} />
      <AccordionSection
        label="Anamesa"
        text={anamesa}
        defaultOpen={true}
        selectable
        checked={anamesaChecked}
        onToggleCheck={() => setAnamesaChecked(v => !v)}
      />

      <div class="soap-sections">
        {sections.map(s => (
          <div key={s.key} class={`soap-section soap-section--${s.color}`}>
            <div class="soap-section-head">
              <span class="soap-section-icon">{s.key}</span>
              <span class="soap-section-label">{s.label}</span>
            </div>
            <div class="soap-section-content">
              {s.content}
              {s.key === 'A' && (
                <SuggestionPanel
                  diagnoses={sugest_diagnosis ?? []}
                  procedures={sugest_procedures ?? []}
                  onSelectionChange={handleSelectionChange}
                />
              )}
              {s.key === 'O' && (
                <VitalSignsPanel vitalSigns={sugest_VitalSign ?? []} onSelectionChange={handleSelectionChange} />
              )}
              {s.key === 'P' && (
                <>
                  <AccordionSection
                    label="Instruksi Dokter"
                    text={planToText(soap.Plan)}
                    defaultOpen={true}
                    selectable
                    checked={planChecked}
                    onToggleCheck={() => setPlanChecked(v => !v)}
                  />
                  <PrescriptionPanel
                    prescriptions={result.rekomendasi_resep ?? []}
                    onSelectionChange={handleSelectionChange}
                  />
                  <LaboratoryPanel
                    laboratories={result.suggested_labs ?? []}
                    onSelectionChange={handleSelectionChange}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

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
    </div>
  )
}
