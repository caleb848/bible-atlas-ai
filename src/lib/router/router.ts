import { useSyncExternalStore } from 'react'
import { parseRoute, type Route, routePath } from './routes'

const NAVIGATE_EVENT = 'atlas:navigate'

let cachedKey = ''
let cachedRoute: Route = { name: 'home' }

function currentRoute(): Route {
  const key = window.location.pathname + window.location.search
  if (key !== cachedKey) {
    cachedKey = key
    cachedRoute = parseRoute(window.location.pathname, window.location.search)
  }
  return cachedRoute
}

/** The route being rendered on the server (build-time pre-rendering). */
let serverRoute: Route | null = null

export function setServerPath(pathname: string) {
  serverRoute = parseRoute(pathname)
}

let hydrationPath = ''
let hydrationRoute: Route = { name: 'home' }

/**
 * The route the HTML was rendered for. Pages are pre-rendered per path, without query strings,
 * so hydration uses the path alone; React then re-renders with the full route (e.g. `?stop=7`).
 */
function initialRoute(): Route {
  if (serverRoute) return serverRoute
  if (typeof window === 'undefined') return { name: 'home' }
  if (window.location.pathname !== hydrationPath) {
    hydrationPath = window.location.pathname
    hydrationRoute = parseRoute(window.location.pathname)
  }
  return hydrationRoute
}

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(NAVIGATE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(NAVIGATE_EVENT, onChange)
  }
}

/** The current route, kept in sync with the address bar (including back/forward). */
export function useRoute(): Route {
  return useSyncExternalStore(subscribe, currentRoute, initialRoute)
}

/**
 * Navigates without reloading. `replace` is used for fine-grained state such as the selected
 * stop, so the back button returns to the previous screen rather than stepping through stops.
 */
export function navigate(route: Route, options: { replace?: boolean } = {}) {
  const path = routePath(route)
  if (path === window.location.pathname + window.location.search) return
  if (options.replace) window.history.replaceState(window.history.state, '', path)
  else window.history.pushState({ depth: historyDepth() + 1 }, '', path)
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
}

/** How many in-app screens are behind the current one (0 when the visitor arrived here directly). */
const historyDepth = (): number => {
  const depth = (window.history.state as { depth?: unknown } | null)?.depth
  return typeof depth === 'number' ? depth : 0
}

/** Goes back within the app, or to the start if this page was opened directly. */
export function goBack() {
  if (historyDepth() > 0) window.history.back()
  else navigate({ name: 'home' })
}
