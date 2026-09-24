import { describe, expect, it } from 'vitest'
import { validateContact, timeInZone, EMAIL_RE } from './contact'

describe('validateContact', () => {
  it('flags an empty name, a bad email, and a too-short message', () => {
    const e = validateContact('', 'not-an-email', 'short')
    expect(e.name).toBe('Please add your name.')
    expect(e.email).toBe("That email doesn't look right.")
    expect(e.message).toBe('A little more detail, please (10 characters minimum).')
  })
  it('passes valid input with no errors', () => {
    expect(validateContact('Amar', 'amar@example.com', 'Hello, this message is long enough.')).toEqual({})
  })
  it('trims whitespace before checking', () => {
    expect(validateContact('  Amar  ', 'amar@example.com', '   plenty of characters here   ')).toEqual({})
  })
})

describe('EMAIL_RE', () => {
  it('accepts ordinary addresses, rejects obviously bad ones', () => {
    expect(EMAIL_RE.test('a@b.com')).toBe(true)
    expect(EMAIL_RE.test('a@b')).toBe(false)
    expect(EMAIL_RE.test('a b@c.com')).toBe(false)
  })
})

describe('timeInZone', () => {
  it('formats HH:MM for a given zone', () => {
    const d = new Date(Date.UTC(2026, 0, 1, 14, 5))
    expect(timeInZone('UTC', d)).toBe('14:05')
    expect(timeInZone('America/Toronto', d)).toBe('09:05')
  })
})
