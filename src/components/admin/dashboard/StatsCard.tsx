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
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
          {change && (
            <p className={`text-sm ${changeColorClasses[changeType]}`}>
              {change} from last month
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
