import { useCallback, useRef, useState } from 'preact/hooks'
import type {
  LiveRecorderState,
  SDKCallbacks,
  SoapLiveDraft,
  SoapLiveEvent,
  SoapLiveListType,
  SoapLiveStatus,
  SoapRecommendationType,
  SOAPNote,
} from '@/types'
import { getSpeechToSOAPLiveService } from '@/services/registry'
import { generateSOAPLiveSessionId } from '@/services/speech-to-soap-live/SOAPLiveEventListener'
import { delay } from '@/utils'
// BatchSOAPPayload dipakai apa adanya dari fitur Speech to SOAP lama — bentuk
// payload "Simpan ke HIS" sama persis, jadi tidak perlu tipe baru yang mirip.
import type { BatchSOAPPayload } from './useSpeechToSOAP'

// Tiap berapa lama MediaRecorder "membelah" audio jadi satu chunk baru
// (memicu ondataavailable). 2 detik — lebih responsif untuk live update,
// backend menggabungkan transkrip antar-chunk via rolling overlap window.
const CHUNK_TIMESLICE_MS = 2000

// Setelah stopRecording, seberapa lama menunggu event STATUS=DONE dari
// backend sebelum menyerah dan tetap lanjut ke REVIEW (supaya UI tidak
// nyangkut kalau backend lupa/gagal mengirim event ini).
const DONE_WAIT_TIMEOUT_MS = 4000

// Key unik per jenis item live (dipakai applyLiveEvent untuk upsert, dan
// getRecommendation untuk tahu field mana yang jadi ID tiap item hasil
// rekomendasi). Tambahkan satu baris di sini kalau ada jenis item baru.
const LIST_ID_KEYS: Record<SoapLiveListType, string> = {
  VITALSIGN: 'VitalSignName', // name lebih stabil dari ID berbasis index
  DIAGNOSE: 'ICD10',
  PROCEDURE: 'ProcedureID',
  PRESCRIPTION: 'ItemID',
  LABORATORY: 'ItemCode',
}

function createEmptyDraft(): SoapLiveDraft {
  return {
    S: {},
    O: {},
    A: {},
    P: {},
    VITALSIGN: [],
    DIAGNOSE: [],
    PROCEDURE: [],
    PRESCRIPTION: [],
    LABORATORY: [],
    transcript: '',
    anamesa: '',
    status: 'LISTENING',
  }
}

/**
 * applyLiveEvent
 *
 * Fungsi murni: terima draft SOAP saat ini + satu event SSE, kembalikan
 * draft baru. Semua efek dari sebuah event adalah "overwrite/upsert" — versi
 * yang benar selalu datang dari cache di backend (bukan hasil akumulasi di
 * frontend), jadi tidak butuh logic merge yang rumit di sini.
 *
 * - S/O/A/P            -> set/replace draft[type][id] = value
 * - VITALSIGN/DIAGNOSE/PROCEDURE/PRESCRIPTION/LABORATORY
 *                       -> upsert value ke array berdasarkan id (replace kalau
 *                          sudah ada, append kalau belum)
 * - TRANSCRIPT          -> replace teks transkrip
 * - STATUS              -> set status live (LISTENING/DONE/ERROR)
 *
 * Dipakai untuk dua jalur: event SSE (lewat handleEvent di hook ini) dan
 * hasil "Generate Recommendation" (dipanggil manual per item di
 * getRecommendation) — jadi cuma ada satu logic merge untuk keduanya.
 */
