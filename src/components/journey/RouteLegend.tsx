import { useI18n } from '../../i18n/i18n'

/** Explains the three line styles used on the map and in the timeline rail. */
export function RouteLegend({ className = '' }: { className?: string }) {
  const { t } = useI18n()
  const items = [
    { dash: undefined, label: t('journey.legendStated') },
    { dash: '5 4', label: t('journey.legendSea') },
    { dash: '0.5 4.5', label: t('journey.legendUncertain') },
  ]
  return (
    <div className={`rounded-2xl bg-stone-100 p-4 ${className}`}>
      <p className="eyebrow">{t('journey.legend')}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3 text-[13px] text-ink-700">
            <svg aria-hidden width="36" height="8" viewBox="0 0 36 8" className="shrink-0">
              <line x1="2" y1="4" x2="34" y2="4" stroke="#2448b0" strokeWidth="2.4" strokeLinecap="round" strokeDasharray={item.dash} />
            </svg>
            {item.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">{t('journey.legendSchematic')}</p>
    </div>
  )
}
