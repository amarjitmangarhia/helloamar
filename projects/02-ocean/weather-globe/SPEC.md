# Weather Globe
| | |
|---|---|
| Route | `/projects/weather-globe` |
| Theme | Light |
| Prototype | `prototype.html` (open in Chrome; uses `_shared/support.js`) |
| Next in story chain | — |
| Notes | Needs `world-atlas` land-110m.json bundled locally + Open-Meteo (free, no key). Shader: dotted land points. |
| Status | see `/PROGRESS.md` |

Shared docs: `/docs/02_DESIGN_TOKENS.md`, `/docs/03_SHARED_COMPONENTS.md`, `/docs/TECH_STACK.md`

---

## Weather Globe
- A dotted Earth: 26,000 Fibonacci-sphere points, kept only where a land mask marks land. The mask is world-atlas `land-110m` drawn to a 1024×512 canvas. **Bundle the JSON locally**; don't fetch it from unpkg.
- 10 city pins (stem + head). Pin height = `0.08 + (clamp(temp, −10, 40) + 10)/50 × 0.32`. Colour: `#6cc3cf` (−10 °C) → `#f3d37c` (15 °C) → `#f18268` (35 °C).
- Data: **one** Open-Meteo request with comma-separated lat/lon lists: `current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`. Re-fetch every 10 minutes. Map WMO weather codes to labels (see `cond()` in the prototype). Each city's local time comes from `utc_offset_seconds`.
- Interaction: drag to spin with inertia; auto-rotate after 2 s idle. Clicking a list row or a pin flies the globe to face that city. Labels are HTML elements hidden when the city faces away (dot product < .25).
- States: Loading… / No data (offline) / an "Updated HH:MM" stamp.
