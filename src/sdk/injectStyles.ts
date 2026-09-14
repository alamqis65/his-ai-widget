/**
 * injectStyles.ts — AUTO-GENERATED, do not edit by hand.
 *
 * Source: src/styles/index.css and the files it imports.
 * Regenerate with: npm run generate:styles (also runs automatically before build:lib)
 *
 * The CSS is embedded directly into the JS bundle so the widget can inject
 * it into <head> once, at his_ai_widget.init() time.
 */

const CSS = `@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap");

/* ═══════════════════════════════════════════════════════════════════════════
 * Design tokens — theme system
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Defined on :host (not :root) because this stylesheet is injected inside
 * the widget's shadow root — \`:root\` only ever matches the top-level
 * document's <html>, never a shadow root, so it would silently match
 * nothing here.
 *
 * Because these are plain CSS custom properties, a parent project can still
 * re-theme the widget from its own stylesheet by targeting the host element
 * directly, e.g.:
 *
 *   #his-ai-widget-host { --brand: #7c3aed; --widget-w: 420px; }
 *
 * Custom properties inherit through the shadow boundary, and a selector in
 * the outer page targeting the host element takes precedence over the
 * \`:host\` rules below at equal specificity — so the parent project's values
 * win.
 *
 * ─── How theme switching works ──────────────────────────────────────────
 * \`his_ai_widget.init({ theme: 'dark' })\` / \`.setConfig({ theme: 'dark' })\`
 * sets a \`data-theme="dark"\` attribute on the shadow host element (see
 * src/sdk/index.tsx). Every rule below scoped to \`:host([data-theme='dark'])\`
 * then wins over the \`:host\` defaults for that one host element — no JS
 * re-render needed, it's pure CSS cascade.
 *
 * ─── Two layers of tokens ───────────────────────────────────────────────
 * 1. STRUCTURAL tokens (radius, shadow shape, spacing, font, sizing) — these
 *    describe shape/rhythm, not color, and are the same across every theme.
 *    They live in the single \`:host { ... }\` block below.
 * 2. COLOR tokens (semantic: brand, surface, text, status colors) — these
 *    differ per theme, so each theme gets its own \`:host([data-theme='X'])\`
 *    block. Every component file in this folder should reference *only*
 *    these color tokens (never raw hex), so switching themes reliably
 *    recolors the whole widget.
 *
 * ─── Adding a new theme ─────────────────────────────────────────────────
 * 1. Add the theme name to \`WidgetTheme\` in src/types/sdk.ts, e.g.:
 *      export type WidgetTheme = 'light' | 'dark' | 'midnight-blue'
 * 2. Copy one of the \`:host([data-theme='...'])\` color blocks below, rename
 *    the selector to your theme, and adjust the values. You only need to
 *    override the tokens that should differ from \`:host\` (the light
 *    defaults) — anything you omit falls back to the default block.
 * 3. That's it — no component CSS needs to change, as long as it already
 *    consumes the semantic tokens instead of hardcoded colors.
 * ════════════════════════════════════════════════════════════════════════ */

/* ─── Structural tokens (theme-independent) ────────────────────────────── */
:host {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-full: 9999px;

  --font: "DM Sans", system-ui, sans-serif;
  --mono: "DM Mono", monospace;

  --nav-h: 64px;
  --header-h: 56px;
  --widget-w: 410px;
  --widget-h: 620px;
}

/* ─── Theme: light (default) ──────────────────────────────────────────────
 * Also the fallback for hosts without a \`data-theme\` attribute at all, so
 * the widget still looks right if \`init()\` is ever called without a theme.
 * ────────────────────────────────────────────────────────────────────── */
:host,
:host([data-theme='light']) {
  /* Brand */
  --brand: #1a9e76;
  --brand-dark: #0f7558;
  --brand-darker: #085041;
  --brand-light: #e6f7f2;
  --brand-light-border: #b2e8d8;
  --brand-light-hover: #cff0e8;
  --brand-tint-weak: rgba(29, 158, 117, 0.06);
  --brand-glow-faint: rgba(15, 110, 86, 0.04);
  --brand-glow-weak: rgba(15, 110, 86, 0.07);
  --brand-glow-strong: rgba(15, 110, 86, 0.1);

  /* Surfaces */
  --bg: #ffffff;
  --bg-2: #f8fafc;
  --bg-3: #f1f5f9;
  --surface-1: #ffffff;
  --overlay: rgba(15, 23, 42, 0.22);

  /* Borders */
  --border: #e2e8f0;
  --border-2: #cbd5e1;

  /* Text */
  --text-1: #0f172a;
  --text-2: #475569;
  --text-3: #94a3b8;

  /* Status: success (green) */
  --color-success: #22c55e;
  --color-success-strong: #15803d;
  --color-success-bg: #f0fdf4;
  --color-success-soft: #dcfce7;
  --color-success-border: #bbf7d0;

  /* Status: danger (red) */
  --color-danger: #dc2626;
  --color-danger-strong: #dc2626;
  --color-danger-bg: #fef2f2;
  --color-danger-soft: #fecaca;
  --color-danger-border: #fecaca;

  /* Status: warning (amber) */
  --color-warning: #d97706;
  --color-warning-strong: #b45309;
  --color-warning-bg: #fffbeb;
  --color-warning-soft: #fde68a;
  --color-warning-border: rgba(217, 119, 6, 0.35);

  /* Accent: info (blue) */
  --color-info: #3b82f6;
  --color-info-strong: #1d4ed8;
  --color-info-bg: #eff6ff;
  --color-info-soft: #dbeafe;

  /* Accent: purple */
  --color-purple: #a855f7;
  --color-purple-strong: #7e22ce;
  --color-purple-bg: #faf5ff;
  --color-purple-soft: #f3e8ff;

  /* Accent: teal */
  --color-teal: #14b8a6;
  --color-teal-strong: #0f766e;
  --color-teal-bg: #f0fdfa;
  --color-teal-soft: #ccfbf1;

  /* Accent: orange */
  --color-orange: #f97316;
  --color-orange-strong: #c2410c;
  --color-orange-bg: #fff7ed;
  --color-orange-soft: #ffedd5;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgb(0 0 0 / 0.08);
  --shadow-md: 0 4px 16px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 12px 40px rgb(0 0 0 / 0.14);
  --shadow-widget: 0 24px 64px rgb(0 0 0 / 0.18), 0 0 0 1px rgb(0 0 0 / 0.06);

  /* Brand-tinted focus rings / glows (buttons, inputs, FAB) */
  --brand-shadow-sm: rgba(26, 158, 118, 0.12);
  --brand-shadow-md: rgba(26, 158, 118, 0.2);
  --brand-shadow-lg: rgba(26, 158, 118, 0.3);
  --brand-shadow-xl: rgba(26, 158, 118, 0.45);
  --brand-shadow-xl-hover: rgba(26, 158, 118, 0.55);
  --color-danger-shadow: rgba(220, 38, 38, 0.3);

  /* Neutral "closed / inactive" state — used by the FAB when the panel is
     open, intentionally brand-independent so it reads as neutral in every
     theme */
  --neutral-strong-1: #475569;
  --neutral-strong-2: #1e293b;
}

/* ─── Theme: dark ─────────────────────────────────────────────────────── */
:host([data-theme='dark']) {
  /* Brand — kept close to the light brand hue but a touch brighter so it
     still pops against dark surfaces */
  --brand: #2dd4a7;
  --brand-dark: #1a9e76;
  --brand-darker: #0f7558;
  --brand-light: rgba(45, 212, 167, 0.14);
  --brand-light-border: rgba(45, 212, 167, 0.32);
  --brand-light-hover: rgba(45, 212, 167, 0.2);
  --brand-tint-weak: rgba(45, 212, 167, 0.1);
  --brand-glow-faint: rgba(45, 212, 167, 0.08);
  --brand-glow-weak: rgba(45, 212, 167, 0.12);
  --brand-glow-strong: rgba(45, 212, 167, 0.18);

  /* Surfaces */
  --bg: #111827;
  --bg-2: #1a2333;
  --bg-3: #232f42;
  --surface-1: #1a2333;
  --overlay: rgba(0, 0, 0, 0.5);

  /* Borders */
  --border: #2b3849;
  --border-2: #3c4a5e;

  /* Text */
  --text-1: #f1f5f9;
  --text-2: #b0bcce;
  --text-3: #7c8aa0;

  /* Status: success (green) */
  --color-success: #34d399;
  --color-success-strong: #6ee7b7;
  --color-success-bg: rgba(52, 211, 153, 0.12);
  --color-success-soft: rgba(52, 211, 153, 0.2);
  --color-success-border: rgba(52, 211, 153, 0.32);

  /* Status: danger (red) */
  --color-danger: #f87171;
  --color-danger-strong: #fca5a5;
  --color-danger-bg: rgba(248, 113, 113, 0.12);
  --color-danger-soft: rgba(248, 113, 113, 0.22);
  --color-danger-border: rgba(248, 113, 113, 0.32);

  /* Status: warning (amber) */
  --color-warning: #fbbf24;
  --color-warning-strong: #fcd34d;
  --color-warning-bg: rgba(251, 191, 36, 0.12);
  --color-warning-soft: rgba(251, 191, 36, 0.22);
  --color-warning-border: rgba(251, 191, 36, 0.35);

  /* Accent: info (blue) */
  --color-info: #60a5fa;
  --color-info-strong: #93c5fd;
  --color-info-bg: rgba(96, 165, 250, 0.12);
  --color-info-soft: rgba(96, 165, 250, 0.22);

  /* Accent: purple */
  --color-purple: #c084fc;
  --color-purple-strong: #d8b4fe;
  --color-purple-bg: rgba(192, 132, 252, 0.12);
  --color-purple-soft: rgba(192, 132, 252, 0.22);

  /* Accent: teal */
  --color-teal: #2dd4bf;
  --color-teal-strong: #5eead4;
  --color-teal-bg: rgba(45, 212, 191, 0.12);
  --color-teal-soft: rgba(45, 212, 191, 0.22);

  /* Accent: orange */
  --color-orange: #fb923c;
  --color-orange-strong: #fdba74;
  --color-orange-bg: rgba(251, 146, 60, 0.12);
  --color-orange-soft: rgba(251, 146, 60, 0.22);

  /* Shadows — dark surfaces need a stronger, blacker shadow to read as
     "elevated" since there's no light background for a soft gray shadow
     to show up against */
  --shadow-sm: 0 1px 3px rgb(0 0 0 / 0.35);
  --shadow-md: 0 4px 16px rgb(0 0 0 / 0.45);
  --shadow-lg: 0 12px 40px rgb(0 0 0 / 0.55);
  --shadow-widget: 0 24px 64px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(255 255 255 / 0.06);

  /* Brand-tinted focus rings / glows (buttons, inputs, FAB) */
  --brand-shadow-sm: rgba(45, 212, 167, 0.18);
  --brand-shadow-md: rgba(45, 212, 167, 0.28);
  --brand-shadow-lg: rgba(45, 212, 167, 0.38);
  --brand-shadow-xl: rgba(45, 212, 167, 0.4);
  --brand-shadow-xl-hover: rgba(45, 212, 167, 0.5);
  --color-danger-shadow: rgba(248, 113, 113, 0.35);

  /* Neutral "closed / inactive" state — same across themes on purpose */
  --neutral-strong-1: #475569;
  --neutral-strong-2: #1e293b;
}

/* ─── Reset ───────────────────────────────────────────────────────────────── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Was \`html, body\` — but this stylesheet lives inside the widget's shadow
 * root, where there is no <html>/<body> to match. :host is the equivalent
 * "root of this tree" target, and font/color set here inherit down into
 * everything the widget renders without touching the parent page. */
:host {
  font-family: var(--font);
  color: var(--text-1);
  -webkit-font-smoothing: antialiased;
}
button {
  font-family: var(--font);
  cursor: pointer;
}
input,
textarea {
  font-family: var(--font);
}

/* ─── Widget Root ─────────────────────────────────────────────────────────── */
.widget-root {
  display: flex;
  flex-direction: column;
  width: var(--widget-w);
  height: var(--widget-h);
  background: var(--bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-widget);
  position: relative;
}

/* ─── Header ──────────────────────────────────────────────────────────────── */
.widget-header {
  height: var(--header-h);
  min-height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.widget-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.widget-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.widget-header-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-1);
  line-height: 1.2;
}

.widget-header-sub {
  font-size: 11px;
  color: var(--text-3);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 1px;
}

.widget-status-dot {
  width: 6px;
  height: 6px;
  background: var(--color-success);
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.widget-header-close {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-3);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 120ms ease;
}
.widget-header-close:hover {
  background: var(--bg-3);
  color: var(--text-2);
}

/* ─── Content ─────────────────────────────────────────────────────────────── */
.widget-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ─── Bottom Nav ──────────────────────────────────────────────────────────── */
.widget-nav {
  height: var(--nav-h);
  min-height: var(--nav-h);
  display: flex;
  align-items: stretch;
  border-top: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
}

.widget-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: none;
  background: transparent;
  color: var(--text-3);
  padding: 8px 4px;
  transition: all 150ms ease;
  position: relative;
}

.widget-nav-item:hover {
  color: var(--text-2);
  background: var(--bg-2);
}

.widget-nav-item--active {
  color: var(--brand) !important;
}

.widget-nav-item--active::before {
  content: "";
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--brand);
  border-radius: 0 0 2px 2px;
}

.widget-nav-label {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
}

/* ─── Feature Layout (shared) ─────────────────────────────────────────────── */
.feature-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  gap: 14px;
}

.feature-layout::-webkit-scrollbar {
  width: 3px;
}
.feature-layout::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.feature-header {
  flex-shrink: 0;
}

.feature-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-1);
  letter-spacing: -0.2px;
}

.feature-subtitle {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 3px;
  line-height: 1.5;
}

/* ─── Form elements ───────────────────────────────────────────────────────── */
.feature-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-2);
  margin-bottom: -4px;
}

.form-input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--text-1);
  background: var(--bg-2);
  outline: none;
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease;
}

.form-input:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-shadow-sm);
  background: var(--bg);
}

.form-input::placeholder {
  color: var(--text-3);
}

.form-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-chip {
  background: var(--brand-light);
  border: 1px solid var(--brand-light-border);
  color: var(--brand-dark);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 500;
  transition: all 120ms ease;
}

.suggestion-chip:hover {
  background: var(--brand-light-hover);
  border-color: var(--brand);
}

/* ─── Buttons ─────────────────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 120ms ease;
  white-space: nowrap;
  padding: 9px 16px;
}

.btn:disabled {
  cursor: not-allowed;
}

.btn-primary-custom {
  background: var(--brand);
  color: white;
  border-color: var(--brand);
}
.btn-primary-custom:hover:not(:disabled) {
  background: var(--brand-dark);
  border-color: var(--brand-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--brand-shadow-lg);
}

.btn-danger-custom {
  background: var(--brand);
  color: white;
  border-color: var(--brand);
}
.btn-danger-custom:hover:not(:disabled) {
  background: var(--brand-dark);
  border-color: var(--brand-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--color-danger-shadow);
}

.btn-secondary {
  background: var(--bg);
  color: var(--text-2);
  border-color: var(--border);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--bg-2);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}
.btn-full {
  width: 100%;
}

/* ─── Feature result ──────────────────────────────────────────────────────── */
.feature-result {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
}

.result-badge--green {
  background: var(--color-success-soft);
  color: var(--color-success-strong);
}

.result-meta {
  font-size: 11px;
  color: var(--text-3);
  font-family: var(--mono);
}

.feature-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 4px;
}

.feature-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid var(--border);
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-1);
}
.loading-sub {
  font-size: 12px;
  color: var(--text-3);
}

.feature-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--color-danger);
}

/* ─── Chat Layout ─────────────────────────────────────────────────────────── */
.chat-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.chat-messages::-webkit-scrollbar {
  width: 3px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

/* ─── Chat Empty State ────────────────────────────────────────────────────── */
.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 16px;
  gap: 6px;
}

.chat-empty-avatar {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 6px;
}

.chat-empty-greeting {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-1);
}

.chat-empty-sub {
  font-size: 12px;
  color: var(--text-3);
  line-height: 1.5;
  max-width: 210px;
}

.chat-suggestions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
  margin-top: 10px;
}

.chat-suggestion-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  text-align: left;
  transition: all 120ms ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-suggestion-card:hover {
  background: var(--brand-light);
  border-color: var(--brand-light-border);
}

.chat-suggestion-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--surface-1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand);
  font-size: 13px;
  border: 1px solid var(--border);
  margin-bottom: 2px;
}

.chat-suggestion-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-1);
  line-height: 1.3;
}

/* ─── Chat Messages ───────────────────────────────────────────────────────── */
.chat-message {
  display: flex;
  gap: 7px;
  animation: msg-in 180ms ease;
}

@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message--user {
  flex-direction: row-reverse;
}

.chat-msg-avatar {
  width: 26px;
  height: 26px;
  min-width: 26px;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-top: 2px;
}

.chat-msg-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: 76%;
}

.chat-message--user .chat-msg-body {
  align-items: flex-end;
}

.chat-msg-bubble {
  padding: 9px 12px;
  border-radius: var(--radius-lg);
  font-size: 13px;
  line-height: 1.55;
  background: var(--bg-2);
  border: 1px solid var(--border);
  color: var(--text-1);
  word-break: break-word;
}

.chat-message--user .chat-msg-bubble {
  background: var(--brand);
  color: white;
  border-color: var(--brand);
  border-bottom-right-radius: 4px;
}

.chat-message--assistant .chat-msg-bubble {
  border-bottom-left-radius: 4px;
}

.chat-msg-time {
  font-size: 10px;
  color: var(--text-3);
  padding: 0 2px;
}

.chat-msg-take-result {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  padding: 3px 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-2);
  color: var(--brand);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 120ms,
    border-color 120ms;
}

.chat-msg-take-result:hover {
  background: var(--brand);
  border-color: var(--brand);
  color: white;
}

.chat-msg-take-result svg {
  flex-shrink: 0;
}

.chat-error-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--color-danger-bg);
  border: 1px solid var(--color-danger-border);
  border-radius: var(--radius-md);
  font-size: 12px;
  color: var(--color-danger-strong);
  margin: 0 14px;
}

/* ─── Typing Indicator ────────────────────────────────────────────────────── */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 2px;
}

.typing-dot {
  width: 5px;
  height: 5px;
  background: var(--text-3);
  border-radius: 50%;
  animation: typing-bounce 1.2s ease-in-out infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* ─── Chat Input ──────────────────────────────────────────────────────────── */
.chat-input-wrap {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
}

.chat-input-textarea {
  flex: 1;
  resize: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: 13px;
  color: var(--text-1);
  background: var(--bg-2);
  outline: none;
  max-height: 100px;
  overflow-y: auto;
  line-height: 1.5;
  transition:
    border-color 120ms,
    box-shadow 120ms;
}

.chat-input-textarea:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-shadow-sm);
  background: var(--bg);
}

.chat-input-textarea::placeholder {
  color: var(--text-3);
}

.chat-input-send {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  border: none;
  background: var(--brand);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 120ms ease;
  flex-shrink: 0;
}

.chat-input-send:hover:not(:disabled) {
  background: var(--brand-dark);
  transform: translateY(-1px);
}

.chat-input-send:disabled {
  background: var(--border);
  color: var(--text-3);
  cursor: not-allowed;
}

/* ─── Speech to SOAP ──────────────────────────────────────────────────────── */
.sts-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  gap: 14px;
}

.sts-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px; /* jarak antar step lebih rapat */
  margin-bottom: 16px;
}

.sts-step {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
}

.sts-step:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 10px;
  left: 50%;
  width: 40px; /* garis lebih pendek */
  height: 1px;
  background: var(--border);
  z-index: 0;
}

.sts-step--done:not(:last-child)::after {
  background: var(--brand);
}

.sts-step-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-3);
  border: 1.5px solid var(--border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-3);
  z-index: 1;
  transition: all 150ms ease;
}

.sts-step--active .sts-step-dot {
  background: var(--brand);
  border-color: var(--brand);
  color: white;
  box-shadow: 0 0 0 3px var(--brand-shadow-md);
}

.sts-step--done .sts-step-dot {
  background: var(--brand-light);
  border-color: var(--brand);
  color: var(--brand-dark);
}

.sts-step-label {
  font-size: 9px;
  color: var(--text-3);
  font-weight: 500;
  text-align: center;
}

.sts-step--active .sts-step-label {
  color: var(--brand-dark);
  font-weight: 600;
}

.sts-step--done .sts-step-label {
  color: var(--brand);
}

/* Recorder */
.recorder-view {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 20px 16px;
  flex: 1;
}

.recorder-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.recorder-ring--active {
  border-color: var(--brand-light-border);
  box-shadow:
    0 0 0 8px var(--brand-glow-weak),
    0 0 0 16px var(--brand-glow-faint);
  animation: ring-pulse 1.5s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%,
  100% {
    box-shadow:
      0 0 0 8px var(--brand-glow-weak),
      0 0 0 16px var(--brand-glow-faint);
  }
  50% {
    box-shadow:
      0 0 0 12px var(--brand-glow-strong),
      0 0 0 22px var(--brand-glow-weak);
  }
}

.recorder-btn {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
  box-shadow: var(--shadow-md);
}

.recorder-btn--start {
  background: var(--brand);
  color: white;
}
.recorder-btn--start:hover {
  background: var(--brand-dark);
  transform: scale(1.04);
}
.recorder-btn--stop {
  background: var(--brand-dark);
  color: white;
}
.recorder-btn--stop:hover {
  background: var(--brand-darker);
}
.recorder-btn:disabled {
  background: var(--bg-3);
  color: var(--text-3);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.recorder-duration {
  font-size: 26px;
  font-weight: 600;
  font-family: var(--mono);
  color: var(--brand-darker);
  letter-spacing: 0.05em;
}
.recorder-status-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
}
.recorder-status-text--rec {
  color: var(--brand-darker);
  display: flex;
  align-items: center;
  gap: 6px;
}
.rec-dot {
  width: 7px;
  height: 7px;
  background: var(--brand-darker);
  border-radius: 50%;
  animation: rec-blink 1s ease-in-out infinite;
}
@keyframes rec-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}
.recorder-hint {
  font-size: 11px;
  color: var(--text-3);
  max-width: 200px;
  line-height: 1.5;
  text-align: center;
}

/* Control row: cancel · stop · pause, shown together while recording/paused */
.recorder-controls-row {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 22px;
}
.recorder-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}
.recorder-control--main {
  gap: 10px;
}
.recorder-control-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-3);
}
.recorder-btn-side {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  border: 1.5px solid var(--border-2);
  transition: all 150ms ease;
  box-shadow: var(--shadow-sm);
}
.recorder-btn-side:hover {
  transform: scale(1.05);
}
.recorder-btn-side--cancel {
  color: var(--color-danger);
  border-color: var(--color-danger-border);
}
.recorder-btn-side--cancel:hover {
  background: var(--color-danger-bg);
  border-color: var(--color-danger);
}
.recorder-btn-side--pause {
  color: var(--brand-darker);
  border-color: var(--brand-light-border);
}
.recorder-btn-side--pause:hover {
  background: var(--brand-light);
  border-color: var(--brand);
}
.recorder-ring--paused {
  border-color: var(--color-warning-border);
  box-shadow: none;
  animation: none;
}
.recorder-status-text--paused {
  color: var(--color-warning-strong);
  display: flex;
  align-items: center;
  gap: 6px;
}
.pause-dot {
  width: 7px;
  height: 7px;
  background: var(--color-warning);
  border-radius: 50%;
}
.recorder-processing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.recorder-visualizer {
  width: 100%;
  height: 80px;
  display: block;
  background: var(--brand-tint-weak);
  border-radius: 8px;
}

/* Transcript */
.transcript-review {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.transcript-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-1);
}
.transcript-sub {
  font-size: 11px;
  color: var(--text-3);
  margin-top: 2px;
}
.transcript-textarea {
  flex: 1;
  min-height: 140px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-1);
  background: var(--bg-2);
  outline: none;
  resize: none;
  transition: border-color 120ms;
}
.transcript-textarea:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-shadow-sm);
  background: var(--bg);
}
.transcript-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* SOAP Result */

.soap-list {
  margin: 4px 0 8px 0;
  padding-left: 1.2rem;
  line-height: 1.6;
}

.soap-list li + li {
  margin-top: 4px;
}

.soap-plan > div {
  margin-bottom: 8px;
}

.soap-plan strong {
  display: block;
  margin-bottom: 4px;
  color: var(--text-2);
}

/* Object content is rendered as stacked "title then paragraph" fields
   rather than a two-column table — long values used to get squeezed
   against the left-hand label column, this reads more like a card. */
.soap-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.soap-field + .soap-field {
  margin-top: 2px;
}

.soap-field-title {
  margin: 0 0 3px 0;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-3);
}

.soap-field-body {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-1);
}

/* Array of objects (e.g. multiple procedures within Plan) — one card per entry. */
.soap-array {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.soap-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
}

.soap-result {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.soap-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.soap-result-ts {
  font-size: 10px;
  color: var(--text-3);
  font-family: var(--mono);
}
.soap-sections {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.soap-section {
  border-radius: var(--radius-md);
  padding: 10px 12px;
  border-left: 3px solid;
}
.soap-section--blue {
  background: var(--color-info-bg);
  border-left-color: var(--color-info);
}
.soap-section--green {
  background: var(--color-success-bg);
  border-left-color: var(--color-success);
}
.soap-section--orange {
  background: var(--color-orange-bg);
  border-left-color: var(--color-orange);
}
.soap-section--purple {
  background: var(--color-purple-bg);
  border-left-color: var(--color-purple);
}
.soap-section--teal {
  background: var(--color-teal-bg);
  border-left-color: var(--color-teal);
}

.soap-section-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
}
.soap-section-icon {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  font-family: var(--mono);
}
.soap-section--blue .soap-section-icon {
  background: var(--color-info-soft);
  color: var(--color-info-strong);
}
.soap-section--green .soap-section-icon {
  background: var(--color-success-soft);
  color: var(--color-success-strong);
}
.soap-section--orange .soap-section-icon {
  background: var(--color-orange-soft);
  color: var(--color-orange-strong);
}
.soap-section--purple .soap-section-icon {
  background: var(--color-purple-soft);
  color: var(--color-purple-strong);
}
.soap-section--teal .soap-section-icon {
  background: var(--color-teal-soft);
  color: var(--color-teal-strong);
}

.soap-section-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-2);
}
.soap-section-content {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-1);
  white-space: pre-line;
}
.soap-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 2px;
}
.soap-actions .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Cancel-recording confirmation dialog + "Tulis Teks" dialog.
   NOTE: overlay used to use \`border-radius: inherit\`, but \`.recorder-view\`
   (its parent) has no radius of its own and no visible background — so the
   overlay rendered as a flat, hard-edged gray slab with no visual connection
   to the rest of the UI. Fixed by giving it its own radius that matches the
   surrounding card, a lighter/blurred backdrop instead of a near-opaque
   fill, and a soft fade/scale-in so it feels like part of the panel opening
   rather than something snapping on top of it. */
.confirm-overlay {
  position: absolute;
  inset: 0;
  background: var(--overlay);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 20;
  border-radius: var(--radius-lg);
  animation: confirm-overlay-in 160ms ease-out;
}
@keyframes confirm-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.confirm-dialog {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 18px;
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: confirm-dialog-in 180ms cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes confirm-dialog-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(6px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.confirm-dialog-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-1);
  margin: 0;
}
.confirm-dialog-body {
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-2);
  margin: 0 0 8px 0;
}
.confirm-dialog-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* Input alternatif: upload audio / tulis teks (tampil di layar "Mulai") */
.recorder-alt-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.recorder-alt-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.confirm-dialog--wide {
  max-width: 340px;
}
.recorder-textarea {
  width: 100%;
  resize: vertical;
  min-height: 100px;
  border-radius: var(--radius-md, 8px);
  border: 1.5px solid var(--border-2);
  padding: 8px 10px;
  font: inherit;
  font-size: 12px;
  color: var(--text-1);
  background: var(--bg);
}
.recorder-textarea:focus {
  outline: none;
  border-color: var(--brand);
}

/* ─── Clinical Pathway ────────────────────────────────────────────────────── */
.pathway-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pathway-step {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.pathway-step-day {
  background: var(--bg-3);
  padding: 7px 12px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-2);
  border-bottom: 1px solid var(--border);
}

.pathway-step-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pathway-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pathway-group-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-3);
}

.pathway-group-label--blue {
  color: var(--color-info-strong);
}
.pathway-group-label--purple {
  color: var(--color-purple-strong);
}

.pathway-item {
  font-size: 12px;
  color: var(--text-1);
  line-height: 1.5;
}

/* ── ClinicalPathwayFeature layout ──────────────────────────────────────── */
/* Modifiers on top of the shared .feature-layout / .feature-header classes
   (see layout.css) — kept feature-scoped since no other feature needs them. */

.clinical-pathway-root {
  position: relative;
}

.clinical-pathway-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.clinical-pathway-settings-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
}

.pathway-diagnoses-loading {
  padding: 8px;
  color: var(--text-2);
  font-size: 13px;
}

.pathway-diagnoses-error {
  padding: 8px;
  color: var(--color-danger);
  font-size: 13px;
}

.pathway-target-hari-field {
  margin-top: 16px;
}

.pathway-generate-action {
  margin-top: 24px;
}

/* ── ContextSettingsPanel (dev-only test panel) ─────────────────────────── */

.context-settings-panel {
  background: var(--bg-2);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  border: 1px solid var(--border);
}

.context-settings-title {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--text-1);
}

.context-settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.context-settings-label {
  display: block;
  margin-bottom: 4px;
  color: var(--text-2);
}

.context-settings-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid var(--border-2);
  border-radius: 4px;
}

.context-settings-checkbox-row {
  display: flex;
  align-items: flex-end;
}

.context-settings-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 26px;
}

.context-settings-checkbox {
  margin-right: 8px;
}

/* ── DiagnosisAutocomplete ───────────────────────────────────────────────── */

.diagnosis-autocomplete {
  position: relative;
}

.diagnosis-autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg);
  border: 1px solid var(--border-2);
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.diagnosis-autocomplete-option {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--bg-3);
  font-size: 13px;
}

.diagnosis-autocomplete-option:hover {
  background-color: var(--bg-2);
}

.diagnosis-autocomplete-option-id {
  display: inline-block;
  width: 50px;
}

.diagnosis-autocomplete-empty {
  padding: 8px 12px;
  color: var(--text-3);
  font-size: 13px;
}

/* ─── E-Claim ─────────────────────────────────────────────────────────────── */
.eclaim-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
}

.eclaim-status--eligible {
  background: var(--color-success-bg);
  border: 1px solid var(--color-success-border);
}
.eclaim-status--ineligible {
  background: var(--color-danger-bg);
  border: 1px solid var(--color-danger-border);
}

.eclaim-status-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.eclaim-status--eligible .eclaim-status-icon {
  background: var(--color-success);
  color: white;
}
.eclaim-status--ineligible .eclaim-status-icon {
  background: var(--color-danger);
  color: white;
}

.eclaim-status-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-1);
}
.eclaim-status-sub {
  font-size: 11px;
  color: var(--text-3);
  margin-top: 2px;
  font-family: var(--mono);
}

.eclaim-cost-row {
  display: flex;
  align-items: center;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.eclaim-cost-item {
  flex: 1;
  padding: 10px 14px;
}
.eclaim-cost-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}
.eclaim-cost-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-3);
}
.eclaim-cost-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-1);
  margin-top: 2px;
  font-family: var(--mono);
}
.eclaim-cost-value--covered {
  color: var(--color-success-strong);
}

.eclaim-notes {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.eclaim-notes-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-2);
}
.eclaim-note-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
}
.eclaim-note-dot {
  width: 5px;
  height: 5px;
  background: var(--brand);
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}
.eclaim-note-item p {
  font-size: 12px;
  color: var(--text-1);
  line-height: 1.5;
}

.eclaim-code {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--brand-light);
  border-radius: var(--radius-md);
  border: 1px solid var(--brand-light-border);
}
.eclaim-code-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--brand-dark);
}
.eclaim-code-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--brand-dark);
  font-family: var(--mono);
}

/* ─── SDK FAB + Panel ─────────────────────────────────────────────────────── */
#his-ai-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.sdk-fab-tooltip-wrapper {
  position: absolute;
  bottom: 120%; /* muncul di atas tombol */
  left: 50%;
  transform: translateX(-50%) !important;
}

.sdk-fab-tooltip {
  animation: fab-label-bob 2.5s ease-in-out infinite;
  font-family: "DM Sans", system-ui, sans-serif;
  background: var(--text-1);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.sdk-fab-btn:hover .sdk-fab-tooltip {
  opacity: 1;
}

.sdk-fab-label {
  padding: 5px 12px;

  font-size: 12px;

  box-shadow: var(--shadow-md);

  pointer-events: none;
  white-space: nowrap;
}

@keyframes fab-label-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.sdk-fab-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 6px 20px var(--brand-shadow-xl),
    0 2px 8px rgb(0 0 0 / 0.12);
  transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  cursor: pointer;
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}

.sdk-fab-btn:hover .sdk-fab-label {
  opacity: 1;
  transform: translateX(-60%) translateY(-4px); /* sedikit naik saat muncul */
}

.sdk-fab-btn::before {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid var(--brand-shadow-lg);
  animation: fab-ring 2s ease-in-out infinite;
}

@keyframes fab-ring {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.5;
  }
}

.sdk-fab-btn:hover {
  transform: scale(1.06);
  box-shadow: 0 8px 28px var(--brand-shadow-xl-hover);
}
.sdk-fab-btn--open {
  background: linear-gradient(135deg, var(--neutral-strong-1), var(--neutral-strong-2));
}

.sdk-fab-icon-open,
.sdk-fab-icon-close {
  position: absolute;
  transition: all 200ms ease;
}
.sdk-fab-icon-close {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}
.sdk-fab-btn--open .sdk-fab-icon-open {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}
.sdk-fab-btn--open .sdk-fab-icon-close {
  opacity: 1;
  transform: rotate(0) scale(1);
}

.sdk-widget-panel {
  position: fixed;
  bottom: 96px;
  right: 24px;
  z-index: 9998;
  transform-origin: bottom right;
  transform: scale(0.88) translateY(16px);
  opacity: 0;
  pointer-events: none;
  transition:
    transform 260ms cubic-bezier(0.34, 1.3, 0.64, 1),
    opacity 200ms ease;
}

.sdk-widget-panel--open {
  transform: scale(1) translateY(0);
  opacity: 1;
  pointer-events: all;
}

/* ─── Dev preview ─────────────────────────────────────────────────────────── */
.dev-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px 16px;
}

/* ─── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  :host {
    --widget-w: 100vw;
    --widget-h: 100dvh;
  }
  .widget-root {
    border-radius: 0;
  }
  #his-ai-fab {
    bottom: 16px;
    right: 16px;
  }
  .sdk-widget-panel {
    right: 0;
    bottom: 84px;
  }
}

/**
 * supplementary-ui.css
 *
 * Grab-bag of smaller styles added after the main feature stylesheets were
 * written: a chat input fix, SOAP transcript/suggestion views, and shared
 * result-view primitives (tabs, list, badges, save button) reused by the
 * speech-to-soap / clinical-pathway / eclaim result screens.
 *
 * Kept as one file and loaded last (see styles/index.css) so cascade order
 * matches the original stylesheet exactly. If this file keeps growing,
 * consider splitting the feature-specific bits into their own feature
 * stylesheet and keeping only the shared tabs/list/badges/save-button rules
 * here.
 */

/* ─── Chat input clear button ─────────────────────────────────────────────── */
.chat-input-clear {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: var(--text-3);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 120ms ease;
  flex-shrink: 0;
}
.chat-input-clear:hover {
  background: var(--bg-3);
  color: var(--color-danger);
}

/* ─── Transcript preview (SOAP result) ───────────────────────────────────── */
.soap-transcript-preview {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 13px;
  margin-bottom: 10px;
}
.soap-transcript-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-3);
  margin-bottom: 0;
}
.soap-transcript-text {
  font-size: 12px;
  color: var(--text-2);
  line-height: 1.6;
  margin-top: 8px;
}

.soap-table {
  width: 100%;
  border-collapse: collapse;
}
.soap-key {
  font-weight: 600;
  padding-right: 0.5rem;
  vertical-align: top;
}
.soap-value {
  color: var(--text-2);
}

.soap-transcript-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.accordion-chevron {
  color: var(--text-3);
  transition: transform 200ms ease;
  flex-shrink: 0;
}
.accordion-chevron--open {
  transform: rotate(180deg);
}

.btn-copy {
  font-size: 10px !important;
  background: none;
  border: 1px solid var(--border-2);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-1);
  transition: background 0.2s;
}

.btn-copy:hover {
  background: var(--bg-3);
}

/* ─── Shared batch-selection checkbox ─────────────────────────────────────
   Used by every checkable SOAP row: vital signs, ICD-10 diagnoses/procedures,
   and the whole-block Anamesa checkbox. Keep this generic so new checkable
   fields (prescription, doctor instruction, ...) reuse it as-is. */
.batch-checkbox {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 1.5px solid var(--border-2);
  background: var(--bg);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.1s;
}
.batch-checkbox:hover {
  border-color: var(--color-info);
  transform: scale(1.05);
}
.batch-checkbox--checked {
  background: var(--color-info);
  border-color: var(--color-info);
}

/* ─── "Pilih Semua" / "Batal Pilih" toggle ────────────────────────────────
   Shared header button for panels that support batch selection. */
.panel-select-all-btn {
  flex-shrink: 0;
  height: 22px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1.5px solid var(--border-2);
  background: var(--bg);
  color: var(--text-2);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}
.panel-select-all-btn:hover {
  background: var(--color-info-bg);
  border-color: var(--color-info);
  color: var(--color-info);
}

/* ─── Suggestion Panel ────────────────────────────────────────────────────── */
.suggestion-panel {
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--surface-1);
  margin-top: 4px;
}

.suggestion-panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
}

.suggestion-panel-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-2);
  flex: 1;
}

.suggestion-panel-hint {
  font-size: 10px;
  color: var(--text-3);
}

/* ─── Tabs ───────────────────────────────────────────────────────────────── */
.suggestion-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  background: var(--bg-2);
}

.suggestion-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 10px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-3);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s;
}

.suggestion-tab:hover {
  color: var(--text-1);
}

.suggestion-tab--active {
  color: var(--color-info);
  border-bottom-color: var(--color-info);
  font-weight: 600;
}

.suggestion-tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  background: var(--border);
  color: var(--text-2);
}

.suggestion-tab--active .suggestion-tab-count {
  background: var(--color-info-soft);
  color: var(--color-info-strong);
}

/* ─── List ───────────────────────────────────────────────────────────────── */
.suggestion-list {
  display: flex;
  flex-direction: column;
}

.suggestion-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-bottom: 1px solid var(--bg-3);
  transition: background 0.12s;
}

.suggestion-row:last-child {
  border-bottom: none;
}

.suggestion-row:hover {
  background: var(--bg-2);
}

/* Primary diagnosis: faint blue-tinted left border */
.suggestion-row--primary {
  border-left: 3px solid var(--color-info);
}

/* Secondary diagnosis: faint gray left border */
.suggestion-row--secondary {
  border-left: 3px solid var(--border-2);
}

/* Procedure: faint teal left border */
.suggestion-row--procedure {
  border-left: 3px solid var(--color-teal);
}

.suggestion-row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.suggestion-row-top {
  display: flex;
  align-items: center;
  gap: 5px;
}

.suggestion-icd {
  font-size: 10px;
  font-weight: 700;
  font-family: var(--mono);
  color: var(--text-2);
}

.suggestion-name {
  font-size: 11px;
  color: var(--text-1);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Badges ─────────────────────────────────────────────────────────────── */
.suggestion-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.suggestion-badge--primary {
  background: var(--color-info-soft);
  color: var(--color-info-strong);
}

.suggestion-badge--secondary {
  background: var(--bg-3);
  color: var(--text-2);
}

/* ─── Save button ─────────────────────────────────────────────────────────── */
/* Currently unused — per-row/bulk quick-save was replaced by checkbox +
   "Simpan ke HIS" batch save. Left in place in case a quick-save mode comes back. */
.suggestion-save-btn {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1.5px solid var(--border-2);
  background: var(--bg);
  color: var(--text-3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s,
    transform 0.1s;
}

.suggestion-save-btn:hover {
  background: var(--color-info-bg);
  border-color: var(--color-info);
  color: var(--color-info);
  transform: scale(1.08);
}

.suggestion-save-btn--saved {
  background: var(--color-success) !important;
  border-color: var(--color-success) !important;
  color: white !important;
  transform: scale(1.08);
}

/* ─── Vital Signs Panel ──────────────────────────────────────────────────────
   Mirrors .suggestion-panel styling, but saves all vital signs in one
   bulk action instead of per-row checkmarks. */
.vital-signs-panel {
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--surface-1);
  margin-top: 4px;
}

.vital-signs-panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
}

.vital-signs-panel-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-2);
  flex: 1;
}

/* ─── Bulk save button ───────────────────────────────────────────────────── */
/* Currently unused — replaced by the single whole-block checkbox in the panel
   header + "Simpan ke HIS". Left in place in case a quick-save mode comes back. */
.vital-signs-save-all-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1.5px solid var(--border-2);
  background: var(--bg);
  color: var(--text-2);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s,
    transform 0.1s;
}

.vital-signs-save-all-btn:hover {
  background: var(--color-info-bg);
  border-color: var(--color-info);
  color: var(--color-info);
  transform: scale(1.04);
}

.vital-signs-save-all-btn--saved {
  background: var(--color-success) !important;
  border-color: var(--color-success) !important;
  color: white !important;
  transform: scale(1.04);
}

/* ─── List ───────────────────────────────────────────────────────────────── */
.vital-signs-list {
  display: flex;
  flex-direction: column;
}

.vital-sign-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-bottom: 1px solid var(--bg-3);
  transition: background 0.12s;
}

.vital-sign-row:last-child {
  border-bottom: none;
}

.vital-sign-row:hover {
  background: var(--bg-2);
}

.vital-sign-row-info {
  width: 100%;
  display: grid;
  grid-template-columns: 110px 100px 60px; /* lebih sempit */
  align-items: center;
  gap: 12px;
}

.vital-sign-name {
  font-size: 11px;
  color: var(--text-1);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vital-sign-value {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-1);
  flex-shrink: 0;
  width: 65%;
  border-radius: 0.375rem;
  padding-left: 1em;
  background-color: transparent;
  justify-self: end;
}

.vital-sign-value-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-info-strong);
  flex-shrink: 0;
  width: 65%;
  padding-left: 1em;
  justify-self: end;
}

.vital-sign-value:hover {
  border-color: var(--brand-dark);
}

.vital-sign-value:focus {
  border-color: var(--brand-dark);
  box-shadow: 0 0 0 3px var(--color-info-soft);
}

.vital-sign-unit {
  width: 55px;
  text-align: left;
  color: var(--text-2);
  font-size: 11px;
}

/* Markdown Body Styles for AI Assistant Chat */
.markdown-body {
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  color: inherit;
}
.markdown-body p {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
.markdown-body p:last-child {
  margin-bottom: 0;
}
.markdown-body strong {
  font-weight: 600;
  color: var(--text-1);
}
.markdown-body ul,
.markdown-body ol {
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  padding-left: 1.2rem;
}
.markdown-body li {
  margin-bottom: 0.25rem;
}
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
`

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
