import type { EClaimCheckResult, ServiceResponse, SDKApiConfig } from '@/types'
import type { EClaimService } from './EClaimService'

/**
 * ProductionEClaimService — cek eligibilitas klaim ke endpoint.
 *
 * Endpoint menerima POST:
 * { patientId: string, icdCode: string, diagnosis: string }
 *
 * Endpoint harus mengembalikan:
 * { result: EClaimCheckResult }
 */
export class ProductionEClaimService implements EClaimService {
  constructor(private readonly apiConfig: SDKApiConfig) {}

  async check(patientId: string, icdCode: string, diagnosis: string): Promise<ServiceResponse<EClaimCheckResult>> {
    const endpoint = this.apiConfig.eclaimEndpoint
    if (!endpoint) {
      return { data: {} as EClaimCheckResult, ok: false, error: 'eclaimEndpoint tidak dikonfigurasi' }
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.apiConfig.headers },
        body: JSON.stringify({ patientId, icdCode, diagnosis }),
      })

      if (!res.ok) {
        return { data: {} as EClaimCheckResult, ok: false, error: `HTTP ${res.status}` }
      }

      const data = await res.json()
      return { data: { ...data.result, checkedAt: new Date() }, ok: true }
    } catch (err) {
      return { data: {} as EClaimCheckResult, ok: false, error: (err as Error).message }
    }
  }
}
