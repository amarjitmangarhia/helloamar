// Generates the 5 target shapes (sphere, torus, helix, lattice, field) as flat xyz arrays.
export function genShapes(N: number): Float32Array[] {
  const R = Math.random
  const TAU = Math.PI * 2
  const S = [0, 1, 2, 3, 4].map(() => new Float32Array(N * 3))
  const rotX = (y: number, z: number, a: number): [number, number] => [
    y * Math.cos(a) - z * Math.sin(a),
    y * Math.sin(a) + z * Math.cos(a),
  ]
  const g = 7
  const sp = 1.9 / (g - 1)
  for (let i = 0; i < N; i++) {
    const k = i * 3
    // sphere
    const y = 1 - (2 * (i + 0.5)) / N
    const r = Math.sqrt(1 - y * y)
    const ph = i * 2.39996
    const rad = 1.22 + R() * 0.04
    S[0][k] = Math.cos(ph) * r * rad
    S[0][k + 1] = y * rad
    S[0][k + 2] = Math.sin(ph) * r * rad
    // torus
    const u = R() * TAU
    const v = R() * TAU
    const tr = 1.25 + 0.36 * Math.cos(v)
    const tx = tr * Math.cos(u)
    const [ty, tz] = rotX(tr * Math.sin(u), 0.36 * Math.sin(v), 1.15)
    S[1][k] = tx
    S[1][k + 1] = ty
    S[1][k + 2] = tz
    // helix
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
    // lattice
    const node = Math.floor(R() * g * g * g)
    const gx = node % g
    const gy = Math.floor(node / g) % g
    const gz = Math.floor(node / (g * g))
    const jr = 0.07 * Math.cbrt(R())
    const jt = R() * TAU
    const jp = Math.acos(2 * R() - 1)
    S[3][k] = -0.95 + gx * sp + jr * Math.sin(jp) * Math.cos(jt)
    S[3][k + 1] = -0.95 + gy * sp + jr * Math.cos(jp)
    S[3][k + 2] = -0.95 + gz * sp + jr * Math.sin(jp) * Math.sin(jt)
    // field
    const fx = (R() * 2 - 1) * 2.7
    const fz0 = (R() * 2 - 1) * 1.6
    const fy0 = 0.24 * Math.sin(fx * 2.2) * Math.cos(fz0 * 2.6)
    const [fy, fz] = rotX(fy0, fz0, 0.6)
    S[4][k] = fx
    S[4][k + 1] = fy
    S[4][k + 2] = fz
  }
  return S
}
