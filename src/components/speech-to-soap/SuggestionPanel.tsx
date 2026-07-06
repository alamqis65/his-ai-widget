import { useEffect, useMemo, useState } from 'preact/hooks'
import type { SuggestedDiagnosis, SuggestedProcedure } from '@/types'
import type { SoapFieldKey } from '@/hooks/useSpeechToSOAP'
import { useSelectableItems } from '@/hooks/useSelectableItems'
import { Checkbox } from '../common/Checkbox'

interface Props {
  diagnoses: SuggestedDiagnosis[]
  procedures: SuggestedProcedure[]
  /** Reports the currently-checked diagnoses/procedures up to SoapResultView for the combined "Simpan ke HIS" save. */
  onSelectionChange?: (key: SoapFieldKey, selected: SuggestedDiagnosis[] | SuggestedProcedure[]) => void
}

// ─── Diagnosis Row (checkbox only — no per-row save button) ─────────────────

function DiagnosisRow({
  item,
  checked,
  onToggle,
}: {
  item: SuggestedDiagnosis
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div class={`suggestion-row ${item.IsPrimary ? 'suggestion-row--primary' : 'suggestion-row--secondary'}`}>
      <Checkbox checked={checked} onChange={onToggle} title="Pilih diagnosa ini untuk disimpan ke HIS" />
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
    </div>
  )
}

// ─── Procedure Row (checkbox only — no per-row save button) ─────────────────

function ProcedureRow({
  item,
  checked,
  onToggle,
}: {
  item: SuggestedProcedure
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div class="suggestion-row suggestion-row--procedure">
      <Checkbox checked={checked} onChange={onToggle} title="Pilih prosedur ini untuk disimpan ke HIS" />
      <div class="suggestion-row-info">
        <div class="suggestion-row-top">
          <span class="suggestion-icd">{item.ProcedureID}</span>
        </div>
        <span class="suggestion-name">{item.ProcedureName}</span>
      </div>
    </div>
  )
}

// ─── Suggestion Panel ─────────────────────────────────────────────────────────

type Tab = 'diagnose' | 'procedure'

export function SuggestionPanel({ diagnoses, procedures, onSelectionChange }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('diagnose')

  // IMPORTANT: memoized on the source array identity. Without this, a plain
  // `.filter()` call here creates a brand-new array every render, which the
  // selection hook below treats as "the list changed", re-firing its
  // report-up effect, which updates parent state, which re-renders this
  // component, which filters again — an infinite render loop.
  const diagnosesWithId = useMemo(
    () => diagnoses?.filter(diagnosis => diagnosis.ICD10 !== null && diagnosis.ICD10 !== '') ?? [],
    [diagnoses],
  )
  const hasDiagnoses = diagnosesWithId.length > 0

  const proceduresWithId = useMemo(
    () => procedures?.filter(procedure => procedure.ProcedureID !== null && procedure.ProcedureID !== '') ?? [],
    [procedures],
  )
  const hasProcedures = proceduresWithId.length > 0

  const diagnosisSelection = useSelectableItems(diagnosesWithId, d => d.ICD10)
  const procedureSelection = useSelectableItems(proceduresWithId, p => p.ProcedureID)

  useEffect(() => {
    onSelectionChange?.('DIAGNOSE', diagnosisSelection.selectedItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosisSelection.selectedItems])

  useEffect(() => {
    onSelectionChange?.('PROCEDURE', procedureSelection.selectedItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [procedureSelection.selectedItems])

  if (!hasDiagnoses && !hasProcedures) return null

  const activeSelection = activeTab === 'diagnose' ? diagnosisSelection : procedureSelection

  return (
    <div class="suggestion-panel">
      <div class="suggestion-panel-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <span class="suggestion-panel-title">Rekomendasi ICD-10 & ICD-9</span>
        <button
          class="panel-select-all-btn"
          onClick={() => (activeSelection.allSelected ? activeSelection.clearAll() : activeSelection.selectAll())}
          title="Centang/batal centang semua item pada tab ini"
        >
          {activeSelection.allSelected ? 'Batal Pilih' : 'Pilih Semua'}
        </button>
      </div>

      {/* Tabs */}
      <div class="suggestion-tabs">
        {hasDiagnoses && (
          <button
            class={`suggestion-tab ${activeTab === 'diagnose' ? 'suggestion-tab--active' : ''}`}
            onClick={() => setActiveTab('diagnose')}
          >
            Diagnosa
            <span class="suggestion-tab-count">{diagnosesWithId.length}</span>
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
          diagnosesWithId.map(d => (
            <DiagnosisRow
              key={d.ICD10}
              item={d}
              checked={diagnosisSelection.isSelected(d.ICD10)}
              onToggle={() => diagnosisSelection.toggle(d.ICD10)}
            />
          ))}
        {activeTab === 'procedure' &&
          hasProcedures &&
          proceduresWithId.map(p => (
            <ProcedureRow
              key={p.ProcedureID}
              item={p}
              checked={procedureSelection.isSelected(p.ProcedureID)}
              onToggle={() => procedureSelection.toggle(p.ProcedureID)}
            />
          ))}
      </div>
    </div>
  )
}
