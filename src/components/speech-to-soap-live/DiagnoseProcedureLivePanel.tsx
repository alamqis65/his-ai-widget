import { useEffect, useMemo } from 'preact/hooks'
import type { SuggestedDiagnosis, SuggestedProcedure } from '@/types'
import type { SoapFieldKey } from '@/hooks/useSpeechToSOAP'
import { useSelectableItems } from '@/hooks/useSelectableItems'
import { Checkbox } from '../common/Checkbox'

interface Props {
  diagnoses: SuggestedDiagnosis[]
  procedures: SuggestedProcedure[]
  onSelectionChange?: (key: SoapFieldKey, selected: SuggestedDiagnosis[] | SuggestedProcedure[]) => void
  /** Panggil soapRecommendationEndpoint khusus diagnosa ICD-10 (recommendation_type: 'DIAGNOSE'). */
  onGenerateRecommendation?: () => void
  loading?: boolean
}

function DiagnosisLiveRow({
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

/**
 * DiagnoseProcedureLivePanel — versi Live dari DiagnoseProcedurePanel.tsx
 * (fitur lama). File baru, bukan prop baru, supaya DiagnoseProcedurePanel.tsx
 * lama tidak tersentuh. Tambahan dari versi lama: tombol "Rekomendasi" di
 * header (khusus diagnosa — sesuai daftar 4 panel yang butuh tombol ini,
 * prosedur tidak punya tombol rekomendasi sendiri tapi tetap ikut ditampilkan
 * kalau ada event PROCEDURE yang masuk lewat SSE).
 */
export function DiagnoseProcedureLivePanel({
  diagnoses,
  procedures,
  onSelectionChange,
  onGenerateRecommendation,
  loading,
}: Props) {
  // Sama seperti versi lama: memoized biar tidak bikin infinite render loop
  // (lihat komentar di DiagnoseProcedurePanel.tsx untuk penjelasan lengkap).
  const diagnosesWithId = useMemo(() => diagnoses?.filter(d => d.ICD10 !== null && d.ICD10 !== '') ?? [], [diagnoses])
  const proceduresWithId = useMemo(
    () => procedures?.filter(p => p.ProcedureID !== null && p.ProcedureID !== '') ?? [],
    [procedures],
  )

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

  return (
    <div class="suggestion-panel">
      <div class="suggestion-panel-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <span class="suggestion-panel-title">Rekomendasi ICD-10</span>
        <button
          type="button"
          class="panel-select-all-btn"
          onClick={onGenerateRecommendation}
          disabled={loading}
          title="Minta rekomendasi diagnosa dari AI"
        >
          {loading ? 'Memuat...' : 'Rekomendasi'}
        </button>
        {diagnosesWithId.length > 0 && (
          <button
            type="button"
            class="panel-select-all-btn"
            onClick={() =>
              diagnosisSelection.allSelected ? diagnosisSelection.clearAll() : diagnosisSelection.selectAll()
            }
            title="Centang/batal centang semua diagnosa"
          >
            {diagnosisSelection.allSelected ? 'Batal Pilih' : 'Pilih Semua'}
          </button>
        )}
      </div>

      {diagnosesWithId.length === 0 ? (
        <p style="padding:10px 12px;margin:0;font-size:12px;color:var(--text-3)">
          Belum ada diagnosa. Menunggu transkrip, atau klik "Rekomendasi".
        </p>
      ) : (
        <div class="suggestion-list">
          {diagnosesWithId.map(d => (
            <DiagnosisLiveRow
              key={d.ICD10}
              item={d}
              checked={diagnosisSelection.isSelected(d.ICD10)}
              onToggle={() => diagnosisSelection.toggle(d.ICD10)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
