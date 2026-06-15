import type { SOAPResult, ServiceResponse } from '@/types'
import type { SOAPService } from './SOAPService'
import { delay } from '@/utils'

function generateSOAPFromTranscript(transcript: string): SOAPResult {
  const lower = transcript.toLowerCase()

  // Heuristic mock — in production this is done by LLM
  const isCardiac = lower.includes('nyeri dada') || lower.includes('jantung')
  const isPediatric = lower.includes('anak') || lower.includes('demam')
  const isDiabetes = lower.includes('diabetes') || lower.includes('gula darah')

  if (isCardiac) {
    return {
      soap: {
        subjective:
          'Pasien mengeluhkan nyeri dada sejak 2 hari, terasa seperti tertindih, menjalar ke lengan kiri, disertai sesak napas ringan dan keringat dingin.',
        objective:
          'TD: 140/90 mmHg, HR: 98x/mnt, RR: 20x/mnt, SpO2: 96%. Pemeriksaan jantung: S1 S2 reguler, tidak ada murmur. EKG: ST elevasi segmen V1-V4.',
        assessment:
          'STEMI anterior (I21.0) — Perlu evaluasi lebih lanjut untuk menyingkirkan NSTEMI atau unstable angina.',
        plan:
          '1. Loading aspirin 300 mg + clopidogrel 300 mg\n2. ISDN sublingual 5 mg\n3. Rujuk segera ke kardiologi\n4. Pasang IV line + monitor EKG continuous\n5. Informed consent untuk kemungkinan tindakan kateterisasi',
      },
      generatedAt: new Date(),
      transcriptUsed: transcript,
    }
  }

  if (isPediatric) {
    return {
      soap: {
        subjective:
          'Anak 7 tahun, dibawa orang tua dengan keluhan demam tinggi 3 hari, batuk, dan pilek. Tidak ada riwayat kejang.',
        objective:
          'KU: Sakit sedang, kompos mentis. Suhu 38.9°C, HR: 102x/mnt, RR: 22x/mnt. Tenggorokan hiperemis. Tonsil T1/T1. Rhonki (-/-), wheezing (-/-).',
        assessment:
          'ISPA (J06.9) — Common cold dengan febris. Singkirkan faringitis streptokokus.',
        plan:
          '1. Paracetamol 10-15 mg/kgBB tiap 6-8 jam bila demam\n2. Zinc 20 mg/hari selama 10 hari\n3. Edukasi orang tua: kompres hangat, minum cukup\n4. Kontrol 3 hari atau bila gejala memburuk\n5. Rapid strep test bila demam tidak turun',
      },
      generatedAt: new Date(),
      transcriptUsed: transcript,
    }
  }

  if (isDiabetes) {
    return {
      soap: {
        subjective:
          'Pasien wanita 45 tahun dengan riwayat DM tipe 2 untuk kontrol rutin. Keluhan sering haus dan poliuri. GDP terakhir 210 mg/dL.',
        objective:
          'TD: 130/80 mmHg, BB: 68 kg, TB: 158 cm, BMI: 27.2 kg/m². GDP hari ini: 210 mg/dL. Pemeriksaan fisik dalam batas normal.',
        assessment:
          'Diabetes Melitus Tipe 2 tidak terkontrol (E11.65). BMI overweight.',
        plan:
          '1. Lanjutkan Metformin 500 mg 3x1\n2. Tambahkan Glimepiride 1 mg 1x1 pagi\n3. Diet DM 1700 kkal, rendah indeks glikemik\n4. Edukasi self-monitoring gula darah\n5. HbA1c, profil lipid, fungsi ginjal\n6. Kontrol 1 bulan',
      },
      generatedAt: new Date(),
      transcriptUsed: transcript,
    }
  }

  // Generic fallback
  return {
    soap: {
      subjective: `Pasien datang dengan keluhan sesuai anamnesis. ${transcript.slice(0, 100)}...`,
      objective:
        'Tanda vital dalam batas normal. Pemeriksaan fisik lengkap perlu dilakukan.',
      assessment: 'Perlu evaluasi lebih lanjut untuk menentukan diagnosis pasti.',
      plan: '1. Pemeriksaan penunjang sesuai klinis\n2. Terapi simtomatis\n3. Edukasi pasien\n4. Kontrol sesuai perkembangan',
    },
    generatedAt: new Date(),
    transcriptUsed: transcript,
  }
}

/**
 * MockSOAPService — generates dummy SOAP notes for development/demo.
 * Replace with ProductionSOAPService when LLM backend is ready.
 */
export class MockSOAPService implements SOAPService {
  async generate(transcript: string): Promise<ServiceResponse<SOAPResult>> {
    // Simulate LLM processing time
    await delay(2000 + Math.random() * 1500)

    return {
      data: generateSOAPFromTranscript(transcript),
      ok: true,
    }
  }
}
