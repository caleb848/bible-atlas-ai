import { useCallback, useEffect, useState } from 'react'

const STEP_MS = 3600
const STEP_MS_REDUCED = 3000

interface PlaybackOptions {
  /** Number of stops in the journey. */
  count: number
  selectedIndex: number | null
  /** Selects a stop on behalf of playback. */
  select: (index: number) => void
  reducedMotion: boolean
  /** Playback stops when this changes (e.g. another journey opens). */
  resetKey: string
}

/** "Play journey": steps through the stops, giving the camera time to fly and settle at each. */
export function usePlayback({ count, selectedIndex, select, reducedMotion, resetKey }: PlaybackOptions) {
  const [playing, setPlaying] = useState(false)
  const [playingKey, setPlayingKey] = useState(resetKey)
  if (playingKey !== resetKey) {
    setPlayingKey(resetKey)
    setPlaying(false)
  }

  const finished = selectedIndex !== null && selectedIndex >= count - 1
  /** Playback ends by itself at the last stop. */
  const active = playing && !finished

  useEffect(() => {
    if (!active) return
    if (selectedIndex === null) {
      select(0)
      return
    }
    const timer = window.setTimeout(() => select(selectedIndex + 1), reducedMotion ? STEP_MS_REDUCED : STEP_MS)
    return () => window.clearTimeout(timer)
  }, [active, selectedIndex, select, reducedMotion])

  const toggle = useCallback(() => {
    if (active) {
      setPlaying(false)
      return
    }
    if (selectedIndex === null || finished) select(0)
    setPlaying(true)
  }, [active, selectedIndex, finished, select])

  const pause = useCallback(() => setPlaying(false), [])

  return { playing: active, atEnd: !active && finished, toggle, pause }
}
