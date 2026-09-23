# Tech Stack

Everything here is free and open source. Versions are the ones to start with (current stable as of September 2026). Upgrading minor versions is fine.

## Core

| Layer | Choice | Why |
|---|---|---|
| Language | **TypeScript 5** | Catches mistakes in the 3D maths and API data early |
| Build tool | **Vite 6** (`npm create vite@latest -- --template react-ts`) | Fast dev server, simple static output for free hosting |
| UI framework | **React 18/19** | Most common option, and pairs with React Three Fiber |
| Routing | **React Router 7** (library mode) | One route per project page, static-friendly |
| Styling | **Tailwind CSS 4** | Tokens in one config file; matches the utility-style inline CSS in the prototypes |
| Fonts | **Manrope** + **JetBrains Mono** via `@fontsource/manrope`, `@fontsource/jetbrains-mono` | Self-hosted, no Google request, works offline |

## 3D and graphics

| Package | Used for |
|---|---|
| **three** (0.16x+) | Everything 3D. The prototypes use r160 APIs |
| **@react-three/fiber** | Mount three.js scenes as React components (`<Canvas>`) |
| **@react-three/drei** | Helpers: `OrbitControls` (Pyramid, Weather Globe), `Html` labels, `AdaptiveDpr`, `PerformanceMonitor` |
| **vite-plugin-glsl** | Import `.glsl` shader files instead of template strings |
| **three-stdlib** (optional) | Only if you need extra loaders later |

Custom GLSL shaders (vertex + fragment) are required for:
- Home: particle morph (5 target shapes blended by weight uniforms, cursor repulsion, lit sphere-impostor points)
- Particle Type: sphere-impostor points
- Cosmic Zoom: additive soft points (galaxies, cosmic web)
- The Deep: marine snow (wrapping Y), jellyfish pulse, blinking sparks
- Black Hole: full-screen ray-traced Schwarzschild lensing + accretion disk (fragment shader only)
- Fermi Paradox: galaxy + civilisation dots with show/keep/dim uniforms
- Weather Globe: dotted land points

## Scroll and motion

| Package | Used for |
|---|---|
| **lenis** | Smooth scrolling on the scroll stories (optional; the logic only needs `scrollY`) |
| Native `position: sticky` | Text cards in scroll stories (no library needed) |
| `requestAnimationFrame` | All render loops (R3F's `useFrame`) |

No GSAP needed. All interpolation is simple lerp/smoothstep, documented in README.md.

## Data and APIs

| Service | Used by | Cost / key |
|---|---|---|
| **Open-Meteo Forecast API** `api.open-meteo.com/v1/forecast` | Weather Globe | Free, no API key, non-commercial use |
| **world-atlas** `land-110m.json` (npm: `world-atlas`) | Weather Globe land mask | Free, bundle it locally |
| **topojson-client** | Convert world-atlas TopoJSON to GeoJSON | Free |

## State

- React `useState` / `useRef` are enough. No Redux or Zustand needed.
- Per-frame values (camera, HUD numbers) go in refs and update the DOM directly, so React doesn't re-render at 60fps.
- `localStorage` key `fermi-vote` (number 0–4).
- URL hash `#w=WORD` for Particle Type share links.

## Quality

| Tool | Purpose |
|---|---|
| **ESLint** + **Prettier** | Linting / formatting |
| **Vitest** | Unit tests for the calculators (pyramid maths, distance/time formatters) |
| **Lighthouse** (Chrome DevTools) | Performance / accessibility check before launch |
| **react-helmet-async** | Per-page `<title>` and meta description |

## Hosting

**Cloudflare Pages** (free). Full reasoning and step-by-step setup: see `DEPLOYMENT.md`.

## Install

```bash
npm create vite@latest portfolio -- --template react-ts
cd portfolio
npm i three @react-three/fiber @react-three/drei react-router lenis topojson-client world-atlas @fontsource/manrope @fontsource/jetbrains-mono react-helmet-async
npm i -D @types/three tailwindcss @tailwindcss/vite vite-plugin-glsl @types/topojson-client vitest
```
