import { Compass } from 'lucide-react'
import { featuredJourneys } from '../../data/atlas'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useI18n } from '../../i18n/i18n'
import { LinkChip } from '../ui/Chip'
import { Link } from '../ui/Link'

/** Shown for unknown addresses and for journeys, places or people that do not exist. */
export function NotFoundView({ title, body }: { title?: string; body?: string }) {
  const { t, text } = useI18n()
  useDocumentTitle(`${title ?? t('notFound.title')} | ${t('app.pageTitleSuffix')}`)

  return (
    <div>
      <Compass aria-hidden className="size-8 text-cobalt-600" />
      <h1 className="mt-4 font-display text-[34px] font-medium text-ink-950">{title ?? t('notFound.title')}</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{body ?? t('notFound.body')}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {featuredJourneys().map((journey) => (
          <LinkChip key={journey.id} to={{ name: 'journey', id: journey.id }}>
            {text(journey.shortTitle)}
          </LinkChip>
        ))}
      </div>
      <Link to={{ name: 'home' }} className="mt-8 inline-block text-[14px] font-semibold text-cobalt-700 underline underline-offset-4 hover:text-cobalt-900">
        {t('notFound.home')}
      </Link>
    </div>
  )
}
