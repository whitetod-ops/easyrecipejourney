import { getRecipesByCuisine } from '@/lib/recipes';
import { CUISINES } from '@/lib/cuisines';
import { notFound } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';

export async function generateStaticParams() {
  return CUISINES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cuisine = CUISINES.find(c => c.slug === slug);
  if (!cuisine) return { title: 'Not found' };
  return {
    title: `Easy ${cuisine.name} Recipes — Easy Recipe Journey`,
    description: `Discover easy ${cuisine.name} recipes with step-by-step instructions.`,
  };
}

export default async function CuisineSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cuisine = CUISINES.find(c => c.slug === slug);
  if (!cuisine) notFound();

  const recipes = await getRecipesByCuisine(cuisine.name);

  return (
    <div style={{ background: '#F8F4EF', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <span style={{ fontSize: 40 }}>{cuisine.flag}</span>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontStyle: 'italic',
            fontWeight: 600, color: '#2C2018', margin: 0 }}>
            {cuisine.name} Recipes
          </h1>
        </div>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14,
          color: '#9A8070', marginBottom: 32 }}>
          {recipes.length} recipes found
        </p>
        {recipes.length === 0 ? (
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#9A8070' }}>
            No recipes found for this cuisine yet.
          </p>
        ) : (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {recipes.map(r => (
              <RecipeCard key={r.slug} {...r} photo={r.photo_url || ''} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}