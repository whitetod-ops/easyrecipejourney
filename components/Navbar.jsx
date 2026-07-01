'use client';
import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  ['/', 'Home'],
  ['/recipes', 'Recipes'],
  ['/cuisine', 'Cuisines'],
  ['/about', 'About'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ background: '#2C2018', borderBottom: '1px solid #3D2E12' }}>
      <style>{`
        .nav-link { color: #C4A882; transition: color 0.15s; }
        .nav-link:hover { color: #E8D5C0 !important; }
        .nav-desktop { display: flex; align-items: center; gap: 32px; }
        .nav-burger { display: none; }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: block !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 20,
            fontStyle: 'italic', fontWeight: 600, color: '#E8D5C0', letterSpacing: '-0.3px' }}>
            Easy Recipe Journey
          </span>
        </Link>

        <div className="nav-desktop">
          {NAV_LINKS.map(([href, label]) => (
            <Link key={href} href={href}
              className="nav-link"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
              {label}
            </Link>
          ))}
          <Link href="/recipes?surprise=1"
            style={{ background: '#E8D5C0', color: '#2C2018',
              fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 12, fontWeight: 600,
              padding: '7px 16px', borderRadius: 6, textDecoration: 'none' }}>
            Surprise me
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="nav-burger"
          style={{ background: 'none', border: 'none', color: '#E8D5C0',
            fontSize: 22, cursor: 'pointer', padding: 4 }}
          aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div style={{ background: '#1A1208', borderTop: '1px solid #3D2E12',
          padding: '1rem 1.5rem' }}>
          {NAV_LINKS.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              style={{ display: 'block', fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 15, color: '#E8D5C0', textDecoration: 'none',
                padding: '10px 0', borderBottom: '1px solid #3D2E12' }}>
              {label}
            </Link>
          ))}
          <Link href="/recipes?surprise=1" onClick={() => setOpen(false)}
            style={{ display: 'inline-block', marginTop: 12, background: '#E8D5C0',
              color: '#2C2018', fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 13, fontWeight: 600, padding: '8px 18px',
              borderRadius: 6, textDecoration: 'none' }}>
            Surprise me
          </Link>
        </div>
      )}
    </nav>
  );
}
