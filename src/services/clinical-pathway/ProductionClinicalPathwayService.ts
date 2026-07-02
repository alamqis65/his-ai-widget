import type {
  ClinicalPathwayParams,
  ClinicalPathwayResult,
  ServiceResponse,
  SDKApiConfig,
  SDKConfig,
  DiagnosisMaster,
  AssessmentItem,
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

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.apiConfig.headers },
        body: JSON.stringify(params),
      })

      if (!res.ok) {
        return { data: {} as ClinicalPathwayResult, ok: false, error: `HTTP ${res.status}` }
      }

      const backendResponse = await res.json()
      const meta = backendResponse.metadata_sistem || {}

      // Parse response from python backend (PathwayGenerateResponse)
      const mappedSteps = (backendResponse.clinical_pathway || []).map((phase: any) => {
        const asuhan = phase.asuhan_medis || {}

        // Deduplicate assessments by name and preserve category
        const seenAssessments = new Map<string, AssessmentItem>()
        for (const l of asuhan.laboratorium || []) {
          const name = l.nama_pemeriksaan || ''
          if (name && !seenAssessments.has(name)) {
            seenAssessments.set(name, {
              name,
              category: l.kategori || 'LABORATORIUM',
            })
          }
        }

        return {
          day: `Hari ${phase.hari_ke} - ${phase.nama_fase}`,
          activities: Array.from(new Set(asuhan.tindakan_perawat || [])),
          medications: Array.from(
            new Set((asuhan.medikasi_farmasi || []).map((m: any) => `${m.nama_obat} (${m.dosis})`)),
          ),
          assessments: Array.from(seenAssessments.values()),
        }
      })

      // Parse follow-up
      const rawFollowUp = backendResponse.saran_tindak_lanjut
      const followUp = rawFollowUp
        ? {
            rekomendasi: rawFollowUp.rekomendasi || '',
            pemeriksaanLanjut: rawFollowUp.pemeriksaan_lanjut || [],
          }
        : undefined

      const parsedPathway: ClinicalPathwayResult = {
        diagnosis: meta.diagnose_id_asli || params.diagnosa_id,
        totalDays: meta.durasi_final || params.target_hari_dokter,
        steps: mappedSteps,
        metadata: {
          statusZona: meta.status_zona || 'ZONA_HIJAU',
          tipeKunjungan: meta.tipe_kunjungan || params.tipe_kunjungan,
          durasiFinal: meta.durasi_final || params.target_hari_dokter,
          notifikasi: meta.notifikasi_ui
            ? { tipeAlert: meta.notifikasi_ui.tipe_alert, pesan: meta.notifikasi_ui.pesan }
            : null,
        },
        followUp,
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
