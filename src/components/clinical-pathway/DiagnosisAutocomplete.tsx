import { useState, useMemo } from 'preact/hooks'
import type { DiagnosisMaster } from '@/types'

interface DiagnosisAutocompleteProps {
  diagnoses: DiagnosisMaster[]
  selectedDiagnosis: DiagnosisMaster | null
  onSelectDiagnosis: (d: DiagnosisMaster) => void
}

export function DiagnosisAutocomplete({ diagnoses, selectedDiagnosis, onSelectDiagnosis }: DiagnosisAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Determine what to show in the input
  const inputValue = isDropdownOpen 
    ? searchQuery 
    : (selectedDiagnosis ? `${selectedDiagnosis.id} - ${selectedDiagnosis.name}` : searchQuery)

  const filteredDiagnoses = useMemo(() => {
    if (!searchQuery) return diagnoses.slice(0, 50)
    return diagnoses
      .filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 50) // Limit to 50 results for performance
  }, [diagnoses, searchQuery])

  const handleSelectDiagnosis = (d: DiagnosisMaster) => {
    onSelectDiagnosis(d)
    setSearchQuery('')
    setIsDropdownOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        class="form-input"
        type="text"
        placeholder="Cari diagnosis (contoh: J06, Typhoid...)"
        value={inputValue}
        onInput={e => {
          setSearchQuery((e.target as HTMLInputElement).value)
          setIsDropdownOpen(true)
          if (selectedDiagnosis) {
            onSelectDiagnosis(null as any) // Clear selection when typing
          }
        }}
        onFocus={() => {
          setIsDropdownOpen(true)
          if (selectedDiagnosis) {
            setSearchQuery(selectedDiagnosis.name) // Allow editing from current name
            onSelectDiagnosis(null as any)
          }
        }}
        onBlur={() => {
          // Delay closing so click event on option can fire
          setTimeout(() => setIsDropdownOpen(false), 200)
        }}
      />
      
      {isDropdownOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          background: 'white', 
          border: '1px solid #cbd5e1', 
          borderRadius: '4px', 
          maxHeight: '200px', 
          overflowY: 'auto', 
          zIndex: 10, 
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
        }}>
          {filteredDiagnoses.length > 0 ? (
            filteredDiagnoses.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleSelectDiagnosis(d)}
                style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <strong style={{ display: 'inline-block', width: '50px' }}>{d.id}</strong> {d.name}
              </div>
            ))
          ) : (
            <div style={{ padding: '8px 12px', color: '#94a3b8', fontSize: '13px' }}>Diagnosis tidak ditemukan</div>
          )}
        </div>
      )}
    </div>
  )
}
