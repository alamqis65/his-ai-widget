import { useRecorder } from '@/hooks/useRecorder'
import { RecorderView } from '@/components/speech-to-soap/RecorderView'
import { TranscriptReview } from '@/components/speech-to-soap/TranscriptReview'
import { SoapResultView } from '@/components/speech-to-soap/SoapResultView'

const STEPS = ['Mulai','Rekam','Transkrip','Review','SOAP','Selesai'] as const
const STATES = ['IDLE','RECORDING','PROCESSING_STT','REVIEWING','PROCESSING_LLM','DONE'] as const

export function SpeechToSoapFeature() {
  const { state, transcript, soapResult, error, recordingDuration, startRecording, stopRecording, updateTranscript, confirmAndGenerateSOAP, reset } = useRecorder()

  const currentIdx = STATES.indexOf(state as typeof STATES[number])

  const handleSave = () => {
    if (soapResult) {
      window.dispatchEvent(new CustomEvent('his_ai:result', { detail: { type: 'SOAP', data: soapResult } }))
      alert('SOAP disimpan! (Demo — akan terintegrasi via onResult callback)')
    }
  }

  return (
    <div class="sts-layout">
      <div>
        <h2 class="feature-title">Speech to SOAP</h2>
        <p class="feature-subtitle">Rekam percakapan dokter-pasien, sistem generate catatan SOAP otomatis</p>
      </div>

      {/* Progress */}
      <div class="sts-progress">
        {STEPS.map((label, i) => (
          <div key={label} class={`sts-step ${i === currentIdx ? 'sts-step--active' : ''} ${i < currentIdx ? 'sts-step--done' : ''}`}>
            <div class="sts-step-dot">
              {i < currentIdx ? (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              ) : i + 1}
            </div>
            <span class="sts-step-label">{label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div class="feature-error">
          <p>{error}</p>
          <button class="btn btn-secondary btn-sm" onClick={reset}>Coba lagi</button>
        </div>
      )}

      <div class="sts-content">
        {(state === 'IDLE' || state === 'RECORDING' || state === 'PROCESSING_STT') && (
          <RecorderView state={state} duration={recordingDuration} onStart={startRecording} onStop={stopRecording} />
        )}
        {(state === 'REVIEWING' || state === 'PROCESSING_LLM') && (
          <TranscriptReview transcript={transcript} onUpdate={updateTranscript} onConfirm={confirmAndGenerateSOAP} onReset={reset} isProcessing={state === 'PROCESSING_LLM'} />
        )}
        {state === 'DONE' && soapResult && (
          <SoapResultView result={soapResult} onReset={reset} onConfirm={handleSave} />
        )}
      </div>
    </div>
  )
}
