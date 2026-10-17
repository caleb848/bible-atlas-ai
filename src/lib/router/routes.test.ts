import { describe, expect, it } from 'vitest'
import { parseRoute, routePath } from './routes'

describe('routes', () => {
  it('parses shareable URLs', () => {
    expect(parseRoute('/')).toEqual({ name: 'home' })
    expect(parseRoute('/journey/paul-second-missionary-journey')).toEqual({
      name: 'journey',
      id: 'paul-second-missionary-journey',
    })
    expect(parseRoute('/journey/paul-second-missionary-journey', '?stop=7')).toEqual({
      name: 'journey',
      id: 'paul-second-missionary-journey',
      stop: 7,
    })
    expect(parseRoute('/place/philippi/')).toEqual({ name: 'place', id: 'philippi' })
    expect(parseRoute('/person/lydia')).toEqual({ name: 'person', id: 'lydia' })
    expect(parseRoute('/about')).toEqual({ name: 'about' })
    expect(parseRoute('/journeys')).toEqual({ name: 'journeys' })
    expect(parseRoute('/events')).toEqual({ name: 'events' })
  })

  it('ignores invalid stop numbers and unknown paths', () => {
    expect(parseRoute('/journey/x', '?stop=abc')).toEqual({ name: 'journey', id: 'x' })
    expect(parseRoute('/journey/x', '?stop=0')).toEqual({ name: 'journey', id: 'x' })
    expect(parseRoute('/journeys/all')).toEqual({ name: 'not-found', path: '/journeys/all' })
    expect(parseRoute('/place/Not_A_Slug')).toEqual({ name: 'not-found', path: '/place/Not_A_Slug' })
  })

  it('round-trips', () => {
    for (const path of ['/', '/journey/paul-journey-to-rome?stop=3', '/place/rome', '/people', '/events', '/journeys', '/about']) {
      const [pathname, search] = path.split('?')
      expect(routePath(parseRoute(pathname!, search ? `?${search}` : ''))).toBe(path)
    }
  })
})
