import type { SOAPResult } from '@/types'
import { JSX } from 'preact/jsx-runtime'
import type { BatchSOAPPayload } from '@/hooks/useSpeechToSOAP'
import { AccordionSection } from '../common/Accordion'

interface Props {
  result: SOAPResult
  onReset: () => void
  /** Always fires with an empty payload — useSpeechToSOAP.saveSOAP attaches
   *  the full `soap` object to every save regardless, so this returns
   *  exactly "just the soap". */
  onSave: (payload: BatchSOAPPayload) => void
}

// Same string/array/object normalizer as the current-mode view, kept local
// so this view has zero dependency on SoapResultView's checkbox machinery.
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

  if (typeof content === 'string') {
    return prettifySOAPText(content)
  }

  if (typeof content === 'number' || typeof content === 'boolean') {
    return String(content)
  }

  if (Array.isArray(content)) {
    if (content.length === 0) {
      return <span>-</span>
    }

    if (typeof content[0] !== 'object' || content[0] === null) {
      return (
        <ul class="soap-list">
          {content.map((item, idx) => (
            <li key={idx}>{String(item)}</li>
          ))}
        </ul>
      )
    }

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

  return (
    <div class="soap-field-group">
      {Object.entries(content).map(([k, v]) => {
        if (!v) return null
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

export function NativeSoapResultView({ result, onReset, onSave }: Props) {
  const { soap, transcriptUsed } = result

  // API only ever sends one of Instructions / Interventions, never both.
  const instructionOrIntervention = soap.Instructions ?? soap.Interventions

  const sections = [
    { key: 'S', label: 'Subjective', content: normalizeContent(soap.Subjective), color: 'blue' },
    { key: 'O', label: 'Objective', content: normalizeContent(soap.Objective), color: 'green' },
    { key: 'A', label: 'Assessment', content: normalizeContent(soap.Assessment), color: 'orange' },
    { key: 'P', label: 'Plan', content: normalizeContent(soap.Plan), color: 'purple' },
    ...(instructionOrIntervention
      ? [{ key: 'I', label: 'Instructions', content: normalizeContent(instructionOrIntervention), color: 'teal' }]
      : []),
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

      {/* {anamesa && <AccordionSection label="Anamesa" text={anamesa} defaultOpen={true} />} */}

      <div class="soap-sections">
        {sections.map(s => (
          <div key={s.key} class={`soap-section soap-section--${s.color}`}>
            <div class="soap-section-head">
              <span class="soap-section-icon">{s.key}</span>
              <span class="soap-section-label">{s.label}</span>
            </div>
            <div class="soap-section-content">{s.content}</div>
          </div>
        ))}
      </div>

      <div class="soap-actions">
        <button class="btn btn-secondary btn-sm" onClick={onReset}>
          Rekam Baru
        </button>
        <button
          class="btn btn-primary btn-primary-custom btn-sm"
          onClick={() => onSave({})}
          title="Simpan SOAPI ke HIS"
        >
          Simpan ke HIS
        </button>
      </div>
    </div>
  )
}
