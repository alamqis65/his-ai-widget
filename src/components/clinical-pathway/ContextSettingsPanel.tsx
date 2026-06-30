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
  setIsBpjs
}: ContextSettingsPanelProps) {
  return (
    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', border: '1px solid #e2e8f0' }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#334155' }}>Context Testing Settings</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', color: '#64748b' }}>No Registrasi</label>
          <input 
            type="text" 
            value={regNo} 
            onInput={(e) => setRegNo((e.target as HTMLInputElement).value)} 
            style={{ width: '100%', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', color: '#64748b' }}>Tipe Kunjungan</label>
          <select 
            value={tipeKunjungan} 
            onChange={(e) => setTipeKunjungan((e.target as HTMLSelectElement).value)} 
            style={{ width: '100%', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
          >
            <option value="Rawat Darurat">Rawat Darurat</option>
            <option value="Rawat Inap">Rawat Inap</option>
            <option value="Rawat Jalan">Rawat Jalan</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', color: '#64748b' }}>Umur (Tahun)</label>
          <input 
            type="number" 
            value={age} 
            onInput={(e) => setAge(parseInt((e.target as HTMLInputElement).value) || 0)} 
            style={{ width: '100%', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: '26px' }}>
            <input 
              type="checkbox" 
              checked={isBpjs} 
              onChange={(e) => setIsBpjs((e.target as HTMLInputElement).checked)} 
              style={{ marginRight: '8px' }} 
            />
            Pasien BPJS
          </label>
        </div>
      </div>
    </div>
  )
}
