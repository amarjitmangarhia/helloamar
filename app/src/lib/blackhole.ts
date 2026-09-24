export const RS_KM = 1.27e7 // Sagittarius A* horizon radius in km (1 rs)
export const STAGE_RADII = [60, 28, 13, 5.5, 2.6, 1.35] // camera distance per stage, in rs

/** Camera radius for a (fractional) stage position, interpolated in log space. */
export function cameraRadius(cur: number): number {
  const i0 = Math.min(STAGE_RADII.length - 2, Math.floor(cur))
  const fr = cur - i0
  const a = Math.log(STAGE_RADII[i0])
  const b = Math.log(STAGE_RADII[i0 + 1])
  return Math.exp(a + (b - a) * fr)
}

export const distanceKm = (r: number) => (r - 1) * RS_KM
export function formatKm(km: number): string {
  const f = (n: number, d: number) => n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d })
  return km < 1e9 ? f(km / 1e6, 0) + ' million km' : f(km / 1e9, 1) + ' billion km'
}

/** How many hours pass far away for 1 hour at radius r (Schwarzschild time dilation). */
export const dilation = (r: number) => 1 / Math.sqrt(1 - 1 / r)
export const formatDilation = (f: number) => (f < 1.01 ? f.toFixed(3) : f.toFixed(2)) + ' hours far away'

/**
 * Shift the picture so the black hole sits to the right of the text card (wide screens),
 * or slightly up on phones (cards are at the bottom there). Units: fractions of viewport height.
 */
export function screenShift(w: number, h: number): { x: number; y: number } {
  if (w <= 700) return { x: 0, y: -0.22 }
  const cardRight = Math.min(72, Math.max(20, w * 0.05)) + Math.min(496, w - 40)
  return { x: -((cardRight + (w - cardRight) / 2) - w / 2) / h, y: 0 }
}

/** The shader is heavy, so render below native resolution. Keep this cap. */
export const renderScale = (w: number, h: number, dpr: number) => Math.min(1, 1100 / Math.max(w, h)) * Math.min(dpr, 1.5)
