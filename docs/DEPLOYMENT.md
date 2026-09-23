# Deployment (free)

## Recommendation: Cloudflare Pages

The site is fully static (Vite build → `dist/`). There's no server and no database. Every free static host can serve it. Cloudflare Pages is the best fit:

- **Free bandwidth is unmetered.** 3D sites ship heavier JS than most portfolios, and a post that goes viral won't produce a bill or a suspension.
- **Commercial use is allowed on the free plan.** This matters if the portfolio later gets you freelance work.
- Global CDN, automatic HTTPS, preview URLs for every Git branch.
- Free subdomain: `your-name.pages.dev`.

### Alternatives (also free)

| Host | Good | Watch out for |
|---|---|---|
| **Vercel (Hobby)** | Easiest setup with Vite/React, great previews | Hobby plan is for **non-commercial** use only |
| **Netlify (Free)** | Simple, drag-and-drop deploys | Free plan usage limits; check the current plan |
| **GitHub Pages** | Lives next to your code | Needs a SPA 404 workaround for client-side routes; no preview deploys |

Check each provider's current free limits before choosing. They change over time.

## Steps (Cloudflare Pages)

1. Push the project to a GitHub repository.
2. Go to dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → choose the repo.
3. Build settings:
   - Framework preset: **React (Vite)**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variable: `NODE_VERSION = 20` (or newer LTS)
4. Deploy. The site goes live at `https://<project>.pages.dev`.
5. SPA routing: add a file `public/_redirects` containing:
   ```
   /*  /index.html  200
   ```
6. Optional custom domain (about $10/year, the only paid part, and optional): Pages project → **Custom domains** → add `yourname.dev`.

## Before going live

- [ ] Replace every placeholder (see "Content to replace" in README.md)
- [ ] Add `public/og-image.png` (1200×630) and meta tags per page
- [ ] Add a favicon
- [ ] Lighthouse: Performance ≥ 80 on desktop, Accessibility ≥ 95
- [ ] Test on a real phone (iOS Safari + Android Chrome)
- [ ] Check `prefers-reduced-motion` behaviour
- [ ] Free analytics (optional): Cloudflare Web Analytics, toggled on in the Pages dashboard, no cookie banner needed
