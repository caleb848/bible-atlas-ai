import { type ReactNode, useEffect, useMemo } from 'react'
import type { Locale } from '../data/types'
import { createI18n, I18nContext } from './i18n'

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const i18n = useMemo(() => createI18n(locale), [locale])

  useEffect(() => {
    document.documentElement.lang = i18n.tag
  }, [i18n.tag])

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>
}
