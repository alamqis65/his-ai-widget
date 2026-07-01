import type { ClinicalPathwayParams, ClinicalPathwayResult, ServiceResponse, DiagnosisMaster } from '@/types'

/**
 * ClinicalPathwayService — abstraction untuk generate clinical pathway.
 *
 * TODO (Production):
 * - Implement ProductionClinicalPathwayService
 * - POST diagnosis + patient context ke LLM endpoint
 * - Support template per departemen (bedah, interna, anak, dll)
 */
export interface ClinicalPathwayService {
  generate(params: ClinicalPathwayParams): Promise<ServiceResponse<ClinicalPathwayResult>>
  getMasterDiagnoses(): Promise<ServiceResponse<DiagnosisMaster[]>>
}
