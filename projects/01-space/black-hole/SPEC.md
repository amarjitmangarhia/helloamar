# Black Hole
| | |
|---|---|
| Route | `/projects/black-hole` |
| Theme | Dark (black) |
| Prototype | `prototype.html` (open in Chrome; uses `_shared/support.js`) |
| Next in story chain | cosmic-zoom |
| Notes | Scroll story. Read docs/04_SCROLL_STORY_ENGINE.md. Shader: full-screen ray-traced Schwarzschild lensing + accretion disk (fragment only). |
| Status | see `/PROGRESS.md` |

Shared docs: `/docs/02_DESIGN_TOKENS.md`, `/docs/03_SHARED_COMPONENTS.md`, `/docs/TECH_STACK.md`

---

## Black Hole (6 stages)
- A full-screen quad with a **fragment shader that ray-traces a Schwarzschild black hole** (non-rotating; units rs = 1). Per pixel, up to 260 steps: `dir += −1.5·h²·pos/|pos|⁵·dt; pos += dir·dt`, with adaptive `dt = clamp(.07r, .015, 1.5)`. A ray whose radius drops below 1 is absorbed. A ray that crosses the plane y = 0 between r 2.6 and 15 adds accretion-disk colour, built from two noise octaves, Doppler beaming `(1 + 1.4·v·dot(vel, −dir))³` and a temperature ramp. Escaped rays sample a procedural starfield. Tone-map with `1 − exp(−col·1.3)`.
- Camera radius per stage (rs): 60, 28, 13, 5.5, 2.6, 1.35. It is interpolated in log space, with pitch about 0.09 rad above the disk, plus mouse parallax and a slow yaw.
- Render scale: `min(1, 1100 / max(w,h)) × min(dpr, 1.5)`. **Keep this cap.** The shader is heavy. Consider `drei/PerformanceMonitor` to lower DPR further on slow GPUs.
- Horizontal shift so the hole sits right of the card: `uShift = −((cardRight + (w − cardRight)/2) − w/2) / h`, where `cardRight = clamp(20, 5vw, 72) + min(496, w − 40)`. Under 700px: no x-shift, `uShiftY = −.22`, and cards are anchored to the bottom (`align-items: flex-end; padding-bottom: 110px`).
- HUD: distance to horizon = `(r − 1) × 1.27e7 km` (Sagittarius A*'s horizon radius), and time dilation = `1/√(1 − 1/r)` → "X hours far away".
