import type { ServiceResponse } from '@/types'
import type { SpeechToSOAPService, SpeechToSOAPResult } from './SpeechToSOAPService'
import { delay } from '@/utils'

const MOCK_DATA: SpeechToSOAPResult[] = [
  {
    soapResult: {
      anamesa: 'testing anamesa',
      soap: {
        Subjective:
          'Pasien mengeluhkan nyeri dada sejak 2 hari, terasa seperti tertindih, menjalar ke lengan kiri, disertai sesak napas ringan dan keringat dingin.',
        Objective: 'TD: 140/90 mmHg, HR: 98x/mnt, RR: 20x/mnt, SpO2: 96%. EKG: ST elevasi segmen V1-V4.',
        Assessment: 'STEMI anterior (I21.0)',
        Plan: '1. Loading aspirin 300mg + clopidogrel 300mg\n2. ISDN sublingual 5mg\n3. Rujuk segera ke kardiologi\n4. Monitor EKG continuous',
        Interventions:
          'Pasien diberikan aspirin dan clopidogrel, serta ISDN sublingual. Rujukan ke kardiologi dilakukan untuk tindakan lebih lanjut.',
      },
      generatedAt: new Date(),
      transcriptUsed:
        'Pasien datang dengan keluhan nyeri dada sejak 2 hari yang lalu. Nyeri dirasakan seperti tertindih dan menjalar ke lengan kiri. Pasien juga mengeluhkan sesak napas ringan dan berkeringat dingin.',
      sugest_diagnosis: [
        { ICD10: 'I21.0', LabelICD10: 'Acute transmural myocardial infarction of anterior wall', IsPrimary: 1 },
        { ICD10: 'I10', LabelICD10: 'Essential (primary) hypertension', IsPrimary: 0 },
        { ICD10: 'R07.4', LabelICD10: 'Chest pain, unspecified', IsPrimary: 0 },
      ],
      sugest_procedures: [
        { ProcedureID: '17.7', ProcedureName: 'Intravenous infusion (17.7)' },
        { ProcedureID: '89.52', ProcedureName: 'Electrocardiogram' },
        { ProcedureID: '93.90', ProcedureName: 'Non-invasive mechanical ventilation' },
      ],
      vitalSigns: {
        NBPs: [3, '130 mmHg'],
        NBPd: [4, '80 mmHg'],
        'HR Pulse': [2, ''],
        RESPIRATION: [5, ''],
        TEMPERATURE: [1, '36.5 °C'],
        SpO2: [30, ''],
        'Pain Index': [34, ''],
        CVP: [46, ''],
        WEIGHT: [8, ''],
        HEIGHT: [9, ''],
        'Early Warning Score': [90, ''],
        'Gula Darah Sewaktu': [100, ''],
        'SOFA Score': [91, ''],
        'GERD Q': [1177, ''],
        'CURB 65': [1176, ''],
        'STRONG KIDS': [110, ''],
        'SKOR BRADEN': [117, ''],
        'SKOR BARTHEL': [118, ''],
        CRT: [86, ''],
      },
    },
  },
  {
    soapResult: {
      anamesa: 'testing anamesa',
      soap: {
        Subjective: 'Anak 7 tahun, demam tinggi 3 hari, batuk, dan pilek. Tidak ada riwayat kejang.',
        Objective: 'Suhu 38.9°C, HR: 102x/mnt. Tenggorokan hiperemis. Rhonki (-/-).',
        Assessment: 'ISPA (J06.9) — Common cold dengan febris',
        Plan: '1. Paracetamol 10-15 mg/kgBB tiap 6-8 jam bila demam\n2. Zinc 20mg/hari\n3. Edukasi orang tua\n4. Kontrol 3 hari',
      },
      generatedAt: new Date(),
      transcriptUsed:
        'Anak laki-laki usia 7 tahun dibawa orang tua dengan demam tinggi selama 3 hari. Suhu tubuh 38.9 derajat Celsius. Pasien juga mengalami batuk dan pilek.',
      sugest_diagnosis: [
        { ICD10: 'J06.9', LabelICD10: 'Acute upper respiratory infection, unspecified', IsPrimary: 1 },
        { ICD10: 'R50.9', LabelICD10: 'Fever, unspecified', IsPrimary: 0 },
      ],
      sugest_procedures: [
        { ProcedureID: '99.21', ProcedureName: 'Injection of antibiotic' },
        { ProcedureID: '93.90', ProcedureName: 'Non-invasive mechanical ventilation' },
      ],
      vitalSigns: {
        NBPs: [3, '130 mmHg'],
        NBPd: [4, '80 mmHg'],
        'HR Pulse': [2, ''],
        RESPIRATION: [5, ''],
        TEMPERATURE: [1, '36.5 °C'],
        SpO2: [30, ''],
        'Pain Index': [34, ''],
        CVP: [46, ''],
        WEIGHT: [8, ''],
        HEIGHT: [9, ''],
        'Early Warning Score': [90, ''],
        'Gula Darah Sewaktu': [100, ''],
        'SOFA Score': [91, ''],
        'GERD Q': [1177, ''],
        'CURB 65': [1176, ''],
        'STRONG KIDS': [110, ''],
        'SKOR BRADEN': [117, ''],
        'SKOR BARTHEL': [118, ''],
        CRT: [86, ''],
      },
    },
  },
  {
    soapResult: {
      anamesa: 'testing anamesa',
      soap: {
        Subjective:
          'Pasien wanita 45 tahun riwayat DM tipe 2 untuk kontrol rutin. Keluhan sering haus dan poliuri. GDP terakhir 210 mg/dL.',
        Objective: 'TD: 130/80 mmHg, BB: 68kg, BMI: 27.2 kg/m². GDP hari ini: 210 mg/dL.',
        Assessment: 'Diabetes Melitus Tipe 2 tidak terkontrol (E11.65)',
        Plan: '1. Lanjutkan Metformin 500mg 3x1\n2. Tambah Glimepiride 1mg 1x1 pagi\n3. Diet DM 1700 kkal\n4. Kontrol 1 bulan',
      },
      generatedAt: new Date(),
      transcriptUsed:
        'Pasien wanita 45 tahun dengan riwayat diabetes melitus tipe 2 datang untuk kontrol rutin. Gula darah puasa terakhir 210 mg/dL.',
      sugest_diagnosis: [
        { ICD10: 'E11.65', LabelICD10: 'Type 2 diabetes mellitus with hyperglycemia', IsPrimary: 1 },
        { ICD10: 'E11.9', LabelICD10: 'Type 2 diabetes mellitus without complications', IsPrimary: 0 },
        { ICD10: 'Z79.84', LabelICD10: 'Long-term (current) use of oral hypoglycemic drugs', IsPrimary: 0 },
      ],
      sugest_procedures: [
        { ProcedureID: '99.17', ProcedureName: 'Injection of insulin' },
        { ProcedureID: '87.59', ProcedureName: 'Other x-ray of abdomen' },
      ],
      vitalSigns: {
        NBPs: [3, '130 mmHg'],
        NBPd: [4, '80 mmHg'],
        'HR Pulse': [2, ''],
        RESPIRATION: [5, ''],
        TEMPERATURE: [1, '36.5 °C'],
        SpO2: [30, ''],
        'Pain Index': [34, ''],
        CVP: [46, ''],
        WEIGHT: [8, ''],
        HEIGHT: [9, ''],
        'Early Warning Score': [90, ''],
        'Gula Darah Sewaktu': [100, ''],
        'SOFA Score': [91, ''],
        'GERD Q': [1177, ''],
        'CURB 65': [1176, ''],
        'STRONG KIDS': [110, ''],
        'SKOR BRADEN': [117, ''],
        'SKOR BARTHEL': [118, ''],
        CRT: [86, ''],
      },
    },
  },
]

/**
 * MockSpeechToSOAPService — dummy data untuk development/demo.
 * Simulasi single API call yang mengembalikan transcript + SOAP sekaligus.
 */
export class MockSpeechToSOAPService implements SpeechToSOAPService {
  async process(_audioBlob: Blob): Promise<ServiceResponse<SpeechToSOAPResult>> {
    await delay(2500 + Math.random() * 1000)

    const mock = MOCK_DATA[Math.floor(Math.random() * MOCK_DATA.length)]
    return {
      data: {
        soapResult: {
          ...mock.soapResult,
          generatedAt: new Date(),
        },
      },
      ok: true,
    }
  }
}
