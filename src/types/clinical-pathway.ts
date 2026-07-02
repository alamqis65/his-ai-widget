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

export interface AssessmentItem {
  name: string
  category: string // 'LABORATORIUM' | 'PEMERIKSAAN KLINIS' | 'RADIOLOGI' | 'REHABILITASI'
}

export interface PathwayStep {
  day: string
  activities: string[]
  medications?: string[]
  assessments?: AssessmentItem[]
}

export interface PathwayMetadata {
  statusZona: string // 'ZONA_HIJAU' | 'ZONA_KUNING' | 'ZONA_MERAH'
  tipeKunjungan: string
  durasiFinal: number
  notifikasi?: { tipeAlert: string; pesan: string } | null
}

export interface PathwayFollowUp {
  rekomendasi: string
  pemeriksaanLanjut: string[]
}

export interface ClinicalPathwayResult {
  diagnosis: string
  totalDays: number
  steps: PathwayStep[]
  metadata: PathwayMetadata
  followUp?: PathwayFollowUp
  generatedAt: Date
}
