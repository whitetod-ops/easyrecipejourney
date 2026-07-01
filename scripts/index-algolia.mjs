// Run: npm run index
// Requires env vars: ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, NEXT_PUBLIC_ALGOLIA_INDEX_NAME
import { algoliasearch } from 'algoliasearch';
import { getAllRecipes } from '../lib/recipes.js';

const { ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, NEXT_PUBLIC_ALGOLIA_INDEX_NAME } = process.env;

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
  console.error('Missing ALGOLIA_APP_ID or ALGOLIA_ADMIN_KEY env vars.');
  process.exit(1);
}

const indexName = NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'recipes';
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

console.log('Fetching recipes from Google Drive...');
const recipes = await getAllRecipes();
console.log(`Found ${recipes.length} recipes. Indexing to Algolia "${indexName}"...`);

const objects = recipes.map(r => ({
  objectID: r.slug,
  title: r.title,
  cuisine: r.cuisine,
  course: r.course,
  dietary_tags: r.dietary_tags,
  total_time: r.total_time,
  slug: r.slug,
  photo: r.photo,
}));

await client.saveObjects({ indexName, objects });
console.log(`Done. ${objects.length} recipes indexed.`);
