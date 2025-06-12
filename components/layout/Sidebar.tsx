'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  Video,
  Crown,
  Users,
  DollarSign,
  BarChart3,
  Shield,
  Settings,
  Zap,
  Target,
  TrendingUp,
  FileText
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Content Hub', href: '/content', icon: Video },
  { name: 'Advanced Studio', href: '/shadowban-safe', icon: Zap },
  { name: 'Reddit Automation', href: '/reddit-automation', icon: Target },
  { name: 'API Usage', href: '/api-usage', icon: BarChart3 },
  { name: 'Campaigns', href: '/campaigns', icon: Target },
  { name: 'Lead Pipeline', href: '/leads', icon: Users },
  { name: 'Financials', href: '/financials', icon: DollarSign },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'TikTok Manager', href: '/tiktok', icon: TrendingUp },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Client Portal', href: '/clients', icon: Crown },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100">GhostTrace</h2>
            <p className="text-xs text-gray-400">AI Automation</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">System Status</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Operational</span>
            </div>
          </div>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Content Engine</span>
              <span className="text-green-400">✓ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Lead Tracking</span>
              <span className="text-green-400">✓ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Compliance</span>
              <span className="text-green-400">✓ Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}