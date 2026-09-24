import type { Outro, Stage } from '../components/story/StoryLayout'

export const cosmicStages: Stage[] = [
  { label: 'Earth', tag: '00 · Earth · 12,742 km across', title: 'How big is space?', body: 'Start on a planet 12,742 km wide. Each scroll zooms you out one step, until you reach the edge of everything we can observe.' },
  { label: 'Moon', tag: '01 · 384,400 km away', title: 'The Moon', body: 'Moonlight reaches you in 1.3 seconds. The gap is wide enough to fit every other planet in the solar system, lined up side by side.' },
  { label: 'Sun', tag: '02 · 150 million km away', title: 'The Sun', body: "The sunlight on your skin left the Sun about 8 minutes and 20 seconds ago. It holds 99.8% of the solar system's mass, and about 1.3 million Earths would fit inside it." },
  { label: 'Planets', tag: '03 · 4.5 billion km to Neptune', title: 'The planets', body: 'Light takes about four hours to reach Neptune. Voyager 1, launched in 1977, is the farthest spacecraft from Earth and is now more than 24 billion km away.' },
  { label: 'Stars', tag: '04 · 4.24 light years', title: 'The nearest star', body: "Proxima Centauri is about 40 trillion km away. At Voyager 1's speed, the trip would take more than 70,000 years. Each dot here is a star within 20 light years of us." },
  { label: 'Milky Way', tag: '05 · 100,000 light years across', title: 'The Milky Way', body: 'Our galaxy holds between 100 and 400 billion stars. The Sun sits about 26,000 light years from the centre and takes roughly 230 million years to go around once.' },
  { label: 'Local Group', tag: '06 · 2.5 million light years', title: 'Andromeda', body: 'Andromeda is the farthest thing most people can see without a telescope. The light reaching your eyes tonight left it 2.5 million years ago, before modern humans existed.' },
  { label: 'Universe', tag: '07 · 93 billion light years across', title: 'The observable universe', body: 'The universe is 13.8 billion years old, yet the part we can see is 93 billion light years across, because space kept stretching while the light travelled. Each dot here stands for a whole cluster of galaxies.' },
]

export const cosmicOutro: Outro = {
  kicker: 'You reached the edge',
  title: 'Now go down instead of out.',
  body: "We've mapped more of the Moon than of our own sea floor. Next, dive 11 km to the bottom of the ocean.",
  next: { to: '/projects/the-deep', label: 'Dive into The Deep →' },
}
