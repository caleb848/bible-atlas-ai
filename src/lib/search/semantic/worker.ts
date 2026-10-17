/// <reference lib="webworker" />
/**
 * Smart Search worker. Runs a small sentence-embedding model with Transformers.js (WebAssembly)
 * off the main thread, so typing and the map stay smooth. Model files are cached by the browser
 * after the first download.
 */
import { env, type FeatureExtractionPipeline, pipeline } from '@huggingface/transformers'
import {
  EMBEDDINGS_MANIFEST_URL,
  EMBEDDINGS_VECTORS_URL,
  type EmbeddingsManifest,
  SMART_SEARCH_MODEL,
} from './config'
import type { FromWorker, ToWorker, WorkerDocument } from './protocol'

declare const self: DedicatedWorkerGlobalScope

// Models come from the Hugging Face Hub; never probe this site for a local copy.
env.allowLocalModels = false

const DIMENSIONS = SMART_SEARCH_MODEL.dimensions
/** Similarities below this are never useful to the ranking. */
const MIN_SIMILARITY = 0.25

let extractor: FeatureExtractionPipeline | null = null
let ids: string[] = []
let vectors = new Float32Array(0)

// Inside a worker, postMessage has no target origin (the rule targets window.postMessage).
// oxlint-disable-next-line unicorn/require-post-message-target-origin
const post = (message: FromWorker) => self.postMessage(message)

async function loadPrecomputed(expectedHash: string): Promise<boolean> {
  try {
    const manifestResponse = await fetch(EMBEDDINGS_MANIFEST_URL)
    if (!manifestResponse.ok) return false
    const manifest = (await manifestResponse.json()) as EmbeddingsManifest
    const compatible =
      manifest.contentHash === expectedHash &&
      manifest.model === SMART_SEARCH_MODEL.id &&
      manifest.dimensions === DIMENSIONS
    if (!compatible) return false

    const vectorResponse = await fetch(EMBEDDINGS_VECTORS_URL)
    if (!vectorResponse.ok) return false
    const quantized = new Int8Array(await vectorResponse.arrayBuffer())
    if (quantized.length !== manifest.ids.length * DIMENSIONS) return false

    vectors = Float32Array.from(quantized, (value) => value / 127)
    ids = manifest.ids
    return true
  } catch {
    return false
  }
}

async function embedDocuments(documents: WorkerDocument[]) {
  const result = new Float32Array(documents.length * DIMENSIONS)
  const batchSize = 32
  for (let start = 0; start < documents.length; start += batchSize) {
    const batch = documents.slice(start, start + batchSize)
    const output = await extractor!(
      batch.map((doc) => doc.text),
      { pooling: SMART_SEARCH_MODEL.pooling, normalize: true },
    )
    result.set(output.data as Float32Array, start * DIMENSIONS)
  }
  vectors = result
  ids = documents.map((doc) => doc.id)
}

async function init(documents: WorkerDocument[], contentHash: string) {
  extractor = await pipeline('feature-extraction', SMART_SEARCH_MODEL.id, {
    dtype: SMART_SEARCH_MODEL.dtype,
    device: 'wasm',
    progress_callback: (info) => {
      if (info.status === 'progress_total') post({ type: 'progress', progress: Math.round(info.progress) })
    },
  })
  const precomputed = await loadPrecomputed(contentHash)
  if (!precomputed) await embedDocuments(documents)
  post({ type: 'ready', precomputed })
}

async function query(requestId: number, text: string) {
  if (!extractor) throw new Error('Smart Search is not ready')
  const output = await extractor(text, { pooling: SMART_SEARCH_MODEL.pooling, normalize: true })
  const queryVector = output.data as Float32Array
  const scores: Array<[string, number]> = []
  for (let i = 0; i < ids.length; i++) {
    let similarity = 0
    const offset = i * DIMENSIONS
    for (let k = 0; k < DIMENSIONS; k++) similarity += queryVector[k]! * vectors[offset + k]!
    if (similarity >= MIN_SIMILARITY) scores.push([ids[i]!, similarity])
  }
  scores.sort((a, b) => b[1] - a[1])
  post({ type: 'result', requestId, scores: scores.slice(0, 40) })
}

self.addEventListener('message', (event: MessageEvent<ToWorker>) => {
  const message = event.data
  const run = message.type === 'init' ? init(message.documents, message.contentHash) : query(message.requestId, message.text)
  run.catch((error: unknown) => post({ type: 'error', message: error instanceof Error ? error.message : String(error) }))
})
