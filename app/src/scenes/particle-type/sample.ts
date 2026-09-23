// Draws `word` on an offscreen 1200x330 canvas (Manrope 800, auto-fit) and returns N random
// points on the filled pixels, as flat xyz. Empty word -> a sphere. `halfW` = half the visible width.
export function sampleWord(word: string, N: number, halfW: number): Float32Array {
  const R = Math.random
  const out = new Float32Array(N * 3)
  const c = document.createElement('canvas')
  c.width = 1200
  c.height = 330
  const ctx = c.getContext('2d', { willReadFrequently: true })
  const pts: number[] = []
  if (ctx) {
    ctx.font = '800 200px Manrope, sans-serif'
    const w = ctx.measureText(word || ' ').width
    const fs = Math.min(230, (200 * 1100) / Math.max(w, 1))
    ctx.font = `800 ${fs}px Manrope, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#000'
    ctx.fillText(word, 600, 170)
    const d = ctx.getImageData(0, 0, 1200, 330).data
    for (let y = 0; y < 330; y += 2)
      for (let x = 0; x < 1200; x += 2) if (d[(y * 1200 + x) * 4 + 3] > 128) pts.push(x, y)
  }
  const k = Math.min(halfW * 1.7, 8) / 1100
  for (let i = 0; i < N; i++) {
    if (pts.length) {
      const j = Math.floor((R() * pts.length) / 2) * 2
      out[i * 3] = (pts[j] - 600 + (R() - 0.5) * 2.5) * k
      out[i * 3 + 1] = -(pts[j + 1] - 170 + (R() - 0.5) * 2.5) * k
      out[i * 3 + 2] = (R() - 0.5) * 0.35
    } else {
      const y = 1 - (2 * (i + 0.5)) / N
      const r = Math.sqrt(1 - y * y)
      const ph = i * 2.39996
      out[i * 3] = Math.cos(ph) * r * 1.3
      out[i * 3 + 1] = y * 1.3
      out[i * 3 + 2] = Math.sin(ph) * r * 1.3
    }
  }
  return out
}
