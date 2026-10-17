import type { Locale } from '../data/types'

export interface LocaleConfig {
  code: Locale
  /** BCP 47 tag used for the `lang` attribute and `Intl` formatting. */
  tag: string
  nativeName: string
  /** Disabled locales are fully wired but hidden until their translation is ready. */
  enabled: boolean
}

export const LOCALES: readonly LocaleConfig[] = [
  { code: 'en', tag: 'en', nativeName: 'English', enabled: true },
  { code: 'pa', tag: 'pa-Guru', nativeName: 'ਪੰਜਾਬੀ', enabled: false },
]

export const DEFAULT_LOCALE: Locale = 'en'
