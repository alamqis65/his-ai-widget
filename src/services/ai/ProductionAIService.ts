import type { ChatMessage, ChatSendResult, ServiceResponse, SDKApiConfig, SDKConfig } from '@/types'
import type { AIService } from './AIService'
export class ProductionAIService implements AIService {
  constructor(private readonly apiConfig: SDKApiConfig) {}

  private getFullConfig(): SDKConfig {
    return (window as any).his_ai_widget?._getConfig() || {}
  }

  async sendMessage(message: string, _history?: ChatMessage): Promise<ServiceResponse<ChatSendResult>> {
    const endpoint = this.apiConfig.chatEndpoint
    if (!endpoint) {
      return { data: { text: '' }, ok: false, error: 'chatEndpoint tidak dikonfigurasi' }
    }

    const config = this.getFullConfig()
    const pretext = config.api?.pretext || 'Tidak ada catatan klinis'
    // Untuk demo, kita pakai static mrn, name, age, gender. Nanti bisa diambil dari config bila ada.
    const active_patient = {
      mrn: config.patientId || 'UNKNOWN',
      age: config.age || 30,
    }

    try {
      const payload = {
        id_chat: _history?.id || `chat-${Date.now()}`,
        visit_id: config.visitId || 'UNKNOWN',
        message: message,
        ui_raw_json: {
          active_patient: config.patientData || active_patient,
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
        return { data: { text: '' }, ok: false, error: `HTTP ${res.status}: ${err}` }
      }

      const data = await res.json()
      return {
        data: {
          text: data.jawaban_medis ?? data.reply ?? data.message ?? '',
          // Keep the full payload — jawaban_medis, suggested_prescriptions,
          // suggested_orders, suggested_diagnoses, suggested_procedures,
          // processing_details, etc. — so it survives past this call and
          // can be handed back later via the "Ambil hasil chat ini" button.
          raw: data,
        },
        ok: true,
      }
    } catch (err) {
      return { data: { text: '' }, ok: false, error: (err as Error).message }
    }
  }
}
