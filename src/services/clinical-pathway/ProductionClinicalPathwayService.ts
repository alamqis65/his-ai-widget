import type {
  ClinicalPathwayParams,
  ClinicalPathwayResult,
  ServiceResponse,
  SDKApiConfig,
  SDKConfig,
  DiagnosisMaster,
} from '@/types'
import type { ClinicalPathwayService } from './ClinicalPathwayService'

/**
 * ProductionClinicalPathwayService — generate clinical pathway dari diagnosis.
 */
export class ProductionClinicalPathwayService implements ClinicalPathwayService {
  constructor(private readonly apiConfig: SDKApiConfig) {}

  private getFullConfig(): SDKConfig {
    return (window as any).his_ai_widget?._getConfig() || {}
  }

  async generate(params: ClinicalPathwayParams): Promise<ServiceResponse<ClinicalPathwayResult>> {
    const endpoint = this.apiConfig.pathwayEndpoint
    if (!endpoint) {
      return { data: {} as ClinicalPathwayResult, ok: false, error: 'pathwayEndpoint tidak dikonfigurasi' }
    }

    const fetchBody = params

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.apiConfig.headers },
        body: JSON.stringify(fetchBody),
      })

      if (!res.ok) {
        return { data: {} as ClinicalPathwayResult, ok: false, error: `HTTP ${res.status}` }
      }

      const backendResponse = await res.json()

      // Parse response from python backend (PathwayGenerateResponse)
      const mappedSteps = (backendResponse.clinical_pathway || []).map((phase: any) => {
        const asuhan = phase.asuhan_medis || {}
        return {
          day: `Hari ${phase.hari_ke} - ${phase.nama_fase}`,
          activities: asuhan.tindakan_perawat || [],
          medications: (asuhan.medikasi_farmasi || []).map((m: any) => `${m.nama_obat} (${m.dosis})`),
          assessments: (asuhan.laboratorium || []).map((l: any) => l.nama_pemeriksaan),
        }
      })

      const parsedPathway: ClinicalPathwayResult = {
        diagnosis: backendResponse.metadata_sistem?.diagnose_id_asli || params.diagnosa_id,
        totalDays: backendResponse.metadata_sistem?.durasi_final || params.target_hari_dokter,
        steps: mappedSteps,
        generatedAt: new Date(),
      }

      return { data: parsedPathway, ok: true }
    } catch (err) {
      return { data: {} as ClinicalPathwayResult, ok: false, error: (err as Error).message }
    }
  }

  async getMasterDiagnoses(): Promise<ServiceResponse<DiagnosisMaster[]>> {
    const endpoint = this.apiConfig.pathwayMasterDiagnosesEndpoint
    if (!endpoint) {
      return { data: [], ok: false, error: 'pathwayMasterDiagnosesEndpoint tidak dikonfigurasi' }
    }

    try {
      const res = await fetch(endpoint)

      if (!res.ok) {
        return { data: [], ok: false, error: `HTTP ${res.status}` }
      }

      const backendResponse = await res.json()
      return { data: backendResponse || [], ok: true }
    } catch (err) {
      return { data: [], ok: false, error: (err as Error).message }
    }
  }
}
