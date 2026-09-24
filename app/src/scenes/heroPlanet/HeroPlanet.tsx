import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Hero planet: a Fibonacci-sphere body + a flat ring, drawn as glossy "bead" points.
 * Contained in its own square box (not full-screen). Ported 1:1 from Portfolio v2.dc.html.
 */
export const DENSITY = { low: 3000, medium: 5000, high: 8000 } as const
export type Density = keyof typeof DENSITY

export function HeroPlanet({ density = 'medium' }: { density?: Density }) {
  return (
    <div aria-hidden="true" className="relative aspect-square w-full max-w-[520px] justify-self-center">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ fov: 32, near: 0.1, far: 50, position: [0, 0, 8.4] }}>
        <Planet count={DENSITY[density]} />
      </Canvas>
    </div>
  )
}

const vertex = /* glsl */ `
  attribute float aRand;
  uniform float uT; uniform float uIntro; uniform float uPR; uniform float uSize;
  uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
  varying vec3 vCol;
  void main(){
    vec3 p = position;
    p += .02*vec3(sin(uT*.6 + p.y*3. + aRand*6.28), cos(uT*.5 + p.x*3.), sin(uT*.55 + p.z*3.));   // idle wobble
    vec3 scat = normalize(p + .001)*(3.5 + aRand*3.);                                              // intro start shell
    float e = 1. - pow(1. - clamp(uIntro*1.4 - aRand*.4, 0., 1.), 3.);                             // staggered ease-out
    p = mix(scat, p, e);
    vec4 mv = modelViewMatrix*vec4(p, 1.);
    gl_Position = projectionMatrix*mv;
    bool spk = fract(aRand*57.3) < .09;                                                            // 9% orange sparkles
    gl_PointSize = uSize*(spk ? 1.5 : mix(.65, 1.15, fract(aRand*13.7)))*uPR/(-mv.z);
    vCol = spk ? uC : mix(uA, uB, smoothstep(-1.4, 1.4, position.y + position.x*.5 + sin(aRand*6.28)*.5));
  }
`

const fragment = /* glsl */ `
  varying vec3 vCol;
  void main(){
    vec2 c = gl_PointCoord*2. - 1.; float r2 = dot(c, c); if (r2 > 1.) discard;
    vec3 n = vec3(c.x, -c.y, sqrt(1. - r2)); vec3 L = normalize(vec3(-.5, .7, .6));
    float diff = max(dot(n, L), 0.);
    float spec = pow(max(dot(reflect(-L, n), vec3(0., 0., 1.)), 0.), 28.);
    gl_FragColor = vec4(vCol*(.62 + .5*diff) + spec*.3, 1.);
  }
`

function buildPlanet(N: number) {
  const R = Math.random
  const TAU = Math.PI * 2
  const gauss = () => (R() + R() + R() - 1.5) / 1.5
  const NP = Math.floor(N * 0.58) // 58% body, 42% ring
  const pos = new Float32Array(N * 3)
  const rnd = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    let x: number, y: number, z: number
    if (i < NP) {
      const yy = 1 - (2 * (i + 0.5)) / NP
      const r = Math.sqrt(1 - yy * yy)
      const ph = i * 2.39996
      x = Math.cos(ph) * r
      y = yy
      z = Math.sin(ph) * r
    } else {
      const rr = 1.45 + Math.pow(R(), 1.3) * 0.85
      const a = R() * TAU
      x = Math.cos(a) * rr
      y = gauss() * 0.015
      z = Math.sin(a) * rr
    }
    pos.set([x, y, z], i * 3)
    rnd[i] = R()
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1))
  return g
}

function Planet({ count }: { count: number }) {
  const reduced = usePrefersReducedMotion()
  const { gl, size } = useThree()
  const tilt = useRef<THREE.Group>(null!)
  const spin = useRef<THREE.Points>(null!)
  const mouse = useRef({ x: 0, y: 0 })

  const geometry = useMemo(() => buildPlanet(count), [count])
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false, // transparent point clouds need this off or they render broken/glitchy
        uniforms: {
          uT: { value: 0 }, uIntro: { value: 0 }, uPR: { value: 1 }, uSize: { value: 30 },
          uA: { value: new THREE.Color('#6cc3cf') }, // seafoam
          uB: { value: new THREE.Color('#f19a82') }, // coral
          uC: { value: new THREE.Color('#e8702a') }, // brand orange (sparkles)
        },
      }),
    [],
  )
  useEffect(() => () => { geometry.dispose(); material.dispose() }, [geometry, material])

  // Tilt follows the cursor anywhere on the page (window-normalised -.5...5)
  useEffect(() => {
    const on = (e: PointerEvent) => { mouse.current.x = e.clientX / window.innerWidth - 0.5; mouse.current.y = e.clientY / window.innerHeight - 0.5 }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const u = material.uniforms
    u.uT.value = reduced ? 0 : t
    u.uIntro.value = reduced ? 1 : Math.min(1, t / 2.2)
    u.uPR.value = gl.getPixelRatio()
    u.uSize.value = 30 * Math.max(0.75, size.width / 520)
    spin.current.rotation.y = reduced ? 0 : t * 0.12
    const g = tilt.current
    const k = reduced ? 1 : 0.05
    g.rotation.y += (mouse.current.x * 0.5 - g.rotation.y) * k
    g.rotation.x += (mouse.current.y * 0.35 - g.rotation.x) * k
  })

  return (
    <group ref={tilt}>
      {/* fixed axial tilt of planet + ring */}
      <group rotation={[0.42, 0, 0.32]}>
        <points ref={spin} geometry={geometry} material={material} frustumCulled={false} />
      </group>
    </group>
  )
}
