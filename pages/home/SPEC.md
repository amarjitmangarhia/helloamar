# Home
| | |
|---|---|
| Route | `/` |
| Theme | Light |
| Prototype | `prototype.html` (open in Chrome; uses `_shared/support.js`) |
| Next in story chain | — |
| Notes | Shaders: particle morph (5 shapes, cursor repulsion, sphere-impostor points). |
| Status | see `/PROGRESS.md` |

Shared docs: `/docs/02_DESIGN_TOKENS.md`, `/docs/03_SHARED_COMPONENTS.md`, `/docs/TECH_STACK.md`

---

## Home `/`
**Background.** A fixed full-screen R3F canvas (`pointer-events: none`) of **4,500 particles** (Low 2,500 / High 7,500). They morph between five shapes as each section scrolls into view: Sphere → Torus → Helix → Lattice → Field. The shader blends five position attributes by a weight array. The particles are lit sphere impostors (fake 3D balls on flat points) coloured with a seafoam→coral gradient along Y. On load, particles fly in from scattered positions over about 2.2 s. The cursor pushes particles away in a Gaussian falloff; the effect fades 1.5 s after the mouse stops. The group drifts to the side opposite the text on wide screens (>960px) and centres on narrow ones. A fixed bottom-left indicator reads `01 — Sphere`.

Tweakable in the prototype (keep them as config): palette (Seafoam & coral / Lilac & butter / Sage & clay / Ink & bone), density, interactive on/off, speed.

**Sections**
1. **Hero** (min-height 100vh). Mono meta line "Portfolio / 2026 · City, Country". H1 "Hi, I'm Your Name. I write software because I love it." Lead paragraph. Buttons: dark "What I do", glass "Say hello".
2. **What I do** (`#work`). H2, plus three skill cards (Frontend / Backend / Creative code) in a grid with `minmax(300px,1fr)`. Each card has a number, a title (26px/700), a description and a mono stack line. Below them: a "This website" project card (16:10 image slot) and a dark link card to /projects.
3. **About** (`#about`). A two-column grid; the left column stays empty so the particles show through. The right column is a glass card: 88px circular portrait slot, H2 "About me", a paragraph, three key/value rows (Now / Focus / Studied, with 130px mono keys) and a "Download CV" underlined link.
4. **Learning** (`#playground`). H2, a lead paragraph and three glass tiles (Now learning / Practising / Next up).
5. **Contact** (`#contact`). Centred: mono eyebrow, a huge H2 "Let's make something.", an email pill, social links (LinkedIn, GitHub, Instagram, Read.cv). Footer row with © and "Made with three.js and too much coffee".
