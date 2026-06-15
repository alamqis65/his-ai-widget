import { useState, useRef, useCallback } from 'preact/hooks'
import type { RecorderState, SOAPResult, SDKCallbacks } from '@/types'
import { getSTTService, getSOAPService } from '@/services/registry'

interface UseRecorderReturn {
  state: RecorderState
  transcript: string
  soapResult: SOAPResult | null
  error: string | null
  recordingDuration: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  updateTranscript: (text: string) => void
  confirmAndGenerateSOAP: () => Promise<void>
  reset: () => void
}

export function useRecorder(callbacks?: Pick<SDKCallbacks, 'onResultSOAP'>): UseRecorderReturn {
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
      setError('Tidak dapat mengakses mikrofon. Periksa izin browser Anda.')
      setState('ERROR')
    }
  }, [])

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current
    if (!mediaRecorder) return

    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }

    setState('PROCESSING_STT')

    mediaRecorder.onstop = async () => {
      mediaRecorder.stream.getTracks().forEach((t) => t.stop())

      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const result = await getSTTService().transcribe(audioBlob)

      if (result.ok) {
        setTranscript(result.data.transcript)
        setState('REVIEWING')
      } else {
        setError(result.error ?? 'Gagal memproses audio.')
        setState('ERROR')
      }
    }

    mediaRecorder.stop()
  }, [])

  const updateTranscript = useCallback((text: string) => setTranscript(text), [])

  const confirmAndGenerateSOAP = useCallback(async () => {
    setState('PROCESSING_LLM')
    setError(null)

    const result = await getSOAPService().generate(transcript)

    if (result.ok) {
      setSoapResult(result.data)
      setState('DONE')
    } else {
      setError(result.error ?? 'Gagal menghasilkan catatan SOAP.')
      setState('ERROR')
    }
  }, [transcript])

  const handleSaveSOAP = useCallback(() => {
    if (!soapResult) return
    callbacks?.onResultSOAP?.(soapResult)
    window.dispatchEvent(new CustomEvent('his_ai:result', {
      detail: { type: 'SOAP', data: soapResult }
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
    state, transcript, soapResult, error, recordingDuration,
    startRecording, stopRecording, updateTranscript,
    confirmAndGenerateSOAP: confirmAndGenerateSOAP,
    reset,
    // expose save handler — feature component akan panggil ini
    ...(soapResult ? { _onSave: handleSaveSOAP } : {}),
  } as UseRecorderReturn & { _onSave?: () => void }
}
