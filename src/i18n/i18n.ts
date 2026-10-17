import { createContext, useContext } from 'react'
import type { Locale, LocalizedText, RefString } from '../data/types'
import { formatRef } from '../lib/scripture/reference'
import { DEFAULT_LOCALE, LOCALES } from './config'
import { en, type Messages } from './locales/en'
import { pa } from './locales/pa'
import type { DeepPartial, MessageKey, PluralMessage } from './types'

type Params = Record<string, string | number>

export interface I18n {
  locale: Locale
  /** BCP 47 tag for `lang` attributes and `Intl`. */
  tag: string
  t: (key: MessageKey<Messages>, params?: Params) => string
  /** Picks the current locale from content text, falling back to English. */
  text: (value: LocalizedText) => string
  ref: (ref: RefString) => string
  number: (value: number) => string
  list: (items: string[]) => string
}

const catalogs: Record<Locale, DeepPartial<Messages>> = { en, pa }

const lookup = (messages: unknown, key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], messages)

const isPlural = (value: unknown): value is PluralMessage =>
  typeof value === 'object' && value !== null && 'one' in value && 'other' in value

export function createI18n(locale: Locale): I18n {
  const tag = LOCALES.find((config) => config.code === locale)?.tag ?? 'en'
  const plurals = new Intl.PluralRules(tag)
  const numbers = new Intl.NumberFormat(tag)
  const lists = new Intl.ListFormat(tag, { type: 'conjunction' })

  const t: I18n['t'] = (key, params) => {
    let value = lookup(catalogs[locale], key) ?? lookup(en, key)
    if (isPlural(value)) {
      const count = Number(params?.count ?? 0)
      value = plurals.select(count) === 'one' ? value.one : value.other
    }
    if (typeof value !== 'string') return key
    return value.replace(/\{(\w+)\}/g, (match, name: string) => {
      const param = params?.[name]
      if (param === undefined) return match
      return typeof param === 'number' ? numbers.format(param) : param
    })
  }

  return {
    locale,
    tag,
    t,
    text: (value) => value[locale] ?? value.en,
    ref: (ref) => formatRef(ref, locale),
    number: (value) => numbers.format(value),
    list: (items) => lists.format(items),
  }
}

export const I18nContext = createContext<I18n>(createI18n(DEFAULT_LOCALE))

export const useI18n = (): I18n => useContext(I18nContext)
