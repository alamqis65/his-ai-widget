// ─── Chat Types ───────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

// ─── Speech to SOAP Types ─────────────────────────────────────────────────────

export type RecorderState =
  | 'IDLE'
  | 'RECORDING'
  | 'PROCESSING_STT'
  | 'REVIEWING'
  | 'PROCESSING_LLM'
  | 'DONE'
  | 'ERROR'

export interface STTResult {
  transcript: string
  confidence?: number
  durationMs?: number
}

export interface SOAPNote {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

export interface SOAPResult {
  soap: SOAPNote
  generatedAt: Date
  transcriptUsed: string
}

// ─── Clinical Pathway Types ───────────────────────────────────────────────────

export type ClinicalPathwayState = 'IDLE' | 'GENERATING' | 'DONE' | 'ERROR'

export interface PathwayStep {
  day: string
  activities: string[]
  medications?: string[]
  assessments?: string[]
}

export interface ClinicalPathwayResult {
  diagnosis: string
  totalDays: number
  steps: PathwayStep[]
  generatedAt: Date
}

// ─── E-Claim Types ────────────────────────────────────────────────────────────

export type EClaimState = 'IDLE' | 'CHECKING' | 'DONE' | 'ERROR'

export interface EClaimCheckResult {
  eligible: boolean
  claimCode: string
  diagnosis: string
  icdCode: string
  estimatedCost: number
  coveredAmount: number
  notes: string[]
  checkedAt: Date
}

// ─── Service Types ────────────────────────────────────────────────────────────

export interface ServiceResponse<T> {
  data: T
  ok: boolean
  error?: string
}

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
   * Endpoint Speech-to-Text.
   * Widget akan POST FormData { audio: Blob } dan expect { transcript: string }
   * @example 'https://api.rs-nusantara.com/ai/stt'
   */
  sttEndpoint?: string

  /**
   * Endpoint SOAP Generator.
   * Widget akan POST { transcript, context } dan expect { soap: SOAPNote }
   * @example 'https://api.rs-nusantara.com/ai/soap'
   */
  soapEndpoint?: string

  /**
   * Endpoint Clinical Pathway Generator.
   * Widget akan POST { diagnosis, context } dan expect { pathway: ClinicalPathwayResult }
   * @example 'https://api.rs-nusantara.com/ai/pathway'
   */
  pathwayEndpoint?: string

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
   * Dipanggil saat dokter klik "Simpan ke HIS" di fitur Speech to SOAP.
   * @example onResultSOAP: (result) => saveToEMR('soap', result)
   */
  onResultSOAP?: (result: SOAPResult) => void

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

export type WidgetTheme = 'light' | 'dark'
export type ActiveFeature = 'chat' | 'speech-to-soap' | 'clinical-pathway' | 'eclaim'

export interface SDKConfig extends SDKCallbacks {
  // ── Identity ──────────────────────────────────────────────────────────────
  /** Nama dokter / user yang tampil di header widget */
  userName?: string

  /** Theme widget. Default: 'light' */
  theme?: WidgetTheme

  // ── Patient Context ───────────────────────────────────────────────────────
  patientId?: string
  visitId?: string
  doctorId?: string
  departmentId?: string

  // ── API Endpoints ─────────────────────────────────────────────────────────
  /** Konfigurasi endpoint per service. Kalau tidak diisi → pakai Mock. */
  api?: SDKApiConfig
  apiBaseUrl?: string

  // ── Feature Visibility ────────────────────────────────────────────────────
  /**
   * Tampilkan / sembunyikan fitur tertentu.
   * Semua default: true
   * @example features: { eclaim: false, pathway: false }
   */
  features?: SDKFeatureFlags
}

// ─── Legacy compat ────────────────────────────────────────────────────────────
export interface HISAISDKOptions {
  context?: { patientId?: string; visitId?: string; doctorId?: string; departmentId?: string }
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}
export interface HISContext {
  patientId?: string; visitId?: string; doctorId?: string; departmentId?: string
}
