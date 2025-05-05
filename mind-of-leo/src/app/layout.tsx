import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransitions'; // Add this import

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  icons: {
    icon: '/images/LAS-Pixelated.png',
    shortcut: '/images/LAS-Pixelated.png',
  },
  title: 'LAS',
  description: 'A personal blog featuring tech cheat sheets, opinions on economy, software, science, and recommendations for music and books.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <div className="flex-grow">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}