/**
 * Prints World English Bible passages from the downloaded source, for writing and reviewing atlas
 * content against the text. Run with `npm run data:passage -- "ACT 16:11-15" "MAT 10:2-4"`.
 * Accepts the atlas reference format, and whole chapters as `ACT 16`.
 */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { comparePoints, parseRef } from '../src/lib/scripture/reference'

const SOURCE = join('.cache', 'sources', 'web-vpl', 'extracted', 'eng-web_vpl.xml')

const refs = process.argv.slice(2)
if (refs.length === 0) {
  console.error('Usage: npm run data:passage -- "ACT 16:11-15" ["ACT 17"]')
  process.exit(1)
}

const xml = await readFile(SOURCE, 'utf8').catch(() => {
  console.error(`Missing ${SOURCE}; run \`npm run data:sources\` first.`)
  process.exit(1)
})

const verses = new Map<string, Array<{ chapter: number; verse: number; text: string }>>()
for (const match of xml.matchAll(/<v b="([0-9A-Z]{3})" c="(\d+)" v="(\d+)">([\s\S]*?)<\/v>/g)) {
  const list = verses.get(match[1]!) ?? []
  list.push({ chapter: Number(match[2]), verse: Number(match[3]), text: match[4]!.trim() })
  verses.set(match[1]!, list)
}

let failed = false
for (const input of refs) {
  const chapterOnly = /^([1-3]?[A-Z]{2,3}) (\d+)$/.exec(input)
  const range = chapterOnly ? parseRef(`${chapterOnly[1]} ${chapterOnly[2]}:1-${chapterOnly[2]}:999`) : parseRef(input)
  if (!range) {
    console.error(`\n${input}: not a valid reference`)
    failed = true
    continue
  }
  const inRange = (verses.get(range.book) ?? []).filter(
    (v) => comparePoints(v, range.start) >= 0 && comparePoints(v, range.end) <= 0,
  )
  console.log(`\n== ${input} (${inRange.length} verses)`)
  if (inRange.length === 0) failed = true
  for (const v of inRange) console.log(`${v.chapter}:${v.verse} ${v.text}`)
}
if (failed) process.exit(1)
