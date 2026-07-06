interface CheckboxProps {
  checked: boolean
  onChange: () => void
  title?: string
}

/**
 * Small square checkbox used for batch-selection across SOAP panels
 * (vital signs, ICD-10 suggestions, anamesa, and any future checkable field).
 * Keep this the single source of truth for that look so new panels match.
 */
export function Checkbox({ checked, onChange, title }: CheckboxProps) {
  return (
    <button
      type="button"
      class={`batch-checkbox ${checked ? 'batch-checkbox--checked' : ''}`}
      onClick={e => {
        e.stopPropagation()
        onChange()
      }}
      title={title ?? (checked ? 'Batal pilih' : 'Pilih untuk disimpan ke HIS')}
      aria-pressed={checked}
    >
      {checked && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}
