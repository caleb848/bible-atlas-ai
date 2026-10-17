import { describe, expect, it } from 'vitest'
import { ATLAS_COLORS } from './atlasStyle'

/** WCAG relative luminance of a #rrggbb colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
  const linear = (channel: number) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return 0.2126 * linear(r!) + 0.7152 * linear(g!) + 0.0722 * linear(b!)
}

const contrast = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light! + 0.05) / (dark! + 0.05)
}

/** `foreground` drawn at `alpha` over `background`. */
const blend = (foreground: string, background: string, alpha: number) =>
  `#${[1, 3, 5]
    .map((start) => {
      const value = alpha * Number.parseInt(foreground.slice(start, start + 2), 16) + (1 - alpha) * Number.parseInt(background.slice(start, start + 2), 16)
      return Math.round(value).toString(16).padStart(2, '0')
    })
    .join('')}`

describe('map colours', () => {
  it('keeps routes at a 3:1 contrast or more against land and sea (WCAG 1.4.11)', () => {
    for (const ground of [ATLAS_COLORS.land, ATLAS_COLORS.water]) {
      expect(contrast(ATLAS_COLORS.route, ground)).toBeGreaterThanOrEqual(3)
      expect(contrast(ATLAS_COLORS.routeActive, ground)).toBeGreaterThanOrEqual(3)
      // The opening view's journey lines are drawn at 85% opacity.
      expect(contrast(blend(ATLAS_COLORS.overview, ground, 0.85), ground)).toBeGreaterThanOrEqual(3)
    }
  })
})
