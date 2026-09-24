import { describe, expect, it } from 'vitest'
import { FERMI_STAGES, civilisationsShown, formatCount, verdictSentence, lerp } from './fermi'

describe('Fermi HUD', () => {
  it('always counts Earth', () => {
    expect(civilisationsShown(0, 1)).toBe(1)
    expect(civilisationsShown(-5, 1)).toBe(1)
  })
  it('shows all 700 when everyone is visible', () => {
    expect(civilisationsShown(1, 1)).toBe(700)
    expect(civilisationsShown(1.05, 1)).toBe(700) // uShow is scaled by 1.05, so it must clamp
  })
  it('the Great Filter (keep 4%) leaves about 29', () => {
    expect(civilisationsShown(1, 0.04)).toBe(29)
  })
  it('formats the count', () => {
    expect(formatCount(1)).toBe('1 (us)')
    expect(formatCount(700)).toBe('700')
  })
})

describe('Fermi stages + verdict', () => {
  it('has 7 stages; the radio bubble shows only on stage 3', () => {
    expect(FERMI_STAGES).toHaveLength(7)
    expect(FERMI_STAGES.map((s) => s.bub)).toEqual([0, 0, 0, 1, 0, 0, 0])
    expect(FERMI_STAGES[3].d).toBeCloseTo(0.16)
  })
  it('lerps', () => {
    expect(lerp(0, 10, 0.25)).toBe(2.5)
  })
  it('verdict sentence', () => {
    expect(verdictSentence(null)).toBe('Pick one to see what it says about you.')
    expect(verdictSentence('A pessimist. If you are right.')).toBe('You are a pessimist. If you are right.')
  })
})
