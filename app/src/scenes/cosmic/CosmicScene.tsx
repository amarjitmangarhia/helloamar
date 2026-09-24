import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import pointsVert from './shaders/points.vert.glsl'
import pointsFrag from './shaders/points.frag.glsl'
import { makeEarthTexture } from './earthTexture'
import { fade } from '../../lib/story'
import {
  ALPHA_CEN, ANDROMEDA, AU_KM, EARTH, GALAXY_CENTRE, LABELS, LOCAL_GROUP, LY, MOON, NEPTUNE_AU, PLANETS,
  planetPos, viewHeightKm, zoomState, type Range4, type Vec3,
} from '../../lib/cosmic'

const R = Math.random
const gauss = () => (R() + R() + R() - 1.5) / 1.5

type Pt = [x: number, y: number, z: number, color: string, size?: number]
type Cloud = THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>
type Fadeable = { m: THREE.Material; base: number }
// One real-world object: real position + real size in km, drawn at (pos - target)/D and size/D, faded in/out over `range`
type Obj = { obj: THREE.Object3D; pos: Vec3; scale: number; range: Range4; mats: Fadeable[] }

const fadeable = (m: THREE.Material): Fadeable => ({ m, base: m instanceof THREE.ShaderMaterial ? 1 : m.opacity })

function cloud(n: number, fn: (i: number) => Pt, size: number): Cloud {
  const p = new Float32Array(n * 3)
  const c = new Float32Array(n * 3)
  const s = new Float32Array(n)
  const col = new THREE.Color()
  for (let i = 0; i < n; i++) {
    const o = fn(i)
    p[i * 3] = o[0]
    p[i * 3 + 1] = o[1]
    p[i * 3 + 2] = o[2]
    col.set(o[3])
    c.set([col.r, col.g, col.b], i * 3)
    s[i] = o[4] ?? 1
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(p, 3))
  g.setAttribute('aCol', new THREE.BufferAttribute(c, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(s, 1))
  const m = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uOp: { value: 1 }, uSize: { value: size }, uPR: { value: 1 } },
    vertexShader: pointsVert,
    fragmentShader: pointsFrag,
  })
  const pts = new THREE.Points(g, m)
  pts.frustumCulled = false
  return pts
}

function ring(r: number, color: string, op: number) {
  const pts: THREE.Vector3[] = []
  for (let k = 0; k <= 200; k++) {
    const a = (k / 200) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r))
  }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity: op }))
}

// spiral galaxy: bright core + logarithmic arms
const spiral = (n: number, arms: number, tint: string) =>
  cloud(
    n,
    () => {
      if (R() < 0.22) {
        const r = Math.pow(R(), 1.5) * 0.18
        const a = R() * 6.283
        return [Math.cos(a) * r, gauss() * 0.05, Math.sin(a) * r, R() < 0.5 ? '#f3d37c' : '#f7e6c4', 1.2]
      }
      const arm = Math.floor(R() * arms)
      const r = 0.12 + Math.pow(R(), 0.8) * 0.88
      const a = (arm * 6.283) / arms + r * 4.2 + gauss() * (0.32 * (1 - r) + 0.14)
      const c = R() < 0.07 ? '#f19a82' : R() < 0.5 ? tint : '#d9e6ff'
      return [Math.cos(a) * r, gauss() * 0.025, Math.sin(a) * r, c, 0.7 + R() * 0.6]
    },
    2.2,
  )

