import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './shaders/blackhole.vert.glsl'
import fragmentShader from './shaders/blackhole.frag.glsl'
import { cameraRadius, renderScale, screenShift } from '../../lib/blackhole'

type Props = {
  update: (timeSec: number) => number // from useScrollStage
  onFrame: (radius: number) => void // HUD: distance + time dilation
  preview: boolean
  reducedMotion: boolean
}

const UP = new THREE.Vector3(0, 1, 0)

// A full-screen quad; the fragment shader ray-traces the black hole for every pixel.
export function BlackHoleScene({ update, onFrame, preview, reducedMotion }: Props) {
  const setDpr = useThree((s) => s.setDpr)
  const size = useThree((s) => s.size)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uRes: { value: new THREE.Vector2() },
          uCam: { value: new THREE.Vector3() },
          uF: { value: new THREE.Vector3() },
          uR: { value: new THREE.Vector3() },
          uU: { value: new THREE.Vector3() },
          uTime: { value: 0 },
          uShift: { value: 0 },
          uShiftY: { value: 0 },
        },
      }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])

  // heavy shader: render below native resolution (capped)
  useEffect(() => {
    setDpr(renderScale(window.innerWidth, window.innerHeight, window.devicePixelRatio))
  }, [size, setDpr])

  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5
      mouse.current.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const yaw = useRef(0)
  const v = useMemo(() => ({ F: new THREE.Vector3(), R: new THREE.Vector3(), U: new THREE.Vector3() }), [])

  useFrame((state, delta) => {
    const u = material.uniforms
    const t = state.clock.elapsedTime
    const cur = update(t)
    const r = cameraRadius(cur)

    if (!reducedMotion) yaw.current += Math.min(0.05, delta) * 0.04 // slow drift around the hole
    const m = mouse.current
    const pitch = 0.09 + m.y * 0.12 + Math.max(0, 1 - cur) * 0.08
    const yw = yaw.current + m.x * 0.5
    u.uCam.value.set(Math.sin(yw) * Math.cos(pitch) * r, Math.sin(pitch) * r, Math.cos(yw) * Math.cos(pitch) * r)
    v.F.copy(u.uCam.value).multiplyScalar(-1).normalize()
    v.R.crossVectors(v.F, UP).normalize()
    v.U.crossVectors(v.R, v.F)
    u.uF.value.copy(v.F)
    u.uR.value.copy(v.R)
    u.uU.value.copy(v.U)

    const s = preview ? { x: 0, y: 0 } : screenShift(window.innerWidth, window.innerHeight)
    const k = reducedMotion ? 1 : 0.08
    u.uShift.value += (s.x - u.uShift.value) * k
    u.uShiftY.value += (s.y - u.uShiftY.value) * k
    u.uTime.value = reducedMotion ? 0 : t // reduced motion: freeze the swirling disk
    state.gl.getDrawingBufferSize(u.uRes.value)

    onFrame(r)
  })

  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}
