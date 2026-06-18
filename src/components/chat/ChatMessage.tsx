import type { ChatMessage as ChatMessageType } from '@/types'
import { formatTime } from '@/utils'
import { marked } from 'marked'

interface Props { message: ChatMessageType }

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  
  const getHtml = () => {
    if (isUser) return { __html: message.content }
    // Parse markdown for assistant, ensure line breaks are converted
    const rawMarkup = marked(message.content, { breaks: true })
    return { __html: rawMarkup as string }
  }

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
        {isUser ? (
          <div class="chat-msg-bubble">{message.content}</div>
        ) : (
          <div class="chat-msg-bubble markdown-body" dangerouslySetInnerHTML={getHtml()} />
        )}
        <span class="chat-msg-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  )
}
