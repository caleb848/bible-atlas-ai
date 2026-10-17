export type LabelPlacement = 'right' | 'left' | 'top' | 'bottom' | 'hidden'

export interface LabelItem {
  id: string
  /** Marker centre in screen pixels. */
  x: number
  y: number
  /** Half the marker's height in pixels. */
  radius: number
  /** Half the marker's width, when it is wider than tall (it lists several stop numbers). */
  halfWidth?: number
  labelWidth: number
  labelHeight: number
  priority: number
  /** Always shown (the selected marker), preferring the side clear of obstacles, then of markers. */
  force?: boolean
}

/** A rectangle in the map's screen pixels. */
export interface ScreenRect {
  left: number
  top: number
  right: number
  bottom: number
}

/** Space between a marker and its label; matches the stylesheet. */
const GAP = 4
const overlaps = (a: ScreenRect, b: ScreenRect) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom

/**
 * Greedy label placement: higher-priority labels go first, to the right of their marker if
 * there is room, otherwise to the left, otherwise they are hidden. Labels never cover another
 * marker or another label, so dense clusters (Galilee, Jerusalem) stay legible at every zoom,
 * and never run under an obstacle (such as the side panel) or past the edge of `bounds`, where
 * they would be cut off. A forced (selected) label may also sit above or below its marker, which
 * suits its two lines when both sides are crowded.
 */
export function layoutLabels(
  items: readonly LabelItem[],
  { obstacles = [], bounds }: { obstacles?: readonly ScreenRect[]; bounds?: ScreenRect } = {},
): Map<string, LabelPlacement> {
  const result = new Map<string, LabelPlacement>()
  const halfWidth = (item: LabelItem) => item.halfWidth ?? item.radius
  const circles: ScreenRect[] = items.map((item) => ({
    left: item.x - halfWidth(item),
    right: item.x + halfWidth(item),
    top: item.y - item.radius,
    bottom: item.y + item.radius,
  }))
  const placed: ScreenRect[] = []
  const outside = (rect: ScreenRect) =>
    bounds !== undefined &&
    (rect.left < bounds.left || rect.right > bounds.right || rect.top < bounds.top || rect.bottom > bounds.bottom)
  const blocked = (rect: ScreenRect) => outside(rect) || obstacles.some((obstacle) => overlaps(rect, obstacle))

  const sorted = [...items].sort((a, b) => b.priority - a.priority)
  for (const item of sorted) {
    const top = item.y - item.labelHeight / 2
    const centred = { left: item.x - item.labelWidth / 2, right: item.x + item.labelWidth / 2 }
    const candidates: Array<[LabelPlacement, ScreenRect]> = [
      ['right', { left: item.x + halfWidth(item) + GAP, right: item.x + halfWidth(item) + GAP + item.labelWidth, top, bottom: top + item.labelHeight }],
      ['left', { left: item.x - halfWidth(item) - GAP - item.labelWidth, right: item.x - halfWidth(item) - GAP, top, bottom: top + item.labelHeight }],
      ...(item.force
        ? ([
            ['top', { ...centred, top: item.y - item.radius - GAP - item.labelHeight, bottom: item.y - item.radius - GAP }],
            ['bottom', { ...centred, top: item.y + item.radius + GAP, bottom: item.y + item.radius + GAP + item.labelHeight }],
          ] as Array<[LabelPlacement, ScreenRect]>)
        : []),
    ]
    const ownIndex = items.indexOf(item)
    const free = candidates.find(
      ([, rect]) =>
        !blocked(rect) &&
        !placed.some((other) => overlaps(rect, other)) &&
        !circles.some((circle, index) => index !== ownIndex && overlaps(rect, circle)),
    )
    if (free) {
      result.set(item.id, free[0])
      placed.push(free[1])
    } else if (item.force) {
      // Being cut off outweighs any number of covered markers.
      const cost = (rect: ScreenRect) =>
        (blocked(rect) ? items.length : 0) + circles.filter((circle, index) => index !== ownIndex && overlaps(rect, circle)).length
      const [placement, rect] = candidates.reduce((best, candidate) => (cost(candidate[1]) < cost(best[1]) ? candidate : best))
      result.set(item.id, placement)
      placed.push(rect)
    } else {
      result.set(item.id, 'hidden')
    }
  }
  return result
}

/**
 * Markers crowded together at low zoom: when one marker would mostly cover another, the
 * lower-priority one shrinks to a small dot until the map is zoomed in. Higher priority wins, ties
 * go to the earlier item (the earlier stop), and forced (selected) markers never shrink.
 */
export function compactMarkers(items: readonly LabelItem[], overlap = 0.8): Set<string> {
  const compact = new Set<string>()
  const kept: LabelItem[] = []
  const order = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => Number(Boolean(b.item.force)) - Number(Boolean(a.item.force)) || b.item.priority - a.item.priority || a.index - b.index)
  for (const { item } of order) {
    const crowded =
      !item.force &&
      kept.some((other) => Math.hypot(item.x - other.x, item.y - other.y) < (item.radius + other.radius) * overlap)
    if (crowded) compact.add(item.id)
    else kept.push(item)
  }
  return compact
}
