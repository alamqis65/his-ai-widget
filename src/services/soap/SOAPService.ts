import type { SOAPResult, ServiceResponse } from '@/types'

/**
 * SOAPService — abstraction layer for SOAP note generation.
 *
 * TODO (Production):
 * - Implement ProductionSOAPService using VITE_SOAP_ENDPOINT
 * - Send transcript as JSON body
 * - Support streaming output for long SOAP notes
 * - Accept HIS context (patientId, visitId) for richer output
 * - Add template selection (adult, pediatric, emergency, etc.)
 */
export interface SOAPService {
  generate(transcript: string): Promise<ServiceResponse<SOAPResult>>
}
