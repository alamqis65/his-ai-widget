import type { ServiceResponse, SDKApiConfig } from '@/types'
import type { SpeechToSOAPService, SpeechToSOAPResult } from './SpeechToSOAPService'

/**
 * ProductionSpeechToSOAPService
 *
 * Single call ke soapGeneratorEndpoint.
 *
 * Request:
 *   POST multipart/form-data
 *   { audio: Blob }
 *
 * Response:
 *   {
 *     "transcript": "Pasien datang dengan...",
 *     "soap": {
 *       "subjective":  "...",
 *       "objective":   "...",
 *       "assessment":  "...",
 *       "plan":        "..."
 *     }
 *   }
 */
export class ProductionSpeechToSOAPService implements SpeechToSOAPService {
  constructor(private readonly apiConfig: SDKApiConfig) {}

  async process(audioBlob: Blob): Promise<ServiceResponse<SpeechToSOAPResult>> {
    const endpoint = this.apiConfig.soapGeneratorEndpoint
    if (!endpoint) {
      return {
        data: {} as SpeechToSOAPResult,
        ok: false,
        error: 'soapGeneratorEndpoint tidak dikonfigurasi di init({ api: { soapGeneratorEndpoint } })',
      }
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
        return {
          data: {} as SpeechToSOAPResult,
          ok: false,
          error: `HTTP ${res.status}: ${await res.text()}`,
        }
      }

      const data = await res.json()
      return {
        data: {
          transcript: data.transcript ?? '',
          soapResult: {
            soap: data.soap,
            generatedAt: new Date(),
            transcriptUsed: data.transcript ?? '',
          },
        },
        ok: true,
      }
    } catch (err) {
      return {
        data: {} as SpeechToSOAPResult,
        ok: false,
        error: (err as Error).message,
      }
    }
  }
}
