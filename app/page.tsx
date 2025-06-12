'use client'

import React, { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  Video, 
  Target,
  Eye,
  Calendar,
  CheckCircle,
  DollarSign
} from 'lucide-react'
import RevenueChart from '@/components/RevenueChart'
import ContentPerformanceChart from '@/components/ContentPerformanceChart'
import { QuickActions } from '@/components/QuickActions'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'

export default function Dashboard() {
  // REAL TikTok Metrics - No Fake Data
  const [tiktokMetrics] = useState({
    currentFollowers: 0,
    followerGoal: 1000,
    dailyGrowth: 0,
    avgViews: 0,
    engagementRate: 0,
    videosReady: 0,
    heygenCredits: 0,
    totalCredits: 0,
    hookEffectiveness: 0,
    postingStreak: 0,
    shadowbanRisk: "Unknown"
  })

  // REAL Video Performance Data - Will be populated from actual TikTok API
  const [recentVideos] = useState<any[]>([])

  const followersRemaining = tiktokMetrics.followerGoal - tiktokMetrics.currentFollowers
  const progressPercentage = (tiktokMetrics.currentFollowers / tiktokMetrics.followerGoal) * 100
  const daysToMonetization = tiktokMetrics.dailyGrowth > 0 ? Math.ceil(followersRemaining / tiktokMetrics.dailyGrowth) : '∞'

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container-app py-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Automation Dashboard
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track content performance and growth metrics across platforms
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Followers Progress */}
          <Card className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Current Followers</p>
                <h3 className="text-2xl font-bold text-white">
                  {tiktokMetrics.currentFollowers.toLocaleString()}
                </h3>
              </div>
              <Users className="text-blue-400" size={24} />
            </div>
            <ProgressBar
              value={tiktokMetrics.currentFollowers}
              max={tiktokMetrics.followerGoal}
              color="blue"
              showLabel
              label={`Goal: ${tiktokMetrics.followerGoal}`}
              className="mb-2"
            />
            <p className="text-xs text-gray-400">
              {followersRemaining} followers to monetization
            </p>
          </Card>

          {/* Daily Growth */}
          <Card className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Daily Growth</p>
                <h3 className="text-2xl font-bold text-white">
                  +{tiktokMetrics.dailyGrowth}
                </h3>
              </div>
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <p className="text-xs text-gray-400">
              {daysToMonetization} days to 1K milestone
            </p>
          </Card>

          {/* Average Views */}
          <Card className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Avg Views</p>
                <h3 className="text-2xl font-bold text-white">
                  {tiktokMetrics.avgViews.toLocaleString()}
                </h3>
              </div>
              <Eye className="text-purple-400" size={24} />
            </div>
            <p className="text-xs text-gray-400">
              {tiktokMetrics.engagementRate}% engagement rate
            </p>
          </Card>

          {/* HeyGen Credits */}
          <Card className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">HeyGen Credits</p>
                <h3 className="text-2xl font-bold text-white">
                  {tiktokMetrics.heygenCredits}/{tiktokMetrics.totalCredits}
                </h3>
              </div>
              <Video className="text-orange-400" size={24} />
            </div>
            <p className="text-xs text-gray-400">
              {tiktokMetrics.videosReady} videos ready to post
            </p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">
              Revenue Growth
            </h3>
            <RevenueChart />
          </Card>
          
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">
              Content Performance
            </h3>
            <ContentPerformanceChart />
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Video Performance Tracker */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Recent Videos Performance
            </h3>
            <Button variant="secondary">
              View All
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-4 text-sm text-gray-400 font-medium">Video</th>
                  <th className="pb-4 text-sm text-gray-400 font-medium">Views</th>
                  <th className="pb-4 text-sm text-gray-400 font-medium">Engagement</th>
                  <th className="pb-4 text-sm text-gray-400 font-medium">Hook Retention</th>
                  <th className="pb-4 text-sm text-gray-400 font-medium">Followers</th>
                  <th className="pb-4 text-sm text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentVideos.length > 0 ? recentVideos.map((video) => (
                  <tr key={video.id} className="border-b border-gray-800">
                    <td className="py-4">
                      <div>
                        <p className="text-white font-medium">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {video.postedHours}h ago
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-white font-medium">
                        {video.views.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4">
                      <p className="text-white font-medium">
                        {video.engagementRate}%
                      </p>
                    </td>
                    <td className="py-4">
                      <p className="text-white font-medium">
                        {video.hookRetention}%
                      </p>
                    </td>
                    <td className="py-4">
                      <p className="text-white font-medium">
                        +{video.followersGained}
                      </p>
                    </td>
                    <td className="py-4">
                      <StatusBadge 
                        variant={
                          video.status === 'viral' ? 'success' :
                          video.status === 'performing' ? 'info' :
                          'warning'
                        }
                      >
                        {video.status}
                      </StatusBadge>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <p className="text-gray-400">
                        No videos posted yet. Generate and post your first viral content!
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              <Target className="text-blue-400" size={24} />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Hook Effectiveness
            </h4>
            <p className="text-2xl font-bold text-white mb-2">
              {tiktokMetrics.hookEffectiveness}%
            </p>
            <p className="text-sm text-gray-400">
              Average retention in first 3 seconds
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              <Calendar className="text-green-400" size={24} />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Posting Streak
            </h4>
            <p className="text-2xl font-bold text-white mb-2">
              {tiktokMetrics.postingStreak}/7
            </p>
            <p className="text-sm text-gray-400">
              Days this week
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              <CheckCircle className="text-purple-400" size={24} />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Shadowban Risk
            </h4>
            <p className="text-2xl font-bold text-white mb-2">
              {tiktokMetrics.shadowbanRisk}
            </p>
            <p className="text-sm text-gray-400">
              Account health status
            </p>
          </Card>
        </div>

      </div>
    </div>
  )
}