import type { SOAPResult, ServiceResponse } from '@/types'

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
  process(audioBlob: Blob): Promise<ServiceResponse<SpeechToSOAPResult>>
}
