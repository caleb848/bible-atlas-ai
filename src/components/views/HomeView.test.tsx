import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { allEvents, allJourneys, allPeople, allPlaces } from '../../data/atlas'

const noop = () => undefined

/** Renders the home screen (fresh modules, so a mocked data module is picked up). */
async function renderHome(): Promise<string> {
  const { HomeView } = await import('./HomeView')
  const { I18nProvider } = await import('../../i18n/I18nProvider')
  return renderToString(
    <I18nProvider locale="en">
      <HomeView onPreviewJourney={noop} onEmphasize={noop} onAnswerPreview={noop} onOpenSearch={noop} />
    </I18nProvider>,
  )
}

const decode = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()

/** The links in "Explore the atlas": where each goes, what it shows, and its name for screen readers. */
function exploreLinks(html: string): Array<{ href: string; text: string; name: string }> {
  const section = /<section aria-labelledby="home-explore".*?<\/section>/s.exec(html)?.[0] ?? ''
  return [...section.matchAll(/<a ([^>]*)>(.*?)<\/a>/gs)].map(([, attributes = '', inner = '']) => ({
    href: /href="([^"]+)"/.exec(attributes)?.[1] ?? '',
    text: decode(inner.replace(/<\/span>/g, ' </span>')),
    name: decode(/aria-label="([^"]+)"/.exec(attributes)?.[1] ?? ''),
  }))
}

describe('home screen: Explore the atlas', () => {
  afterEach(() => {
    vi.doUnmock('../../data/atlas')
    vi.resetModules()
  })

  it('shows how many journeys and collections, places, people and events the atlas holds', async () => {
    expect(exploreLinks(await renderHome())).toEqual([
      {
        href: '/journeys',
        text: `${allJourneys.length} Journeys & collections`,
        name: `${allJourneys.length} Journeys & collections, explore journeys and collections`,
      },
      { href: '/places', text: `${allPlaces.length} Places`, name: `${allPlaces.length} Places, explore places` },
      { href: '/people', text: `${allPeople.length} People`, name: `${allPeople.length} People, explore people` },
      { href: '/events', text: `${allEvents.length} Events`, name: `${allEvents.length} Events, explore events` },
    ])
  })

  it('reads the counts from the data, so they follow it when it changes', async () => {
    vi.resetModules()
    vi.doMock('../../data/atlas', async (importOriginal) => {
      const atlas = await importOriginal<typeof import('../../data/atlas')>()
      return {
        ...atlas,
        allJourneys: atlas.allJourneys.slice(1),
        allPlaces: atlas.allPlaces.slice(2),
        allPeople: atlas.allPeople.slice(3),
        allEvents: atlas.allEvents.slice(4),
      }
    })
    const counts = exploreLinks(await renderHome()).map((link) => Number(link.text.split(' ')[0]))
    expect(counts).toEqual([allJourneys.length - 1, allPlaces.length - 2, allPeople.length - 3, allEvents.length - 4])
  })
})
