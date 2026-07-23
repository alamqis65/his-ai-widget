import type { ServiceResponse, SOAPProgressEvent } from '@/types'
import type { SpeechToSOAPService, SpeechToSOAPResult } from './SpeechToSOAPService'
import { delay } from '@/utils'

// Simulasi pesan progres SSE buat mode dev/demo (tidak ada backend beneran
// yang ngirim event, jadi kita "putar" pesan-pesan ini sendiri dengan jeda).
const MOCK_PROGRESS_STEPS: SOAPProgressEvent[] = [
  { message: 'Mendengarkan audio...', step: 'LISTEN' },
  { message: 'Mentranskripsi percakapan...', step: 'TRANSCRIBE' },
  { message: 'Menyusun rekomendasi diagnosa & tindakan...', step: 'RECOMMEND' },
  { message: 'Hampir selesai...', step: 'FINALIZE' },
]

const MOCK_DATA: SpeechToSOAPResult[] = [
  {
    soapResult: {
      anamesa:
        'Pasien laki-laki 25 tahun datang dengan keluhan batuk berdahak, pilek, dan demam ringan sejak tiga hari.',
      soap: {
        Subjective: {
          keluhan_utama: 'batuk berdahak',
          riwayat_penyakit_sekarang: 'sejak tiga hari',
          gejala_lain: 'pilek, demam ringan',
        },
        Objective: {
          pemeriksaan_fisik: 'Suhu 37.8°C, faring hiperemis, suara napas vesikuler, ronki tidak terdengar.',
          hasil_lab: '',
        },
        Assessment: {
          kesan_klinis: 'Infeksi saluran pernapasan atas.',
        },
        Plan: {
          obat: 'Paracetamol 500 mg dan Ambroxol 30 mg.',
          terapi: 'Istirahat cukup dan banyak minum air.',
          tindak_lanjut: 'Kontrol jika demam menetap lebih dari tiga hari.',
        },
        Interventions: {
          tindakan: 'Edukasi etika batuk dan penggunaan masker.',
          kondisi_darurat: 'Segera ke IGD bila sesak napas atau demam tinggi.',
        },
      },
      sugest_diagnosis: [
        {
          ICD10: 'J06.9',
          LabelICD10: 'Acute upper respiratory infection, unspecified',
          IsPrimary: 1,
        },
        {
          ICD10: 'K29.9',
          LabelICD10: 'hernia',
          IsPrimary: 1,
        },
        {
          ICD10: 'K29.10',
          LabelICD10: 'typus',
          IsPrimary: 1,
        },
      ],
      sugest_procedures: [
        {
          ProcedureID: '89.03',
          ProcedureName: 'Physical examination',
        },
      ],
      rekomendasi_resep: [
        {
          ItemID: '6700',
          ItemName: 'PARACETAMOL 500 MG TAB GEN',
          MedicationRoute: 'Oral',
          Peringatan: '',
        },
        {
          ItemID: '3201',
          ItemName: 'AMBROXOL 30 MG TAB',
          MedicationRoute: 'Oral',
          Peringatan: '',
        },
      ],
      suggested_labs: [
        {
          ItemCode: 'HE1001',
          NamaPemeriksaan: 'Hitung Darah Lengkap',
          KategoriBesar: 'Pemeriksaan Laboratorium',
          GrupPemeriksaan: 'HEMATOLOGI',
          Peringatan: '',
        },
        {
          ItemCode: 'KR0020',
          NamaPemeriksaan: 'Kreatin (darah)',
          KategoriBesar: 'Pemeriksaan Laboratorium',
          GrupPemeriksaan: 'KIMIA DARAH',
          Peringatan: '',
        },
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
      ],
      transcriptUsed:
        '[ASSESSMENT KLINIS MANUAL]: Pasien mengeluh batuk berdahak sejak tiga hari disertai pilek dan demam ringan. Pemeriksaan fisik mendukung ISPA tanpa tanda pneumonia.',
      generatedAt: new Date(),
    },
  },
  {
    soapResult: {
      anamesa: 'Pasien perempuan 29 tahun mengeluh nyeri ulu hati sejak dua hari, terutama setelah terlambat makan.',
      soap: {
        Subjective: {
          keluhan_utama: 'nyeri ulu hati',
          riwayat_penyakit_sekarang: 'sejak dua hari',
          gejala_lain: 'mual, perut terasa perih',
        },
        Objective: {
          pemeriksaan_fisik: 'Tekanan darah 118/76 mmHg, abdomen lunak, nyeri tekan epigastrium.',
          hasil_lab: '',
        },
        Assessment: {
          kesan_klinis: 'Gastritis akut.',
        },
        Plan: {
          obat: 'Omeprazole 20 mg dan Antasida.',
          terapi: 'Diet lunak dan makan teratur.',
          tindak_lanjut: 'Kontrol satu minggu bila keluhan belum membaik.',
        },
        Instructions: {
          tindakan: 'Edukasi menghindari makanan pedas, kopi, dan alkohol.',
          kondisi_darurat: 'Segera ke IGD bila muntah darah atau BAB hitam.',
        },
      },
      sugest_diagnosis: [
        {
          ICD10: 'K29.7',
          LabelICD10: 'Gastritis, unspecified',
          IsPrimary: 1,
        },
        {
          ICD10: 'K29.9',
          LabelICD10: 'tes2',
          IsPrimary: 1,
        },
        {
          ICD10: 'K29.10',
          LabelICD10: 'tes3',
          IsPrimary: 1,
        },
      ],
      sugest_procedures: [
        {
          ProcedureID: '89.03',
          ProcedureName: 'Physical examination',
        },
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
      rekomendasi_resep: [
        {
          ItemID: '4413',
          ItemName: 'ESOMEPRAZOLE 40MG INJ',
          MedicationRoute: 'Parenteral',
          Peringatan: '',
        },
        {
          ItemID: '5100',
          ItemName: 'ANTASIDA DOEN TAB',
          MedicationRoute: 'Oral',
          Peringatan: '',
        },
      ],
      suggested_labs: [
        {
          ItemCode: 'GL0001',
          NamaPemeriksaan: 'Darah Lengkap',
          KategoriBesar: 'Pemeriksaan Laboratorium',
          GrupPemeriksaan: 'HEMATOLOGI',
          Peringatan: '',
        },
        {
          ItemCode: 'UR0003',
          NamaPemeriksaan: 'Ureum',
          KategoriBesar: 'Pemeriksaan Laboratorium',
          GrupPemeriksaan: 'KIMIA DARAH',
          Peringatan: '',
        },
      ],
      transcriptUsed:
        '[ASSESSMENT KLINIS MANUAL]: Pasien mengeluh nyeri ulu hati setelah sering terlambat makan. Pemeriksaan mengarah ke gastritis akut.',
      generatedAt: new Date(),
    },
  },
  {
    soapResult: {
      anamesa: 'Pasien laki-laki 56 tahun datang untuk kontrol tekanan darah tinggi dengan keluhan pusing ringan.',
      soap: {
        Subjective: {
          keluhan_utama: 'pusing',
          riwayat_penyakit_sekarang: 'sejak satu minggu',
          gejala_lain: 'tidak ada nyeri dada atau sesak napas',
        },
        Objective: {
          pemeriksaan_fisik: 'Tekanan darah 165/100 mmHg, nadi 82 x/menit, suhu normal.',
          hasil_lab: '',
        },
        Assessment: {
          kesan_klinis: 'Hipertensi tidak terkontrol.',
        },
        Plan: {
          obat: 'Amlodipine 5 mg sekali sehari.',
          terapi: 'Modifikasi gaya hidup dan diet rendah garam.',
          tindak_lanjut: 'Kontrol dua minggu.',
        },
        Interventions: {
          tindakan: 'Edukasi pentingnya kepatuhan minum obat dan olahraga rutin.',
          kondisi_darurat: 'Segera ke IGD bila muncul nyeri dada, sesak napas, atau kelemahan anggota gerak.',
        },
      },
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
      sugest_diagnosis: [
        {
          ICD10: 'I10',
          LabelICD10: 'Essential (primary) hypertension',
          IsPrimary: 1,
        },
        {
          ICD10: 'K29.9',
          LabelICD10: 'tes10',
          IsPrimary: 1,
        },
        {
          ICD10: 'K29.10',
          LabelICD10: 'tes11',
          IsPrimary: 1,
        },
      ],
      sugest_procedures: [
        {
          ProcedureID: '89.03',
          ProcedureName: 'Blood pressure measurement',
        },
      ],
      rekomendasi_resep: [
        {
          ItemID: '7801',
          ItemName: 'AMLODIPINE 5 MG TAB',
          MedicationRoute: 'Oral',
          Peringatan: '',
        },
      ],
      suggested_labs: [
        {
          ItemCode: 'GL0064',
          NamaPemeriksaan: 'Glukosa Darah Puasa (Vena)',
          KategoriBesar: 'Pemeriksaan Laboratorium',
          GrupPemeriksaan: 'KIMIA DARAH',
          Peringatan: '',
        },
        {
          ItemCode: 'CH1094',
          NamaPemeriksaan: 'Cholesterol Beta (LDL) Direk',
          KategoriBesar: 'Pemeriksaan Laboratorium',
          GrupPemeriksaan: 'KIMIA DARAH',
          Peringatan: '',
        },
        {
          ItemCode: 'TR1034',
          NamaPemeriksaan: 'Trigliserida',
          KategoriBesar: 'Pemeriksaan Laboratorium',
          GrupPemeriksaan: 'KIMIA DARAH',
          Peringatan: '',
        },
      ],
      transcriptUsed:
        '[ASSESSMENT KLINIS MANUAL]: Pasien kontrol hipertensi dengan tekanan darah 165/100 mmHg. Tidak terdapat keluhan nyeri dada maupun sesak. Disarankan melanjutkan terapi antihipertensi dan modifikasi gaya hidup.',
      generatedAt: new Date(),
    },
  },
]

/**
 * MockSpeechToSOAPService — dummy data untuk development/demo.
 * Simulasi single API call yang mengembalikan transcript + SOAP sekaligus.
 */
export class MockSpeechToSOAPService implements SpeechToSOAPService {
  async process(
    _audioBlob: Blob,
    onProgress?: (event: SOAPProgressEvent) => void,
  ): Promise<ServiceResponse<SpeechToSOAPResult>> {
    const totalDelay = 2500 + Math.random() * 1000
    const stepDelay = totalDelay / MOCK_PROGRESS_STEPS.length

    for (const step of MOCK_PROGRESS_STEPS) {
      onProgress?.(step)
      await delay(stepDelay)
    }

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
