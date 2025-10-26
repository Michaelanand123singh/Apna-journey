'use client'

import { 
  Briefcase, 
  Newspaper, 
  Users, 
  Shield, 
  Zap,
  Star,
  TrendingUp
} from 'lucide-react'
import AdSenseRectangle from '../ads/AdSenseRectangle'

export default function FeaturesSection() {
  const features = [
    {
      icon: Briefcase,
      title: "Verified Job Listings",
      description: "Find authentic job opportunities from verified employers across Bihar.",
      stats: "500+ Active Jobs",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Newspaper,
      title: "Real-time News",
      description: "Stay updated with the latest news, events, and developments across Bihar.",
      stats: "50+ News Daily",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by locals, for locals. Connect with the Bihar community and share experiences.",
      stats: "10K+ Members",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security and privacy measures.",
      stats: "100% Secure",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience blazing fast performance with our optimized platform and CDN.",
      stats: "< 2s Load Time",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      icon: TrendingUp,
      title: "Growth Focused",
      description: "Track your career growth with personalized insights and recommendations.",
      stats: "95% Success Rate",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      textColor: "text-pink-600 dark:text-pink-400"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content - 8 columns */}
          <div className="lg:col-span-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                <span>Why Choose Apna Journey?</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Everything you need to succeed in Bihar
              </h2>
              
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our platform combines cutting-edge technology with local expertise to provide you with 
                the best job opportunities and news updates across Bihar.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {features.slice(0, 4).map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div 
                    key={index}
                    className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1"
                  >
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {feature.description}
                      </p>

                      {/* Stats */}
                      <div className={`inline-flex items-center space-x-2 ${feature.bgColor} ${feature.textColor} px-3 py-1 rounded-full text-xs font-medium`}>
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{feature.stats}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Additional Features */}
            <div className="grid md:grid-cols-2 gap-6">
              {features.slice(4).map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div 
                    key={index}
                    className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1"
                  >
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {feature.description}
                      </p>

                      {/* Stats */}
                      <div className={`inline-flex items-center space-x-2 ${feature.bgColor} ${feature.textColor} px-3 py-1 rounded-full text-xs font-medium`}>
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{feature.stats}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* AdSense Rectangle */}
            <AdSenseRectangle 
              slot="1234567892" 
              className="w-full h-64"
              placeholder="Features Sidebar Ad"
            />

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Jobs</span>
                  <span className="font-bold text-blue-600">500+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">News Articles</span>
                  <span className="font-bold text-green-600">1000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Happy Users</span>
                  <span className="font-bold text-purple-600">5K+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-bold text-orange-600">95%</span>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Ready to get started?</h3>
              <p className="text-sm text-blue-100 mb-4">
                Join thousands of users who have found their dream jobs and stay updated with local news.
              </p>
              <button className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
