import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import dotsVert from './shaders/dots.vert.glsl'
import dotsFrag from './shaders/dots.frag.glsl'
import { latLonToXYZ, pinHeight, tempHex, type City, type CityWeather } from '../../lib/weather'

const R = 1.4 // globe radius
const DOTS = 26000 // Fibonacci-sphere points, kept only where there is land
const UP = new THREE.Vector3(0, 1, 0)

type Props = {
  cities: City[]
  data: CityWeather[] | null
  selected: number
  onSelect: (i: number) => void
  onDrag: () => void // dragging clears the selection
  labels: RefObject<(HTMLDivElement | null)[]>
  landAlpha: Uint8ClampedArray | null
  panelOpen: boolean // shift the globe right to make room for the side panel (wide screens)
  labelsWithoutData: boolean
  reducedMotion: boolean
}

function build(cities: City[], landAlpha: Uint8ClampedArray | null) {
  const group = new THREE.Group()
  group.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 64, 48),
      new THREE.MeshStandardMaterial({ color: '#e9e3da', roughness: 1 }),
    ),
  )

  // dotted land
  const pts: number[] = []
  const rnd: number[] = []
  for (let i = 0; i < DOTS; i++) {
    const y = 1 - (2 * (i + 0.5)) / DOTS
    const rr = Math.sqrt(1 - y * y)
    const ph = i * 2.39996
    const x = Math.cos(ph) * rr
    const z = Math.sin(ph) * rr
    const lat = (Math.asin(y) * 180) / Math.PI
    const lon = (Math.atan2(x, z) * 180) / Math.PI
    const px = Math.min(1023, Math.floor(((lon + 180) / 360) * 1024))
    const py = Math.min(511, Math.floor(((90 - lat) / 180) * 512))
    const isLand = landAlpha ? landAlpha[(py * 1024 + px) * 4 + 3] > 100 : Math.random() < 0.3
    if (isLand) {
      pts.push(x * R, y * R, z * R)
      rnd.push(Math.random())
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
  geo.setAttribute('aRand', new THREE.BufferAttribute(new Float32Array(rnd), 1))
  const dotMat = new THREE.ShaderMaterial({
    vertexShader: dotsVert,
    fragmentShader: dotsFrag,
    uniforms: { uPR: { value: 1 }, uSize: { value: 24 } },
  })
  const dots = new THREE.Points(geo, dotMat)
  dots.frustumCulled = false
  group.add(dots)

  // city pins: a stem whose height shows the temperature, plus a round head
  const cylG = new THREE.CylinderGeometry(0.012, 0.012, 1, 8)
  cylG.translate(0, 0.5, 0)
  const headG = new THREE.SphereGeometry(0.035, 16, 12)
  const markers = cities.map((c) => {
    const mat = new THREE.MeshStandardMaterial({ color: '#c9c3ba', roughness: 0.5 })
    const g = new THREE.Group()
    const n = new THREE.Vector3(...latLonToXYZ(c.lat, c.lon, 1))
    g.position.copy(n.clone().multiplyScalar(R))
    g.quaternion.setFromUnitVectors(UP, n)
    const stem = new THREE.Mesh(cylG, mat)
    const head = new THREE.Mesh(headG, mat)
    g.add(stem, head)
    group.add(g)
    return { stem, head, mat, h: 0.1, cur: 0 }
  })

  const dispose = () => {
    group.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
        o.geometry.dispose()
        ;(o.material as THREE.Material).dispose()
      }
    })
  }
  return { group, dotMat, markers, dispose }
}

