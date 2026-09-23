# Progress tracker
Legend: ✅ done · 🟡 built, waiting for owner to review · ⬜ not started

## Foundation (`app/`)
| Item | Status |
|---|---|
| Organized handoff into folders + per-project specs | ✅ |
| Vite + React + TS scaffold, deps installed, `npm run build` passes | ✅ |
| Tailwind 4 tokens (`src/index.css`) | ✅ |
| Router + layout + lazy project routes (placeholders) | ✅ |
| Shared components: TopNav, BackPill, ScrollToHash, glass/lift styles | ✅ |
| `useReducedMotion` hook | ✅ |
| `useScrollStage` hook (`docs/04`) | ⬜ (build with the first scroll story) |
| `lib/format.ts` + Vitest tests | ⬜ (build with Cosmic Zoom) |
| ESLint + Prettier | ⬜ |

## Pages & projects
| Page / project | Folder (design) | Shaders | R3F scene | Route wired | QA |
|---|---|---|---|---|---|
| Home | `pages/home` | ✅ | ✅ | ✅ | 🟡 owner to review in browser |
| Projects hub (real design) | `pages/projects-hub` | – | ⬜ | placeholder | ⬜ |
| Cosmic Zoom | `projects/01-space/cosmic-zoom` | ⬜ | ⬜ | placeholder | ⬜ |
| Black Hole | `projects/01-space/black-hole` | ⬜ | ⬜ | placeholder | ⬜ |
| The Deep | `projects/02-ocean/the-deep` | ⬜ | ⬜ | placeholder | ⬜ |
| Weather Globe | `projects/02-ocean/weather-globe` | ⬜ | ⬜ | placeholder | ⬜ |
| Fermi Paradox | `projects/03-aliens/fermi-paradox` | ⬜ | ⬜ | placeholder | ⬜ |
| Pyramid Builder | `projects/04-ancient/pyramid-builder` | – | ⬜ | placeholder | ⬜ |
| Particle Type | `projects/05-play/particle-type` | ⬜ | ⬜ | placeholder | ⬜ |

## Working method (owner's choice)
Build one thing → owner runs it and reviews → owner says "continue with next" → repeat. Build the real Projects hub last, once cards have something to show.

## Notes / deviations from the handoff
- Newer majors than the handoff listed: Vite 8, React Router 8, TypeScript 7, Vitest 5 (Vite 6 wouldn't resolve with the current React plugin). React 19.
- Page titles use React 19's built-in `<title>` instead of `react-helmet-async` (one less dependency).
- Not installed yet, added when first needed: `@react-three/drei` (Pyramid, Weather Globe), `lenis` (optional), `topojson-client` + `world-atlas` (Weather Globe).
- Home was type-checked, built and served, but NOT visually tested (no browser in the sandbox). Owner review is the first real look.
- Main JS bundle ~1.2 MB (330 KB gzip), mostly three.js. If needed later, split it into its own chunk.
- Home shader/particle logic is a straight port of the prototype; reduced-motion mode snaps, stops drift and rotation.
- Still to do before launch: see `docs/DEPLOYMENT.md` checklist, og-image, favicon is a simple placeholder, replace placeholders in `app/src/content/site.ts`.

## Session log
- Session 1: unpacked handoff, organized into folders, per-project specs, tracker.
- Session 2: built `app/` foundation + Home page. Build passes. Next: owner runs `npm run dev` and reviews Home.

## Next session — paste this with the zip
> Read README.md and PROGRESS.md only. Home is reviewed (notes: ___). Continue with the next project: ___.
