import { describe, expect, it } from 'vitest'
import { LABELS, LIGHT_KM_S, LY, EARTH, GALAXY_CENTRE, LOCAL_GROUP, STAGE_D, fmtDist, fmtTime, viewHeightKm, zoomState } from './cosmic'

describe('zoom', () => {
  it('lands exactly on each stage level', () => {
    STAGE_D.forEach((d, i) => expect(zoomState(i).D / d).toBeCloseTo(1, 9))
  })
  it('interpolates in log space (geometric mean halfway)', () => {
    expect(zoomState(0.5).D / Math.sqrt(STAGE_D[0] * STAGE_D[1])).toBeCloseTo(1, 9)
  })
  it('the camera target moves Earth -> Sun -> galactic centre -> Local Group', () => {
    expect(zoomState(0).target).toEqual(EARTH)
    expect(zoomState(2).target).toEqual([0, 0, 0])
    expect(zoomState(5).target).toEqual(GALAXY_CENTRE)
    expect(zoomState(7).target).toEqual(LOCAL_GROUP)
  })
  it('D spans ~20 orders of magnitude and only ever increases', () => {
    STAGE_D.slice(1).forEach((d, i) => expect(d).toBeGreaterThan(STAGE_D[i]))
    expect(Math.log10(STAGE_D[7] / STAGE_D[0])).toBeGreaterThan(19)
  })
  it('view height at the start is about Earth-sized', () => {
    const h = viewHeightKm(zoomState(0).D, 6)
    expect(h).toBeGreaterThan(12000)
    expect(h).toBeLessThan(15000)
    expect(fmtDist(h)).toBe('13,300 km')
  })
})

describe('HUD formatting', () => {
  it('distances', () => {
    expect(fmtDist(14000)).toBe('14,000 km')
    expect(fmtDist(2.5e6)).toBe('2.5 million km')
    expect(fmtDist(7.48e9)).toBe('50.0 AU')
    expect(fmtDist(4.2 * LY)).toBe('4.2 light years')
    expect(fmtDist(5e4 * LY)).toBe('50,000 light years')
    expect(fmtDist(2.5e6 * LY)).toBe('2.5 million ly')
    expect(fmtDist(9.3e10 * LY)).toBe('93.0 billion ly')
  })
  it('light-crossing times', () => {
    expect(fmtTime(0.047)).toBe('0.047 seconds')
    expect(fmtTime(4.7)).toBe('4.7 seconds')
    expect(fmtTime(120)).toBe('2.0 minutes')
    expect(fmtTime(7200)).toBe('2.0 hours')
    expect(fmtTime(3 * 86400)).toBe('3.0 days')
    expect(fmtTime(3.156e7 * 100)).toBe('100 years')
    expect(fmtTime(3.156e7 * 2.5e6)).toBe('2.5 million years')
    expect(fmtTime(3.156e7 * 4e9)).toBe('4.0 billion years')
  })
  it('light takes ~1.3 s to cross the Earth-Moon distance', () => {
    expect(384400 / LIGHT_KM_S).toBeCloseTo(1.28, 1)
  })
})

describe('labels', () => {
  it('have 9 labels with sorted fade ranges', () => {
    expect(LABELS).toHaveLength(9)
    LABELS.forEach((l) => {
      const r = l.range
      expect(r[0] <= r[1] && r[1] <= r[2] && r[2] <= r[3]).toBe(true)
    })
  })
})
