import type { Outro, Stage } from '../components/story/StoryLayout'

export const blackHoleStages: Stage[] = [
  { label: 'Sgr A*', tag: '00 · 26,000 light years away', title: 'Sagittarius A*', body: 'At the centre of our galaxy sits a black hole about 4 million times the mass of the Sun. Scroll to fly toward it. Everything you see is being calculated live, ray by ray.' },
  { label: 'Disk', tag: '01 · The accretion disk', title: 'A ring of fire', body: 'Gas spiralling in heats up to millions of degrees and glows. The side rushing toward you looks brighter and bluer, and the side moving away looks dimmer.' },
  { label: 'Lensing', tag: '02 · Gravitational lensing', title: 'Light bends', body: "Gravity bends light. That's why you can see the far side of the disk, wrapped over the top and under the bottom of the shadow." },
  { label: 'Photon sphere', tag: '03 · 1.5 × horizon radius', title: 'Light in orbit', body: 'At one and a half times the horizon radius, light itself can circle the black hole. The thin bright ring hugging the shadow is light that has looped around at least once.' },
  { label: 'Time', tag: '04 · Time dilation', title: 'Time slows down', body: 'Near the horizon, your clock runs slow compared to the rest of the universe. Watch the counter at the bottom: an hour for you is longer and longer for everyone far away.' },
  { label: 'Horizon', tag: '05 · The event horizon', title: 'The point of no return', body: "Inside this line, escaping would mean going faster than light. For a black hole this big you wouldn't even feel it: the stretching only becomes fatal much further in." },
]

export const blackHoleOutro: Outro = {
  kicker: 'You crossed the event horizon',
  title: "There's no way back out.",
  body: 'From outside, nobody would ever see you cross. Your image would slow down, turn red and fade at the edge.',
  next: { to: '/projects/cosmic-zoom', label: 'Next: Cosmic Zoom →' },
}
