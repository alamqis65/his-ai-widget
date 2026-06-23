interface ChatHeaderProps {
  onClear: () => void
}

export function ChatHeader({ onClear }: ChatHeaderProps) {
  return (
    <div class="chat-header">
      <div class="chat-header-info">
        <div class="chat-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 8V4H8" />
            <rect x="4" y="8" width="16" height="12" rx="2" />
            <path d="M2 14h2M20 14h2M12 20v2" />
          </svg>
        </div>
        <div>
          <p class="chat-header-name">AI Assistant</p>
          <p class="chat-header-status">
            <span class="status-dot" />
            Online
          </p>
        </div>
      </div>
      <button class="btn-ghost btn-sm" onClick={onClear} title="Hapus riwayat" aria-label="Hapus riwayat percakapan">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>
    </div>
  )
}
