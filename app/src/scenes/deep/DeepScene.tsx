import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './shaders/particles.vert.glsl'
import fragmentShader from './shaders/particles.frag.glsl'
import { fade } from '../../lib/story'

const R = Math.random
const gaussN = () => (R() + R() + R() - 1.5) / 1.5
// sea colour at each of the 6 depths; the background and the fog lerp through these
const BG_STOPS = ['#5fb4c8', '#1f6a8a', '#0c2740', '#060d1a', '#04070f', '#020308'].map((c) => new THREE.Color(c))

type Pt = [x: number, y: number, z: number, color: string, rand?: number]
type Cloud = THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>

// additive round-point material; `defines` switches on SNOW / JELLY / SPARK behaviour in the vertex shader
function pmat(size: number, defines?: Record<string, number>) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uOp: { value: 1 }, uSize: { value: size }, uPR: { value: 1 }, uTime: { value: 0 }, uOff: { value: 0 } },
    vertexShader,
    fragmentShader,
    defines,
  })
}

function buildRig() {
  const root = new THREE.Group()
  const bg = new THREE.Color()
  const fog = new THREE.Fog(bg, 4, 16)

  const cloud = (n: number, fn: (i: number) => Pt, mat: THREE.ShaderMaterial): Cloud => {
    const p = new Float32Array(n * 3)
    const c = new Float32Array(n * 3)
    const r = new Float32Array(n)
    const col = new THREE.Color()
    for (let i = 0; i < n; i++) {
      const o = fn(i)
      p[i * 3] = o[0]
      p[i * 3 + 1] = o[1]
      p[i * 3 + 2] = o[2]
      col.set(o[3])
      c.set([col.r, col.g, col.b], i * 3)
      r[i] = o[4] ?? R()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    g.setAttribute('aCol', new THREE.BufferAttribute(c, 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(r, 1))
    const pts = new THREE.Points(g, mat)
    pts.frustumCulled = false
    root.add(pts)
    return pts
  }

  // 2,600 specks of marine snow (Y wraps in the shader)
  const snowMat = pmat(3.2, { SNOW: 1 })
  const snow = cloud(2600, () => [(R() - 0.5) * 18, (R() - 0.5) * 14, -8 + R() * 11, '#dfe9ee'], snowMat)

  // 9 light rays + wireframe wave surface (stages 0-1)
  const rays = new THREE.Group()
  root.add(rays)
  const rayMats: THREE.MeshBasicMaterial[] = []
  const rayBase: number[] = []
  for (let i = 0; i < 9; i++) {
    const m = new THREE.MeshBasicMaterial({ color: '#e8fbff', transparent: true, opacity: 0.06 + R() * 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
    rayMats.push(m)
    rayBase.push(m.opacity)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5 + R() * 1.2, 16), m)
    mesh.position.set((R() - 0.5) * 12, 3, -2 - R() * 4)
    mesh.rotation.z = -0.25 + (R() - 0.5) * 0.1
    rays.add(mesh)
  }
  const surf = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40, 60, 60),
    new THREE.MeshBasicMaterial({ color: '#c9f2f7', transparent: true, opacity: 0.35, wireframe: true, depthWrite: false }),
  )
  surf.rotation.x = Math.PI / 2
  surf.position.y = 4.2
  root.add(surf)
  const surfBase = (surf.geometry.attributes.position.array as Float32Array).slice()

  // 420-point fish school orbiting (stages 0-1.9)
  const fishMat = pmat(4.4)
  const fish = cloud(
    420,
    () => {
      const a = R() * 6.283
      const r = 1.4 + gaussN() * 0.35
      return [Math.cos(a) * r, gaussN() * 0.35, Math.sin(a) * r, R() < 0.5 ? '#e6f3f7' : '#b9dbe6', a]
    },
    fishMat,
  )
  const fishBase = (fish.geometry.attributes.position.array as Float32Array).slice()

  // 3 point-cloud jellyfish: pulsing bell + swaying tentacles (stages 1.3-4.2)
  const jellies: { obj: Cloud; x: number; y: number; z: number; ph: number }[] = []
  const makeJelly = (x: number, y: number, z: number, col: string, s: number) => {
    const obj = cloud(
      900,
      (i) => {
        if (i < 450) {
          const u = R() * 6.283
          const v = (R() * Math.PI) / 2
          return [Math.cos(u) * Math.sin(v), Math.cos(v) * 0.7, Math.sin(u) * Math.sin(v), col, R() * 0.5]
        }
        const k = i % 10
        const a = (k / 10) * 6.283
        const t = R()
        return [Math.cos(a) * 0.7 * (1 - t * 0.5), -t * 2.8, Math.sin(a) * 0.7 * (1 - t * 0.5), i % 3 ? col : '#ffffff', 0.5 + R() * 0.5]
      },
      pmat(5, { JELLY: 1 }),
    )
    obj.scale.setScalar(s)
    jellies.push({ obj, x, y, z, ph: R() * 6 })
  }
  makeJelly(2.2, 0.6, -1, '#9fd8e0', 0.7)
  makeJelly(-1.2, -1.2, -3.5, '#f19a82', 0.55)
  makeJelly(3.8, -1.6, -4, '#b5a3ea', 0.5)

  // 260 blinking bioluminescent sparks (2.4+)
  const sparkMat = pmat(7, { SPARK: 1 })
  const sparks = cloud(260, () => [(R() - 0.5) * 16, (R() - 0.5) * 10, -8 + R() * 9, ['#6cc3cf', '#9dffd8', '#b5a3ea'][Math.floor(R() * 3)]], sparkMat)

  // anglerfish lure: glow dot + halo + a real point light (3.2-5)
  const lure = cloud(1, () => [0, 0, 0, '#f3d37c', 1], pmat(40))
  const halo = cloud(1, () => [0, 0, 0, '#f3d37c', 1], pmat(160))
  const glow = new THREE.PointLight('#9fd8e0', 0, 12)
  root.add(glow)

  // flat-shaded seafloor (3.8+)
  const floorG = new THREE.PlaneGeometry(40, 30, 80, 60)
  floorG.rotateX(-Math.PI / 2)
  const fp = floorG.attributes.position
  for (let i = 0; i < fp.count; i++)
    fp.setY(i, Math.sin(fp.getX(i) * 0.6) * 0.25 + Math.cos(fp.getZ(i) * 0.8 + fp.getX(i) * 0.2) * 0.3 + R() * 0.08)
  floorG.computeVertexNormals()
  const floorMat = new THREE.MeshStandardMaterial({ color: '#2a3340', roughness: 1, transparent: true, flatShading: true })
  const floor = new THREE.Mesh(floorG, floorMat)
  floor.position.set(0, -3.2, -4)
  root.add(floor)
  root.add(new THREE.HemisphereLight('#bfe8f2', '#000000', 0.5))

  const mats = [snowMat, sparkMat, lure.material, halo.material, fish.material, ...jellies.map((j) => j.obj.material)]

  const dispose = () =>
    root.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
        o.geometry.dispose()
        ;(o.material as THREE.Material).dispose()
      }
    })

  return { root, bg, fog, mats, snowMat, sparkMat, snow, rays, rayMats, rayBase, surf, surfBase, fish, fishBase, jellies, sparks, lure, halo, glow, floor, floorMat, dispose }
}
type Rig = ReturnType<typeof buildRig>

