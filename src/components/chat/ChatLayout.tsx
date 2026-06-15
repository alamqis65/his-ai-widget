import { useEffect, useRef } from 'preact/hooks'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from '@/components/common/TypingIndicator'
import { useChat } from '@/hooks/useChat'
import type { SDKCallbacks } from '@/types'

interface Props {
  callbacks?: Pick<SDKCallbacks, 'onResultChat'>
}

const SUGGESTIONS = [
  { icon: '💊', label: 'Dosis paracetamol dewasa?' },
  { icon: '📋', label: 'Cara buat catatan SOAP?' },
  { icon: '🩺', label: 'Gejala hipertensi?' },
  { icon: '🔬', label: 'Interpretasi GDP 210?' },
]

export function ChatLayout({ callbacks }: Props) {
  const { messages, isLoading, error, sendMessage, clearHistory } = useChat(callbacks)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div class="chat-layout">
      <div class="chat-messages">
        {messages.length === 0 && (
          <div class="chat-empty">
            <p class="chat-empty-greeting">Halo! Apa yang bisa saya bantu hari ini?</p>
            <p class="chat-empty-sub">Tanya seputar klinis, farmasi, atau prosedur medis</p>
            <div class="chat-suggestions-grid">
              {SUGGESTIONS.map((s) => (
                <button key={s.label} class="chat-suggestion-card" onClick={() => sendMessage(s.label)}>
                  <span class="chat-suggestion-icon">{s.icon}</span>
                  <span class="chat-suggestion-label">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div class="chat-message chat-message--assistant">
            <div class="chat-msg-avatar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div class="chat-msg-body">
              <div class="chat-msg-bubble"><TypingIndicator /></div>
            </div>
          </div>
        )}

        {error && (
          <div class="chat-error-bar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} disabled={isLoading} onClear={messages.length > 0 ? clearHistory : undefined} />
    </div>
  )
}
