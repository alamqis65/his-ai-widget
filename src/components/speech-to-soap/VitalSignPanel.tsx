import { useState } from 'preact/hooks'
import type { SuggestedTTV } from '@/types'
import type { SaveSOAPType } from '@/hooks/useSpeechToSOAP'

interface Props {
  vitalSigns: Record<string, [number, string]>
  onSave: (type: SaveSOAPType, selected: SuggestedTTV[]) => void
}

// ─── Vital Sign Row (display only, no individual save) ───────────────────────

interface VitalSignRowProps {
  name: string
  value: string
}

function VitalSignRow({ name, value }: VitalSignRowProps) {
  return (
    <div class="vital-sign-row">
      <div class="vital-sign-row-info">
        <span class="vital-sign-name">{name}</span>
        <span class="vital-sign-value">{value}</span>
      </div>
    </div>
  )
}

// ─── Vital Signs Panel ────────────────────────────────────────────────────────

export function VitalSignsPanel({ vitalSigns, onSave }: Props) {
  const [saved, setSaved] = useState(false)

  // Convert the vital signs object to an array and filter out empty values
  const vitalSignsArray = Object.entries(vitalSigns)
    .map(([name, [id, value]]) => ({ name, id, value }))
    .filter(item => item.value && item.value.trim() !== '')

  if (vitalSignsArray.length === 0) {
    return null
  }

  const handleSaveAll = () => {
    setSaved(true)
    onSave(
      'VITALSIGN',
      vitalSignsArray.map(({ name, id, value }) => ({ id, name, value })),
    )
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div class="vital-signs-panel">
      <div class="vital-signs-panel-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
        <span class="vital-signs-panel-title">Tanda Vital</span>
        <button
          class={`vital-signs-save-all-btn ${saved ? 'vital-signs-save-all-btn--saved' : ''}`}
          onClick={handleSaveAll}
          title="Simpan semua tanda vital ke HIS"
        >
          {saved ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Tersimpan
            </>
          ) : (
            'Simpan Semua'
          )}
        </button>
      </div>

      {/* List */}
      <div class="vital-signs-list">
        {vitalSignsArray.map(item => (
          <VitalSignRow key={`${item.name}-${item.id}`} name={item.name} value={item.value} />
        ))}
      </div>
    </div>
  )
}
