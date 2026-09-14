import type { ChatMessage, ChatMessageResult } from './chat'
import type { SOAPResult } from './speech-to-soap'
import type { ClinicalPathwayResult } from './clinical-pathway'
import type { EClaimCheckResult } from './eclaim'

// ─── SDK API Endpoints ────────────────────────────────────────────────────────
// Semua endpoint dikonfigurasi dari init(), tidak dari .env
// Kalau tidak diisi → pakai Mock service (mode development)

export interface SDKApiConfig {
  /**
   * Endpoint AI Chat.
   * Widget akan POST { message, history } dan expect { reply: string }
   * @example 'https://api.rs-nusantara.com/ai/chat'
   */
  chatEndpoint?: string

  /**
   * Endpoint Speech-to-SOAP — handle transkripsi DAN generate SOAP sekaligus.
   *
   * Request : POST multipart/form-data { audio: Blob }
   * Response: { transcript: string, soap: { subjective, objective, assessment, plan } }
   *
   * @example 'https://api.rs-nusantara.com/ai/speech-to-soap'
   */
  soapGeneratorEndpoint?: string
  /**
   * pretext tambahan untuk request SOAP Generator (opsional).
   * Gunakan untuk memberikan konteks tambahan sebelum transkripsi dokter-pasien.
   * @example { 'pasien berusia 15 tahun dengan riwayat hipertensi tingkat 1' }
   */
  pretext?: string
  /**
   * custom bentuk JSON dari SOAPI result
   * @example { 'SOAPI:{S:{},O:{},A:{},P:{},I:{}}' }
   */
  soapiTemplate?: string
  /**
   * digunakan khusus untuk medin
   * digunakan untuk memberikan data id dari vital sign yang bisa di mapping oleh AI
   * @example { 'pasien berusia 15 tahun dengan riwayat hipertensi tingkat 1' }
   */
  vitalSignList?: string

  /**
   * Endpoint SSE (Server-Sent Events) untuk progress Speech-to-SOAP (opsional).
   *
   * Kalau diisi, widget akan buka koneksi `EventSource` ke endpoint ini
   * selagi audio diproses (state PROCESSING_LLM), supaya loading panel bisa
   * menampilkan pesan progres real-time dari AI service (mis. "Mendengarkan
   * audio...", "Mentranskripsikan...", "Menyusun rekomendasi...", "Hampir
   * selesai...") alih-alih spinner kosong.
   *
   * Widget generate `request_id` unik per proses, kirim sebagai query param
   * ke endpoint ini (`?request_id=xxx`) DAN sebagai field di form-data POST
   * ke `soapGeneratorEndpoint`, supaya backend bisa mengkorelasikan job yang mana
   * kirim event progress yang mana.
   *
   * Format tiap event SSE (data-only, boleh pakai `event: progress` opsional):
   *   data: {"message": "Mentranskripsikan audio...", "step": "TRANSCRIBE"}
   *
   * Kalau tidak diisi → loading panel pakai teks statis (fallback), tidak
   * ada koneksi SSE yang dibuka.
   *
   * @example 'https://api.rs-nusantara.com/ai/speech-to-soap/progress'
   */
  soapProgressEndpoint?: string

  /**
   * Endpoint Clinical Pathway Generator.
   * Widget akan POST { diagnosis, context } dan expect { pathway: ClinicalPathwayResult }
   * @example 'https://api.rs-nusantara.com/ai/pathway'
   */
  pathwayEndpoint?: string

  /**
   * Endpoint Master Diagnosa untuk Clinical Pathway.
   * Widget akan GET untuk mengambil daftar diagnosa auto complete.
   * @example 'https://api.rs-nusantara.com/ai/pathway/master-diagnoses'
   */
  pathwayMasterDiagnosesEndpoint?: string

  /**
   * Endpoint E-Claim Check.
   * Widget akan POST { patientId, icdCode, diagnosis } dan expect { result: EClaimCheckResult }
   * @example 'https://api.rs-nusantara.com/eclaim/check'
   */
  eclaimEndpoint?: string

  /**
   * Header tambahan untuk semua request (opsional).
   * Gunakan untuk Authorization, API Key, Tenant ID, dll.
   * @example { 'Authorization': 'Bearer xxx', 'X-Hospital-Id': 'RS-001' }
   */
  headers?: Record<string, string>

  // ── Speech to SOAP Live ─────────────────────────────────────────────────
  // Endpoint untuk fitur "Speech to SOAP Live" — terpisah dari
  // soapGeneratorEndpoint di atas. Kalau salah satu/ketiganya tidak diisi,
  // widget pakai MockSpeechToSOAPLiveService (mode dev/demo). Lihat
  // services/speech-to-soap/SpeechToSOAPLiveService.ts untuk detail kontrak.

