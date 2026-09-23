# Handoff: 3D Personal Portfolio

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

---

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

---

## Design tokens

### Colours: light pages
| Token | Hex | Use |
|---|---|---|
| `bg` | `#f4f1ec` | Page background |
| `bg-sand` | `#f4ece0` | Pyramid page background |
| `ink` | `#1e1f24` | Primary text, dark buttons |
| `text-2` | `#4a4b53` | Body copy |
| `muted` | `#5d5e66` | Mono labels, meta |
| `placeholder` | `#6b6c74` | Image-slot captions |
| `glass` | `rgba(250,248,245,.72)` → `.9` | Cards, nav (with `backdrop-filter: blur(14–16px)`) |
| `hairline` | `rgba(30,31,36,.07)` | Card borders |
| `divider` | `rgba(30,31,36,.1)` | Row separators |
| `hover` | `#c4553d` | Link hover, pyramid accent |
| `status` | `#7fd6a4` | "Open to work" dot |
| `media` | `#ebe6df` | Image placeholder fill |

### Colours: palette (particles and accents)
| Token | Hex |
|---|---|
| `seafoam` | `#6cc3cf` |
| `coral` | `#f19a82` |
| `butter` | `#f3d37c` |
| `sky` | `#9fd8e0` |
| `lilac` | `#b5a3ea` |
| `sage` | `#9dc39a` |
| `alien` | `#9dffc8` (Fermi only) |

### Colours: dark pages
| Page | Background | Text | Body | Muted | Accent label |
|---|---|---|---|---|---|
| Cosmic Zoom | `#0b0c10` | `#ecebe6` | `#c9c8c2` | `#a9aab2` | `#f19a82` |
| Black Hole | `#000000` | `#ecebe6` | `#c9c8c2` | `#a9aab2` | `#f19a82` |
| The Deep | `#03050a` (canvas animates, see below) | `#ecebe6` | `#d3dade` | `#c9d6dc` | `#9fd8e0` |
| Fermi | `#07080c` | `#ecebe6` | `#c9c8c2` | `#a9aab2` | `#9dffc8` |
| Dark cards on /projects | `#15161b` | `#ecebe6` | `#c9c8c2` | `#a9aab2` | n/a |

### Typography
- **Manrope** 400/500/600/700/800: all UI and headings
- **JetBrains Mono** 400/500: labels, numbers, HUD, tags

| Role | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| Home H1 | `clamp(46px, 7.2vw, 104px)` | 800 | .95 | -.045em |
| Page H1 (/projects) | `clamp(48px, 7vw, 96px)` | 800 | .95 | -.045em |
| Section H2 | `clamp(36px, 5vw, 64px)` | 800 | 1 | -.04em |
| Category H2 | `clamp(32px, 4vw, 52px)` | 800 | 1 | -.04em |
| Story H2 | `clamp(36px, 4.6vw, 64px)` | 800 | 1 | -.04em |
| Contact H2 | `clamp(48px, 8vw, 120px)` | 800 | .95 | -.05em |
| Lead | `clamp(17px, 1.5vw, 20px)` | 400 | 1.55 | 0 |
| Body | 17px (stories), 15–16px (cards) | 400 | 1.5–1.6 | 0 |
| Card title | 24–28px | 700–800 | 1.1 | -.02 to -.03em |
| Button | 14–15px | 700 | 1 | 0 |
| Mono label | 12–13px | 400/500 | 1.4 | 0 (HUD labels: 11px, uppercase, .08em) |
| HUD value | 16px mono | 500 | 1.2 | 0 |

Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.

### Spacing, radius, shadow, motion
- Container max-width **1240px**, side padding **24px**, section vertical padding **120px**
- Gaps: 8 / 12 / 16 / 18 / 22 / 24 / 28 / 32 / 40 / 48 / 56
- Radius: pills `999px` · big cards `30px` · panels `26px` · media `20px` · small tiles `16–24px`
- Card shadow: `inset 0 1px 0 rgba(255,255,255,.9), 0 30px 50px -30px rgba(30,31,36,.3)`
- Nav shadow: `0 10px 30px -18px rgba(30,31,36,.25)`
- Dark card shadow: `0 30px 50px -30px rgba(30,31,36,.5)`
- Hover lift: `transform: translateY(-6px)` (cards), `-2px` (buttons), `transition: transform .35s cubic-bezier(.2,.8,.2,1)`
- Image placeholders: `repeating-linear-gradient(135deg, rgba(30,31,36,.05) 0 10px, transparent 10px 20px), #ebe6df` with a mono caption. Replace with real images.

