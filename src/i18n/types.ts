/** A message with singular and plural forms, chosen with `Intl.PluralRules`. */
export interface PluralMessage {
  one: string
  other: string
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]> }

/** Dot-separated paths to every message, e.g. `"search.placeholder"`. */
export type MessageKey<T> = {
  [K in keyof T & string]: T[K] extends string | PluralMessage ? K : `${K}.${MessageKey<T[K]>}`
}[keyof T & string]
