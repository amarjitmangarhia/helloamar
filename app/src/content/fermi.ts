import type { Stage } from '../components/story/StoryLayout'

export const fermiStages: Stage[] = [
  { label: 'Question', tag: '1950 · Los Alamos', title: 'Where is everybody?', body: 'Over lunch, physicist Enrico Fermi asked a simple question. The galaxy is about 13.6 billion years old. If aliens exist, why have we never seen any sign of them?' },
  { label: 'The odds', tag: 'The numbers', title: 'They should be everywhere', body: 'The Milky Way has between 100 and 400 billion stars, and most of them have planets. Even with slow ships, one civilisation could spread across the galaxy in tens of millions of years, a blink in cosmic time.' },
  { label: 'Filter', tag: 'Answer 01', title: 'The Great Filter', body: 'Maybe something stops almost every civilisation before it spreads: war, climate, asteroids, its own technology. The worrying part is that nobody knows if that filter is behind us or ahead.' },
  { label: 'Distance', tag: 'Answer 02', title: "It's just too big", body: 'Our first radio signals have travelled a little over 100 light years. That bubble is the tiny sphere around the Sun. The galaxy is 100,000 light years across. Nobody may have heard us yet.' },
  { label: 'Rare Earth', tag: 'Answer 03', title: 'We might be rare', body: 'The right star, a stable orbit, a big moon, plate tectonics, water, and billions of years of luck. Maybe simple life is common but intelligent life almost never happens.' },
  { label: 'Zoo', tag: 'Answer 04', title: 'The zoo hypothesis', body: "Perhaps they know we're here and choose to stay quiet, watching the way we watch animals in a nature reserve, waiting until we're ready." },
  { label: 'First', tag: 'Answer 05', title: "Maybe we're early", body: 'Small red stars can shine for trillions of years, and the universe is only 13.8 billion years old. We might be one of the first minds to wake up.' },
]

export const fermiOptions = ['The Great Filter', "It's just too big", 'We might be rare', 'The zoo hypothesis', "Maybe we're early"]

export const fermiVerdicts = [
  'A pessimist. If you are right, finding simple life on Mars would be bad news, because it would mean the filter is still ahead of us.',
  'A realist. Space is so big that silence is exactly what we should expect for now.',
  'An optimist about Earth. It would make our planet one of the most precious places in the galaxy.',
  'A romantic. Somewhere out there, someone might be reading about us right now.',
  "A pioneer. If you're right, the galaxy is ours to fill.",
]
