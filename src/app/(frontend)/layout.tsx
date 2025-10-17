import type { Metadata } from 'next'
import { Inter, Noto_Sans_Devanagari } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })
const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'],
  variable: '--font-hindi'
})

export const metadata: Metadata = {
  title: 'Apna Journey - Gaya Ki Awaaz | Jobs & News in Gaya, Bihar',
  description: 'Find local jobs and stay updated with Gaya news. Your one-stop platform for opportunities and information in Gaya, Bihar.',
  keywords: 'Gaya jobs, Bihar news, local jobs, Gaya news, jobs in Gaya, government jobs Gaya, part time jobs Gaya',
  openGraph: {
    title: 'Apna Journey - Gaya Ki Awaaz',
    description: 'Find local jobs and stay updated with Gaya news',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apna Journey - Gaya Ki Awaaz',
    description: 'Find local jobs and stay updated with Gaya news',
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
