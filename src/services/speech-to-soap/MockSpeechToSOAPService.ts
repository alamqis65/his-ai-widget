import type { ServiceResponse } from '@/types'
import type { SpeechToSOAPService, SpeechToSOAPResult } from './SpeechToSOAPService'
import { delay } from '@/utils'

const MOCK_DATA: SpeechToSOAPResult[] = [
  {
    transcript: 'Pasien datang dengan keluhan nyeri dada sejak 2 hari yang lalu. Nyeri dirasakan seperti tertindih dan menjalar ke lengan kiri. Pasien juga mengeluhkan sesak napas ringan dan berkeringat dingin.',
    soapResult: {
      soap: {
        subjective: 'Pasien mengeluhkan nyeri dada sejak 2 hari, terasa seperti tertindih, menjalar ke lengan kiri, disertai sesak napas ringan dan keringat dingin.',
        objective: 'TD: 140/90 mmHg, HR: 98x/mnt, RR: 20x/mnt, SpO2: 96%. EKG: ST elevasi segmen V1-V4.',
        assessment: 'STEMI anterior (I21.0)',
        plan: '1. Loading aspirin 300mg + clopidogrel 300mg\n2. ISDN sublingual 5mg\n3. Rujuk segera ke kardiologi\n4. Monitor EKG continuous',
      },
      generatedAt: new Date(),
      transcriptUsed: '',
    },
  },
  {
    transcript: 'Anak laki-laki usia 7 tahun dibawa orang tua dengan demam tinggi selama 3 hari. Suhu tubuh 38.9 derajat Celsius. Pasien juga mengalami batuk dan pilek.',
    soapResult: {
      soap: {
        subjective: 'Anak 7 tahun, demam tinggi 3 hari, batuk, dan pilek. Tidak ada riwayat kejang.',
        objective: 'Suhu 38.9°C, HR: 102x/mnt. Tenggorokan hiperemis. Rhonki (-/-).',
        assessment: 'ISPA (J06.9) — Common cold dengan febris',
        plan: '1. Paracetamol 10-15 mg/kgBB tiap 6-8 jam bila demam\n2. Zinc 20mg/hari\n3. Edukasi orang tua\n4. Kontrol 3 hari',
      },
      generatedAt: new Date(),
      transcriptUsed: '',
    },
  },
  {
    transcript: 'Pasien wanita 45 tahun dengan riwayat diabetes melitus tipe 2 datang untuk kontrol rutin. Gula darah puasa terakhir 210 mg/dL.',
    soapResult: {
      soap: {
        subjective: 'Pasien wanita 45 tahun riwayat DM tipe 2 untuk kontrol rutin. Keluhan sering haus dan poliuri. GDP terakhir 210 mg/dL.',
        objective: 'TD: 130/80 mmHg, BB: 68kg, BMI: 27.2 kg/m². GDP hari ini: 210 mg/dL.',
        assessment: 'Diabetes Melitus Tipe 2 tidak terkontrol (E11.65)',
        plan: '1. Lanjutkan Metformin 500mg 3x1\n2. Tambah Glimepiride 1mg 1x1 pagi\n3. Diet DM 1700 kkal\n4. Kontrol 1 bulan',
      },
      generatedAt: new Date(),
      transcriptUsed: '',
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
        transcript: mock.transcript,
        soapResult: {
          ...mock.soapResult,
          generatedAt: new Date(),
          transcriptUsed: mock.transcript,
        },
      },
      ok: true,
    }
  }
}
