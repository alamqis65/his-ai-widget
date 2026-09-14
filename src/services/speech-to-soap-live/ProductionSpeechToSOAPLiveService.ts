import type { ServiceResponse, SDKApiConfig, SoapLiveEvent, SoapRecommendationType } from '@/types'
import type { SpeechToSOAPLiveService, SoapRecommendationItem } from './SpeechToSOAPLiveService'
import { SOAPLiveEventListener } from './SOAPLiveEventListener'

/**
 * ProductionSpeechToSOAPLiveService
 *
 * - connect()          -> EventSource ke `${soapLiveEventsEndpoint}?session_id=xxx`
 * - sendChunk()         -> POST multipart/form-data { audio_file } ke soapLiveChunkEndpoint,
 *                          dengan X-Session-Id / X-Chunk-Index / (X-Chunk-Final) sebagai header
 * - getRecommendation() -> POST JSON { session_id, recommendation_type } ke soapRecommendationEndpoint
 */

function getExtension(mimeType: string) {
  if (mimeType.includes('mp4')) return 'm4a'
  if (mimeType.includes('ogg')) return 'ogg'
  if (mimeType.includes('wav')) return 'wav'
  if (mimeType.includes('mp3')) return 'mp3'
  return 'webm'
}

export class ProductionSpeechToSOAPLiveService implements SpeechToSOAPLiveService {
  private listener = new SOAPLiveEventListener()

  constructor(private readonly apiConfig: SDKApiConfig) {}

  connect(sessionId: string, onEvent: (event: SoapLiveEvent) => void): void {
    const endpoint = this.apiConfig.soapLiveEventsEndpoint
    if (!endpoint) return

    const separator = endpoint.includes('?') ? '&' : '?'
    const url = `${endpoint}${separator}session_id=${encodeURIComponent(sessionId)}`
    this.listener.start(url, onEvent)
  }

  async sendChunk(sessionId: string, chunk: Blob, index: number, isFinal: boolean): Promise<void> {
    const endpoint = this.apiConfig.soapLiveChunkEndpoint
    const vitalSignList = this.apiConfig.vitalSignList

    if (!endpoint) return

    const extension = getExtension(chunk.type)
    const form = new FormData()
    form.append('audio_file', chunk, `chunk-${index}.${extension}`)
    if (index === 0) form.append('vital_sign_list', vitalSignList ?? '')

    // Identitas chunk dikirim sebagai HEADER (bukan form field), sesuai
    // kontrak backend — supaya backend bisa baca session_id/chunk-index
    // tanpa harus buka body multipart-nya dulu.
    const headers: Record<string, string> = {
      ...this.apiConfig.headers,
      'X-Session-Id': sessionId,
      'X-Chunk-Index': String(index),
    }
    if (isFinal) headers['X-Chunk-Final'] = 'true'

    try {
      await fetch(endpoint, { method: 'POST', headers, body: form })
    } catch {
      // Satu chunk gagal terkirim tidak boleh menghentikan rekaman yang
      // masih berjalan — backend cukup kehilangan potongan transkrip itu,
      // chunk-chunk berikutnya tetap lanjut dikirim seperti biasa.
    }
  }

  async getRecommendation(
    sessionId: string,
    type: SoapRecommendationType,
  ): Promise<ServiceResponse<SoapRecommendationItem[]>> {
    const endpoint = this.apiConfig.soapRecommendationEndpoint
    if (!endpoint) {
      return {
        data: [],
        ok: false,
        error: 'soapRecommendationEndpoint tidak dikonfigurasi di init({ api: { soapRecommendationEndpoint } })',
      }
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.apiConfig.headers },
        body: JSON.stringify({ session_id: sessionId, recommendation_type: type }),
      })

      if (!res.ok) {
        return { data: [], ok: false, error: `HTTP ${res.status}: ${await res.text()}` }
      }

      const data = await res.json()
      // Terima beberapa bentuk response yang wajar (array langsung, atau
      // dibungkus { items } / { data }) — backend belum final formatnya.
      const items = Array.isArray(data) ? data : (data?.items ?? data?.data ?? [])

      return { data: items, ok: true }
    } catch (err) {
      return { data: [], ok: false, error: (err as Error).message }
    }
  }

  async finalizeSession(sessionId: string): Promise<void> {
    const endpoint = this.apiConfig.soapLiveFinalizeEndpoint
    if (!endpoint) return

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.apiConfig.headers },
        body: JSON.stringify({ session_id: sessionId }),
      })
    } catch {
      // Finalisasi gagal tidak boleh memblokir UI — backend sudah punya
      // fallback via flag is_final di chunk terakhir.
    }
  }

  disconnect(): void {
    this.listener.stop()
  }
}
