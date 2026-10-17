import { allEvents, allJourneys, allPeople, allPlaces } from '../../data/atlas'
import { collectReferences } from '../../data/references'
import type { Certainty } from '../../data/types'
import { SITE } from '../../config/site'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useI18n } from '../../i18n/i18n'
import { BackButton } from '../panel/PanelParts'
import { CertaintyBadge } from '../ui/CertaintyBadge'
import { ExternalLink } from '../ui/ExternalLink'

const CERTAINTIES: Certainty[] = ['identified', 'probable', 'traditional', 'debated', 'approximate']

export function AboutView() {
  const { t, number } = useI18n()
  useDocumentTitle(`${t('nav.about')} | ${t('app.pageTitleSuffix')}`)

  const sections = [
    ['projectTitle', 'projectBody'],
    ['mappingTitle', 'mappingBody'],
    ['accuracyTitle', 'accuracyBody'],
  ] as const
  const after = [
    ['translationTitle', 'translationBody'],
    ['aiTitle', 'aiBody'],
    ['privacyTitle', 'privacyBody'],
    ['sourcesTitle', 'sourcesBody'],
  ] as const

  return (
    <article>
      <BackButton />
      <h1 className="font-display text-[38px] font-medium leading-[1.05] tracking-[-0.02em] text-ink-950">{t('about.title')}</h1>
      <p className="mt-3 font-display text-[19px] leading-relaxed text-ink-700">{t('about.lead')}</p>

      <section aria-labelledby="about-stats" className="mt-7">
        <h2 id="about-stats" className="eyebrow mb-3">
          {t('about.statsTitle')}
        </h2>
        <dl className="grid grid-cols-3 gap-x-4 gap-y-4 rounded-2xl bg-stone-100 px-4 py-4">
          {(
            [
              [t('nav.journeys'), allJourneys.length],
              [t('nav.places'), allPlaces.length],
              [t('nav.people'), allPeople.length],
              [t('about.events'), allEvents.length],
              [t('about.references'), collectReferences().length],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <dd className="font-display text-[26px] leading-none tabular-nums text-ink-950">{number(value)}</dd>
              <dt className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {sections.map(([title, body]) => (
        <section key={title} className="mt-8">
          <h2 className="eyebrow mb-2">{t(`about.${title}`)}</h2>
          <p className="text-[14.5px] leading-relaxed text-ink-700">{t(`about.${body}`)}</p>
        </section>
      ))}

      <section className="mt-8">
        <h2 className="eyebrow mb-2">{t('about.certaintyTitle')}</h2>
        <p className="text-[14.5px] leading-relaxed text-ink-700">{t('about.certaintyBody')}</p>
        <ul className="mt-4 space-y-3">
          {CERTAINTIES.map((certainty) => (
            <li key={certainty} className="flex flex-col items-start gap-1.5">
              <CertaintyBadge certainty={certainty} />
              <span className="text-[13.5px] leading-relaxed text-ink-600">{t(`certainty.${certainty}Help`)}</span>
            </li>
          ))}
        </ul>
      </section>

      {after.map(([title, body]) => (
        <section key={title} className="mt-8">
          <h2 className="eyebrow mb-2">{t(`about.${title}`)}</h2>
          <p className="text-[14.5px] leading-relaxed text-ink-700">{t(`about.${body}`)}</p>
        </section>
      ))}

      <div className="mt-8 flex flex-col gap-2 border-t border-stone-200 pt-6 text-[14px]">
        <ExternalLink href={SITE.dataSourcesUrl} className="font-semibold text-cobalt-700 hover:text-cobalt-900">
          {t('about.methodologyLink')}
        </ExternalLink>
        <ExternalLink href={SITE.githubUrl} className="font-semibold text-cobalt-700 hover:text-cobalt-900">
          {t('about.viewSource')}
        </ExternalLink>
        <p className="mt-2 text-[12.5px] text-ink-500">{t('about.builtWith')}</p>
      </div>
    </article>
  )
}
