import { useEffect, useState } from 'preact/hooks'
import type { SuggestedTTV } from '@/types'
import type { SoapFieldKey } from '@/hooks/useSpeechToSOAP'
import { Checkbox } from '../common/Checkbox'

interface Props {
  vitalSigns: SuggestedTTV[]
  /** Reports the vital signs up to LiveSoapView (empty array when unchecked) for the combined "Simpan ke HIS" save. */
  onSelectionChange?: (key: SoapFieldKey, selected: SuggestedTTV[]) => void
  /** Panggil soapRecommendationEndpoint khusus tanda vital (recommendation_type: 'VITALSIGN'). */
  onGenerateRecommendation?: () => void
  loading?: boolean
}

/**
 * VitalSignLivePanel
 *
 * Versi khusus fitur "Speech to SOAP Live" dari VitalSignPanel.tsx (fitur
 * lama). Dibuat sebagai file baru — bukan menambah prop ke VitalSignPanel.tsx
 * — supaya fitur lama sama sekali tidak tersentuh. Bedanya dari versi lama:
 * ada tombol "Rekomendasi" di header, dan `vitalSigns` datang dari
 * `soapDraft` yang terus di-update lewat SSE (bukan dari satu kali response).
 */
export function VitalSignLivePanel({ vitalSigns, onSelectionChange, onGenerateRecommendation, loading }: Props) {
  const [checked, setChecked] = useState(false)

  // Sertakan / tidak sertakan semua tanda vital sekaligus pada "Simpan ke
  // HIS" — satu checkbox untuk seluruh blok, sama seperti VitalSignPanel lama.
  useEffect(() => {
    onSelectionChange?.('VITALSIGN', checked ? vitalSigns : [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, vitalSigns])

  return (
    <div class="vital-signs-panel">
      <div class="vital-signs-panel-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
        <span class="vital-signs-panel-title">Tanda Vital</span>
        <button
          type="button"
          class="panel-select-all-btn"
          onClick={onGenerateRecommendation}
          disabled={loading}
          title="Minta rekomendasi tanda vital dari AI"
        >
          {loading ? 'Memuat...' : 'Rekomendasi'}
        </button>
        {vitalSigns.length > 0 && (
          <Checkbox
            checked={checked}
            onChange={() => setChecked(v => !v)}
            title="Sertakan semua tanda vital pada Simpan ke HIS"
          />
        )}
      </div>

      {vitalSigns.length === 0 ? (
        <p style="padding:10px 12px;margin:0;font-size:12px;color:var(--text-3)">
          Belum ada tanda vital. Menunggu transkrip, atau klik "Rekomendasi".
        </p>
      ) : (
        <div class="vital-signs-list">
          {vitalSigns.map(item => (
            <div class="vital-sign-row" key={`${item.VitalSignLabel}-${item.VitalSignID}`}>
              <div class="vital-sign-row-info">
                <span class="vital-sign-name">{item.VitalSignLabel}</span>
                <span class="vital-sign-value-text">{item.Value}</span>
                <span class="vital-sign-unit"> {item.ValueUnit} </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
