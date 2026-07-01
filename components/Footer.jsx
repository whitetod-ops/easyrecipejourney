import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: '#2C2018', borderTop: '1px solid #3D2E12', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem 2rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>

        <div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 18, fontStyle: 'italic',
            fontWeight: 600, color: '#E8D5C0', marginBottom: 10 }}>
            Easy Recipe Journey
          </div>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 13, color: '#9A8070',
            lineHeight: 1.7, margin: 0 }}>
            778 easy recipes from 30+ cuisines around the world.
            Step-by-step cooking for every kitchen.
          </p>
        </div>

        <div>
          <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 11, fontWeight: 600,
            color: '#6B5040', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Explore
          </div>
          {[['/', 'Home'], ['/recipes', 'All Recipes'], ['/cuisine', 'Browse by Cuisine'], ['/about', 'About']].map(([href, label]) => (
            <Link key={href} href={href} className="footer-link">{label}</Link>
          ))}
        </div>

        <div>
          <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 11, fontWeight: 600,
            color: '#6B5040', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Legal
          </div>
          {[['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Use']].map(([href, label]) => (
            <Link key={href} href={href} className="footer-link">{label}</Link>
          ))}
        </div>

      </div>

      <div style={{ borderTop: '1px solid #3D2E12', padding: '1rem 1.5rem',
        maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 12,
          color: '#6B5040', margin: 0 }}>
          © {year} Easy Recipe Journey. All rights reserved.
        </p>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 12,
          color: '#4A3828', margin: 0 }}>
          Recipe content is for informational purposes only.
          Always use your best judgment in the kitchen.
        </p>
      </div>
    </footer>
  );
}
