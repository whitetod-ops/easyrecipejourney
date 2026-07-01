import { getAllRecipes } from '@/lib/recipes';
import RecipeCard from '@/components/RecipeCard';
import RecipesSearch from './RecipesSearch';

export const revalidate = 3600;

export const metadata = {
  title: 'All Recipes — Easy Recipe Journey',
  description: '778 easy world cuisine recipes. Search and filter by cuisine, course, and cook time.',
};

const algoliaReady =
  !!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
  !!process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; surprise?: string }>;
}) {
  const { q, surprise } = await searchParams;

  // Algolia search UI — hands off to the client component
  if (algoliaReady && !surprise) {
    return (
      <div style={{ background: '#F8F4EF', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontStyle: 'italic',
            fontWeight: 600, color: '#2C2018', marginBottom: 32 }}>
            All recipes
          </h1>
          <RecipesSearch initialQuery={q} />
        </div>
      </div>
    );
  }

  // Fallback: server-rendered list (also handles ?surprise=1)
  let recipes = await getAllRecipes();

  if (surprise) {
    const i = Math.floor(Math.random() * recipes.length);
    recipes = [recipes[i]];
  }

  return (
    <div style={{ background: '#F8F4EF', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif',
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontStyle: 'italic',
          fontWeight: 600, color: '#2C2018', marginBottom: 8 }}>
          {surprise ? 'Your surprise recipe' : 'All recipes'}
        </h1>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14,
          color: '#9A8070', marginBottom: 32 }}>
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
        </p>
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {recipes.map((r) => (
            <RecipeCard
              key={r.slug}
              slug={r.slug}
              title={r.title}
              cuisine={r.cuisine}
              course={r.course}
              total_time={r.total_time}
              photo={r.photo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
