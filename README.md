# ParamShots — Phone Rental Site

React 19 + Vite + TypeScript + Tailwind v4. A static front end with no database and no server of its own:

- **Booking** → Google Form links (`BOOKING_URL`, `FAQ_FORM_URL` in `src/App.tsx`).
- **Support** → Messenger button (`src/MessengerButton.tsx`).
- **Photo/video transfer page** (`/transfer`) → browser-to-browser WebRTC via the public PeerJS service.
- **Concerts list** → built-in list in `src/App.tsx` (`featuredConcerts`). Past concerts are hidden automatically.

## Run locally

Requires Node 20.19 or newer.

```bash
npm install
npm run dev
```

## Settings

Copy `.env.example` to `.env.production` (or set the same names in your host's dashboard) before building.
All `VITE_*` values are public, so never put secrets in them.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Live site address. Enables canonical link, share image URL, structured data, `sitemap.xml`, `robots.txt`. |
| `VITE_GOOGLE_CALENDAR_EMBED_URL` | Optional public Google Calendar for the Availability section. |

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm test            # unit tests for the concert validator (Node built-in runner)
npm run build       # production build -> dist/
```

GitHub Actions runs the same three checks on every push and pull request (`.github/workflows/ci.yml`).

## Deploy

1. Run `npm run build` and deploy `dist/`.
2. The host must serve `index.html` for unknown paths (`/transfer`, `/privacy-policy`, ...). `public/_redirects`, `public/_headers` (Netlify / Cloudflare Pages) and `vercel.json` (Vercel) already do this. Keep only the file for your host.

## Where to make changes

- `src/App.tsx` — page content, pricing, FAQ, concerts (each concert can have an `imageAlt` description).
- `src/seo.ts` and `index.html` — page titles, descriptions and share tags. `vite.config.ts` adds the address-based SEO items.
- `src/heroSlides.ts` — hero photos, words and alt text. Images are WebP in `src/assets`.
- `public/og-image.jpg` — 1200×630 image shown when the link is shared.
- `src/config.ts` — optional Google Calendar embed URL.
