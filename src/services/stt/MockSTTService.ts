import type { STTResult, ServiceResponse } from '@/types'
import type { STTService } from './STTService'
import { delay } from '@/utils'

const MOCK_TRANSCRIPTS = [
  'Pasien datang dengan keluhan nyeri dada sejak 2 hari yang lalu. Nyeri dirasakan seperti tertindih dan menjalar ke lengan kiri. Pasien juga mengeluhkan sesak napas ringan dan berkeringat dingin.',
  'Anak laki-laki usia 7 tahun dibawa orang tua dengan demam tinggi selama 3 hari. Suhu tubuh 38.9 derajat Celsius. Pasien juga mengalami batuk dan pilek. Tidak ada riwayat kejang sebelumnya.',
  'Pasien wanita 45 tahun dengan riwayat diabetes melitus tipe 2 datang untuk kontrol rutin. Gula darah puasa terakhir 210 mg/dL. Pasien mengaku sering merasa haus dan sering buang air kecil.',
]

/**
 * MockSTTService — returns dummy transcription for development/demo.
 * Replace with ProductionSTTService when STT backend is ready.
 */
export class MockSTTService implements STTService {
  async transcribe(_audioBlob: Blob): Promise<ServiceResponse<STTResult>> {
    // Simulate STT processing time
    await delay(1500 + Math.random() * 1000)

    const transcript =
      MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)]

    return {
      data: {
        transcript,
        confidence: 0.92 + Math.random() * 0.07,
        durationMs: 8000 + Math.random() * 5000,
      },
      ok: true,
    }
  }
}
