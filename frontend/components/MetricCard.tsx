'use client'

import { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  color: 'luxury' | 'green' | 'blue' | 'purple' | 'red'
}

const colorVariants = {
  luxury: {
    icon: 'text-luxury-500',
    change: 'text-luxury-400',
    gradient: 'from-luxury-600/20 to-luxury-500/20'
  },
  green: {
    icon: 'text-green-500',
    change: 'text-green-400',
    gradient: 'from-green-600/20 to-green-500/20'
  },
  blue: {
    icon: 'text-blue-500',
    change: 'text-blue-400',
    gradient: 'from-blue-600/20 to-blue-500/20'
  },
  purple: {
    icon: 'text-purple-500',
    change: 'text-purple-400',
    gradient: 'from-purple-600/20 to-purple-500/20'
  },
  red: {
    icon: 'text-red-500',
    change: 'text-red-400',
    gradient: 'from-red-600/20 to-red-500/20'
  }
}

export default function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const isPositive = change >= 0
  const colors = colorVariants[color]

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colors.gradient}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{change}%
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-100 mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  )
}