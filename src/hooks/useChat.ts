import { useState, useCallback } from 'preact/hooks'
import type { ChatMessage, SDKCallbacks } from '@/types'
import { getAIService } from '@/services/registry'
import { generateId } from '@/utils'

interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearHistory: () => void
}

export function useChat(callbacks?: Pick<SDKCallbacks, 'onResultChat'>): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const trimmedContent = content.trim()
      // Optimistically add user message to local state
      let newMessages: ChatMessage[] = []
      setMessages(prev => {
        const userMsg: ChatMessage = {
          id: generateId(),
          role: 'user',
          content: trimmedContent,
          timestamp: new Date(),
        }
        newMessages = [...prev, userMsg]
        return newMessages
      })

      setIsLoading(true)
      setError(null)

      try {
        const service = getAIService()
        const result = await service.sendMessage(trimmedContent, newMessages)

        if (result.ok) {
          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: result.data,
            timestamp: new Date(),
          }
          setMessages(prev => [...prev, assistantMsg])
        } else {
          setError(result.error ?? 'Terjadi kesalahan. Coba lagi.')
        }
      } catch (e) {
        // Handle unexpected errors from the service
        setError('Terjadi kesalahan. Coba lagi.')
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

  return { messages, isLoading, error, sendMessage, clearHistory }
}
