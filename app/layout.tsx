import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-fraunces',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://easyrecipejourney.com'),
  title: {
    default: 'Easy Recipe Journey — World Cuisines Made Easy',
    template: '%s | Easy Recipe Journey',
  },
  description:
    '778 easy recipes from 30+ cuisines around the world. Step-by-step cooking instructions for every kitchen.',
  keywords: ['easy recipes', 'world cuisine', 'international recipes', 'cooking', 'step by step recipes'],
  openGraph: {
    siteName: 'Easy Recipe Journey',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
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
