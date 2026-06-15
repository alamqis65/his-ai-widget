import type { SOAPResult, ServiceResponse, SDKApiConfig } from '@/types'
import type { SOAPService } from './SOAPService'

/**
 * ProductionSOAPService — generate catatan SOAP dari transcript.
 *
 * Endpoint menerima POST:
 * { transcript: string, context?: { patientId, visitId } }
 *
 * Endpoint harus mengembalikan:
 * { soap: { subjective, objective, assessment, plan } }
 */
export class ProductionSOAPService implements SOAPService {
  constructor(private readonly apiConfig: SDKApiConfig) {}

  async generate(transcript: string): Promise<ServiceResponse<SOAPResult>> {
    const endpoint = this.apiConfig.soapEndpoint
    if (!endpoint) {
      return { data: {} as SOAPResult, ok: false, error: 'soapEndpoint tidak dikonfigurasi' }
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.apiConfig.headers },
        body: JSON.stringify({ transcript }),
      })

      if (!res.ok) {
        return { data: {} as SOAPResult, ok: false, error: `HTTP ${res.status}` }
      }

      const data = await res.json()
      return {
        data: { soap: data.soap, generatedAt: new Date(), transcriptUsed: transcript },
        ok: true,
      }
    } catch (err) {
      return { data: {} as SOAPResult, ok: false, error: (err as Error).message }
    }
  }
}
