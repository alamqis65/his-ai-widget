import type { SoapLiveEvent } from '@/types'

/**
 * SOAPLiveEventListener
 *
 * Bungkus native `EventSource` untuk menerima event terstruktur
 * `{type, id, value}` dari `soapLiveEventsEndpoint`.
 *
 * Sengaja dipisah dari SOAPProgressListener.ts (punya fitur Speech to SOAP
 * lama) walau keduanya sama-sama bungkus EventSource — SOAPProgressListener
 * cuma buat pesan progres kosmetik ("Mentranskripsi...") untuk loading
 * indicator, sedangkan listener ini buat event data terstruktur yang benar-
 * benar mengisi state SOAP live. Beda tujuan, jadi jangan digabung.
 */
export class SOAPLiveEventListener {
  private es: EventSource | null = null

  /**
   * Buka koneksi SSE ke `url` dan panggil `onEvent` tiap kali ada event
   * `{type, id, value}` yang valid masuk. Silently no-op kalau `url` kosong.
   */
  start(url: string | undefined, onEvent: (event: SoapLiveEvent) => void): void {
    if (!url) return

    try {
      this.es = new EventSource(url)

      this.es.onmessage = ev => {
        const parsed = this.parse(ev.data)
        if (parsed) onEvent(parsed)
      }

      // Tidak auto-stop di sini seperti SOAPProgressListener — koneksi Live
      // ini memang harus tetap coba reconnect sendiri (perilaku default
      // EventSource) selama proses merekam masih berlangsung. Yang menutup
      // koneksi secara eksplisit adalah stop(), dipanggil dari hook setelah
      // menerima STATUS=DONE (atau timeout) pasca stopRecording().
      this.es.onerror = () => {
        // no-op — biarkan browser retry otomatis
      }
    } catch {
      this.es = null
    }
  }

  stop(): void {
    this.es?.close()
    this.es = null
  }

  private parse(raw: string): SoapLiveEvent | null {
    if (!raw) return null
    try {
      const data = JSON.parse(raw)
      if (!data || typeof data.type !== 'string') return null
      return { type: data.type, id: data.id, value: data.value }
    } catch {
      // Bukan JSON valid — abaikan, jangan sampai bikin state SOAP rusak.
      return null
    }
  }
}

/**
 * Generate session id unik di client untuk korelasi chunk audio, koneksi
 * SSE, dan request rekomendasi (semuanya dikunci ke `session_id` yang sama
 * di cache backend).
 */
export function generateSOAPLiveSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `soap-live-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
