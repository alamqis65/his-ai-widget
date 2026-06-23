import { useState } from 'preact/hooks'
import type { SuggestedDiagnosis, SuggestedProcedure } from '@/types'
import type { SaveSOAPType } from '@/hooks/useSpeechToSOAP'

interface Props {
  diagnoses: SuggestedDiagnosis[]
  procedures: SuggestedProcedure[]
  onSave: (type: SaveSOAPType, selected: SuggestedDiagnosis[] | SuggestedProcedure[]) => void
}

// ─── Diagnosis Row ────────────────────────────────────────────────────────────

interface DiagnosisRowProps {
  item: SuggestedDiagnosis
  onSave: (item: SuggestedDiagnosis) => void
}

function DiagnosisRow({ item, onSave }: DiagnosisRowProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    onSave(item)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div class={`suggestion-row ${item.IsPrimary ? 'suggestion-row--primary' : 'suggestion-row--secondary'}`}>
      <div class="suggestion-row-info">
        <div class="suggestion-row-top">
          <span class="suggestion-icd">{item.ICD10}</span>
          {item.IsPrimary ? (
            <span class="suggestion-badge suggestion-badge--primary">Primer</span>
          ) : (
            <span class="suggestion-badge suggestion-badge--secondary">Sekunder</span>
          )}
        </div>
        <span class="suggestion-name">{item.LabelICD10}</span>
      </div>
      <button
        class={`suggestion-save-btn ${saved ? 'suggestion-save-btn--saved' : ''}`}
        onClick={handleSave}
        title="Simpan diagnosa ini ke HIS"
      >
        {saved ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
    </div>
  )
}

// ─── Procedure Row ────────────────────────────────────────────────────────────

interface ProcedureRowProps {
  item: SuggestedProcedure
  onSave: (item: SuggestedProcedure) => void
}

function ProcedureRow({ item, onSave }: ProcedureRowProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    onSave(item)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div class="suggestion-row suggestion-row--procedure">
      <div class="suggestion-row-info">
        <div class="suggestion-row-top">
          <span class="suggestion-icd">{item.ProcedureID}</span>
        </div>
        <span class="suggestion-name">{item.ProcedureName}</span>
      </div>
      <button
        class={`suggestion-save-btn ${saved ? 'suggestion-save-btn--saved' : ''}`}
        onClick={handleSave}
        title="Simpan prosedur ini ke HIS"
      >
        {saved ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
    </div>
  )
}

// ─── Suggestion Panel ─────────────────────────────────────────────────────────

type Tab = 'diagnose' | 'procedure'

export function SuggestionPanel({ diagnoses, procedures, onSave }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('diagnose')

  const diagnosesWithId = diagnoses?.filter(diagnosis => diagnosis.ICD10 !== null && diagnosis.ICD10 !== '') ?? []
  const hasDiagnoses = diagnosesWithId.length > 0

  const proceduresWithId =
    procedures?.filter(procedure => procedure.ProcedureID !== null && procedure.ProcedureID !== '') ?? []
  const hasProcedures = proceduresWithId.length > 0

  if (!hasDiagnoses && !hasProcedures) return null

  return (
    <div class="suggestion-panel">
      <div class="suggestion-panel-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <span class="suggestion-panel-title">Rekomendasi ICD-10 & ICD-9</span>
      </div>

      {/* Tabs */}
      <div class="suggestion-tabs">
        {hasDiagnoses && (
          <button
            class={`suggestion-tab ${activeTab === 'diagnose' ? 'suggestion-tab--active' : ''}`}
            onClick={() => setActiveTab('diagnose')}
          >
            Diagnosa
            <span class="suggestion-tab-count">{diagnoses.length}</span>
          </button>
        )}

        {/* {hasProcedures && (
          <button
            class={`suggestion-tab ${activeTab === "procedure" ? "suggestion-tab--active" : ""}`}
            onClick={() => setActiveTab("procedure")}
          >
            Prosedur
            <span class="suggestion-tab-count">{procedures.length}</span>
          </button>
        )} */}
      </div>

      {/* List */}
      <div class="suggestion-list">
        {activeTab === 'diagnose' &&
          hasDiagnoses &&
          diagnoses.map(
            d =>
              d.ICD10 != null &&
              d.ICD10 !== '' && <DiagnosisRow key={d.ICD10} item={d} onSave={item => onSave('DIAGNOSE', [item])} />,
          )}
        {activeTab === 'procedure' &&
          hasProcedures &&
          procedures.map(
            p =>
              p.ProcedureID != null &&
              p.ProcedureID !== '' && (
                <ProcedureRow key={p.ProcedureID} item={p} onSave={item => onSave('PROCEDURE', [item])} />
              ),
          )}
      </div>
    </div>
  )
}
