import type { ReactNode } from 'react'
import type { Route } from '../../lib/router/routes'
import { Link } from './Link'

const CHIP =
  'inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[13px] font-medium text-ink-800 ring-1 ring-inset ring-stone-200 transition-colors hover:bg-cobalt-50 hover:text-cobalt-800 hover:ring-cobalt-200'

export function LinkChip({ to, children, icon }: { to: Route; children: ReactNode; icon?: ReactNode }) {
  return (
    <Link to={to} className={CHIP}>
      {icon}
      {children}
    </Link>
  )
}

export function ButtonChip({ onClick, children, icon }: { onClick: () => void; children: ReactNode; icon?: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={CHIP}>
      {icon}
      {children}
    </button>
  )
}
