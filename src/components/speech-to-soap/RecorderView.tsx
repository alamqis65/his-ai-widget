import type { RecorderState } from '@/types'

interface Props { state: RecorderState; duration: number; onStart: () => void; onStop: () => void }

function fmt(s: number) {
  return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`
}

export function RecorderView({ state, duration, onStart, onStop }: Props) {
  const isRecording = state === 'RECORDING'
  const isProcessing = state === 'PROCESSING_STT'

  return (
    <div class="recorder-view">
      <div class={`recorder-ring ${isRecording ? 'recorder-ring--active' : ''}`}>
        <button
          class={`recorder-btn ${isRecording ? 'recorder-btn--stop' : 'recorder-btn--start'}`}
          onClick={isRecording ? onStop : onStart}
          disabled={isProcessing}
        >
          {isRecording ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="currentColor" stroke-width="2" fill="none"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
              <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" stroke-width="2"/>
            </svg>
          )}
        </button>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center">
        {isProcessing ? (
          <div class="recorder-processing">
            <div class="loading-spinner"/>
            <p class="loading-text">Memproses audio...</p>
          </div>
        ) : isRecording ? (
          <>
            <div class="recorder-duration">{fmt(duration)}</div>
            <p class="recorder-status-text recorder-status-text--rec"><span class="rec-dot"/>Sedang Merekam</p>
            <p class="recorder-hint">Klik tombol untuk berhenti</p>
          </>
        ) : (
          <>
            <p class="recorder-status-text">Siap merekam</p>
            <p class="recorder-hint">Klik tombol mikrofon untuk mulai merekam percakapan dengan pasien</p>
          </>
        )}
      </div>
    </div>
  )
}
