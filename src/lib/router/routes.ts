/** Every screen in the app is addressable by URL, so any view can be shared or reloaded. */
export type Route =
  | { name: 'home' }
  | { name: 'journey'; id: string; stop?: number }
  | { name: 'place'; id: string }
  | { name: 'person'; id: string }
  | { name: 'journeys' }
  | { name: 'places' }
  | { name: 'people' }
  | { name: 'events' }
  | { name: 'about' }
  | { name: 'not-found'; path: string }

const SLUG = '([a-z0-9]+(?:-[a-z0-9]+)*)'
const patterns: Array<[RegExp, (match: RegExpExecArray, params: URLSearchParams) => Route]> = [
  [/^\/$/, () => ({ name: 'home' })],
  [
    new RegExp(`^/journey/${SLUG}/?$`),
    (match, params) => {
      const stop = Number(params.get('stop'))
      return { name: 'journey', id: match[1]!, ...(Number.isInteger(stop) && stop > 0 ? { stop } : {}) }
    },
  ],
  [new RegExp(`^/place/${SLUG}/?$`), (match) => ({ name: 'place', id: match[1]! })],
  [new RegExp(`^/person/${SLUG}/?$`), (match) => ({ name: 'person', id: match[1]! })],
  [/^\/journeys\/?$/, () => ({ name: 'journeys' })],
  [/^\/places\/?$/, () => ({ name: 'places' })],
  [/^\/people\/?$/, () => ({ name: 'people' })],
  [/^\/events\/?$/, () => ({ name: 'events' })],
  [/^\/about\/?$/, () => ({ name: 'about' })],
]

export function parseRoute(pathname: string, search = ''): Route {
  const params = new URLSearchParams(search)
  for (const [pattern, build] of patterns) {
    const match = pattern.exec(pathname)
    if (match) return build(match, params)
  }
  return { name: 'not-found', path: pathname }
}

export function routePath(route: Route): string {
  switch (route.name) {
    case 'home':
      return '/'
    case 'journey':
      return route.stop ? `/journey/${route.id}?stop=${route.stop}` : `/journey/${route.id}`
    case 'place':
      return `/place/${route.id}`
    case 'person':
      return `/person/${route.id}`
    case 'journeys':
      return '/journeys'
    case 'places':
      return '/places'
    case 'people':
      return '/people'
    case 'events':
      return '/events'
    case 'about':
      return '/about'
    case 'not-found':
      return route.path
  }
}