function buildRig() {
  const root = new THREE.Group()
  const lights = new THREE.Group()
  lights.add(new THREE.AmbientLight('#ffffff', 0.12))
  const sunLight = new THREE.DirectionalLight('#fff4e6', 2.4)
  sunLight.position.set(-6, 1, 2)
  lights.add(sunLight)

  const objs: Obj[] = []
  const add = (obj: THREE.Object3D, pos: Vec3, scale: number, range: Range4, mats: THREE.Material[]) => {
    root.add(obj)
    objs.push({ obj, pos, scale, range, mats: mats.map(fadeable) })
  }

  // Earth (procedural texture) + atmosphere shell
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), new THREE.MeshStandardMaterial({ map: makeEarthTexture(), roughness: 0.9, transparent: true }))
  earth.rotation.z = 0.41
  add(earth, EARTH, 6371, [-1, -1, 3, 3.6], [earth.material])
  const atm = new THREE.Mesh(new THREE.SphereGeometry(1.03, 48, 32), new THREE.MeshBasicMaterial({ color: '#8fc0ff', transparent: true, opacity: 0.12, side: THREE.BackSide }))
  add(atm, EARTH, 6371, [-1, -1, 1.2, 2], [atm.material])

  // Moon + its orbit ring
  const moon = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), new THREE.MeshStandardMaterial({ color: '#b9b4ad', roughness: 1, transparent: true }))
  add(moon, MOON, 1737, [-1, -1, 2.6, 3.2], [moon.material])
  const moonOrbit = ring(1, '#ecebe6', 0.18)
  add(moonOrbit, EARTH, 384400, [0.2, 0.7, 2.2, 2.8], [moonOrbit.material])

  // Sun
  const sun = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), new THREE.MeshBasicMaterial({ color: '#ffd08a', transparent: true }))
  add(sun, [0, 0, 0], 696340, [1, 1.6, 4, 4.6], [sun.material])

  // solar system: 8 orbit rings + planet dots (last dot = the Sun)
  const sys = new THREE.Group()
  const S = NEPTUNE_AU * AU_KM
  const rings = PLANETS.map((p) => ring(p.au / NEPTUNE_AU, '#ecebe6', 0.14))
  rings.forEach((r) => sys.add(r))
  const dots = cloud(
    9,
    (i) => {
      if (i === 8) return [0, 0, 0, '#ffd08a', 2.2]
      const pp = planetPos(i)
      return [pp[0] / S, pp[1] / S, pp[2] / S, PLANETS[i].color, 1]
    },
    7,
  )
  sys.add(dots)
  add(sys, [0, 0, 0], S, [1.4, 2.1, 4, 4.7], [...rings.map((r) => r.material), dots.material])

  // 420 nearby stars (index 0 = Sun, 1 = Alpha Centauri)
  const stars = cloud(
    420,
    (i) => {
      if (i === 0) return [0, 0, 0, '#ffd08a', 2.6]
      if (i === 1) return [ALPHA_CEN[0] / (20 * LY), ALPHA_CEN[1] / (20 * LY), ALPHA_CEN[2] / (20 * LY), '#fff1d6', 2.4]
      const v = new THREE.Vector3().randomDirection().multiplyScalar(Math.cbrt(R()) * (i < 60 ? 1 : 1.8))
      return [v.x, v.y, v.z, ['#ffffff', '#ffd9b0', '#f19a82', '#cfe0ff'][Math.floor(R() * 4)], 0.6 + R() * 1.1]
    },
    6,
  )
  add(stars, [0, 0, 0], 20 * LY, [3.1, 3.8, 5.1, 5.8], [stars.material])

  // Milky Way (38k, 4 arms), Andromeda (26k, 2 arms, tilted), 90 dwarf galaxies
  const mw = spiral(38000, 4, '#9fd8e0')
  mw.rotation.y = 1.2
  add(mw, GALAXY_CENTRE, 5e4 * LY, [4.1, 4.8, 6.6, 7.3], [mw.material])
  const and = spiral(26000, 2, '#b5a3ea')
  and.rotation.set(1.1, 0, 0.4)
  add(and, ANDROMEDA, 1.1e5 * LY, [5.1, 5.8, 6.7, 7.3], [and.material])
  const dw = cloud(
    90,
    () => {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(Math.cbrt(R()))
      return [v.x, v.y * 0.6, v.z, R() < 0.5 ? '#d9e6ff' : '#f7e6c4', 0.8 + R() * 1.2]
    },
    5,
  )
  add(dw, LOCAL_GROUP, 5e6 * LY, [5.1, 5.8, 6.7, 7.3], [dw.material])

  // cosmic web: 160 nodes joined to their nearest neighbours, 50k points along the filaments
  const nodes: THREE.Vector3[] = []
  for (let i = 0; i < 160; i++) nodes.push(new THREE.Vector3().randomDirection().multiplyScalar(Math.cbrt(R())))
  const edges: [THREE.Vector3, THREE.Vector3][] = []
  nodes.forEach((a, i) => {
    nodes
      .map((b, j): [number, number] => [a.distanceTo(b), j])
      .sort((x, y) => x[0] - y[0])
      .slice(1, 4)
      .forEach(([d, j]) => {
        if (j > i && d < 0.45) edges.push([a, nodes[j]])
      })
  })
  const web = cloud(
    50000,
    () => {
      const cols = ['#b5a3ea', '#9fd8e0', '#f19a82', '#d9e6ff']
      const c = cols[Math.floor(R() * 4)]
      if (R() < 0.3) {
        const n = nodes[Math.floor(R() * nodes.length)]
        const s = 0.03 * Math.pow(R(), 2)
        return [n.x + gauss() * s, n.y + gauss() * s, n.z + gauss() * s, c, 1.2]
      }
      const [a, b] = edges[Math.floor(R() * edges.length)]
      const t = R()
      const s = 0.012
      return [a.x + (b.x - a.x) * t + gauss() * s, a.y + (b.y - a.y) * t + gauss() * s, a.z + (b.z - a.z) * t + gauss() * s, c, 0.8]
    },
    2.2,
  )
  add(web, LOCAL_GROUP, 4.4e23, [6.2, 6.9, 99, 99], [web.material])

  const dispose = () => {
    root.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.Line) {
        o.geometry.dispose()
        const mat = o.material as THREE.Material & { map?: THREE.Texture | null }
        mat.map?.dispose()
        mat.dispose()
      }
    })
  }
  return { root, lights, objs, earth, mw, dispose, v3: new THREE.Vector3() }
}
type Rig = ReturnType<typeof buildRig>

