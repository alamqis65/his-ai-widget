import { useState } from 'preact/hooks'

export function AccordionSection({
  label,
  text,
  defaultOpen = false,
}: {
  label: string
  text: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div class="soap-transcript-preview">
      <div class="soap-transcript-header" onClick={() => setOpen(o => !o)}>
        <p class="soap-transcript-label">{label}</p>
        <div style="display:flex;align-items:center;gap:8px">
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
