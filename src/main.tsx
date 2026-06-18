import { render } from 'preact'
import { App } from './App'
import './styles/index.css'
import './sdk'

// Dev preview — simulasi SDK init
window.
  his_ai_widget.init({
    // ── Identity ──────────────────────────────────────────────────────────
    userName:     'dr. Budi Santoso',
    theme:        'light',

    // ── Konteks pasien awal (bisa di-update via setPatient()) ─────────────
    patientId:    'P-2024-001',
    visitId:      'V-20260604-001',
    doctorId:     'DR-BS-001',
    departmentId: 'DEPT-UMUM',

    // ── API Endpoints (opsional — tanpa ini pakai Mock) ────────────────────
    // Uncomment dan isi URL sesuai backend HIS kamu:
    api: {
      soapGeneratorEndpoint: 'http://localhost/medinfrasv2.2/dev/EMR/Libs/Service/MedinfrasAPIService.asmx/GenerateSOAPI2',
      pretext: 'Pasien datang dengan keluhan demam tinggi dan batuk kering selama 3 hari terakhir. Riwayat penyakit sebelumnya tidak ada. Tidak ada alergi obat yang diketahui. Pemeriksaan fisik menunjukkan suhu 38,5°C, tekanan darah 120/80 mmHg, denyut nadi 90 bpm, dan pernapasan 20 kali per menit. Pemeriksaan paru-paru menunjukkan adanya ronki basah di kedua paru. Pemeriksaan laboratorium menunjukkan leukositosis ringan. Pasien belum menerima pengobatan apapun.',  
    //   chatEndpoint:    'https://api.rs-nusantara.com/ai/chat',
    //   sttEndpoint:     'https://api.rs-nusantara.com/ai/stt',
    //   soapEndpoint:    'https://api.rs-nusantara.com/ai/soap',
    //   pathwayEndpoint: 'https://api.rs-nusantara.com/ai/pathway',
    //   eclaimEndpoint:  'https://api.rs-nusantara.com/eclaim/check',
    //   headers: {
    //     'Authorization': 'Bearer <token>',
    //     'X-Hospital-Id': 'RS-NUSANTARA-001',
    //   },
    },

    // ── Feature visibility (semua default: true) ───────────────────────────
    // Set false untuk menyembunyikan fitur tertentu:
    // features: {
    //   chat:    true,
    //   soap:    true,
    //   pathway: true,
    //   eclaim:  false,   // ← sembunyikan E-Claim
    // },

    // ── Callbacks per fitur ────────────────────────────────────────────────
    onResultChat: (messages) => {
      console.log('[HIS] Riwayat chat:', messages)
      // Simpan ke EMR / session storage
    },

    onResultSOAP: (result) => {
      console.log('[HIS] SOAP Result:', result)
      // POST ke endpoint rekam medis HIS
      // fetch('/api/emr/soap', { method: 'POST', body: JSON.stringify(result) })
    },

    onResultPathway: (result) => {
      console.log('[HIS] Clinical Pathway:', result)
      // POST ke endpoint clinical pathway HIS
      // fetch('/api/emr/pathway', { method: 'POST', body: JSON.stringify(result) })
    },

    onResultEClaim: (result) => {
      console.log('[HIS] E-Claim:', result)
      // Submit ke sistem klaim
      // fetch('/api/claims/submit', { method: 'POST', body: JSON.stringify(result) })
    },

    onError: (err) => {
      console.error('[HIS] Widget error:', err)
    },
  })


render(<App />, document.getElementById('app')!)
