/** Messages exchanged between the app and the Smart Search worker. */

export interface WorkerDocument {
  id: string
  text: string
}

export type ToWorker =
  | { type: 'init'; documents: WorkerDocument[]; contentHash: string }
  | { type: 'query'; requestId: number; text: string }

export type FromWorker =
  | { type: 'progress'; progress: number }
  | { type: 'ready'; precomputed: boolean }
  | { type: 'error'; message: string }
  | { type: 'result'; requestId: number; scores: Array<[id: string, similarity: number]> }
