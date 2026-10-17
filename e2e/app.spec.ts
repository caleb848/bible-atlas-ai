import { expect, type Page, test } from '@playwright/test'
import { allEvents, allJourneys, allPeople, allPlaces } from '../src/data/atlas'

/** Fails the test on any uncaught error or console error (GPU driver notices excepted). */
function watchConsole(page: Page): string[] {
  const problems: string[] = []
  page.on('pageerror', (error) => problems.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('GL Driver')) problems.push(message.text())
  })
  return problems
}

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 900

/** On phones the search field lives behind the top bar's search button. */
async function openSearch(page: Page) {
  if (isMobile(page)) await page.getByRole('button', { name: 'Search', exact: true }).click()
  return page.getByRole('combobox', { name: 'Search the atlas' })
}

test('the opening view explains the product and lists featured journeys', async ({ page }) => {
  const problems = watchConsole(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Explore Scripture geographically.' })).toBeVisible()
  await expect(page.getByText('Follow journeys. Discover places. Read the passages behind them.')).toBeVisible()
  for (const title of ['Paul’s Second Missionary Journey', 'Paul’s Journey to Rome', 'Final Week in Jerusalem']) {
    await expect(page.getByRole('link', { name: new RegExp(title) }).first()).toBeVisible()
  }
  await expect(page).toHaveTitle('Bible Atlas AI | Explore Scripture Geographically')
  expect(problems).toEqual([])
})

test('search finds a journey and opens it on the map', async ({ page }) => {
  await page.goto('/')
  const search = await openSearch(page)
  await search.fill('Paul second journey')
  await expect(page.getByRole('option', { name: /Paul’s Second Missionary Journey/ }).first()).toBeVisible()
  await search.press('Enter')
  await expect(page).toHaveURL(/\/journey\/paul-second-missionary-journey$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Paul’s Second Missionary Journey' })).toBeVisible()
})

test('a grounded answer leads with the verse and names every place it narrates', async ({ page }) => {
  await page.goto('/')
  await (await openSearch(page)).fill('Where did Paul go after Philippi?')
  const answer = page.getByRole('region', { name: 'Answer' })
  await expect(answer).toBeVisible()
  await expect(answer).toContainText('Grounded in atlas data')
  // Scripture first, quoted word for word: Acts 17:1 names all three places for one move.
  await expect(answer).toContainText('Acts 17:1 · WEB')
  await expect(answer).toContainText('Now when they had passed through Amphipolis and Apollonia, they came to Thessalonica')
  await expect(answer).toContainText('Amphipolis · Apollonia · Thessalonica')
  await expect(answer).toContainText('After Philippi · Second Journey · stops 8–10')
  await expect(answer).toContainText('After Philippi · Third Journey · stop 6 · Acts 20:6')
})

test('unknown questions are not answered with guesses', async ({ page }) => {
  await page.goto('/')
  await (await openSearch(page)).fill('Where is the Garden of Eden?')
  await expect(page.getByRole('listbox', { name: 'Search the atlas' }).or(page.getByText(/Nothing in Bible Atlas matches/))).toBeVisible()
  await expect(page.getByRole('region', { name: 'Answer' })).toHaveCount(0)
})

test('a journey opens on its title page and Journey Mode steps through the stops', async ({ page }) => {
  const problems = watchConsole(page)
  await page.goto('/journey/paul-second-missionary-journey')
  await expect(page.getByRole('heading', { level: 1, name: 'Paul’s Second Missionary Journey' })).toBeVisible()
  await expect(page.getByText('Approximate mapped distance')).toBeVisible()
  await page.getByRole('button', { name: 'Begin Journey' }).click()
  await expect(page).toHaveURL(/\?stop=1$/)
  await expect(page.getByRole('article', { name: 'Antioch' })).toBeVisible()
  await page.getByRole('button', { name: 'Next stop' }).click()
  await expect(page).toHaveURL(/\?stop=2$/)
  await expect(page.getByRole('article', { name: 'Derbe' })).toBeVisible()
  await expect(page.getByRole('toolbar', { name: 'Journey controls' })).toContainText('Stop 2 of 18')
  await page.getByRole('button', { name: 'Exit journey' }).click()
  await expect(page).toHaveURL(/\/journey\/paul-second-missionary-journey$/)
  expect(problems).toEqual([])
})

test('a place visited twice shows each visit, and Journey Mode brings the first stop into view', async ({ page }) => {
  await page.goto('/journey/paul-second-missionary-journey')
  const antioch = page.getByRole('button', { name: 'Stops 1, 18: Antioch' })
  // Two stops, two discs: never "1 · 18", which reads like "stop 1 of 18".
  await expect(antioch.locator('[data-visits]')).toHaveText(['1', '18'])
  await page.getByRole('button', { name: 'Begin Journey' }).click()
  await expect(page.getByRole('article', { name: 'Antioch' })).toBeVisible()
  // The camera frames the first stop in the open part of the map, not under the card or timeline.
  const uncovered = () =>
    antioch.evaluate((marker) => {
      const box = marker.getBoundingClientRect()
      return marker.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2))
    })
  await expect.poll(uncovered).toBe(true)
  // Each disc opens its own visit.
  await antioch.locator('[data-visits="17"]').click()
  await expect(page).toHaveURL(/\?stop=18$/)
})

