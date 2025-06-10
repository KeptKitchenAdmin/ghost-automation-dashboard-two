'use client'

import { 
  Video, 
  Crown, 
  DollarSign, 
  Users, 
  TrendingUp,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const activities = [
  {
    id: 1,
    type: 'content_viral',
    title: 'Video went viral!',
    description: '"AI Business Setup Tutorial" reached 250K views',
    icon: TrendingUp,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    revenue: 1250
  },
  {
    id: 2,
    type: 'service_lead',
    title: 'New high-value lead',
    description: 'Enterprise client interested in AI automation package',
    icon: Crown,
    color: 'text-luxury-400',
    bgColor: 'bg-luxury-500/20',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    value: 'Enterprise'
  },
  {
    id: 3,
    type: 'affiliate_sale',
    title: 'Affiliate commission earned',
    description: 'SaaS tool purchase from viral video',
    icon: DollarSign,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    revenue: 89
  },
  {
    id: 4,
    type: 'consultation_booked',
    title: 'Consultation scheduled',
    description: 'Strategy call with potential AI automation client',
    icon: Users,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    value: 'Tomorrow 2PM'
  },
  {
    id: 5,
    type: 'content_published',
    title: 'Content published',
    description: '"Day in My Life as AI Entrepreneur" posted to TikTok',
    icon: Video,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/20',
    timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
  },
  {
    id: 6,
    type: 'compliance_approved',
    title: 'Content approved',
    description: 'Service promotion video passed compliance review',
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
  }
]

export default function RecentActivity() {
  return (
    <div className="luxury-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-100">Recent Activity</h3>
        <button className="text-luxury-400 hover:text-luxury-300 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-dark-800 transition-colors">
            <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-100">
                  {activity.title}
                </h4>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
              </div>
              
              <p className="text-sm text-gray-400 mt-1">
                {activity.description}
              </p>
              
              {activity.revenue && (
                <div className="flex items-center space-x-1 mt-2">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <span className="text-xs font-medium text-green-400">
                    +${activity.revenue.toLocaleString()}
                  </span>
                </div>
              )}
              
              {activity.value && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-luxury-400">
                    {activity.value}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-dark-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total activity today</span>
          <span className="font-medium text-luxury-400">23 events</span>
        </div>
      </div>
    </div>
  )
}