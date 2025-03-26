import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '../styles/globals.css';

import { ContextProvider } from '@/components/context-provider';
import MaxWidthWrapper from '@/components/max-width-wrapper';

import Header from './header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.alicelebi.com/'),
  title: { default: 'Ali Rıza ÇELEBİ', template: '%s | Ali Rıza ÇELEBİ' },
  description: 'Developer',
  openGraph: {
    title: 'Ali Rıza ÇELEBİ',
    description: 'Developer',
    url: 'https://www.alicelebi.com/',
    siteName: 'Ali Rıza ÇELEBİ',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <script
          src="https://beamanalytics.b-cdn.net/beam.min.js"
          data-token="66272a61-a1a3-4eff-b6f4-f2c8080a6931"
          async
        ></script>
      </head>
      <body
        className={`bg-primary text-secondary text-sm md:text-base ${inter.className}`}
      >
        <ContextProvider>
          <main className="min-h-screen flex flex-col items-center">
            <MaxWidthWrapper>
              <div className="flex-1 w-full flex flex-col gap-8 items-center">
                {children}
              </div>
            </MaxWidthWrapper>
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
