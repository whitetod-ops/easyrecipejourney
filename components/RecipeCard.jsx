'use client';
import Link from 'next/link';

export default function RecipeCard({ slug, title, cuisine, course, total_time, photo }) {
  return (
    <>
      <style>{`.recipe-card:hover { border-color: #9A8070 !important; }`}</style>
      <Link href={`/recipe/${slug}`} className="recipe-card"
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '0.5px solid #E0D0C0',
          overflow: 'hidden',
          textDecoration: 'none',
          display: 'block',
          transition: 'border-color 0.15s',
        }}>
        <div style={{ height: 200, background: '#E8D5C0', overflow: 'hidden' }}>
          <img src={photo} alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '1rem 1.1rem 1.2rem' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{
              background: '#E8D5C0', color: '#6B5040',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 11, fontWeight: 500,
              padding: '3px 9px', borderRadius: 20
            }}>{cuisine}</span>
            {course && (
              <span style={{
                background: '#F0EBE4', color: '#9A8070',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 11, padding: '3px 9px', borderRadius: 20
              }}>{course}</span>
            )}
          </div>
          <h3 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 17, fontWeight: 600,
            color: '#2C2018', marginBottom: 6
          }}>{title}</h3>
          <p style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 12, color: '#9A8070', margin: 0
          }}>⏱ {total_time}</p>
        </div>
      </Link>
    </>
  );
}
