# Design tokens

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
