import { describe, expect, it } from 'vitest'
import { compactMarkers, type LabelItem, layoutLabels } from './labelLayout'

const item = (id: string, x: number, y: number, priority = 1): LabelItem => ({
  id,
  x,
  y,
  radius: 10,
  labelWidth: 80,
  labelHeight: 18,
  priority,
})

describe('layoutLabels', () => {
  it('places isolated labels to the right', () => {
    expect(layoutLabels([item('a', 0, 0), item('b', 0, 200)])).toEqual(
      new Map([
        ['a', 'right'],
        ['b', 'right'],
      ]),
    )
  })

  it('moves a colliding label to the left before hiding it', () => {
    const placements = layoutLabels([item('selected', 0, 0, 3), item('neighbour', 40, 0, 1)])
    expect(placements.get('selected')).toBe('left')
    expect(placements.get('neighbour')).toBe('right')
  })

  it('hides a label only when both sides are taken', () => {
    const placements = layoutLabels([item('high', 0, 0, 3), item('mid', 4, 2, 2), item('low', 2, -3, 1)])
    expect(placements.get('high')).toBe('right')
    expect(placements.get('mid')).toBe('left')
    expect(placements.get('low')).toBe('hidden')
  })

  it('always shows a forced (selected) label', () => {
    const crowded = [item('a', 40, 0, 2), item('b', -40, 0, 2)]
    const placements = layoutLabels([{ ...item('selected', 0, 0, 10), force: true }, ...crowded])
    expect(placements.get('selected')).not.toBe('hidden')
  })

  it('moves a selected label above or below its marker when both sides are crowded', () => {
    const crowded = [item('right-neighbour', 45, 0, 2), item('left-neighbour', -45, 0, 2)]
    const placements = layoutLabels([{ ...item('selected', 0, 0, 10), force: true }, ...crowded])
    expect(['top', 'bottom']).toContain(placements.get('selected'))
    // Other labels still only use the sides.
    expect(['left', 'right', 'hidden']).toContain(placements.get('right-neighbour'))
  })

  it('keeps labels out from under the panel', () => {
    const panel = { left: -1000, right: 0, top: -100, bottom: 100 }
    const items = [item('edge', 50, 0, 1), item('neighbour', 90, 0, 3)]
    expect(layoutLabels(items).get('edge')).toBe('left')
    expect(layoutLabels(items, { obstacles: [panel] }).get('edge')).toBe('hidden')
    // A selected label never runs under the panel: it goes above or below its marker instead...
    const selected = [{ ...items[0]!, force: true }, items[1]!]
    expect(['top', 'bottom']).toContain(layoutLabels(selected, { obstacles: [panel] }).get('edge'))
    // ...and when there is no room above or below either, it prefers covering a marker.
    const flat = { left: -1000, right: 1000, top: -12, bottom: 12 }
    expect(layoutLabels(selected, { obstacles: [panel], bounds: flat }).get('edge')).toBe('right')
  })

  it('keeps labels on screen', () => {
    const bounds = { left: 0, right: 400, top: 0, bottom: 300 }
    expect(layoutLabels([item('near-edge', 360, 150)], { bounds }).get('near-edge')).toBe('left')
    expect(layoutLabels([item('off-screen', 420, 150)], { bounds }).get('off-screen')).toBe('hidden')
  })

  it('shrinks crowded markers but never the selected one', () => {
    const crowd = [item('first', 0, 0, 2), item('second', 6, 0, 2), { ...item('selected', 12, 0, 2), force: true }, item('far', 200, 0, 2)]
    expect([...compactMarkers(crowd)].sort()).toEqual(['first', 'second'])
  })
})
