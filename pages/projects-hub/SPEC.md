# Projects hub
| | |
|---|---|
| Route | `/projects` |
| Theme | Light |
| Prototype | `prototype.html` (open in Chrome; uses `_shared/support.js`) |
| Next in story chain | — |
| Notes | Uses `?preview=1` iframes in the prototype. In production use looping MP4/WebM or posters (see docs/03). |
| Status | see `/PROGRESS.md` |

Shared docs: `/docs/02_DESIGN_TOKENS.md`, `/docs/03_SHARED_COMPONENTS.md`, `/docs/TECH_STACK.md`

---

## Projects `/projects`
The page H1 has a mono eyebrow above it ("5 categories · 7 projects") and a lead paragraph below it. Category jump chips follow (Space / Ocean / Aliens / Ancient / Play; `rgba(30,31,36,.06)` background, hover `.12`). Then one `<section id>` per category. Each section's header has a 1px top border, 28px top padding, a mono number, the H2 and a blurb on the right. Grid: `repeat(auto-fit, minmax(min(100%,420px),1fr))`, gap 24px. `scroll-margin-top: 100px`.

| Category | Cards |
|---|---|
| 01 Space | Cosmic Zoom (dark), Black Hole (dark) |
| 02 Ocean | The Deep (dark), Weather Globe (light) |
| 03 Aliens | Where is everybody? (dark) |
| 04 Ancient | Build a Pyramid (light, sand media bg) |
| 05 Play | Particle Type (light) |
