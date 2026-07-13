import type { ServiceResponse, SDKApiConfig, SOAPProgressEvent, SDKConfig } from '@/types'
import type { SpeechToSOAPService, SpeechToSOAPResult } from './SpeechToSOAPService'
import { SOAPProgressListener, generateSOAPRequestId } from './SOAPProgressListener'

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

  private getFullConfig(): SDKConfig {
    return (window as any).his_ai_widget?._getConfig() || {}
  }

  async process(
    audioBlob: Blob,
    onProgress?: (event: SOAPProgressEvent) => void,
  ): Promise<ServiceResponse<SpeechToSOAPResult>> {
    const endpoint = this.apiConfig.soapGeneratorEndpoint
    const pretext = this.apiConfig.pretext
    const vitalSignList = this.apiConfig.vitalSignList
    const soapiTemplate = this.apiConfig.soapiTemplate
    const TipeKunjungan = this.getFullConfig().departmentId
    if (!endpoint) {
      return {
        data: {} as SpeechToSOAPResult,
        ok: false,
        error: 'soapGeneratorEndpoint tidak dikonfigurasi di init({ api: { soapGeneratorEndpoint } })',
      }
    }

    const requestId = generateSOAPRequestId()
    const progressListener = new SOAPProgressListener()
    if (this.apiConfig.soapProgressEndpoint) {
      const progressUrl = `${this.apiConfig.soapProgressEndpoint}?request_id=${encodeURIComponent(requestId)}`
      progressListener.start(progressUrl, event => onProgress?.(event))
    }

    try {
      const form = new FormData()
      form.append('audio_file', audioBlob, 'recording.webm')
      form.append('raw_text', pretext || '')
      form.append('vital_sign_list', vitalSignList || '')
      form.append('soapi_template', soapiTemplate || '')
      form.append('output_language', 'Indonesia')
      form.append('dialect', 'Umum')
      form.append('reference_cases_show', 'true')
      form.append('show_prompts', 'false')
      form.append('is_bpjs', 'true')
      form.append('reference_is_bpjs_only', 'false')
      form.append('request_id', requestId)
      form.append('tipe_kunjungan', TipeKunjungan || '')

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
            sugest_diagnosis: payload.compose?.suggested_diagnoses ?? [],
            sugest_procedures: payload.compose?.suggested_procedures ?? [],
            sugest_VitalSign: payload.compose?.vital_signs ?? [],
            rekomendasi_resep: payload.compose?.suggested_prescriptions ?? [],
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
    } finally {
      // Proses selesai (sukses/gagal) — tutup koneksi SSE progress kalau masih terbuka.
      progressListener.stop()
    }
  }
}
