import type { ClinicalPathwayResult, ServiceResponse } from '@/types'
import type { ClinicalPathwayService } from './ClinicalPathwayService'
import { delay } from '@/utils'

const MOCK_PATHWAYS: Record<string, ClinicalPathwayResult> = {
  typhoid: {
    diagnosis: 'Demam Tifoid',
    totalDays: 7,
    steps: [
      {
        day: 'Hari 1–2',
        activities: ['Rawat inap', 'Tirah baring total', 'Monitor suhu tiap 4 jam'],
        medications: ['Ceftriaxone 2g IV/24 jam', 'Paracetamol 500mg k/p demam', 'Cairan IV RL 1500ml/24 jam'],
        assessments: ['Darah lengkap', 'Widal test', 'SGOT/SGPT', 'Urinalisa'],
      },
      {
        day: 'Hari 3–4',
        activities: ['Evaluasi respons terapi', 'Diet lunak rendah serat', 'Mobilisasi bertahap'],
        medications: ['Lanjutkan Ceftriaxone', 'Zinc 20mg/hari'],
        assessments: ['Evaluasi suhu', 'Kultur darah bila belum turun'],
      },
      {
        day: 'Hari 5–7',
        activities: ['Diet biasa bila toleran', 'Persiapan pulang', 'Edukasi pencegahan'],
        medications: ['Switch Ciprofloxacin 500mg 2x1 bila afebrile 48 jam'],
        assessments: ['Darah lengkap ulang', 'Evaluasi klinis'],
      },
    ],
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
        assessments: ['Foto toraks PA', 'Darah lengkap', 'CRP', 'Kultur sputum'],
      },
      {
        day: 'Hari 2–3',
        activities: ['Evaluasi respons', 'Fisioterapi dada', 'Nebulisasi k/p'],
        medications: ['Lanjutkan antibiotik', 'Bronkodilator k/p'],
        assessments: ['Evaluasi SpO2', 'Suhu tiap 8 jam'],
      },
      {
        day: 'Hari 4–5',
        activities: ['Alih rawat oral', 'Edukasi', 'Rencana kontrol'],
        medications: ['Amoxicillin-Clavulanat 625mg 3x1'],
        assessments: ['Foto toraks ulang', 'Evaluasi klinis'],
      },
    ],
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
        assessments: ['Darah lengkap', 'Kimia darah', 'Penunjang sesuai indikasi'],
      },
      {
        day: 'Hari 2–3',
        activities: ['Evaluasi respons terapi', 'Konsul departemen terkait'],
        medications: ['Sesuaikan berdasarkan hasil lab'],
        assessments: ['Evaluasi berkala'],
      },
      {
        day: 'Hari 4–5',
        activities: ['Persiapan pulang', 'Edukasi pasien', 'Jadwal kontrol'],
        medications: ['Terapi oral lanjutan'],
        assessments: ['Evaluasi final'],
      },
    ],
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
