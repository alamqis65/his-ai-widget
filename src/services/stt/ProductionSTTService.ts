import type { STTResult, ServiceResponse, SDKApiConfig } from '@/types'
import type { STTService } from './STTService'

/**
 * ProductionSTTService — kirim audio ke STT endpoint.
 *
 * Endpoint menerima POST multipart/form-data:
 * { audio: Blob (webm/wav) }
 *
 * Endpoint harus mengembalikan:
 * { transcript: string, confidence?: number }
 */
export class ProductionSTTService implements STTService {
  constructor(private readonly apiConfig: SDKApiConfig) {}

  async transcribe(audioBlob: Blob): Promise<ServiceResponse<STTResult>> {
    const endpoint = this.apiConfig.sttEndpoint
    if (!endpoint) {
      return { data: { transcript: '' }, ok: false, error: 'sttEndpoint tidak dikonfigurasi' }
    }

    try {
      const form = new FormData()
      form.append('audio', audioBlob, 'recording.webm')

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { ...this.apiConfig.headers },
        body: form,
      })

      if (!res.ok) {
        return { data: { transcript: '' }, ok: false, error: `HTTP ${res.status}` }
      }

      const data = await res.json()
      return {
        data: {
          transcript: data.transcript ?? '',
          confidence: data.confidence,
          durationMs: data.duration_ms,
        },
        ok: true,
      }
    } catch (err) {
      return { data: { transcript: '' }, ok: false, error: (err as Error).message }
    }
  }
}
