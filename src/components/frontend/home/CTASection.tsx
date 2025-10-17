'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-16 bg-primary-500 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8">Join thousands of Gaya residents using Apna Journey</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth/login" 
            className="bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Login to Post Jobs
          </Link>
          <Link 
            href="/jobs" 
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </section>
  )
}
