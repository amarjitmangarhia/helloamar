import { useCallback, useRef } from 'react'
import { useLocation } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { StoryLayout } from '../../components/story/StoryLayout'
import { HudStat } from '../../components/story/HudStat'
import { BlackHoleScene } from '../../scenes/blackhole/BlackHoleScene'
import { useScrollStage } from '../../hooks/useScrollStage'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { blackHoleOutro, blackHoleStages } from '../../content/blackhole'
import { dilation, distanceKm, formatDilation, formatKm } from '../../lib/blackhole'
import { site } from '../../content/site'

export default function BlackHolePage() {
  const { search } = useLocation()
  const preview = new URLSearchParams(search).has('preview') // ?preview=1: no UI, ping-pongs through the stages
  const reduced = useReducedMotion()
  const { update, idx, goTo } = useScrollStage(blackHoleStages.length, { preview, reducedMotion: reduced })

  const distRef = useRef<HTMLSpanElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const onFrame = useCallback((r: number) => {
    if (distRef.current) distRef.current.textContent = formatKm(distanceKm(r))
    if (timeRef.current) timeRef.current.textContent = formatDilation(dilation(r))
  }, [])

  return (
    <StoryLayout
      title="Black Hole"
      subtitle="Space · real-time light bending"
      category="Space"
      stages={blackHoleStages}
      idx={idx}
      onGo={goTo}
      accent="#f3d37c"
      tagColor="#f19a82"
      pageBg="#000"
      cardBg="rgba(0,0,0,.55)"
      bodyColor="#c9c8c2"
      bottomCardsOnNarrow
      outro={blackHoleOutro}
      preview={preview}
      hud={
        <>
          <HudStat label="Distance to horizon" valueRef={distRef} initial="–" color="#f3d37c" />
          <HudStat label="1 hour for you =" valueRef={timeRef} initial="–" color="#9fd8e0" />
        </>
      }
    >
      <title>{`Black Hole — ${site.name}`}</title>
      <Canvas flat dpr={1} gl={{ antialias: false }}>
        <BlackHoleScene update={update} onFrame={onFrame} preview={preview} reducedMotion={reduced} />
      </Canvas>
    </StoryLayout>
  )
}
