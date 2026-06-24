interface Props {
  transcript: string
  onUpdate: (t: string) => void
  onConfirm: () => void
  onReset: () => void
  isProcessing: boolean
}

export function TranscriptReview({ transcript, onUpdate, onConfirm, onReset, isProcessing }: Props) {
  return (
    <div class="transcript-review">
      <div>
        <p class="transcript-title">Hasil Transkripsi</p>
        <p class="transcript-sub">Periksa dan edit sebelum generate SOAP</p>
      </div>
      <textarea
        class="transcript-textarea"
        value={transcript}
        onInput={e => onUpdate((e.target as HTMLTextAreaElement).value)}
        disabled={isProcessing}
        rows={7}
      />
      <div class="transcript-actions">
        <button class="btn btn-secondary btn-sm" onClick={onReset} disabled={isProcessing}>
          Rekam Ulang
        </button>
        <button
          class="btn btn-primary btn-primary-custom btn-sm"
          onClick={onConfirm}
          disabled={isProcessing || !transcript.trim()}
        >
          {isProcessing ? (
            <>
              <span class="loading-spinner" style="width:12px;height:12px;border-width:2px" />
              Membuat SOAP...
            </>
          ) : (
            'Generate SOAP'
          )}
        </button>
      </div>
    </div>
  )
}
