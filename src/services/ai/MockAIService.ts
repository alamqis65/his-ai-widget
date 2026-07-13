import type { ChatMessage, ChatSendResult, ServiceResponse } from '@/types'
import type { AIService } from './AIService'
import { delay } from '@/utils'

const MOCK_RESPONSES: Record<string, string> = {
  default:
    'Terima kasih atas pertanyaan Anda. Sebagai asisten AI medis, saya siap membantu Anda dengan informasi klinis, jadwal, dan kebutuhan lainnya.',
  sapaan: 'Halo! Selamat datang di HIS AI Assistant. Ada yang bisa saya bantu hari ini?',
  diagnosis:
    'Berdasarkan gejala yang Anda sampaikan, ada beberapa kemungkinan diagnosis yang perlu dipertimbangkan. Namun, evaluasi klinis langsung tetap diperlukan untuk konfirmasi.',
  obat: 'Untuk rekomendasi obat, saya perlu melihat riwayat alergi pasien dan kondisi komorbid. Silakan berikan informasi tersebut.',
  soap: 'Fitur Speech to SOAP tersedia di menu sebelah kiri. Anda dapat merekam percakapan dengan pasien dan sistem akan otomatis menghasilkan catatan SOAP.',
  icd: 'Untuk mencari kode ICD-10, gunakan fitur ICD Recommendation yang akan segera tersedia.',
}

function getResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('halo') || lower.includes('hai') || lower.includes('selamat')) return MOCK_RESPONSES.sapaan
  if (lower.includes('diagnosis') || lower.includes('gejala') || lower.includes('sakit'))
    return MOCK_RESPONSES.diagnosis
  if (lower.includes('obat') || lower.includes('resep') || lower.includes('farmasi')) return MOCK_RESPONSES.obat
  if (lower.includes('soap') || lower.includes('catatan')) return MOCK_RESPONSES.soap
  if (lower.includes('icd') || lower.includes('kode')) return MOCK_RESPONSES.icd
  return MOCK_RESPONSES.default
}

/**
 * MockAIService — returns dummy responses for development/demo.
 * Replace with ProductionAIService when backend is ready.
 */
export class MockAIService implements AIService {
  async sendMessage(message: string, _history: ChatMessage): Promise<ServiceResponse<ChatSendResult>> {
    // Simulate network latency
    await delay(800 + Math.random() * 700)

    // Simulate occasional errors (5% chance) — comment out for stable demo
    // if (Math.random() < 0.05) {
    //   return { data: '', ok: false, error: 'Simulasi error jaringan' }
    // }

    return {
      data: { text: getResponse(message) },
      ok: true,
    }
  }
}
