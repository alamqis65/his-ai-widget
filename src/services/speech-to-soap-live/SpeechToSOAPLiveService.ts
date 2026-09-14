import type {
  ServiceResponse,
  SoapLiveEvent,
  SoapRecommendationType,
  SuggestedTTV,
  SuggestedDiagnosis,
  SuggestedPrescription,
  SuggestedLaboratory,
} from '@/types'

/** Satu item hasil "Generate Recommendation" — bentuknya beda-beda tergantung `SoapRecommendationType`. */
export type SoapRecommendationItem = SuggestedTTV | SuggestedDiagnosis | SuggestedPrescription | SuggestedLaboratory

/**
 * SpeechToSOAPLiveService
 *
 * Kontrak untuk fitur "Speech to SOAP Live": audio dikirim per-chunk selagi
 * merekam (bukan sekali di akhir seperti SpeechToSOAPService lama), dan hasil
 * SOAP datang live lewat SSE, bukan lewat response dari chunk upload.
 *
 * Production endpoints (lihat SDKApiConfig di types/sdk.ts):
 *   - soapLiveChunkEndpoint   : POST tiap chunk audio
 *   - soapLiveEventsEndpoint  : SSE, kirim event {type, id, value}
 *   - soapRecommendationEndpoint : POST, satu endpoint untuk semua jenis rekomendasi
 */
export interface SpeechToSOAPLiveService {
  /** Buka koneksi SSE untuk `sessionId` ini. `onEvent` dipanggil tiap event masuk. */
  connect(sessionId: string, onEvent: (event: SoapLiveEvent) => void): void

  /**
   * Kirim satu potongan audio. `index` dimulai dari 0, naik terus tiap
   * `ondataavailable` dari MediaRecorder. `isFinal=true` pada chunk terakhir
   * (dikirim saat stopRecording, walau blob-nya kosong) — jadi backend tahu
   * kapan harus berhenti menunggu chunk berikutnya.
   */
  sendChunk(sessionId: string, chunk: Blob, index: number, isFinal: boolean): Promise<void>

  /** Minta rekomendasi satu jenis (VITALSIGN/DIAGNOSE/PRESCRIPTION/LABORATORY) — plain request/response, bukan lewat SSE. */
  getRecommendation(sessionId: string, type: SoapRecommendationType): Promise<ServiceResponse<SoapRecommendationItem[]>>

  /**
   * Trigger finalisasi SOAPI di backend secara eksplisit.
   * Dipanggil setelah final chunk dikirim, sebelum menunggu STATUS=DONE.
   * Idempotent — aman dipanggil berkali-kali.
   */
  finalizeSession(sessionId: string): Promise<void>

  /** Tutup koneksi SSE. Dipanggil setelah selesai (STATUS=DONE / timeout) atau saat reset. */
  disconnect(): void
}
