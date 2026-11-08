# Anas Khan's portfolio

A single-page portfolio with deep-linkable case studies, in a navy-and-gold theme (light and dark). Fifteen case studies come from an audit of source code; the three agentic-AI ones (ResearchCrew, Web3 Trading Agent, Career Metro Mapping AI) come from the resume's project descriptions.

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
| `src/data/projects.ts` | The 15 code-audited projects: problem, solution, pipeline stages, decisions, stack roles, stats, code excerpts |
| `src/data/tech.ts` | Technology catalog and groups (the Stack section is derived from project data) |
| `src/data/projects.agentic.ts` | The three agentic-AI case studies (no commit dates, repos or code excerpts) |
| `src/data/resume.ts` | The resume text the site reads: title, summary, skills, roles, education |
| `public/Anas_Khan_Resume.pdf` | The downloadable resume. Replace it together with `resume.ts` and `public/img/resume-preview.webp` |

Every factual statement traces back to the code; see `../PROJECT_INVENTORY.md` and `../resume/RESUME_AUDIT.md`.

## Generated assets

```bash
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

- **Surfaces:** paper `#f4f5f9`, surface `#ffffff`, paper-2 `#eceef5`; fine borders `#dfe2ee` / `#c6cbdc`.
- **Ink:** deep navy `#0c1233`, ink-2 `#333a5c`, ink-3 `#565c7a`, ink-4 `#5d6384`. Text tokens are chosen to pass WCAG AA on paper and surface.
- **Accent:** one gold, the same pairing as the resume: `#d9961a` for marks only, `#8a5700` for text.
- **Domain hues** (markers only): platforms `#2c56e0`, applied AI `#6d43e6`, markets `#087a56`, automation `#b0306a`.
- **Type:** Bricolage Grotesque for display, Inter for body, JetBrains Mono for labels and code.
- **Motion:** reveal on scroll, a live system trace, a pipeline walkthrough, layout transitions, and a scroll-filled architecture spine in case studies. All of it respects `prefers-reduced-motion`; autoplay stops when off-screen or paused.
