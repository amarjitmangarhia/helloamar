# Particle Type
| | |
|---|---|
| Route | `/projects/particle-type` |
| Theme | Light |
| Prototype | `prototype.html` (open in Chrome; uses `_shared/support.js`) |
| Next in story chain | — |
| Notes | CPU particle sim + sphere-impostor points. URL hash `#w=WORD` share links. |
| Status | see `/PROGRESS.md` |

Shared docs: `/docs/02_DESIGN_TOKENS.md`, `/docs/03_SHARED_COMPONENTS.md`, `/docs/TECH_STACK.md`

---

## Particle Type
- 7,000 particles sample a word drawn on an offscreen 1200×330 canvas (Manrope 800, auto-fit). The simulation runs on the CPU: `v = v·0.9 + (target − pos)·0.02`, plus cursor repulsion within a radius of about 0.67. Click or "Scatter" adds a random impulse. The input is uppercase with a maximum of 14 characters. "Copy link" writes `#w=WORD` to the URL and the clipboard, and the button reads "Copied" for 1.5 s. On load, read `#w=` from the URL. Preview mode cycles HELLO / CODE / PLAY.
