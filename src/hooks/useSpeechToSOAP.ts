import { useState, useRef, useCallback } from 'preact/hooks'
import type { RecorderState, SOAPResult, SDKCallbacks } from '@/types'
import { getSpeechToSOAPService } from '@/services/registry'

export interface UseSpeechToSOAPReturn {
  state: RecorderState
  transcript: string
  soapResult: SOAPResult | null
  error: string | null
  recordingDuration: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  saveSOAP: () => void
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
export function useSpeechToSOAP(
  callbacks?: Pick<SDKCallbacks, 'onResultSOAP'>
): UseSpeechToSOAPReturn {
  const [state, setState] = useState<RecorderState>('IDLE')
  const [transcript, setTranscript] = useState('')
  const [soapResult, setSoapResult] = useState<SOAPResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)

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

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.start(250)
      setState('RECORDING')
      setRecordingDuration(0)
      timerRef.current = window.setInterval(() => {
        setRecordingDuration((d) => d + 1)
      }, 1000)
    } catch {
      setError('Tidak dapat mengakses mikrofon. Periksa izin browser.')
      setState('ERROR')
    }
  }, [])

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current
    if (!mediaRecorder) return

    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }

    // Single processing state — transcript + SOAP sekaligus
    setState('PROCESSING_LLM')

    mediaRecorder.onstop = async () => {
      mediaRecorder.stream.getTracks().forEach((t) => t.stop())

      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const result = await getSpeechToSOAPService().process(audioBlob)

      if (result.ok) {
        setTranscript(result.data.transcript)
        setSoapResult(result.data.soapResult)
        setState('DONE')
      } else {
        setError(result.error ?? 'Gagal memproses audio.')
        setState('ERROR')
      }
    }

    mediaRecorder.stop()
  }, [])

  const saveSOAP = useCallback(() => {
    if (!soapResult) return
    callbacks?.onResultSOAP?.(soapResult)
    window.dispatchEvent(new CustomEvent('his_ai:result', {
      detail: { type: 'SOAP', data: soapResult },
    }))
  }, [soapResult, callbacks])

  const reset = useCallback(() => {
    setState('IDLE')
    setTranscript('')
    setSoapResult(null)
    setError(null)
    setRecordingDuration(0)
    chunksRef.current = []
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  return {
    state,
    transcript,
    soapResult,
    error,
    recordingDuration,
    startRecording,
    stopRecording,
    saveSOAP,
    reset,
  }
}
