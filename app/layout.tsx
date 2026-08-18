import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Helping Hearts Counselling & Wellness Centre',
  description: 'Confidential professional counselling services and accredited diploma education in psychology and behavioral wellness in Sri Lanka.',
  icons: {
    icon: '/assets/images/helping_hearts_logo_1786214208419.jpg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-teal-800 selection:text-white"
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
