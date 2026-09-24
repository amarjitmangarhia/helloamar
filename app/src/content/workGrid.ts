// Home page "Selected work" grid. Card colours are final design values.
// Preview media (not recorded yet): /public/previews/<slug>.{webm,mp4,jpg}
export type WorkItem = {
  slug: string
  title: string
  category: 'Space' | 'Ocean' | 'Aliens' | 'Ancient'
  description: string
  href: string
  bg: string // card fill
  fg: string // title colour on the card
}

export const WORK_GRID: WorkItem[] = [
  { slug: 'black-hole', title: 'Black Hole', category: 'Space', description: 'Fly toward Sagittarius A* and watch its gravity bend light, ray-traced live in your browser.', href: '/projects/black-hole', bg: '#15161b', fg: '#ecebe6' },
  { slug: 'cosmic-zoom', title: 'Cosmic Zoom', category: 'Space', description: 'Scroll from Earth to the edge of the observable universe.', href: '/projects/cosmic-zoom', bg: '#1f2a3a', fg: '#ecebe6' },
  { slug: 'the-deep', title: 'The Deep', category: 'Ocean', description: 'Sink 10,935 m to the bottom of the Challenger Deep.', href: '/projects/the-deep', bg: '#1f6a8a', fg: '#ecebe6' },
  { slug: 'fermi-paradox', title: 'Where is everybody?', category: 'Aliens', description: 'The Fermi paradox in five possible answers, then you vote.', href: '/projects/fermi-paradox', bg: '#c9e9d6', fg: '#1e1f24' },
  { slug: 'pyramid', title: 'Build a Pyramid', category: 'Ancient', description: 'Pick a crew and watch the Great Pyramid rise, block by block.', href: '/projects/pyramid', bg: '#e8d6b8', fg: '#1e1f24' },
]

export const previewSrc = (slug: string) => ({
  webm: `/previews/${slug}.webm`,
  mp4: `/previews/${slug}.mp4`,
  poster: `/previews/${slug}.jpg`,
})
