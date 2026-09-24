// One entry per project. `status` drives the placeholder pages until each project is ported.
export type Project = {
  slug: string
  title: string
  category: 'Space' | 'Ocean' | 'Aliens' | 'Ancient' | 'Play'
  status: 'todo' | 'done'
}

export const projects: Project[] = [
  { slug: 'cosmic-zoom', title: 'Cosmic Zoom', category: 'Space', status: 'todo' },
  { slug: 'black-hole', title: 'Black Hole', category: 'Space', status: 'todo' },
  { slug: 'the-deep', title: 'The Deep', category: 'Ocean', status: 'done' },
  { slug: 'weather-globe', title: 'Weather Globe', category: 'Ocean', status: 'done' },
  { slug: 'fermi-paradox', title: 'Where is everybody?', category: 'Aliens', status: 'done' },
  { slug: 'pyramid', title: 'Build a Pyramid', category: 'Ancient', status: 'done' },
  { slug: 'particle-type', title: 'Particle Type', category: 'Play', status: 'done' },
]
