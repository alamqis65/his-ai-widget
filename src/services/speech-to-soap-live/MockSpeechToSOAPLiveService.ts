import type { ServiceResponse, SoapLiveEvent, SoapRecommendationType } from '@/types'
import type { SpeechToSOAPLiveService, SoapRecommendationItem } from './SpeechToSOAPLiveService'
import { delay } from '@/utils'

// Skenario event SSE tiruan untuk demo tanpa backend Live beneran. Diputar
// satu-per-satu dengan jeda acak (lihat playEvents di bawah), meniru cara
// backend asli mendorong update SOAP tiap beberapa detik selagi transkripsi
// berjalan. Perhatikan VITALSIGN untuk VitalSignID=4 muncul dua kali dengan
// value beda — ini sengaja, untuk menunjukkan perilaku upsert (event kedua
// meng-overwrite yang pertama, bukan menambah baris baru).
const MOCK_EVENTS: SoapLiveEvent[] = [
  { type: 'STATUS', value: 'LISTENING' },
  { type: 'S', id: 'keluhan_utama', value: 'batuk berdahak' },
  { type: 'TRANSCRIPT', value: 'Pasien datang dengan keluhan batuk berdahak sejak tiga hari.' },
  { type: 'ANAMESA', value: 'Pasien datang dengan keluhan batuk berdahak sejak tiga hari.' },
  { type: 'S', id: 'riwayat_penyakit_sekarang', value: 'sejak tiga hari, disertai demam ringan' },
  {
    type: 'VITALSIGN',
    id: '4',
    value: {
      VitalSignID: 4,
      VitalSignName: 'Body Temperature',
      Value: '37.8',
      ValueUnit: '°C',
      VitalSignType: 'Temperature',
      VitalSignLabel: 'Suhu Tubuh',
    },
  },
  { type: 'O', id: 'pemeriksaan_fisik', value: 'Suhu 37.8°C, faring hiperemis, suara napas vesikuler.' },
  {
    type: 'TRANSCRIPT',
    value:
      'Pasien datang dengan keluhan batuk berdahak sejak tiga hari, disertai demam ringan. Suhu tubuh 37.8 derajat, tenggorokan tampak merah.',
  },
  {
    type: 'DIAGNOSE',
    id: 'J06.9',
    value: { ICD10: 'J06.9', LabelICD10: 'Acute upper respiratory infection, unspecified', IsPrimary: 1 },
  },
  { type: 'A', id: 'kesan_klinis', value: 'Infeksi saluran pernapasan atas.' },
  {
    type: 'PRESCRIPTION',
    id: '6700',
    value: { ItemID: '6700', ItemName: 'PARACETAMOL 500 MG TAB GEN', MedicationRoute: 'Oral', Peringatan: '' },
  },
  { type: 'P', id: 'obat', value: 'Paracetamol 500 mg 3x1 bila demam.' },
  {
    // Update dari VitalSignID=4 yang sama — harus overwrite baris yang sudah ada.
    type: 'VITALSIGN',
    id: '4',
    value: {
      VitalSignID: 4,
      VitalSignName: 'Body Temperature',
      Value: '37.6',
      ValueUnit: '°C',
      VitalSignType: 'Temperature',
      VitalSignLabel: 'Suhu Tubuh',
    },
  },
  {
    type: 'LABORATORY',
    id: 'HE1001',
    value: {
      ItemCode: 'HE1001',
      NamaPemeriksaan: 'Hitung Darah Lengkap',
      KategoriBesar: 'Pemeriksaan Laboratorium',
      GrupPemeriksaan: 'HEMATOLOGI',
      Peringatan: '',
    },
  },
  { type: 'P', id: 'tindak_lanjut', value: 'Kontrol jika demam menetap lebih dari tiga hari.' },
]

const MOCK_RECOMMENDATIONS: Record<SoapRecommendationType, SoapRecommendationItem[]> = {
  VITALSIGN: [
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
      Value: '82',
      ValueUnit: 'bpm',
      VitalSignType: 'HeartRate',
      VitalSignLabel: 'Nadi',
    },
  ],
  DIAGNOSE: [{ ICD10: 'R05', LabelICD10: 'Cough', IsPrimary: 0 }],
  PRESCRIPTION: [{ ItemID: '3201', ItemName: 'AMBROXOL 30 MG TAB', MedicationRoute: 'Oral', Peringatan: '' }],
  LABORATORY: [
    {
      ItemCode: 'KR0020',
      NamaPemeriksaan: 'Kreatin (darah)',
      KategoriBesar: 'Pemeriksaan Laboratorium',
      GrupPemeriksaan: 'KIMIA DARAH',
      Peringatan: '',
    },
  ],
}

/**
 * MockSpeechToSOAPLiveService — dummy data untuk development/demo, tanpa
 * backend Live beneran. connect() "memutar" MOCK_EVENTS satu-satu dengan
 * jeda; sendChunk() sendiri tidak benar-benar mengirim apa pun (event sudah
 * diputar sendiri oleh connect), tapi tetap memicu STATUS=DONE saat chunk
 * final diterima — supaya perilakunya konsisten dengan Production dari sudut
 * pandang hook (yang sama-sama menunggu STATUS=DONE sebelum menutup SSE).
 */
export class MockSpeechToSOAPLiveService implements SpeechToSOAPLiveService {
  private cancelled = false
  private onEventRef: ((event: SoapLiveEvent) => void) | null = null

  connect(_sessionId: string, onEvent: (event: SoapLiveEvent) => void): void {
    this.cancelled = false
    this.onEventRef = onEvent
    this.playEvents()
  }

  private async playEvents() {
    for (const event of MOCK_EVENTS) {
      if (this.cancelled) return
      await delay(500 + Math.random() * 700)
      if (this.cancelled) return
      this.onEventRef?.(event)
    }
  }

  async sendChunk(_sessionId: string, _chunk: Blob, _index: number, isFinal: boolean): Promise<void> {
    if (!isFinal) return

    // Simulasikan backend menyelesaikan pemrosesan chunk terakhir, lalu
    // kirim STATUS=DONE.
    await delay(800)
    this.onEventRef?.({ type: 'STATUS', value: 'DONE' })
  }

  async getRecommendation(
    _sessionId: string,
    type: SoapRecommendationType,
  ): Promise<ServiceResponse<SoapRecommendationItem[]>> {
    await delay(600 + Math.random() * 400)
    return { data: MOCK_RECOMMENDATIONS[type] ?? [], ok: true }
  }

  // No-op: mock tidak perlu finalisasi karena STATUS=DONE sudah dikirim
  // oleh sendChunk saat isFinal=true.
  async finalizeSession(_sessionId: string): Promise<void> {}

  disconnect(): void {
    this.cancelled = true
  }
}
