export type City = { name: string; lat: number; lon: number }
export type CityWeather = { temp: number; code: number; wind: number; off: number }

// One request for all cities (Open-Meteo: free, no API key, non-commercial use).
export function weatherUrl(cities: readonly { lat: number; lon: number }[]) {
  const la = cities.map((c) => c.lat).join(',')
  const lo = cities.map((c) => c.lon).join(',')
  return `https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
}

type OpenMeteoResult = {
  current: { temperature_2m: number; weather_code: number; wind_speed_10m: number }
  utc_offset_seconds: number
}

// Open-Meteo returns an array for several locations, a single object for one.
export function parseWeather(json: unknown): CityWeather[] {
  const arr = (Array.isArray(json) ? json : [json]) as OpenMeteoResult[]
  return arr.map((d) => ({
    temp: d.current.temperature_2m,
    code: d.current.weather_code,
    wind: d.current.wind_speed_10m,
    off: d.utc_offset_seconds,
  }))
}

// WMO weather code -> label
export function describeCode(c: number): string {
  if (c === 0) return 'Clear'
  if (c === 1) return 'Mainly clear'
  if (c === 2) return 'Partly cloudy'
  if (c === 3) return 'Overcast'
  if (c <= 48) return 'Fog'
  if (c <= 57) return 'Drizzle'
  if (c <= 67) return 'Rain'
  if (c <= 77) return 'Snow'
  if (c <= 82) return 'Showers'
  if (c <= 86) return 'Snow showers'
  return 'Thunderstorm'
}

// -10C seafoam -> 15C butter -> 35C coral
export function tempHex(t: number): string {
  const stops: [number, number[]][] = [
    [-10, [108, 195, 207]],
    [15, [243, 211, 124]],
    [35, [241, 130, 104]],
  ]
  const c = Math.max(-10, Math.min(35, t))
  const [a, b] = c <= 15 ? [stops[0], stops[1]] : [stops[1], stops[2]]
  const k = (c - a[0]) / (b[0] - a[0])
  return '#' + a[1].map((v, i) => Math.round(v + (b[1][i] - v) * k).toString(16).padStart(2, '0')).join('')
}

// Pin height: 0.08 (cold) .. 0.40 (hot), clamped to -10..40 C
export function pinHeight(t: number): number {
  return 0.08 + ((Math.max(-10, Math.min(40, t)) + 10) / 50) * 0.32
}

// "HH:MM" local time of a city, from its UTC offset in seconds
export function localTime(offsetSeconds: number, nowMs: number): string {
  const t = new Date(nowMs + offsetSeconds * 1000)
  const p = (x: number) => String(x).padStart(2, '0')
  return `${p(t.getUTCHours())}:${p(t.getUTCMinutes())}`
}

export function latLonToXYZ(lat: number, lon: number, r = 1): [number, number, number] {
  const p = (lat * Math.PI) / 180
  const l = (lon * Math.PI) / 180
  return [Math.cos(p) * Math.sin(l) * r, Math.sin(p) * r, Math.cos(p) * Math.cos(l) * r]
}
