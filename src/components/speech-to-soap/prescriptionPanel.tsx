import { useEffect, useMemo } from 'preact/hooks'
import { Checkbox } from '../common/Checkbox'
import { useSelectableItems } from '@/hooks/useSelectableItems'
import type { SuggestedPrescription } from '@/types'
import type { SoapFieldKey } from '@/hooks/useSpeechToSOAP'

interface Props {
  prescriptions: SuggestedPrescription[]
  onSelectionChange?: (key: SoapFieldKey, selected: SuggestedPrescription[]) => void
}

function PrescriptionRow({
  item,
  checked,
  onToggle,
}: {
  item: SuggestedPrescription & { DisplayID: string }
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div class="suggestion-row suggestion-row--prescription">
      <Checkbox checked={checked} onChange={onToggle} title="Pilih resep ini untuk disimpan ke HIS" />

      <div class="suggestion-row-info">
        <div class="suggestion-row-top">
          {/* tampilkan DisplayID, bukan ItemID */}
          <span class="suggestion-icd">{item.DisplayID}</span>

          {item.MedicationRoute && (
            <span class="suggestion-badge suggestion-badge--secondary">{item.MedicationRoute}</span>
          )}
        </div>

        <span class="suggestion-name">{item.ItemName}</span>

        {item.Peringatan && <small class="suggestion-warning">{item.Peringatan}</small>}
      </div>
    </div>
  )
}

export function PrescriptionPanel({ prescriptions, onSelectionChange }: Props) {
  const prescriptionItems = useMemo(
    () =>
      (prescriptions ?? []).map((p, idx) => ({
        ...p,
        // simpan ID asli apa adanya
        ItemID: p.ItemID ?? '',

        // bikin field khusus untuk tampilan
        DisplayID: p.ItemID && p.ItemID !== '' ? p.ItemID : `NO-ID-${idx + 1}`,
      })),
    [prescriptions],
  )

  const hasPrescription = prescriptionItems.length > 0

  const selection = useSelectableItems(prescriptionItems, p => p.ItemID)

  useEffect(() => {
    onSelectionChange?.('PRESCRIPTION', selection.selectedItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.selectedItems])

  if (!hasPrescription) return null

  return (
    <div class="suggestion-panel">
      <div class="suggestion-panel-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>

        <span class="suggestion-panel-title">Rekomendasi Resep</span>

        <button
          class="panel-select-all-btn"
          onClick={() => (selection.allSelected ? selection.clearAll() : selection.selectAll())}
        >
          {selection.allSelected ? 'Batal Pilih' : 'Pilih Semua'}
        </button>
      </div>

      <div class="suggestion-list">
        {prescriptionItems.map(item => (
          <PrescriptionRow
            key={item.ItemID}
            item={item}
            checked={selection.isSelected(item.ItemID)}
            onToggle={() => selection.toggle(item.ItemID)}
          />
        ))}
      </div>
    </div>
  )
}
