import { useSpeechToSOAPLive } from '@/hooks/useSpeechToSOAPLive'
import { LiveSoapView } from '@/components/speech-to-soap-live/LiveSoapView'
import type { SDKCallbacks } from '@/types'

interface Props {
  callbacks?: Pick<SDKCallbacks, 'onResultSOAP'>
}

/**
 * SpeechToSoapLiveFeature
 *
 * Versi "Live" dari SpeechToSoapFeature.tsx (fitur lama) — dipanggil
 * terpisah, tidak menggantikan fitur lama. Layar rekam dan layar hasil
 * digabung jadi satu: SOAP mulai tampil dan terus update selagi masih
 * merekam, dan begitu rekaman berhenti layarnya tidak berubah — hasil yang
 * sudah live-update tadi tetap di situ, siap dicek lalu disimpan lewat
 * "Simpan ke HIS".
 *
 * State machine: IDLE -> LIVE -> REVIEW (lihat useSpeechToSOAPLive.ts).
 * Tidak ada PROCESSING_LLM terpisah seperti fitur lama, karena tidak ada
 * jeda "processing" yang berarti — semuanya sudah live.
 */
export function SpeechToSoapLiveFeature({ callbacks }: Props) {
  const {
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
  } = useSpeechToSOAPLive(callbacks)

  return (
    <div class="sts-layout">
      <div>
        <h2 class="feature-title">Speech to SOAP Live</h2>
        <p class="feature-subtitle">
          Rekam percakapan anda — SOAP akan tampil dan diperbarui otomatis secara live, tanpa menunggu rekaman selesai
        </p>
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
        <LiveSoapView
          state={state}
          soapDraft={soapDraft}
          recordingDuration={recordingDuration}
          recommendationLoading={recommendationLoading}
          onStart={startRecording}
          onStop={stopRecording}
          onGenerateRecommendation={getRecommendation}
          onSave={saveSOAP}
          onReset={reset}
        />
      </div>
    </div>
  )
}
