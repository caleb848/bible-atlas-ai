import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useI18n } from '../../i18n/i18n'
import { SearchBox } from './SearchBox'

/** Full-screen search for phones, with results listed inline under the field. */
export function SearchOverlay({ open, initialQuery, onClose }: { open: boolean; initialQuery: string; onClose: () => void }) {
  const { t } = useI18n()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={t('search.label')}
      className="m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-stone-50 p-0 text-ink-900 backdrop:bg-transparent open:animate-fade-in"
    >
      {open && (
        <div className="flex h-full flex-col px-4 pt-[max(12px,env(safe-area-inset-top))]">
          <div className="flex items-start gap-1.5">
            <button
              type="button"
              onClick={onClose}
              aria-label={t('search.close')}
              className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-700 hover:bg-stone-150"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="min-w-0 flex-1">
              <SearchBox
                variant="overlay"
                autoFocus
                inlineResults
                onDone={onClose}
                requestedQuery={initialQuery ? { value: initialQuery, nonce: 1 } : null}
                // Results use the full width, running under the back button.
                resultsClassName="-ml-[50px]"
              />
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
