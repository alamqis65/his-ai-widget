import { useState, useEffect } from 'preact/hooks'
import type { ActiveFeature, SDKConfig } from '@/types'
import { ChatFeature } from '@/features/chat/ChatFeature'
import { SpeechToSoapFeature } from '@/features/speech-to-soap/SpeechToSoapFeature'
import { ClinicalPathwayFeature } from '@/features/clinical-pathway/ClinicalPathwayFeature'
import { EClaimFeature } from '@/features/eclaim/EClaimFeature'
import logo from '@/assets/MAIA_Head_Transparent.png'
interface NavItem {
  id: ActiveFeature
  label: string
  icon: preact.VNode
  description: string
}

const NAV: NavItem[] = [
  {
    id: 'chat',
    label: 'MAIA Chat',
    description: 'Tanya MAIA',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    id: 'speech-to-soap',
    label: 'SOAP',
    description: 'Rekam → catatan SOAP',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
        <path d="M19 10v2a7 7 0 01-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
  },
  {
    id: 'clinical-pathway',
    label: 'Pathway',
    description: 'Generate pathway pasien',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: 'eclaim',
    label: 'E-Claim',
    description: 'Cek eligibilitas klaim',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
]

export function App() {
  const [active, setActive] = useState<ActiveFeature>('chat')

  // Read SDK config from window if available
  const getConfig = (): SDKConfig =>
    (window as unknown as { his_ai_widget?: { _getConfig?: () => SDKConfig } })
      .his_ai_widget?._getConfig?.() ?? {}

  const cfg = getConfig()

  // Listen for programmatic navigation from SDK
  useEffect(() => {
    const handler = (e: Event) => {
      const feature = (e as CustomEvent).detail?.feature as ActiveFeature
      if (feature) setActive(feature)
    }
    window.addEventListener('his_ai:navigate', handler)
    return () => window.removeEventListener('his_ai:navigate', handler)
  }, [])

  const handleClose = () => {
    const w = window as unknown as { his_ai_widget?: { close: () => void } }
    w.his_ai_widget?.close()
  }

  return (
    <div class="widget-root">
      {/* ── Header ── */}
      <header class="widget-header">
        <div class="widget-header-left">
          <div class="widget-avatar">
            <img src={logo}  alt="MAIA Head" width={24} height={24} />
          </div>
          <div>
            <p class="widget-header-title">Tanya MAIA</p>
            <p class="widget-header-sub">
              <span class="widget-status-dot"/>
              {cfg.userName ? `Halo, ${cfg.userName}` : 'Siap membantu'}
            </p>
          </div>
        </div>
        <button class="widget-header-close" onClick={handleClose} aria-label="Tutup">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </header>

      {/* ── Content ── */}
      <main class="widget-content">
        {active === 'chat' && <ChatFeature />}
        {active === 'speech-to-soap' && <SpeechToSoapFeature />}
        {active === 'clinical-pathway' && <ClinicalPathwayFeature />}
        {active === 'eclaim' && <EClaimFeature />}
      </main>

      {/* ── Bottom Nav ── */}
      <nav class="widget-nav">
        {NAV.map((item) => (
          <button
            key={item.id}
            class={`widget-nav-item ${active === item.id ? 'widget-nav-item--active' : ''}`}
            onClick={() => setActive(item.id)}
            aria-label={item.label}
            title={item.description}
          >
            {item.icon}
            <span class="widget-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
