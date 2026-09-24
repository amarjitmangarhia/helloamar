// Great Pyramid model: 40 layers, 40-cell base, one box per cell (22,140 boxes).
// Scale: 1 unit = 10 m (base ~230 m, height ~146.6 m).
export const LAYERS = 40
export const BASE_CELLS = 40
export const BASE_SIZE = 23.03
export const HEIGHT = 14.66
export const BOX_W = BASE_SIZE / BASE_CELLS
export const BOX_H = HEIGHT / LAYERS

export type Cell = [x: number, y: number, z: number, layer: number]

// bottom layer first, so revealing the first N instances builds the pyramid bottom-up
export function buildCells(): Cell[] {
  const cells: Cell[] = []
  for (let l = 0; l < LAYERS; l++) {
    const s = BASE_CELLS - l
    const off = (s - 1) / 2
    for (let z = 0; z < s; z++)
      for (let x = 0; x < s; x++) cells.push([(x - off) * BOX_W, l * BOX_H + BOX_H / 2, (z - off) * BOX_W, l])
  }
  return cells
}
