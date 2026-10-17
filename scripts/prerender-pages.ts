/**
 * Runs after the client and server builds (`npm run build`). For the home page and every journey,
 * place, person and index page it writes finished HTML: the app rendered on the server for that
 * path, plus its own title, description and canonical URL. Visitors see the page before any
 * JavaScript runs, and link previews (LinkedIn, Slack, iMessage) and search engines get
 * page-specific metadata. Also writes sitemap.xml and robots.txt.
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { allJourneys, allPeople, allPlaces } from '../src/data/atlas'
import { HOME_PAGE, type PageMeta, renderHead, SITE_NAME, siteUrl } from './seo'

const OUT_DIR = 'dist'
const SSR_ENTRY = join(process.cwd(), 'dist-ssr', 'entry-server.js')

/** Trims to a sentence boundary that fits what search results and previews show. */
function clip(text: string, max = 158): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const sentence = cut.lastIndexOf('. ')
  return sentence > 80 ? cut.slice(0, sentence + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

const pages: PageMeta[] = [
  { path: '/about', title: `About | ${SITE_NAME}`, description: 'How Bible Atlas AI maps Scripture: sources, certainty labels, the World English Bible and on-device Smart Search.' },
  { path: '/journeys', title: `Journeys and collections | ${SITE_NAME}`, description: 'Every route and collection in Bible Atlas AI, from Paul’s missionary journeys to the places of Jesus’ ministry.' },
  { path: '/places', title: `Places | ${SITE_NAME}`, description: 'Every place in Bible Atlas AI, with its modern location and how certain the identification is.' },
  { path: '/people', title: `People | ${SITE_NAME}`, description: 'People in the Gospels and Acts, connected to the places and events where the text names them.' },
  { path: '/events', title: `Events | ${SITE_NAME}`, description: 'Every event in Bible Atlas AI, in the order of the Bible: where it happened, who the text names, and the passage behind it.' },
  ...allJourneys.map((journey) => ({ path: `/journey/${journey.id}`, title: `${journey.title.en} | ${SITE_NAME}`, description: clip(journey.summary.en) })),
  ...allPlaces.map((place) => ({ path: `/place/${place.id}`, title: `${place.name.en} | ${SITE_NAME}`, description: clip(place.summary.en) })),
  ...allPeople.map((person) => ({ path: `/person/${person.id}`, title: `${person.name.en} | ${SITE_NAME}`, description: clip(`${person.role.en}. ${person.summary.en}`) })),
]

const { render } = (await import(pathToFileURL(SSR_ENTRY).href)) as { render: (pathname: string) => string }

const site = siteUrl()
// The built index.html has the home page's tags; restore the placeholder to render each page.
const built = await readFile(join(OUT_DIR, 'index.html'), 'utf8')
let template = built.replace(/<link rel="canonical"[\s\S]*?<meta name="twitter:image" content=".*?" \/>/, '<!-- %SOCIAL_META% -->')
if (!template.includes('<!-- %SOCIAL_META% -->')) throw new Error('dist/index.html is missing its social tags; was it built by Vite?')
if (!template.includes('<div id="root"><!--app-html--></div>')) throw new Error('dist/index.html is missing the app placeholder')

// The interface typefaces are needed for the first paint: start loading them with the HTML.
const fonts = (await readdir(join(OUT_DIR, 'assets'))).filter((file) =>
  /^(inter-latin-wght-normal|newsreader-latin-opsz-normal)-.*\.woff2$/.test(file),
)
template = template.replace(
  '<!-- %SOCIAL_META% -->',
  `${fonts.map((file) => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`).join('\n    ')}\n    <!-- %SOCIAL_META% -->`,
)

const page = (meta: PageMeta) =>
  renderHead(template, meta, site).replace(
    '<div id="root"><!--app-html--></div>',
    `<div id="root" data-prerendered-path="${meta.path}">${render(meta.path)}</div>`,
  )

await writeFile(join(OUT_DIR, 'index.html'), page(HOME_PAGE))
for (const meta of pages) {
  const dir = join(OUT_DIR, meta.path)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'index.html'), page(meta))
}

const urls = [HOME_PAGE, ...pages].map((meta) => `  <url><loc>${site}${meta.path}</loc></url>`).join('\n')
await writeFile(join(OUT_DIR, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
await writeFile(join(OUT_DIR, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`)
console.log(`Pre-rendered ${pages.length + 1} pages (with server-rendered HTML) for ${site}`)
