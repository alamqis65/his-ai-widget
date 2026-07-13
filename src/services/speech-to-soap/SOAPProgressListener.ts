import type { SOAPProgressEvent } from '@/types'

/**
 * SOAPProgressListener
 *
 * Bungkus native `EventSource` supaya loading panel di Speech-to-SOAP bisa
 * nampilin pesan progres ("Mendengarkan audio...", "Mentranskripsi...", dst)
 * yang dikirim AI service via SSE selagi request POST audio masih diproses
 * di backend.
 *
 * Dipisah dari ProductionSpeechToSOAPService supaya gampang dites/dipakai
 * ulang, dan supaya kegagalan koneksi SSE (mis. endpoint belum ada / network
 * error) tidak pernah bikin proses utama (POST audio -> SOAP) ikut gagal —
 * SSE di sini murni kosmetik buat loading state.
 */
export class SOAPProgressListener {
  private es: EventSource | null = null

  /**
   * Buka koneksi SSE ke `url` dan panggil `onProgress` tiap kali ada event
   * masuk. Silently no-op kalau `url` kosong.
   */
  start(url: string | undefined, onProgress: (event: SOAPProgressEvent) => void): void {
    if (!url) return

    try {
      this.es = new EventSource(url)

      this.es.onmessage = ev => {
        const parsed = this.parse(ev.data)
        if (parsed) onProgress(parsed)
      }

      this.es.addEventListener('progress', ((ev: MessageEvent) => {
        const parsed = this.parse(ev.data)
        if (parsed) onProgress(parsed)
      }) as EventListener)

      this.es.onerror = () => {
        this.stop()
      }
    } catch {
      this.es = null
    }
  }

  stop(): void {
    this.es?.close()
    this.es = null
  }

  private parse(raw: string): SOAPProgressEvent | null {
    if (!raw) return null
    try {
      const data = JSON.parse(raw)
      const message = typeof data === 'string' ? data : (data.message ?? data.text ?? data.status)
      if (!message) return null
      return { message, step: typeof data === 'object' ? data.step : undefined }
    } catch {
      // Bukan JSON — anggap datanya langsung teks pesan
      return { message: raw }
    }
  }
}

/**
 * Generate request id unik buat korelasi antara request POST audio dan
 * koneksi SSE progress (`?request_id=xxx`).
 */
export function generateSOAPRequestId(): string {
  return `soap-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
