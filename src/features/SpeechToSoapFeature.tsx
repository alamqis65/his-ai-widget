import { useSpeechToSOAP } from '@/hooks/useSpeechToSOAP'
import { RecorderView } from '@/components/speech-to-soap/RecorderView'
import { SoapResultView } from '@/components/speech-to-soap/SoapResultView'
import type { SDKCallbacks } from '@/types'

interface Props {
  callbacks?: Pick<SDKCallbacks, 'onResultSOAP'>
}

// Simplified state machine: IDLE → RECORDING → PROCESSING_LLM → DONE
const STEPS = ['Mulai', 'Rekam', 'Proses', 'Selesai'] as const
const STATES = ['IDLE', 'RECORDING', 'PROCESSING_LLM', 'DONE'] as const

export function SpeechToSoapFeature({ callbacks }: Props) {
  const { state, soapResult, error, recordingDuration, startRecording, stopRecording, saveSOAP, reset } =
    useSpeechToSOAP(callbacks)

  const currentIdx = STATES.indexOf(state as (typeof STATES)[number])

  return (
    <div class="sts-layout">
      <div>
        <h2 class="feature-title">Speech to SOAP</h2>
        <p class="feature-subtitle">Rekam percakapan anda, dan MAIA akan menghasilkan SOAPI berdasarkan transkripsi</p>
      </div>

      {/* Progress steps */}
      <div class="sts-progress">
        {STEPS.map((label, i) => (
          <div
            key={label}
            class={`sts-step ${i === currentIdx ? 'sts-step--active' : ''} ${i < currentIdx ? 'sts-step--done' : ''}`}
          >
            <div class="sts-step-dot">
              {i < currentIdx ? (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span class="sts-step-label">{label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div class="feature-error">
          <p>{error}</p>
          <button class="btn btn-secondary btn-sm" onClick={reset}>
            Coba lagi
          </button>
        </div>
      )}

      <div class="sts-content">
        {/* IDLE / RECORDING: tampilkan recorder */}
        {(state === 'IDLE' || state === 'RECORDING') && (
          <RecorderView
            state={state}
            duration={recordingDuration}
            onStart={startRecording}
            onStop={stopRecording}
            onCancel={reset}
          />
        )}

        {/* PROCESSING: loading indicator */}
        {state === 'PROCESSING_LLM' && (
          <div class="feature-loading">
            <div class="loading-spinner" />
            <p class="loading-text">Memproses audio...</p>
            <p class="loading-sub">Transkripsi dan generate SOAP sekaligus</p>
          </div>
        )}

        {/* DONE: tampilkan hasil + transcript */}
        {state === 'DONE' && soapResult && (
          <div class="feature-result">
            <SoapResultView result={soapResult} onReset={reset} onSave={saveSOAP} />
          </div>
        )}
      </div>
    </div>
  )
}
