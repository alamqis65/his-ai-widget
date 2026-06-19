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
      // Backend mengharapkan BPJSValidateRequestDTO: { icd10_codes: string[], context_text?: string }
      const payload = {
        icd10_codes: [icdCode],
        context_text: diagnosis
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.apiConfig.headers },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        return { data: {} as EClaimCheckResult, ok: false, error: `HTTP ${res.status}` }
      }

      const backendResponse = await res.json()
      // Mapping respons backend BPJSValidationResultDTO ke EClaimCheckResult widget
      const data = backendResponse.data || {};
      const result: EClaimCheckResult = {
        eligible: data.is_compliant || false,
        warnings: data.warnings || [],
        errors: data.errors || [],
        message: backendResponse.message || "Validasi BPJS Selesai"
      };

      return { data: { ...result, checkedAt: new Date() }, ok: true }
    } catch (err) {
      return { data: {} as EClaimCheckResult, ok: false, error: (err as Error).message }
    }
  }
}
