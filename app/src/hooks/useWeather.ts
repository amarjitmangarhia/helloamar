import { useEffect, useState } from 'react'
import { parseWeather, weatherUrl, type CityWeather, type City } from '../lib/weather'

const REFRESH_MS = 10 * 60 * 1000

type State = { data: CityWeather[] | null; err: boolean; updated: string }

// Fetches all cities in one request, then again every 10 minutes. Keeps old data if a refresh fails.
export function useWeather(cities: readonly City[]): State {
  const [state, setState] = useState<State>({ data: null, err: false, updated: 'Loading…' })
  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const r = await fetch(weatherUrl(cities))
        if (!r.ok) throw new Error(String(r.status))
        const data = parseWeather(await r.json())
        if (!alive) return
        const n = new Date()
        const p = (x: number) => String(x).padStart(2, '0')
        setState({ data, err: false, updated: `Updated ${p(n.getHours())}:${p(n.getMinutes())}` })
      } catch {
        if (alive) setState((s) => ({ ...s, err: true, updated: 'Offline' }))
      }
    }
    load()
    const id = setInterval(load, REFRESH_MS)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [cities])
  return state
}
