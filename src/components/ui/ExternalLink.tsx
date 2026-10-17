import { ArrowUpRight } from 'lucide-react'
import type { AnchorHTMLAttributes } from 'react'
import { useI18n } from '../../i18n/i18n'

export function ExternalLink({ children, className = '', ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { t } = useI18n()
  return (
    <a target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 ${className}`} {...rest}>
      {children}
      <ArrowUpRight aria-hidden className="size-3.5 opacity-70" />
      <span className="sr-only"> {t('common.externalLink')}</span>
    </a>
  )
}
