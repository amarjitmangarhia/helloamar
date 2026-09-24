import { useCallback, useRef } from 'react'
import { useLocation } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { StoryLayout } from '../../components/story/StoryLayout'
import { HudStat } from '../../components/story/HudStat'
import { DeepScene } from '../../scenes/deep/DeepScene'
import { useScrollStage } from '../../hooks/useScrollStage'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { deepOutro, deepStages } from '../../content/deep'
import { depthAt, formatInt, formatSunlight, pressureAtm, sunlightPct } from '../../lib/deep'
import { site } from '../../content/site'

export default function DeepPage() {
  const { search } = useLocation()
  const preview = new URLSearchParams(search).has('preview') // ?preview=1: no UI, ping-pongs through the stages
  const reduced = useReducedMotion()
  const { update, idx, goTo } = useScrollStage(deepStages.length, { ease: 0.07, preview, reducedMotion: reduced })

  const depthRef = useRef<HTMLSpanElement>(null)
  const pressRef = useRef<HTMLSpanElement>(null)
  const lightRef = useRef<HTMLSpanElement>(null)

  // every frame: write the depth / pressure / sunlight readouts (no React re-render)
  const onFrame = useCallback((cur: number) => {
    if (!depthRef.current || !pressRef.current || !lightRef.current) return
    const depth = depthAt(cur)
    depthRef.current.textContent = formatInt(depth) + ' m'
    pressRef.current.textContent = formatInt(pressureAtm(depth)) + ' atm'
    lightRef.current.textContent = formatSunlight(sunlightPct(depth))
  }, [])

  return (
    <StoryLayout
      title="The Deep"
      subtitle="Ocean · scroll story"
      category="Ocean"
      stages={deepStages}
      idx={idx}
      onGo={goTo}
      accent="#9fd8e0"
      outro={deepOutro}
      preview={preview}
      hud={
        <>
          <HudStat label="Depth" valueRef={depthRef} initial="0 m" color="#9fd8e0" />
          <HudStat label="Pressure" valueRef={pressRef} initial="1 atm" color="#f3d37c" />
          <HudStat label="Sunlight left" valueRef={lightRef} initial="100%" color="#ecebe6" />
        </>
      }
    >
      <title>{`The Deep — ${site.name}`}</title>
      <Canvas flat camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 6] }} dpr={[1, 2]} gl={{ antialias: true }}>
        <DeepScene update={update} onFrame={onFrame} preview={preview} reducedMotion={reduced} />
      </Canvas>
    </StoryLayout>
  )
}
