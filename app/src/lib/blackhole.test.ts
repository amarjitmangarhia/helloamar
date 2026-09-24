import { describe, expect, it } from 'vitest'
import { STAGE_RADII, cameraRadius, dilation, distanceKm, formatDilation, formatKm, renderScale, screenShift } from './blackhole'

describe('Black Hole numbers', () => {
  it('camera radius hits each stage value and blends in log space', () => {
    STAGE_RADII.forEach((r, i) => expect(cameraRadius(i)).toBeCloseTo(r, 6))
    expect(cameraRadius(0.5)).toBeCloseTo(Math.sqrt(60 * 28), 6)
  })
  it('distance to the horizon', () => {
    expect(formatKm(distanceKm(60))).toBe('749 million km')
    expect(formatKm(distanceKm(1.35))).toBe('4 million km')
    expect(formatKm(2e9)).toBe('2.0 billion km')
  })
  it('time dilation', () => {
    expect(formatDilation(dilation(60))).toBe('1.008 hours far away')
    expect(formatDilation(dilation(13))).toBe('1.04 hours far away')
    expect(formatDilation(dilation(1.35))).toBe('1.96 hours far away')
  })
})

describe('layout + render scale', () => {
  it('shifts the hole right of the card on desktop, up on phones', () => {
    expect(screenShift(1440, 900).x).toBeCloseTo(-0.3156, 3)
    expect(screenShift(1440, 900).y).toBe(0)
    expect(screenShift(600, 900)).toEqual({ x: 0, y: -0.22 })
  })
  it('caps the render resolution', () => {
    expect(renderScale(800, 600, 1)).toBe(1)
    expect(renderScale(1440, 900, 2)).toBeCloseTo((1100 / 1440) * 1.5, 6)
  })
})
