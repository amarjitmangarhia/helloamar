import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './shaders/type.vert.glsl'
import fragmentShader from './shaders/type.frag.glsl'
import { sampleWord } from './sample'

const N = 7000
const CAM_Z = 7
const HALF_H = Math.tan((17.5 * Math.PI) / 180) * CAM_Z

type Props = { word: string; scatterTick: number; reducedMotion: boolean }

// 7,000 particles that spring toward the pixels of a word. CPU simulation, cursor repulsion.
export function ParticleType({ word, scatterTick, reducedMotion }: Props) {
  const points = useRef<THREE.Points>(null)
  const size = useThree((s) => s.size)
  const halfW = (HALF_H * size.width) / size.height

  const { geometry, pos, vel } = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const rnd = new Float32Array(N)
    for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * 14
    for (let i = 0; i < N; i++) rnd[i] = Math.random()
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1))
    return { geometry, pos, vel: new Float32Array(N * 3) }
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 }, uPR: { value: 1 }, uSize: { value: 30 } },
      }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])

  const target = useRef<Float32Array | null>(null)
  const m = useRef({ x: 99, last: 0, y: 99, halfW })
  useEffect(() => {
    m.current.halfW = halfW
  }, [halfW])

  // (re)sample the word once Manrope is loaded, and whenever the word or screen width changes
  const fontReady = useRef(false)
  useEffect(() => {
    let alive = true
    const resample = () => {
      if (alive) target.current = sampleWord(word, N, halfW)
    }
    if (fontReady.current) resample()
    else
      document.fonts
        .load('800 200px Manrope')
        .catch(() => {})
        .finally(() => {
          fontReady.current = true
          resample()
        })
    return () => {
      alive = false
    }
  }, [word, halfW])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      m.current.x = ((e.clientX / window.innerWidth) * 2 - 1) * m.current.halfW
      m.current.y = -((e.clientY / window.innerHeight) * 2 - 1) * HALF_H
      m.current.last = performance.now()
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // click / "Scatter": random impulse on every particle
  useEffect(() => {
    if (scatterTick === 0) return
    for (let i = 0; i < vel.length; i++) vel[i] += (Math.random() - 0.5) * 0.5
  }, [scatterTick, vel])

  useFrame((state) => {
    const tg = target.current
    if (!tg) return
    const mouse = m.current
    if (reducedMotion) {
      // no springs, no drift: particles sit on the word
      pos.set(tg)
      vel.fill(0)
    } else {
      const active = performance.now() - mouse.last < 1200
      for (let i = 0; i < N; i++) {
        const k = i * 3
        vel[k] = vel[k] * 0.9 + (tg[k] - pos[k]) * 0.02
        vel[k + 1] = vel[k + 1] * 0.9 + (tg[k + 1] - pos[k + 1]) * 0.02
        vel[k + 2] = vel[k + 2] * 0.9 + (tg[k + 2] - pos[k + 2]) * 0.02
        if (active) {
          const dx = pos[k] - mouse.x
          const dy = pos[k + 1] - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < 0.45) {
            const f = ((0.45 - d2) * 0.09) / (Math.sqrt(d2) + 0.01)
            vel[k] += dx * f
            vel[k + 1] += dy * f
            vel[k + 2] += 0.02
          }
        }
        pos[k] += vel[k]
        pos[k + 1] += vel[k + 1]
        pos[k + 2] += vel[k + 2]
      }
    }
    geometry.attributes.position.needsUpdate = true

    const u = material.uniforms
    u.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime
    u.uPR.value = state.gl.getPixelRatio()
    u.uSize.value = 30 * Math.max(0.7, window.innerHeight / 900)
    const p = points.current
    if (p) {
      p.rotation.y =
        reducedMotion || mouse.x > 50 ? 0 : p.rotation.y + ((mouse.x / mouse.halfW) * 0.15 - p.rotation.y) * 0.05
    }
  })

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
}
