import { useSyncExternalStore } from 'react'

/**
 * A single polite live region for screen readers. Views announce meaningful changes (a journey
 * opening, the selected stop changing) that are otherwise only visible on the map.
 */
let message = ''
const listeners = new Set<() => void>()

export function announce(text: string) {
  // Clearing first makes repeated identical messages audible.
  message = ''
  listeners.forEach((listener) => listener())
  requestAnimationFrame(() => {
    message = text
    listeners.forEach((listener) => listener())
  })
}

export function useAnnouncement(): string {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => message,
    () => '',
  )
}
