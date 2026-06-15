// ─── Chat Types ──────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

// ─── Speech to SOAP Types ────────────────────────────────────────────────────

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

// ─── Clinical Pathway Types ──────────────────────────────────────────────────

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

// ─── E-Claim Types ───────────────────────────────────────────────────────────

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

// ─── SDK Config Types ────────────────────────────────────────────────────────

export type WidgetTheme = 'light' | 'dark'
export type ActiveFeature = 'chat' | 'speech-to-soap' | 'clinical-pathway' | 'eclaim'

export interface SDKConfig {
  /** Nama dokter / user yang tampil di header widget */
  userName?: string
  /** Theme widget. Default: 'light' */
  theme?: WidgetTheme
  /** Konteks pasien aktif */
  patientId?: string
  visitId?: string
  doctorId?: string
  departmentId?: string
  /**
   * Base URL untuk AI service production.
   * Kalau tidak diisi, widget pakai mock service.
   */
  apiBaseUrl?: string
  /**
   * Callback setelah user konfirmasi hasil (SOAP, pathway, eclaim).
   * Widget memanggil ini dengan data hasilnya.
   */
  onResult?: (type: string, data: unknown) => void
  /** Callback kalau ada error dari widget */
  onError?: (error: Error) => void
}

// ─── Service Types ───────────────────────────────────────────────────────────

export interface ServiceResponse<T> {
  data: T
  ok: boolean
  error?: string
}

// ─── Legacy HIS SDK Types (kept for compatibility) ───────────────────────────
export interface HISAISDKOptions {
  context?: {
    patientId?: string
    visitId?: string
    doctorId?: string
    departmentId?: string
  }
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}
export interface HISContext {
  patientId?: string
  visitId?: string
  doctorId?: string
  departmentId?: string
}
