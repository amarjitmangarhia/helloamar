import { describe, expect, it } from 'vitest'
import { depthAt, formatInt, formatSunlight, pressureAtm, sunlightPct } from './deep'

describe('The Deep numbers', () => {
  it('depth follows the stage positions', () => {
    expect(depthAt(0)).toBe(0)
    expect(depthAt(1)).toBe(200)
    expect(depthAt(2.5)).toBeCloseTo(2400)
    expect(depthAt(5)).toBe(10935)
  })
  it('pressure: 1 atm at the surface, ~1,088 atm at the bottom', () => {
    expect(formatInt(pressureAtm(0))).toBe('1')
    expect(formatInt(pressureAtm(10935))).toBe('1,088')
  })
  it('sunlight: 100% at the surface, ~1% at 200 m, None in the dark', () => {
    expect(formatSunlight(sunlightPct(0))).toBe('100%')
    expect(sunlightPct(200)).toBeCloseTo(1, 1)
    expect(formatSunlight(sunlightPct(1000))).toBe('None')
    expect(formatSunlight(0.05)).toBe('0.0500%')
  })
})
