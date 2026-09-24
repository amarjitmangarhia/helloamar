import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './shaders/particles.vert.glsl'
import fragmentShader from './shaders/particles.frag.glsl'
import { genShapes } from './shapes'
import { densityCount, palettes, type HomeSceneConfig } from './config'

type Props = {
  config: HomeSceneConfig
  reducedMotion: boolean
  onActive: (index: number) => void
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
// [x, y, scale] of the particle group per section (wide screens)
const layoutWide = [[1.6, 0, 1], [0, 0, 1.3], [-1.75, 0, 1], [1.7, 0, 0.95], [0, -0.35, 1.25]]
// phones (<= 700px): the ball sits in the upper part of the screen for the hero (text is at the bottom)
const layoutPhone = [[0, 0.85, 0.62], [0, 0, 0.6], [0, 0, 0.6], [0, 0, 0.55], [0, -0.1, 0.7]]

function buildGeometry(N: number) {
  const S = genShapes(N)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(S[0], 3))
  S.forEach((a, i) => geo.setAttribute('aS' + i, new THREE.BufferAttribute(a, 3)))
  const rnd = new Float32Array(N)
  for (let i = 0; i < N; i++) rnd[i] = Math.random()
  geo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1))
  return geo
}

export function ParticleField({ config, reducedMotion, onActive }: Props) {
  const group = useRef<THREE.Group>(null)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const N = densityCount[config.density]

  const geometry = useMemo(() => buildGeometry(N), [N])
  useEffect(() => () => geometry.dispose(), [geometry])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uW: { value: [1, 0, 0, 0, 0] },
          uTime: { value: 0 },
          uIntro: { value: 0 },
          uMouse: { value: new THREE.Vector2(99, 99) },
          uMouseStr: { value: 0 },
          uSize: { value: 40 },
          uPR: { value: 1 },
          uColA: { value: new THREE.Color() },
          uColB: { value: new THREE.Color() },
        },
      }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    const [a, b] = palettes[config.palette]
    material.uniforms.uColA.value.set(a)
    material.uniforms.uColB.value.set(b)
  }, [config.palette, material])

  // mutable per-frame state (refs, never React state, so nothing re-renders at 60fps)
  const st = useRef({ f: 0, x: 1.6, y: 0, s: 1, mx: 99, my: 99, mStr: 0, mLast: 0, active: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const hh = Math.tan((17.5 * Math.PI) / 180) * 6
      const hw = hh * camera.aspect
      st.current.mx = (e.clientX / window.innerWidth) * 2 * hw - hw
      st.current.my = -((e.clientY / window.innerHeight) * 2 - 1) * hh
      st.current.mLast = performance.now()
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [camera])

  useFrame((state) => {
    const s = st.current
    const u = material.uniforms
    const time = state.clock.elapsedTime
    const speed = reducedMotion ? 0 : config.speed
    const now = performance.now()

    // which section is at the screen centre -> which shape to morph to
    const secs = document.querySelectorAll('[data-shape]')
    const mid = window.innerHeight / 2
    const centers = [...secs].map((el) => {
      const r = el.getBoundingClientRect()
      return r.top + Math.min(r.height, window.innerHeight) / 2
    })
    let target = 0
    if (centers.length) {
      if (mid <= centers[0]) target = 0
      else if (mid >= centers[centers.length - 1]) target = centers.length - 1
      else
        for (let i = 0; i < centers.length - 1; i++) {
          if (mid >= centers[i] && mid < centers[i + 1]) {
            target = i + smooth(0.2, 0.8, (mid - centers[i]) / (centers[i + 1] - centers[i]))
            break
          }
        }
    }
    const ease = reducedMotion ? 1 : 0.07
    s.f += (target - s.f) * ease
    const i0 = Math.min(3, Math.floor(s.f))
    const tt = s.f - i0
    const w = [0, 0, 0, 0, 0]
    w[i0] = 1 - tt
    w[i0 + 1] = tt
    u.uW.value = w
    u.uTime.value = time * speed
    u.uIntro.value = reducedMotion ? 1 : Math.min(1, time / 2.2)
    u.uPR.value = state.gl.getPixelRatio()

    const vw = window.innerWidth
    const wide = vw > 960
    const phone = vw <= 700
    const L = phone ? layoutPhone : layoutWide
    const la = L[i0]
    const lb = L[i0 + 1]
    const tx = wide ? la[0] + (lb[0] - la[0]) * tt : 0
    const ty = la[1] + (lb[1] - la[1]) * tt
    const ts = (la[2] + (lb[2] - la[2]) * tt) * (wide || phone ? 1 : 0.72)
    const e2 = reducedMotion ? 1 : 0.08
    s.x += (tx - s.x) * e2
    s.y += (ty - s.y) * e2
    s.s += (ts - s.s) * e2
    const g = group.current
    if (g) {
      g.position.set(s.x, s.y, 0)
      g.scale.setScalar(s.s)
      g.rotation.y = time * 0.12 * speed + s.f * 0.9
      g.rotation.x = reducedMotion ? 0 : Math.sin(time * 0.2) * 0.08 + (s.my > 50 ? 0 : s.my * 0.03)
    }

    // cursor repulsion, fades 1.5s after the mouse stops
    const want = config.interactive && !reducedMotion && now - s.mLast < 1500 ? 1 : 0
    s.mStr += (want - s.mStr) * 0.05
    u.uMouse.value.set(s.mx, s.my)
    u.uMouseStr.value = s.mStr
    u.uSize.value = 40 * Math.max(0.7, window.innerHeight / 900)

    const idx = Math.round(s.f)
    if (idx !== s.active) {
      s.active = idx
      onActive(idx)
    }
  })

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  )
}
