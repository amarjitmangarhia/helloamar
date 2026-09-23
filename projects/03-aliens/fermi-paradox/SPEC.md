# Fermi Paradox
| | |
|---|---|
| Route | `/projects/fermi-paradox` |
| Theme | Dark |
| Prototype | `prototype.html` (open in Chrome; uses `_shared/support.js`) |
| Next in story chain | black-hole |
| Notes | Scroll story + vote. Read docs/04_SCROLL_STORY_ENGINE.md. Shader: galaxy + civilisation dots (show/keep/dim uniforms). localStorage key `fermi-vote`. |
| Status | see `/PROGRESS.md` |

Shared docs: `/docs/02_DESIGN_TOKENS.md`, `/docs/03_SHARED_COMPONENTS.md`, `/docs/TECH_STACK.md`

---

## Fermi Paradox, "Where is everybody?" (7 stages + vote)
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
