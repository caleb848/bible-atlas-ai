import { Menu, Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useI18n } from '../../i18n/i18n'
import type { Route } from '../../lib/router/routes'
import { SearchBox } from '../search/SearchBox'
import { IconButton } from '../ui/Button'
import { Link } from '../ui/Link'
import { LogoMark, Wordmark } from '../ui/Logo'

type Section = 'journeys' | 'people' | 'places' | 'about'

const SECTIONS: Array<{ section: Section; route: Route }> = [
  { section: 'journeys', route: { name: 'journeys' } },
  { section: 'people', route: { name: 'people' } },
  { section: 'places', route: { name: 'places' } },
  { section: 'about', route: { name: 'about' } },
]

function currentSection(route: Route): Section | null {
  switch (route.name) {
    case 'journey':
    case 'journeys':
      return 'journeys'
    case 'person':
    case 'people':
      return 'people'
    case 'place':
    case 'places':
      return 'places'
    case 'about':
      return 'about'
    default:
      return null
  }
}

interface TopBarProps {
  route: Route
  /** The presentation view keeps only the brand. */
  minimal: boolean
  /** Journey Mode: on larger screens the map and the journey take over; search and sections step back. */
  journeyMode?: boolean
  onOpenSearch: () => void
}

/** Brand, search and navigation, floating over the top of the map. */
export function TopBar({ route, minimal, journeyMode = false, onOpenSearch }: TopBarProps) {
  const { t } = useI18n()
  const section = currentSection(route)
  const showSearch = !minimal && !journeyMode && route.name !== 'home'

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center gap-2.5 px-3 pt-[max(12px,env(safe-area-inset-top))] md:gap-3 md:px-5 md:pt-4">
      <Link
        data-map-obstacle
        to={{ name: 'home' }}
        aria-label={t('nav.home')}
        className="surface pointer-events-auto flex h-11 shrink-0 items-center gap-2.5 rounded-full pl-1.5 pr-4 transition-shadow hover:shadow-pop md:h-12 md:pl-2"
      >
        <LogoMark className="size-8 md:size-[34px]" />
        <Wordmark className="max-[359px]:hidden" />
      </Link>

      {showSearch && (
        <div data-map-obstacle className="pointer-events-auto hidden w-[min(400px,calc(100vw-760px))] min-w-[300px] md:block">
          <SearchBox variant="header" />
        </div>
      )}

      <div className="flex-1" />

      {!minimal && (
        <>
          <nav
            data-map-obstacle
            aria-label={t('nav.mainNavigation')}
            className={`surface pointer-events-auto hidden items-center gap-0.5 rounded-full p-1 ${journeyMode ? '' : 'md:flex'}`}
          >
            {SECTIONS.map((item) => (
              <Link
                key={item.section}
                to={item.route}
                aria-current={section === item.section ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors ${
                  section === item.section ? 'bg-ink-900 text-paper' : 'text-ink-700 hover:bg-stone-150 hover:text-ink-950'
                }`}
              >
                {t(`nav.${item.section}`)}
              </Link>
            ))}
          </nav>
          <div className="pointer-events-auto flex items-center gap-2 md:hidden">
            <IconButton tone="filled" size="lg" label={t('search.open')} onClick={onOpenSearch} className="surface size-11!">
              <Search className="size-[18px]" />
            </IconButton>
            <MobileMenu section={section} />
          </div>
        </>
      )}
    </header>
  )
}

/** The phone navigation: a small menu anchored to the top-right corner. */
function MobileMenu({ section }: { section: Section | null }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <IconButton
        tone="filled"
        size="lg"
        label={open ? t('nav.closeMenu') : t('nav.menu')}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="surface size-11!"
      >
        {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
      </IconButton>
      {open && (
        <nav
          id={menuId}
          aria-label={t('nav.mainNavigation')}
          className="surface absolute right-0 top-[calc(100%+8px)] w-56 animate-fade-up rounded-2xl p-1.5 shadow-pop"
        >
          {SECTIONS.map((item) => (
            <Link
              key={item.section}
              to={item.route}
              onClick={() => setOpen(false)}
              aria-current={section === item.section ? 'page' : undefined}
              className={`block rounded-xl px-3.5 py-3 text-[15px] font-medium ${
                section === item.section ? 'bg-ink-900 text-paper' : 'text-ink-800 hover:bg-stone-150'
              }`}
            >
              {t(`nav.${item.section}`)}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
