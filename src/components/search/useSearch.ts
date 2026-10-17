import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { search, type SearchResponse } from '../../lib/search/engine'
import { smartSearch, useSmartSearchStatus } from '../../lib/search/semantic/client'

/**
 * Keyword results are computed synchronously on every keystroke; once Smart Search is ready,
 * semantic similarities are requested in the background and blended in. Responses for an
 * outdated query are ignored.
 */
export function useSearch(query: string): SearchResponse {
  const status = useSmartSearchStatus()
  const deferredQuery = useDeferredValue(query)
  const [semantic, setSemantic] = useState<{ query: string; scores: Map<string, number> } | null>(null)

  useEffect(() => {
    const trimmed = deferredQuery.trim()
    if (status.state !== 'ready' || trimmed.length < 3) return
    let cancelled = false
    const timer = window.setTimeout(() => {
      smartSearch.query(trimmed)?.then((scores) => {
        if (!cancelled) setSemantic({ query: trimmed, scores })
      })
    }, 120)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [deferredQuery, status.state])

  return useMemo(() => {
    const trimmed = deferredQuery.trim()
    const scores = semantic?.query === trimmed ? semantic.scores : undefined
    return search(trimmed, scores ? { semantic: scores } : {})
  }, [deferredQuery, semantic])
}
