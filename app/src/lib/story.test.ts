import { describe, expect, it } from 'vitest'
import { fade, pingPong, stageTarget } from './story'

describe('stageTarget', () => {
  const vh = 1000
  it('starts at stage 0 and holds for the first 30% of each stage', () => {
    expect(stageTarget(0, vh, 6)).toBe(0)
    expect(stageTarget(0.3 * 1.4 * vh, vh, 6)).toBeCloseTo(0)
  })
  it('is halfway between stages at 65% of the way through', () => {
    expect(stageTarget(0.65 * 1.4 * vh, vh, 6)).toBeCloseTo(0.5)
  })
  it('reaches the next stage exactly at 140vh', () => {
    expect(stageTarget(1.4 * vh, vh, 6)).toBeCloseTo(1)
  })
  it('never passes the last stage', () => {
    expect(stageTarget(99 * vh, vh, 6)).toBe(5)
  })
})

describe('pingPong', () => {
  it('bounces 0 -> last -> 0', () => {
    expect(pingPong(0, 6)).toBe(0)
    expect(pingPong(25, 6)).toBeCloseTo(5) // 25 * 0.2 = 5
    expect(pingPong(30, 6)).toBeCloseTo(4) // 6 -> comes back down
    expect(pingPong(50, 6)).toBeCloseTo(0) // 10 -> wraps to 0
  })
})

describe('fade', () => {
  it('ramps up, holds, ramps down', () => {
    const r: [number, number, number, number] = [1, 2, 3, 4]
    expect(fade(0.5, r)).toBe(0)
    expect(fade(1.5, r)).toBeCloseTo(0.5)
    expect(fade(2.5, r)).toBe(1)
    expect(fade(3.5, r)).toBeCloseTo(0.5)
    expect(fade(5, r)).toBe(0)
  })
})
