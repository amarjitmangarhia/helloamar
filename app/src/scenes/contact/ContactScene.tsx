import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import starVert from './shaders/starfield.vert.glsl'
import starFrag from './shaders/starfield.frag.glsl'
import planetVert from './shaders/planet.vert.glsl'
import planetFrag from './shaders/planet.frag.glsl'
import beamVert from './shaders/beam.vert.glsl'
import beamFrag from './shaders/beam.frag.glsl'

const R = Math.random
const RING_POOL = 18
const BEAM_POINTS = 70
const BEACON_DIR = new THREE.Vector3(-0.28, 1, 0.18).normalize()
const BEAM_DIR = new THREE.Vector3(0.55, 1, -0.25).normalize()

export type RingColor = 'sky' | 'butter' | 'coral' | 'white'
const RING_HEX: Record<RingColor, string> = { sky: '#9fd8e0', butter: '#f3d37c', coral: '#f19a82', white: '#ffffff' }

export type ContactSceneHandle = {
  burst: (strength: number, color?: RingColor) => void
  sendBeam: () => void // 6 rings + the beam, per the design's "on send" spec
}

type Props = { preview: boolean; reducedMotion: boolean }

function makeStarfield() {
  const N = 2600
  const p = new Float32Array(N * 3)
  const r = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + R() * 40)
    p.set([v.x, v.y, v.z], i * 3)
    r[i] = R()
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(p, 3))
  g.setAttribute('aRand', new THREE.BufferAttribute(r, 1))
  const m = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uPR: { value: 1 }, uTime: { value: 0 }, uWarp: { value: 0 } },
    vertexShader: starVert,
    fragmentShader: starFrag,
  })
  const pts = new THREE.Points(g, m)
  pts.frustumCulled = false
  return { pts, m }
}

// A particle cap: only the top part (y > .35) of a Fibonacci sphere, so only the horizon shows.
// Continent colour is baked in per-point at build time; rotating the whole group animates it for free.
function makePlanet() {
  const N = 16000
  const pos: number[] = []
  const col: number[] = []
  const rnd: number[] = []
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N
    if (y <= 0.35) continue
    const rr = Math.sqrt(1 - y * y)
    const ph = i * 2.39996
    const x = Math.cos(ph) * rr
    const z = Math.sin(ph) * rr
    pos.push(x * 4, y * 4, z * 4)
    const land = Math.sin(x * 5 + z * 2) * Math.cos(z * 4 - x * 3) + Math.sin(y * 6) * 0.4 > 0.15
    const c = land ? '#f3d37c' : '#9fd8e0'
    const cc = new THREE.Color(c)
    col.push(cc.r, cc.g, cc.b)
    rnd.push(R())
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3))
  g.setAttribute('aCol', new THREE.BufferAttribute(new Float32Array(col), 3))
  g.setAttribute('aRand', new THREE.BufferAttribute(new Float32Array(rnd), 1))
  const m = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uPR: { value: 1 } },
    vertexShader: planetVert,
    fragmentShader: planetFrag,
  })
  const group = new THREE.Group()
  const pts = new THREE.Points(g, m)
  group.add(pts)
  return { group, m }
}

function makeBeacon() {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 64
  const ctx = cv.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(243,211,124,.9)')
  grad.addColorStop(1, 'rgba(243,211,124,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(cv)
  const mat = (o: number) => new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: o })
  const core = new THREE.Sprite(mat(1))
  core.scale.setScalar(0.22)
  const halo = new THREE.Sprite(mat(0.35))
  halo.scale.setScalar(0.6)
  const pos = BEACON_DIR.clone().multiplyScalar(4)
  core.position.copy(pos)
  halo.position.copy(pos)
  return { core, halo, tex }
}

function makeRingPool() {
  const geo = new THREE.RingGeometry(0.985, 1, 64)
  const rings = Array.from({ length: RING_POOL }, () => {
    const mat = new THREE.MeshBasicMaterial({ color: '#9fd8e0', transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.visible = false
    return { mesh, mat, life: 1, strength: 0 }
  })
  return { geo, rings }
}

function makeBeam() {
  const idx = new Float32Array(BEAM_POINTS)
  for (let i = 0; i < BEAM_POINTS; i++) idx[i] = i / (BEAM_POINTS - 1)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(BEAM_POINTS * 3), 3)) // unused; shader computes position from aI
  g.setAttribute('aI', new THREE.BufferAttribute(idx, 1))
  const m = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPR: { value: 1 },
      uHead: { value: 0 },
      uOrigin: { value: BEACON_DIR.clone().multiplyScalar(4) },
      uDir: { value: BEAM_DIR.clone() },
      uLen: { value: 22 },
    },
    vertexShader: beamVert,
    fragmentShader: beamFrag,
  })
  const pts = new THREE.Points(g, m)
  pts.frustumCulled = false
  return { pts, m }
}

