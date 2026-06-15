import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [preact()],

    resolve: {
      alias: { '@': resolve(__dirname, './src') },
    },

    server: { port: 3000, open: true },

    build: isLib
      ? {
          // ── SDK Library build ──────────────────────────────────────────────
          // Output: dist/his_ai_widget.js — 1 file, CSS embedded sebagai string
          // CSS di-inject ke <head> via injectStyles() saat init() dipanggil
          lib: {
            entry: resolve(__dirname, 'src/sdk/index.tsx'),
            name: 'his_ai_widget',
            formats: ['iife'],
            fileName: () => 'his_ai_widget.js',
          },
          outDir: 'dist',
          emptyOutDir: true,
          sourcemap: true,
          rollupOptions: {
            output: {
              name: 'his_ai_widget',
              extend: true,
            },
          },
        }
      : {
          outDir: 'dist',
          sourcemap: true,
        },
  }
})
