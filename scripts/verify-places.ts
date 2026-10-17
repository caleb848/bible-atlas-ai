/**
 * Verifies every place against its primary coordinate source and checks that each certainty
 * label agrees with OpenBible.info's confidence score.
 *
 *   npm run data:verify [-- --openbible .cache/sources/openbible/ancient.jsonl]
 *
 * The first source listed on a place is its primary source. OpenBible.info records are read from
 * the downloaded dataset (`npm run data:sources`); Pleiades and Wikidata are queried online.
 * Exits non-zero if any coordinate differs from its source by more than the tolerance.
 */
import { createReadStream } from 'node:fs'
import { join } from 'node:path'
import { createInterface } from 'node:readline'
import { parseArgs } from 'node:util'
import { places } from '../src/data/places'
import type { Certainty, Place } from '../src/data/types'
import { haversineKm, type LngLat } from '../src/lib/geo/geo'

const { values } = parseArgs({
  options: {
    openbible: { type: 'string', default: join('.cache', 'sources', 'openbible', 'ancient.jsonl') },
    tolerance: { type: 'string', default: '0.5' },
  },
})
const toleranceKm = Number(values.tolerance)
const USER_AGENT = 'BibleAtlasAI-data-verification/1.0'

/**
 * Places whose label is set by hand rather than by score, with the reason. Everything else must
 * match the score bands: identified >= 800, probable 500-799, debated below 500.
 */
const LABEL_OVERRIDES: Partial<Record<string, string>> = {
  rhodes: 'Score is split between the island (471) and its city (464); both resolve to the same point.',
  derbe: 'Scores 860, but an alternative site (Devri Şehri) is still proposed, so it is labelled conservatively.',
  'jordan-river': 'Traditional baptism site; the Gospels name only the river.',
  gethsemane: 'The garden shown is the traditional site.',
  golgotha: 'Traditional site (Church of the Holy Sepulchre), with a 19th-century alternative.',
  macedonia: 'Region; representative point.',
  greece: 'Region; representative point.',
  egypt: 'Region; representative point.',
  samaria: 'Region; the marker is OpenBible.info’s representative point for the region (at the ancient city of Samaria).',
  arabia: 'Region; Paul does not say where in Arabia he went. Representative point (OpenBible.info, Arabia Petraea).',
  phoenicia: 'Region; representative point (Pleiades). OpenBible.info’s point coincides with Tyre.',
  syria: 'Region; representative point (Pleiades, Roman province of Syria). OpenBible.info’s point coincides with Damascus.',
  cilicia: 'Region; representative point (Pleiades). OpenBible.info’s point coincides with Tarsus.',
  galilee: 'Region; representative point (OpenBible.info region record).',
  'judea-wilderness': 'Region; representative point (Wikidata, Judaean Desert).',
  'judean-hill-country': 'Region; Luke does not name the town. Representative point (Wikidata, Judaean Mountains).',
  'country-of-the-gadarenes':
    'Region (the district of the Gadarenes); representative point at the city of Gadara (OpenBible.info, Umm Qais). The text does not name the spot on the shore.',
  decapolis: 'Region; representative point (OpenBible.info region record).',
  gennesaret: 'Region (the plain of Gennesaret); representative point (OpenBible.info region record).',
  pontus: 'Region; representative point (OpenBible.info region record).',
  asia: 'Region (the Roman province of Asia); representative point (OpenBible.info region record).',
}

interface OpenBibleRecord {
  id: string
  identifications: Array<{ resolutions?: Array<{ lonlat?: string }> }>
  /** Location confidence per modern site, combining identification and resolution scores. */
  modern_associations?: Record<string, { score?: number }>
}

async function loadOpenBible(path: string): Promise<Map<string, OpenBibleRecord>> {
  const records = new Map<string, OpenBibleRecord>()
  const lines = createInterface({ input: createReadStream(path), crlfDelay: Infinity })
  for await (const line of lines) {
    if (!line.trim()) continue
    const record = JSON.parse(line) as OpenBibleRecord
    records.set(record.id, record)
  }
  return records
}

const parseLonLat = (value: string): LngLat => value.split(',').map(Number) as LngLat

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } })
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  return response.json()
}

async function sourcePoint(place: Place, openBible: Map<string, OpenBibleRecord>) {
  const source = place.sources[0]!
  if (source.name === 'OpenBible.info') {
    const record = openBible.get(source.id)
    const lonlat = record?.identifications[0]?.resolutions?.[0]?.lonlat
    if (!record || !lonlat) throw new Error(`OpenBible record ${source.id} has no coordinates`)
    const scores = Object.values(record.modern_associations ?? {}).map((association) => association.score ?? 0)
    return { point: parseLonLat(lonlat), score: scores.length > 0 ? Math.max(...scores) : undefined }
  }
  if (source.name === 'Pleiades') {
    const data = (await fetchJson(`https://pleiades.stoa.org/places/${source.id}/json`)) as { reprPoint?: LngLat }
    if (!data.reprPoint) throw new Error(`Pleiades ${source.id} has no representative point`)
    return { point: data.reprPoint, score: undefined }
  }
  const data = (await fetchJson(`https://www.wikidata.org/wiki/Special:EntityData/${source.id}.json`)) as {
    entities: Record<string, { claims: { P625?: Array<{ mainsnak: { datavalue: { value: { latitude: number; longitude: number } } } }> } }>
  }
  const coordinate = data.entities[source.id]?.claims.P625?.[0]?.mainsnak.datavalue.value
  if (!coordinate) throw new Error(`Wikidata ${source.id} has no coordinates`)
  return { point: [coordinate.longitude, coordinate.latitude] as LngLat, score: undefined }
}

function expectedLabel(score: number): Certainty {
  if (score >= 800) return 'identified'
  if (score >= 500) return 'probable'
  return 'debated'
}

const openBible = await loadOpenBible(values.openbible!)
let failures = 0
let labelWarnings = 0

for (const place of places) {
  try {
    const { point, score } = await sourcePoint(place, openBible)
    const offset = haversineKm(place.coordinates, point)
    const ok = offset <= toleranceKm
    if (!ok) failures++

    let labelNote = ''
    const override = LABEL_OVERRIDES[place.id]
    if (override) labelNote = `manual label: ${override}`
    else if (score !== undefined && expectedLabel(score) !== place.certainty) {
      labelWarnings++
      labelNote = `LABEL MISMATCH: score ${score} suggests "${expectedLabel(score)}"`
    }

    const status = ok ? 'ok  ' : 'FAIL'
    const scoreText = score === undefined ? '    ' : String(score).padStart(4)
    console.log(
      `${status} ${place.id.padEnd(20)} ${offset.toFixed(3).padStart(7)} km  ${place.sources[0]!.name.padEnd(14)} score ${scoreText}  ${place.certainty.padEnd(11)} ${labelNote}`,
    )
  } catch (error) {
    failures++
    console.log(`FAIL ${place.id.padEnd(20)} ${(error as Error).message}`)
  }
}

console.log(`\n${places.length} places checked, ${failures} coordinate failures, ${labelWarnings} label mismatches.`)
if (failures > 0 || labelWarnings > 0) process.exit(1)
