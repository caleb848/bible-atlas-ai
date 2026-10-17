/** Head tags for SEO and social previews, shared by the Vite plugin and the pre-render script. */

export interface PageMeta {
  path: string
  title: string
  description: string
}

export const SITE_NAME = 'Bible Atlas AI'

export const HOME_PAGE: PageMeta = {
  path: '/',
  title: 'Bible Atlas AI | Explore Scripture Geographically',
  description: 'Explore biblical journeys, places and events through an interactive map of Scripture.',
}

const IMAGE_ALT =
  'Paul’s second missionary journey traced in cobalt on a light atlas map of the eastern Mediterranean, beside the words Bible Atlas AI: Explore Scripture geographically.'

export const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The site URL for absolute links. Netlify sets `URL` during builds; `VITE_SITE_URL` overrides it. */
export const siteUrl = (): string =>
  (process.env.VITE_SITE_URL ?? process.env.URL ?? 'https://bible-atlas-ai.netlify.app').replace(/\/$/, '')

export function headTags(page: PageMeta, site: string): string {
  const url = `${site}${page.path}`
  const image = `${site}/og-image.png`
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  return [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(IMAGE_ALT)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ')
}

/** Fills index.html's title, description and the `%SOCIAL_META%` placeholder for one page. */
export function renderHead(template: string, page: PageMeta, site: string): string {
  return template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`)
    .replace('<!-- %SOCIAL_META% -->', headTags(page, site))
}
