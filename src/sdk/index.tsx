import { render } from 'preact'
import { mountShadowHost } from './shadowRoot'
import type { SDKConfig, ActiveFeature } from '@/types'
import { App } from '@/App'
import logo from '@/assets/MAIA_Head_Transparent.png'
import merge from 'deepmerge'

/**
 * his_ai_widget SDK — IIFE Library
 *
 * Usage:
 *   <script src="dist/his_ai_widget.js"></script>
 *   <script>
 *     his_ai_widget.init({ userName: 'dr. Budi' })
 *   </script>
 *
 * Everything the widget renders (the FAB button and the panel) lives inside
 * one shadow root, mounted on a single `#his-ai-widget-host` element on
 * document.body — see ./shadowRoot.ts. That's what keeps the widget's
 * styling independent from whatever project it gets dropped into.
 */

// ─── Internal State ───────────────────────────────────────────────────────────

let _config: SDKConfig = {}
let _isOpen = false
let _mounted = false
let _host: HTMLElement | null = null
let _container: HTMLElement | null = null
let _fabBtn: HTMLElement | null = null
let _fabLabel: HTMLElement | null = null

// ─── DOM Helpers ──────────────────────────────────────────────────────────────

function mountFAB(root: ShadowRoot): void {
  if (root.querySelector('#his-ai-fab')) return

  const fab = document.createElement('div')
  fab.id = 'his-ai-fab'
  fab.innerHTML = `
    
    <button id="his-ai-fab-btn" class="sdk-fab-btn" aria-label="Buka AI Medis Widget">
    <div class="sdk-fab-tooltip-wrapper">
      <div id="his-ai-fab-label" class="sdk-fab-tooltip">Tanya MAIA</div>
      </div>
      <img class="sdk-fab-icon-open" src="${logo}" alt="AI Medis" width="48" height="48" />
      <svg class="sdk-fab-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `
  root.appendChild(fab)

  _fabBtn = root.querySelector<HTMLElement>('#his-ai-fab-btn')
  //nanti di bikin tooltip
  _fabLabel = root.querySelector<HTMLElement>('#his-ai-fab-label')
  _fabBtn?.addEventListener('click', () => HISWidget.toggle())
}

function mountWidget(root: ShadowRoot): void {
  if (_mounted) return

  _container = document.createElement('div')
  _container.id = 'his-ai-widget-container'
  _container.className = 'sdk-widget-panel'
  root.appendChild(_container)

  render(<App />, _container)
  _mounted = true
}

// ─── SDK Object ───────────────────────────────────────────────────────────────

const HISWidget = {
  init(config: SDKConfig = {}): void {
    _config = { theme: 'light', ...config }

    const doMount = () => {
      const { host, root } = mountShadowHost()
      _host = host
      mountFAB(root)
      mountWidget(root)
      _host.setAttribute('data-theme', _config.theme ?? 'light')
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', doMount)
    } else {
      doMount()
    }

    console.info('[his_ai_widget] v0.2.0 initialized', {
      user: _config.userName ?? '(anonymous)',
      // mock: !_config.apiBaseUrl,
    })
  },

  open(): void {
    if (!_isOpen) this.toggle()
  },

  close(): void {
    if (_isOpen) this.toggle()
  },

  toggle(): void {
    _isOpen = !_isOpen
    _container?.classList.toggle('sdk-widget-panel--open', _isOpen)
    _fabBtn?.classList.toggle('sdk-fab-btn--open', _isOpen)
    if (_fabLabel) {
      if (_isOpen) {
        _fabLabel.style.display = 'none'
      } else {
        _fabLabel.style.display = 'inline' // atau 'block', sesuai kebutuhan layout
        _fabLabel.innerHTML = 'Tanya MAIA'
      }
    }
    window.dispatchEvent(new CustomEvent(_isOpen ? 'his_ai:open' : 'his_ai:close'))
  },

  setPatient(ctx: Pick<SDKConfig, 'patientId' | 'visitId' | 'doctorId' | 'departmentId'>): void {
    _config = { ..._config, ...ctx }
  },

  navigateTo(feature: ActiveFeature): void {
    window.dispatchEvent(new CustomEvent('his_ai:navigate', { detail: { feature } }))
    this.open()
  },

  get isOpen(): boolean {
    return _isOpen
  },

  setConfig(config: Partial<SDKConfig>): void {
    _config = merge(_config, config)

    // Apply theme change if provided
    if (config.theme && _host) {
      _host.setAttribute('data-theme', config.theme)
    }

    window.dispatchEvent(new CustomEvent('his_ai:config-updated', { detail: config }))
  },

  /** @internal — dibaca oleh App.tsx */
  _getConfig(): SDKConfig {
    return _config
  },
}

// ─── Expose ke window ─────────────────────────────────────────────────────────
// Assign ke window secara eksplisit — ini yang membuat his_ai_widget tersedia
// sebagai global variable di halaman HTML

declare global {
  interface Window {
    his_ai_widget: typeof HISWidget
  }
}

window.his_ai_widget = HISWidget
