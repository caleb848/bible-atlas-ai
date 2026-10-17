import { en } from '../text'
import type { Translation } from '../types'

export const translations: Translation[] = [
  {
    id: 'WEB',
    abbreviation: 'WEB',
    name: en('World English Bible'),
    language: 'en',
    license: en('Public domain'),
    sourceUrl: 'https://ebible.org/find/details.php?id=eng-web',
  },
]

export const defaultTranslation = translations[0]!
