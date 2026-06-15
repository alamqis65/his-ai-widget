import type { ChatMessage, ServiceResponse, SDKApiConfig } from '@/types'
import type { AIService } from './AIService'

/**
 * ProductionAIService — memanggil endpoint chat dari konfigurasi SDK.
 *
 * Endpoint menerima POST:
 * {
 *   message: string,
 *   history: { role: 'user'|'assistant', content: string }[],
 *   context?: { patientId, visitId, doctorId, departmentId }
 * }
 *
 * Endpoint harus mengembalikan:
 * { reply: string }
 */
export class ProductionAIService implements AIService {
  constructor(private readonly apiConfig: SDKApiConfig) {}

  async sendMessage(
    message: string,
    history: ChatMessage[]
  ): Promise<ServiceResponse<string>> {
    const endpoint = this.apiConfig.chatEndpoint
    if (!endpoint) {
      return { data: '', ok: false, error: 'chatEndpoint tidak dikonfigurasi' }
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.apiConfig.headers,
        },
        body: JSON.stringify({
          message,
          history: history.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        return { data: '', ok: false, error: `HTTP ${res.status}: ${err}` }
      }

      const data = await res.json()
      return { data: data.reply ?? data.message ?? '', ok: true }
    } catch (err) {
      return { data: '', ok: false, error: (err as Error).message }
    }
  }
}
