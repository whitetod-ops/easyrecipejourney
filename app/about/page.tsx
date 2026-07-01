export const metadata = {
  title: 'About — Easy Recipe Journey',
  description: 'Learn about Easy Recipe Journey — world cuisines made easy.',
};

export default function AboutPage() {
  return (
    <div style={{ background: '#F8F4EF', minHeight: '60vh', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontStyle: 'italic', fontWeight: 600, color: '#2C2018', marginBottom: 16 }}>
          About Easy Recipe Journey
        </h1>
        <div style={{ height: 3, width: 48, background: '#8B5E3C', borderRadius: 2, marginBottom: 28 }} />
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 15,
          color: '#6B5040', lineHeight: 1.8, marginBottom: 20 }}>
          Easy Recipe Journey is a world-cuisine recipe site with 850+ recipes
          spanning 30+ cuisines. Our mission is simple: make global cooking
          accessible to every home kitchen, with clear step-by-step instructions
          and real photos.
        </p>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 15,
          color: '#6B5040', lineHeight: 1.8, marginBottom: 20 }}>
          Whether you are cooking your first Moroccan tagine, recreating a
          Japanese ramen, or experimenting with Peruvian ceviche, we have built
          every recipe to be straightforward, honest, and actually delicious.
        </p>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 15,
          color: '#6B5040', lineHeight: 1.8 }}>
          New recipes are added regularly. If you have a question or suggestion,
          you are welcome to reach out.
        </p>
      </div>
    </div>
  );
}
