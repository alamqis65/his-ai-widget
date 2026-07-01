import type { ServiceResponse } from '@/types'
import type { SpeechToSOAPService, SpeechToSOAPResult } from './SpeechToSOAPService'
import { delay } from '@/utils'

const MOCK_DATA: SpeechToSOAPResult[] = [
  {
    soapResult: {
      anamesa: 'testing anamesa',
      soap: {
        Subjective: {
          KeluhanUtama: 'Nyeri dada sejak 2 hari, terasa seperti tertindih, menjalar ke lengan kiri.',
          RiwayatPenyakitSekarang: 'Disertai sesak napas ringan dan keringat dingin.',
          RiwayatPenyakitDahulu: '',
          RiwayatOperasi: '',
          RiwayatPengobatan: '',
          RiwayatAlergi: '',
          RiwayatKeluarga: '',
          RiwayatSosial: '',
          TelaahSistem: '',
          KeteranganTambahan: '',
        },
        Objective: {
          KeadaanUmum: '',
          Kesadaran: '',
          PemeriksaanFisik: ['TD: 140/90 mmHg', 'HR: 98x/mnt', 'RR: 20x/mnt', 'SpO2: 96%'],
          PemeriksaanPenunjang: ['EKG: ST elevasi segmen V1-V4'],
          TemuanKlinis: '',
        },
        Assessment: {
          PertimbanganKlinis: 'STEMI anterior (I21.0)',
        },
        Plan: {
          TerapiObat: ['Aspirin 300mg loading', 'Clopidogrel 300mg loading', 'ISDN sublingual 5mg'],
          Tindakan: ['Rujuk segera ke kardiologi'],
          PemeriksaanPenunjang: [],
          Monitoring: ['Monitor EKG continuous'],
          Konsultasi: [],
          Edukasi: '',
          RencanaKontrol: '',
        },
        Interventions: {
          SudahDilakukan: ['Pemberian aspirin dan clopidogrel', 'ISDN sublingual', 'Rujukan ke kardiologi'],
          Disarankan: [],
        },
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
      sugest_VitalSign: [
        {
          VitalSignID: 1,
          VitalSignName: 'Blood Pressure',
          Value: '120/80',
          ValueUnit: 'mmHg',
          VitalSignType: 'BloodPressure',
          VitalSignLabel: 'Tekanan Darah',
        },
        {
          VitalSignID: 2,
          VitalSignName: 'Heart Rate',
          Value: '78',
          ValueUnit: 'bpm',
          VitalSignType: 'HeartRate',
          VitalSignLabel: 'Nadi',
        },
        {
          VitalSignID: 3,
          VitalSignName: 'Respiratory Rate',
          Value: '18',
          ValueUnit: 'breaths/min',
          VitalSignType: 'RespiratoryRate',
          VitalSignLabel: 'Frekuensi Napas',
        },
        {
          VitalSignID: 4,
          VitalSignName: 'Body Temperature',
          Value: '36.8',
          ValueUnit: '°C',
          VitalSignType: 'Temperature',
          VitalSignLabel: 'Suhu Tubuh',
        },
        {
          VitalSignID: 5,
          VitalSignName: 'Oxygen Saturation',
          Value: '98',
          ValueUnit: '%',
          VitalSignType: 'SpO2',
          VitalSignLabel: 'Saturasi Oksigen',
        },
        {
          VitalSignID: 6,
          VitalSignName: 'Body Weight',
          Value: '70',
          ValueUnit: 'kg',
          VitalSignType: 'Weight',
          VitalSignLabel: 'Berat Badan',
        },
        {
          VitalSignID: 7,
          VitalSignName: 'Body Height',
          Value: '165',
          ValueUnit: 'cm',
          VitalSignType: 'Height',
          VitalSignLabel: 'Tinggi Badan',
        },
      ],
    },
  },
  {
    soapResult: {
      anamesa: 'testing anamesa',
      soap: {
        Subjective: {
          KeluhanUtama: 'Demam tinggi 3 hari, batuk, dan pilek.',
          RiwayatPenyakitSekarang: 'Tidak ada riwayat kejang.',
          RiwayatPenyakitDahulu: '',
          RiwayatOperasi: '',
          RiwayatPengobatan: '',
          RiwayatAlergi: '',
          RiwayatKeluarga: '',
          RiwayatSosial: '',
          TelaahSistem: '',
          KeteranganTambahan: '',
        },
        Objective: {
          KeadaanUmum: '',
          Kesadaran: '',
          PemeriksaanFisik: ['Suhu 38.9°C', 'HR: 102x/mnt', 'Tenggorokan hiperemis', 'Rhonki (-/-)'],
          PemeriksaanPenunjang: [],
          TemuanKlinis: '',
        },
        Assessment: {
          PertimbanganKlinis: 'ISPA (J06.9) — Common cold dengan febris',
        },
        Plan: {
          TerapiObat: ['Paracetamol 10-15 mg/kgBB tiap 6-8 jam bila demam', 'Zinc 20mg/hari'],
          Tindakan: [],
          PemeriksaanPenunjang: [],
          Monitoring: [],
          Konsultasi: [],
          Edukasi: 'Edukasi orang tua',
          RencanaKontrol: 'Kontrol 3 hari',
        },
        Interventions: {
          SudahDilakukan: [],
          Disarankan: [],
        },
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
      sugest_VitalSign: [
        {
          VitalSignID: 1,
          VitalSignName: 'Blood Pressure',
          Value: '120/80',
          ValueUnit: 'mmHg',
          VitalSignType: 'BloodPressure',
          VitalSignLabel: 'Tekanan Darah',
        },
        {
          VitalSignID: 2,
          VitalSignName: 'Heart Rate',
          Value: '78',
          ValueUnit: 'bpm',
          VitalSignType: 'HeartRate',
          VitalSignLabel: 'Nadi',
        },
        {
          VitalSignID: 3,
          VitalSignName: 'Respiratory Rate',
          Value: '18',
          ValueUnit: 'breaths/min',
          VitalSignType: 'RespiratoryRate',
          VitalSignLabel: 'Frekuensi Napas',
        },
        {
          VitalSignID: 4,
          VitalSignName: 'Body Temperature',
          Value: '36.8',
          ValueUnit: '°C',
          VitalSignType: 'Temperature',
          VitalSignLabel: 'Suhu Tubuh',
        },
        {
          VitalSignID: 5,
          VitalSignName: 'Oxygen Saturation',
          Value: '98',
          ValueUnit: '%',
          VitalSignType: 'SpO2',
          VitalSignLabel: 'Saturasi Oksigen',
        },
        {
          VitalSignID: 6,
          VitalSignName: 'Body Weight',
          Value: '70',
          ValueUnit: 'kg',
          VitalSignType: 'Weight',
          VitalSignLabel: 'Berat Badan',
        },
        {
          VitalSignID: 7,
          VitalSignName: 'Body Height',
          Value: '165',
          ValueUnit: 'cm',
          VitalSignType: 'Height',
          VitalSignLabel: 'Tinggi Badan',
        },
      ],
    },
  },
  {
    soapResult: {
      anamesa: 'testing anamesa',
      soap: {
        Subjective: {
          KeluhanUtama: 'Pasien wanita 45 tahun riwayat DM tipe 2 untuk kontrol rutin.',
          RiwayatPenyakitSekarang: 'Keluhan sering haus dan poliuri. GDP terakhir 210 mg/dL.',
          RiwayatPenyakitDahulu: '',
          RiwayatOperasi: '',
          RiwayatPengobatan: '',
          RiwayatAlergi: '',
          RiwayatKeluarga: '',
          RiwayatSosial: '',
          TelaahSistem: '',
          KeteranganTambahan: '',
        },
        Objective: {
          KeadaanUmum: '',
          Kesadaran: '',
          PemeriksaanFisik: ['TD: 130/80 mmHg', 'BB: 68kg', 'BMI: 27.2 kg/m²'],
          PemeriksaanPenunjang: ['GDP hari ini: 210 mg/dL'],
          TemuanKlinis: '',
        },
        Assessment: {
          PertimbanganKlinis: 'Diabetes Melitus Tipe 2 tidak terkontrol (E11.65)',
        },
        Plan: {
          TerapiObat: ['Metformin 500mg 3x1', 'Glimepiride 1mg 1x1 pagi'],
          Tindakan: [],
          PemeriksaanPenunjang: [],
          Monitoring: [],
          Konsultasi: [],
          Edukasi: 'Diet DM 1700 kkal',
          RencanaKontrol: 'Kontrol 1 bulan',
        },
        Interventions: {
          SudahDilakukan: [],
          Disarankan: [],
        },
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
      sugest_VitalSign: [
        {
          VitalSignID: 1,
          VitalSignName: 'Blood Pressure',
          Value: '120/80',
          ValueUnit: 'mmHg',
          VitalSignType: 'BloodPressure',
          VitalSignLabel: 'Tekanan Darah',
        },
        {
          VitalSignID: 2,
          VitalSignName: 'Heart Rate',
          Value: '78',
          ValueUnit: 'bpm',
          VitalSignType: 'HeartRate',
          VitalSignLabel: 'Nadi',
        },
        {
          VitalSignID: 3,
          VitalSignName: 'Respiratory Rate',
          Value: '18',
          ValueUnit: 'breaths/min',
          VitalSignType: 'RespiratoryRate',
          VitalSignLabel: 'Frekuensi Napas',
        },
        {
          VitalSignID: 4,
          VitalSignName: 'Body Temperature',
          Value: '36.8',
          ValueUnit: '°C',
          VitalSignType: 'Temperature',
          VitalSignLabel: 'Suhu Tubuh',
        },
        {
          VitalSignID: 5,
          VitalSignName: 'Oxygen Saturation',
          Value: '98',
          ValueUnit: '%',
          VitalSignType: 'SpO2',
          VitalSignLabel: 'Saturasi Oksigen',
        },
        {
          VitalSignID: 6,
          VitalSignName: 'Body Weight',
          Value: '70',
          ValueUnit: 'kg',
          VitalSignType: 'Weight',
          VitalSignLabel: 'Berat Badan',
        },
        {
          VitalSignID: 7,
          VitalSignName: 'Body Height',
          Value: '165',
          ValueUnit: 'cm',
          VitalSignType: 'Height',
          VitalSignLabel: 'Tinggi Badan',
        },
      ],
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
