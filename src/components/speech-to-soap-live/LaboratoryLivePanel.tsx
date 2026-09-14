import { useEffect, useMemo } from 'preact/hooks'
import { Checkbox } from '../common/Checkbox'
import { useSelectableItems } from '@/hooks/useSelectableItems'
import type { SuggestedLaboratory } from '@/types'
import type { SoapFieldKey } from '@/hooks/useSpeechToSOAP'

interface Props {
  laboratories: SuggestedLaboratory[]
  onSelectionChange?: (key: SoapFieldKey, selected: SuggestedLaboratory[]) => void
  /** Panggil soapRecommendationEndpoint khusus lab (recommendation_type: 'LABORATORY'). */
  onGenerateRecommendation?: () => void
  loading?: boolean
}

function LaboratoryLiveRow({
  item,
  checked,
  onToggle,
}: {
  item: SuggestedLaboratory & { DisplayCode: string; HasCode: boolean }
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div class="suggestion-row suggestion-row--laboratory">
      <Checkbox checked={checked} onChange={onToggle} title="Pilih pemeriksaan ini untuk disimpan ke HIS" />

      <div class="suggestion-row-info">
        <div class="suggestion-row-top">
          {/* Hanya tampilkan kode jika ada kode master yang valid (bukan NO-CODE) */}
          {item.HasCode && <span class="suggestion-icd">{item.DisplayCode}</span>}
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

/**
 * LaboratoryLivePanel — versi Live dari laboratoryPanel.tsx (fitur lama).
 * File baru, bukan prop baru, supaya laboratoryPanel.tsx lama tidak
 * tersentuh. Tambahan dari versi lama: tombol "Rekomendasi" di header.
 */
export function LaboratoryLivePanel({ laboratories, onSelectionChange, onGenerateRecommendation, loading }: Props) {
  const laboratoryItems = useMemo(
    () =>
      (laboratories ?? []).map((l, idx) => {
        const hasCode = !!l.ItemCode && l.ItemCode !== '' && !l.ItemCode.startsWith('NO-CODE')
        return {
          ...l,
          ItemCode: l.ItemCode ?? `__nocode_${idx}`,
          DisplayCode: hasCode ? l.ItemCode! : '',
          HasCode: hasCode,
        }
      }),
    [laboratories],
  )

  const selection = useSelectableItems(laboratoryItems, l => l.ItemCode)

  useEffect(() => {
    onSelectionChange?.('LABORATORY', selection.selectedItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.selectedItems])

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
          type="button"
          class="panel-select-all-btn"
          onClick={onGenerateRecommendation}
          disabled={loading}
          title="Minta rekomendasi pemeriksaan penunjang dari AI"
        >
          {loading ? 'Memuat...' : 'Rekomendasi'}
        </button>

        {laboratoryItems.length > 0 && (
          <button
            type="button"
            class="panel-select-all-btn"
            onClick={() => (selection.allSelected ? selection.clearAll() : selection.selectAll())}
          >
            {selection.allSelected ? 'Batal Pilih' : 'Pilih Semua'}
          </button>
        )}
      </div>

      {laboratoryItems.length === 0 ? (
        <p style="padding:10px 12px;margin:0;font-size:12px;color:var(--text-3)">
          Belum ada pemeriksaan penunjang. Menunggu transkrip, atau klik "Rekomendasi".
        </p>
      ) : (
        <div class="suggestion-list">
          {laboratoryItems.map(item => (
            <LaboratoryLiveRow
              key={item.ItemCode}
              item={item}
              checked={selection.isSelected(item.ItemCode)}
              onToggle={() => selection.toggle(item.ItemCode)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
