import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { RewardProvider } from '@/context/RewardContext';
import { AppShell } from '@/components/layout/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Spendly — Your money, understood.',
  description:
    'Track spending, discover patterns, and turn successful credit-card payments into reward coins.',
  keywords: [
    'fintech',
    'credit card dashboard',
    'spending tracker',
    'personal finance',
    'reward coins',
  ],
  authors: [{ name: 'Spendly' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
        <RewardProvider>
          <AppShell>{children}</AppShell>
        </RewardProvider>
      </body>
    </html>
  );
}
