/**
 * Looks up places in the downloaded OpenBible.info dataset, for adding places to the atlas.
 * Prints each record's id, the coordinate `npm run data:verify` treats as primary, the location
 * score that sets the certainty label, and linked Pleiades/Wikidata ids.
 *
 *   npm run data:find-place -- Joppa Lydda          # by name (case-insensitive prefix)
 *   npm run data:find-place -- --verse "ACT 9:36"   # every place named in a verse
 */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    verse: { type: 'string', multiple: true },
    source: { type: 'string', default: join('.cache', 'sources', 'openbible', 'ancient.jsonl') },
  },
})

/** USFM book codes to the OSIS names OpenBible.info uses. */
const OSIS: Record<string, string> = {
  MAT: 'Matt', MRK: 'Mark', LUK: 'Luke', JHN: 'John', ACT: 'Acts', ROM: 'Rom', '1CO': '1Cor', '2CO': '2Cor',
  GAL: 'Gal', EPH: 'Eph', PHP: 'Phil', COL: 'Col', '1TH': '1Thess', '2TH': '2Thess', '1TI': '1Tim', '2TI': '2Tim',
  TIT: 'Titus', PHM: 'Phlm', HEB: 'Heb', JAS: 'Jas', '1PE': '1Pet', '2PE': '2Pet', REV: 'Rev', GEN: 'Gen', EXO: 'Exod',
}

interface Resolution {
  lonlat?: string
  type?: string
}
interface Identification {
  description?: string
  score?: { time_total?: number }
  resolutions?: Resolution[]
}
interface OpenBibleRecord {
  id: string
  friendly_id: string
  types?: string[]
  extra?: string
  identifications: Identification[]
  modern_associations?: Record<string, { name: string; score?: number }>
  linked_data?: Record<string, { id?: string; url?: string }>
}

const records = (await readFile(values.source!, 'utf8'))
  .split('\n')
  .filter((line) => line.trim())
  .map((line) => JSON.parse(line) as OpenBibleRecord)

const osisOf = (ref: string) => {
  const match = /^([1-3]?[A-Z]{2,3}) (\d+):(\d+)$/.exec(ref.trim())
  if (!match || !OSIS[match[1]!]) throw new Error(`Use a single verse like "ACT 9:36": ${ref}`)
  return `${OSIS[match[1]!]}.${match[2]}.${match[3]}`
}
const versesOf = (record: OpenBibleRecord): string[] => {
  try {
    return (JSON.parse(record.extra ?? '{}') as { osises?: string[] }).osises ?? []
  } catch {
    return []
  }
}
const stripTags = (text = '') => text.replace(/<[^>]+>/g, '')

function print(record: OpenBibleRecord) {
  const associations = Object.values(record.modern_associations ?? {}).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const primary = record.identifications[0]?.resolutions?.[0]
  const linked = record.linked_data ?? {}
  const pleiades = linked.s2428ed?.id ?? linked.s2428ed?.url
  const wikidata = linked.s7cc8b2?.id
  console.log(`\n${record.friendly_id}  [openBible('${record.id}')]  types: ${(record.types ?? []).join(', ')}`)
  console.log(`  primary lonlat: ${primary?.lonlat ?? 'none'} (${primary?.type ?? '?'})`)
  console.log(`  location score: ${associations[0]?.score ?? 'n/a'}  (>=800 identified, 500-799 probable, <500 debated)`)
  for (const [index, identification] of record.identifications.slice(0, 4).entries()) {
    console.log(
      `  identification ${index}: score ${identification.score?.time_total ?? '?'}  ${stripTags(identification.description).slice(0, 90)}  -> ${identification.resolutions?.[0]?.lonlat ?? '-'}`,
    )
  }
  console.log(`  modern: ${associations.slice(0, 4).map((a) => `${a.name} (${a.score ?? '?'})`).join('; ') || 'none'}`)
  if (pleiades || wikidata) console.log(`  linked: ${pleiades ? `pleiades ${pleiades}` : ''} ${wikidata ? `wikidata ${wikidata}` : ''}`)
  const verses = versesOf(record)
  console.log(`  verses (${verses.length}): ${verses.filter((v) => !/^(Gen|Exod|Lev|Num|Deut|Josh|Judg|1Sam|2Sam|1Kgs|2Kgs|1Chr|2Chr|Ezra|Neh|Isa|Jer|Ezek)/.test(v)).slice(0, 12).join(' ')}`)
}

let found = 0
for (const name of positionals) {
  const needle = name.toLowerCase()
  for (const record of records.filter((r) => r.friendly_id.toLowerCase().startsWith(needle))) {
    print(record)
    found++
  }
}
for (const verse of values.verse ?? []) {
  const osis = osisOf(verse)
  console.log(`\n== Places named in ${verse} (${osis})`)
  for (const record of records.filter((r) => versesOf(r).includes(osis))) {
    print(record)
    found++
  }
}
if (found === 0) {
  console.error('No matching OpenBible.info records.')
  process.exit(1)
}
