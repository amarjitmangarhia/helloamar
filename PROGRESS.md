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
| Scroll-story engine: `hooks/useScrollStage.ts`, `lib/story.ts` (+tests), `components/story/StoryLayout.tsx` + `HudStat.tsx` | ✅ (built with The Deep; reuse for Cosmic Zoom, Black Hole, Fermi) |
| Number formatting + Vitest tests | ✅ (lives in `lib/cosmic.ts`, `lib/pyramid.ts`, `lib/weather.ts` etc. next to each project) |
| ESLint + Prettier | ⬜ |

## Pages & projects
| Page / project | Folder (design) | Shaders | R3F scene | Route wired | QA |
|---|---|---|---|---|---|
| Home | `pages/home` | ✅ | ✅ | ✅ | 🟡 owner to review in browser |
| Projects hub (real design) | `pages/projects-hub` | – | ⬜ | placeholder | ⬜ |
| Cosmic Zoom | `projects/01-space/cosmic-zoom` | ✅ | ✅ | ✅ `/projects/cosmic-zoom` | 🟡 owner to review |
| Black Hole | `projects/01-space/black-hole` | ✅ | ✅ | ✅ `/projects/black-hole` | 🟡 owner to review (heavy shader: check speed) |
| The Deep | `projects/02-ocean/the-deep` | ✅ | ✅ | ✅ `/projects/the-deep` | 🟡 owner to review |
| Weather Globe | `projects/02-ocean/weather-globe` | ✅ | ✅ | ✅ `/projects/weather-globe` | 🟡 owner to review |
| Fermi Paradox | `projects/03-aliens/fermi-paradox` | ✅ | ✅ | ✅ `/projects/fermi-paradox` | 🟡 owner to review |
| Pyramid Builder | `projects/04-ancient/pyramid-builder` | – | ✅ | ✅ `/projects/pyramid` | 🟡 owner to review |
| Particle Type | `projects/05-play/particle-type` | ✅ | ✅ | ✅ `/projects/particle-type` | 🟡 owner to review |

## Working method (owner's choice)
Delivery: each piece ships as a folder with `files/` + `deploy.sh <path-to-app>`. The script copies files in, runs tsc + build, commits locally (never pushes), then deletes itself. Owner tests locally and pushes manually.

Build one thing → owner runs it and reviews → owner says "continue with next" → repeat. Build the real Projects hub last, once cards have something to show.

## Notes / deviations from the handoff
- Newer majors than the handoff listed: Vite 8, React Router 8, TypeScript 7, Vitest 5 (Vite 6 wouldn't resolve with the current React plugin). React 19.
- Page titles use React 19's built-in `<title>` instead of `react-helmet-async` (one less dependency).
- Not installed: `@react-three/drei` (not needed: orbit/drag code is hand-written) and `lenis` (optional). `world-atlas`, `topojson-client` were added for Weather Globe.
- Home was type-checked, built and served, but NOT visually tested (no browser in the sandbox). Owner review is the first real look.
- Main JS bundle ~1.2 MB (330 KB gzip), mostly three.js. If needed later, split it into its own chunk.
- Home shader/particle logic is a straight port of the prototype; reduced-motion mode snaps, stops drift and rotation.
- Still to do before launch: see `docs/DEPLOYMENT.md` checklist, og-image, favicon is a simple placeholder, replace placeholders in `app/src/content/site.ts`.

## Session log
- Session 1: unpacked handoff, organized into folders, per-project specs, tracker.
- Session 2: built `app/` foundation + Home page. Build passes. Next: owner runs `npm run dev` and reviews Home.

- Session 3: ported Particle Type (`app/src/scenes/particle-type/`, page in `app/src/pages/projects/`). Added `pages/projects/registry.ts`: to finish a project, add one line there. TopNav hides on project pages. Delivered as a `deploy.sh` drop (owner's standing rule: files + deploy.sh that copies, checks, commits locally, never pushes, then deletes itself).

- Session 4: ported Weather Globe (`app/src/scenes/weather-globe/`, page `pages/projects/WeatherGlobePage.tsx`, `lib/weather.ts` + Vitest tests, `hooks/useWeather.ts`, `content/cities.ts` = the 10 pins). Added deps `world-atlas`, `topojson-client`, `@types/topojson-client`. Open-Meteo is free but non-commercial. Tip: put your own city first in `content/cities.ts`.

- Session 5: ported Pyramid Builder (`scenes/pyramid/`, `pages/projects/PyramidPage.tsx`, `lib/pyramid.ts` + tests, `content/pyramid.ts`). No new packages: uses a hand-written orbit camera instead of drei OrbitControls (same behaviour, one less dependency). Reduced motion: no auto-rotate, "Build it" shows the finished pyramid instantly.

- Session 6: built the shared scroll-story engine and ported The Deep (`scenes/deep/`, `pages/projects/DeepPage.tsx`, `content/deep.ts`, `lib/deep.ts` + tests). `BackPill` got a `dark` variant. To add another story: write a scene that calls `update(t)` from `useScrollStage` each frame, a content file with stages + outro, and a page that wraps it in `<StoryLayout>`.
- Also in session 6: added `flat` (no tone mapping) to the Canvas of Weather Globe and Pyramid so colours match the design (R3F applies tone mapping by default, the prototypes had none). Use `<Canvas flat>` on every new page that uses lit materials.

- Session 7: ported Fermi Paradox (`scenes/fermi/`, `pages/projects/FermiPage.tsx`, `content/fermi.ts`, `lib/fermi.ts` + tests). `StoryLayout` now takes theme props (`pageBg`, `cardBg`, `bodyColor`) and `customOutro` (used for the vote section). Vote is saved in `localStorage['fermi-vote']`.

- Session 8: ported Black Hole (`scenes/blackhole/` full-screen ray-tracing shader, `pages/projects/BlackHolePage.tsx`, `content/blackhole.ts`, `lib/blackhole.ts` + tests). `StoryLayout` gained `tagColor` and `bottomCardsOnNarrow`. Render resolution is capped (`renderScale`); `drei/PerformanceMonitor` was NOT added. If it is slow on the owner's laptop, lower the 1100 cap in `lib/blackhole.ts`.

- Session 9: ported Cosmic Zoom (`scenes/cosmic/`, `pages/projects/CosmicPage.tsx`, `content/cosmic.ts`, `lib/cosmic.ts` + tests). ALL 7 PROJECTS ARE NOW BUILT. Remaining: (1) the real Projects hub (`pages/projects-hub` design; replaces the placeholder `pages/Projects.tsx`), (2) launch checklist: real details in `content/site.ts`, og-image, deploy (`docs/DEPLOYMENT.md`), mobile QA, ESLint/Prettier.

- Session 10: set real name (Amar), domain (helloamar.com), fake email; fixed hard-coded "Your Name" in page titles.

- Session 11: added the helloamar logo (wordmark in nav + favicon).

- Session 12: new hero headline (owner picked option D, badge): ink pill "Hi, I'm Amar" + big "I write software / because I love it." with staggered rise-in (off for reduced motion). Copy lives in `content/home.ts` (`hero`). New token `--color-coral-deep` for large coral text.

## Next session — paste this with the zip
> Read README.md and PROGRESS.md only. Home is reviewed (notes: ___). Continue with the next project: ___.
