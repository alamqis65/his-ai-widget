import { useState, useRef, useCallback } from 'preact/hooks'
import type {
  RecorderState,
  SOAPResult,
  SDKCallbacks,
  SuggestedDiagnosis,
  SuggestedProcedure,
  SuggestedTTV,
} from '@/types'
import { getSpeechToSOAPService } from '@/services/registry'

// Internal keys used purely to track *which checkbox group* an item belongs
// to while the user is selecting things (not sent anywhere as-is). Add a new
// key here when a new checkable field is introduced (e.g. 'PRESCRIPTION').
export type SoapFieldKey = 'VITALSIGN' | 'DIAGNOSE' | 'PROCEDURE' | 'PRESCRIPTION'

// The only thing actually saved to HIS now is the combined batch. There is no
// per-item/per-type callback anymore — checkbox selection + "Simpan ke HIS"
// is the single path in and out.
export type SaveSOAPType = 'ALL'

/**
 * Shape sent to onResultSOAP / dispatched with the 'his_ai:result' event
 * when the user presses "Simpan ke HIS". Only the fields the user actually
 * checked are included.
 *
 * Extend this when a new batch-savable field is added (e.g. sugest_prescription,
 * doctor_instruction) — SoapResultView.handleSaveAll is the only other place
 * that needs to know about it.
 */
export interface BatchSOAPPayload {
  anamesa?: any
  sugest_diagnosis?: SuggestedDiagnosis[]
  sugest_procedures?: SuggestedProcedure[]
  sugest_VitalSign?: SuggestedTTV[]
  [key: string]: any
}

export interface UseSpeechToSOAPReturn {
  state: RecorderState
  soapResult: SOAPResult | null
  error: string | null
  recordingDuration: number
  progressMessage: string | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  cancelRecording: () => void
  saveSOAP: (payload: BatchSOAPPayload) => void
  reset: () => void
}

/**
 * useSpeechToSOAP
 *
 * Flow: IDLE → RECORDING → PROCESSING_LLM → DONE
 *
 * Stop recording langsung trigger single API call yang mengembalikan
 * transcript + SOAP sekaligus. Tidak ada step review manual.
 *
 * State REVIEWING dan PROCESSING_STT dihapus dari flow aktif,
 * tapi masih ada di type RecorderState untuk backward compat.
 */
export function useSpeechToSOAP(callbacks?: Pick<SDKCallbacks, 'onResultSOAP'>): UseSpeechToSOAPReturn {
  const [state, setState] = useState<RecorderState>('IDLE')
  const [soapResult, setSoapResult] = useState<SOAPResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [progressMessage, setProgressMessage] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const startRecording = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.start(250)
      setState('RECORDING')
      setRecordingDuration(0)
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(d => d + 1)
      }, 1000)
    } catch {
      setError('Tidak dapat mengakses mikrofon. Periksa izin browser.')
      setState('ERROR')
    }
  }, [])

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current
    if (!mediaRecorder) return

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Single processing state — transcript + SOAP sekaligus
    setState('PROCESSING_LLM')
    setProgressMessage(null)

    mediaRecorder.onstop = async () => {
      mediaRecorder.stream.getTracks().forEach(t => t.stop())

      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const result = await getSpeechToSOAPService().process(audioBlob, event => {
        setProgressMessage(event.message)
      })

      if (result.ok) {
        setSoapResult(result.data.soapResult)
        setState('DONE')
      } else {
        setError(result.error ?? 'Gagal memproses audio.')
        setState('ERROR')
      }
    }

    mediaRecorder.stop()
  }, [])

  const pauseRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current
    if (!mediaRecorder || mediaRecorder.state !== 'recording') return

    mediaRecorder.pause()
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setState('PAUSED')
  }, [])

  const resumeRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current
    if (!mediaRecorder || mediaRecorder.state !== 'paused') return

    mediaRecorder.resume()
    timerRef.current = window.setInterval(() => {
      setRecordingDuration(d => d + 1)
    }, 1000)
    setState('RECORDING')
  }, [])

  const cancelRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (mediaRecorder) {
      mediaRecorder.ondataavailable = null
      mediaRecorder.onstop = null
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
      }
      mediaRecorder.stream.getTracks().forEach(t => t.stop())
    }

    mediaRecorderRef.current = null
    chunksRef.current = []
    setState('IDLE')
    setRecordingDuration(0)
    setProgressMessage(null)
  }, [])

  const saveSOAP = useCallback(
    (payload: BatchSOAPPayload) => {
      if (!soapResult) return

      // "Simpan ke HIS": one combined callback + one event, carrying only
      // whatever fields the user checked.
      callbacks?.onResultSOAP?.({ type: 'ALL', ...payload })
      window.dispatchEvent(
        new CustomEvent('his_ai:result', {
          detail: { type: 'ALL', data: payload },
        }),
      )
    },
    [soapResult, callbacks],
  )

  const reset = useCallback(() => {
    setState('IDLE')
    setSoapResult(null)
    setError(null)
    setRecordingDuration(0)
    setProgressMessage(null)
    chunksRef.current = []
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return {
    state,
    soapResult,
    error,
    recordingDuration,
    progressMessage,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    saveSOAP,
    reset,
  }
}
