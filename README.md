# Easy Recipe Journey

World-cuisine recipe website — 850+ recipes from 30+ cuisines.

**Live site:** easyrecipejourney.com  
**Stack:** Next.js 14 · Tailwind CSS · Vercel  
**Design:** Option C — Linen & Earth (Fraunces serif + Plus Jakarta Sans)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project structure

```
app/
  page.tsx          — Homepage
  layout.tsx        — Root layout (Navbar + Footer)
  recipes/          — All recipes listing
  recipe/[slug]/    — Individual recipe page (Step 4)
  cuisine/          — Cuisine index
  cuisine/[slug]/   — Per-cuisine listing (Step 8)
  about/            — About page
  privacy/          — Privacy Policy
  terms/            — Terms of Use
components/
  Navbar.jsx
  Footer.jsx
lib/
  cuisines.js       — Cuisine list + featured recipes data
  recipes.js        — Google Drive data layer (Step 2)
```

## Build steps (see Marching Orders doc)

- [x] Step 1 — Project scaffold
- [ ] Step 2 — Google Drive data layer
- [ ] Step 3 — Homepage (in progress)
- [ ] Step 4 — Recipe page
- [ ] Step 5 — Cooking timeline
- [ ] Step 6 — Step-by-step cooking mode
- [ ] Step 7 — Search & filter (Algolia)
- [ ] Step 8 — Cuisine index pages
- [ ] Step 9 — Analytics, sitemap, SEO polish
- [ ] Step 10 — AdSense & affiliate prep
- [ ] Step 11 — Email capture
- [ ] Step 12 — Vercel deployment

## Environment variables needed

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_FOLDER_ID=1lTPJWvqihuSq9cHuK8PikjL8EZWblcuK
NEXT_PUBLIC_GA_MEASUREMENT_ID=
ALGOLIA_APP_ID=
ALGOLIA_ADMIN_KEY=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
```
