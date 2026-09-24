export const DEPTHS = [0, 200, 1000, 3800, 6000, 10935] // metres, one per stage

/** Depth in metres for a (fractional) stage position. */
export function depthAt(cur: number): number {
  const i0 = Math.min(DEPTHS.length - 2, Math.floor(cur))
  const fr = cur - i0
  return DEPTHS[i0] + (DEPTHS[i0 + 1] - DEPTHS[i0]) * fr
}

export const pressureAtm = (depthM: number) => 1 + depthM / 10.06
export const sunlightPct = (depthM: number) => 100 * Math.exp(-depthM / 43.4)

export const formatInt = (n: number) => Math.round(n).toLocaleString('en-US')
export function formatSunlight(pct: number): string {
  if (pct >= 1) return pct.toFixed(0) + '%'
  if (pct >= 0.0001) return pct.toFixed(4) + '%'
  return 'None'
}
