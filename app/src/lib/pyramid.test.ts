import { describe, expect, it } from 'vitest'
import { calc, formatEvery, formatInt, formatYears } from './pyramid'
import { buildCells } from '../scenes/pyramid/cells'

describe('pyramid calculator', () => {
  const d = calc({ workers: 25000, hours: 10, days: 300 })
  it('default crew gives the usual ~20 year estimate', () => {
    expect(d.years).toBeCloseTo(20, 6)
    expect(formatYears(d.years)).toBe('20.0 yrs')
  })
  it('default crew: blocks/day, tonnes/day, one block every', () => {
    expect(formatInt(d.perDay)).toBe('383')
    expect(formatInt(d.tonnesPerDay)).toBe('958')
    expect(formatEvery(d.every)).toBe('1.6 min')
  })
  it('smallest crew takes centuries, biggest well under 10 years', () => {
    expect(formatYears(calc({ workers: 2000, hours: 6, days: 150 }).years)).toBe('833 yrs')
    expect(calc({ workers: 40000, hours: 14, days: 360 }).years).toBeLessThan(10)
  })
  it('formats short intervals in seconds', () => {
    expect(formatEvery(45.2)).toBe('45 sec')
  })
})

describe('pyramid model', () => {
  it('has 40 layers and 22,140 boxes, built bottom-up', () => {
    const cells = buildCells()
    expect(cells).toHaveLength(22140)
    expect(cells[0][3]).toBe(0)
    expect(cells[cells.length - 1][3]).toBe(39)
    expect(cells[cells.length - 1][1]).toBeGreaterThan(cells[0][1])
  })
})
