import { clamp } from './story'

export const LY = 9.4607e12 // km in a light year
export const AU_KM = 1.496e8
export const LIGHT_KM_S = 299792.458

export type Vec3 = [number, number, number]
export type Range4 = [number, number, number, number] // fade range [in0, in1, out1, out0] in stage units

// ---- real positions, in km ----
export const EARTH: Vec3 = [AU_KM, 0, 0]
export const MOON: Vec3 = [EARTH[0] + Math.cos(0.7) * 384400, 0, Math.sin(0.7) * 384400]
export const GALAXY_CENTRE: Vec3 = [2.46e17, 0, 0] // ~26,000 ly from the Sun
export const ANDROMEDA: Vec3 = [GALAXY_CENTRE[0] + 2.0e19, 3e18, -1.4e19]
export const LOCAL_GROUP: Vec3 = [(GALAXY_CENTRE[0] + ANDROMEDA[0]) / 2, ANDROMEDA[1] / 2, ANDROMEDA[2] / 2]
export const ALPHA_CEN: Vec3 = [-2.4 * LY, 1.2 * LY, 3.2 * LY]

export const PLANETS = [
  { name: 'Mercury', au: 0.387, color: '#a9a39b' },
  { name: 'Venus', au: 0.723, color: '#e3c58f' },
  { name: 'Earth', au: 1, color: '#5b8fd6' },
  { name: 'Mars', au: 1.524, color: '#d0694a' },
  { name: 'Jupiter', au: 5.203, color: '#d8b48a' },
  { name: 'Saturn', au: 9.537, color: '#e6d09c' },
  { name: 'Uranus', au: 19.19, color: '#9fd8e0' },
  { name: 'Neptune', au: 30.07, color: '#5a7fe0' },
]
export const NEPTUNE_AU = 30.07
export function planetPos(i: number): Vec3 {
  const a = i === 2 ? 0 : i * 1.9 + 0.6 // Earth sits on +x; the others are spread around
  const r = PLANETS[i].au * AU_KM
  return [Math.cos(a) * r, 0, Math.sin(a) * r]
}

// ---- zoom levels ----
// key size (km) for each of the 8 stages; D = key / 2.1 is how many km one display unit stands for
export const STAGE_KEYS = [6371, 384400 * 1.15, 1.7e8, 4.6e9, 12 * LY, 6e4 * LY, 3.4e6 * LY, 4.4e23]
export const STAGE_D = STAGE_KEYS.map((k) => k / 2.1)
const ORIGIN: Vec3 = [0, 0, 0]
const TARGETS: Vec3[] = [EARTH, EARTH, ORIGIN, ORIGIN, ORIGIN, GALAXY_CENTRE, LOCAL_GROUP, LOCAL_GROUP]

/**
 * Zoom level D (km per display unit, interpolated in log10 space) and the look-at target (km) for a stage position.
 * Everything is drawn at (realPos - target) / D so no coordinate ever gets large.
 */
export function zoomState(cur: number): { D: number; target: Vec3 } {
  const i0 = Math.min(STAGE_D.length - 2, Math.floor(cur))
  const fr = cur - i0
  const a = Math.log10(STAGE_D[i0])
  const b = Math.log10(STAGE_D[i0 + 1])
  const D = Math.pow(10, a + (b - a) * fr)
  const w = clamp((D - STAGE_D[i0]) / (STAGE_D[i0 + 1] - STAGE_D[i0]))
  const t0 = TARGETS[i0]
  const t1 = TARGETS[i0 + 1]
  return { D, target: [t0[0] + (t1[0] - t0[0]) * w, t0[1] + (t1[1] - t0[1]) * w, t0[2] + (t1[2] - t0[2]) * w] }
}

/** Height of the visible area in km. camDist is the camera distance in display units (6, or 8.5 on phones). */
export const viewHeightKm = (D: number, camDist: number) => 2 * camDist * Math.tan((20 * Math.PI) / 180) * D

// ---- HUD number formatting ----
const num = (n: number, d: number) => n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d })

export function fmtDist(km: number): string {
  if (km < 1e6) return num(Math.round(km / 100) * 100, 0) + ' km'
  if (km < 1e9) return num(km / 1e6, 1) + ' million km'
  if (km < 0.05 * LY) return num(km / AU_KM, 1) + ' AU'
  const ly = km / LY
  if (ly < 1000) return num(ly, 1) + ' light years'
  if (ly < 1e6) return num(ly, 0) + ' light years'
  if (ly < 1e9) return num(ly / 1e6, 1) + ' million ly'
  return num(ly / 1e9, 1) + ' billion ly'
}

export function fmtTime(s: number): string {
  const y = s / 3.156e7
  if (s < 1) return s.toFixed(3) + ' seconds'
  if (s < 60) return num(s, 1) + ' seconds'
  if (s < 3600) return num(s / 60, 1) + ' minutes'
  if (s < 86400) return num(s / 3600, 1) + ' hours'
  if (y < 1) return num(s / 86400, 1) + ' days'
  if (y < 1e6) return Math.round(y).toLocaleString('en-US') + ' years'
  if (y < 1e9) return num(y / 1e6, 1) + ' million years'
  return num(y / 1e9, 1) + ' billion years'
}

// ---- screen labels that follow objects ----
export const LABELS: { name: string; pos: Vec3; range: Range4 }[] = [
  { name: 'Earth', pos: EARTH, range: [0.6, 1, 3.3, 3.8] },
  { name: 'Moon', pos: MOON, range: [0.3, 0.7, 1.3, 1.8] },
  { name: 'Sun', pos: ORIGIN, range: [1.4, 1.9, 4.3, 4.8] },
  { name: 'Jupiter', pos: planetPos(4), range: [2.4, 2.9, 3.5, 4] },
  { name: 'Neptune', pos: planetPos(7), range: [2.4, 2.9, 3.5, 4] },
  { name: 'Alpha Centauri', pos: ALPHA_CEN, range: [3.5, 3.9, 4.5, 5] },
  { name: 'You are here', pos: ORIGIN, range: [4.5, 4.9, 5.5, 6] },
  { name: 'Milky Way', pos: GALAXY_CENTRE, range: [5.5, 5.9, 6.5, 7] },
  { name: 'Andromeda', pos: ANDROMEDA, range: [5.5, 5.9, 6.5, 7] },
]
