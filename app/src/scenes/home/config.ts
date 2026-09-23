// Tweakable settings for the home particle scene (kept as config, per the handoff).
export const palettes = {
  'Seafoam & coral': ['#6cc3cf', '#f19a82'],
  'Lilac & butter': ['#b5a3ea', '#f3d37c'],
  'Sage & clay': ['#9dc39a', '#dc9a78'],
  'Ink & bone': ['#34363e', '#d8d2c8'],
} as const

export const densityCount = { Low: 2500, Medium: 4500, High: 7500 } as const

export type HomeSceneConfig = {
  palette: keyof typeof palettes
  density: keyof typeof densityCount
  interactive: boolean
  speed: number
}

export const homeSceneConfig: HomeSceneConfig = {
  palette: 'Seafoam & coral',
  density: 'Medium',
  interactive: true,
  speed: 1,
}

export const shapeNames = ['Sphere', 'Torus', 'Helix', 'Lattice', 'Field'] as const