function updateRig(rig: Rig, cur: number, t: number, wide: boolean, gl: THREE.WebGLRenderer, camera: THREE.Camera) {
  const i0 = Math.min(4, Math.floor(cur))
  const fr = cur - i0
  rig.bg.copy(BG_STOPS[i0]).lerp(BG_STOPS[i0 + 1], fr)
  gl.setClearColor(rig.bg)
  rig.fog.color.copy(rig.bg)
  const pr = gl.getPixelRatio()
  rig.mats.forEach((m) => {
    m.uniforms.uTime.value = t
    m.uniforms.uPR.value = pr
  })
  const ox = wide ? 1.8 : 0 // push the subject right on wide screens (text card sits on the left)

  rig.snowMat.uniforms.uOff.value = cur * 9
  rig.snowMat.uniforms.uOp.value = 0.35 + Math.min(1, cur) * 0.45

  const rayOp = fade(cur, [-1, -1, 0.4, 1.3])
  rig.rays.visible = rayOp > 0
  rig.rayMats.forEach((m, k) => (m.opacity = rig.rayBase[k] * rayOp * (0.7 + 0.3 * Math.sin(t * 0.7 + k))))
  rig.rays.position.y = cur * 6

  rig.surf.visible = cur < 1
  rig.surf.material.opacity = 0.35 * (1 - cur)
  rig.surf.position.y = 4.2 + cur * 6
  if (rig.surf.visible) {
    const sp = rig.surf.geometry.attributes.position
    for (let i = 0; i < sp.count; i++) sp.setZ(i, Math.sin(rig.surfBase[i * 3] * 0.5 + t) * 0.15 + Math.cos(rig.surfBase[i * 3 + 1] * 0.6 + t * 0.8) * 0.15)
    sp.needsUpdate = true
  }

  const fOp = fade(cur, [-1, -1, 1.2, 1.9])
  rig.fish.visible = fOp > 0
  rig.fish.material.uniforms.uOp.value = fOp
  if (rig.fish.visible) {
    const P = rig.fish.geometry.attributes.position.array as Float32Array
    const rnd = rig.fish.geometry.attributes.aRand.array as Float32Array
    for (let i = 0; i < rnd.length; i++) {
      const a = rnd[i] + t * 0.5
      const r = Math.hypot(rig.fishBase[i * 3], rig.fishBase[i * 3 + 2])
      P[i * 3] = Math.cos(a) * r
      P[i * 3 + 2] = Math.sin(a) * r
      P[i * 3 + 1] = rig.fishBase[i * 3 + 1] + Math.sin(a * 3) * 0.15
    }
    rig.fish.geometry.attributes.position.needsUpdate = true
    rig.fish.position.set(ox + 0.5, 0.3 + cur * 2.5, -1.5)
    rig.fish.rotation.x = 0.35
  }

  const jOp = fade(cur, [1.3, 2, 3.4, 4.2])
  rig.jellies.forEach((j) => {
    j.obj.visible = jOp > 0
    j.obj.material.uniforms.uOp.value = jOp
    j.obj.position.set(j.x + ox * 0.6 + Math.sin(t * 0.2 + j.ph) * 0.3, j.y + Math.sin(t * 0.5 + j.ph) * 0.25 + (cur - 2.6) * 1.6, j.z)
    j.obj.rotation.z = Math.sin(t * 0.3 + j.ph) * 0.15
  })

  const sOp = fade(cur, [2.4, 3.2, 99, 99])
  rig.sparks.visible = sOp > 0
  rig.sparkMat.uniforms.uOp.value = sOp

  const lOp = fade(cur, [3.2, 3.9, 4.4, 5])
  rig.lure.visible = rig.halo.visible = lOp > 0
  rig.lure.material.uniforms.uOp.value = lOp
  rig.halo.material.uniforms.uOp.value = lOp * 0.25
  const lx = ox + 1 + Math.sin(t * 0.4) * 0.5
  const ly = -0.2 + Math.sin(t * 0.9) * 0.15 + (cur - 4.1) * 1.5
  rig.lure.position.set(lx, ly, -1)
  rig.halo.position.set(lx, ly, -1.01)
  rig.glow.position.set(lx, ly, -1)
  rig.glow.intensity = lOp * 4

  const flOp = fade(cur, [3.8, 4.6, 99, 99])
  rig.floor.visible = flOp > 0
  rig.floorMat.opacity = flOp
  rig.floor.position.y = -3.2 - (5 - cur) * 2.2

  camera.position.x = Math.sin(t * 0.12) * 0.25
  camera.lookAt(0, window.innerWidth <= 700 ? -1.5 : 0, -2) // phones: lift the scene above the bottom text card
}

type Props = {
  update: (timeSec: number) => number // from useScrollStage: returns the eased stage position
  onFrame: (cur: number) => void // the page updates its HUD readouts
  preview: boolean
  reducedMotion: boolean
}

export function DeepScene({ update, onFrame, preview, reducedMotion }: Props) {
  const scene = useThree((s) => s.scene)
  const rigRef = useRef<Rig | null>(null)

  useEffect(() => {
    const rig = buildRig()
    rigRef.current = rig
    scene.add(rig.root)
    scene.fog = rig.fog
    return () => {
      scene.remove(rig.root)
      scene.fog = null
      rig.dispose()
      rigRef.current = null
    }
  }, [scene])

  useFrame((state) => {
    const rig = rigRef.current
    const elapsed = state.clock.elapsedTime
    const cur = update(elapsed)
    if (rig) {
      const wide = window.innerWidth > 960 && !preview
      // reduced motion: freeze the ambient drift (fish orbit, blinking, sway); scrolling still moves the scene
      updateRig(rig, cur, reducedMotion ? 0 : elapsed, wide, state.gl, state.camera)
    }
    onFrame(cur)
  })

  return null
}
