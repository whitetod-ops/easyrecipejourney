import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Easy Recipe Journey — World Cuisines Made Easy',
    template: '%s | Easy Recipe Journey',
  },
  description:
    '850+ easy recipes from 30+ cuisines around the world. Step-by-step cooking instructions for every kitchen.',
  keywords: ['easy recipes', 'world cuisine', 'international recipes', 'cooking', 'step by step recipes'],
  openGraph: {
    siteName: 'Easy Recipe Journey',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0 }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
