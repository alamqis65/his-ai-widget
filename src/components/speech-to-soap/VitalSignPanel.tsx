import { useEffect, useState } from 'preact/hooks'
import type { SuggestedTTV } from '@/types'
import type { SoapFieldKey } from '@/hooks/useSpeechToSOAP'
import { Checkbox } from '../common/Checkbox'

interface Props {
  vitalSigns: SuggestedTTV[]
  /** Reports the vital signs up to SoapResultView (empty array when unchecked) for the combined "Simpan ke HIS" save. */
  onSelectionChange?: (key: SoapFieldKey, selected: SuggestedTTV[]) => void
}

// ─── Vital Sign Row (display + inline edit only — no per-row checkbox) ──────

interface VitalSignRowProps {
  name: string
  value: string
  unitType: string
  onChange: (value: string) => void
}

function VitalSignRow({ name, value, unitType, onChange }: VitalSignRowProps) {
  return (
    <div class="vital-sign-row">
      <div class="vital-sign-row-info">
        <span class="vital-sign-name">{name}</span>
        <input
          style="display:none"
          class="vital-sign-value"
          type="text"
          value={value}
          onInput={e => {
            onChange(e.currentTarget.value)
          }}
        />
        <span class="vital-sign-value-text">{value}</span>
        <span class="vital-sign-unit"> {unitType} </span>
      </div>
    </div>
  )
}

// ─── Vital Signs Panel ────────────────────────────────────────────────────────
// One checkbox for the whole block (include/exclude all vital signs at once),
// same pattern as the Anamesa block — not one checkbox per row.

export function VitalSignsPanel({ vitalSigns, onSelectionChange }: Props) {
  const [checked, setChecked] = useState(false)
  const [items, setItems] = useState(() => vitalSigns?.filter(v => !!v.Value) ?? [])

  // Report the (edited) vital signs up whenever the checkbox or the values change.
  // Unchecked -> reports an empty array, so it's excluded from the batch payload.
  useEffect(() => {
    onSelectionChange?.('VITALSIGN', checked ? items : [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, items])

  if (items.length === 0) {
    return null
  }

  const handleValueChange = (id: number, value: string) => {
    setItems(prev => prev.map(item => (item.VitalSignID === id ? { ...item, Value: value } : item)))
  }

  return (
    <div class="vital-signs-panel">
      <div class="vital-signs-panel-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
        <span class="vital-signs-panel-title">Tanda Vital</span>
        <Checkbox
          checked={checked}
          onChange={() => setChecked(v => !v)}
          title="Sertakan semua tanda vital pada Simpan ke HIS"
        />
      </div>

      {/* List */}
      <div class="vital-signs-list">
        {items.map(item => (
          <VitalSignRow
            key={`${item.VitalSignLabel}-${item.VitalSignID}`}
            name={item.VitalSignLabel}
            value={item.Value}
            unitType={item.ValueUnit}
            onChange={value => handleValueChange(item.VitalSignID, value)}
          />
        ))}
      </div>
    </div>
  )
}
