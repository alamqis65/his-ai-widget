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
  audio?: Blob
  sugest_diagnosis?: SuggestedDiagnosis[]
  sugest_procedures?: SuggestedProcedure[]
  sugest_VitalSign?: SuggestedTTV[]
  rekomendasi_resep?: SuggestedPrescription[]
  suggested_labs?: SuggestedLaboratory[]
}

// ─── Speech to SOAP Live Types ─────────────────────────────────────────────────
// Tipe-tipe untuk fitur baru "Speech to SOAP Live" (SOAP yang update live
// selagi masih merekam, lewat SSE terstruktur {type, id, value}). Ditambahkan
// secara aditif di bawah sini — tidak mengubah tipe Speech to SOAP (non-live)
// di atas, keduanya jalan berdampingan.

/** 4 bagian SOAP klasik. `id` pada event section ini adalah key sub-field-nya
 * (mis. "keluhan_utama"), bukan ID sebuah item seperti pada list type. */
export type SoapLiveSectionType = 'S' | 'O' | 'A' | 'P'

/** Tipe event yang isinya list item yang di-upsert berdasarkan `id` (bukan overwrite satu field). */
export type SoapLiveListType = 'VITALSIGN' | 'DIAGNOSE' | 'PROCEDURE' | 'PRESCRIPTION' | 'LABORATORY'

export type SoapLiveEventType = SoapLiveSectionType | SoapLiveListType | 'TRANSCRIPT' | 'STATUS' | 'ANAMESA'

export type SoapLiveStatus = 'LISTENING' | 'DONE' | 'ERROR'

/**
 * Satu event mentah yang dikirim backend lewat SSE (soapLiveEventsEndpoint),
 * format: `data: {"type": ..., "id": ..., "value": ...}`.
 */
export interface SoapLiveEvent {
  type: SoapLiveEventType
  /** Tidak dipakai untuk TRANSCRIPT dan STATUS. */
  id?: string
  value: any
}

/**
 * State SOAP yang terus di-update live dari event SSE (dan dari hasil
 * "Generate Recommendation", lewat fungsi upsert yang sama). Semua field di
 * sini datang dari cache di backend (dikunci per session_id) — frontend
 * tidak pernah menyusun ulang transkrip/SOAP sendiri, hanya menampilkan versi
 * terbaru yang dikirim.
 */
export interface SoapLiveDraft {
  S: Record<string, any>
  O: Record<string, any>
  A: Record<string, any>
  P: Record<string, any>
  VITALSIGN: SuggestedTTV[]
  DIAGNOSE: SuggestedDiagnosis[]
  PROCEDURE: SuggestedProcedure[]
  PRESCRIPTION: SuggestedPrescription[]
  LABORATORY: SuggestedLaboratory[]
  transcript: string
  anamesa: string
  status: SoapLiveStatus
}

/** State machine untuk useSpeechToSOAPLive: IDLE -> LIVE -> REVIEW. */
export type LiveRecorderState = 'IDLE' | 'LIVE' | 'REVIEW'

/** Jenis rekomendasi yang bisa diminta lewat tombol "Generate Recommendation" di tiap panel. */
export type SoapRecommendationType = 'VITALSIGN' | 'DIAGNOSE' | 'PRESCRIPTION' | 'LABORATORY'