test('with reduced motion, the route and its stops appear at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/journey/paul-second-missionary-journey')
  // One marker per place (Antioch is both the first and the last stop).
  await expect(page.locator('.atlas-marker')).toHaveCount(17, { timeout: 20_000 })
  await expect(page.locator('.atlas-marker[data-revealed="false"]')).toHaveCount(0)
  const animating = await page.evaluate(
    () => document.getAnimations().filter((animation) => animation.playState === 'running' && Number(animation.effect?.getTiming().duration) > 50).length,
  )
  expect(animating).toBe(0)
})

test('a shared stop link reopens that stop with its Scripture', async ({ page }) => {
  const problems = watchConsole(page)
  await page.goto('/journey/paul-second-missionary-journey?stop=7')
  const stop = page.getByRole('article', { name: 'Philippi' })
  await expect(stop).toContainText('07')
  await expect(stop).toContainText('Acts 16:12–15 · 16:16–40')
  // The stop is characterized by the text itself, not by editorial claims.
  await expect(stop).toContainText('“a city of Macedonia, the foremost of the district, a Roman colony”')
  await expect(stop).toContainText('Acts 16:12 · WEB')
  await expect(stop.getByRole('region', { name: 'Editorial summary' })).toContainText('Lydia is baptized')
  // Phones show the timeline inside the stop card; larger screens show it as a rail.
  await expect(page.locator('[aria-current="step"]').filter({ visible: true })).toHaveAccessibleName(/^Stop 7: Philippi/)
  await expect(page.getByRole('toolbar', { name: 'Journey controls' })).toContainText('Stop 7 of 18')
  await expect(page.locator('body')).not.toContainText('first recorded ministry in Europe')
  await page.reload()
  await expect(page.getByRole('article', { name: 'Philippi' })).toBeVisible()
  expect(problems).toEqual([])
})

