# Pyramid Builder
| | |
|---|---|
| Route | `/projects/pyramid` |
| Theme | Light (sand) |
| Prototype | `prototype.html` (open in Chrome; uses `_shared/support.js`) |
| Next in story chain | — |
| Notes | InstancedMesh (~22k boxes). Vitest tests for the calculator maths. `OrbitControls` from drei. |
| Status | see `/PROGRESS.md` |

Shared docs: `/docs/02_DESIGN_TOKENS.md`, `/docs/03_SHARED_COMPONENTS.md`, `/docs/TECH_STACK.md`

---

## Build a Pyramid
- The Great Pyramid as an InstancedMesh: 40 layers on a 40-cell base, about 22k boxes, 4 limestone shades and a gold capstone. It builds bottom-up by setting `mesh.count = floor(progress × total)`. Also: a wireframe ghost cone showing the final shape, soft shadows, and a 1.8 m-scale red person for scale.
- Calculator: `K = 2.3e6 / (20 × 300 × 25,000 × 10)` blocks per worker-hour, `perDay = workers × hours × K`, `years = 2.3e6 / (perDay × days)`, `oneBlockEvery = hours × 3600 / perDay` s, tonnes per day = `perDay × 2.5`.
- Sliders: workers 2,000–40,000 (step 500, default 25,000), hours 6–14 (10), days per year 150–360 (step 10, default 300). "Build it" animates progress over 12 s; the progress bar, year counter and block count update through refs. There is also Reset, and a fact card with "Another fact →" cycling through 6 facts.
- Orbit drag plus wheel zoom (20–120), auto-rotate after 2.5 s idle.
