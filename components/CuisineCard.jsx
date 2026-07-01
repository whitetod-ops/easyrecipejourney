import Link from 'next/link';

export default function CuisineCard({ name, flag, slug }) {
  return (
    <Link href={`/cuisine/${slug}`} className="cuisine-card"
      style={{
        background: '#fff',
        borderRadius: 10,
        border: '0.5px solid #E0D0C0',
        padding: '1rem 0.75rem',
        textDecoration: 'none',
        textAlign: 'center',
        display: 'block',
        transition: 'border-color 0.15s',
      }}>
      <div style={{ fontSize: 24 }}>{flag}</div>
      <div style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: 11,
        fontWeight: 500,
        color: '#2C2018',
        marginTop: 6
      }}>{name}</div>
    </Link>
  );
}
