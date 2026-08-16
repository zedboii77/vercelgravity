import type { Metadata, Viewport } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VibedCoding - Mobile Vibe Coder',
  description: 'A mobile-first agentic coding environment and web UI designed for vibe coding on your phone and live preview.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'VibedCoding'
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${geistMono.variable} ${geistMono.className}`}>
      <body suppressHydrationWarning className="bg-black text-zinc-100 antialiased overscroll-none font-mono">
        {children}
      </body>
    </html>
  );
}

