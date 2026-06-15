# his_ai_widget

> AI Widget untuk Hospital Information System — MVP v0.2

Widget AI klinis yang dapat diintegrasikan ke sistem HIS apapun dengan 3 baris kode.

---

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:3000
```

---

## Fitur

| Fitur | Status | Keterangan |
|---|---|---|
| AI Chat | ✅ | Asisten klinis dengan konteks percakapan |
| Speech to SOAP | ✅ | Rekam audio → transkripsi → catatan SOAP |
| Clinical Pathway | ✅ | Generate rencana perawatan per diagnosis |
| E-Claim Check | ✅ | Verifikasi eligibilitas BPJS/asuransi |

Semua fitur tersedia dalam mode **mock** (tanpa backend). Tinggal swap service saat backend siap.

---

## Integrasi ke HIS / .NET

### Cara paling simpel — 3 langkah

**Langkah 1** — Build widget:
```bash
npm run build
# Hasilnya: dist/assets/main-[hash].js dan main-[hash].css
```

**Langkah 2** — Copy `dist/` ke project HIS kamu:
```
wwwroot/
└── ai-widget/          ← copy isi dist/ ke sini
    ├── index.html
    └── assets/
        ├── main-xxx.js
        └── main-xxx.css
```

**Langkah 3** — Tambahkan ke layout HIS (Razor, PHP, HTML, apapun):
```html
<!-- Load widget -->
<script src="/ai-widget/assets/main-xxx.js"></script>

<!-- Inisialisasi -->
<script>
  his_ai_widget.init({
    userName: 'dr. Budi Santoso',
    theme: 'light',
  })
</script>
```

Selesai. Widget muncul sebagai floating button di kanan bawah.

---

## SDK API Reference

```js
// ── Wajib dipanggil sekali ──────────────────────────────────────────
his_ai_widget.init({
  userName:     'dr. Budi',       // nama di header widget
  theme:        'light',          // 'light' | 'dark'

  // Konteks pasien (opsional, bisa di-update kapan saja)
  patientId:    'P-001',
  visitId:      'V-20241120',
  doctorId:     'DR-001',
  departmentId: 'DEPT-UMUM',

  // API service (opsional — tanpa ini pakai mock)
  apiBaseUrl:   'https://api.rumahsakit.com',

  // Callback hasil (SOAP, pathway, eclaim)
  onResult: (type, data) => {
    // Simpan data ke HIS kamu
    // type: 'SOAP' | 'CLINICAL_PATHWAY' | 'ECLAIM'
  },

  onError: (err) => console.error(err),
})

// ── Kontrol widget ──────────────────────────────────────────────────
his_ai_widget.open()
his_ai_widget.close()
his_ai_widget.toggle()

// ── Update konteks pasien (panggil saat buka rekam medis pasien) ────
his_ai_widget.setPatient({
  patientId:    'P-002',
  visitId:      'V-20241121',
})

// ── Buka fitur tertentu langsung ────────────────────────────────────
his_ai_widget.navigateTo('chat')             // AI Chat
his_ai_widget.navigateTo('speech-to-soap')  // Speech to SOAP
his_ai_widget.navigateTo('clinical-pathway') // Clinical Pathway
his_ai_widget.navigateTo('eclaim')          // E-Claim Check
```

---

## Integrasi dengan API Eksternal

Kalau HIS kamu punya API sendiri (misalnya wrapping Gemini/GPT), cukup:

```js
his_ai_widget.init({
  apiBaseUrl: 'https://api.rumahsakit.com',
  // Widget akan POST ke: apiBaseUrl + /api/chat, /api/stt, /api/soap
})
```

Atau kalau mau pakai fungsi dari HIS host langsung:

```js
// Di HIS app (punya API key, aman di server)
window.HISBridge = {
  chat: async ({ message, history }) => {
    const res = await fetch('/internal/ai', { method: 'POST', body: JSON.stringify({ message, history }) })
    return (await res.json()).reply
  }
}

// Di widget — buat HostBridgeAIService.ts (lihat docs/integration.md)
```

---

## Struktur Project

```
src/
├── components/         UI murni (tidak ada fetch, tidak ada business logic)
│   ├── chat/
│   ├── speech-to-soap/
│   └── common/
├── features/           Halaman per fitur (compose komponen + hook)
│   ├── chat/
│   ├── speech-to-soap/
│   ├── clinical-pathway/
│   └── eclaim/
├── services/           Abstraction layer ke API
│   ├── ai/             AIService.ts + MockAIService.ts
│   ├── stt/            STTService.ts + MockSTTService.ts
│   ├── soap/           SOAPService.ts + MockSOAPService.ts
│   ├── clinical-pathway/
│   └── eclaim/
├── hooks/              Business logic + state management
│   ├── useChat.ts
│   ├── useRecorder.ts
│   ├── useClinicalPathway.ts
│   └── useEClaim.ts
├── sdk/                SDK entry point (window.his_ai_widget)
│   └── index.tsx
├── types/              TypeScript types
└── styles/             CSS (satu file, pakai CSS variables)
```

---

## Menambah Fitur Baru

1. Buat `src/services/<fitur>/FiturService.ts` (interface)
2. Buat `src/services/<fitur>/MockFiturService.ts` (dummy)
3. Buat `src/hooks/useFitur.ts`
4. Buat `src/features/<fitur>/FiturFeature.tsx`
5. Tambah entry di `NAV` array di `App.tsx`

---

## Mengganti Mock ke Production

Tiap hook punya satu baris ini:
```ts
const service = IS_MOCK ? new MockXxxService() : new MockXxxService()
//                                                 ↑ ganti dengan ProductionXxxService()
```

Set `.env` → `VITE_ENABLE_MOCK=false`, selesai.

---

## Environment Variables

```bash
VITE_AI_BASE_URL=http://localhost:8000
VITE_CHAT_ENDPOINT=/api/chat
VITE_STT_ENDPOINT=/api/stt
VITE_SOAP_ENDPOINT=/api/soap
VITE_ENABLE_MOCK=true
```

---

## Future Roadmap

- [ ] SDK bundle terpisah (`his_ai_widget.min.js`)
- [ ] Iframe isolation + postMessage
- [ ] JWT authentication
- [ ] Multi-tenant config
- [ ] Streaming response (SSE)
- [ ] Dark theme
- [ ] ICD-10 Recommendation
- [ ] Drug Recommendation
- [ ] Audit logging
