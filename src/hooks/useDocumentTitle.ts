import { useEffect } from 'react'

/** Sets the tab title; `title` should already include the site name where wanted. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
