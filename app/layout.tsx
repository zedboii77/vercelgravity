import type { Metadata, Viewport } from 'next';
import './globals.css';

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
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="bg-black text-zinc-100 antialiased overscroll-none">
        {children}
      </body>
    </html>
  );
}

