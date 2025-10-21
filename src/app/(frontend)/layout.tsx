import type { Metadata } from 'next'
import { Inter, Noto_Sans_Devanagari } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })
const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'],
  variable: '--font-hindi'
})

export const metadata: Metadata = {
  title: 'Apna Journey - Bihar Ki Awaaz | Jobs & News in Bihar',
  description: 'Find local jobs and stay updated with Bihar news. Your one-stop platform for opportunities and information across Bihar.',
  keywords: 'Bihar jobs, Bihar news, local jobs, Bihar employment, jobs in Bihar, government jobs Bihar, part time jobs Bihar',
  openGraph: {
    title: 'Apna Journey - Bihar Ki Awaaz',
    description: 'Find local jobs and stay updated with Bihar news',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apna Journey - Bihar Ki Awaaz',
    description: 'Find local jobs and stay updated with Bihar news',
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
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
