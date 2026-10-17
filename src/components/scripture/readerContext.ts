import { createContext, useContext } from 'react'
import type { RefString } from '../../data/types'
import type { ScriptureRange } from '../../lib/scripture/reference'

export interface ReaderItem {
  /** The full passage: a data reference, or a range parsed from search (e.g. "Acts 16"). */
  passage: RefString | ScriptureRange
  /** Shown first when the passage is long. */
  excerpt?: RefString
  /** Parallel accounts offered underneath. */
  related?: RefString[]
  /** What the passage is about in the atlas (an event title), shown above the reference. */
  context?: string
}

/** One passage, or a sequence the reader can step through (e.g. every passage at a stop). */
export interface ReaderRequest {
  items: ReaderItem[]
  index?: number
}

export interface ScriptureReader {
  open: (request: ReaderRequest | ReaderItem) => void
}

export const ScriptureReaderContext = createContext<ScriptureReader>({ open: () => undefined })

export const useScriptureReader = () => useContext(ScriptureReaderContext)

export const toRequest = (request: ReaderRequest | ReaderItem): ReaderRequest =>
  'items' in request ? request : { items: [request], index: 0 }
