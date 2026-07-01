import Link from 'next/link';
import { CUISINES, FEATURED_RECIPES } from '@/lib/cuisines';
import CuisineCard from '@/components/CuisineCard';
import RecipeCard from '@/components/RecipeCard';

export const metadata = {
  title: 'Easy Recipe Journey — World Cuisines Made Easy',
  description: '778 easy recipes from 30+ cuisines. Step-by-step cooking instructions for everyone.',
};

export default function HomePage() {
  return (
    <div style={{ background: '#F8F4EF' }}>

      {/* ── HERO ── */}
      <section style={{ background: '#E8D5C0', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}
          className="hero-grid">
          <div>
            <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 12,
              fontWeight: 600, color: '#8B5E3C', textTransform: 'uppercase',
              letterSpacing: '0.1em', marginBottom: 12 }}>
              778 recipes · 30+ cuisines
            </p>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontStyle: 'italic',
              fontWeight: 600, color: '#2C2018', lineHeight: 1.15, marginBottom: 16 }}>
              The world on<br />your plate
            </h1>
            <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 15,
              color: '#6B5040', lineHeight: 1.75, marginBottom: 28, maxWidth: 420 }}>
              Easy, step-by-step recipes from every corner of the world.
              From a quick weeknight Pad Thai to a slow Moroccan tagine —
              every kitchen can do this.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/recipes" style={{ background: '#2C2018', color: '#E8D5C0',
                fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14, fontWeight: 600,
                padding: '12px 24px', borderRadius: 8, textDecoration: 'none' }}>
                Browse all recipes
              </Link>
              <Link href="/recipes?surprise=1"
                style={{ background: 'transparent', border: '1.5px solid #9A8070',
                  color: '#6B5040', fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: 14, fontWeight: 500,
                  padding: '12px 24px', borderRadius: 8, textDecoration: 'none' }}>
                Surprise me
              </Link>
            </div>
          </div>

          {/* Mini cuisine grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {CUISINES.slice(0, 4).map((c) => (
              <CuisineCard key={c.slug} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SEARCH ── */}
      <section style={{ background: '#2C2018', padding: '1.5rem' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <form action="/recipes" method="GET"
            style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input name="q" type="search"
              placeholder="Search any recipe, ingredient, or cuisine..."
              style={{ flex: 1, padding: '12px 18px', borderRadius: 8,
                border: '1px solid #3D2E12', background: '#1A1208', color: '#E8D5C0',
                fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14, outline: 'none' }} />
            <button type="submit"
              style={{ background: '#E8D5C0', color: '#2C2018', border: 'none',
                fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14, fontWeight: 600,
                padding: '12px 22px', borderRadius: 8, cursor: 'pointer' }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── CUISINE FLAGS ── */}
      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22,
            fontWeight: 600, color: '#2C2018', marginBottom: 6 }}>
            Browse by cuisine
          </h2>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14,
            color: '#9A8070', marginBottom: 24 }}>
            Pick a country and start cooking
          </p>
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
            {CUISINES.map((c) => (
              <CuisineCard key={c.slug} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED RECIPES ── */}
      <section style={{ padding: '1rem 1.5rem 4rem', background: '#F0EBE4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22,
                fontWeight: 600, color: '#2C2018', marginBottom: 4 }}>
                Featured recipes
              </h2>
              <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 14, color: '#9A8070' }}>
                A taste of what awaits
              </p>
            </div>
            <Link href="/recipes" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 13, color: '#8B5E3C', textDecoration: 'none', fontWeight: 500 }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURED_RECIPES.map((r) => (
              <RecipeCard key={r.slug} {...r} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
