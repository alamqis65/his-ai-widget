import { useState, useCallback } from 'preact/hooks'
import type { ChatMessage } from '@/types'
import type { AIService } from '@/services/ai/AIService'
import { MockAIService } from '@/services/ai/MockAIService'
import { generateId } from '@/utils'
import { IS_MOCK } from '@/utils'

// TODO: Swap MockAIService for ProductionAIService based on env
const aiService: AIService = IS_MOCK
  ? new MockAIService()
  : new MockAIService() // Replace with: new ProductionAIService()

interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearHistory: () => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    const result = await aiService.sendMessage(content, messages)

    if (result.ok) {
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: result.data,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } else {
      setError(result.error ?? 'Terjadi kesalahan. Coba lagi.')
    }

    setIsLoading(false)
  }, [isLoading, messages])

  const clearHistory = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, clearHistory }
}
