import { getRecipeBySlug, getAllRecipes, titleToSlug } from '@/lib/recipes';
import { notFound } from 'next/navigation';
import MeasurementConverter from '@/components/MeasurementConverter';

export const revalidate = 3600;

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map(r => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return { title: 'Recipe not found' };
  return {
    title: `${recipe.title} — Easy Recipe Journey`,
    description: `Learn how to make ${recipe.title}, an easy ${recipe.cuisine} recipe.`,
    openGraph: {
      title: recipe.title,
      images: recipe.photo_url ? [recipe.photo_url] : [],
    },
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    'name': recipe.title,
    'image': recipe.photo_url ? [recipe.photo_url] : [],
    'prepTime': recipe.prep_time,
    'cookTime': recipe.cook_time,
    'totalTime': recipe.total_time,
    'recipeYield': recipe.servings,
    'recipeCategory': recipe.course,
    'recipeCuisine': recipe.cuisine,
    'recipeIngredient': recipe.ingredients || [],
    'recipeInstructions': (recipe.instructions || []).map((s: string) => ({
      '@type': 'HowToStep', 'text': s,
    })),
  }).replace(/<\/script>/gi, '<\\/script>');

  return (
    <div style={{ background: '#F8F4EF', minHeight: '100vh' }}>
      {recipe.photo_url && (
        <div style={{ width: '100%', height: 400, overflow: 'hidden', background: '#E8D5C0' }}>
          <img src={recipe.photo_url} alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {recipe.cuisine && (
            <span style={{ background: '#E8D5C0', color: '#6B5040',
              fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 12,
              fontWeight: 500, padding: '4px 12px', borderRadius: 20 }}>
              {recipe.cuisine}
            </span>
          )}
          {recipe.course && (
            <span style={{ background: '#F0EBE4', color: '#9A8070',
              fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 12,
              padding: '4px 12px', borderRadius: 20 }}>
              {recipe.course}
            </span>
          )}
          {(recipe.dietary_tags || []).map((tag: string) => (
            <span key={tag} style={{ background: '#EAF3DE', color: '#3B6D11',
              fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 12,
              padding: '4px 12px', borderRadius: 20 }}>
              {tag}
            </span>
          ))}
        </div>

        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif',
          fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 600,
          color: '#2C2018', lineHeight: 1.2, marginBottom: 24 }}>
          {recipe.title}
        </h1>

        <div style={{ display: 'flex', marginBottom: 32, background: '#fff',
          borderRadius: 12, border: '0.5px solid #E0D0C0', overflow: 'hidden' }}>
          {[['Prep', recipe.prep_time], ['Cook', recipe.cook_time],
            ['Total', recipe.total_time], ['Serves', recipe.servings]]
            .filter(([, v]) => v).map(([label, value], i, arr) => (
            <div key={label} style={{ flex: 1, padding: '1rem', textAlign: 'center',
              borderRight: i < arr.length - 1 ? '0.5px solid #E0D0C0' : 'none' }}>
              <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 11, color: '#9A8070', textTransform: 'uppercase',
                letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: 'Fraunces, Georgia, serif',
                fontSize: 15, fontWeight: 600, color: '#2C2018' }}>{value}</div>
            </div>
          ))}
        </div>

        <a href="#ingredients" style={{ display: 'inline-block', marginBottom: 32,
          background: '#2C2018', color: '#E8D5C0',
          fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 13,
          fontWeight: 600, padding: '10px 20px', borderRadius: 8,
          textDecoration: 'none' }}>
          Jump to recipe
        </a>

        <div id="ingredients" style={{ marginBottom: 40 }}>
          <MeasurementConverter ingredients={recipe.ingredients as string[]} />
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22,
            fontWeight: 600, color: '#2C2018', marginBottom: 16,
            paddingBottom: 8, borderBottom: '2px solid #E8D5C0' }}>
            Instructions
          </h2>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {(recipe.instructions || []).map((step: string, i: number) => (
              <li key={i} style={{ display: 'flex', gap: 16,
                marginBottom: 20, alignItems: 'flex-start' }}>
                <span style={{ background: '#2C2018', color: '#E8D5C0',
                  fontFamily: 'Fraunces, Georgia, serif', fontSize: 14,
                  fontWeight: 600, width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: 15, color: '#2C2018', lineHeight: 1.75,
                  margin: 0 }}>{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      </div>
    </div>
  );
}
