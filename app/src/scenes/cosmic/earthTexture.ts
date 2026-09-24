import * as THREE from 'three'

// Procedural Earth: 5 octaves of 3D value noise sampled on a sphere -> ocean, land, sand, polar caps (512x256).
const hash = (x: number, y: number, z: number) => {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 2147483647)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296
}
const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = (p: number, q: number, t: number) => p + (q - p) * t
function valueNoise(x: number, y: number, z: number) {
  const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z)
  const a = smooth(x - X), b = smooth(y - Y), c = smooth(z - Z)
  return lerp(
    lerp(lerp(hash(X, Y, Z), hash(X + 1, Y, Z), a), lerp(hash(X, Y + 1, Z), hash(X + 1, Y + 1, Z), a), b),
    lerp(lerp(hash(X, Y, Z + 1), hash(X + 1, Y, Z + 1), a), lerp(hash(X, Y + 1, Z + 1), hash(X + 1, Y + 1, Z + 1), a), b),
    c,
  )
}

export function makeEarthTexture(): THREE.CanvasTexture {
  const W = 512, H = 256
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const ctx = cv.getContext('2d')!
  const img = ctx.createImageData(W, H)
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const lat = (y / H - 0.5) * Math.PI
      const lon = (x / W) * 6.283
      const px = Math.cos(lat) * Math.cos(lon) * 2.2
      const py = Math.sin(lat) * 2.2
      const pz = Math.cos(lat) * Math.sin(lon) * 2.2
      let e = 0, amp = 0.5, fr = 1
      for (let o = 0; o < 5; o++) {
        e += amp * valueNoise(px * fr + 9, py * fr + 3, pz * fr + 5)
        amp *= 0.5
        fr *= 2
      }
      const pole = Math.abs(lat) > 1.25
      const land = e > 0.52
      const c = pole ? [236, 240, 244] : land ? (e > 0.62 ? [196, 178, 140] : [110, 160, 105]) : [52, 96, 170]
      img.data.set([c[0], c[1], c[2], 255], (y * W + x) * 4)
    }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
