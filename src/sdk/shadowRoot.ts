/**
 * shadowRoot.ts — mounts the widget inside its own Shadow DOM.
 *
 * Why: this widget gets dropped into other people's projects, each with
 * their own global CSS (resets, `button { ... }` overrides, font-families,
 * z-index wars, etc). Without isolation, those styles bleed into the
 * widget and the widget's own CSS (e.g. `.btn`, `button`, `*`) bleeds back
 * out onto the host page. A shadow root fixes both directions at once:
 *
 *   - Styles defined inside the shadow root only ever apply inside it.
 *   - Styles from the host page don't reach in (except normal CSS
 *     inheritance — font/color — and custom properties, which is what
 *     tokens.css relies on for theming, see that file's comment).
 *
 * Where the CSS comes from: `import widgetCss from '@/styles/index.css?inline'`.
 * Vite resolves index.css's `@import` chain (tokens, reset, layout, chat,
 * ...), runs it through its normal CSS pipeline, and hands back the fully
 * bundled result as a plain string at build time — no separate
 * generate-styles.cjs step or checked-in generated file required.
 */
import widgetCss from '@/styles/index.css?inline'

export const WIDGET_HOST_ID = 'his-ai-widget-host'
const WIDGET_STYLE_ID = 'his-ai-widget-css'

let _host: HTMLElement | null = null
let _shadowRoot: ShadowRoot | null = null

/**
 * Creates (once) the `<div id="his-ai-widget-host">` on document.body,
 * attaches an open shadow root to it, and injects the widget's stylesheet
 * as a single <style> tag inside that shadow root.
 *
 * Idempotent — safe to call from multiple places (FAB mount, panel mount,
 * repeated init() calls); the host/shadow root/style are only created once.
 */
export function mountShadowHost(): { host: HTMLElement; root: ShadowRoot } {
  if (_host && _shadowRoot) return { host: _host, root: _shadowRoot }

  _host = document.getElementById(WIDGET_HOST_ID)
  if (!_host) {
    _host = document.createElement('div')
    _host.id = WIDGET_HOST_ID
    document.body.appendChild(_host)
  }

  _shadowRoot = _host.shadowRoot ?? _host.attachShadow({ mode: 'open' })

  // Stop key events from bubbling out to the host page (capture phase,
  // as high up as possible: right on the shadow host itself).
  //
  // Why: once a keydown event crosses the shadow boundary, any listener
  // on document/window sees `event.target` retargeted to `_host` (a plain
  // <div>), not the actual <input>/<textarea> inside our shadow tree —
  // that's the standard Shadow DOM event-retargeting behavior. Host pages
  // sometimes have global keydown guards (e.g. legacy "Backspace navigates
  // back" prevention, common in .NET/WebForms apps, or keybinding
  // libraries) that check `event.target.tagName` to decide whether the
  // user is typing in a field. Because the retargeted element is a <div>,
  // those checks fail and the host calls preventDefault() on keys like
  // Backspace — even though the user is legitimately typing inside our
  // widget. Stopping propagation here keeps all such key events contained
  // to the widget, regardless of which internal component receives them.
  for (const type of ['keydown', 'keyup', 'keypress']) {
    _host.addEventListener(type, e => e.stopPropagation(), { capture: true })
  }

  if (!_shadowRoot.querySelector(`#${WIDGET_STYLE_ID}`)) {
    const style = document.createElement('style')
    style.id = WIDGET_STYLE_ID
    style.textContent = widgetCss
    _shadowRoot.appendChild(style)
  }

  return { host: _host, root: _shadowRoot }
}
