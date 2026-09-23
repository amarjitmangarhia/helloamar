# Cosmic Zoom
| | |
|---|---|
| Route | `/projects/cosmic-zoom` |
| Theme | Dark (space) |
| Prototype | `prototype.html` (open in Chrome; uses `_shared/support.js`) |
| Next in story chain | the-deep |
| Notes | Scroll story. Read docs/04_SCROLL_STORY_ENGINE.md. Shaders: additive soft points (galaxies, cosmic web). |
| Status | see `/PROGRESS.md` |

Shared docs: `/docs/02_DESIGN_TOKENS.md`, `/docs/03_SHARED_COMPONENTS.md`, `/docs/TECH_STACK.md`

---

## Cosmic Zoom (8 stages)
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