type Props = {
  update: (timeSec: number) => number // from useScrollStage
  onFrame: (viewHeightKm: number) => void // HUD: height of view + light-crossing time
  labels: RefObject<(HTMLDivElement | null)[]> // one per LABELS entry, positioned every frame
  preview: boolean
  reducedMotion: boolean
}

export function CosmicScene({ update, onFrame, labels, preview, reducedMotion }: Props) {
  const scene = useThree((s) => s.scene)
  const rigRef = useRef<Rig | null>(null)

  useEffect(() => {
    const rig = buildRig()
    rigRef.current = rig
    scene.add(rig.root, rig.lights)
    return () => {
      scene.remove(rig.root, rig.lights)
      rig.dispose()
      rigRef.current = null
    }
  }, [scene])

  useFrame((state) => {
    const rig = rigRef.current
    const elapsed = state.clock.elapsedTime
    const cur = update(elapsed)
    if (!rig) return
    const cam = state.camera as THREE.PerspectiveCamera
    const t = reducedMotion ? 0 : elapsed // reduced motion: no Earth spin, no galaxy rotation, no slow yaw
    const pr = state.gl.getPixelRatio()

    const { D, target } = zoomState(cur)
    rig.objs.forEach((o) => {
      const op = fade(cur, o.range)
      o.obj.visible = op > 0.001
      if (!o.obj.visible) return
      o.mats.forEach(({ m, base }) => {
        if (m instanceof THREE.ShaderMaterial) {
          m.uniforms.uOp.value = op
          m.uniforms.uPR.value = pr
        } else m.opacity = op * base
      })
      o.obj.position.set((o.pos[0] - target[0]) / D, (o.pos[1] - target[1]) / D, (o.pos[2] - target[2]) / D)
      o.obj.scale.setScalar(o.scale / D)
    })
    rig.earth.rotation.y = t * 0.05
    rig.mw.rotation.y = 1.2 + t * 0.01

    // wide screens: push the whole scene right so it sits beside the text card
    const w = window.innerWidth
    const h = window.innerHeight
    const wide = w > 960 && !preview
    rig.root.position.x += ((wide ? 1.7 : 0) - rig.root.position.x) * (reducedMotion ? 1 : 0.08)
    const yaw = 0.25 + cur * 0.35 + t * 0.015
    const pitch = 0.12 + Math.min(cur, 5) * 0.09
    const cd = w < 700 ? 8.5 : 6
    cam.position.set(Math.sin(yaw) * Math.cos(pitch) * cd + rig.root.position.x, Math.sin(pitch) * cd, Math.cos(yaw) * Math.cos(pitch) * cd)
    cam.lookAt(rig.root.position.x, w <= 700 && !preview ? -1.2 : 0, 0) // phones: lift the scene above the bottom text card
    cam.updateMatrixWorld()

    // HTML labels follow their objects and fade on their own ranges
    LABELS.forEach((l, i) => {
      const el = labels.current?.[i]
      if (!el) return
      rig.v3.set((l.pos[0] - target[0]) / D + rig.root.position.x, (l.pos[1] - target[1]) / D, (l.pos[2] - target[2]) / D).project(cam)
      el.style.transform = `translate(${(rig.v3.x * 0.5 + 0.5) * w + 6}px, ${(-rig.v3.y * 0.5 + 0.5) * h - 8}px)`
      el.style.opacity = preview ? '0' : String(fade(cur, l.range))
    })

    onFrame(viewHeightKm(D, cd))
  })

  return null
}