---

## Shared components

**TopNav (home and /projects).** A sticky pill, max-width 1240, `padding: 10px 12px 10px 20px`, glass background, 999 radius. Left: name (800, 17px, -.02em). Right: links (600, 14px, gap 22px) plus a dark pill "Open to work" with a 7px green dot. The active link on /projects gets a 2px ink underline.

**BackPill (all project pages).** Fixed top-left 16px: "← Projects" (700, 14px, `padding: 10px 16px`, glass, 999 radius). Top-right shows the title (800, 18px) with a mono subtitle under it (12px). Each links back to `/projects#<category>`.

**GlassCard.** Glass background, hairline border, 30px radius, card shadow.

**ProjectCard (/projects).** 14px padding. A 16:10 media box with 20px radius. Text block: title 28px/800, mono tag on the right, description 15px, mono tech line 12px. Two variants: light and dark (`#15161b`).

**StorySection (scroll stories).** Each stage is a `<section>` **140vh** tall. Inside it, a sticky 100vh flex container vertically centres a card: max-width 440–460px, 28px padding, 26px radius, `background: rgba(bg, .5–.6)`, `backdrop-filter: blur(8px)`, 1px border at `rgba(236,235,230,.08–.1)`. Card contents: mono tag (13px, accent), H2, body. The left inset is `clamp(20px, 5vw, 72px)`.

**StoryRail.** Fixed right 18px, vertically centred. One button per stage: mono label (11px) plus a 2px bar. Active: label opacity 1, bar 28px wide in the accent colour. Inactive: opacity .35, 12px, `rgba(236,235,230,.4)`. Click scrolls smoothly to `index × 1.4 × innerHeight`.

**Hud.** Fixed bottom-left (`left: clamp(20px,5vw,72px); bottom: 22px`). Label/value pairs with a 32px gap. Values update per frame through refs, not React state.

**Preview mode.** Every project page accepts `?preview=1`: the UI is hidden and the scene auto-plays. /projects uses this for its live cards. **In production, don't embed seven live WebGL iframes.** Browsers limit simultaneous WebGL contexts (roughly 8–16) and it drains phone batteries. Instead:
- Record a 4–6 s looping muted MP4/WebM for each preview mode (or a poster image), and play it with `<video autoplay muted loop playsinline>`.
- Optionally mount a live `<Canvas>` only on hover or when the card is in view on desktop, and at most one at a time.

---

## Scroll-story engine (Cosmic Zoom, Black Hole, The Deep, Fermi)
Write it once as a hook, `useScrollStage(stageCount)`:

```ts
const x = scrollY / (1.4 * innerHeight);            // one stage per 140vh
const fl = Math.floor(x);
const t = clamp((x - fl - 0.3) / 0.7, 0, 1);         // hold on each stage for the first 30%
target = Math.min(stageCount - 1, fl + smoothstep(t));  // smoothstep(t) = t*t*(3-2t)
cur += (target - cur) * 0.06;                        // per frame (0.07 for Cosmic Zoom / The Deep)
i0 = floor(cur); fr = cur - i0;                      // blend stage i0 → i0+1 by fr
```
- Active rail index = `Math.round(cur)`. Only call setState when it changes.
- After the last stage, a normal (non-sticky) outro section of `min-height: 100vh` holds the "Next" CTA.
- Preview mode ping-pongs `cur` over time instead of reading the scroll position.
- **Reduced motion:** if `prefers-reduced-motion: reduce`, snap `cur = target` (no easing), stop auto-rotation and hide the ambient particle drift.

---

## Screens

### 1. Home `/`
**Background.** A fixed full-screen R3F canvas (`pointer-events: none`) of **4,500 particles** (Low 2,500 / High 7,500). They morph between five shapes as each section scrolls into view: Sphere → Torus → Helix → Lattice → Field. The shader blends five position attributes by a weight array. The particles are lit sphere impostors (fake 3D balls on flat points) coloured with a seafoam→coral gradient along Y. On load, particles fly in from scattered positions over about 2.2 s. The cursor pushes particles away in a Gaussian falloff; the effect fades 1.5 s after the mouse stops. The group drifts to the side opposite the text on wide screens (>960px) and centres on narrow ones. A fixed bottom-left indicator reads `01 — Sphere`.

