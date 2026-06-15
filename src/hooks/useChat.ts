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

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateId(), role: 'user',
      content: content.trim(), timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    // Service di-resolve saat call — otomatis Mock atau Production
    // berdasarkan config dari his_ai_widget.init()
    const service = getAIService()
    const result = await service.sendMessage(content, messages)

    if (result.ok) {
      const assistantMessage: ChatMessage = {
        id: generateId(), role: 'assistant',
        content: result.data, timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } else {
      setError(result.error ?? 'Terjadi kesalahan. Coba lagi.')
    }

    setIsLoading(false)
  }, [isLoading, messages])

  const clearHistory = useCallback(() => {
    // Emit riwayat chat sebelum di-clear
    if (messages.length > 0) {
      callbacks?.onResultChat?.(messages)
      window.dispatchEvent(new CustomEvent('his_ai:result', {
        detail: { type: 'CHAT_HISTORY', data: messages }
      }))
    }
    setMessages([])
    setError(null)
  }, [messages, callbacks])

  return { messages, isLoading, error, sendMessage, clearHistory }
}
