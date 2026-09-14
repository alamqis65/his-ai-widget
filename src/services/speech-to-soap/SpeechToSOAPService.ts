import type { SOAPResult, SOAPProgressEvent, ServiceResponse } from '@/types'

export interface SpeechToSOAPResult {
  soapResult: SOAPResult
}

/**
 * SpeechToSOAPService
 *
 * Single call: kirim audio → terima transcript + SOAP sekaligus.
 *
 * Production endpoint (soapGeneratorEndpoint):
 *   POST multipart/form-data { audio: Blob }
 *   Response: {
 *     transcript: string,
 *     soap: { subjective, objective, assessment, plan }
 *   }
 */
export interface SpeechToSOAPService {
  /**
   * @param userPrompt Teks tambahan dari dokter (fitur "Tulis Teks" / User Prompt,
   * aktif kalau `isAbleUserPromptSoap: true` di init). Ditambahkan ke akhir
   * `api.pretext` (tidak menimpa) — lihat ProductionSpeechToSOAPService.
   */
  process(
    audioBlob: Blob,
    onProgress?: (event: SOAPProgressEvent) => void,
    userPrompt?: string,
  ): Promise<ServiceResponse<SpeechToSOAPResult>>
}
