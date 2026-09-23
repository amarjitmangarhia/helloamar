# Shared components

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
