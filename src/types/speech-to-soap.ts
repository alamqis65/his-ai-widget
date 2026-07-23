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
 * audio -> SOAP berlangsung (mis. "Mendengarkan audio...", "Mentranskripsikan...",
 * "Menyusun rekomendasi...", "Hampir selesai..."). Dipakai buat mengisi loading
 * panel supaya tidak kosong saat menunggu .
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
  /** Legacy field name — kept for the "current mode" UI (not shown anywhere yet). */
  Interventions?: any
  /**
   * Native-mode "I" (SOAP**I**). API only ever sends one of `Instructions` /
   * `Interventions`, never both — native mode falls back to `Interventions`
   * when `Instructions` isn't present.
   */
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

export interface SuggestedLaboratory {
  ItemCode: string
  NamaPemeriksaan: string
  KategoriBesar?: string
  GrupPemeriksaan?: string
  Peringatan?: string
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
  suggested_labs?: SuggestedLaboratory[]
}
