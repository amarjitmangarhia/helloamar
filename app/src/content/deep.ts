import type { Outro, Stage } from '../components/story/StoryLayout'

export const deepStages: Stage[] = [
  { label: 'Surface', tag: '00 · 0 m', title: 'Into the deep', body: 'The ocean covers 71% of the planet, yet about three quarters of the sea floor has never been mapped in detail. Scroll to sink.' },
  { label: 'Sunlight', tag: '01 · 200 m · Sunlight zone', title: 'The bright layer', body: 'Only the top 200 metres get enough light for plants and algae to grow. By the bottom of this zone, 99% of the sunlight is already gone.' },
  { label: 'Twilight', tag: '02 · 1,000 m · Twilight zone', title: 'The blue fade', body: "Every night, trillions of animals swim up from here to feed near the surface and sink back before dawn. It's the largest migration on Earth, and it happens daily." },
  { label: 'Midnight', tag: '03 · 3,800 m · Midnight zone', title: 'Making their own light', body: 'No sunlight reaches this deep. About three quarters of the animals living here glow. The wreck of the Titanic lies at this depth, about 3,800 m down.' },
  { label: 'Abyss', tag: '04 · 6,000 m · Abyssal zone', title: 'The abyss', body: 'The water is just above freezing and the pressure is around 600 times what you feel at the surface. The abyssal plains are the largest habitat on Earth.' },
  { label: 'Hadal', tag: '05 · 10,935 m · Challenger Deep', title: 'The bottom', body: 'Drop Mount Everest in here and its peak would still sit more than 2 km underwater. Even so, snailfish have been filmed swimming at over 8,300 m.' },
]

export const deepOutro: Outro = {
  kicker: 'You reached the bottom · 10,935 m',
  title: 'So, is anyone else out there?',
  body: 'Life survives in total darkness down here. So why have we never found it anywhere else?',
  next: { to: '/projects/fermi-paradox', label: 'Next: Where is everybody? →' },
}
