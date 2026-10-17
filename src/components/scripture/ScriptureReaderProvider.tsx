import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { type ReaderItem, type ReaderRequest, ScriptureReaderContext, toRequest } from './readerContext'
import { ScriptureReaderDialog } from './ScriptureReaderDialog'

export function ScriptureReaderProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ReaderRequest | null>(null)
  const open = useCallback((next: ReaderRequest | ReaderItem) => setRequest(toRequest(next)), [])
  const value = useMemo(() => ({ open }), [open])

  return (
    <ScriptureReaderContext.Provider value={value}>
      {children}
      <ScriptureReaderDialog request={request} onClose={() => setRequest(null)} />
    </ScriptureReaderContext.Provider>
  )
}
