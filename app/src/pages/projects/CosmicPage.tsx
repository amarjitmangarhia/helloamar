import { useCallback, useRef } from 'react'
import { useLocation } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { StoryLayout } from '../../components/story/StoryLayout'
import { HudStat } from '../../components/story/HudStat'
import { CosmicScene } from '../../scenes/cosmic/CosmicScene'
import { useScrollStage } from '../../hooks/useScrollStage'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cosmicOutro, cosmicStages } from '../../content/cosmic'
import { LABELS, LIGHT_KM_S, fmtDist, fmtTime } from '../../lib/cosmic'
import { site } from '../../content/site'

export default function CosmicPage() {
  const { search } = useLocation()
  const preview = new URLSearchParams(search).has('preview') // ?preview=1: no UI, ping-pongs through the stages
  const reduced = useReducedMotion()
  const { update, idx, goTo } = useScrollStage(cosmicStages.length, { ease: 0.07, preview, reducedMotion: reduced })

  const scaleRef = useRef<HTMLSpanElement>(null)
  const lightRef = useRef<HTMLSpanElement>(null)
  const labels = useRef<(HTMLDivElement | null)[]>([])
  const onFrame = useCallback((km: number) => {
    if (scaleRef.current) scaleRef.current.textContent = fmtDist(km)
    if (lightRef.current) lightRef.current.textContent = fmtTime(km / LIGHT_KM_S)
  }, [])

  return (
    <StoryLayout
      title="Cosmic Zoom"
      subtitle="Space · scroll story"
      category="Space"
      stages={cosmicStages}
      idx={idx}
      onGo={goTo}
      accent="#f3d37c"
      tagColor="#f19a82"
      pageBg="#0b0c10"
      cardBg="rgba(11,12,16,.55)"
      bodyColor="#c9c8c2"
      outro={cosmicOutro}
      preview={preview}
      hud={
        <>
          <HudStat label="Height of view" valueRef={scaleRef} initial="13,300 km" color="#f3d37c" />
          <HudStat label="Light crosses it in" valueRef={lightRef} initial="0.044 seconds" color="#9fd8e0" />
        </>
      }
    >
      <title>{`Cosmic Zoom — ${site.name}`}</title>
      {LABELS.map((l, i) => (
        <div
          key={l.name}
          ref={(el) => {
            labels.current[i] = el
          }}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[2] flex items-center gap-2 font-mono text-xs whitespace-nowrap text-[#ecebe6] opacity-0"
        >
          <span className="h-px w-3.5 bg-[#ecebe6]" />
          {l.name}
        </div>
      ))}
      <Canvas flat camera={{ fov: 40, near: 0.001, far: 1e6, position: [0, 1, 6] }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={['#0b0c10']} />
        <CosmicScene update={update} onFrame={onFrame} labels={labels} preview={preview} reducedMotion={reduced} />
      </Canvas>
    </StoryLayout>
  )
}
