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

const activities: any[] = []

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
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No recent activity</p>
            <p className="text-gray-500 text-sm">Activity will appear here when you start generating content</p>
          </div>
        ) : (
          activities.map((activity) => (
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
          ))
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-dark-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total activity today</span>
          <span className="font-medium text-luxury-400">0 events</span>
        </div>
      </div>
    </div>
  )
}