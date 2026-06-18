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

  private getFullConfig(): SDKConfig {
    return (window as any).his_ai_widget?._getConfig() || {};
  }

  async generate(diagnosis: string, context?: string): Promise<ServiceResponse<ClinicalPathwayResult>> {
    const endpoint = this.apiConfig.pathwayEndpoint
    if (!endpoint) {
      return { data: {} as ClinicalPathwayResult, ok: false, error: 'pathwayEndpoint tidak dikonfigurasi' }
    }

    const config = this.getFullConfig();
    const active_patient = {
      mrn: config.patientId || "UNKNOWN",
      name: config.userName || "Pasien",
      age: 30,
      gender: "L"
    };

    const promptMessage = `Buatkan struktur Clinical Pathway untuk diagnosa: ${diagnosis}. Konteks tambahan: ${context || 'Tidak ada'}. Jawab HANYA menggunakan format JSON valid dengan struktur berikut: {"diagnosis": "...", "totalDays": angka, "steps": [{"day": "Hari 1", "activities": ["..."], "medications": ["..."], "assessments": ["..."]}]}. Pastikan output langsung JSON tanpa markdown \`\`\`json.`;

    const payload = {
      id_chat: "PATHWAY-" + (config.visitId || "SESSION"),
      visit_id: config.visitId || "V-UNKNOWN",
      message: promptMessage,
      ui_raw_json: {
        active_patient: active_patient,
        clinical_notes: config.api?.pretext || "Tidak ada catatan klinis"
      }
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.apiConfig.headers },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        return { data: {} as ClinicalPathwayResult, ok: false, error: `HTTP ${res.status}` }
      }

      const backendResponse = await res.json()
      const jawabanMedis = backendResponse.jawaban_medis || "{}";
      
      let parsedPathway: any = {};
      try {
        // Hapus backtick markdown jika LLM membungkusnya
        const cleanJsonStr = jawabanMedis.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedPathway = JSON.parse(cleanJsonStr);
      } catch (e) {
        console.error("Gagal parse Pathway JSON:", e);
        // Fallback jika LLM tidak merespons JSON murni
        parsedPathway = {
          diagnosis: diagnosis,
          totalDays: 1,
          steps: [{ day: "1", activities: ["Gagal mem-parsing Clinical Pathway, baca respons aslinya di log"] }]
        }
      }

      return { data: { ...parsedPathway, generatedAt: new Date() }, ok: true }
    } catch (err) {
      return { data: {} as ClinicalPathwayResult, ok: false, error: (err as Error).message }
    }
  }
}
