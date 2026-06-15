import type { ClinicalPathwayResult, ServiceResponse, SDKApiConfig } from '@/types'
import type { ClinicalPathwayService } from './ClinicalPathwayService'

/**
 * ProductionClinicalPathwayService — generate clinical pathway dari diagnosis.
 *
 * Endpoint menerima POST:
 * { diagnosis: string, context?: string }
 *
 * Endpoint harus mengembalikan:
 * { pathway: ClinicalPathwayResult }
 */
export class ProductionClinicalPathwayService implements ClinicalPathwayService {
  constructor(private readonly apiConfig: SDKApiConfig) {}

  async generate(diagnosis: string, context?: string): Promise<ServiceResponse<ClinicalPathwayResult>> {
    const endpoint = this.apiConfig.pathwayEndpoint
    if (!endpoint) {
      return { data: {} as ClinicalPathwayResult, ok: false, error: 'pathwayEndpoint tidak dikonfigurasi' }
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.apiConfig.headers },
        body: JSON.stringify({ diagnosis, context }),
      })

      if (!res.ok) {
        return { data: {} as ClinicalPathwayResult, ok: false, error: `HTTP ${res.status}` }
      }

      const data = await res.json()
      return { data: { ...data.pathway, generatedAt: new Date() }, ok: true }
    } catch (err) {
      return { data: {} as ClinicalPathwayResult, ok: false, error: (err as Error).message }
    }
  }
}
