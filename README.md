# 3D Brutalist Portfolio — START HERE

A personal portfolio: a light home page with an interactive particle scene, plus a Projects hub of 7 interactive 3D pieces.
The `prototype.html` files are **design references** (working HTML). The goal is to rebuild them in Vite + React + TypeScript + React Three Fiber + Tailwind (see `docs/TECH_STACK.md`).

## For Claude / next session (saves tokens)
1. Read **this file** and **`PROGRESS.md`** only.
2. Then read just the folder you're working on (`SPEC.md`, and `prototype.html` only if you need the scene code).
3. Do NOT re-read `docs/_original/` — it is the untouched full handoff, kept for reference.
4. After each chunk of work, update `PROGRESS.md` and re-zip.

## Folder map
```
3d-portfolio/
├── README.md                  ← you are here
├── PROGRESS.md                ← what's done / what's next (update every session)
├── app/                       ← the REAL site (run this)
├── _shared/
│   └── support.js             ← runtime the prototypes need (one copy for all)
├── docs/                      ← shared rules, split by topic
│   ├── 01_OVERVIEW_AND_SITEMAP.md
│   ├── 02_DESIGN_TOKENS.md        colours, type, spacing
│   ├── 03_SHARED_COMPONENTS.md    nav, cards, HUD, preview mode
│   ├── 04_SCROLL_STORY_ENGINE.md  shared by 4 story pages
│   ├── 05_FORMATTERS_A11Y_PERF.md
│   ├── 06_CONTENT_PLACEHOLDERS.md things to replace with real info
│   ├── TECH_STACK.md
│   ├── DEPLOYMENT.md              free hosting (Cloudflare Pages)
│   └── _original/HANDOFF_README.md
├── pages/
│   ├── home/                  route /
│   └── projects-hub/          route /projects
└── projects/                  (grouped by category, one folder per project)
    ├── 01-space/     cosmic-zoom, black-hole
    ├── 02-ocean/     the-deep, weather-globe
    ├── 03-aliens/    fermi-paradox
    ├── 04-ancient/   pyramid-builder
    └── 05-play/      particle-type
```
Every page/project folder has the same two files:
- `prototype.html` — the working design reference (open in Chrome; links between pages still work)
- `SPEC.md` — that page's spec, route, theme and notes

## Story chain (the "Next" buttons)
Cosmic Zoom → The Deep → Fermi Paradox → Black Hole → Cosmic Zoom

## The real app
`app/` — the Vite + React + R3F project. Run with `cd app && npm install && npm run dev` (see `app/README.md`).
Built so far: foundation + Home. Projects are added one at a time (see `PROGRESS.md`).
