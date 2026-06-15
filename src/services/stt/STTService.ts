import type { STTResult, ServiceResponse } from '@/types'

/**
 * STTService — abstraction layer for Speech-to-Text conversion.
 *
 * TODO (Production):
 * - Implement ProductionSTTService using VITE_STT_ENDPOINT
 * - Send audio as multipart/form-data
 * - Support streaming transcription for real-time feedback
 * - Handle audio format conversion (webm → wav if needed)
 * - Add language detection or accept language param
 */
export interface STTService {
  transcribe(audioBlob: Blob): Promise<ServiceResponse<STTResult>>
}