Tweakable in the prototype (keep them as config): palette (Seafoam & coral / Lilac & butter / Sage & clay / Ink & bone), density, interactive on/off, speed.

**Sections**
1. **Hero** (min-height 100vh). Mono meta line "Portfolio / 2026 · City, Country". H1 "Hi, I'm Your Name. I write software because I love it." Lead paragraph. Buttons: dark "What I do", glass "Say hello".
2. **What I do** (`#work`). H2, plus three skill cards (Frontend / Backend / Creative code) in a grid with `minmax(300px,1fr)`. Each card has a number, a title (26px/700), a description and a mono stack line. Below them: a "This website" project card (16:10 image slot) and a dark link card to /projects.
3. **About** (`#about`). A two-column grid; the left column stays empty so the particles show through. The right column is a glass card: 88px circular portrait slot, H2 "About me", a paragraph, three key/value rows (Now / Focus / Studied, with 130px mono keys) and a "Download CV" underlined link.
4. **Learning** (`#playground`). H2, a lead paragraph and three glass tiles (Now learning / Practising / Next up).
5. **Contact** (`#contact`). Centred: mono eyebrow, a huge H2 "Let's make something.", an email pill, social links (LinkedIn, GitHub, Instagram, Read.cv). Footer row with © and "Made with three.js and too much coffee".

### 2. Projects `/projects`
The page H1 has a mono eyebrow above it ("5 categories · 7 projects") and a lead paragraph below it. Category jump chips follow (Space / Ocean / Aliens / Ancient / Play; `rgba(30,31,36,.06)` background, hover `.12`). Then one `<section id>` per category. Each section's header has a 1px top border, 28px top padding, a mono number, the H2 and a blurb on the right. Grid: `repeat(auto-fit, minmax(min(100%,420px),1fr))`, gap 24px. `scroll-margin-top: 100px`.

| Category | Cards |
|---|---|
| 01 Space | Cosmic Zoom (dark), Black Hole (dark) |
| 02 Ocean | The Deep (dark), Weather Globe (light) |
| 03 Aliens | Where is everybody? (dark) |
| 04 Ancient | Build a Pyramid (light, sand media bg) |
| 05 Play | Particle Type (light) |

### 3. Cosmic Zoom (8 stages)
The camera zooms out on a **logarithmic scale** from Earth to the observable universe. So that floating-point precision doesn't break across 20 orders of magnitude, every object keeps its real position and size in km and is drawn at `displayPos = (realPos − target) / D` and `displayScale = realSize / D`, where `D` is the current zoom level. Nothing ever moves far from the origin.
- Stage key sizes (km), with `D = key / 2.1`: 6,371 · 442,060 · 1.7e8 · 4.6e9 · 12 ly · 60,000 ly · 3.4M ly · 4.4e23 km. Between stages, `D` is interpolated in log10 space.
- The look-at target moves Earth → Sun → galactic centre → Local Group centre. It is lerped by `w = (D − D_i)/(D_{i+1} − D_i)` so the current object stays centred until you're zoomed out.
- Objects, each with a fade range `[in0, in1, out1, out0]` in stage units:
  - Textured Earth (procedural 3D value-noise texture, 512×256) plus an atmosphere shell
  - Moon and its orbit ring
  - Sun (basic material)
  - Solar system: 8 orbit rings plus planet dots
  - 420 nearby stars
  - Milky Way: 38k-point 4-arm spiral
  - Andromeda: 26k points, 2-arm, tilted
  - 90 dwarf galaxies
  - Cosmic web: 50k points on filaments between 160 nodes
- Screen labels are HTML elements projected from 3D each frame (Earth, Moon, Sun, Jupiter, Neptune, Alpha Centauri, You are here, Milky Way, Andromeda), each with its own fade range.
- HUD: "Height of view" = `2·6·tan(20°)·D` formatted (see `lib/format.ts` below), and "Light crosses it in" = that height ÷ 299,792.458 km/s.
- Camera: fixed distance 6 (8.5 on mobile), slow yaw. On wide screens the whole scene is offset +1.7 on x so it sits right of the text card.
- The stage copy is in the prototype's `stages` array. Use it verbatim.

