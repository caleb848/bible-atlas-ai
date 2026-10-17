import { AxeBuilder } from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

/**
 * Automated WCAG 2.1 A/AA checks (axe-core) on every kind of page, including the open search
 * answer and the Scripture reader. Automated checks catch only part of what matters; keyboard
 * and screen-reader behaviour are covered by the other tests and by hand.
 */
/** Waits for entrance animations (fades change measured colours); endless ones are ignored. */
const settle = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  )

const scan = async (page: Page) => {
  await settle(page)
  return (
    await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // The WebGL canvas is drawn by MapLibre; every place it shows is also a labelled button.
      .exclude('.maplibregl-canvas')
      .analyze()
  ).violations.flatMap((violation) =>
    violation.nodes.map((node) => `${violation.id}: ${node.target.join(' ')} — ${node.any[0]?.message ?? node.failureSummary ?? ''}`),
  )
}

const pages = [
  '/',
  '/journeys',
  '/journey/paul-second-missionary-journey',
  '/journey/paul-second-missionary-journey?stop=7',
  '/journey/women-in-the-gospels-and-acts',
  '/place/philippi',
  '/place/bethsaida',
  '/places',
  '/people',
  '/events',
  '/person/timothy',
  '/person/thaddaeus',
  '/about',
]

/** Pages with map markers: they are scanned once the map has drawn them. */
const MAP_PAGE = /^\/(journey|place|person)\/|^\/places$/

for (const path of pages) {
  test(`no automatically detectable accessibility problems on ${path}`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    if (MAP_PAGE.test(path)) {
      await expect(page.locator('.atlas-marker button').first()).toBeAttached({ timeout: 20_000 })
      await expect(page.locator('.atlas-marker[data-revealed="false"]')).toHaveCount(0, { timeout: 20_000 })
    }
    expect(await scan(page)).toEqual([])
  })
}

test('no automatically detectable accessibility problems in a search answer', async ({ page }) => {
  await page.goto('/')
  if ((page.viewportSize()?.width ?? 1440) < 900) await page.getByRole('button', { name: 'Search', exact: true }).click()
  await page.getByRole('combobox', { name: 'Search the atlas' }).fill('Where did Paul go after Philippi?')
  await expect(page.getByRole('region', { name: 'Answer' })).toBeVisible()
  expect(await scan(page)).toEqual([])
})

test('no automatically detectable accessibility problems in the Scripture reader', async ({ page }) => {
  await page.goto('/journey/paul-second-missionary-journey?stop=7')
  await page.getByRole('button', { name: 'Read Acts 16:16–40' }).click()
  await expect(page.getByRole('dialog', { name: 'Acts 16:16–40' })).toContainText('But about midnight')
  expect(await scan(page)).toEqual([])
})
