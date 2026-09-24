import { useCallback, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { StoryLayout } from '../../components/story/StoryLayout'
import { HudStat } from '../../components/story/HudStat'
import { FermiScene } from '../../scenes/fermi/FermiScene'
import { useScrollStage } from '../../hooks/useScrollStage'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { fermiOptions, fermiStages, fermiVerdicts } from '../../content/fermi'
import { formatCount, loadVote, saveVote, verdictSentence } from '../../lib/fermi'
import { site } from '../../content/site'

const GREEN = '#9dffc8'

export default function FermiPage() {
  const { search } = useLocation()
  const preview = new URLSearchParams(search).has('preview') // ?preview=1: no UI, ping-pongs through the stages
  const reduced = useReducedMotion()
  const { update, idx, goTo } = useScrollStage(fermiStages.length, { preview, reducedMotion: reduced })
  const [vote, setVote] = useState<number | null>(loadVote)

  const countRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const onFrame = useCallback((n: number) => {
    if (countRef.current) countRef.current.textContent = formatCount(n)
  }, [])

  const pick = (i: number) => {
    setVote(i)
    saveVote(i)
  }

  const voteSection = (
    <section className="box-border flex min-h-screen items-center justify-center px-6 py-[120px]">
      <div className="box-border flex w-full max-w-[640px] flex-col gap-6 rounded-[30px] border border-[#ecebe6]/[.12] bg-[rgba(7,8,12,.7)] p-8 backdrop-blur-[10px]">
        <span className="font-mono text-[13px]" style={{ color: GREEN }}>
          Your turn
        </span>
        <h2 className="m-0 text-[clamp(34px,4.6vw,56px)] leading-none font-extrabold tracking-[-.04em]">Which answer do you believe?</h2>
        <div className="flex flex-col gap-2" role="group" aria-label="Your answer">
          {fermiOptions.map((name, i) => {
            const on = vote === i
            return (
              <button
                key={name}
                onClick={() => pick(i)}
                aria-pressed={on}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-[18px] border px-[18px] py-4 text-left text-base font-bold"
                style={{
                  background: on ? GREEN : 'rgba(236,235,230,.04)',
                  color: on ? '#07080c' : '#ecebe6',
                  borderColor: on ? GREEN : 'rgba(236,235,230,.14)',
                }}
              >
                <span>{name}</span>
                <span className="font-mono text-xs font-medium">{on ? 'Your pick' : ''}</span>
              </button>
            )
          })}
        </div>
        <p className="m-0 min-h-[26px] text-base leading-[1.6] text-[#c9c8c2]" aria-live="polite">
          {verdictSentence(vote === null ? null : fermiVerdicts[vote])}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/projects/black-hole" className="rounded-full bg-[#ecebe6] px-[22px] py-3.5 text-[15px] font-bold text-[#07080c]">
            Next: Black Hole →
          </Link>
          <Link to="/projects" className="rounded-full border border-[#ecebe6]/30 px-[22px] py-3.5 text-[15px] font-bold text-[#ecebe6]">
            All projects
          </Link>
        </div>
      </div>
    </section>
  )

  return (
    <StoryLayout
      title="Where is everybody?"
      subtitle="Aliens · the Fermi paradox"
      category="Aliens"
      stages={fermiStages}
      idx={idx}
      onGo={goTo}
      accent={GREEN}
      pageBg="#07080c"
      cardBg="rgba(7,8,12,.6)"
      bodyColor="#c9c8c2"
      customOutro={voteSection}
      preview={preview}
      hud={<HudStat label="Civilisations shown" valueRef={countRef} initial="1" color={GREEN} />}
    >
      <title>{`Where is everybody? — ${site.name}`}</title>
      <div
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[2] flex items-center gap-2 font-mono text-xs whitespace-nowrap text-[#ecebe6] opacity-0"
      >
        <span className="h-px w-3.5 bg-[#ecebe6]" />
        {idx === 3 ? 'Our radio bubble, ~110 light years' : 'Us'}
      </div>
      <Canvas flat camera={{ fov: 40, near: 0.0005, far: 200, position: [0, 8, 9] }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={['#07080c']} />
        <FermiScene update={update} onFrame={onFrame} labelRef={labelRef} preview={preview} reducedMotion={reduced} />
      </Canvas>
    </StoryLayout>
  )
}
