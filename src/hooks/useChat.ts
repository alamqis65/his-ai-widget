import { useState, useCallback } from 'preact/hooks'
import type { ChatMessage, ChatMessageResult, SDKCallbacks } from '@/types'
import { getAIService } from '@/services/registry'
import { generateId } from '@/utils'

interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearHistory: () => void
  takeChatResult: (messageId: string) => void
}

export function useChat(callbacks?: Pick<SDKCallbacks, 'onResultChat' | 'onResultChatMessage'>): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const trimmedContent = content.trim()
      // Optimistically add user message to local state
      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: trimmedContent,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, userMsg])

      setIsLoading(true)
      setError(null)

      try {
        const service = getAIService()
        const result = await service.sendMessage(trimmedContent, userMsg)

        if (result.ok) {
          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: result.data.text,
            timestamp: new Date(),
            raw: result.data.raw,
          }
          setMessages(prev => [...prev, assistantMsg])
        } else {
          setError(result.error ?? 'Terjadi kesalahan. Coba lagi.')
        }
      } catch (e) {
        // Handle unexpected errors from the service
        setError(e instanceof Error ? `Terjadi kesalahan. Coba lagi. ${e.message}` : 'Terjadi kesalahan. Coba lagi.')
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  const clearHistory = useCallback(() => {
    if (messages.length > 0) {
      callbacks?.onResultChat?.(messages)
      window.dispatchEvent(
        new CustomEvent('his_ai:result', {
          detail: { type: 'CHAT_HISTORY', data: messages },
        }),
      )
    }
    setMessages([])
    setError(null)
  }, [messages, callbacks])

  /**
   * Fires when the doctor clicks "Ambil hasil chat ini" under a specific
   * AI answer. Unlike clearHistory (whole session, on clear), this sends
   * just that one message's raw AI payload — jawaban_medis plus all the
   * suggested_* fields — via onResultChatMessage.
   */
  const takeChatResult = useCallback(
    (messageId: string) => {
      const msg = messages.find(m => m.id === messageId)
      if (!msg || msg.role !== 'assistant') return

      const result: ChatMessageResult = {
        messageId: msg.id,
        timestamp: msg.timestamp,
        raw: msg.raw,
      }
      callbacks?.onResultChatMessage?.(result)
      window.dispatchEvent(
        new CustomEvent('his_ai:result', {
          detail: { type: 'CHAT_MESSAGE_RESULT', data: result },
        }),
      )
    },
    [messages, callbacks],
  )

  return { messages, isLoading, error, sendMessage, clearHistory, takeChatResult }
}
