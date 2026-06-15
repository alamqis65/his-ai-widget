import { useState } from 'preact/hooks'

interface Props {
  onSend: (msg: string) => void
  disabled?: boolean
  onClear?: () => void
}

export function ChatInput({ onSend, disabled, onClear }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (e?: Event) => {
    e?.preventDefault()
    if (value.trim() && !disabled) { onSend(value.trim()); setValue('') }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
  }

  return (
    <div class="chat-input-wrap">
      {onClear && (
        <button class="chat-input-clear" onClick={onClear} title="Hapus & simpan riwayat" aria-label="Hapus riwayat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </button>
      )}
      <textarea
        class="chat-input-textarea"
        value={value}
        onInput={(e) => setValue((e.target as HTMLTextAreaElement).value)}
        onKeyDown={handleKeyDown}
        placeholder="Ketik pesan untuk AI Medis..."
        disabled={disabled}
        rows={1}
      />
      <button class="chat-input-send" onClick={handleSubmit} disabled={disabled || !value.trim()} aria-label="Kirim">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  )
}
