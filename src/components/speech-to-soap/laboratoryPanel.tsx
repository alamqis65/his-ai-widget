import { useEffect, useMemo } from 'preact/hooks'
import { Checkbox } from '../common/Checkbox'
import { useSelectableItems } from '@/hooks/useSelectableItems'
import type { SuggestedLaboratory } from '@/types'
import type { SoapFieldKey } from '@/hooks/useSpeechToSOAP'

interface Props {
  laboratories: SuggestedLaboratory[]
  onSelectionChange?: (key: SoapFieldKey, selected: SuggestedLaboratory[]) => void
}

function LaboratoryRow({
  item,
  checked,
  onToggle,
}: {
  item: SuggestedLaboratory & { DisplayCode: string }
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div class="suggestion-row suggestion-row--laboratory">
      <Checkbox checked={checked} onChange={onToggle} title="Pilih pemeriksaan ini untuk disimpan ke HIS" />

      <div class="suggestion-row-info">
        <div class="suggestion-row-top">
          {/* tampilkan DisplayCode, bukan ItemCode langsung */}
          <span class="suggestion-icd">{item.DisplayCode}</span>

          {item.GrupPemeriksaan && (
            <span class="suggestion-badge suggestion-badge--secondary">{item.GrupPemeriksaan}</span>
          )}
        </div>

        <span class="suggestion-name">{item.NamaPemeriksaan}</span>

        {item.Peringatan && <small class="suggestion-warning">{item.Peringatan}</small>}
      </div>
    </div>
  )
}

export function LaboratoryPanel({ laboratories, onSelectionChange }: Props) {
  const laboratoryItems = useMemo(
    () =>
      (laboratories ?? []).map((l, idx) => ({
        ...l,
        // simpan kode asli apa adanya
        ItemCode: l.ItemCode ?? '',

        // bikin field khusus untuk tampilan
        DisplayCode: l.ItemCode && l.ItemCode !== '' ? l.ItemCode : `NO-CODE-${idx + 1}`,
      })),
    [laboratories],
  )

  const hasLaboratory = laboratoryItems.length > 0

  const selection = useSelectableItems(laboratoryItems, l => l.ItemCode)

  useEffect(() => {
    onSelectionChange?.('LABORATORY', selection.selectedItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.selectedItems])

  if (!hasLaboratory) return null

  return (
    <div class="suggestion-panel">
      <div class="suggestion-panel-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 2v6.5L4.5 17a2 2 0 001.75 3h11.5a2 2 0 001.75-3L15 8.5V2" />
          <path d="M8.5 2h7" />
          <path d="M6.5 14h11" />
        </svg>

        <span class="suggestion-panel-title">Rekomendasi Pemeriksaan Penunjang</span>

        <button
          class="panel-select-all-btn"
          onClick={() => (selection.allSelected ? selection.clearAll() : selection.selectAll())}
        >
          {selection.allSelected ? 'Batal Pilih' : 'Pilih Semua'}
        </button>
      </div>

      <div class="suggestion-list">
        {laboratoryItems.map(item => (
          <LaboratoryRow
            key={item.ItemCode}
            item={item}
            checked={selection.isSelected(item.ItemCode)}
            onToggle={() => selection.toggle(item.ItemCode)}
          />
        ))}
      </div>
    </div>
  )
}
