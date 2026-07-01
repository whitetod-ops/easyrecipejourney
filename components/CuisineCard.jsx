'use client';
import Link from 'next/link';

export default function CuisineCard({ name, flag, slug, large = false }) {
  return (
    <>
      <style>{`.cuisine-card:hover { border-color: #9A8070 !important; }`}</style>
      <Link href={`/cuisine/${slug}`} className="cuisine-card"
        style={{
          background: '#fff',
          borderRadius: large ? 12 : 10,
          border: '0.5px solid #E0D0C0',
          padding: large ? '1.5rem 1rem' : '1rem 0.75rem',
          textDecoration: 'none',
          textAlign: 'center',
          display: 'block',
          transition: 'border-color 0.15s',
        }}>
        <div style={{ fontSize: large ? 32 : 24 }}>{flag}</div>
        <div style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: large ? 13 : 11,
          fontWeight: 500,
          color: '#2C2018',
          marginTop: 6
        }}>{name}</div>
      </Link>
    </>
  );
}
