import { Suspense } from 'react'
import JobList from '@/components/frontend/jobs/JobList'
import JobFilters from '@/components/frontend/jobs/JobFilters'
import JobsStats from '@/components/frontend/jobs/JobsStats'
import { Briefcase, Search } from 'lucide-react'

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Modern Header Section */}
      <section className="relative bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50"></div>
        <div className="relative container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Career Opportunities</h1>
                <p className="text-slate-600 text-lg mt-2">Discover your next professional journey in Gaya</p>
              </div>
            </div>
            
            {/* Live Stats Bar */}
            <JobsStats />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Modern Filters Sidebar */}
          <div className="xl:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                    <Search className="w-5 h-5 mr-3 text-slate-600" />
                    Refine Search
                  </h2>
                </div>
                <div className="p-6">
                  <JobFilters />
                </div>
              </div>
            </div>
          </div>

          {/* Modern Jobs List */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Job Listings</h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span className="px-3 py-1 bg-slate-100 rounded-full">Latest First</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-6 animate-pulse border border-slate-200">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-3 bg-slate-200 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                          </div>
                        </div>
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
      </div>
    </div>
  )
}
