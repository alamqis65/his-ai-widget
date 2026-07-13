// ─── Chat Types ───────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system'

/**
 * Full raw payload straight from the medical AI backend for one exchange —
 * not just the reply text. Known fields are typed; anything else the
 * backend adds later still comes through via the index signature so we
 * never silently drop new fields.
 *
 * @example
 * {
 *   jawaban_medis: "Berdasarkan data yang tersedia...",
 *   processing_time_ms: 50103,
 *   suggested_prescriptions: [...],
 *   suggested_orders: [...],
 *   suggested_diagnoses: [...],
 *   suggested_procedures: [...],
 * }
 */
export interface ChatAIResult {
  jawaban_medis: string
  processing_time_ms?: number
  processing_details?: Record<string, unknown>
  suggested_prescriptions?: unknown[]
  suggested_orders?: unknown[]
  suggested_diagnoses?: unknown[]
  suggested_procedures?: unknown[]
  [key: string]: unknown
}

/** What AIService.sendMessage resolves to internally — display text plus the raw payload it came from (if any). */
export interface ChatSendResult {
  text: string
  raw?: ChatAIResult
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  raw?: ChatAIResult
}

/**
 * Sent to onResultChatMessage when the doctor clicks "Ambil hasil chat ini"
 * on a specific AI answer. Includes the full raw backend payload (medical
 * answer + suggestions) so the host app doesn't have to re-parse message.content.
 */
export interface ChatMessageResult {
  messageId: string
  timestamp: Date
  raw?: ChatAIResult
}
