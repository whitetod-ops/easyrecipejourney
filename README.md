# Easy Recipe Journey

World-cuisine recipe website — 778 recipes from 30+ cuisines.

**Live site:** easyrecipejourney.com  
**Stack:** Next.js 16.2.9 · Vercel  
**Design:** Linen & Earth (Fraunces serif + Plus Jakarta Sans)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project structure

```
app/
  page.tsx              — Homepage
  layout.tsx            — Root layout (Navbar + Footer, next/font/google)
  recipes/              — All recipes listing + Algolia search
  recipe/[slug]/        — Individual recipe page
  cuisine/              — Cuisine index
  cuisine/[slug]/       — Per-cuisine listing
  sitemap.ts            — Auto-generated sitemap (778 recipes + cuisines)
  robots.ts             — robots.txt
  about/                — About page
  privacy/              — Privacy Policy
  terms/                — Terms of Use
components/
  Navbar.jsx
  Footer.jsx
  RecipeCard.jsx
  CuisineCard.jsx
  MeasurementConverter.jsx   — US ↔ Metric unit toggle
lib/
  cuisines.js           — Cuisine list + featured recipes data
  recipes.js            — Google Drive data layer (cached)
scripts/
  index-algolia.mjs     — Push all recipes to Algolia index
```

## Environment variables

```
# Google Drive (required)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_FOLDER_ID=1lTPJWvqihuSq9cHuK8PikjL8EZWblcuK

# Algolia search (optional — site works without these, falls back to full list)
ALGOLIA_APP_ID=
ALGOLIA_ADMIN_KEY=
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=recipes

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## Algolia setup

1. Create a free account at algolia.com
2. Create an index named `recipes`
3. Copy App ID, Admin API Key, Search-Only API Key into env vars above
4. Run `npm run index` to populate the index
5. Deploy — search activates automatically when `NEXT_PUBLIC_ALGOLIA_*` vars are set

## Scripts

```bash
npm run dev       # local dev server
npm run build     # production build
npm run lint      # ESLint via Next.js
npm run index     # index all recipes to Algolia (requires .env.local)
```
