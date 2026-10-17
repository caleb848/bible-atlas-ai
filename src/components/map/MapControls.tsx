import { Layers, Maximize, Minus, Plus } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useI18n } from '../../i18n/i18n'

export interface MapLabels {
  /** Names of every biblical place in the atlas, beyond the current scene's markers. */
  ancient: boolean
  /** Modern country, sea and city names from the basemap. */
  modern: boolean
}

interface MapControlsProps {
  /** Distance from the bottom of the viewport that the controls must clear. */
  bottom: number
  /** Distance from the right edge (e.g. clearing the journey rail). */
  right: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  resetLabel: string
  labels: MapLabels
  onLabelsChange: (labels: MapLabels) => void
}

const BUTTON =
  'inline-flex size-10 items-center justify-center text-ink-700 transition-colors hover:bg-stone-150 hover:text-ink-950'

/** Zoom, reset and the label layers, in one quiet column at the lower right. */
export function MapControls({ bottom, right, onZoomIn, onZoomOut, onReset, resetLabel, labels, onLabelsChange }: MapControlsProps) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const panelId = useId()
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
    <div
      ref={rootRef}
      // Keeps map labels clear of the controls, but does not move the camera: the controls are
      // positioned from the insets, so counting them would feed back into their own position.
      data-map-obstacle="labels"
      className="absolute z-10 flex flex-col items-end gap-2 transition-[bottom,right] duration-300"
      style={{ bottom: Math.max(bottom, 20) + 8, right: Math.max(right, 16) }}
    >
      {open && (
        <fieldset id={panelId} className="surface w-52 animate-fade-up rounded-2xl px-4 py-3">
          <legend className="sr-only">{t('map.labels')}</legend>
          <p aria-hidden className="eyebrow mb-2">
            {t('map.labels')}
          </p>
          {(['ancient', 'modern'] as const).map((key) => (
            <label key={key} className="flex cursor-pointer items-center justify-between gap-3 py-1.5 text-[13.5px] text-ink-800">
              {key === 'ancient' ? t('map.ancientLabels') : t('map.modernLabels')}
              <input
                type="checkbox"
                checked={labels[key]}
                onChange={(event) => onLabelsChange({ ...labels, [key]: event.target.checked })}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="relative h-5 w-9 rounded-full bg-stone-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-cobalt-600 peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt-600"
              />
            </label>
          ))}
        </fieldset>
      )}
      <div className="surface flex flex-col overflow-hidden rounded-2xl">
        {/* Touch screens pinch to zoom, so the zoom buttons only appear with a fine pointer. */}
        <div className="hidden flex-col pointer-fine:flex">
          <button type="button" className={BUTTON} onClick={onZoomIn} aria-label={t('map.zoomIn')} title={t('map.zoomIn')}>
            <Plus className="size-[18px]" />
          </button>
          <span aria-hidden className="mx-2 h-px bg-stone-200" />
          <button type="button" className={BUTTON} onClick={onZoomOut} aria-label={t('map.zoomOut')} title={t('map.zoomOut')}>
            <Minus className="size-[18px]" />
          </button>
          <span aria-hidden className="mx-2 h-px bg-stone-200" />
        </div>
        <button type="button" className={BUTTON} onClick={onReset} aria-label={resetLabel} title={resetLabel}>
          <Maximize className="size-4" />
        </button>
        <span aria-hidden className="mx-2 h-px bg-stone-200" />
        <button
          type="button"
          className={`${BUTTON} ${open ? 'bg-stone-150 text-ink-950' : ''}`}
          onClick={() => setOpen((value) => !value)}
          aria-label={t('map.labels')}
          title={t('map.labels')}
          aria-expanded={open}
          aria-controls={panelId}
        >
          <Layers className="size-[17px]" />
        </button>
      </div>
    </div>
  )
}
