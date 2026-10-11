# Anas Khan's portfolio

A light-themed, single-page portfolio with deep-linkable case studies. It is built from an audit of the source code in `../profile_details/`.

**Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Motion (lazy-loaded) · Lucide icons · self-hosted variable fonts (Bricolage Grotesque, Inter, JetBrains Mono).

## Run

Requires Node **20.19+ or 22.12+**.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ on http://localhost:4173
```

`dist/` is static and can be deployed to any static host (Netlify, Vercel, GitHub Pages, S3, Cloudflare Pages). Case studies use hash URLs (`/#/work/nichetrx`), so no server rewrites are needed.

**Social previews:** build with the real domain so `og:image`, `canonical` and `og:url` are absolute:

```bash
SITE_URL=https://your-domain.com npm run build
```

## Docker

Builds the site and serves it from nginx (non-root) on port 8080:

```bash
docker compose up --build -d                                  # http://localhost:8080
SITE_URL=https://your-domain.com docker compose up --build -d  # with absolute social-preview URLs
docker compose down                                           # stop
```

Without Compose:

```bash
docker build -t anas-khan-portfolio --build-arg SITE_URL=https://your-domain.com .
docker run -d -p 8080:8080 --name portfolio anas-khan-portfolio
```

## Where the content lives

| File | What it controls |
|---|---|
| `src/data/profile.ts` | Name, role, contact, **LinkedIn/GitHub links (empty until verified URLs are added)**, roles and bullets |
| `src/data/projects.ts` | All 15 projects: problem, solution, pipeline stages, decisions, stack roles, stats, code excerpts |
| `src/data/tech.ts` | Technology catalog and groups (the Stack section is derived from project data) |
| `scripts/resume/content.mjs` | The resume text (PDF and DOCX are generated from it) |

Every factual statement traces back to the code; see `../PROJECT_INVENTORY.md` and `../resume/RESUME_AUDIT.md`.

## Generated assets

```bash
npm run resume     # resume PDF + DOCX (fails if the PDF exceeds 2 pages) + preview image
npm run assets     # public/og-image.png and apple-touch-icon.png
```

Both use headless Chromium through `puppeteer-core`. Set `CHROME_PATH` if Brave/Chrome isn't at `/usr/bin/brave-browser`. The resume preview uses poppler's `pdftoppm` when it's available.

## QA scripts (run against `npm run preview`)

```bash
npm run qa                 # screenshots at 1440 / 1280 / 820 / 390 px, console errors, failed requests, overflow
npm run qa:interactions    # keyboard flow, dialog focus trap, filters, hash routing, back button, reduced motion
node scripts/qa-sections.mjs ./qa-out 1440   # full-height screenshots per section
```

## Design system

- **Surfaces:** paper `#f6f5f1`, surface `#ffffff`, paper-2 `#efede7`; fine borders `#e2dfd7` / `#cdc9bf`.
- **Ink:** `#0e1217` (17:1 on paper), ink-2 `#373d46` (10:1), ink-3 `#5b626c` (5.6:1), ink-4 `#686e77` (4.7:1). All text tokens pass WCAG AA.
- **Accent:** one signal orange: `#e8541c` for marks only, `#b93d0c` for text (5.2:1).
- **Domain hues** (markers only): platforms `#2c56e0`, applied AI `#6d43e6`, markets `#087a56`, automation `#9c5c00`.
- **Type:** Bricolage Grotesque for display, Inter for body, JetBrains Mono for labels and code.
- **Motion:** reveal on scroll, a live system trace, a pipeline walkthrough, layout transitions, and a scroll-filled architecture spine in case studies. All of it respects `prefers-reduced-motion`; autoplay stops when off-screen or paused.
