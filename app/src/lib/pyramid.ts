export const BLOCKS = 2.3e6 // stone blocks in the Great Pyramid
export const TONNES_PER_BLOCK = 2.5
// Calibrated so 25,000 workers x 10 h x 300 days/yr = the usual ~20 year estimate (blocks per worker-hour)
export const K = BLOCKS / (20 * 300 * 25000 * 10)

export type Crew = { workers: number; hours: number; days: number }

export function calc({ workers, hours, days }: Crew) {
  const perDay = workers * hours * K
  const years = BLOCKS / (perDay * days)
  const every = (hours * 3600) / perDay // seconds between blocks
  return { perDay, years, every, tonnesPerDay: perDay * TONNES_PER_BLOCK }
}

export const formatInt = (n: number) => Math.round(n).toLocaleString('en-US')
export const formatYears = (y: number) => (y < 100 ? y.toFixed(1) + ' yrs' : Math.round(y) + ' yrs')
export const formatEvery = (s: number) => (s < 60 ? Math.round(s) + ' sec' : (s / 60).toFixed(1) + ' min')
