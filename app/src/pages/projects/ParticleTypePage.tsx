import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { BackPill } from '../../components/BackPill'
import { ParticleType } from '../../scenes/particle-type/ParticleType'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { site } from '../../content/site'

const MAX = 14
const PREVIEW_WORDS = ['HELLO', 'CODE', 'PLAY']

function wordFromHash() {
  const m = window.location.hash.match(/w=([^&]+)/)
  if (!m) return 'HELLO'
  let w = m[1]
  try {
    w = decodeURIComponent(w)
  } catch {
    /* keep raw */
  }
  return w.toUpperCase().slice(0, MAX)
}

export default function ParticleTypePage() {
  const { search } = useLocation()
  const preview = new URLSearchParams(search).has('preview') // ?preview=1: no UI, auto-cycles words
  const reduced = useReducedMotion()
  const [text, setText] = useState(wordFromHash)
  const [tick, setTick] = useState(0)
  const [copied, setCopied] = useState(false)
  const [pi, setPi] = useState(0)

  useEffect(() => {
    if (!preview) return
    const id = setInterval(() => setPi((i) => (i + 1) % PREVIEW_WORDS.length), 2800)
    return () => clearInterval(id)
  }, [preview])

  const word = preview ? PREVIEW_WORDS[pi] : text

  const copyLink = () => {
    const url = window.location.href.split('#')[0] + '#w=' + encodeURIComponent(text)
    try {
      window.history.replaceState(null, '', url)
    } catch {
      /* ignore */
    }
    navigator.clipboard?.writeText(url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      role="img"
      aria-label={`Particles forming the word ${word}`}
      onPointerDown={() => setTick((t) => t + 1)}
    >
      <title>{`Particle Type — ${site.name}`}</title>
      <Canvas camera={{ fov: 35, near: 0.1, far: 50, position: [0, 0, 7] }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ParticleType word={word} scatterTick={tick} reducedMotion={reduced} />
      </Canvas>

      {!preview && (
        <>
          <BackPill title="Particle Type" subtitle="Project 01 · three.js" category="Play" />
          <div
            className="fixed bottom-6 left-1/2 z-10 flex w-[min(560px,calc(100%-32px))] -translate-x-1/2 flex-col items-center gap-2.5"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="box-border flex w-full gap-2 rounded-full border border-ink/[.08] bg-[rgba(250,248,245,.85)] p-2 shadow-[0_20px_40px_-24px_rgba(30,31,36,.4)] backdrop-blur-[14px]">
              <input
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase().slice(0, MAX))}
                maxLength={MAX}
                placeholder="Type a word"
                aria-label="Word to spell"
                className="min-w-0 flex-1 border-0 bg-transparent px-4 text-lg font-bold tracking-[.02em] text-ink outline-0"
              />
              <button
                onClick={() => setTick((t) => t + 1)}
                className="cursor-pointer rounded-full bg-ink/[.07] px-[18px] py-3 text-sm font-bold text-ink hover:bg-ink/[.14]"
              >
                Scatter
              </button>
              <button
                onClick={copyLink}
                className="cursor-pointer rounded-full bg-ink px-[18px] py-3 text-sm font-bold whitespace-nowrap text-bg"
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
            <span className="text-center font-mono text-xs text-muted">
              Type to reshape · move the cursor to push · click to scatter
            </span>
          </div>
        </>
      )}
    </div>
  )
}
