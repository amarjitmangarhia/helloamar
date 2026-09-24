import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { BackPill } from '../../components/BackPill'
import { WeatherGlobe } from '../../scenes/weather-globe/WeatherGlobe'
import { buildLandMask } from '../../scenes/weather-globe/landMask'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useWeather } from '../../hooks/useWeather'
import { cities } from '../../content/cities'
import { describeCode, localTime, tempHex } from '../../lib/weather'
import { site } from '../../content/site'

export default function WeatherGlobePage() {
  const { search } = useLocation()
  const preview = new URLSearchParams(search).has('preview') // ?preview=1: no UI, labels always on
  const reduced = useReducedMotion()
  const { data, err, updated } = useWeather(cities)
  const [selected, setSelected] = useState(-1)
  const [, setClock] = useState(0)
  const labels = useRef<(HTMLDivElement | null)[]>([])
  const landAlpha = useMemo(buildLandMask, [])

  // re-render every 30s so the local times stay current
  useEffect(() => {
    const id = setInterval(() => setClock((n) => n + 1), 30000)
    return () => clearInterval(id)
  }, [])

  const onSelect = useCallback((i: number) => setSelected(i), [])
  const onDrag = useCallback(() => setSelected(-1), [])

  return (
    <div className="fixed inset-0 overflow-hidden">
      <title>{`Weather Globe — ${site.name}`}</title>

      <div aria-hidden="true" className="fixed inset-0">
        <Canvas camera={{ fov: 35, near: 0.1, far: 50, position: [0, 0, 5.2] }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <WeatherGlobe
            cities={cities}
            data={data}
            selected={selected}
            onSelect={onSelect}
            onDrag={onDrag}
            labels={labels}
            landAlpha={landAlpha}
            panelOpen={!preview}
            labelsWithoutData={preview}
            reducedMotion={reduced}
          />
        </Canvas>
      </div>

      {/* floating city labels (positioned every frame by the scene) */}
      {cities.map((c, i) => (
        <div
          key={c.name}
          ref={(el) => {
            labels.current[i] = el
          }}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[6] flex items-center gap-1.5 rounded-full border border-ink/[.08] bg-[rgba(250,248,245,.92)] px-[9px] py-[5px] text-xs font-bold whitespace-nowrap opacity-0 shadow-[0_6px_14px_-8px_rgba(30,31,36,.4)] transition-opacity duration-[250ms]"
        >
          <span>{c.name}</span>
          <span className="font-mono font-medium text-text-2">{data?.[i] ? Math.round(data[i].temp) + '°' : '–'}</span>
        </div>
      ))}

      {!preview && (
        <>
          <BackPill title="Weather Globe" subtitle="Project 02 · Open-Meteo API + three.js" category="Ocean" />
          <nav
            aria-label="Cities"
            className="fixed bottom-4 left-4 z-10 flex max-h-[calc(100vh-110px)] w-[min(300px,calc(100%-32px))] flex-col gap-1.5 overflow-auto rounded-[26px] border border-ink/[.08] bg-[rgba(250,248,245,.88)] px-3 pt-[18px] pb-3 shadow-[0_24px_48px_-28px_rgba(30,31,36,.45)] backdrop-blur-[14px]"
          >
            <div className="flex items-baseline justify-between px-2 pb-2">
              <span className="text-base font-extrabold">Right now</span>
              <span className="font-mono text-[11px] text-muted">{updated}</span>
            </div>
            {cities.map((c, i) => {
              const w = data?.[i]
              return (
                <button
                  key={c.name}
                  aria-pressed={i === selected}
                  onClick={() => setSelected(selected === i ? -1 : i)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border-0 p-2.5 text-left text-ink hover:bg-ink/[.06] ${i === selected ? 'bg-ink/[.08]' : 'bg-transparent'}`}
                >
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: w ? tempHex(w.temp) : '#c9c3ba' }} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-bold">{c.name}</span>
                    <span className="text-xs text-muted">
                      {w ? `${describeCode(w.code)} · ${Math.round(w.wind)} km/h` : err ? 'No data' : 'Loading…'}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-0.5">
                    <span className="text-base font-extrabold">{w ? Math.round(w.temp) + '°' : '–'}</span>
                    <span className="font-mono text-[11px] text-muted">{w ? localTime(w.off, Date.now()) : ''}</span>
                  </span>
                </button>
              )
            })}
          </nav>
          <span className="fixed right-5 bottom-5 z-10 font-mono text-xs text-muted">Drag to spin · pick a city to fly there</span>
        </>
      )}
    </div>
  )
}