### 4. Black Hole (6 stages)
- A full-screen quad with a **fragment shader that ray-traces a Schwarzschild black hole** (non-rotating; units rs = 1). Per pixel, up to 260 steps: `dir += −1.5·h²·pos/|pos|⁵·dt; pos += dir·dt`, with adaptive `dt = clamp(.07r, .015, 1.5)`. A ray whose radius drops below 1 is absorbed. A ray that crosses the plane y = 0 between r 2.6 and 15 adds accretion-disk colour, built from two noise octaves, Doppler beaming `(1 + 1.4·v·dot(vel, −dir))³` and a temperature ramp. Escaped rays sample a procedural starfield. Tone-map with `1 − exp(−col·1.3)`.
- Camera radius per stage (rs): 60, 28, 13, 5.5, 2.6, 1.35. It is interpolated in log space, with pitch about 0.09 rad above the disk, plus mouse parallax and a slow yaw.
- Render scale: `min(1, 1100 / max(w,h)) × min(dpr, 1.5)`. **Keep this cap.** The shader is heavy. Consider `drei/PerformanceMonitor` to lower DPR further on slow GPUs.
- Horizontal shift so the hole sits right of the card: `uShift = −((cardRight + (w − cardRight)/2) − w/2) / h`, where `cardRight = clamp(20, 5vw, 72) + min(496, w − 40)`. Under 700px: no x-shift, `uShiftY = −.22`, and cards are anchored to the bottom (`align-items: flex-end; padding-bottom: 110px`).
- HUD: distance to horizon = `(r − 1) × 1.27e7 km` (Sagittarius A*'s horizon radius), and time dilation = `1/√(1 − 1/r)` → "X hours far away".

### 5. The Deep (6 stages)
- Depths (m): 0, 200, 1,000, 3,800, 6,000, 10,935. The background colour lerps through `#5fb4c8 → #1f6a8a → #0c2740 → #060d1a → #04070f → #020308`. Fog uses the same colour (4–16).
- Layers:
  - 2,600 marine-snow points (Y wraps in the shader, offset by stage progress)
  - 9 additive light-ray planes plus a wireframe wave surface (stage 0–1)
  - A 420-point fish school orbiting (stage 0–1.9)
  - 3 point-cloud jellyfish with pulsing bell and swaying tentacles (1.3–4.2)
  - 260 blinking bioluminescent sparks (2.4+)
  - An anglerfish lure glow plus a point light (3.2–5)
  - A flat-shaded seafloor (3.8+)
- HUD: Depth, Pressure = `1 + depth/10.06` atm, Sunlight left = `100·e^(−depth/43.4)` % (shown as "None" below 0.0001%).

### 6. Fermi Paradox, "Where is everybody?" (7 stages + vote)
- A 40k-point galaxy, plus 700 civilisation dots (#9dffc8). Index 0 is "Us" at the Sun's position `(−2.6, 0, .4)`. Per-stage uniforms `show` (how many appear), `keep` (Great Filter survivors), `dim` (zoo) and the camera target (centre or Sun) with its distance:
  - 0: show 0, centre, 13
  - 1: show 1, centre, 11
  - 2: keep .04, centre, 11
  - 3: keep .04, Sun, 0.16, radio bubble visible (true scale: 110 ly vs a 50,000 ly radius)
  - 4: show 0, centre, 10
  - 5: show .35, dim .75, Sun, 2.2
  - 6: show 0, centre, 14
- An HTML label follows the Sun: "Us", or "Our radio bubble, ~110 light years" on stage 3.
- HUD: number of civilisations shown.
- **Vote section.** Five option buttons. The selected one gets an alien-green background, dark text and a "Your pick" tag. It is saved to `localStorage['fermi-vote']`, and the verdict text is shown underneath.

### 7. Weather Globe
- A dotted Earth: 26,000 Fibonacci-sphere points, kept only where a land mask marks land. The mask is world-atlas `land-110m` drawn to a 1024×512 canvas. **Bundle the JSON locally**; don't fetch it from unpkg.
- 10 city pins (stem + head). Pin height = `0.08 + (clamp(temp, −10, 40) + 10)/50 × 0.32`. Colour: `#6cc3cf` (−10 °C) → `#f3d37c` (15 °C) → `#f18268` (35 °C).
- Data: **one** Open-Meteo request with comma-separated lat/lon lists: `current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`. Re-fetch every 10 minutes. Map WMO weather codes to labels (see `cond()` in the prototype). Each city's local time comes from `utc_offset_seconds`.
- Interaction: drag to spin with inertia; auto-rotate after 2 s idle. Clicking a list row or a pin flies the globe to face that city. Labels are HTML elements hidden when the city faces away (dot product < .25).
- States: Loading… / No data (offline) / an "Updated HH:MM" stamp.

### 8. Build a Pyramid
- The Great Pyramid as an InstancedMesh: 40 layers on a 40-cell base, about 22k boxes, 4 limestone shades and a gold capstone. It builds bottom-up by setting `mesh.count = floor(progress × total)`. Also: a wireframe ghost cone showing the final shape, soft shadows, and a 1.8 m-scale red person for scale.
- Calculator: `K = 2.3e6 / (20 × 300 × 25,000 × 10)` blocks per worker-hour, `perDay = workers × hours × K`, `years = 2.3e6 / (perDay × days)`, `oneBlockEvery = hours × 3600 / perDay` s, tonnes per day = `perDay × 2.5`.
- Sliders: workers 2,000–40,000 (step 500, default 25,000), hours 6–14 (10), days per year 150–360 (step 10, default 300). "Build it" animates progress over 12 s; the progress bar, year counter and block count update through refs. There is also Reset, and a fact card with "Another fact →" cycling through 6 facts.
- Orbit drag plus wheel zoom (20–120), auto-rotate after 2.5 s idle.

### 9. Particle Type
- 7,000 particles sample a word drawn on an offscreen 1200×330 canvas (Manrope 800, auto-fit). The simulation runs on the CPU: `v = v·0.9 + (target − pos)·0.02`, plus cursor repulsion within a radius of about 0.67. Click or "Scatter" adds a random impulse. The input is uppercase with a maximum of 14 characters. "Copy link" writes `#w=WORD` to the URL and the clipboard, and the button reads "Copied" for 1.5 s. On load, read `#w=` from the URL. Preview mode cycles HELLO / CODE / PLAY.

---

## Formatters (`lib/format.ts`)
- **Distance:** < 1e6 km → "12,700 km" · < 1e9 → "x.x million km" · < 0.05 ly → "x.x AU" (1 AU = 1.496e8 km) · < 1,000 ly → "x.x light years" · < 1e6 → "12,345 light years" · < 1e9 → "x.x million ly" · else "x.x billion ly". 1 ly = 9.4607e12 km.
- **Time:** < 1 s → 3 decimals · < 60 s · < 1 h (minutes) · < 1 day (hours) · < 1 yr (days) · < 1e6 yr · million / billion years.

Write Vitest tests for both, and for the pyramid calculator.

## Accessibility and performance
- Every canvas gets `aria-hidden="true"`. All information must also exist as text (stage cards, HUD).
- Rail buttons need `aria-label` and `aria-current`. Sliders need visible labels (already in the design).
- Honour `prefers-reduced-motion` (see the engine section).
- Lazy-load each project route (`React.lazy`) so the home page doesn't download every scene.
- Dispose geometries, materials and renderers on unmount (R3F does most of this; custom `BufferGeometry` built in `useMemo` must be disposed).
- Pause render loops when the tab is hidden (R3F `frameloop="demand"` or `document.hidden` checks).
- Cap DPR at 2 (1.5 for Black Hole).

## Content to replace (placeholders)
- "Your Name" everywhere, "City, Country", `hello@yourname.com`
- Social links (LinkedIn, GitHub, Instagram, Read.cv): currently `#`
- About paragraph, and the Now / Focus / Studied rows ("School Name")
- Portrait image, the "This website" screenshot, the CV PDF (Download CV)
- Weather Globe city list (the owner's own city should be first)
- Learning tiles, updated over time

## Files
`design_files/` contains the prototypes. Open any `.dc.html` in Chrome; `support.js` must sit next to them.
- `Portfolio.dc.html`: home
- `Projects.dc.html`: projects hub
- `Cosmic Zoom.dc.html`, `Black Hole.dc.html`, `The Deep.dc.html`, `Fermi Paradox.dc.html`: scroll stories
- `Weather Globe.dc.html`, `Pyramid Builder.dc.html`, `Particle Type.dc.html`: interactive projects

The scene code sits in each file's `<script data-dc-script>` block, in `class Component`. Look for `init()` (the three.js setup and render loop) and the shader strings.
