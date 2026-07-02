import type { ClinicalPathwayResult, ServiceResponse, AssessmentItem } from '@/types'
import type { ClinicalPathwayService } from './ClinicalPathwayService'
import { delay } from '@/utils'

/** Helper to create AssessmentItem quickly */
const lab = (name: string): AssessmentItem => ({ name, category: 'LABORATORIUM' })
const klinis = (name: string): AssessmentItem => ({ name, category: 'PEMERIKSAAN KLINIS' })
const radiologi = (name: string): AssessmentItem => ({ name, category: 'RADIOLOGI' })

const MOCK_PATHWAYS: Record<string, ClinicalPathwayResult> = {
  typhoid: {
    diagnosis: 'Demam Tifoid',
    totalDays: 7,
    steps: [
      {
        day: 'Hari 1–2',
        activities: ['Rawat inap', 'Tirah baring total', 'Monitor suhu tiap 4 jam'],
        medications: ['Ceftriaxone 2g IV/24 jam', 'Paracetamol 500mg k/p demam', 'Cairan IV RL 1500ml/24 jam'],
        assessments: [lab('Darah lengkap'), lab('Widal test'), lab('SGOT/SGPT'), klinis('Urinalisa')],
      },
      {
        day: 'Hari 3–4',
        activities: ['Evaluasi respons terapi', 'Diet lunak rendah serat', 'Mobilisasi bertahap'],
        medications: ['Lanjutkan Ceftriaxone', 'Zinc 20mg/hari'],
        assessments: [klinis('Evaluasi suhu'), lab('Kultur darah bila belum turun')],
      },
      {
        day: 'Hari 5–7',
        activities: ['Diet biasa bila toleran', 'Persiapan pulang', 'Edukasi pencegahan'],
        medications: ['Switch Ciprofloxacin 500mg 2x1 bila afebrile 48 jam'],
        assessments: [lab('Darah lengkap ulang'), klinis('Evaluasi klinis')],
      },
    ],
    metadata: {
      statusZona: 'ZONA_HIJAU',
      tipeKunjungan: 'Rawat Inap',
      durasiFinal: 7,
      notifikasi: null,
    },
    followUp: {
      rekomendasi: 'Kontrol ke Poli Penyakit Dalam 7 hari pasca pulang untuk evaluasi klinis.',
      pemeriksaanLanjut: ['Darah Lengkap', 'Widal test'],
    },
    generatedAt: new Date(),
  },
  pneumonia: {
    diagnosis: 'Pneumonia Komunitas (CAP)',
    totalDays: 5,
    steps: [
      {
        day: 'Hari 1',
        activities: ['Rawat inap', 'Oksigenasi target SpO2 ≥95%', 'Posisi semi-Fowler'],
        medications: ['Ampicillin-Sulbactam 1.5g IV/6 jam', 'N-acetylcysteine 200mg 3x1'],
        assessments: [radiologi('Foto toraks PA'), lab('Darah lengkap'), lab('CRP'), lab('Kultur sputum')],
      },
      {
        day: 'Hari 2–3',
        activities: ['Evaluasi respons', 'Fisioterapi dada', 'Nebulisasi k/p'],
        medications: ['Lanjutkan antibiotik', 'Bronkodilator k/p'],
        assessments: [klinis('Evaluasi SpO2'), klinis('Suhu tiap 8 jam')],
      },
      {
        day: 'Hari 4–5',
        activities: ['Alih rawat oral', 'Edukasi', 'Rencana kontrol'],
        medications: ['Amoxicillin-Clavulanat 625mg 3x1'],
        assessments: [radiologi('Foto toraks ulang'), klinis('Evaluasi klinis')],
      },
    ],
    metadata: {
      statusZona: 'ZONA_KUNING',
      tipeKunjungan: 'Rawat Inap',
      durasiFinal: 5,
      notifikasi: {
        tipeAlert: 'warning',
        pesan: 'Rencana 5 hari disetujui. Standar rata-rata historis (P90) adalah 3 hari. Hari ekstra dialokasikan untuk observasi.',
      },
    },
    followUp: {
      rekomendasi: 'Kontrol ke Poli Paru 5 hari pasca pulang. Foto toraks ulang.',
      pemeriksaanLanjut: ['Foto Toraks', 'CRP'],
    },
    generatedAt: new Date(),
  },
}

function getPathway(diagnosis: string): ClinicalPathwayResult {
  const lower = diagnosis.toLowerCase()
  if (lower.includes('tifoid') || lower.includes('typhoid'))
    return { ...MOCK_PATHWAYS.typhoid, generatedAt: new Date() }
  if (lower.includes('pneumonia') || lower.includes('paru'))
    return { ...MOCK_PATHWAYS.pneumonia, generatedAt: new Date() }
  return {
    diagnosis,
    totalDays: 5,
    steps: [
      {
        day: 'Hari 1',
        activities: ['Rawat inap', 'Anamnesis lengkap', 'Pemeriksaan fisik komprehensif'],
        medications: ['Terapi simtomatis sesuai klinis'],
        assessments: [lab('Darah lengkap'), lab('Kimia darah'), klinis('Penunjang sesuai indikasi')],
      },
      {
        day: 'Hari 2–3',
        activities: ['Evaluasi respons terapi', 'Konsul departemen terkait'],
        medications: ['Sesuaikan berdasarkan hasil lab'],
        assessments: [klinis('Evaluasi berkala')],
      },
      {
        day: 'Hari 4–5',
        activities: ['Persiapan pulang', 'Edukasi pasien', 'Jadwal kontrol'],
        medications: ['Terapi oral lanjutan'],
        assessments: [klinis('Evaluasi final')],
      },
    ],
    metadata: {
      statusZona: 'ZONA_HIJAU',
      tipeKunjungan: 'Rawat Inap',
      durasiFinal: 5,
      notifikasi: null,
    },
    generatedAt: new Date(),
  }
}

/**
 * MockClinicalPathwayService — returns dummy pathway for development/demo.
 * Replace with ProductionClinicalPathwayService when LLM backend is ready.
 */
export class MockClinicalPathwayService implements ClinicalPathwayService {
  async generate(params: import('@/types').ClinicalPathwayParams): Promise<ServiceResponse<ClinicalPathwayResult>> {
    await delay(2000 + Math.random() * 1000)
    return { data: getPathway(params.diagnosa_id), ok: true }
  }

  async getMasterDiagnoses(): Promise<ServiceResponse<import('@/types').DiagnosisMaster[]>> {
    await delay(500)
    return {
      data: [
        { id: 'A09', name: 'Gastroenteritis (Mock)' },
        { id: 'J06', name: 'ISPA (Mock)' },
        { id: 'I10', name: 'Hipertensi (Mock)' },
      ],
      ok: true,
    }
  }
}
