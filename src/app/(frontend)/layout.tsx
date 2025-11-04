import type { Metadata } from 'next'
import { Inter, Noto_Sans_Devanagari } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })
const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'],
  variable: '--font-hindi'
})

export const metadata: Metadata = {
  title: 'Apna Journey - India Ki Awaaz | Jobs & News in India',
  description: 'Find local jobs and stay updated with India news. Your one-stop platform for opportunities and information across India.',
  keywords: 'India jobs, India news, local jobs, India employment, jobs in India, government jobs India, part time jobs India',
  openGraph: {
    title: 'Apna Journey - India Ki Awaaz',
    description: 'Find local jobs and stay updated with India news',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apna Journey - India Ki Awaaz',
    description: 'Find local jobs and stay updated with India news',
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
