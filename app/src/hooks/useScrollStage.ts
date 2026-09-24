import { useCallback, useRef, useState } from 'react'
import { pingPong, stageTarget } from '../lib/story'

type Options = {
  ease?: number // per-frame easing (0.06 default; 0.07 for Cosmic Zoom / The Deep)
  preview?: boolean // ?preview=1: ping-pong over time instead of reading the scroll
  reducedMotion?: boolean // snap to the target, no easing
}

/**
 * The scroll-story engine. Call `update(timeSeconds)` once per frame from the scene's useFrame;
 * it returns `cur`, the eased stage position (blend stage floor(cur) -> +1 by cur - floor(cur)).
 * `idx` (React state) is Math.round(cur) and only changes when the active stage changes.
 */
export function useScrollStage(stageCount: number, { ease = 0.06, preview = false, reducedMotion = false }: Options = {}) {
  const cur = useRef(0)
  const idxRef = useRef(0)
  const [idx, setIdx] = useState(0)

  const update = useCallback(
    (timeSec: number) => {
      const target = preview ? pingPong(timeSec, stageCount) : stageTarget(window.scrollY, window.innerHeight, stageCount)
      cur.current += (target - cur.current) * (preview || reducedMotion ? 1 : ease)
      const i = Math.round(cur.current)
      if (i !== idxRef.current) {
        idxRef.current = i
        setIdx(i)
      }
      return cur.current
    },
    [stageCount, ease, preview, reducedMotion],
  )

  const goTo = useCallback(
    (i: number) => window.scrollTo({ top: i * 1.4 * window.innerHeight, behavior: reducedMotion ? 'auto' : 'smooth' }),
    [reducedMotion],
  )

  return { update, idx, goTo }
}
