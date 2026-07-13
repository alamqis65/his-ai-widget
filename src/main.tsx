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
  departmentId: 'INPATIENT',
  age: 32,
  isBPJS: false,
  // ── API Endpoints (opsional — tanpa ini pakai Mock) ────────────────────
  // Uncomment dan isi URL sesuai backend HIS kamu:
  api: {
    soapGeneratorEndpoint: 'http://192.168.90.10:8000/api/v1/rag/analyze', // Endpoint baru untuk STT & SOAP
    chatEndpoint: 'http://192.168.90.10:8000/api/v1/ai-assistant/patient-ai-assistant',
    pretext:
      'meta:(PASIEN OUTPATIENT), transcript: Pasien seorang perempuan datang dengan keluhan sakit kepala sejak dua hari terakhir, disertai mual ringan. Ia menjelaskan bahwa rasa sakit kepala terasa seperti ditekan di bagian belakang kepala, tanpa riwayat trauma kepala maupun penyakit serius sebelumnya. Pasien juga tidak memiliki riwayat alergi obat atau makanan. Pemeriksaan tanda vital menunjukkan tekanan darah 130/80 mmHg, nadi 82 kali per menit reguler, respirasi 18 kali per menit, suhu tubuh 36,8°C, dan saturasi oksigen 98%. Kesadaran pasien baik, compos mentis, serta tidak ditemukan tanda neurologis yang mengkhawatirkan. Dokter menilai kondisi ini kemungkinan besar adalah sakit kepala tegang (tension headache) yang biasanya dipicu oleh stres atau kurang istirahat. Dokter kemudian memberikan edukasi agar pasien beristirahat cukup, mengurangi stres, menghindari terlalu lama menatap layar, memperbanyak minum air putih, serta melakukan relaksasi sederhana. Untuk terapi simptomatik, dokter meresepkan Paracetamol 500 mg bila nyeri dan Domperidone 10 mg bila mual bertambah. Dokter menutup konsultasi dengan pesan agar pasien segera kembali bila sakit kepala tidak membaik dalam beberapa hari atau muncul gejala lain seperti muntah hebat atau gangguan penglihatan. Pasien menerima anjuran tersebut dan mengucapkan terima kasih.',
    // sttEndpoint dan soapEndpoint tidak lagi diperlukan terpisah karena di panggil oleh rag/analyze
    pathwayEndpoint: 'http://192.168.90.10:8000/api/v1/clinical-pathway/generate',
    pathwayMasterDiagnosesEndpoint: 'http://192.168.90.10:8000/api/v1/clinical-pathway/master-diagnoses',
    eclaimEndpoint: 'http://192.168.90.10:8000/api/v1/bpjs/validate',
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
    pathway: false,
    eclaim: false, // ← sembunyikan E-Claim
  },

  // ── Callbacks per fitur ────────────────────────────────────────────────
  onResultChat: messages => {
    console.log('[HIS] Riwayat chat:', messages)
    // Simpan ke EMR / session storage
  },

  onResultChatMessage: result => {
    console.log('[HIS] Ambil hasil chat:', result)
    // result.raw berisi payload mentah dari backend AI:
    // jawaban_medis, suggested_prescriptions, suggested_orders,
    // suggested_diagnoses, suggested_procedures, dll.
    // fetch('/api/emr/chat-result', { method: 'POST', body: JSON.stringify(result) })
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
