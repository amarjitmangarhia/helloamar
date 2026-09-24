import { feature } from 'topojson-client'
import land from 'world-atlas/land-110m.json' // bundled locally, no network request

type Feat = { geometry: { type: string; coordinates: unknown } }

// Draws the world's land onto a 1024x512 canvas (equirectangular) and returns its RGBA pixels.
// Alpha > 100 means land. Returns null if anything fails (the globe then falls back to random dots).
export function buildLandMask(): Uint8ClampedArray | null {
  try {
    const fc = feature(land, land.objects.land as never) as unknown as { features?: Feat[] } & Partial<Feat>
    const feats: Feat[] = fc.features ?? [fc as Feat]
    const cv = document.createElement('canvas')
    cv.width = 1024
    cv.height = 512
    const ctx = cv.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.fillStyle = '#000'
    feats.forEach((f) => {
      const g = f.geometry
      const polys = (g.type === 'Polygon' ? [g.coordinates] : g.coordinates) as number[][][][]
      polys.forEach((poly) => {
        ctx.beginPath()
        poly.forEach((ring) => {
          let prev: number | null = null
          ring.forEach(([lo, la]) => {
            const x = ((lo + 180) / 360) * 1024
            const y = ((90 - la) / 180) * 512
            if (prev === null || Math.abs(lo - prev) > 180) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
            prev = lo
          })
        })
        ctx.fill('evenodd')
      })
    })
    return ctx.getImageData(0, 0, 1024, 512).data
  } catch {
    return null
  }
}