test('the Scripture reader quotes the WEB, moves between references and closes with Escape', async ({ page }) => {
  await page.goto('/journey/paul-second-missionary-journey?stop=7')
  await page.getByRole('button', { name: 'Read Acts 16:16–40' }).click()
  const reader = page.getByRole('dialog', { name: 'Acts 16:16–40' })
  await expect(reader).toBeVisible()
  await expect(reader).toContainText('World English Bible · WEB')
  // Quoted exactly as the WEB has it.
  await expect(reader).toContainText('But about midnight Paul and Silas were praying and singing hymns to God')
  await reader.getByRole('button', { name: 'Previous reference' }).click()
  await expect(page.getByRole('dialog', { name: 'Acts 16:12–15' })).toContainText('a seller of purple, of the city of Thyatira')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('collections are not drawn as routes', async ({ page }) => {
  await page.goto('/journey/ministry-of-jesus')
  await expect(page.getByText('Collection · Not a route')).toBeVisible()
  await expect(page.getByText(/The Gospels do not give a complete itinerary/)).toBeVisible()
})

test('uncertain locations are labelled and explained', async ({ page }) => {
  await page.goto('/place/bethsaida')
  await expect(page.getByRole('heading', { level: 1, name: 'Bethsaida' })).toBeVisible()
  await expect(page.getByRole('definition').filter({ hasText: /^Location debated$/ })).toBeVisible()
  await expect(page.getByText(/leading candidates are et-Tell and el-Araj/)).toBeVisible()
  // Candidate sites are not presented as names for the place.
  await expect(page.getByText(/Also called/)).toHaveCount(0)
})

test('people are grouped, with the Twelve and Matthias kept distinct', async ({ page }) => {
  await page.goto('/people')
  await expect(page.getByRole('heading', { level: 1, name: 'People' })).toBeVisible()
  const twelve = page.getByRole('region', { name: 'Jesus and the Twelve' })
  for (const name of ['Peter', 'Thaddaeus', 'Judas Iscariot', 'Bartholomew', 'Simon the Zealot']) {
    await expect(twelve.getByRole('link', { name: new RegExp(`^${name}\\b`) })).toBeVisible()
  }
  await expect(page.getByText(/counted with the eleven apostles/)).toBeVisible()
  await page.getByRole('searchbox', { name: 'Find a person' }).fill('Lebbaeus')
  await expect(page.getByRole('link', { name: /^Thaddaeus\b/ })).toBeVisible()
})

test('a person page is built from the events that name them', async ({ page }) => {
  const problems = watchConsole(page)
  await page.goto('/person/timothy')
  await expect(page.getByRole('heading', { level: 1, name: 'Timothy' })).toBeVisible()
  const places = page.getByRole('region', { name: 'Where their story unfolds' }).getByRole('list')
  for (const name of ['Lystra', 'Philippi', 'Thessalonica', 'Berea', 'Athens', 'Corinth', 'Ephesus']) {
    await expect(places.getByRole('link', { name: new RegExp(`^${name}`) })).toBeVisible()
  }
  await expect(page.getByRole('region', { name: 'People connected' }).getByRole('link', { name: /^Silas/ })).toBeVisible()
  expect(problems).toEqual([])
})

test('Thaddaeus keeps his names from the text and labels tradition as tradition', async ({ page }) => {
  await page.goto('/person/thaddaeus')
  await expect(page.getByRole('heading', { level: 1, name: 'Thaddaeus' })).toBeVisible()
  await expect(page.getByText(/Also called Lebbaeus, Judas son of James/)).toBeVisible()
  await expect(page.getByText(/traditional and uncertain/)).toBeVisible()
})

test('an original apostle and Matthias are presented distinctly', async ({ page }) => {
  await page.goto('/person/bartholomew')
  await expect(page.getByRole('heading', { level: 1, name: 'Bartholomew' })).toBeVisible()
  await expect(page.getByRole('article').locator('p.eyebrow').first()).toHaveText('Jesus and the Twelve')
  // Tradition is labelled as tradition, not merged into the record.
  await expect(page.getByText(/Tradition sometimes identifies him with Nathanael/)).toBeVisible()

  await page.goto('/person/matthias')
  await expect(page.getByRole('heading', { level: 1, name: 'Matthias' })).toBeVisible()
  await expect(page.getByRole('article').locator('p.eyebrow').first()).not.toContainText('Twelve')
  await expect(page.getByText(/counted with the eleven apostles/).first()).toBeVisible()
})

test('the final week is a collection that opens stop by stop', async ({ page }) => {
  await page.goto('/journey/final-week-in-jerusalem')
  await expect(page.getByRole('heading', { level: 1, name: 'The Final Week in Jerusalem' })).toBeVisible()
  await expect(page.getByText('Collection · Not a route')).toBeVisible()
  await page.getByRole('button', { name: 'Explore the places' }).click()
  await expect(page).toHaveURL(/\?stop=1$/)
  await expect(page.getByRole('toolbar', { name: 'Journey controls' })).toContainText(/Stop 1 of \d+/)
})

test('Journey Mode works from the keyboard and announces each stop', async ({ page }) => {
  await page.goto('/journey/paul-second-missionary-journey?stop=7')
  await expect(page.getByRole('article', { name: 'Philippi' })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\?stop=8$/)
  await expect(page.getByRole('article', { name: 'Amphipolis' })).toBeVisible()
  await expect(page.locator('[aria-live="polite"][aria-atomic="true"]')).toHaveText('Stop 8 of 18: Amphipolis')
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(/\?stop=7$/)
  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/\/journey\/paul-second-missionary-journey$/)
})

test('the Scripture reader keeps keyboard focus inside until it is closed', async ({ page }) => {
  await page.goto('/journey/paul-second-missionary-journey?stop=7')
  const opener = page.getByRole('button', { name: 'Read Acts 16:16–40' })
  await opener.click()
  await expect(page.getByRole('dialog', { name: 'Acts 16:16–40' })).toBeVisible()
  for (let press = 0; press < 8; press++) {
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog[open]')))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('the search field is a keyboard combobox', async ({ page }) => {
  await page.goto('/')
  const search = await openSearch(page)
  await search.fill('Corinth')
  await expect(page.getByRole('option').first()).toBeVisible()
  const first = await search.getAttribute('aria-activedescendant')
  await search.press('ArrowDown')
  await expect(search).not.toHaveAttribute('aria-activedescendant', first ?? '')
  await search.press('ArrowUp')
  await expect(search).toHaveAttribute('aria-activedescendant', first ?? '')
  await search.press('Enter')
  await expect(page).toHaveURL(/\/place\/corinth$/)
})

test('when map tiles fail, the atlas says so and keeps working', async ({ page }) => {
  await page.route(/tiles\.openfreemap\.org\/planet\/.+\.pbf/, (route) => route.abort())
  await page.goto('/journey/paul-second-missionary-journey')
  await expect(page.getByRole('status').filter({ hasText: 'Map tiles are having trouble loading' })).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Begin Journey' }).click()
  await expect(page.getByRole('article', { name: 'Antioch' })).toBeVisible()
})

test('unknown addresses show a helpful page instead of a blank screen', async ({ page }) => {
  await page.goto('/journey/not-a-real-journey')
  await expect(page.getByRole('heading', { name: 'Journey not found' })).toBeVisible()
  await page.goto('/totally/unknown')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
})

test('every place is reachable without the map', async ({ page }) => {
  await page.goto('/places')
  await expect(page.getByRole('heading', { level: 1, name: 'Places' })).toBeVisible()
  await page.getByRole('searchbox', { name: 'Filter places' }).fill('Kavala')
  await expect(page.getByRole('link', { name: /Neapolis/ })).toBeVisible()
})

test('the opening view indexes the atlas, with counts from the data', async ({ page }) => {
  const entries = [
    [`${allJourneys.length} Journeys & collections, explore journeys and collections`, /\/journeys$/, 'Journeys and collections'],
    [`${allPlaces.length} Places, explore places`, /\/places$/, 'Places'],
    [`${allPeople.length} People, explore people`, /\/people$/, 'People'],
    [`${allEvents.length} Events, explore events`, /\/events$/, 'Events'],
  ] as const
  for (const [name, url, heading] of entries) {
    await page.goto('/')
    const link = page.getByRole('region', { name: 'Explore the atlas' }).getByRole('link', { name, exact: true })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(url)
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
  }
})

test('the atlas index works from the keyboard', async ({ page }) => {
  await page.goto('/')
  // The index follows the example searches in the tab order.
  await page.getByRole('button', { name: 'Timothy', exact: true }).focus()
  for (const name of [/Journeys & collections, explore/, /Places, explore places/, /People, explore people/, /Events, explore events/]) {
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name })).toBeFocused()
  }
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/events$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Events' })).toBeVisible()
})

