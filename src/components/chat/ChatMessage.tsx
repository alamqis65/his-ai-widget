import type { ChatMessage as ChatMessageType } from '@/types'
import { formatTime } from '@/utils'

interface Props { message: ChatMessageType }

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  return (
    <div class={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      {!isUser && (
        <div class="chat-msg-avatar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
      )}
      <div class="chat-msg-body">
        <div class="chat-msg-bubble">{message.content}</div>
        <span class="chat-msg-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  )
}
