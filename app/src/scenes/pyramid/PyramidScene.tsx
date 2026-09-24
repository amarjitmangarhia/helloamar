import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { BASE_SIZE, BOX_H, BOX_W, HEIGHT, buildCells } from './cells'

const SHADES = ['#e3cfb4', '#dcc5a6', '#e8d7bf', '#d6bd9a']
const SAND = '#f4ece0'

type Props = {
  progress: { current: number } // 0..1, owned by the page
  playing: boolean
  preview: boolean // ?preview=1: faster loop
  showUI: boolean
  reducedMotion: boolean
  onTick: (progress: number) => void // called every frame (page updates its counters)
  onComplete: () => void
}

export function PyramidScene({ progress, playing, preview, showUI, reducedMotion, onTick, onComplete }: Props) {
  const gl = useThree((s) => s.gl)
  const mesh = useRef<THREE.InstancedMesh>(null)
  const cells = useMemo(buildCells, [])

  // place + colour every box once; the build animation only changes mesh.count
  useEffect(() => {
    const m = mesh.current
    if (!m) return
    const m4 = new THREE.Matrix4()
    const c = new THREE.Color()
    cells.forEach((p, i) => {
      m4.makeTranslation(p[0], p[1], p[2])
      m.setMatrixAt(i, m4)
      c.set(i === cells.length - 1 ? '#f3d37c' : SHADES[(i * 7 + p[3]) % 4]) // gold capstone
      m.setColorAt(i, c)
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    m.count = Math.floor(progress.current * cells.length)
  }, [cells, progress])

  // orbit drag (1 pointer), pinch zoom (2 pointers), wheel zoom (20..120); auto-rotate after 2.5 s idle
  const cam = useRef({ yaw: 0.7, pitch: 0.32, dist: 62, drag: false, lx: 0, ly: 0, idle: 0 })
  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'none'
    el.style.cursor = 'grab'
    const c = cam.current
    const ptrs = new Map<number, { x: number; y: number }>()
    let pinch = 0
    const pinchDist = () => {
      const [a, b] = [...ptrs.values()]
      return Math.hypot(a.x - b.x, a.y - b.y)
    }
    const zoom = (k: number) => (c.dist = Math.min(120, Math.max(20, c.dist * k)))
    const down = (e: PointerEvent) => {
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (ptrs.size === 1) {
        c.drag = true
        c.lx = e.clientX
        c.ly = e.clientY
        el.style.cursor = 'grabbing'
      } else if (ptrs.size === 2) {
        c.drag = false
        pinch = pinchDist()
      }
      el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (ptrs.size === 2) {
        const d = pinchDist()
        if (pinch > 0 && d > 0) zoom(pinch / d) // fingers apart = zoom in
        pinch = d
        c.idle = performance.now()
        return
      }
      if (!c.drag) return
      c.yaw -= (e.clientX - c.lx) * 0.006
      c.pitch = Math.min(1.3, Math.max(0.08, c.pitch + (e.clientY - c.ly) * 0.004))
      c.lx = e.clientX
      c.ly = e.clientY
      c.idle = performance.now()
    }
    const up = (e: PointerEvent) => {
      ptrs.delete(e.pointerId)
      pinch = 0
      if (ptrs.size === 1) {
        // one finger left after a pinch: carry on orbiting from where it is
        const p = [...ptrs.values()][0]
        c.drag = true
        c.lx = p.x
        c.ly = p.y
      } else {
        c.drag = false
        el.style.cursor = 'grab'
      }
    }
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      zoom(1 + e.deltaY * 0.001)
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel)
    }
  }, [gl])

  useFrame(({ camera }, delta) => {
    const dt = Math.min(0.05, delta)
    const now = performance.now()
    const c = cam.current
    const cm = camera as THREE.PerspectiveCamera

    if (playing) {
      progress.current = Math.min(1, progress.current + dt / (preview ? 6 : 12))
      if (progress.current >= 1) {
        if (preview) progress.current = 0
        else onComplete()
      }
    }
    if (mesh.current) mesh.current.count = Math.floor(progress.current * cells.length)

    if (!c.drag && now - c.idle > 2500 && !reducedMotion) c.yaw += dt * 0.08
    const w = window.innerWidth
    const h = window.innerHeight
    const d = c.dist * (w < 700 ? 1.5 : 1)
    cm.position.set(
      Math.sin(c.yaw) * Math.cos(c.pitch) * d,
      Math.sin(c.pitch) * d + 4,
      Math.cos(c.yaw) * Math.cos(c.pitch) * d,
    )
    cm.lookAt(0, 5, 0)
    // on wide screens with the side panels, nudge the pyramid right of the left panel
    if (w > 960 && showUI) cm.setViewOffset(w, h, -w * 0.1, 0, w, h)
    else cm.clearViewOffset()

    onTick(progress.current)
  })

  return (
    <>
      <fog attach="fog" args={[SAND, 60, 160]} />
      <hemisphereLight args={['#fff8ec', '#d9c29a', 1.1]} />
      <directionalLight
        args={['#fff1d8', 2.4]}
        position={[30, 45, 20]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-bias={-0.0005}
      />

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[200, 64]} />
        <meshStandardMaterial color="#e6d3ae" roughness={1} />
      </mesh>

      <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]} castShadow receiveShadow frustumCulled={false}>
        <boxGeometry args={[BOX_W * 0.96, BOX_H * 0.96, BOX_W * 0.96]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>

      {/* wireframe ghost of the finished shape */}
      <mesh position-y={(HEIGHT + BOX_H) / 2} rotation-y={Math.PI / 4}>
        <coneGeometry args={[BASE_SIZE / Math.SQRT2, HEIGHT + BOX_H, 4, 1, true]} />
        <meshBasicMaterial color="#c4553d" wireframe transparent opacity={0.18} />
      </mesh>

      {/* a 1.8 m person, for scale */}
      <mesh position={[14, 0.09, 6]} castShadow>
        <boxGeometry args={[0.05, 0.18, 0.05]} />
        <meshStandardMaterial color="#c4553d" />
      </mesh>
    </>
  )
}
