import { expect, test } from '@playwright/test'

// Without WebGL the map cannot run; the atlas must stay fully usable.
test.use({ launchOptions: { args: ['--disable-webgl', '--disable-webgl2'], firefoxUserPrefs: { 'webgl.disabled': true } } })

test('without WebGL, journeys still work with a schematic map', async ({ page }) => {
  await page.goto('/journey/paul-journey-to-rome')
  await expect(page.getByText('The interactive map isn’t available')).toBeVisible()
  await expect(page.getByRole('img', { name: /Schematic view of the route/ })).toBeVisible()
  await page.getByRole('button', { name: /Malta/ }).first().click()
  await expect(page.getByRole('article', { name: 'Malta' })).toContainText('The shipwreck')
  await expect(page.getByRole('toolbar', { name: 'Journey controls' })).toContainText('Stop 8 of 14')
})
