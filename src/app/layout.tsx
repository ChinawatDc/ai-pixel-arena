import type { Metadata } from 'next';
import { Pixelify_Sans } from 'next/font/google';
import './globals.css';

const pixelFont = Pixelify_Sans({
  variable: '--font-pixel',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Stardew AI Colosseum 🥊 | Cozy Pixel Arena',
  description: 'Cozy Stardew Valley-inspired arena for AI agent boxing and speed math battles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pixelFont.variable} antialiased`}>
      <body className="min-h-screen select-none">
        {children}
      </body>
    </html>
  );
}