export const ContactScene = forwardRef<ContactSceneHandle, Props>(function ContactScene({ preview, reducedMotion }, ref) {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera

  const star = useMemo(makeStarfield, [])
  const planet = useMemo(makePlanet, [])
  const beacon = useMemo(makeBeacon, [])
  const ringPool = useMemo(makeRingPool, [])
  const beam = useMemo(makeBeam, [])

  useEffect(() => {
    const w = window.innerWidth <= 960
    planet.group.position.set(w ? 0 : -1.6, w ? -7.1 : -6.75, -2)
    scene.add(star.pts, planet.group, beacon.core, beacon.halo, beam.pts)
    ringPool.rings.forEach((r) => scene.add(r.mesh))
    return () => {
      scene.remove(star.pts, planet.group, beacon.core, beacon.halo, beam.pts)
      ringPool.rings.forEach((r) => scene.remove(r.mesh))
      star.pts.geometry.dispose()
      star.m.dispose()
      planet.group.traverse((o) => o instanceof THREE.Points && o.geometry.dispose())
      planet.m.dispose()
      beacon.tex.dispose()
      ;(beacon.core.material as THREE.Material).dispose()
      ;(beacon.halo.material as THREE.Material).dispose()
      ringPool.geo.dispose()
      ringPool.rings.forEach((r) => r.mat.dispose())
      beam.pts.geometry.dispose()
      beam.m.dispose()
    }
  }, [scene, star, planet, beacon, ringPool, beam])

  const state = useRef({ warp: 0, beamT: -1, beamDur: 1.6, ambientNext: 1.8 })

  const burst = (strength: number, color: RingColor = 'sky') => {
    const slot = ringPool.rings.reduce((a, b) => (a.life > b.life ? a : b)) // reuse the most-finished ring
    slot.life = 0
    slot.strength = strength
    slot.mesh.material = slot.mat
    slot.mat.color.set(RING_HEX[color])
    slot.mesh.visible = true
    slot.mesh.position.copy(beacon.core.position)
    slot.mesh.quaternion.copy(camera.quaternion)
  }

  useImperativeHandle(
    ref,
    () => ({
      burst,
      sendBeam: () => {
        state.current.beamT = 0
        for (let i = 0; i < 6; i++) setTimeout(() => burst(1.3, i % 2 === 0 ? 'butter' : 'white'), i * 130)
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5
      mouse.current.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((s, delta) => {
    const st = state.current
    const dt = Math.min(0.05, delta)
    const t = reducedMotion ? 0 : s.clock.elapsedTime
    const pr = s.gl.getPixelRatio()

    // ambient ring pulses, off for reduced motion / preview
    if (!reducedMotion && !preview) {
      st.ambientNext -= dt
      if (st.ambientNext <= 0) {
        burst(0.6, 'sky')
        st.ambientNext = 1.8
      }
    }

    if (st.beamT >= 0) {
      st.beamT += dt
      const k = Math.min(1, st.beamT / st.beamDur)
      beam.m.uniforms.uHead.value = Math.pow(k, 1.6)
      st.warp = Math.sin(k * Math.PI) * 0.8
      if (k >= 1) st.beamT = -1
    } else {
      st.warp *= 0.9
    }

    star.m.uniforms.uTime.value = t
    star.m.uniforms.uWarp.value = st.warp
    star.m.uniforms.uPR.value = pr
    planet.m.uniforms.uPR.value = pr
    beam.m.uniforms.uPR.value = pr
    if (!reducedMotion) planet.group.rotation.y = t * 0.03
    const pulse = reducedMotion ? 1 : 0.6 + 0.4 * Math.sin(t * 3)
    beacon.core.material.opacity = (0.7 + 0.3 * pulse) * (1 + st.warp)
    beacon.halo.material.opacity = 0.3 * pulse

    ringPool.rings.forEach((r) => {
      if (r.life >= 1) {
        r.mesh.visible = false
        return
      }
      r.life += dt * (0.28 + 0.12 * r.strength)
      r.mesh.scale.setScalar(0.1 + r.life * (5 + 5 * r.strength))
      r.mat.opacity = Math.pow(1 - r.life, 2) * 0.5 * Math.min(1.4, r.strength)
      r.mesh.quaternion.copy(camera.quaternion)
    })

    if (!reducedMotion && !preview) {
      const m = mouse.current
      camera.position.x += (m.x * 0.3 - camera.position.x) * 0.04
      camera.position.y += (-m.y * 0.2 - camera.position.y) * 0.04
    }
    camera.position.z = 9
    camera.lookAt(0, 0, 0)
  })

  return null
})
