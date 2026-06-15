import type { ClinicalPathwayResult, ServiceResponse } from '@/types'

/**
 * ClinicalPathwayService — abstraction untuk generate clinical pathway.
 *
 * TODO (Production):
 * - Implement ProductionClinicalPathwayService
 * - POST diagnosis + patient context ke LLM endpoint
 * - Support template per departemen (bedah, interna, anak, dll)
 */
export interface ClinicalPathwayService {
  generate(diagnosis: string, patientContext?: string): Promise<ServiceResponse<ClinicalPathwayResult>>
}
