export const hero = {
  eyebrow: (city: string) => `Software developer · ${city}`,
  title: 'I write software because I love it.',
  lead: "Coding is the part of the day I look forward to. This site is where I keep what I build and what I'm learning.",
  newPill: 'New · Black Hole: real-time light bending →',
}

export type ProjectRow = { slug: string; title: string; category: string; description: string }
export const projectRows: ProjectRow[] = [
  { slug: 'cosmic-zoom', title: 'Cosmic Zoom', category: 'Space', description: 'Scroll from a planet to the edge of the observable universe, 20 orders of magnitude in one page.' },
  { slug: 'black-hole', title: 'Black Hole', category: 'Space', description: 'A black hole rendered live, ray by ray: gravitational lensing, a glowing disk, and time running slow near the edge.' },
  { slug: 'the-deep', title: 'The Deep', category: 'Ocean', description: 'Dive 10,935 m to the bottom of the ocean, past bioluminescent life and into total darkness.' },
  { slug: 'fermi-paradox', title: 'Where is everybody?', category: 'Aliens', description: 'A galaxy of 700 possible civilisations, and the five best guesses for why we\u2019ve never heard from any of them.' },
  { slug: 'pyramid', title: 'Build a Pyramid', category: 'Ancient', description: 'Pick a crew size and watch the Great Pyramid rise, block by block, at the real historical pace.' },
]

export const about = {
  eyebrow: '02 · About',
  statement: "I studied software development, and coding turned into the part of my day I look forward to most.",
  body: "I like figuring out how things work, then building my own version. I'm looking for my first developer role, on a team where I can learn fast and ship real things.",
  skills: [
    { title: 'Frontend', stack: 'JavaScript · TypeScript · React · CSS' },
    { title: 'Backend', stack: 'Node.js · Python · SQL' },
    { title: 'Creative code', stack: 'three.js · WebGL · GLSL' },
  ],
  rows: (school: string) => [
    ['Learning', 'three.js and shaders'],
    ['Practising', 'Data structures, a little every day'],
    ['Next up', 'Build and ship a full-stack app'],
    ['Studied', `Software development, ${school}`],
  ],
}

export const contactCta = {
  eyebrow: '03 · Contact',
  title: 'Got a role, a project, or a question about black holes?',
  cta: 'Send me a signal →',
  footerRight: 'Built with three.js and a lot of curiosity',
}
