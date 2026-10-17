import type { LocalizedText } from './types'

/** Authoring helper for English-first content. Translations are added alongside `en`. */
export const en = (text: string): LocalizedText => ({ en: text })
