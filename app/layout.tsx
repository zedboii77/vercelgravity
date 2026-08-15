import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Antigravity 2.0 - Mobile Vibe Coder',
  description: 'A mobile-first agentic coding environment and web UI designed for vibe coding on your phone and self-hosting on VPS.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Antigravity 2.0'
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#070a14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="bg-[#070a14] text-slate-100 antialiased overscroll-none select-none">
        {children}
      </body>
    </html>
  );
}

