import { useRef, useState } from 'preact/hooks'
import type { RecorderState } from '@/types'
import { RecorderVisualizer } from '../common/WaveRecordView'

interface Props {
  state: RecorderState
  duration: number
  onStart: () => void
  onStop: () => void
  onPause: () => void
  onResume: () => void
  onCancel: () => void
  canUploadAudio?: boolean
  canUseUserPrompt?: boolean
  onUploadAudio?: (file: File) => void
  onSubmitTextPrompt?: (text: string) => void
}

function fmt(s: number) {
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

export function RecorderView({
  state,
  duration,
  onStart,
  onStop,
  onPause,
  onResume,
  onCancel,
  canUploadAudio,
  canUseUserPrompt,
  onUploadAudio,
  onSubmitTextPrompt,
}: Props) {
  const isRecording = state === 'RECORDING'
  const isPaused = state === 'PAUSED'
  const isActive = isRecording || isPaused
  const isProcessing = state === 'PROCESSING_STT'
  const isIdle = state === 'IDLE'

  // Konfirmasi pembatalan rekaman: audio dijeda selama dialog terbuka dan
  // menunggu keputusan user (batalkan atau lanjutkan merekam).
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Input alternatif: upload file audio.
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) onUploadAudio?.(file)
    target.value = '' // reset supaya file yang sama bisa dipilih lagi
  }

  // Input alternatif: tulis teks/catatan sebagai pengganti audio.
  const [showTextPrompt, setShowTextPrompt] = useState(false)
  const [textPromptValue, setTextPromptValue] = useState('')
  const handleSubmitTextPrompt = () => {
    const trimmed = textPromptValue.trim()
    if (!trimmed) return
    onSubmitTextPrompt?.(trimmed)
    setShowTextPrompt(false)
    setTextPromptValue('')
  }
  const handleCloseTextPrompt = () => {
    setShowTextPrompt(false)
    setTextPromptValue('')
  }

  const handleCancelClick = () => {
    if (isRecording) onPause()
    setShowCancelConfirm(true)
  }

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false)
    onCancel()
  }

  const handleDismissCancel = () => {
    setShowCancelConfirm(false)
    if (isPaused) onResume()
  }

  return (
    <div class="recorder-view">
      {isActive && <RecorderVisualizer isRecording={isRecording} />}

      {isActive ? (
        <div class="recorder-controls-row">
          <div class="recorder-control">
            <button
              type="button"
              class="recorder-btn-side recorder-btn-side--cancel"
              onClick={handleCancelClick}
              aria-label="Batalkan rekaman"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
            <span class="recorder-control-label">Batalkan</span>
          </div>

          <div class="recorder-control recorder-control--main">
            <div
              class={`recorder-ring ${isRecording ? 'recorder-ring--active' : ''} ${isPaused ? 'recorder-ring--paused' : ''}`}
            >
              <button
                class="recorder-btn recorder-btn--stop"
                onClick={onStop}
                disabled={isProcessing}
                aria-label="Berhenti merekam"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            </div>
            <span class="recorder-control-label">Berhenti</span>
          </div>

          <div class="recorder-control">
            <button
              type="button"
              class="recorder-btn-side recorder-btn-side--pause"
              onClick={isPaused ? onResume : onPause}
              aria-label={isPaused ? 'Lanjutkan rekaman' : 'Jeda rekaman'}
            >
              {isPaused ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              )}
            </button>
            <span class="recorder-control-label">{isPaused ? 'Lanjutkan' : 'Jeda'}</span>
          </div>
        </div>
      ) : (
        <div class="recorder-ring">
          <button
            class="recorder-btn recorder-btn--start"
            onClick={onStart}
            disabled={isProcessing}
            aria-label="Mulai merekam"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="currentColor" stroke-width="2" fill="none" />
              <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" stroke-width="2" />
              <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
        </div>
      )}

      {/* Input alternatif: upload audio / tulis teks — hanya tampil saat IDLE,
          dan hanya kalau diaktifkan lewat init (canUploadAudioSoap / isAbleUserPromptSoap) */}
      {isIdle && (canUploadAudio || canUseUserPrompt) && (
        <div class="recorder-alt-row">
          {canUploadAudio && (
            <>
              <button
                type="button"
                class="btn btn-secondary btn-sm recorder-alt-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Suara
              </button>
              <input ref={fileInputRef} type="file" accept="audio/*" style="display:none" onChange={handleFileChange} />
            </>
          )}
          {canUseUserPrompt && (
            <button
              type="button"
              class="btn btn-secondary btn-sm recorder-alt-btn"
              onClick={() => setShowTextPrompt(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 20h4l10.5-10.5a2.1 2.1 0 00-3-3L5 17v3z" />
                <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
              </svg>
              Tulis Teks
            </button>
          )}
        </div>
      )}

      <div style="display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center">
        {isProcessing ? (
          <div class="recorder-processing">
            <div class="loading-spinner" />
            <p class="loading-text">Memproses audio...</p>
          </div>
        ) : isActive ? (
          <>
            <div class="recorder-duration">{fmt(duration)}</div>
            {isPaused ? (
              <p class="recorder-status-text recorder-status-text--paused">
                <span class="pause-dot" />
                Dijeda
              </p>
            ) : (
              <p class="recorder-status-text recorder-status-text--rec">
                <span class="rec-dot" />
                Sedang Merekam
              </p>
            )}
          </>
        ) : (
          <>
            <p class="recorder-status-text">Siap merekam</p>
            <p class="recorder-hint">Klik tombol mikrofon untuk mulai merekam percakapan dengan pasien</p>
          </>
        )}
      </div>

      {showTextPrompt && (
        <div class="confirm-overlay" role="dialog" aria-modal="true">
          <div class="confirm-dialog confirm-dialog--wide">
            <p class="confirm-dialog-title">Tulis Teks</p>
            <p class="confirm-dialog-body">Masukkan catatan atau percakapan pasien sebagai pengganti rekaman suara.</p>
            <textarea
              class="recorder-textarea"
              rows={6}
              value={textPromptValue}
              onInput={e => setTextPromptValue((e.target as HTMLTextAreaElement).value)}
              placeholder="Contoh: Pasien mengeluh batuk berdahak sejak 3 hari, disertai demam ringan..."
            />
            <div class="confirm-dialog-actions">
              <button type="button" class="btn btn-sm btn-secondary" onClick={handleCloseTextPrompt}>
                Batal
              </button>
              <button
                type="button"
                class="btn btn-sm btn-primary-custom"
                onClick={handleSubmitTextPrompt}
                disabled={!textPromptValue.trim()}
              >
                Proses
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div class="confirm-overlay" role="dialog" aria-modal="true">
          <div class="confirm-dialog">
            <p class="confirm-dialog-title">Batalkan rekaman?</p>
            <p class="confirm-dialog-body">
              Rekaman yang sudah berjalan ({fmt(duration)}) akan dihapus dan tidak dapat dikembalikan.
            </p>
            <div class="confirm-dialog-actions">
              <button type="button" class="btn btn-sm btn-secondary" onClick={handleDismissCancel}>
                Tidak, lanjutkan
              </button>
              <button type="button" class="btn btn-sm btn-danger-custom" onClick={handleConfirmCancel}>
                Ya, batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
