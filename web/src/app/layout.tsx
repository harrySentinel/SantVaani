import type { Metadata } from 'next';
import { Inter, Playfair_Display, Crimson_Text, Tiro_Devanagari_Hindi, Mukta } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const crimson = Crimson_Text({ subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'], variable: '--font-crimson', display: 'swap' });
const tiro = Tiro_Devanagari_Hindi({ subsets: ['devanagari', 'latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-tiro', display: 'swap' });
const mukta = Mukta({ subsets: ['devanagari', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-mukta', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://santvaani.com'),
  title: {
    default: 'Santvaani - Spiritual Wisdom, Bhajans & Indian Saints',
    template: '%s | Santvaani',
  },
  description:
    "Explore the teachings of India's greatest saints. Devotional bhajans, divine stories, spiritual guidance and daily wisdom, in Hindi and English.",
  openGraph: {
    siteName: 'Santvaani',
    type: 'website',
    locale: 'hi_IN',
    alternateLocale: ['en_IN'],
    images: ['/android-chrome-512x512.png'],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${crimson.variable} ${tiro.variable} ${mukta.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
