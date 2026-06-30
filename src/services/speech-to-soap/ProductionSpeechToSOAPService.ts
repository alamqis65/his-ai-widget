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
    const pretext = this.apiConfig.pretext
    const vitalSignList = this.apiConfig.vitalSignList
    if (!endpoint) {
      return {
        data: {} as SpeechToSOAPResult,
        ok: false,
        error: 'soapGeneratorEndpoint tidak dikonfigurasi di init({ api: { soapGeneratorEndpoint } })',
      }
    }

    try {
      const form = new FormData()
      form.append('audio_file', audioBlob, 'recording.webm')
      form.append('raw_text', pretext || '')
      form.append('vital_sign_list', vitalSignList || '')
      form.append('output_language', 'Indonesia')
      form.append('dialect', 'Umum')
      form.append('reference_cases_show', 'true')
      form.append('show_prompts', 'false')
      form.append('is_bpjs', 'true')
      form.append('reference_is_bpjs_only', 'false')

      const res = await fetch(endpoint, {
        method: 'POST',
        // headers: { ...this.apiConfig.headers }, sementara belum dipakai hingga nanti ada token atau kebutuhan header lain
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

      // cek apakah data.d masih string JSON

      // cek apakah data.d masih string JSON atau sudah object
      let payload: any
      if (data && typeof data.d === 'string') {
        try {
          payload = JSON.parse(data.d)
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : String(e)
          throw new Error('Response bukan JSON valid: ' + message)
        }
      } else if (data && typeof data.d === 'object') {
        payload = data.d
      } else {
        // fallback: kalau server langsung kirim JSON tanpa wrapper {d:...}
        payload = data
      }

      return {
        data: {
          soapResult: {
            soap: payload.compose?.soapi,
            anamesa: payload.compose?.anamesa,
            generatedAt: new Date(),
            transcriptUsed: payload.compose?.rawTranscript ?? '',
            sugest_diagnosis: payload.compose?.sugest_diagnosis ?? [],
            sugest_procedures: payload.compose?.sugest_procedures ?? [],
            sugest_VitalSign: payload.compose?.tanda_vital ?? [],
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
