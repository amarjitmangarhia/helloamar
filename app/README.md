# app/ — the real portfolio (Vite + React + TypeScript + R3F + Tailwind 4)

## Run it
```bash
cd app
npm install        # first time only (needs Node 20+)
npm run dev        # opens http://localhost:5173
```
Other commands: `npm run build` (type-check + production build into `dist/`), `npm run preview`, `npm test`.

## Layout
```
src/
  app/App.tsx            router; project routes are lazy-loaded
  pages/                 Home.tsx (done), Projects.tsx + ProjectPage.tsx (placeholders)
  scenes/home/           ParticleField.tsx, shapes.ts, config.ts, shaders/*.glsl
  components/            TopNav, BackPill, ScrollToHash
  hooks/                 useReducedMotion
  content/               site.ts  ← ALL placeholder details (name, email, socials) live here
                         home.ts  ← home page copy
                         projects.ts ← project list/status
  index.css              Tailwind + design tokens (from docs/02_DESIGN_TOKENS.md)
```
Each new project adds: `src/scenes/<project>/` (component + shaders) and replaces its placeholder route.

## Replace placeholders
Edit `src/content/site.ts` (name, city, email, socials, school, CV link). Also `index.html` title/description.
