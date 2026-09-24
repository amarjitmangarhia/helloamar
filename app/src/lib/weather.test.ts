import { describe, expect, it } from 'vitest'
import { describeCode, latLonToXYZ, localTime, parseWeather, pinHeight, tempHex, weatherUrl } from './weather'

describe('weather helpers', () => {
  it('maps WMO codes to labels', () => {
    expect(describeCode(0)).toBe('Clear')
    expect(describeCode(3)).toBe('Overcast')
    expect(describeCode(45)).toBe('Fog')
    expect(describeCode(63)).toBe('Rain')
    expect(describeCode(73)).toBe('Snow')
    expect(describeCode(95)).toBe('Thunderstorm')
  })
  it('colours: cold seafoam, mild butter, hot coral, clamped', () => {
    expect(tempHex(-10)).toBe('#6cc3cf')
    expect(tempHex(15)).toBe('#f3d37c')
    expect(tempHex(35)).toBe('#f18268')
    expect(tempHex(-40)).toBe('#6cc3cf')
    expect(tempHex(60)).toBe('#f18268')
  })
  it('pin height spans 0.08..0.40', () => {
    expect(pinHeight(-10)).toBeCloseTo(0.08)
    expect(pinHeight(40)).toBeCloseTo(0.4)
    expect(pinHeight(-50)).toBeCloseTo(0.08)
  })
  it('local time from utc offset', () => {
    const noonUtc = Date.UTC(2026, 0, 1, 12, 0)
    expect(localTime(0, noonUtc)).toBe('12:00')
    expect(localTime(9 * 3600, noonUtc)).toBe('21:00')
    expect(localTime(-5.5 * 3600, noonUtc)).toBe('06:30')
  })
  it('lat/lon to xyz', () => {
    const [x, y, z] = latLonToXYZ(0, 0, 2)
    expect([x, y, z]).toEqual([0, 0, 2])
    expect(latLonToXYZ(90, 0, 1)[1]).toBeCloseTo(1)
  })
  it('builds one request and parses arrays or a single object', () => {
    expect(weatherUrl([{ lat: 1, lon: 2 }, { lat: 3, lon: 4 }])).toContain('latitude=1,3&longitude=2,4')
    const one = { current: { temperature_2m: 5, weather_code: 1, wind_speed_10m: 9 }, utc_offset_seconds: 3600 }
    expect(parseWeather(one)).toEqual([{ temp: 5, code: 1, wind: 9, off: 3600 }])
    expect(parseWeather([one, one])).toHaveLength(2)
  })
})