export function applyLiveEvent(draft: SoapLiveDraft, event: SoapLiveEvent): SoapLiveDraft {
  switch (event.type) {
    case 'S':
    case 'O':
    case 'A':
    case 'P': {
      if (!event.id) return draft
      return { ...draft, [event.type]: { ...draft[event.type], [event.id]: event.value } }
    }

    case 'VITALSIGN':
    case 'DIAGNOSE':
    case 'PROCEDURE':
    case 'PRESCRIPTION':
    case 'LABORATORY': {
      const idKey = LIST_ID_KEYS[event.type]
      const eventId = event.value?.[idKey]
      const list = draft[event.type] as any[]

      const existingIdx = list.findIndex(item => String(item[idKey]).toLowerCase() === String(eventId).toLowerCase())

      const nextList =
        existingIdx >= 0 ? list.map((item, i) => (i === existingIdx ? event.value : item)) : [...list, event.value]

      return { ...draft, [event.type]: nextList }
    }

    case 'TRANSCRIPT':
      return { ...draft, transcript: event.value }

    case 'ANAMESA':
      return { ...draft, anamesa: event.value }

    case 'STATUS':
      return { ...draft, status: event.value as SoapLiveStatus }

    default:
      // Tipe event tidak dikenal — abaikan saja, jangan sampai bikin crash.
      // Kalau ada tipe baru nanti, tambah satu case lagi di atas.
      return draft
  }
}

function draftToSoapNote(draft: SoapLiveDraft): SOAPNote {
  return { Subjective: draft.S, Objective: draft.O, Assessment: draft.A, Plan: draft.P }
}

function selectSupportedMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
  return candidates.find(type => MediaRecorder.isTypeSupported(type))
}

export interface UseSpeechToSOAPLiveReturn {
  state: LiveRecorderState
  soapDraft: SoapLiveDraft
  error: string | null
  recordingDuration: number
  /** Loading per jenis rekomendasi (bukan loading global), supaya panel lain tetap bisa dipakai selagi satu panel loading. */
  recommendationLoading: Record<SoapRecommendationType, boolean>
  startRecording: () => Promise<void>
  stopRecording: () => void
  getRecommendation: (type: SoapRecommendationType) => Promise<void>
  saveSOAP: (payload: BatchSOAPPayload) => void
  reset: () => void
}

/**
 * useSpeechToSOAPLive
 *
 * Flow: IDLE -> LIVE (rekam + SSE aktif, soapDraft terus update) -> REVIEW
 * (rekaman berhenti, layar sama, tinggal cek & simpan). Tidak ada state
 * PROCESSING_LLM terpisah seperti versi lama — tidak ada jeda "processing"
 * yang berarti karena semuanya sudah live.
 */
