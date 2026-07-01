import { render } from 'preact'
import { App } from './App'
import './styles/index.css'
import './sdk'

// Dev preview — simulasi SDK init
window.his_ai_widget.init({
  // ── Identity ──────────────────────────────────────────────────────────
  userName: 'dr. Budi',
  theme: 'light',

  // ── Konteks pasien awal (bisa di-update via setPatient()) ─────────────
  patientId: 'P-2024-001',
  visitId: 'V-20260604-001',
  doctorId: 'DR-BS-001',
  departmentId: 'DEPT-UMUM',

  // ── API Endpoints (opsional — tanpa ini pakai Mock) ────────────────────
  // Uncomment dan isi URL sesuai backend HIS kamu:
  api: {
    // soapGeneratorEndpoint: 'http://192.168.50.143:8000/api/v1/rag/analyze', // Endpoint baru untuk STT & SOAP
    chatEndpoint: 'http://192.168.90.98:8000/api/v1/ai-assistant/patient-ai-assistant',
    pretext:
      'Pasien perempuan 32 tahun datang ke poli dengan keluhan sakit kepala sejak dua hari, disertai mual ringan. Tidak ada riwayat trauma kepala, tekanan darah saat diperiksa 130/80 mmHg, suhu tubuh normal. Dokter menilai kemungkinan tension headache dan merencanakan terapi simptomatik serta anjuran istirahat cukup.',
    // sttEndpoint dan soapEndpoint tidak lagi diperlukan terpisah karena di panggil oleh rag/analyze
    pathwayEndpoint: 'http://192.168.90.98:8000/api/v1/clinical-pathway/generate',
    pathwayMasterDiagnosesEndpoint: 'http://192.168.90.98:8000/api/v1/clinical-pathway/master-diagnoses',
    eclaimEndpoint: 'http://192.168.90.98:8000/api/v1/bpjs/validate',
    //   headers: {
    //     'Authorization': 'Bearer <token>',
    //     'X-Hospital-Id': 'RS-NUSANTARA-001',
    //   },
  },

  // ── Feature visibility (semua default: true) ───────────────────────────
  // Set false untuk menyembunyikan fitur tertentu:
  features: {
    chat: true,
    soap: true,
    pathway: true,
    eclaim: false, // ← sembunyikan E-Claim
  },

  // ── Callbacks per fitur ────────────────────────────────────────────────
  onResultChat: messages => {
    console.log('[HIS] Riwayat chat:', messages)
    // Simpan ke EMR / session storage
  },

  onResultSOAP: result => {
    console.log('[HIS] SOAP Result:', result)
    // POST ke endpoint rekam medis HIS
    // fetch('/api/emr/soap', { method: 'POST', body: JSON.stringify(result) })
  },

  onResultPathway: result => {
    console.log('[HIS] Clinical Pathway:', result)
    // POST ke endpoint clinical pathway HIS
    // fetch('/api/emr/pathway', { method: 'POST', body: JSON.stringify(result) })
  },

  onResultEClaim: result => {
    console.log('[HIS] E-Claim:', result)
    // Submit ke sistem klaim
    // fetch('/api/claims/submit', { method: 'POST', body: JSON.stringify(result) })
  },

  onError: err => {
    console.error('[HIS] Widget error:', err)
  },
})

window.his_ai_widget.setConfig({
  api: {
    pretext:
      'Pasien perempuan 32 tahun datang ke poli dengan keluhan sakit kepala sejak dua hari, disertai mual ringan. Tidak ada riwayat trauma kepala, tekanan darah saat diperiksa 130/80 mmHg, suhu tubuh normal. Dokter menilai kemungkinan tension headache dan merencanakan terapi simptomatik serta anjuran istirahat cukup.',
  },
})

render(<App />, document.getElementById('app')!)
