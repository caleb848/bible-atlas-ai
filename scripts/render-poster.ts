/**
 * Renders the static map image that phones show on the opening view until the reader first
 * interacts (public/posters/overview-phone.jpg). It is a screenshot of the live map at phone size,
 * with the interface hidden so the two match; the page shows the map's attribution as text over it.
 * Re-run whenever the opening view changes (routes, landmark places or the map style):
 *
 *   npm run build && npm run preview     # in one terminal
 *   npm run map:poster                    # in another (or pass --base for another server)
 */
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { chromium } from '@playwright/test'

const { values } = parseArgs({ options: { base: { type: 'string', default: 'http://127.0.0.1:4173' } } })
const out = join(process.cwd(), 'public', 'posters')
await mkdir(out, { recursive: true })

// New headless mode renders WebGL on the GPU, like a real browser.
const browser = await chromium.launch({ channel: 'chromium' })
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page.goto(`${values.base}/`)
// Phones load the live map on the first interaction.
await page.keyboard.press('Shift')
await page.locator('.maplibregl-canvas').waitFor()
await page.waitForLoadState('networkidle')
await page.waitForTimeout(4000) // tiles, labels and fades
// Hide the interface but keep its layout, so the map stays framed exactly as on the phone.
await page.addStyleTag({
  content:
    '[data-map-obstacle], header, a[href="#main-content"] { visibility: hidden !important; } .maplibregl-control-container { display: none !important; }',
})
await page.waitForTimeout(300)
// Only the top of the map shows above the bottom sheet; the live map takes over on the first touch.
await page.screenshot({ path: join(out, 'overview-phone.jpg'), type: 'jpeg', quality: 66, clip: { x: 0, y: 0, width: 412, height: 560 } })
await browser.close()
console.log('Rendered public/posters/overview-phone.jpg')
