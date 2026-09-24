// Tweakable settings for the home particle scene (kept as config, per the handoff).
export const palettes = {
  'Seafoam & orange': ['#6cc3cf', '#f19a82', '#e8702a'],
  'Lilac & butter': ['#b5a3ea', '#f3d37c', '#e8702a'],
  'Sage & clay': ['#9dc39a', '#dc9a78', '#e8702a'],
  'Ink & bone': ['#34363e', '#d8d2c8', '#e8702a'],
} as const

export const densityCount = { Low: 3000, Medium: 6000, High: 10000 } as const

export type HomeSceneConfig = {
  palette: keyof typeof palettes
  density: keyof typeof densityCount
  interactive: boolean
  speed: number
}

export const homeSceneConfig: HomeSceneConfig = {
  palette: 'Seafoam & orange',
  density: 'Medium',
  interactive: true,
  speed: 1,
}

export const shapeNames = ['Planet', 'Galaxy', 'Helix', 'Signal'] as const
