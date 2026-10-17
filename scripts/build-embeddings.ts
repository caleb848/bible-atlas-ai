/**
 * Precomputes Smart Search document embeddings so browsers only need to embed the query.
 * Writes `public/search/embeddings.json` (manifest) and `public/search/embeddings.bin`
 * (int8 vectors). Run with `npm run data:embeddings` whenever atlas content changes; if the
 * files are stale, the app notices (content hash) and embeds the documents in the browser.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { env, pipeline } from '@huggingface/transformers'
import { buildSearchDocuments } from '../src/lib/search/documents'
import { type EmbeddingsManifest, SMART_SEARCH_MODEL } from '../src/lib/search/semantic/config'
import { contentHash } from '../src/lib/search/semantic/hash'

env.cacheDir = join('.cache', 'models')

const documents = buildSearchDocuments()
const extractor = await pipeline('feature-extraction', SMART_SEARCH_MODEL.id, { dtype: SMART_SEARCH_MODEL.dtype })
const output = await extractor(
  documents.map((doc) => doc.embeddingText),
  { pooling: SMART_SEARCH_MODEL.pooling, normalize: true },
)

const [count, dimensions] = output.dims as [number, number]
if (count !== documents.length || dimensions !== SMART_SEARCH_MODEL.dimensions) {
  throw new Error(`Unexpected embedding shape ${count}×${dimensions}`)
}

const floats = output.data as Float32Array
const vectors = Int8Array.from(floats, (value) => Math.max(-127, Math.min(127, Math.round(value * 127))))

const manifest: EmbeddingsManifest = {
  model: SMART_SEARCH_MODEL.id,
  dtype: SMART_SEARCH_MODEL.dtype,
  dimensions,
  contentHash: contentHash(documents),
  ids: documents.map((doc) => doc.id),
  quantization: 'int8',
}

const outDir = join('public', 'search')
await mkdir(outDir, { recursive: true })
await writeFile(join(outDir, 'embeddings.json'), `${JSON.stringify(manifest)}\n`)
await writeFile(join(outDir, 'embeddings.bin'), vectors)
console.log(`Embedded ${count} documents (${dimensions} dimensions, ${vectors.byteLength} bytes), hash ${manifest.contentHash}`)
