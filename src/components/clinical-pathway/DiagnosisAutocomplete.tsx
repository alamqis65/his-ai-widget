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
    : selectedDiagnosis
      ? `${selectedDiagnosis.id} - ${selectedDiagnosis.name}`
      : searchQuery

  const filteredDiagnoses = useMemo(() => {
    if (!searchQuery) return diagnoses.slice(0, 50)
    return diagnoses
      .filter(
        d =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .slice(0, 50) // Limit to 50 results for performance
  }, [diagnoses, searchQuery])

  const handleSelectDiagnosis = (d: DiagnosisMaster) => {
    onSelectDiagnosis(d)
    setSearchQuery('')
    setIsDropdownOpen(false)
  }

  return (
    <div class="diagnosis-autocomplete">
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
        <div class="diagnosis-autocomplete-dropdown">
          {filteredDiagnoses.length > 0 ? (
            filteredDiagnoses.map(d => (
              <div key={d.id} onClick={() => handleSelectDiagnosis(d)} class="diagnosis-autocomplete-option">
                <strong class="diagnosis-autocomplete-option-id">{d.id}</strong> {d.name}
              </div>
            ))
          ) : (
            <div class="diagnosis-autocomplete-empty">Diagnosis tidak ditemukan</div>
          )}
        </div>
      )}
    </div>
  )
}
