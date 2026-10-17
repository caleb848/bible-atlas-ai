import { ArrowRight, Search } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { allPeople, getPerson, personStats } from '../../data/atlas'
import { MATTHIAS, ORIGINAL_TWELVE } from '../../data/people/twelve'
import type { Person, PersonGroup } from '../../data/types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useI18n } from '../../i18n/i18n'
import { normalize } from '../../lib/search/text'
import { Link } from '../ui/Link'

const GROUP_ORDER: PersonGroup[] = [
  'jesus-and-the-twelve',
  'paul-and-companions',
  'women',
  'early-church',
  'authorities',
  'gospel-figures',
  'acts-figures',
]

/** Sorts "The Samaritan woman" under S, not T. */
const sortKey = (person: Person) => person.name.en.replace(/^The\s+/i, '').toLowerCase()
const byName = (a: Person, b: Person) => sortKey(a).localeCompare(sortKey(b))

/**
 * The People directory: everyone in the atlas, by group or A–Z, each with how many events, places
 * and journeys the data connects them to. Groups are lenses for discovery, not claims that these
 * people formed a group. Pointing at a person shows where their story unfolds on the map.
 */
export function PeopleView({ onPreviewPerson }: { onPreviewPerson: (personId: string | null) => void }) {
  const { t, number } = useI18n()
  const [filter, setFilter] = useState('')
  const [mode, setMode] = useState<'groups' | 'az'>('groups')
  const inputId = useId()
  useDocumentTitle(`${t('person.indexTitle')} | ${t('app.pageTitleSuffix')}`)

  const needle = normalize(filter.trim())
  const matches = useMemo(() => {
    if (!needle) return allPeople
    return allPeople.filter((person) =>
      [person.name.en, person.role.en, ...(person.alternateNames ?? []), ...(person.searchTerms ?? [])].some((value) =>
        normalize(value).includes(needle),
      ),
    )
  }, [needle])

  const twelve = ORIGINAL_TWELVE.map((id) => getPerson(id)).filter((person) => person !== undefined)
  const matthias = getPerson(MATTHIAS)

  return (
    <div>
      <p className="eyebrow">{t('nav.people')}</p>
      <h1 className="mt-2.5 font-display text-[40px] font-medium leading-[1.02] tracking-[-0.02em] text-ink-950">{t('person.indexTitle')}</h1>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-600">{t('person.indexLead')}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label htmlFor={inputId} className="sr-only">
          {t('person.filterLabel')}
        </label>
        <div className="flex h-11 min-w-[220px] flex-1 items-center gap-2 rounded-full bg-paper px-4 ring-1 ring-stone-300 focus-within:ring-2 focus-within:ring-cobalt-600">
          <Search aria-hidden className="size-4 text-cobalt-600" />
          <input
            id={inputId}
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder={t('person.filterPlaceholder')}
            className="min-w-0 flex-1 bg-transparent text-[14.5px] text-ink-950 outline-none placeholder:text-ink-500"
          />
        </div>
        <fieldset className="flex rounded-full bg-stone-150 p-1">
          <legend className="sr-only">{t('person.viewMode')}</legend>
          {(['groups', 'az'] as const).map((value) => (
            <label
              key={value}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-cobalt-600 ${
                mode === value ? 'bg-paper text-ink-950 shadow-sm' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <input type="radio" name="people-mode" value={value} checked={mode === value} onChange={() => setMode(value)} className="sr-only" />
              {value === 'groups' ? t('person.byGroup') : t('person.alphabetical')}
            </label>
          ))}
        </fieldset>
      </div>
      <p className="mt-3 text-[12.5px] text-ink-500" aria-live="polite">
        {matches.length === 0 ? t('person.noMatches', { query: filter.trim() }) : t('person.count', { count: matches.length })}
      </p>

      {mode === 'groups' && !needle ? (
        GROUP_ORDER.map((group) => {
          const members =
            group === 'jesus-and-the-twelve'
              ? [...allPeople.filter((person) => person.id === 'jesus'), ...twelve]
              : allPeople.filter((person) => person.groups.includes(group)).sort(byName)
          if (members.length === 0) return null
          const headingId = `people-${group}`
          return (
            <section key={group} aria-labelledby={headingId} className="mt-9">
              <div className="mb-3.5 flex items-baseline justify-between gap-3 border-b border-stone-200 pb-2">
                <h2 id={headingId} className="font-display text-[21px] font-medium text-ink-950">
                  {t(`groups.${group}`)}
                </h2>
                <span className="text-[12px] tabular-nums text-ink-500">{number(members.length)}</span>
              </div>
              {group === 'jesus-and-the-twelve' && <p className="-mt-1.5 mb-3.5 text-[12.5px] text-ink-500">{t('person.twelveNote')}</p>}
              <PersonGrid people={members} onPreview={onPreviewPerson} />
              {group === 'jesus-and-the-twelve' && matthias && (
                <div className="mt-5 grid gap-x-8 border-l-2 border-cobalt-200 pl-4 sm:grid-cols-2 sm:items-center">
                  <PersonCard person={matthias} onPreview={onPreviewPerson} />
                  <p className="pb-2 text-[13px] leading-relaxed text-ink-600 sm:pb-0">{t('person.matthiasNote')}</p>
                </div>
              )}
            </section>
          )
        })
      ) : (
        <AlphabeticalList people={[...matches].sort(byName)} onPreview={onPreviewPerson} />
      )}
    </div>
  )
}

type Preview = (personId: string | null) => void

function AlphabeticalList({ people, onPreview }: { people: Person[]; onPreview: Preview }) {
  const letters = new Map<string, Person[]>()
  for (const person of people) {
    const letter = sortKey(person).charAt(0).toUpperCase()
    letters.set(letter, [...(letters.get(letter) ?? []), person])
  }
  return (
    <div>
      {[...letters.entries()].map(([letter, members]) => (
        <section key={letter} aria-labelledby={`letter-${letter}`} className="mt-7">
          <h2 id={`letter-${letter}`} className="mb-3 border-b border-stone-200 pb-1.5 font-display text-[22px] font-medium text-ink-500">
            {letter}
          </h2>
          <PersonGrid people={members} onPreview={onPreview} />
        </section>
      ))}
    </div>
  )
}

/** An index in two columns, ruled like a printed register rather than boxed like a dashboard. */
function PersonGrid({ people, onPreview }: { people: readonly Person[]; onPreview: Preview }) {
  return (
    <ul className="grid gap-x-8 sm:grid-cols-2">
      {people.map((person) => (
        <li key={person.id} className="border-b border-stone-200">
          <PersonCard person={person} onPreview={onPreview} />
        </li>
      ))}
    </ul>
  )
}

function PersonCard({ person, onPreview }: { person: Person; onPreview: Preview }) {
  const { t, text } = useI18n()
  const stats = personStats(person.id)
  return (
    <Link
      to={{ name: 'person', id: person.id }}
      onMouseEnter={() => onPreview(person.id)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => onPreview(person.id)}
      onBlur={() => onPreview(null)}
      className="group -mx-2 flex h-full items-start justify-between gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-stone-150"
    >
      <span className="min-w-0">
        <span className="block font-display text-[19px] font-medium leading-snug text-ink-950 group-hover:text-cobalt-800">{text(person.name)}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-ink-600">{text(person.role)}</span>
        <span className="mt-1.5 block text-[11.5px] tabular-nums tracking-[0.01em] text-ink-500">
          {t('person.eventCount', { count: stats.events })} · {t('person.placeCount', { count: stats.places })}
          {stats.journeys > 0 && ` · ${t('person.journeyCount', { count: stats.journeys })}`}
        </span>
      </span>
      <ArrowRight
        aria-hidden
        className="mt-1.5 size-4 shrink-0 text-cobalt-600 opacity-0 transition-[opacity,translate] group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </Link>
  )
}
