// Shared maths for the scroll-story pages (Cosmic Zoom, Black Hole, The Deep, Fermi Paradox).
export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x))
export const smoothstep = (t: number) => t * t * (3 - 2 * t)

/** One stage per 140vh of scroll. Each stage "holds" for its first 30%, then eases to the next. */
export function stageTarget(scrollY: number, viewportH: number, stageCount: number): number {
  const x = scrollY / (1.4 * viewportH)
  const fl = Math.floor(x)
  const t = clamp((x - fl - 0.3) / 0.7)
  return Math.min(stageCount - 1, fl + smoothstep(t))
}

/** Preview mode: bounce 0 -> last -> 0 over time instead of reading the scroll position. */
export function pingPong(timeSec: number, stageCount: number, speed = 0.2): number {
  const last = stageCount - 1
  const period = 2 * last
  const q = (timeSec * speed) % period
  return q < last ? q : period - q
}

/** Trapezoid fade: 0 before r[0], ramps up to 1 at r[1], holds until r[2], ramps down to 0 at r[3]. */
export function fade(s: number, r: [number, number, number, number]): number {
  if (s < r[0] || s > r[3]) return 0
  if (s < r[1]) return (s - r[0]) / (r[1] - r[0])
  if (s > r[2]) return (r[3] - s) / (r[3] - r[2])
  return 1
}
