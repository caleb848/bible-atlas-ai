import { useCallback, useEffect, useState } from 'react'
import { loadTranslation, type TranslationText } from '../../lib/scripture/passages'

type State = { status: 'loading' } | { status: 'ready'; text: TranslationText } | { status: 'error' }

/** Loads the World English Bible excerpts on demand, with a retry for flaky connections. */
export function useTranslationText(enabled = true) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    loadTranslation()
      .then((text) => !cancelled && setState({ status: 'ready', text }))
      .catch(() => !cancelled && setState({ status: 'error' }))
    return () => {
      cancelled = true
    }
  }, [enabled])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    loadTranslation()
      .then((text) => setState({ status: 'ready', text }))
      .catch(() => setState({ status: 'error' }))
  }, [])

  return { state, retry }
}
