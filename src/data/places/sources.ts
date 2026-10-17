import type { CoordinateSource } from '../types'

export const openBible = (id: string): CoordinateSource => ({
  name: 'OpenBible.info',
  id,
  url: `https://www.openbible.info/geo/ancient/${id}`,
})

export const pleiades = (id: string): CoordinateSource => ({
  name: 'Pleiades',
  id,
  url: `https://pleiades.stoa.org/places/${id}`,
})

export const wikidata = (id: string): CoordinateSource => ({
  name: 'Wikidata',
  id,
  url: `https://www.wikidata.org/wiki/${id}`,
})
