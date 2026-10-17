import { useSyncExternalStore } from 'react'
import { buildSearchDocuments } from '../documents'
import { contentHash } from './hash'
import type { FromWorker, ToWorker } from './protocol'

export type SmartSearchStatus =
  | { state: 'idle'; reason?: 'save-data' }
  | { state: 'loading'; progress: number }
  | { state: 'ready' }
  | { state: 'unavailable'; reason: string }

/** Give up if the model has not loaded within this time (slow or blocked networks). */
const LOAD_TIMEOUT_MS = 90_000

type Listener = () => void

/**
 * Progressive enhancement around the Smart Search worker. The app never waits for it: keyword
 * search answers immediately, and semantic similarities are blended in once (and if) the model
 * is ready. Any failure simply leaves the app on keyword search.
 */
class SmartSearchClient {
  private worker: Worker | null = null
  private status: SmartSearchStatus = { state: 'idle', ...(prefersSavingData() ? { reason: 'save-data' as const } : {}) }
  private listeners = new Set<Listener>()
  private nextRequestId = 1
  private pending = new Map<number, (scores: Map<string, number>) => void>()
  private timeout: ReturnType<typeof setTimeout> | null = null

  getStatus = () => this.status

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /** Starts loading the model. `userInitiated` overrides the data-saver default. */
  load(options: { userInitiated?: boolean } = {}) {
    if (this.status.state !== 'idle') return
    if (this.status.reason === 'save-data' && !options.userInitiated) return
    if (typeof Worker === 'undefined' || typeof WebAssembly === 'undefined') {
      this.setStatus({ state: 'unavailable', reason: 'This browser does not support Web Workers and WebAssembly.' })
      return
    }

    this.setStatus({ state: 'loading', progress: 0 })
    try {
      this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module', name: 'smart-search' })
    } catch (error) {
      this.fail(error)
      return
    }
    this.worker.addEventListener('message', (event: MessageEvent<FromWorker>) => this.handle(event.data))
    this.worker.addEventListener('error', (event) => this.fail(event.message || 'The Smart Search worker failed to start.'))
    this.timeout = setTimeout(() => this.fail('Smart Search took too long to load.'), LOAD_TIMEOUT_MS)

    const documents = buildSearchDocuments()
    this.post({
      type: 'init',
      documents: documents.map((doc) => ({ id: doc.id, text: doc.embeddingText })),
      contentHash: contentHash(documents),
    })
  }

  /** Similarity per document id, or null when Smart Search is not ready. */
  query(text: string): Promise<Map<string, number>> | null {
    if (this.status.state !== 'ready' || !this.worker) return null
    const requestId = this.nextRequestId++
    return new Promise((resolve) => {
      this.pending.set(requestId, resolve)
      this.post({ type: 'query', requestId, text })
    })
  }

  private handle(message: FromWorker) {
    switch (message.type) {
      case 'progress':
        if (this.status.state === 'loading') this.setStatus({ state: 'loading', progress: message.progress })
        break
      case 'ready':
        this.clearTimeout()
        this.setStatus({ state: 'ready' })
        break
      case 'result':
        this.pending.get(message.requestId)?.(new Map(message.scores))
        this.pending.delete(message.requestId)
        break
      case 'error':
        this.fail(message.message)
        break
    }
  }

  private fail(error: unknown) {
    this.clearTimeout()
    this.worker?.terminate()
    this.worker = null
    for (const resolve of this.pending.values()) resolve(new Map())
    this.pending.clear()
    const reason = error instanceof Error ? error.message : String(error)
    if (import.meta.env.DEV) console.warn('[Smart Search] unavailable:', reason)
    this.setStatus({ state: 'unavailable', reason })
  }

  private clearTimeout() {
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = null
  }

  private post(message: ToWorker) {
    this.worker?.postMessage(message)
  }

  private setStatus(status: SmartSearchStatus) {
    this.status = status
    for (const listener of this.listeners) listener()
  }
}

function prefersSavingData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? '')
}

export const smartSearch = new SmartSearchClient()

export function useSmartSearchStatus(): SmartSearchStatus {
  return useSyncExternalStore(smartSearch.subscribe, smartSearch.getStatus, smartSearch.getStatus)
}