test('events can be browsed and searched, and open their passage, places, people and journey', async ({ page }) => {
  await page.goto('/events')
  await expect(page.getByText(`${allEvents.length} events`, { exact: true })).toBeVisible()
  const filter = page.getByRole('searchbox', { name: 'Find an event' })
  const event = (title: string) => page.getByRole('listitem').filter({ has: page.getByRole('heading', { level: 3, name: title, exact: true }) })

  // A passage lists the events it narrates.
  await filter.fill('Acts 16')
  await expect(event('Lydia is baptized')).toBeVisible()
  await expect(event('Prison, earthquake and the jailer')).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Matthew' })).toHaveCount(0)

  const jailer = event('Prison, earthquake and the jailer')
  await jailer.getByRole('button', { name: 'Read Acts 16:16–40' }).click()
  const reader = page.getByRole('dialog', { name: 'Acts 16:16–40' })
  await expect(reader.getByText(/about midnight Paul and Silas were praying/)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(reader).toBeHidden()

  await jailer.getByRole('link', { name: /^Second Journey · Stop 7/ }).click()
  await expect(page).toHaveURL(/\/journey\/paul-second-missionary-journey\?stop=7$/)
  await page.goBack()
  await page.getByRole('searchbox', { name: 'Find an event' }).fill('Lydia')
  await event('Lydia is baptized').getByRole('link', { name: 'Philippi', exact: true }).click()
  await expect(page).toHaveURL(/\/place\/philippi$/)
  await page.goBack()
  await page.getByRole('searchbox', { name: 'Find an event' }).fill('Lydia')
  await event('Lydia is baptized').getByRole('link', { name: 'Lydia', exact: true }).click()
  await expect(page).toHaveURL(/\/person\/lydia$/)

  await page.goto('/events')
  await page.getByRole('searchbox', { name: 'Find an event' }).fill('no such event')
  await expect(page.getByText('No events match “no such event”.')).toBeVisible()
})

test('pages never scroll sideways', async ({ page }) => {
  const paths = ['/', '/journey/paul-second-missionary-journey', '/journey/paul-second-missionary-journey?stop=7', '/place/philippi', '/people', '/person/timothy', '/journeys', '/events', '/about']
  for (const path of paths) {
    await page.goto(path)
    await page.waitForTimeout(500)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})

test('keyword search keeps working when the AI model cannot load', async ({ page }) => {
  await page.route(/huggingface\.co|hf\.co|cdn\.jsdelivr\.net/, (route) => route.abort())
  await page.goto('/')
  await (await openSearch(page)).fill('Philippi')
  await expect(page.getByRole('option', { name: /^Philippi/ }).first()).toBeVisible()
})
