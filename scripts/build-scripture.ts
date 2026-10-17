/**
 * Builds `src/data/scripture/web.json`: the World English Bible text of every verse the atlas
 * references, copied verbatim from eBible.org's verse-per-line XML (whitespace trimmed and XML
 * entities decoded; no other changes). Run with `npm run data:scripture [-- --source <file>]`.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { comparePoints, parseRef } from '../src/lib/scripture/reference'
import { collectReferences } from '../src/data/references'

const { values } = parseArgs({
  options: {
    source: { type: 'string', default: join('.cache', 'sources', 'web-vpl', 'extracted', 'eng-web_vpl.xml') },
    out: { type: 'string', default: join('src', 'data', 'scripture', 'web.json') },
  },
})

interface SourceVerse {
  book: string
  chapter: number
  verse: number
  text: string
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
const decode = (text: string) => text.replace(/&(amp|lt|gt|quot|apos);/g, (_, name: string) => ENTITIES[name]!)

const xml = await readFile(values.source!, 'utf8')
const verses: SourceVerse[] = []
for (const match of xml.matchAll(/<v b="([0-9A-Z]{3})" c="(\d+)" v="(\d+)">([\s\S]*?)<\/v>/g)) {
  verses.push({ book: match[1]!, chapter: Number(match[2]), verse: Number(match[3]), text: decode(match[4]!).trim() })
}
if (verses.length < 30000) throw new Error(`Only ${verses.length} verses parsed from ${values.source}; is this the WEB VPL XML?`)

const books: Record<string, Record<string, Record<string, string>>> = {}
const problems: string[] = []

for (const ref of collectReferences().sort()) {
  const range = parseRef(ref)
  if (!range) {
    problems.push(`Malformed reference ${ref}`)
    continue
  }
  const inRange = verses.filter(
    (v) => v.book === range.book && comparePoints(v, range.start) >= 0 && comparePoints(v, range.end) <= 0,
  )
  const has = (point: { chapter: number; verse: number }) =>
    inRange.some((v) => v.chapter === point.chapter && v.verse === point.verse)
  if (!has(range.start) || !has(range.end)) problems.push(`${ref} does not exist in the source text`)
  for (const v of inRange) {
    books[v.book] ??= {}
    books[v.book]![v.chapter] ??= {}
    books[v.book]![v.chapter]![v.verse] = v.text
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'))
  process.exit(1)
}

const count = Object.values(books).reduce(
  (sum, chapters) => sum + Object.values(chapters).reduce((s, chapter) => s + Object.keys(chapter).length, 0),
  0,
)

const output = {
  translation: 'WEB',
  name: 'World English Bible',
  license: 'Public domain',
  source: 'eBible.org eng-web_vpl.xml (World English Bible, 2020 stable text edition)',
  sourceUrl: 'https://ebible.org/find/details.php?id=eng-web',
  books,
}
await writeFile(values.out!, `${JSON.stringify(output, null, 1)}\n`)
console.log(`Wrote ${count} verses from ${Object.keys(books).length} books to ${values.out}`)
