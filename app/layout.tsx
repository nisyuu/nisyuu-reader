import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NISYUU READER - Daily News Selection',
  description: 'Nisyuu\'s curated collection of daily news articles from various sources, presented in a classic newspaper format.',
  openGraph: {
    type: 'website',
    images: [
      {
        url: '/ogp.png',
        width: 1456,
        height: 832,
        alt: 'NISYUU READER - Daily News Selection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: '/ogp.png',
        width: 1456,
        height: 832,
        alt: 'NISYUU READER - Daily News Selection',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
