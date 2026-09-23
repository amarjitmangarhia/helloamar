# Overview & site map

## Overview
A personal portfolio for a self-taught software developer. It is part CV and part playground: a calm home page with an interactive particle scene, and a **Projects** hub of seven interactive 3D pieces about space, the ocean, aliens and ancient history. The goal is that visitors stay, explore and learn, and that the site itself proves the developer can build.

Companion docs:
- `TECH_STACK.md`: every library and service, with install command
- `DEPLOYMENT.md`: free hosting (Cloudflare Pages) step by step

## About the design files
The files in `design_files/` are **design references built in HTML**. They are working prototypes that show the intended look, motion and behaviour. They are **not production code to copy directly**. Each `.dc.html` opens directly in a browser (keep `support.js` next to them). Styles are inline and the logic lives in a `class Component` inside each file.

The task is to **recreate these designs in the stack described in `TECH_STACK.md`** (Vite + React + TypeScript + React Three Fiber + Tailwind). The three.js scene code, GLSL shaders and maths in each prototype are production-quality. Port them into R3F components and `.glsl` files instead of rewriting them from scratch.

## Fidelity
**High-fidelity.** Colours, typography, spacing, copy, motion and interactions are final. Recreate them faithfully. Copy marked *placeholder* (see the end of this file) must be replaced with the owner's real details.

## Site map / routes

| Route | Prototype file | Theme |
|---|---|---|
| `/` | Portfolio.dc.html | Light |
| `/projects` | Projects.dc.html | Light |
| `/projects/cosmic-zoom` | Cosmic Zoom.dc.html | Dark (space) |
| `/projects/black-hole` | Black Hole.dc.html | Dark (black) |
| `/projects/the-deep` | The Deep.dc.html | Dark (ocean) |
| `/projects/weather-globe` | Weather Globe.dc.html | Light |
| `/projects/fermi-paradox` | Fermi Paradox.dc.html | Dark |
| `/projects/pyramid` | Pyramid Builder.dc.html | Light (sand) |
| `/projects/particle-type` | Particle Type.dc.html | Light |

Story chain (the "Next" button at the end of each story): Cosmic Zoom → The Deep → Fermi Paradox → Black Hole → Cosmic Zoom.

Suggested structure:
```
src/
  app/            routes, layout
  components/     TopBar, BackPill, GlassCard, ProjectCard, StoryRail, Hud, StorySection
  scenes/         one folder per 3D scene (R3F component + shaders/*.glsl)
  hooks/          useScrollStage, useReducedMotion, usePreviewMode
  lib/            format.ts (distance/time), pyramid.ts, weather.ts
  content/        stories/*.ts (stage text + numbers), projects.ts
```
