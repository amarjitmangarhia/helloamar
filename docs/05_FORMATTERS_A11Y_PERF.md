# Formatters, accessibility & performance

## Formatters (`lib/format.ts`)
- **Distance:** < 1e6 km → "12,700 km" · < 1e9 → "x.x million km" · < 0.05 ly → "x.x AU" (1 AU = 1.496e8 km) · < 1,000 ly → "x.x light years" · < 1e6 → "12,345 light years" · < 1e9 → "x.x million ly" · else "x.x billion ly". 1 ly = 9.4607e12 km.
- **Time:** < 1 s → 3 decimals · < 60 s · < 1 h (minutes) · < 1 day (hours) · < 1 yr (days) · < 1e6 yr · million / billion years.

Write Vitest tests for both, and for the pyramid calculator.

## Accessibility and performance
- Every canvas gets `aria-hidden="true"`. All information must also exist as text (stage cards, HUD).
- Rail buttons need `aria-label` and `aria-current`. Sliders need visible labels (already in the design).
- Honour `prefers-reduced-motion` (see the engine section).
- Lazy-load each project route (`React.lazy`) so the home page doesn't download every scene.
- Dispose geometries, materials and renderers on unmount (R3F does most of this; custom `BufferGeometry` built in `useMemo` must be disposed).
- Pause render loops when the tab is hidden (R3F `frameloop="demand"` or `document.hidden` checks).
- Cap DPR at 2 (1.5 for Black Hole).
