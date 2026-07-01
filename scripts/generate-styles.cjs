/**
 * generate-styles.cjs
 *
 * Auto-generates src/sdk/injectStyles.ts from the CSS files listed in
 * src/styles/index.css.
 *
 * The CSS is split into several files (tokens.css, layout.css, chat.css...)
 * for readability, but the library build embeds it as a single JS string
 * (see injectStyles.ts) so the widget can inject one <style> tag at runtime
 * without needing a separate stylesheet request. This script is what
 * combines the split files back into that one string.
 *
 * It only understands simple `@import "./file.css";` lines — one file deep,
 * no nesting. That's all index.css uses; if that ever changes, update the
 * regex below.
 *
 * Called automatically before build:lib via "prebuild:lib" in package.json.
 * To run manually: node scripts/generate-styles.cjs
 */

const fs = require('fs')
const path = require('path')

const STYLES_DIR = path.join(__dirname, '../src/styles')
const ENTRY_PATH = path.join(STYLES_DIR, 'index.css')
const OUT_PATH = path.join(__dirname, '../src/sdk/injectStyles.ts')

const IMPORT_LINE = /^@import\s+["']\.\/(.+\.css)["'];?\s*$/

/** Reads index.css and returns the combined CSS of every @import'd file, in order. */
function buildCombinedCss() {
  const entry = fs.readFileSync(ENTRY_PATH, 'utf-8')
  const importedFiles = entry
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.startsWith('@import'))
    .map(line => {
      const match = line.match(IMPORT_LINE)
      if (!match) {
        throw new Error(`[generate-styles] Could not parse import line: "${line}"`)
      }
      return match[1]
    })

  if (importedFiles.length === 0) {
    throw new Error('[generate-styles] No @import statements found in src/styles/index.css')
  }

  return importedFiles
    .map(fileName => fs.readFileSync(path.join(STYLES_DIR, fileName), 'utf-8'))
    .join('')
}

function escapeForTemplateLiteral(css) {
  return css
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
}

const css = buildCombinedCss()
const escaped = escapeForTemplateLiteral(css)

const output = `/**
 * injectStyles.ts — AUTO-GENERATED, do not edit by hand.
 *
 * Source: src/styles/index.css and the files it imports.
 * Regenerate with: npm run generate:styles (also runs automatically before build:lib)
 *
 * The CSS is embedded directly into the JS bundle so the widget can inject
 * it into <head> once, at his_ai_widget.init() time.
 */

const CSS = \`${escaped}\`

let _injected = false

export function injectStyles(): void {
  if (_injected) return
  if (typeof document === 'undefined') return

  // Guard against double-injection if init() is called more than once.
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

fs.writeFileSync(OUT_PATH, output.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'), 'utf-8')
console.log(`[generate-styles] ✓ injectStyles.ts generated (${(css.length / 1024).toFixed(1)}KB CSS embedded from ${path.relative(process.cwd(), ENTRY_PATH)})`)
