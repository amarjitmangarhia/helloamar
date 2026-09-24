export const hero = {
  badge: (name: string) => `Hi, I'm ${name}`,
  lineA: 'I write software',
  lineB: 'because I love it.',
  lead: "Software developer. Coding is the part of the day I look forward to. This site is where I keep what I build and what I'm learning.",
}

export const skills = [
  { n: '01', title: 'Frontend', text: 'Interfaces that load fast, work on any screen and feel good to use.', stack: 'JavaScript · TypeScript · React · CSS' },
  { n: '02', title: 'Backend', text: 'APIs, databases and the logic that keeps an app running.', stack: 'Node.js · Python · SQL' },
  { n: '03', title: 'Creative code', text: '3D and interactive graphics in the browser, like the particles on this page.', stack: 'three.js · WebGL · GLSL' },
]

export const about = {
  text: "I studied software development and coding turned into my favourite thing to do. I like figuring out how things work, then building my own version. I'm looking for my first developer role, on a team where I can learn fast and ship real things.",
  rows: (school: string) => [
    ['Now', 'Learning three.js, building this site'],
    ['Focus', 'Web development, frontend and backend'],
    ['Studied', `Software development, ${school}`],
  ],
}

export const learning = [
  { label: 'Now learning', text: 'three.js and shaders' },
  { label: 'Practising', text: 'Data structures, a little every day' },
  { label: 'Next up', text: 'Build and ship a full-stack app' },
]
