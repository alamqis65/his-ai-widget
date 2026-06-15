import type { SOAPResult } from '@/types'

interface Props { result: SOAPResult; onReset: () => void; onConfirm: () => void }

export function SoapResultView({ result, onReset, onConfirm }: Props) {
  const { soap } = result
  const sections = [
    { key: 'S', label: 'Subjective', content: soap.subjective, color: 'blue' },
    { key: 'O', label: 'Objective', content: soap.objective, color: 'green' },
    { key: 'A', label: 'Assessment', content: soap.assessment, color: 'orange' },
    { key: 'P', label: 'Plan', content: soap.plan, color: 'purple' },
  ] as const

  return (
    <div class="soap-result">
      <div class="soap-result-header">
        <div class="result-badge result-badge--green">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          SOAP Selesai
        </div>
        <span class="soap-result-ts">{result.generatedAt.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })}</span>
      </div>

      <div class="soap-sections">
        {sections.map(s => (
          <div key={s.key} class={`soap-section soap-section--${s.color}`}>
            <div class="soap-section-head">
              <span class="soap-section-icon">{s.key}</span>
              <span class="soap-section-label">{s.label}</span>
            </div>
            <p class="soap-section-content">{s.content}</p>
          </div>
        ))}
      </div>

      <div class="soap-actions">
        <button class="btn btn-secondary btn-sm" onClick={onReset}>Rekam Baru</button>
        <button class="btn btn-primary btn-sm" onClick={onConfirm}>Simpan ke HIS</button>
      </div>
    </div>
  )
}
