import type { ChatMessage, ServiceResponse, SDKApiConfig, SDKConfig } from '@/types'
import type { AIService } from './AIService'

export class ProductionAIService implements AIService {
  constructor(private readonly apiConfig: SDKApiConfig) {}

  private getFullConfig(): SDKConfig {
    return (window as any).his_ai_widget?._getConfig() || {}
  }

  async sendMessage(message: string, _history?: ChatMessage[]): Promise<ServiceResponse<string>> {
    const endpoint = this.apiConfig.chatEndpoint
    if (!endpoint) {
      return { data: '', ok: false, error: 'chatEndpoint tidak dikonfigurasi' }
    }

    const config = this.getFullConfig()
    const pretext = config.api?.pretext || 'Tidak ada catatan klinis'
    // Untuk demo, kita pakai static mrn, name, age, gender. Nanti bisa diambil dari config bila ada.
    const active_patient = {
      mrn: config.patientId || 'UNKNOWN',
      name: config.userName || 'Pasien',
      age: 30,
      gender: 'L',
    }

    try {
      const payload = {
        id_chat: 'WIDGET-' + (config.visitId || 'SESSION'),
        visit_id: config.visitId || 'V-UNKNOWN',
        message: message,
        ui_raw_json: {
          active_patient: active_patient,
          clinical_notes: pretext,
        },
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.apiConfig.headers,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.text()
        return { data: '', ok: false, error: `HTTP ${res.status}: ${err}` }
      }

      const data = await res.json()
      return { data: data.jawaban_medis ?? data.reply ?? data.message ?? '', ok: true }
    } catch (err) {
      return { data: '', ok: false, error: (err as Error).message }
    }
  }
}
