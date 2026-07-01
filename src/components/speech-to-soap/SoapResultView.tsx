import type { SOAPResult, SuggestedDiagnosis, SuggestedProcedure, SuggestedTTV } from '@/types'
import { JSX } from 'preact/jsx-runtime'
import { SuggestionPanel } from './SuggestionPanel'
import { VitalSignsPanel } from './VitalSignPanel'
import type { SaveSOAPType } from '@/hooks/useSpeechToSOAP'
import { AccordionSection } from '../common/Accordion'

interface Props {
  result: SOAPResult
  onReset: () => void
  onConfirm: (type: SaveSOAPType, selected: SuggestedDiagnosis[] | SuggestedProcedure[]) => void
  onSaveDiagnoseAndProcedure: (type: SaveSOAPType, selected: SuggestedDiagnosis[] | SuggestedProcedure[]) => void
  onSaveTTV: (type: SaveSOAPType, selected: SuggestedTTV[]) => void
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

    // array object
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

  // Object
  return (
    <table class="soap-table">
      <tbody>
        {Object.entries(content).map(([k, v]) => {
          // skip kalau null/undefined
          if (!v) return null

          // kalau array kosong, skip juga
          if (Array.isArray(v) && v.length === 0) return null

          return (
            <tr key={k}>
              <td class="soap-key">{k.replace(/_/g, ' ')}</td>
              <td class="soap-value">{normalizeContent(v)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export function SoapResultView({ result, onReset, onConfirm, onSaveDiagnoseAndProcedure, onSaveTTV }: Props) {
  const { soap, anamesa, transcriptUsed, sugest_diagnosis, sugest_procedures, sugest_VitalSign } = result
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
      content: normalizeContent(soap.Plan),
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
      <AccordionSection label="Anamesa" text={anamesa} defaultOpen={true} />

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
                  onSave={onSaveDiagnoseAndProcedure}
                />
              )}
              {s.key === 'O' && <VitalSignsPanel vitalSigns={sugest_VitalSign ?? []} onSave={onSaveTTV} />}
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
          style="display: none"
          onClick={() => {
            onConfirm('DIAGNOSE', result.sugest_diagnosis ?? [])
            onConfirm('PROCEDURE', result.sugest_procedures ?? [])
          }}
        >
          Simpan ke HIS
        </button>
      </div>
    </div>
  )
}
