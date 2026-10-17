/// <reference types="vitest/config" />
import { existsSync } from 'node:fs'
import { extname, join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { HOME_PAGE, renderHead, siteUrl } from './scripts/seo.ts'

/** Adds canonical, Open Graph and Twitter tags (absolute URLs) to index.html. */
const socialMeta = (): Plugin => ({
  name: 'bible-atlas-social-meta',
  transformIndexHtml: (html) => renderHead(html, HOME_PAGE, siteUrl()),
})

/**
 * Transformers.js loads ONNX Runtime's WebAssembly from its version-pinned CDN at runtime, so
 * the copy Vite would otherwise emit (~27 MB) is never requested. Leave it out of the build.
 */
const dropUnusedOnnxWasm = (): Plugin => ({
  name: 'bible-atlas-drop-unused-onnx-wasm',
  apply: 'build',
  generateBundle(_options, bundle) {
    for (const file of Object.keys(bundle)) if (/ort-wasm[\w.-]*\.wasm$/.test(file)) delete bundle[file]
  },
})

/**
 * Serves pre-rendered pages the way Netlify does: `/place/philippi` gets
 * `dist/place/philippi/index.html`, not the home page's HTML (preview only).
 */
const prerenderedPages = (): Plugin => ({
  name: 'bible-atlas-prerendered-pages',
  configurePreviewServer(server) {
    const root = server.config.build.outDir
    server.middlewares.use((request, _response, next) => {
      const [path = '/', query = ''] = (request.url ?? '/').split('?')
      if (path !== '/' && !extname(path) && existsSync(join(root, path, 'index.html'))) {
        request.url = `${path.replace(/\/$/, '')}/index.html${query ? `?${query}` : ''}`
      }
      next()
    })
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), socialMeta(), prerenderedPages()],
  worker: { format: 'es', plugins: () => [dropUnusedOnnxWasm()] },
  // Transformers.js loads its WebAssembly runtime itself; serving it as-is avoids a dev-only
  // full reload when the Smart Search worker is first opened.
  optimizeDeps: { exclude: ['@huggingface/transformers'] },
  build: {
    target: 'es2022',
    // MapLibre (~1 MB) and Transformers.js are each loaded lazily in their own chunks.
    chunkSizeWarningLimit: 1100,
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
