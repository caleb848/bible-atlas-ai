import type { ReactNode } from 'react'

/** A small uppercase section label, optionally with an action on the right. */
export function SectionHeading({ id, children, action, className = '' }: { id?: string; children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={`mb-3 flex items-baseline justify-between gap-3 ${className}`}>
      <h2 id={id} className="eyebrow">
        {children}
      </h2>
      {action}
    </div>
  )
}
