import { clamp } from './story'

export const CIV_N = 700 // civilisation dots (index 0 is "Us")
export const SUN: [number, number, number] = [-2.6, 0, 0.4]
export const VOTE_KEY = 'fermi-vote'

export type FermiStage = {
  show: number // fraction of the 699 other civilisations visible
  keep: number // Great Filter survivors (fraction kept)
  dim: number // zoo: how much they fade
  tgt: 'c' | 's' // camera looks at the galactic centre or the Sun
  d: number // camera distance
  bub: number // radio bubble opacity factor
}

// one entry per stage; the scene blends stage i -> i+1
export const FERMI_STAGES: FermiStage[] = [
  { show: 0, keep: 1, dim: 0, tgt: 'c', d: 13, bub: 0 },
  { show: 1, keep: 1, dim: 0, tgt: 'c', d: 11, bub: 0 },
  { show: 1, keep: 0.04, dim: 0, tgt: 'c', d: 11, bub: 0 },
  { show: 1, keep: 0.04, dim: 0, tgt: 's', d: 0.16, bub: 1 },
  { show: 0, keep: 1, dim: 0, tgt: 'c', d: 10, bub: 0 },
  { show: 0.35, keep: 1, dim: 0.75, tgt: 's', d: 2.2, bub: 0 },
  { show: 0, keep: 1, dim: 0, tgt: 'c', d: 14, bub: 0 },
]

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k

/** How many civilisations the HUD reports (Earth always counts as 1). */
export function civilisationsShown(show: number, keep: number): number {
  return Math.max(1, Math.round((CIV_N - 1) * clamp(show) * Math.min(1, keep)) + 1)
}
export const formatCount = (n: number) => (n === 1 ? '1 (us)' : n.toLocaleString('en-US'))

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)
export function verdictSentence(verdict: string | null): string {
  return verdict === null ? 'Pick one to see what it says about you.' : 'You are ' + lowerFirst(verdict)
}

/** Read the saved vote (index) from localStorage; null if none or storage is blocked. */
export function loadVote(): number | null {
  try {
    const v = localStorage.getItem(VOTE_KEY)
    return v === null ? null : +v
  } catch {
    return null
  }
}
export function saveVote(i: number) {
  try {
    localStorage.setItem(VOTE_KEY, String(i))
  } catch {
    /* storage blocked: the vote just isn't remembered */
  }
}
