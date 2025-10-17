'use client'

export default function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Statistics</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-500 mb-2">500+</div>
            <div className="text-gray-600">Active Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-500 mb-2">1000+</div>
            <div className="text-gray-600">News Articles</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-500 mb-2">5000+</div>
            <div className="text-gray-600">Registered Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-500 mb-2">10000+</div>
            <div className="text-gray-600">Monthly Visitors</div>
          </div>
        </div>
      </div>
    </section>
  )
}
