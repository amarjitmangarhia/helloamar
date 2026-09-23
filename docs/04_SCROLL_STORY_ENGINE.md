# Scroll-story engine (Cosmic Zoom, Black Hole, The Deep, Fermi)
Write it once as a hook, `useScrollStage(stageCount)`:

```ts
const x = scrollY / (1.4 * innerHeight);            // one stage per 140vh
const fl = Math.floor(x);
const t = clamp((x - fl - 0.3) / 0.7, 0, 1);         // hold on each stage for the first 30%
target = Math.min(stageCount - 1, fl + smoothstep(t));  // smoothstep(t) = t*t*(3-2t)
cur += (target - cur) * 0.06;                        // per frame (0.07 for Cosmic Zoom / The Deep)
i0 = floor(cur); fr = cur - i0;                      // blend stage i0 → i0+1 by fr
```
- Active rail index = `Math.round(cur)`. Only call setState when it changes.
- After the last stage, a normal (non-sticky) outro section of `min-height: 100vh` holds the "Next" CTA.
- Preview mode ping-pongs `cur` over time instead of reading the scroll position.
- **Reduced motion:** if `prefers-reduced-motion: reduce`, snap `cur = target` (no easing), stop auto-rotation and hide the ambient particle drift.
