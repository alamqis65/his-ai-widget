/**
 * generate-styles.js
 *
 * Auto-generate src/sdk/injectStyles.ts dari src/styles/index.css
 * Dipanggil otomatis sebelum build:lib via "prebuild:lib" script di package.json
 *
 * Cara run manual: node scripts/generate-styles.js
 */

const fs = require('fs')
const path = require('path')

const cssPath = path.join(__dirname, '../src/styles/index.css')
const outPath = path.join(__dirname, '../src/sdk/injectStyles.ts')

const css = fs.readFileSync(cssPath, 'utf-8')

// Escape untuk template literal
const escaped = css
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${')

const output = `/**
 * injectStyles.ts — AUTO-GENERATED
 *
 * CSS di-embed langsung ke dalam JS bundle.
 * Dipanggil saat his_ai_widget.init() — inject ke <head> sekali saja.
 *
 * JANGAN edit file ini manual.
 * Edit src/styles/index.css lalu jalankan: npm run build:lib
 */

const CSS = \`${escaped}\`

let _injected = false

export function injectStyles(): void {
  if (_injected) return
  if (typeof document === 'undefined') return

  // Cek apakah sudah ada (support multiple init() call)
  if (document.getElementById('his-ai-widget-css')) {
    _injected = true
    return
  }

  const style = document.createElement('style')
  style.id = 'his-ai-widget-css'
  style.textContent = CSS
  document.head.appendChild(style)
  _injected = true
}
`

fs.writeFileSync(outPath, output, 'utf-8')
console.log(`[generate-styles] ✓ injectStyles.ts generated (${(css.length / 1024).toFixed(1)}KB CSS embedded)`)
