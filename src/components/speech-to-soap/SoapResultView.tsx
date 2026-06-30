import type { SOAPResult, SuggestedDiagnosis, SuggestedProcedure, SuggestedTTV } from '@/types'
import { JSX } from 'preact/jsx-runtime'
import { SuggestionPanel } from './SuggestionPanel'
import { VitalSignsPanel } from './VitalSignPanel'
import type { SaveSOAPType } from '@/hooks/useSpeechToSOAP'
import { AccordionSection } from '../common/accordion'

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

function normalizeContent(content: any, sectionKey?: string): JSX.Element | string {
  if (content == null) return ''
  if (typeof content === 'string') return prettifySOAPText(content)

  if (typeof content === 'object') {
    if (sectionKey === 'P') {
      return (
        <div class="soap-plan">
          {Object.entries(content).map(([k, v]) => {
            if (k === 'rekomendasi_resep' && Array.isArray(v)) {
              return (
                <div key={k}>
                  <strong>Rekomendasi Resep:</strong>
                  <ul class="soap-list">
                    {v.map((item: any) => (
                      <li key={item.ItemID}>{item.ItemName}</li>
                    ))}
                  </ul>
                </div>
              )
            }
            if (k === 'rekomendasi_penunjang' && Array.isArray(v)) {
              return (
                <div key={k}>
                  <strong>Rekomendasi Penunjang:</strong>
                  <ul class="soap-list">
                    {v.map((item: any) => (
                      <li key={item.ItemCode}>{item.NamaPemeriksaan}</li>
                    ))}
                  </ul>
                </div>
              )
            }
            if (typeof v === 'string') {
              return (
                <div key={k}>
                  <strong>{k.replace(/_/g, ' ')}:</strong>
                  {prettifySOAPText(v)}
                </div>
              )
            }
            return (
              <div key={k}>
                <strong>{k.replace(/_/g, ' ')}:</strong> {String(v)}
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <table class="soap-table">
        <tbody>
          {Object.entries(content).map(([k, v]) => (
            <tr key={k}>
              <td class="soap-key">{k.replace(/_/g, ' ')}</td>
              <td class="soap-value">{String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return String(content)
}

export function SoapResultView({ result, onReset, onConfirm, onSaveDiagnoseAndProcedure, onSaveTTV }: Props) {
  const { soap, anamesa, transcriptUsed, sugest_diagnosis, sugest_procedures, sugest_VitalSign } = result
  const sections = [
    {
      key: 'S',
      label: 'Subjective',
      content: normalizeContent(soap.Subjective, 'S'),
      color: 'blue',
    },
    {
      key: 'O',
      label: 'Objective',
      content: normalizeContent(soap.Objective, 'O'),
      color: 'green',
    },
    {
      key: 'A',
      label: 'Assessment',
      content: normalizeContent(soap.Assessment, 'A'),
      color: 'orange',
    },
    {
      key: 'P',
      label: 'Plan',
      content: normalizeContent(soap.Plan, 'P'),
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