export function WeatherGlobe(p: Props) {
  const { cities, data, selected, onSelect, onDrag, labels, landAlpha, panelOpen, labelsWithoutData, reducedMotion } = p
  const gl = useThree((s) => s.gl)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera

  const built = useMemo(() => build(cities, landAlpha), [cities, landAlpha])
  useEffect(() => () => built.dispose(), [built])

  // pin height + colour follow the temperature
  useEffect(() => {
    built.markers.forEach((m, i) => {
      const t = data?.[i]?.temp ?? 10
      m.h = pinHeight(t)
      m.mat.color.set(data ? tempHex(t) : '#c9c3ba')
    })
  }, [data, built])

  const st = useRef({ yaw: 0, pitch: 0.35, vy: 0, drag: false, lx: 0, ly: 0, moved: 0, idle: 0 })
  const selRef = useRef(selected)
  useEffect(() => {
    selRef.current = selected
  }, [selected])
  const reducedRef = useRef(reducedMotion)
  useEffect(() => {
    reducedRef.current = reducedMotion
  }, [reducedMotion])

  // drag to spin (with inertia) + tap a pin head to select it
  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'none'
    el.style.cursor = 'grab'
    const s = st.current
    const ray = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const wv = new THREE.Vector3()
    const down = (e: PointerEvent) => {
      s.drag = true
      s.moved = 0
      s.lx = e.clientX
      s.ly = e.clientY
      el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!s.drag) return
      const dx = e.clientX - s.lx
      const dy = e.clientY - s.ly
      s.moved += Math.abs(dx) + Math.abs(dy)
      s.yaw += dx * 0.006
      s.vy = dx * 0.006
      s.pitch = Math.max(-1.2, Math.min(1.2, s.pitch + dy * 0.005))
      s.lx = e.clientX
      s.ly = e.clientY
      s.idle = performance.now()
      if (selRef.current >= 0 && s.moved > 6) onDrag()
    }
    const up = (e: PointerEvent) => {
      s.drag = false
      if (s.moved > 6) return
      ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
      ray.setFromCamera(ndc, camera)
      const camDir = camera.position.clone().normalize()
      const hits = ray.intersectObjects(built.markers.map((m) => m.head), false)
      // ignore pins on the far side of the globe
      const hit = hits.find((h) => {
        h.object.getWorldPosition(wv)
        return wv.sub(built.group.position).normalize().dot(camDir) > 0.25
      })
      if (hit) onSelect(built.markers.findIndex((m) => m.head === hit.object))
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
    }
  }, [gl, camera, built, onSelect, onDrag])

  const wv = useMemo(() => new THREE.Vector3(), [])
  const cd = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const s = st.current
    const now = performance.now()
    const dt = Math.min(0.05, delta)
    const reduced = reducedRef.current
    const g = built.group

    if (selected >= 0) {
      // fly the globe so the chosen city faces the camera
      const c = cities[selected]
      let ty = (-c.lon * Math.PI) / 180
      while (ty - s.yaw > Math.PI) ty -= Math.PI * 2
      while (s.yaw - ty > Math.PI) ty += Math.PI * 2
      const ease = reduced ? 1 : 0.06
      s.yaw += (ty - s.yaw) * ease
      s.pitch += ((c.lat * Math.PI) / 180 - s.pitch) * ease
    } else if (!s.drag) {
      s.vy = reduced ? 0 : s.vy * 0.95
      s.yaw += s.vy
      if (!reduced && now - s.idle > 2000) s.yaw += dt * 0.12 // slow auto-rotate when idle
    }
    g.rotation.set(s.pitch, s.yaw, 0)

    const w = window.innerWidth
    const h = window.innerHeight
    g.position.x += ((w > 900 && panelOpen ? 0.45 : 0) - g.position.x) * 0.08
    camera.position.set(0, 0, w < 600 ? 6.8 : 5.2)
    camera.lookAt(0, 0, 0)
    built.dotMat.uniforms.uPR.value = state.gl.getPixelRatio()

    built.markers.forEach((m) => {
      m.cur += (m.h - m.cur) * 0.08
      m.stem.scale.y = m.cur
      m.head.position.y = m.cur
    })

    // HTML labels follow their pin and hide when it faces away
    state.scene.updateMatrixWorld()
    cd.copy(camera.position).normalize()
    built.markers.forEach((m, i) => {
      const lab = labels.current?.[i]
      if (!lab) return
      m.head.getWorldPosition(wv)
      const facing = wv.clone().sub(g.position).normalize().dot(cd)
      wv.project(camera)
      const x = (wv.x * 0.5 + 0.5) * w
      const y = (-wv.y * 0.5 + 0.5) * h
      lab.style.transform = `translate(${x}px, ${y}px) translate(-50%, -140%)`
      lab.style.opacity = facing > 0.25 && (data || labelsWithoutData) ? (i === selected ? '1' : '0.92') : '0'
    })
  })

  return (
    <>
      <hemisphereLight args={['#ffffff', '#d9cfc4', 1.3]} />
      <directionalLight args={['#ffffff', 1.4]} position={[-3, 4, 5]} />
      <primitive object={built.group} />
    </>
  )
}
