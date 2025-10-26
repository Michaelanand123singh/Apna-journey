import type { Metadata } from 'next'
import { Inter, Noto_Sans_Devanagari } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/shared/ConditionalLayout'
import { AuthProvider } from '@/contexts/AuthContext'
import LoadingProvider from '@/components/shared/LoadingProvider'

const inter = Inter({ subsets: ['latin'] })
const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'],
  variable: '--font-hindi'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://apnajourney.com'),
  title: {
    default: 'Apna Journey - Bihar Ki Awaaz | Jobs & News in Bihar',
    template: '%s | Apna Journey - Bihar Ki Awaaz'
  },
  description: 'Find local jobs and stay updated with Bihar news. Your one-stop platform for opportunities and information across Bihar. Discover Bihar government jobs, private sector jobs, local news, business updates, and more.',
  keywords: 'Bihar jobs, Bihar news, Bihar employment, government jobs Bihar, private jobs Bihar, local news Bihar, Bihar business, Bihar education, Patna jobs, Bihar news portal, Bihar job portal',
  authors: [{ name: 'Apna Journey Team' }],
  creator: 'Apna Journey',
  publisher: 'Apna Journey',
  category: 'Jobs & News',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://apnajourney.com',
    siteName: 'Apna Journey - Bihar Ki Awaaz',
    title: 'Apna Journey - Bihar Ki Awaaz | Jobs & News in Bihar',
    description: 'Find local jobs and stay updated with Bihar news. Your one-stop platform for opportunities and information across Bihar.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Apna Journey - Bihar Ki Awaaz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apna Journey - Bihar Ki Awaaz',
    description: 'Find local jobs and stay updated with Bihar news',
    images: ['/images/og-image.jpg'],
    creator: '@apnajourney',
    site: '@apnajourney',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://apnajourney.com',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    // Add other verification codes as needed
  },
  other: {
    'geo.region': 'IN-BR',
    'geo.placename': 'Bihar',
    'geo.position': '25.0961;85.3131',
    'ICBM': '25.0961, 85.3131',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${notoSansDevanagari.variable}`}>
        <LoadingProvider>
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
