/**
 * Downloads the raw source data used to build and verify the atlas into `.cache/sources/`
 * (git-ignored). Run with `npm run data:sources`. Requires the `unzip` command.
 *
 *   - World English Bible, verse-per-line edition (public domain) from eBible.org
 *   - OpenBible.info Bible Geocoding Data (CC BY 4.0)
 */
import { execFileSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const CACHE = join(process.cwd(), '.cache', 'sources')

const downloads = [
  {
    url: 'https://ebible.org/Scriptures/eng-web_vpl.zip',
    dir: 'web-vpl',
    file: 'eng-web_vpl.zip',
    unzipTo: 'extracted',
  },
  {
    url: 'https://raw.githubusercontent.com/openbibleinfo/Bible-Geocoding-Data/main/data/ancient.jsonl',
    dir: 'openbible',
    file: 'ancient.jsonl',
  },
  {
    url: 'https://raw.githubusercontent.com/openbibleinfo/Bible-Geocoding-Data/main/data/modern.jsonl',
    dir: 'openbible',
    file: 'modern.jsonl',
  },
]

for (const download of downloads) {
  const dir = join(CACHE, download.dir)
  await mkdir(dir, { recursive: true })
  process.stdout.write(`Downloading ${download.url} … `)
  const response = await fetch(download.url)
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${download.url}`)
  const target = join(dir, download.file)
  await writeFile(target, Buffer.from(await response.arrayBuffer()))
  console.log('done')
  if (download.unzipTo) execFileSync('unzip', ['-o', '-q', target, '-d', join(dir, download.unzipTo)])
}

console.log(`Sources saved to ${CACHE}`)
