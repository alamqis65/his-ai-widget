// ─── Clinical Pathway Types ───────────────────────────────────────────────────

export type ClinicalPathwayState = 'IDLE' | 'GENERATING' | 'DONE' | 'ERROR'

export interface ClinicalPathwayParams {
  diagnosa_id?: string
  tipe_kunjungan?: string
  is_bpjs?: boolean
  age_in_years?: number
  target_hari_dokter?: number
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
