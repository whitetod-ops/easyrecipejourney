import Link from 'next/link';
import { CUISINES } from '@/lib/cuisines';

export const metadata = {
  title: 'Browse by Cuisine — Easy Recipe Journey',
  description: 'Explore 30+ world cuisines. Find easy recipes from Mexico, Japan, India, France, Thailand and more.',
};

export default function CuisinePage() {
  return (
    <div style={{ background: '#F8F4EF', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontStyle: 'italic', fontWeight: 600, color: '#2C2018', marginBottom: 8 }}>
          Browse by cuisine
        </h1>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14,
          color: '#9A8070', marginBottom: 32 }}>
          Pick a country and discover easy recipes from that tradition
        </p>
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {CUISINES.map((c) => (
            <Link key={c.slug} href={`/cuisine/${c.slug}`}
              style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #E0D0C0',
                padding: '1.5rem 1rem', textDecoration: 'none', textAlign: 'center',
                display: 'block' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{c.flag}</div>
              <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 13,
                fontWeight: 500, color: '#2C2018' }}>{c.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
