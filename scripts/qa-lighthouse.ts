/**
 * Lighthouse audit of the production build. Serves `dist/` with `vite preview`, audits key pages
 * on mobile (Lighthouse's default slow-4G and 4× CPU simulation) and desktop, prints the scores and
 * core metrics, and fails when a target is missed. Run `npm run build` first, then
 * `npm run qa:lighthouse [-- --runs 3]`. Uses Playwright's Chromium in new headless mode, which
 * renders WebGL on the GPU like a real browser.
 *
 * Scores vary between runs, so each page is audited `--runs` times and the median run (by
 * performance score) is reported, as Lighthouse recommends; the range of performance scores is
 * printed beside it. `--pages /events,/people` audits only those pages.
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'
import { chromium } from 'playwright'

const { values } = parseArgs({ options: { runs: { type: 'string', default: '3' }, pages: { type: 'string' } } })
const RUNS = Math.max(1, Number(values.runs))
const PORT = 4175
const BASE = `http://127.0.0.1:${PORT}`
const PAGES = values.pages?.split(',') ?? ['/', '/journey/paul-second-missionary-journey', '/place/philippi', '/people', '/events', '/person/timothy']
const TARGETS = { mobilePerformance: 90, accessibility: 95, desktopFcpMs: 1500 }
const REPORT_DIR = join('test-results', 'lighthouse')

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
  stdio: 'ignore',
})
const stopServer = () => server.kill()
process.on('exit', stopServer)

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      if ((await fetch(BASE)).ok) return
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`vite preview did not start on ${BASE}`)
}

interface Row {
  page: string
  form: 'mobile' | 'desktop'
  performance: number
  /** Lowest and highest performance score over the runs. */
  range: [number, number]
  accessibility: number
  bestPractices: number
  seo: number
  fcp: number
  lcp: number
  tbt: number
  cls: number
}

const score = (value: number | null | undefined) => Math.round((value ?? 0) * 100)

await waitForServer()
await mkdir(REPORT_DIR, { recursive: true })
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new'] })
const rows: Row[] = []
try {
  for (const form of ['mobile', 'desktop'] as const) {
    for (const page of PAGES) {
      const results = []
      for (let run = 0; run < RUNS; run++) {
        const result = await lighthouse(
          BASE + page,
          { port: chrome.port, output: 'json', logLevel: 'error' },
          form === 'desktop' ? desktopConfig : undefined,
        )
        if (!result) throw new Error(`Lighthouse returned no result for ${page}`)
        results.push(result)
      }
      const byScore = [...results].sort((a, b) => (a.lhr.categories.performance?.score ?? 0) - (b.lhr.categories.performance?.score ?? 0))
      const result = byScore[Math.floor(byScore.length / 2)]!
      const { categories, audits } = result.lhr
      const metric = (id: string) => audits[id]?.numericValue ?? Number.NaN
      rows.push({
        page,
        form,
        performance: score(categories.performance?.score),
        range: [score(byScore[0]!.lhr.categories.performance?.score), score(byScore.at(-1)!.lhr.categories.performance?.score)],
        accessibility: score(categories.accessibility?.score),
        bestPractices: score(categories['best-practices']?.score),
        seo: score(categories.seo?.score),
        fcp: metric('first-contentful-paint'),
        lcp: metric('largest-contentful-paint'),
        tbt: metric('total-blocking-time'),
        cls: metric('cumulative-layout-shift'),
      })
      const name = `${form}${page === '/' ? '-home' : page.replaceAll('/', '-')}.json`
      await writeFile(join(REPORT_DIR, name), JSON.stringify(result.lhr, null, 1))
    }
  }
} finally {
  await chrome.kill()
  stopServer()
}

const ms = (value: number) => `${(value / 1000).toFixed(2)} s`
console.log(`\nMedian of ${RUNS} run(s) per page (performance range in brackets).`)
console.log('form     page                                       perf  (range)   a11y  bp   seo   FCP      LCP      TBT     CLS')
for (const row of rows) {
  console.log(
    `${row.form.padEnd(8)} ${row.page.padEnd(42)} ${String(row.performance).padStart(4)}  ${`(${row.range[0]}–${row.range[1]})`.padEnd(9)} ${String(row.accessibility).padStart(4)}  ${String(row.bestPractices).padStart(3)}  ${String(row.seo).padStart(4)}   ${ms(row.fcp).padStart(7)}  ${ms(row.lcp).padStart(7)}  ${`${Math.round(row.tbt)} ms`.padStart(6)}  ${row.cls.toFixed(3)}`,
  )
}

const failures = rows.flatMap((row) => [
  ...(row.form === 'mobile' && row.performance < TARGETS.mobilePerformance
    ? [`${row.page} mobile performance ${row.performance} < ${TARGETS.mobilePerformance}`]
    : []),
  ...(row.accessibility < TARGETS.accessibility
    ? [`${row.page} ${row.form} accessibility ${row.accessibility} < ${TARGETS.accessibility}`]
    : []),
  ...(row.form === 'desktop' && row.fcp > TARGETS.desktopFcpMs
    ? [`${row.page} desktop FCP ${ms(row.fcp)} > ${ms(TARGETS.desktopFcpMs)}`]
    : []),
])
console.log(`\nFull reports: ${REPORT_DIR}/`)
if (failures.length > 0) {
  console.error(`\nTargets missed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}
console.log('All Lighthouse targets met.')
