// ─── Chat Types ───────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

// ─── Speech to SOAP Types ─────────────────────────────────────────────────────

export type RecorderState = 'IDLE' | 'RECORDING' | 'PROCESSING_STT' | 'REVIEWING' | 'PROCESSING_LLM' | 'DONE' | 'ERROR'

export interface STTResult {
  transcript: string
  confidence?: number
  durationMs?: number
}

export interface SOAPNote {
  Subjective: any
  Objective: any
  Assessment: any
  Plan: any
  Interventions?: any
}

export interface SuggestedDiagnosis {
  ICD10: string
  LabelICD10: string
  IsPrimary: 0 | 1
}

export interface SuggestedProcedure {
  ProcedureID: string
  ProcedureName: string
}

export interface SuggestedTTV {
  VitalSignID: number
  VitalSignName: string
  Value: string
  ValueUnit: string
  VitalSignType: string
  VitalSignLabel: string
}

export interface SOAPResult {
  soap: SOAPNote
  anamesa: any
  generatedAt: Date
  transcriptUsed: string
  sugest_diagnosis?: SuggestedDiagnosis[]
  sugest_procedures?: SuggestedProcedure[]
  sugest_VitalSign?: SuggestedTTV[]
}

// ─── Clinical Pathway Types ───────────────────────────────────────────────────

export type ClinicalPathwayState = 'IDLE' | 'GENERATING' | 'DONE' | 'ERROR'

export interface ClinicalPathwayParams {
  registration_no: string
  diagnosa_id: string
  tipe_kunjungan: string
  is_bpjs: boolean
  age_in_years: number
  target_hari_dokter: number
}

export interface DiagnosisMaster {
  id: string
  name: string
}

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
  errors?: string[]
  warnings?: string[]
  message?: string
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
   * Endpoint Clinical Pathway Generator.
   * Widget akan POST { diagnosis, context } dan expect { pathway: ClinicalPathwayResult }
   * @example 'https://api.rs-nusantara.com/ai/pathway'
   */
  pathwayEndpoint?: string

  /**
   * Endpoint Master Diagnosa untuk Clinical Pathway.
   * Widget akan GET untuk mengambil daftar diagnosa autocompelete.
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
  patientId?: string
  visitId?: string
  doctorId?: string
  departmentId?: string
}
