import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://reader.nisyuu.com/'),
  title: 'NISYUU READER - Daily News Selection',
  description: 'Nisyuu\'s curated collection of daily news articles from various sources, presented in a classic newspaper format.',
  openGraph: {
    title: 'NISYUU READER - Daily News Selection',
    description: 'Nisyuu\'s curated collection of daily news articles from various sources, presented in a classic newspaper format.',
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
    title: 'NISYUU READER - Daily News Selection',
    description: 'Nisyuu\'s curated collection of daily news articles from various sources, presented in a classic newspaper format.',
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
      <body className={inter.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3R2VC90NS2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3R2VC90NS2');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
