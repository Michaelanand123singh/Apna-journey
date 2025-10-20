'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-16 text-black">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xl mb-8">Join thousands of Gaya residents using Apna Journey</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth/login" 
            className="bg-white px-8 py-3 rounded-lg font-semibold text-black hover:bg-gray-100 transition-colors"
          >
            Login to Post Jobs
          </Link>
          <Link 
            href="/jobs" 
            className="bg-transparent border-2 border-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </section>
  )
}
