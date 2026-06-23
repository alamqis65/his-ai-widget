import type { EClaimCheckResult, ServiceResponse } from '@/types'

/**
 * EClaimService — abstraction untuk cek kelayakan e-claim BPJS/asuransi.
 *
 * TODO (Production):
 * - Implement ProductionEClaimService
 * - Integrasi dengan API BPJS / sistem asuransi
 * - Validasi ICD code, eligibility, dan tarif INA-CBGs
 */
export interface EClaimService {
  check(patientId: string, icdCode: string, diagnosis: string): Promise<ServiceResponse<EClaimCheckResult>>
}
