/**
 * Renders the social share image and app icons with a headless browser.
 *
 *   npm run dev            # in one terminal
 *   npm run og:image       # in another (or pass --base http://localhost:4173 for `vite preview`)
 *
 * 1. Captures the map with Paul's second journey drawn (design/og-map.png).
 * 2. Renders design/og-image.html to public/og-image.png (1200×630).
 * 3. Renders public/favicon.svg to the PNG icons referenced by index.html and the manifest.
 */
import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const { values } = parseArgs({ options: { base: { type: 'string', default: 'http://127.0.0.1:5173' } } })
const root = process.cwd()

// New headless mode renders WebGL on the GPU, like a real browser.
const browser = await chromium.launch({ channel: 'chromium' })

// 1. The map, with the interface hidden so only the route and its markers remain. The panel is
//    widened first, so the camera frames the route in the right half, clear of the card's text.
const mapPage = await browser.newPage({ viewport: { width: 1600, height: 840 }, deviceScaleFactor: 2 })
await mapPage.addInitScript(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style')
    style.textContent = 'section[data-map-obstacle] { width: 760px !important; max-width: none !important; }'
    document.head.append(style)
  })
})
await mapPage.goto(`${values.base}/journey/paul-second-missionary-journey`)
await mapPage.keyboard.press('Shift') // an interaction: the route draws as it does in the app
await mapPage.waitForTimeout(9000) // camera flight + route drawing animation
// Hidden but still laid out, so the map keeps its framing (removing the panel would re-centre it).
await mapPage.addStyleTag({
  content:
    '[data-map-obstacle], header, a[href="#main-content"] { visibility: hidden !important; } .maplibregl-control-container { display: none !important; }',
})
await mapPage.waitForTimeout(500)
await mapPage.screenshot({ path: join(root, 'design', 'og-map.png') })
await mapPage.close()

// 2. The share card.
const card = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await card.goto(pathToFileURL(join(root, 'design', 'og-image.html')).href)
await card.waitForTimeout(500)
await card.screenshot({ path: join(root, 'public', 'og-image.png') })
await card.close()

// 3. Icons from the SVG logo.
const svg = await readFile(resolve(root, 'public', 'favicon.svg'), 'utf8')
const icons = [
  { file: 'favicon-32.png', size: 32, background: 'transparent', scale: 1 },
  { file: 'apple-touch-icon.png', size: 180, background: '#f2eee7', scale: 0.8 },
  { file: 'icon-192.png', size: 192, background: 'transparent', scale: 1 },
  { file: 'icon-512.png', size: 512, background: 'transparent', scale: 1 },
  { file: 'icon-maskable-512.png', size: 512, background: '#f2eee7', scale: 0.62 },
]
for (const icon of icons) {
  const page = await browser.newPage({ viewport: { width: icon.size, height: icon.size } })
  const inner = Math.round(icon.size * icon.scale)
  await page.setContent(
    `<body style="margin:0;display:grid;place-items:center;width:${icon.size}px;height:${icon.size}px;background:${icon.background}">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</body>`,
  )
  await page.screenshot({ path: join(root, 'public', icon.file), omitBackground: icon.background === 'transparent' })
  await page.close()
}

await browser.close()
console.log('Rendered public/og-image.png and app icons.')
