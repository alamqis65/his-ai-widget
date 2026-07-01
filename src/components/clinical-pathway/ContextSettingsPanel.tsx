interface ContextSettingsPanelProps {
  regNo: string
  setRegNo: (val: string) => void
  tipeKunjungan: string
  setTipeKunjungan: (val: string) => void
  age: number
  setAge: (val: number) => void
  isBpjs: boolean
  setIsBpjs: (val: boolean) => void
}

export function ContextSettingsPanel({
  regNo,
  setRegNo,
  tipeKunjungan,
  setTipeKunjungan,
  age,
  setAge,
  isBpjs,
  setIsBpjs,
}: ContextSettingsPanelProps) {
  return (
    <div class="context-settings-panel">
      <h4 class="context-settings-title">Context Testing Settings</h4>
      <div class="context-settings-grid">
        <div>
          <label class="context-settings-label">No Registrasi</label>
          <input
            type="text"
            value={regNo}
            onInput={e => setRegNo((e.target as HTMLInputElement).value)}
            class="context-settings-input"
          />
        </div>
        <div>
          <label class="context-settings-label">Tipe Kunjungan</label>
          <select
            value={tipeKunjungan}
            onChange={e => setTipeKunjungan((e.target as HTMLSelectElement).value)}
            class="context-settings-input"
          >
            <option value="Rawat Darurat">Rawat Darurat</option>
            <option value="Rawat Inap">Rawat Inap</option>
            <option value="Rawat Jalan">Rawat Jalan</option>
          </select>
        </div>
        <div>
          <label class="context-settings-label">Umur (Tahun)</label>
          <input
            type="number"
            value={age}
            onInput={e => setAge(parseInt((e.target as HTMLInputElement).value) || 0)}
            class="context-settings-input"
          />
        </div>
        <div class="context-settings-checkbox-row">
          <label class="context-settings-checkbox-label">
            <input
              type="checkbox"
              checked={isBpjs}
              onChange={e => setIsBpjs((e.target as HTMLInputElement).checked)}
              class="context-settings-checkbox"
            />
            Pasien BPJS
          </label>
        </div>
      </div>
    </div>
  )
}
