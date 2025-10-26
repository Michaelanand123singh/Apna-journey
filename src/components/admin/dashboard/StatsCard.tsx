'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'gray' | 'indigo' | 'pink'
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change, 
  changeType = 'neutral' 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
  }

  const changeColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  }

  return (
    <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`p-1.5 sm:p-2 rounded-xl ${colorClasses[color]} flex-shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </div>
        <div className="ml-2 sm:ml-4 flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mb-0.5">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5">{value.toLocaleString()}</p>
          {change && (
            <p className={`text-xs sm:text-sm font-medium ${changeColorClasses[changeType]}`}>
              {change} from last month
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
