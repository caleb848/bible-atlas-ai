import { useEffect, useState } from 'react'

export interface MapInsets {
  top: number
  right: number
  bottom: number
  left: number
}

const MARGIN = 20
const EDGE = 48
/** The top bar always floats over the map. */
const MIN_TOP = 72
/** Surfaces that cover the map. `data-map-obstacle="labels"` marks ones that only keep labels clear. */
const SURFACES = '[data-map-obstacle]:not([data-map-obstacle="labels"])'

const sameInsets = (a: MapInsets, b: MapInsets) =>
  a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left

/**
 * How much of the map each floating surface covers, so the camera frames content in the part of
 * the map that is actually visible. Surfaces mark themselves with `data-map-obstacle`; a tall
 * surface against the left or right edge becomes a side inset, and anything resting on the bottom
 * edge (the phone sheet, the journey controls) becomes the bottom inset.
 *
 * Measurement is debounced so a sheet animating to a new height moves the camera once, not on
 * every frame. `version` should change whenever the set of surfaces may change.
 */
export function useMapInsets(version: string): MapInsets {
  const [insets, setInsets] = useState<MapInsets>({ top: MIN_TOP, right: MARGIN, bottom: MARGIN, left: MARGIN })

  useEffect(() => {
    let timer: number | undefined
    const measure = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const next: MapInsets = { top: MIN_TOP, right: MARGIN, bottom: MARGIN, left: MARGIN }
      for (const element of document.querySelectorAll<HTMLElement>(SURFACES)) {
        const rect = element.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0 || getComputedStyle(element).opacity === '0') continue
        const tall = rect.height >= height * 0.3
        if (rect.left <= EDGE && rect.width <= width * 0.62 && tall) next.left = Math.max(next.left, rect.right + MARGIN)
        else if (rect.right >= width - EDGE && rect.width <= width * 0.62 && tall) {
          next.right = Math.max(next.right, width - rect.left + MARGIN)
        } else if (rect.bottom >= height - EDGE * 2.5 && rect.top >= height * 0.35) {
          next.bottom = Math.max(next.bottom, height - rect.top + MARGIN)
        } else if (rect.top <= EDGE && rect.width >= width * 0.62) next.top = Math.max(next.top, rect.bottom + MARGIN)
      }
      setInsets((current) => (sameInsets(current, next) ? current : next))
    }
    const schedule = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(measure, 120)
    }

    measure()
    const observer = new ResizeObserver(schedule)
    for (const element of document.querySelectorAll(SURFACES)) observer.observe(element)
    window.addEventListener('resize', schedule)
    // Surfaces slide in and out with CSS transitions; measure again once they settle.
    document.addEventListener('transitionend', schedule)
    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      document.removeEventListener('transitionend', schedule)
    }
    // `version` is the trigger: it changes when floating surfaces may have appeared or gone.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [version])

  return insets
}