  /**
   * Endpoint POST untuk tiap potongan (chunk) audio selagi masih merekam.
   * Request: multipart/form-data { audio_file: Blob }, dengan
   * `X-Session-Id` dan `X-Chunk-Index` dikirim sebagai header (bukan field).
   * @example 'https://api.rs-nusantara.com/ai/speech-to-soap-live/chunk'
   */
  soapLiveChunkEndpoint?: string

  /**
   * Endpoint SSE untuk menerima update SOAP live selagi merekam. Widget buka
   * `EventSource` ke `${soapLiveEventsEndpoint}?session_id=xxx` dan menerima
   * event berformat `{type, id, value}` — lihat SoapLiveEvent di
   * types/speech-to-soap.ts.
   * @example 'https://api.rs-nusantara.com/ai/speech-to-soap-live/events'
   */
  soapLiveEventsEndpoint?: string

  /**
   * Endpoint POST tunggal untuk semua jenis "Generate Recommendation"
   * (tanda vital, diagnosa, resep, lab), dibedakan lewat field
   * `recommendation_type` di body request.
   * Request : POST { session_id, recommendation_type }
   * Response: array item sesuai recommendation_type-nya.
   * @example 'https://api.rs-nusantara.com/ai/speech-to-soap-live/recommendation'
   */
  soapRecommendationEndpoint?: string

  /**
   * Endpoint POST untuk trigger finalisasi SOAPI setelah rekaman berhenti.
   * Request : POST { session_id }
   * Dipanggil sebelum menunggu STATUS=DONE dari SSE — supaya ekstraksi final
   * tidak bergantung hanya pada flag is_final di chunk terakhir.
   * @example 'https://api.rs-nusantara.com/ai/speech-to-soap-live/finalize'
   */
  soapLiveFinalizeEndpoint?: string
}

// ─── SDK Feature Visibility ───────────────────────────────────────────────────
// Semua fitur default: true (tampil). Set false / 0 untuk menyembunyikan.

export interface SDKFeatureFlags {
  /**
   * AI Chat Assistant. Default: true
   * @example features: { chat: false }
   */
  chat?: boolean

  /**
   * Speech to SOAP. Default: true
   * @example features: { soap: false }
   */
  soap?: boolean

  /**
   * Clinical Pathway Generator. Default: true
   * @example features: { pathway: false }
   */
  pathway?: boolean

  /**
   * E-Claim Check. Default: true
   * @example features: { eclaim: false }
   */
  eclaim?: boolean
  /**
   * Speech to SOAP Live. Default: true
   * @example features: { soapLive: false }
   */
  soapLive?: boolean
}

// ─── SDK Callbacks ────────────────────────────────────────────────────────────
// Tiap fitur punya callback sendiri supaya lebih mudah di-handle terpisah

export interface SDKCallbacks {
  /**
   * Dipanggil saat ada error dari widget (jaringan, permission, dll)
   */
  onError?: (error: Error) => void

  /**
   * Dipanggil saat sesi chat berakhir / user clear history.
   * Menerima seluruh riwayat pesan selama sesi.
   * @example onResultChat: (messages) => saveToEMR('chat', messages)
   */
  onResultChat?: (messages: ChatMessage[]) => void

  /**
   * Dipanggil saat dokter klik "Ambil hasil chat ini" di bawah salah satu
   * jawaban AI. Beda dengan onResultChat (seluruh riwayat, saat sesi
   * berakhir/clear), ini fire per-jawaban dan membawa payload mentah dari
   * backend AI (jawaban_medis + semua suggested_*), bukan cuma teksnya.
   * @example onResultChatMessage: (result) => saveToEMR('chat-result', result.raw)
   */
  onResultChatMessage?: (result: ChatMessageResult) => void

  /**
   * Dipanggil saat dokter klik "Simpan ke HIS" di fitur Speech to SOAP.
   * @example onResultSOAP: (result) => saveToEMR('soap', result)
   */
  onResultSOAP?: (result: { type: string } & Partial<SOAPResult>) => void

  /**
   * Dipanggil saat dokter klik "Simpan ke HIS" di fitur Clinical Pathway.
   * @example onResultPathway: (result) => saveToEMR('pathway', result)
   */
  onResultPathway?: (result: ClinicalPathwayResult) => void

  /**
   * Dipanggil saat dokter klik "Ajukan Klaim" di fitur E-Claim Check.
   * @example onResultEClaim: (result) => submitClaim(result)
   */
  onResultEClaim?: (result: EClaimCheckResult) => void
}

