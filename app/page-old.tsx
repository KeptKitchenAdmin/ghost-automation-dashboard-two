'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Video, 
  Target,
  Crown,
  Zap,
  BarChart3
} from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import RevenueChart from '@/components/RevenueChart'
import ContentPerformanceChart from '@/components/ContentPerformanceChart'
import RecentActivity from '@/components/RecentActivity'
import { QuickActions } from '@/components/QuickActions'

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 47850,
    affiliateRevenue: 28350,
    serviceRevenue: 19500,
    totalLeads: 156,
    conversionRate: 8.2,
    activeVideos: 43,
    viralVideos: 7,
    pendingProposals: 4
  })

  const [revenueGrowth, setRevenueGrowth] = useState(23.5)
  const [leadGrowth, setLeadGrowth] = useState(15.8)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{
            background: `linear-gradient(to right, var(--luxury-400), var(--luxury-600))`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Luxury Automation Empire
          </h1>
          <p className="text-gray-400 mt-2">
            AI-Powered Viral Content & High-Ticket Service Sales Platform v2
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
          <button className="luxury-button">
            <Crown className="w-4 h-4 mr-2" />
            Generate Content
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          change={revenueGrowth}
          icon={DollarSign}
          color="luxury"
        />
        <MetricCard
          title="Service Pipeline"
          value={`$${metrics.serviceRevenue.toLocaleString()}`}
          change={32.1}
          icon={Target}
          color="green"
        />
        <MetricCard
          title="Total Leads"
          value={metrics.totalLeads.toString()}
          change={leadGrowth}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          change={4.7}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <ContentPerformanceChart />
        </div>
      </div>

      {/* Business Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viral Content Performance */}
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-100">Viral Content Engine</h3>
            <Video className="w-6 h-6 text-luxury-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Videos</span>
              <span className="text-2xl font-bold text-gray-100">{metrics.activeVideos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Viral Hits (100K+ views)</span>
              <span className="text-2xl font-bold text-green-400">{metrics.viralVideos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Affiliate Revenue</span>
              <span className="text-2xl font-bold text-luxury-400">${metrics.affiliateRevenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-luxury-600 to-luxury-400 h-2 rounded-full" 
                style={{ width: '68%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">68% of monthly goal reached</p>
          </div>
        </div>

        {/* Service Sales Performance */}
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-100">Service Sales Pipeline</h3>
            <Crown className="w-6 h-6 text-luxury-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Leads</span>
              <span className="text-2xl font-bold text-gray-100">{metrics.totalLeads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Pending Proposals</span>
              <span className="text-2xl font-bold text-blue-400">{metrics.pendingProposals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Service Revenue</span>
              <span className="text-2xl font-bold text-luxury-400">${metrics.serviceRevenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-400 h-2 rounded-full" 
                style={{ width: '82%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">82% of monthly goal reached</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}