import Link from 'next/link';
import { FEATURED_RECIPES } from '@/lib/cuisines';

export const metadata = {
  title: 'All Recipes — Easy Recipe Journey',
  description: '850+ easy world cuisine recipes. Search and filter by cuisine, course, and cook time.',
};

export default function RecipesPage() {
  return (
    <div style={{ background: '#F8F4EF', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontStyle: 'italic', fontWeight: 600, color: '#2C2018', marginBottom: 8 }}>
          All recipes
        </h1>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14,
          color: '#9A8070', marginBottom: 32 }}>
          850+ recipes from 30+ cuisines — more added regularly
        </p>
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {FEATURED_RECIPES.map((r) => (
            <Link key={r.slug} href={`/recipe/${r.slug}`}
              style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #E0D0C0',
                overflow: 'hidden', textDecoration: 'none', display: 'block' }}>
              <div style={{ height: 180, background: '#E8D5C0', position: 'relative',
                overflow: 'hidden' }}>
                <img src={r.photo} alt={r.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1rem 1.1rem 1.25rem' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <span style={{ background: '#E8D5C0', color: '#6B5040',
                    fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 11, fontWeight: 500,
                    padding: '3px 9px', borderRadius: 20 }}>{r.cuisine}</span>
                </div>
                <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 16,
                  fontWeight: 600, color: '#2C2018', marginBottom: 6 }}>{r.title}</h2>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 12,
                  color: '#9A8070', margin: 0 }}>⏱ {r.total_time}</p>
              </div>
            </Link>
          ))}
        </div>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 13,
          color: '#9A8070', textAlign: 'center', marginTop: 40 }}>
          Full recipe library coming soon — connected to Google Drive
        </p>
      </div>
    </div>
  );
}
