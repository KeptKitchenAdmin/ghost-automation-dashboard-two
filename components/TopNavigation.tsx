'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  Video,
  Target,
  Users,
  DollarSign,
  BarChart3,
  Shield,
  Crown,
  Settings,
  TrendingUp,
  Bell,
  Search,
  Activity,
  MessageSquare
} from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Content', href: '/content', icon: Video },
  { name: 'Reddit Auto', href: '/reddit-automation', icon: MessageSquare },
  { name: 'Campaigns', href: '/campaigns', icon: Target },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'API Usage', href: '/api-usage', icon: Activity },
  { name: 'Financials', href: '/financials', icon: DollarSign },
]

const secondaryNav = [
  { name: 'TikTok', href: '/tiktok', icon: TrendingUp },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Clients', href: '/clients', icon: Crown },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function TopNavigation() {
  const pathname = usePathname()

  return (
    <header className="luxury-nav sticky top-0 z-50">
      <div className="luxury-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="luxury-heading-lg mb-0 mr-12">
              Automation Empire
            </h1>
            
            {/* Main Navigation */}
            <nav className="hidden md:flex items-center">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`luxury-nav-item ${isActive ? 'active' : ''}`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            {/* Status Indicator */}
            <div className="luxury-status-success">
              Live
            </div>
            
            {/* Profile */}
            <div className="w-10 h-10 bg-warm-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium" style={{color: 'var(--luxury-black)'}}>
                A
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}