// ─── Speech to SOAP Types ─────────────────────────────────────────────────────

export type RecorderState =
  | 'IDLE'
  | 'RECORDING'
  | 'PAUSED'
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

/**
 * SOAPProgressEvent
 *
 * Satu "langkah" progres yang dikirim AI service lewat SSE selama proses
 * audio -> SOAP berlangsung (mis. "Mendengarkan audio...", "Mentranskripsi...",
 * "Menyusun rekomendasi...", "Hampir selesai..."). Dipakai buat ngisi loading
 * panel supaya nggak kosong pas nunggu.
 */
export interface SOAPProgressEvent {
  message: string
  step?: string
}

// NOTE: these SOAP sections come back as free-form JSON from the AI service
// and their shape varies per hospital template, so they're `any` for now.
// If you're working on this and want stricter types, check soapiTemplate in
// SDKApiConfig (types/sdk.ts) — that's the template that decides the shape.
export interface SOAPNote {
  Subjective: any
  Objective: any
  Assessment: any
  Plan: any
  Interventions?: any
  Instructions?: any
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

export interface SuggestedPrescription {
  ItemID: string
  ItemName: string
  MedicationRoute: string
  Peringatan: string
}

export interface SOAPResult {
  soap: SOAPNote
  anamesa: any
  generatedAt: Date
  transcriptUsed: string
  sugest_diagnosis?: SuggestedDiagnosis[]
  sugest_procedures?: SuggestedProcedure[]
  sugest_VitalSign?: SuggestedTTV[]
  rekomendasi_resep?: SuggestedPrescription[]
  rekomendasi_penunjang?: any[]
}
