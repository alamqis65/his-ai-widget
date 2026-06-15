import type { ChatMessage, ServiceResponse } from '@/types'

/**
 * AIService — abstraction layer for AI chat completion.
 *
 * TODO (Production):
 * - Implement ProductionAIService using streaming fetch (SSE/ReadableStream)
 * - Add JWT/API Key authentication headers
 * - Handle token refresh and session expiry
 * - Add retry logic with exponential backoff
 * - Integrate with VITE_AI_BASE_URL + VITE_CHAT_ENDPOINT
 */
export interface AIService {
  sendMessage(
    message: string,
    history: ChatMessage[]
  ): Promise<ServiceResponse<string>>
}
