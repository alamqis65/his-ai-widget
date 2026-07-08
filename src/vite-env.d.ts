/// <reference types="vite/client" />

// Vite compiles the CSS (resolving @import chains, url()s, etc.) and hands it
// back as a plain string instead of injecting a <link>/<style> tag itself.
// We use this to grab the widget's full stylesheet as text and inject it
// ourselves into the widget's shadow root — see src/sdk/shadowRoot.ts.
declare module '*.css?inline' {
  const css: string
  export default css
}