export function useSpeechToSOAPLive(callbacks?: Pick<SDKCallbacks, 'onResultSOAP'>): UseSpeechToSOAPLiveReturn {
  const [state, setState] = useState<LiveRecorderState>('IDLE')
  const [soapDraft, setSoapDraft] = useState<SoapLiveDraft>(createEmptyDraft)
  const [error, setError] = useState<string | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recommendationLoading, setRecommendationLoading] = useState<Record<SoapRecommendationType, boolean>>({
    VITALSIGN: false,
    DIAGNOSE: false,
    PRESCRIPTION: false,
    LABORATORY: false,
  })

  // service & sessionId disimpan di ref (bukan state) karena dipakai di
  // dalam callback MediaRecorder/EventSource, bukan buat re-render UI.
  const serviceRef = useRef(getSpeechToSOAPLiveService())
  const sessionIdRef = useRef('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunkIndexRef = useRef(0)
  const timerRef = useRef<number | null>(null)
  // Cermin dari soapDraft.status, supaya stopRecording bisa "menunggu"
  // STATUS=DONE tanpa harus baca state Preact (yang stale di closure lama).
  const statusRef = useRef<SoapLiveStatus>('LISTENING')

  const handleEvent = useCallback((event: SoapLiveEvent) => {
    setSoapDraft(prev => {
      const next = applyLiveEvent(prev, event)
      statusRef.current = next.status
      return next
    })
  }, [])

  const startRecording = useCallback(async () => {
    setError(null)
    setSoapDraft(createEmptyDraft())
    statusRef.current = 'LISTENING'
    chunkIndexRef.current = 0

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false,
      })
      const mimeType = selectSupportedMimeType()
      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const sessionId = generateSOAPLiveSessionId()
      sessionIdRef.current = sessionId

      const service = getSpeechToSOAPLiveService()
      serviceRef.current = service
      service.connect(sessionId, handleEvent)

      // Beda dari fitur SOAP lama: tiap chunk yang tersedia LANGSUNG dikirim
      // ke backend (streaming upload), tidak ditumpuk dulu di memori sampai
      // rekaman selesai. Backend yang bertanggung jawab menggabungkan
      // transkrip antar-chunk di cache-nya sendiri (per session_id) — kita
      // di sini tidak pernah menyusun ulang transkrip.
      mediaRecorder.ondataavailable = e => {
        if (e.data.size === 0) return
        const index = chunkIndexRef.current++
        service.sendChunk(sessionId, e.data, index, false)
      }

      mediaRecorder.start(CHUNK_TIMESLICE_MS)
      setState('LIVE')
      setRecordingDuration(0)
      timerRef.current = window.setInterval(() => setRecordingDuration(d => d + 1), 1000)
    } catch {
      setError('Tidak dapat mengakses mikrofon. Periksa izin browser.')
    }
  }, [handleEvent])

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current
    const service = serviceRef.current
    if (!mediaRecorder || !service) return

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    mediaRecorder.onstop = async () => {
      mediaRecorder.stream.getTracks().forEach(t => t.stop())

      // Chunk terakhir dikirim dengan flag final walau kosong, supaya
      // backend tahu ini titik akhir rekaman dan bisa membereskan sesi ini.
      const finalIndex = chunkIndexRef.current++
      const emptyBlob = new Blob([], { type: mediaRecorder.mimeType || 'audio/webm' })
      await service.sendChunk(sessionIdRef.current, emptyBlob, finalIndex, true)

      // Trigger finalisasi SOAPI di backend secara eksplisit, supaya
      // ekstraksi final tidak bergantung hanya pada flag is_final di chunk.
      await service.finalizeSession(sessionIdRef.current)

      // Tunggu STATUS=DONE (atau timeout) sebelum menutup SSE, supaya
      // event-event terakhir yang masih "menyusul" tidak ikut terpotong.
      const waitStart = Date.now()
      while (statusRef.current !== 'DONE' && Date.now() - waitStart < DONE_WAIT_TIMEOUT_MS) {
        await delay(150)
      }

      service.disconnect()
      setState('REVIEW')
    }

    mediaRecorder.stop()
  }, [])

  const getRecommendation = useCallback(async (type: SoapRecommendationType) => {
    const service = serviceRef.current
    const sessionId = sessionIdRef.current
    if (!sessionId) return

    setRecommendationLoading(prev => ({ ...prev, [type]: true }))
    try {
      const result = await service.getRecommendation(sessionId, type)
      if (result.ok) {
        // Dipakai lewat fungsi upsert yang sama dengan event SSE (satu-satu
        // per item), supaya tidak ada dua logic merge berbeda buat hal yang
        // sama.
        setSoapDraft(prev => {
          let next = prev
          for (const item of result.data) {
            const idKey = LIST_ID_KEYS[type]
            next = applyLiveEvent(next, { type, id: String((item as any)[idKey]), value: item })
          }
          return next
        })
      } else {
        setError(result.error ?? 'Gagal mengambil rekomendasi.')
      }
    } finally {
      setRecommendationLoading(prev => ({ ...prev, [type]: false }))
    }
  }, [])

  const saveSOAP = useCallback(
    (payload: BatchSOAPPayload) => {
      // "Simpan ke HIS": satu callback gabungan, sama seperti fitur SOAP
      // lama — bedanya `soap` di sini disusun dari soapDraft (S/O/A/P live),
      // bukan dari satu response akhir.
      callbacks?.onResultSOAP?.({
        type: 'ALL',
        soap: draftToSoapNote(soapDraft),
        ...payload,
      })
    },
    [soapDraft, callbacks],
  )

  const reset = useCallback(() => {
    serviceRef.current.disconnect()
    mediaRecorderRef.current = null
    sessionIdRef.current = ''
    chunkIndexRef.current = 0
    statusRef.current = 'LISTENING'
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setState('IDLE')
    setSoapDraft(createEmptyDraft())
    setError(null)
    setRecordingDuration(0)
    setRecommendationLoading({ VITALSIGN: false, DIAGNOSE: false, PRESCRIPTION: false, LABORATORY: false })
  }, [])

  return {
    state,
    soapDraft,
    error,
    recordingDuration,
    recommendationLoading,
    startRecording,
    stopRecording,
    getRecommendation,
    saveSOAP,
    reset,
  }
}
