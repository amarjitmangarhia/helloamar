// Generates the 4 target shapes (Planet, Galaxy, Helix, Signal) as flat xyz arrays.
const rotX = (x: number, y: number, z: number, a: number): [number, number, number] => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)]
const rotZ = (x: number, y: number, z: number, a: number): [number, number, number] => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z]

export function genShapes(N: number): Float32Array[] {
  const R = Math.random
  const TAU = Math.PI * 2
  const S = [0, 1, 2, 3].map(() => new Float32Array(N * 3))

  for (let i = 0; i < N; i++) {
    const k = i * 3

    // 0 Planet: 60% Fibonacci sphere r=1, 40% a tilted ring r 1.45..2.3
    if (R() < 0.6) {
      const y = 1 - (2 * (i + 0.5)) / N
      const r = Math.sqrt(1 - y * y)
      const ph = i * 2.39996
      S[0][k] = Math.cos(ph) * r
      S[0][k + 1] = y * r
      S[0][k + 2] = Math.sin(ph) * r
    } else {
      const a = R() * TAU
      const rr = 1.45 + R() * 0.85
      let [x, y, z] = [rr * Math.cos(a), 0, rr * Math.sin(a)]
      ;[x, y, z] = rotX(x, y, z, 0.42)
      ;[x, y, z] = rotZ(x, y, z, 0.32)
      S[0][k] = x
      S[0][k + 1] = y
      S[0][k + 2] = z
    }

    // 1 Galaxy: 20% core (r<=.45) + 3 log-spiral arms (r .25..2.15), tilted rotX .9
    if (R() < 0.2) {
      const r = Math.pow(R(), 1.5) * 0.45
      const a = R() * TAU
      const [x, y, z] = rotX(Math.cos(a) * r, (R() - 0.5) * 0.12, Math.sin(a) * r, 0.9)
      S[1][k] = x
      S[1][k + 1] = y
      S[1][k + 2] = z
    } else {
      const arm = Math.floor(R() * 3)
      const r = 0.25 + Math.pow(R(), 0.85) * 1.9
      const a = arm * ((2 * Math.PI) / 3) + r * 1.9
      const jitter = (R() - 0.5) * 0.28 * (1 - r / 2.15)
      const [x, y, z] = rotX(Math.cos(a) * r, jitter, Math.sin(a) * r, 0.9)
      S[1][k] = x
      S[1][k + 1] = y
      S[1][k + 2] = z
    }

    // 2 Helix: double helix, r .7, height +-1.7, ~18 rungs
    let hx: number, hy: number, hz: number
    if (R() < 0.72) {
      hy = (R() * 2 - 1) * 1.7
      const a = hy * 2.6 + (i % 2) * Math.PI
      hx = 0.7 * Math.cos(a) + (R() - 0.5) * 0.08
      hz = 0.7 * Math.sin(a) + (R() - 0.5) * 0.08
    } else {
      const j = Math.floor(R() * 18)
      hy = -1.7 + j * (3.4 / 17)
      const a = hy * 2.6
      const s = R() * 2 - 1
      hx = 0.7 * Math.cos(a) * s
      hz = 0.7 * Math.sin(a) * s
    }
    S[2][k] = hx
    S[2][k + 1] = hy
    S[2][k + 2] = hz

    // 3 Signal: 6 concentric rings (r .3..1.8) + a core cluster, tilted rotX 1.15
    // (the outward ripple pulse is applied live in the vertex shader, weighted by this shape's blend)
    if (R() < 0.85) {
      const band = Math.floor(R() * 6)
      const r = 0.3 + band * ((1.8 - 0.3) / 5) + (R() - 0.5) * 0.05
      const a = R() * TAU
      const [x, y, z] = rotX(Math.cos(a) * r, (R() - 0.5) * 0.05, Math.sin(a) * r, 1.15)
      S[3][k] = x
      S[3][k + 1] = y
      S[3][k + 2] = z
    } else {
      const r = Math.pow(R(), 1.5) * 0.22
      const a = R() * TAU
      const [x, y, z] = rotX(Math.cos(a) * r, (R() - 0.5) * 0.1, Math.sin(a) * r, 1.15)
      S[3][k] = x
      S[3][k + 1] = y
      S[3][k + 2] = z
    }
  }
  return S
}
