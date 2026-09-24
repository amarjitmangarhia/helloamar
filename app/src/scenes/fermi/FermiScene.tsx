import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import galVert from './shaders/gal.vert.glsl'
import civVert from './shaders/civ.vert.glsl'
import pointsFrag from './shaders/points.frag.glsl'
import { CIV_N, FERMI_STAGES, SUN, civilisationsShown, lerp } from '../../lib/fermi'
import { smoothstep } from '../../lib/story'

const R = Math.random
const gauss = () => (R() + R() + R() - 1.5) / 1.5
const GREEN = '#9dffc8'

type Pt = [x: number, y: number, z: number, color: string, rand: number]

function makePoints(root: THREE.Group, n: number, fn: (i: number) => Pt, vertexShader: string, extra: Record<string, THREE.IUniform>) {
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
    r[i] = o[4]
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(p, 3))
  g.setAttribute('aCol', new THREE.BufferAttribute(c, 3))
  g.setAttribute('aR', new THREE.BufferAttribute(r, 1))
  const m = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uPR: { value: 1 }, uT: { value: 0 }, ...extra },
    vertexShader,
    fragmentShader: pointsFrag,
  })
  const pts = new THREE.Points(g, m)
  pts.frustumCulled = false
  root.add(pts)
  return pts
}

function buildRig() {
  const root = new THREE.Group()

  // 40k-point galaxy: a golden core + 4 spiral arms
  const gal = makePoints(
    root,
    40000,
    () => {
      if (R() < 0.2) {
        const r = Math.pow(R(), 1.5) * 0.9
        const a = R() * 6.283
        return [Math.cos(a) * r, gauss() * 0.25, Math.sin(a) * r, R() < 0.5 ? '#f3d37c' : '#f7e6c4', R()]
      }
      const arm = Math.floor(R() * 4)
      const r = 0.6 + Math.pow(R(), 0.8) * 4.4
      const a = arm * 1.5708 + r * 0.85 + gauss() * (0.5 / (r * 0.4 + 0.5) + 0.12)
      return [Math.cos(a) * r, gauss() * 0.1, Math.sin(a) * r, R() < 0.06 ? '#f19a82' : R() < 0.5 ? '#9fb8d8' : '#d9e6ff', R()]
    },
    galVert,
    { uOp: { value: 1 } },
  )

  // 700 civilisation dots; index 0 is "Us" at the Sun's position
  const civ = makePoints(
    root,
    CIV_N,
    (i) => {
      if (i === 0) return [SUN[0], SUN[1], SUN[2], GREEN, 0]
      const arm = Math.floor(R() * 4)
      const r = 1 + Math.pow(R(), 0.8) * 3.8
      const a = arm * 1.5708 + r * 0.85 + gauss() * 0.35
      return [Math.cos(a) * r, gauss() * 0.06, Math.sin(a) * r, GREEN, 0.001 + R() * 0.999]
    },
    civVert,
    { uShow: { value: 0 }, uKeep: { value: 1 }, uDim: { value: 0 }, uUs: { value: 1 } },
  )

  // our radio bubble, drawn at true scale: 110 ly vs a 50,000 ly galaxy radius (the galaxy model is 5 units wide)
  const bubbleMat = new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0 })
  const bubble = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), bubbleMat)
  bubble.position.set(...SUN)
  bubble.scale.setScalar((5 * 110) / 50000)
  root.add(bubble)

  const dispose = () =>
    root.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
        o.geometry.dispose()
        ;(o.material as THREE.Material).dispose()
      }
    })

  return {
    root, gal, civ, bubbleMat, dispose,
    look: new THREE.Vector3(), // where the camera looks (eased)
    dist: 13, // camera distance (eased)
    sun: new THREE.Vector3(...SUN),
    centre: new THREE.Vector3(),
    tv: new THREE.Vector3(),
    v3: new THREE.Vector3(),
    off: new THREE.Vector3(),
  }
}
type Rig = ReturnType<typeof buildRig>

type Props = {
  update: (timeSec: number) => number // from useScrollStage
  onFrame: (civilisations: number) => void // HUD count
  labelRef: RefObject<HTMLDivElement | null> // HTML label that follows the Sun
  preview: boolean
  reducedMotion: boolean
}

export function FermiScene({ update, onFrame, labelRef, preview, reducedMotion }: Props) {
  const scene = useThree((s) => s.scene)
  const rigRef = useRef<Rig | null>(null)

  useEffect(() => {
    const rig = buildRig()
    rigRef.current = rig
    scene.add(rig.root)
    return () => {
      scene.remove(rig.root)
      rig.dispose()
      rigRef.current = null
    }
  }, [scene])

  useFrame((state) => {
    const rig = rigRef.current
    const elapsed = state.clock.elapsedTime
    const cur = update(elapsed)
    if (!rig) return
    const { camera, gl } = state
    const cam = camera as THREE.PerspectiveCamera
    const t = reducedMotion ? 0 : elapsed // reduced motion: no twinkle, no galaxy rotation, no camera drift

    // blend stage i0 -> i0+1
    const i0 = Math.min(5, Math.floor(cur))
    const fr = smoothstep(cur - i0)
    const a = FERMI_STAGES[i0]
    const b = FERMI_STAGES[i0 + 1]
    const cu = rig.civ.material.uniforms
    cu.uShow.value = lerp(a.show, b.show, fr) * 1.05
    cu.uKeep.value = lerp(a.keep, b.keep, fr)
    cu.uDim.value = lerp(a.dim, b.dim, fr)
    cu.uT.value = t
    cu.uPR.value = gl.getPixelRatio()
    rig.gal.material.uniforms.uT.value = t
    rig.gal.material.uniforms.uPR.value = gl.getPixelRatio()
    rig.bubbleMat.opacity = lerp(a.bub, b.bub, fr) * 0.5

    // camera target (centre or Sun) and distance, eased (log-space for the distance)
    const ta = a.tgt === 's' ? rig.sun : rig.centre
    const tb = b.tgt === 's' ? rig.sun : rig.centre
    rig.tv.copy(ta).lerp(tb, fr)
    const dTarget = Math.exp(lerp(Math.log(a.d), Math.log(b.d), fr))
    const k = reducedMotion ? 1 : 0.12
    rig.dist += (dTarget - rig.dist) * k
    rig.look.lerp(rig.tv, k)

    rig.root.rotation.y = t * 0.01
    rig.root.updateMatrixWorld()
    const yaw = 0.6 + t * 0.02
    const pitch = 0.75
    rig.off.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(rig.dist)
    const lw = rig.v3.copy(rig.look).applyMatrix4(rig.root.matrixWorld)
    cam.position.copy(lw).add(rig.off)
    cam.lookAt(lw)
    const w = window.innerWidth
    const h = window.innerHeight
    if (w > 960 && !preview) cam.setViewOffset(w, h, -w * 0.16, 0, w, h)
    else cam.clearViewOffset()
    cam.updateMatrixWorld()

    // label follows the Sun
    const lab = labelRef.current
    if (lab) {
      rig.v3.copy(rig.sun).applyMatrix4(rig.root.matrixWorld).project(cam)
      lab.style.transform = `translate(${(rig.v3.x * 0.5 + 0.5) * w + 10}px, ${(-rig.v3.y * 0.5 + 0.5) * h - 8}px)`
      lab.style.opacity = preview ? '0' : '1'
    }

    onFrame(civilisationsShown(cu.uShow.value, cu.uKeep.value))
  })

  return null
}
