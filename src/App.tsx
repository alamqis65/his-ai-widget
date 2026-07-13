import { useState, useEffect, useMemo } from 'preact/hooks'
import type { ActiveFeature, SDKConfig, SDKFeatureFlags } from '@/types'
import { ChatFeature } from '@/features/ChatFeature'
import { SpeechToSoapFeature } from '@/features/SpeechToSoapFeature'
import { ClinicalPathwayFeature } from '@/features/ClinicalPathwayFeature'
import { EClaimFeature } from '@/features/EClaimFeature'
import logo from '@/assets/MAIA_Head_Transparent.png'

// Helper: baca config SDK dari window
function getSDKConfig(): SDKConfig {
  return (window as unknown as { his_ai_widget?: { _getConfig: () => SDKConfig } }).his_ai_widget?._getConfig?.() ?? {}
}

// Resolve feature flags — default semua true
function resolveFeatures(flags?: SDKFeatureFlags): Required<SDKFeatureFlags> {
  return {
    chat: flags?.chat !== false,
    soap: flags?.soap !== false,
    pathway: flags?.pathway !== false,
    eclaim: flags?.eclaim !== false,
  }
}

interface NavItem {
  id: ActiveFeature
  label: string
  featureKey: keyof SDKFeatureFlags
  icon: preact.VNode
}

const ALL_NAV: NavItem[] = [
  {
    id: 'chat',
    label: 'Chat MAIA',
    featureKey: 'chat',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    id: 'speech-to-soap',
    label: 'SOAP',
    featureKey: 'soap',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
  {
    id: 'clinical-pathway',
    label: 'Pathway',
    featureKey: 'pathway',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'eclaim',
    label: 'E-Claim',
    featureKey: 'eclaim',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
]

export function App() {
  const [active, setActive] = useState<ActiveFeature>('chat')

  const cfg = getSDKConfig()
  const features = useMemo(() => resolveFeatures(cfg.features), [cfg.features])

  // Filter nav berdasarkan feature flags
  const visibleNav = ALL_NAV.filter(item => features[item.featureKey])

  // Kalau active feature di-disable, switch ke first visible
  useEffect(() => {
    const activeFeatureKey = ALL_NAV.find(n => n.id === active)?.featureKey

    if (activeFeatureKey && !features[activeFeatureKey]) {
      const first = visibleNav[0]

      if (first) {
        setActive(first.id)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for programmatic navigation dari SDK
  useEffect(() => {
    const handler = (e: Event) => {
      const feature = (e as CustomEvent).detail?.feature as ActiveFeature
      if (!feature) return
      // Hanya navigate ke fitur yang aktif
      const featureKey = ALL_NAV.find(n => n.id === feature)?.featureKey
      if (featureKey && features[featureKey]) setActive(feature)
    }
    window.addEventListener('his_ai:navigate', handler)
    return () => window.removeEventListener('his_ai:navigate', handler)
  }, [features])

  const handleClose = () => {
    ;(window as unknown as { his_ai_widget?: { close: () => void } }).his_ai_widget?.close()
  }

  return (
    <div class="widget-root">
      {/* ── Header ── */}
      <header class="widget-header">
        <div class="widget-header-left">
          <div class="widget-avatar">
            <img src={logo} alt="AI Medis" width="32" height="32" />
          </div>
          <div>
            <p class="widget-header-title">Tanya MAIA</p>
            <p class="widget-header-sub">
              <span class="widget-status-dot" />
              {cfg.userName ? `Halo, ${cfg.userName}` : 'Siap membantu'}
            </p>
          </div>
        </div>
        <button class="widget-header-close" onClick={handleClose} aria-label="Tutup">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {/* ── Content ── */}
      <main class="widget-content">
        {active === 'chat' && features.chat && (
          <ChatFeature callbacks={{ onResultChat: cfg.onResultChat, onResultChatMessage: cfg.onResultChatMessage }} />
        )}
        {active === 'speech-to-soap' && features.soap && (
          <SpeechToSoapFeature callbacks={{ onResultSOAP: cfg.onResultSOAP }} />
        )}
        {active === 'clinical-pathway' && features.pathway && (
          <ClinicalPathwayFeature
            callbacks={{ onResultPathway: cfg.onResultPathway }}
            age={cfg.age}
            isBPJS={cfg.isBPJS}
            departmentId={cfg.departmentId}
          />
        )}
        {active === 'eclaim' && features.eclaim && <EClaimFeature callbacks={{ onResultEClaim: cfg.onResultEClaim }} />}
      </main>

      {/* ── Bottom Nav — hanya tampil fitur yang enabled ── */}
      {visibleNav.length > 1 && (
        <nav class="widget-nav">
          {visibleNav.map(item => (
            <button
              key={item.id}
              class={`widget-nav-item ${active === item.id ? 'widget-nav-item--active' : ''}`}
              onClick={() => setActive(item.id)}
              aria-label={item.label}
            >
              {item.icon}
              <span class="widget-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
