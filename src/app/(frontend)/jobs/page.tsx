import { Suspense } from 'react'
import JobList from '@/components/frontend/jobs/JobList'
import JobFilters from '@/components/frontend/jobs/JobFilters'
import { Briefcase, Search } from 'lucide-react'

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <Briefcase className="w-8 h-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-800">Find Jobs in Gaya</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Discover local job opportunities in Gaya and nearby areas. Find your next career move with us.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-primary-500" />
                Filter Jobs
              </h2>
              <JobFilters />
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:w-3/4">
            <Suspense fallback={
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            }>
              <JobList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
