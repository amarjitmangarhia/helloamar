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
// [x, y, scale, opacity] of the particle group per section
const layoutWide = [
  [1.55, 0.05, 1, 1],
  [0, 0, 1.9, 0.32],
  [-1.75, 0, 1, 1],
  [0, -0.05, 1.2, 0.7],
]
const layoutNarrow = [
  [0, 0.75, 0.72, 0.55],
  [0, 0, 1.3, 0.25],
  [0, 0.9, 0.6, 0.4],
  [0, 0.1, 0.8, 0.45],
]
// how strongly the particles show behind text on narrower screens (readability; not in the original spec)
const DIM_WIDE = [0.9, 0.55, 1, 0.5]
const DIM_TABLET = [0.5, 0.5, 0.5, 0.5]
const DIM_PHONE = [0.7, 0.45, 0.45, 0.45]

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

// Ink-dot starfield behind the particles. Normal blending (not additive) per the light-theme spec.
function buildStarfield() {
  const N = 1800
  const p = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(18 + Math.random() * 20)
    p.set([v.x, v.y, v.z], i * 3)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(p, 3))
  const mat = new THREE.PointsMaterial({ color: '#1e1f24', size: 2.2, sizeAttenuation: true, transparent: true, opacity: 0.3, depthWrite: false })
  return { points: new THREE.Points(geo, mat), geo, mat }
}

export function ParticleField({ config, reducedMotion, onActive }: Props) {
  const group = useRef<THREE.Group>(null)
  const starRef = useRef<THREE.Points>(null)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const N = densityCount[config.density]

  const geometry = useMemo(() => buildGeometry(N), [N])
  useEffect(() => () => geometry.dispose(), [geometry])

  const star = useMemo(buildStarfield, [])
  useEffect(() => () => {
    star.geo.dispose()
    star.mat.dispose()
  }, [star])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false, // fixes a broken/glitchy look: transparent point clouds need this off
        vertexShader,
        fragmentShader,
        uniforms: {
          uW: { value: [1, 0, 0, 0] },
          uTime: { value: 0 },
          uIntro: { value: 0 },
          uMouse: { value: new THREE.Vector2(99, 99) },
          uMouseStr: { value: 0 },
          uSize: { value: 40 },
          uPR: { value: 1 },
          uFade: { value: 1 },
          uOpacity: { value: 1 },
          uColA: { value: new THREE.Color() },
          uColB: { value: new THREE.Color() },
          uColC: { value: new THREE.Color() },
        },
      }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    const [a, b, c] = palettes[config.palette]
    material.uniforms.uColA.value.set(a)
    material.uniforms.uColB.value.set(b)
    material.uniforms.uColC.value.set(c)
  }, [config.palette, material])

  // mutable per-frame state (refs, never React state, so nothing re-renders at 60fps)
  const st = useRef({ f: 0, x: 1.55, y: 0.05, s: 1, op: 1, mx: 99, my: 99, mStr: 0, mLast: 0, active: 0, dim: 1 })

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
    const i0 = Math.min(2, Math.floor(s.f))
    const tt = s.f - i0
    const w = [0, 0, 0, 0]
    w[i0] = 1 - tt
    w[i0 + 1] = tt
    u.uW.value = w
    u.uTime.value = time * speed
    u.uIntro.value = reducedMotion ? 1 : Math.min(1, time / 2.2)
    u.uPR.value = state.gl.getPixelRatio()

    const vw = window.innerWidth
    const wide = vw > 960
    const L = wide ? layoutWide : layoutNarrow
    const la = L[i0]
    const lb = L[i0 + 1]
    const tx = wide ? la[0] + (lb[0] - la[0]) * tt : 0
    const ty = la[1] + (lb[1] - la[1]) * tt
    const ts = la[2] + (lb[2] - la[2]) * tt
    const to = la[3] + (lb[3] - la[3]) * tt
    const e2 = reducedMotion ? 1 : 0.08
    s.x += (tx - s.x) * e2
    s.y += (ty - s.y) * e2
    s.s += (ts - s.s) * e2
    s.op += (to - s.op) * e2
    const DM = vw <= 700 ? DIM_PHONE : wide ? DIM_WIDE : DIM_TABLET
    const td = DM[i0] + (DM[i0 + 1] - DM[i0]) * tt
    s.dim += (td - s.dim) * e2
    u.uFade.value = s.dim
    u.uOpacity.value = s.op

    const g = group.current
    if (g) {
      g.position.set(s.x, s.y, 0)
      g.scale.setScalar(s.s)
      g.rotation.y = time * 0.12 * speed + s.f * 0.9
      g.rotation.x = reducedMotion ? 0 : Math.sin(time * 0.2) * 0.08 + (s.my > 50 ? 0 : s.my * 0.03)
    }

    // starfield: rotates with scroll position, not with the section transitions
    const st2 = starRef.current
    if (st2 && !reducedMotion) {
      st2.rotation.y = window.scrollY * 0.00012
      st2.rotation.x = window.scrollY * 0.00006
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
    <>
      <primitive object={star.points} ref={starRef} />
      <group ref={group}>
        <points geometry={geometry} material={material} frustumCulled={false} />
      </group>
    </>
  )
}
