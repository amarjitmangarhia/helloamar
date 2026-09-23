# The Deep
| | |
|---|---|
| Route | `/projects/the-deep` |
| Theme | Dark (ocean) |
| Prototype | `prototype.html` (open in Chrome; uses `_shared/support.js`) |
| Next in story chain | fermi-paradox |
| Notes | Scroll story. Read docs/04_SCROLL_STORY_ENGINE.md. Shaders: marine snow (wrapping Y), jellyfish pulse, blinking sparks. |
| Status | see `/PROGRESS.md` |

Shared docs: `/docs/02_DESIGN_TOKENS.md`, `/docs/03_SHARED_COMPONENTS.md`, `/docs/TECH_STACK.md`

---

## The Deep (6 stages)
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
