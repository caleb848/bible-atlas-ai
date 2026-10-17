import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate } from '../../lib/router/router'
import { type Route, routePath } from '../../lib/router/routes'

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: Route
  replace?: boolean
}

/** A real link (shareable, opens in new tabs) that navigates in-app on a plain click. */
export function Link({ to, replace, onClick, children, ...rest }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
    if (event.defaultPrevented || modified) return
    event.preventDefault()
    navigate(to, { replace })
  }
  return (
    <a href={routePath(to)} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
