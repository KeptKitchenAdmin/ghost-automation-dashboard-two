'use client'

import React, { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  Video, 
  Target,
  Eye,
  Calendar,
  CheckCircle
} from 'lucide-react'
import RevenueChart from '@/components/RevenueChart'
import ContentPerformanceChart from '@/components/ContentPerformanceChart'
import { QuickActions } from '@/components/QuickActions'

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
    <div style={{backgroundColor: 'var(--luxury-white)', minHeight: '100vh'}}>
      <div className="luxury-container">
        
        {/* Header Section - Massive Whitespace */}
        <div className="text-center luxury-section">
          <h1 className="luxury-heading-xl">
            TikTok Growth Dashboard
          </h1>
          <p style={{color: 'var(--warm-gray-700)', fontSize: '18px'}} className="max-w-2xl mx-auto">
            Track progress to 1,000 followers and monetization readiness
          </p>
        </div>

        {/* Key Metrics Grid - Clean Luxury Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 luxury-section">
          
          {/* Followers Progress */}
          <div className="luxury-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="luxury-body-muted text-sm">Current Followers</p>
                <h3 className="luxury-metric-value">
                  {tiktokMetrics.currentFollowers.toLocaleString()}
                </h3>
              </div>
              <Users size={24} style={{color: 'var(--warm-brown)'}} />
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs luxury-body-muted">Goal: {tiktokMetrics.followerGoal}</span>
                <span className="text-xs luxury-body-muted">{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{backgroundColor: 'var(--nude-200)'}}>
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: 'var(--sage-green)',
                    width: `${Math.min(progressPercentage, 100)}%`
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs luxury-body-muted">
              {followersRemaining} followers to monetization
            </p>
          </div>

          {/* Daily Growth */}
          <div className="luxury-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="luxury-body-muted text-sm">Daily Growth</p>
                <h3 className="luxury-metric-value">
                  +{tiktokMetrics.dailyGrowth}
                </h3>
              </div>
              <TrendingUp size={24} style={{color: 'var(--warm-brown)'}} />
            </div>
            <p className="text-xs luxury-body-muted">
              {daysToMonetization} days to 1K milestone
            </p>
          </div>

          {/* Average Views */}
          <div className="luxury-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="luxury-body-muted text-sm">Avg Views</p>
                <h3 className="luxury-metric-value">
                  {tiktokMetrics.avgViews.toLocaleString()}
                </h3>
              </div>
              <Eye size={24} style={{color: 'var(--warm-brown)'}} />
            </div>
            <p className="text-xs luxury-body-muted">
              {tiktokMetrics.engagementRate}% engagement rate
            </p>
          </div>

          {/* HeyGen Credits */}
          <div className="luxury-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="luxury-body-muted text-sm">HeyGen Credits</p>
                <h3 className="luxury-metric-value">
                  {tiktokMetrics.heygenCredits}/{tiktokMetrics.totalCredits}
                </h3>
              </div>
              <Video size={24} style={{color: 'var(--warm-brown)'}} />
            </div>
            <p className="text-xs luxury-body-muted">
              {tiktokMetrics.videosReady} videos ready to post
            </p>
          </div>
        </div>

        {/* Charts Section - Clean Gallery Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 luxury-section">
          <div className="luxury-card">
            <h3 className="luxury-heading-lg mb-8">
              Revenue Growth
            </h3>
            <RevenueChart />
          </div>
          
          <div className="luxury-card">
            <h3 className="luxury-heading-lg mb-8">
              Content Performance
            </h3>
            <ContentPerformanceChart />
          </div>
        </div>

        {/* Quick Actions - Minimal & Clean */}
        <div className="luxury-section">
          <QuickActions />
        </div>

        {/* Video Performance Tracker - Clean Table */}
        <div className="luxury-card luxury-section">
          <div className="flex items-center justify-between mb-8">
            <h3 className="luxury-heading-lg">
              Recent Videos Performance
            </h3>
            <button className="luxury-button-secondary">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left" style={{borderBottom: '1px solid var(--nude-300)'}}>
                  <th className="pb-4 text-sm luxury-body-muted font-medium">Video</th>
                  <th className="pb-4 text-sm luxury-body-muted font-medium">Views</th>
                  <th className="pb-4 text-sm luxury-body-muted font-medium">Engagement</th>
                  <th className="pb-4 text-sm luxury-body-muted font-medium">Hook Retention</th>
                  <th className="pb-4 text-sm luxury-body-muted font-medium">Followers</th>
                  <th className="pb-4 text-sm luxury-body-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentVideos.length > 0 ? recentVideos.map((video) => (
                  <tr key={video.id} style={{borderBottom: '1px solid var(--nude-200)'}}>
                    <td className="py-6">
                      <div>
                        <p style={{color: 'var(--luxury-black)'}} className="font-medium">
                          {video.title}
                        </p>
                        <p className="text-xs luxury-body-muted mt-1">
                          {video.postedHours}h ago
                        </p>
                      </div>
                    </td>
                    <td className="py-6">
                      <p style={{color: 'var(--luxury-black)'}} className="font-medium">
                        {video.views.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-6">
                      <p style={{color: 'var(--luxury-black)'}} className="font-medium">
                        {video.engagementRate}%
                      </p>
                    </td>
                    <td className="py-6">
                      <p style={{color: 'var(--luxury-black)'}} className="font-medium">
                        {video.hookRetention}%
                      </p>
                    </td>
                    <td className="py-6">
                      <p style={{color: 'var(--luxury-black)'}} className="font-medium">
                        +{video.followersGained}
                      </p>
                    </td>
                    <td className="py-6">
                      <span className={`luxury-status-${
                        video.status === 'viral' ? 'success' :
                        video.status === 'performing' ? 'pending' :
                        'muted'
                      }`}>
                        {video.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <p className="luxury-body-muted">
                        No videos posted yet. Generate and post your first viral content!
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advanced Analytics - Clean Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 luxury-section">
          <div className="luxury-card text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" 
                 style={{backgroundColor: 'var(--nude-200)'}}>
              <Target size={24} style={{color: 'var(--warm-brown)'}} />
            </div>
            <h4 className="luxury-heading-lg mb-2">
              Hook Effectiveness
            </h4>
            <p className="luxury-metric-value mb-2">
              {tiktokMetrics.hookEffectiveness}%
            </p>
            <p className="luxury-body-muted text-sm">
              Average retention in first 3 seconds
            </p>
          </div>

          <div className="luxury-card text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" 
                 style={{backgroundColor: 'var(--nude-200)'}}>
              <Calendar size={24} style={{color: 'var(--warm-brown)'}} />
            </div>
            <h4 className="luxury-heading-lg mb-2">
              Posting Streak
            </h4>
            <p className="luxury-metric-value mb-2">
              {tiktokMetrics.postingStreak}/7
            </p>
            <p className="luxury-body-muted text-sm">
              Days this week
            </p>
          </div>

          <div className="luxury-card text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" 
                 style={{backgroundColor: 'var(--nude-200)'}}>
              <CheckCircle size={24} style={{color: 'var(--warm-brown)'}} />
            </div>
            <h4 className="luxury-heading-lg mb-2">
              Shadowban Risk
            </h4>
            <p className="luxury-metric-value mb-2">
              {tiktokMetrics.shadowbanRisk}
            </p>
            <p className="luxury-body-muted text-sm">
              Account health status
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}