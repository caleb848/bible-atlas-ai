import { Search } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { allPlaces } from '../../data/atlas'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useI18n } from '../../i18n/i18n'
import { normalize } from '../../lib/search/text'
import { CertaintyBadge } from '../ui/CertaintyBadge'
import { Link } from '../ui/Link'
import { modernLocation } from '../ui/placeText'

/** Every place as a plain list: the non-map way to reach all geographic information. */
export function PlacesIndexView() {
  const { t, text } = useI18n()
  const [filter, setFilter] = useState('')
  const inputId = useId()
  useDocumentTitle(`${t('place.indexTitle')} | ${t('app.pageTitleSuffix')}`)

  const places = useMemo(() => {
    const needle = normalize(filter.trim())
    return [...allPlaces]
      .sort((a, b) => text(a.name).localeCompare(text(b.name)))
      .filter((place) => {
        if (!needle) return true
        const haystack = [text(place.name), ...(place.alternateNames ?? []), ...(place.searchTerms ?? []), place.modern ? text(place.modern.name) : '']
        return haystack.some((value) => normalize(value).includes(needle))
      })
  }, [filter, text])

  return (
    <div>
      <p className="eyebrow">{t('nav.places')}</p>
      <h1 className="mt-2.5 font-display text-[40px] font-medium leading-[1.02] tracking-[-0.02em] text-ink-950">{t('place.indexTitle')}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{t('place.indexLead')}</p>
      <label htmlFor={inputId} className="sr-only">
        {t('place.filterLabel')}
      </label>
      <div className="mt-6 flex h-11 items-center gap-2 rounded-full bg-paper px-4 ring-1 ring-stone-300 focus-within:ring-2 focus-within:ring-cobalt-600">
        <Search aria-hidden className="size-4 text-cobalt-600" />
        <input
          id={inputId}
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={t('place.filterPlaceholder')}
          className="min-w-0 flex-1 bg-transparent text-[14.5px] text-ink-950 outline-none placeholder:text-ink-500"
        />
      </div>
      <p className="mt-3 text-[12.5px] text-ink-500" aria-live="polite">
        {places.length === 0 ? t('place.noMatches', { query: filter.trim() }) : t('place.count', { count: places.length })}
      </p>
      <ul className="mt-3 divide-y divide-stone-200 overflow-hidden rounded-2xl ring-1 ring-stone-200">
        {places.map((place) => (
          <li key={place.id}>
            <Link to={{ name: 'place', id: place.id }} className="flex items-center justify-between gap-3 bg-paper px-4 py-3 transition-colors hover:bg-stone-100">
              <span className="min-w-0">
                <span className="block font-display text-[16.5px] text-ink-950">{text(place.name)}</span>
                <span className="block truncate text-[12.5px] text-ink-500">
                  {modernLocation(place, text, ' · ') ?? t(`kinds.${place.kind}`)}
                </span>
              </span>
              <CertaintyBadge certainty={place.certainty} className="shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
