import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { BackPill } from '../../components/BackPill'
import { PyramidScene } from '../../scenes/pyramid/PyramidScene'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { pyramidFacts } from '../../content/pyramid'
import { BLOCKS, calc, formatEvery, formatInt, formatYears } from '../../lib/pyramid'
import { site } from '../../content/site'

const mono = 'font-mono text-xs text-muted'

function Slider(p: { label: string; value: string; min: number; max: number; step: number; v: number; set: (n: number) => void }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold">
      <span className="flex justify-between">
        {p.label}
        <span className={mono}>{p.value}</span>
      </span>
      <input
        type="range"
        min={p.min}
        max={p.max}
        step={p.step}
        value={p.v}
        onChange={(e) => p.set(parseInt(e.target.value, 10))}
        className="w-full accent-accent"
      />
    </label>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 bg-[#faf8f5] p-3.5">
      <span className="font-mono text-[11px] text-muted">{label}</span>
      <span className={`text-[22px] font-extrabold tracking-[-.02em] ${accent ? 'text-accent' : ''}`}>{value}</span>
    </div>
  )
}

export default function PyramidPage() {
  const { search } = useLocation()
  const preview = new URLSearchParams(search).has('preview') // ?preview=1: no UI, loops the build
  const reduced = useReducedMotion()
  const [workers, setWorkers] = useState(25000)
  const [hours, setHours] = useState(10)
  const [days, setDays] = useState(300)
  const [playing, setPlaying] = useState(preview)
  const [fact, setFact] = useState(0)

  const progress = useRef(0)
  const yearRef = useRef<HTMLSpanElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const { perDay, years, every, tonnesPerDay } = calc({ workers, hours, days })
  const yearsRef = useRef(years)
  useEffect(() => {
    yearsRef.current = years
  }, [years])

  // called by the scene every frame: update the counters without re-rendering React
  const onTick = useCallback((p: number) => {
    if (!yearRef.current || !pctRef.current || !barRef.current) return
    yearRef.current.textContent = `Year ${(p * yearsRef.current).toFixed(1)} of ${yearsRef.current.toFixed(1)}`
    pctRef.current.textContent = `${Math.round(p * 100)}% · ${formatInt(p * BLOCKS)} blocks`
    barRef.current.style.width = p * 100 + '%'
  }, [])
  const onComplete = useCallback(() => setPlaying(false), [])

  const build = () => {
    if (progress.current >= 1) progress.current = 0
    if (reduced) {
      // reduced motion: no 12 s animation, show the finished pyramid
      progress.current = 1
      setPlaying(false)
    } else setPlaying(!playing)
  }
  const reset = () => {
    progress.current = 0
    setPlaying(false)
  }

  const factCard = (variant: 'float' | 'inline') => (
    <div
      className={
        variant === 'float'
          ? 'fixed right-4 bottom-4 z-10 hidden w-[min(280px,calc(100%-32px))] flex-col gap-3 rounded-3xl border border-ink/[.08] bg-[rgba(250,248,245,.86)] p-5 backdrop-blur-[14px] md:flex'
          : 'flex flex-col gap-2 border-t border-ink/10 pt-4 md:hidden'
      }
    >
      <span className="font-mono text-[11px] text-muted">Did you know</span>
      <span className="text-[15px] leading-normal font-semibold text-pretty">{pyramidFacts[fact]}</span>
      <button
        onClick={() => setFact((fact + 1) % pyramidFacts.length)}
        className="cursor-pointer self-start border-0 bg-transparent p-0 text-[13px] font-bold text-accent"
      >
        Another fact →
      </button>
    </div>
  )

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg-sand" role="img" aria-label="3D model of the Great Pyramid being built block by block">
      <title>{`Build a Pyramid — ${site.name}`}</title>
      <Canvas
        shadows
        camera={{ fov: 35, near: 0.5, far: 400, position: [30, 22, 50] }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <PyramidScene
          progress={progress}
          playing={playing}
          preview={preview}
          showUI={!preview}
          reducedMotion={reduced}
          onTick={onTick}
          onComplete={onComplete}
        />
      </Canvas>

      {!preview && (
        <>
          <BackPill title="Build a Pyramid" subtitle="Ancient · Great Pyramid of Giza, c. 2560 BC" category="Ancient" />
          <div className="fixed bottom-4 left-4 z-10 flex max-h-[calc(100vh-100px)] w-[min(340px,calc(100%-32px))] flex-col gap-[18px] overflow-auto rounded-[26px] border border-ink/[.08] bg-[rgba(250,248,245,.9)] p-[22px] shadow-[0_24px_48px_-28px_rgba(30,31,36,.45)] backdrop-blur-[14px]">
            <div className="flex flex-col gap-1.5">
              <span className="text-[22px] font-extrabold tracking-[-.02em]">Could you build it?</span>
              <span className="text-sm leading-normal text-text-2">
                2.3 million stone blocks, about 2.5 tonnes each. Pick a crew and see how long it takes.
              </span>
            </div>
            <Slider label="Workers" value={workers.toLocaleString('en-US')} min={2000} max={40000} step={500} v={workers} set={setWorkers} />
            <Slider label="Hours per day" value={`${hours} h`} min={6} max={14} step={1} v={hours} set={setHours} />
            <Slider label="Days worked per year" value={String(days)} min={150} max={360} step={10} v={days} set={setDays} />
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/10">
              <Stat label="Build time" value={formatYears(years)} accent />
              <Stat label="One block every" value={formatEvery(every)} />
              <Stat label="Blocks per day" value={formatInt(perDay)} />
              <Stat label="Tonnes per day" value={formatInt(tonnesPerDay)} />
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between font-mono text-xs text-text-2">
                <span ref={yearRef}>Year 0</span>
                <span ref={pctRef}>0%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-md bg-ink/10">
                <div ref={barRef} className="h-full w-0 rounded-md bg-accent" />
              </div>
              <div className="flex gap-2">
                <button onClick={build} className="flex-1 cursor-pointer rounded-full border-0 bg-ink p-[13px] text-sm font-bold text-bg">
                  {playing ? 'Pause' : progress.current >= 1 ? 'Build again' : 'Build it'}
                </button>
                <button onClick={reset} className="cursor-pointer rounded-full border-0 bg-ink/[.07] px-[18px] py-[13px] text-sm font-bold text-ink hover:bg-ink/[.14]">
                  Reset
                </button>
              </div>
            </div>
            <span className="text-xs leading-normal text-muted">
              Rates calibrated so 25,000 workers, 10 h a day, 300 days a year gives the usual estimate of about 20 years. Real crews were
              paid labourers, not slaves.
            </span>
            {factCard('inline')}
          </div>
          {factCard('float')}
        </>
      )}
    </div>
  )
}
