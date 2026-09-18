import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppWrapper } from '@/components/layout/AppWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FinanceTracker Pro | Modern Gelir & Gider Takibi',
  description: '20-30 yıllık veriyle bile anlık çalışan, tamamen yerel ve sıfır maliyetli kişisel bütçe yöneticisi.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#090D16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} dark`} data-theme="dark">
      <body className="antialiased font-sans">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
