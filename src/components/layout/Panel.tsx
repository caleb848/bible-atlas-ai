import { type CSSProperties, type PointerEvent, type ReactNode, type Ref, useRef, useState } from 'react'
import { useI18n } from '../../i18n/i18n'

export type SheetSnap = 'peek' | 'half' | 'full'

/** Phone sheet heights. CSS values, so the server-rendered page already has the right size. */
const SNAP_HEIGHT: Record<SheetSnap, string> = {
  peek: '184px',
  half: '52dvh',
  full: 'calc(100dvh - 68px)',
}
const ORDER: SheetSnap[] = ['peek', 'half', 'full']
const DRAG_THRESHOLD = 6
const FLICK_VELOCITY = 0.45 // px per ms

const snapPixels = (snap: SheetSnap): number => {
  const viewport = window.innerHeight
  return snap === 'peek' ? 184 : snap === 'half' ? Math.round(viewport * 0.52) : viewport - 68
}

export type PanelWidth = 'standard' | 'narrow' | 'wide'

const WIDTH: Record<PanelWidth, string> = {
  standard: 'md:w-[400px]',
  narrow: 'md:w-[372px]',
  wide: 'md:w-[min(744px,calc(100vw-40px))]',
}

interface PanelProps {
  snap: SheetSnap
  onSnapChange: (snap: SheetSnap) => void
  width?: PanelWidth
  /** Hidden in the presentation view; the panel slides away instead of unmounting. */
  hidden?: boolean
  /** Pinned above the scrolling content (e.g. journey controls on phones). */
  header?: ReactNode
  contentRef?: Ref<HTMLElement>
  label: string
  children: ReactNode
}

/**
 * The single content panel. On wide screens it is a floating card beside the map; on phones it is
 * a draggable bottom sheet with three heights (peek, half, full) that never hides the map
 * completely. The difference is pure CSS, so the pre-rendered HTML matches every screen.
 */
export function Panel({ snap, onSnapChange, width = 'standard', hidden = false, header, contentRef, label, children }: PanelProps) {
  const { t } = useI18n()
  const [dragHeight, setDragHeight] = useState<number | null>(null)
  const drag = useRef<{ id: number; startY: number; startHeight: number; lastY: number; lastTime: number; velocity: number; active: boolean } | null>(null)

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = {
      id: event.pointerId,
      startY: event.clientY,
      startHeight: event.currentTarget.parentElement?.getBoundingClientRect().height ?? snapPixels(snap),
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocity: 0,
      active: false,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    if (!state.active) {
      if (Math.abs(event.clientY - state.startY) < DRAG_THRESHOLD) return
      state.active = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    const elapsed = Math.max(1, event.timeStamp - state.lastTime)
    state.velocity = (state.lastY - event.clientY) / elapsed
    state.lastY = event.clientY
    state.lastTime = event.timeStamp
    const next = state.startHeight + (state.startY - event.clientY)
    setDragHeight(Math.min(snapPixels('full'), Math.max(snapPixels('peek') - 40, next)))
  }

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    drag.current = null
    if (!state?.active || state.id !== event.pointerId) return
    const current = dragHeight ?? snapPixels(snap)
    const nearest = ORDER.reduce((best, candidate) =>
      Math.abs(snapPixels(candidate) - current) < Math.abs(snapPixels(best) - current) ? candidate : best,
    )
    let target = nearest
    if (Math.abs(state.velocity) > FLICK_VELOCITY) {
      const index = ORDER.indexOf(nearest) + (state.velocity > 0 ? 1 : -1)
      target = ORDER[Math.min(ORDER.length - 1, Math.max(0, index))]!
    }
    setDragHeight(null)
    onSnapChange(target)
  }

  const cycle = () => onSnapChange(snap === 'full' ? 'peek' : ORDER[ORDER.indexOf(snap) + 1]!)

  return (
    <section
      data-map-obstacle
      data-panel
      aria-label={label}
      inert={hidden}
      className={`surface fixed inset-x-0 bottom-0 z-20 flex h-(--sheet-height) flex-col rounded-t-[26px] md:inset-x-auto md:bottom-auto md:left-5 md:top-[78px] md:h-auto md:max-h-[calc(100dvh-100px)] md:rounded-card ${WIDTH[width]} ${dragHeight === null ? 'transition-[height,translate,opacity] duration-500 ease-(--ease-out-expo)' : ''} ${hidden ? 'pointer-events-none translate-y-[calc(100%+24px)] opacity-0 md:-translate-x-[calc(100%+40px)] md:translate-y-0' : ''}`}
      style={{ '--sheet-height': dragHeight === null ? SNAP_HEIGHT[snap] : `${dragHeight}px` } as CSSProperties}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className="shrink-0 touch-none select-none md:hidden"
      >
        <button
          type="button"
          onClick={cycle}
          aria-label={snap === 'full' ? t('common.collapse') : t('common.expand')}
          className="flex h-6 w-full items-center justify-center"
        >
          <span aria-hidden className="h-[5px] w-10 rounded-full bg-stone-300" />
        </button>
      </div>
      {header}
      <main
        ref={contentRef}
        id="main-content"
        tabIndex={-1}
        className="scrollbar-quiet min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(28px,env(safe-area-inset-bottom))] pt-1 outline-none md:px-7 md:pb-8 md:pt-7"
      >
        {children}
      </main>
    </section>
  )
}
