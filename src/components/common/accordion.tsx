import { useState } from 'preact/hooks'
import { Checkbox } from './Checkbox'

export function AccordionSection({
  label,
  text,
  defaultOpen = false,
  selectable = false,
  checked = false,
  onToggleCheck,
}: {
  label: string
  text: string
  defaultOpen?: boolean
  /** Show a checkbox to include this whole block in the "Simpan ke HIS" batch save. */
  selectable?: boolean
  checked?: boolean
  onToggleCheck?: () => void
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div class="soap-transcript-preview">
      <div class="soap-transcript-header">
        <div
          style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;cursor:pointer"
          onClick={() => setOpen(o => !o)}
        >
          <p class="soap-transcript-label">{label}</p>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          {selectable && (
            <Checkbox checked={checked} onChange={() => onToggleCheck?.()} title="Sertakan pada Simpan ke HIS" />
          )}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class={`accordion-chevron ${open ? 'accordion-chevron--open' : ''}`}
            style="cursor:pointer"
            onClick={() => setOpen(o => !o)}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      {open && <p class="soap-transcript-text">{text}</p>}
      <div style="display:flex; justify-content:right">{open && <CopyButton text={text} />}</div>
    </div>
  )
}

export function CopyButton({ text }: { text: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <button class="btn-copy" onClick={handleCopy}>
      📋 Salin
    </button>
  )
}