// ─── SDK Config (full) ────────────────────────────────────────────────────────

/**
 * Widget theme. Controls a `data-theme` attribute on the widget's shadow
 * host, which every color token in src/styles/tokens.css is scoped to
 * (`:host([data-theme='...'])`) — switching this value re-colors the whole
 * widget purely via CSS, no re-render needed.
 *
 * To add a new theme: add its name here, then add a matching
 * `:host([data-theme='your-name'])` block in src/styles/tokens.css. See the
 * comment at the top of that file for the full walkthrough.
 */
export type WidgetTheme = 'theme-green' | 'theme-dark' | 'theme-blue' | 'theme-midnight-purple' | 'theme-midnight-green'
export type ActiveFeature = 'chat' | 'speech-to-soap' | 'clinical-pathway' | 'eclaim' | 'speech-to-soap-live'

// ─── Speech to SOAP view modes ────────────────────────────────────────────────
// Different embedding menus can want different result views for the exact
// same API response — this is display-only, the backend contract doesn't
// change. Extend this union (and add a matching view component) whenever a
// new menu needs its own SOAP presentation.
//
// 'current' — existing checkbox-driven view: batch-select anamesa/plan/
//              diagnoses/procedures/vitals/prescriptions/lab suggestions,
//              "Simpan ke HIS" sends only what's checked.
// 'native'  — pure S/O/A/P(+I) straight from the API, no checkboxes,
//              "Simpan ke HIS" always enabled and sends the whole SOAP note.
export type SoapViewMode = 'current' | 'native'

export interface SDKConfig extends SDKCallbacks {
  // ── Identity ──────────────────────────────────────────────────────────────
  /** Nama dokter / user yang tampil di header widget */
  userName?: string

  /** Theme widget. Default: 'light' */
  theme?: WidgetTheme

  // ── Patient Context ───────────────────────────────────────────────────────
  patientData?: any // optional additional patient data

  patientId?: string
  visitId?: string
  doctorId?: string
  departmentId?: string
  age?: number
  gender?: string
  isBPJS?: boolean

  // ── API Endpoints ─────────────────────────────────────────────────────────
  /** Konfigurasi endpoint per service. Kalau tidak diisi → pakai Mock. */
  api?: SDKApiConfig

  // ── Feature Visibility ────────────────────────────────────────────────────
  /**
   * Tampilkan / sembunyikan fitur tertentu.
   * Semua default: true
   * @example features: { eclaim: false, pathway: false }
   */
  features?: SDKFeatureFlags

  // ── Speech to SOAP view ───────────────────────────────────────────────────
  /**
   * Menentukan tampilan hasil Speech-to-SOAP. Default: 'current'.
   * Beda menu/embed bisa pakai mode beda meski endpoint & response-nya sama.
   * @example soapViewMode: 'native'
   */
  soapViewMode?: SoapViewMode

  // ── Speech to SOAP — input tambahan ──────────────────────────────────────
  /**
   * Mengaktifkan opsi upload file audio (selain rekam langsung) di fitur
   * Speech to SOAP. Kalau `true`, tombol "Upload Suara" akan tampil di layar
   * "Mulai" dan dokter bisa pilih file audio dari perangkat sebagai pengganti
   * rekam langsung. Default: `false`.
   * @example canUploadAudioSoap: true
   */
  canUploadAudioSoap?: boolean

  /**
   * Mengaktifkan opsi input teks (User Prompt) di fitur Speech to SOAP.
   * Kalau `true`, tombol "Tulis Teks" akan tampil di layar "Mulai" dan dokter
   * bisa mengetik catatan/konteks tambahan sebagai pengganti rekam/upload
   * audio.
   *
   * Teks yang diketik TIDAK menimpa `api.pretext` — kalau `api.pretext` sudah
   * diisi saat init(), teks user akan ditambahkan setelahnya dengan format:
   *   `${api.pretext}\nuserPromt: \`${userPromt}\``
   * (kalau `api.pretext` kosong, hasil akhirnya cukup `userPromt: \`${userPromt}\``).
   *
   * Default: `false`.
   * @example isAbleUserPromptSoap: true
   */
  isAbleUserPromptSoap?: boolean
}

// ─── Legacy compat ────────────────────────────────────────────────────────────
export interface HISAISDKOptions {
  context?: { patientId?: string; visitId?: string; doctorId?: string; departmentId?: string }
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}
export interface HISContext {
  patientId?: string
  visitId?: string
  doctorId?: string
  departmentId?: string
}
