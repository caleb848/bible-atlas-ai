import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Wide screens get the floating side panel; narrower screens get the bottom sheet. */
export const useIsDesktop = () => useMediaQuery('(min-width: 900px)')

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
