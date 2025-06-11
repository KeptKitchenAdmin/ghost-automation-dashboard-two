'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react'
import { RealContentGenerator } from '@/components/RealContentGenerator'

export default function ContentHub() {
  const [followerCount, setFollowerCount] = useState(0)
  const [showStrategy, setShowStrategy] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  
  useEffect(() => {
    const savedCount = localStorage.getItem('followerCount')
    if (savedCount) setFollowerCount(parseInt(savedCount))
  }, [])

  return (
    <div className="luxury-container luxury-padding">
      {/* Clean Header */}
      <div className="luxury-card mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="luxury-heading-xl mb-2">Content Generation Hub</h1>
            <p className="luxury-body-muted">
              Generate viral content optimized for TikTok growth
            </p>
          </div>
          <div className="text-right">
            <div className="luxury-body-small text-warm-gray-500 mb-1">Followers</div>
            <div className="luxury-heading-lg text-blue-600">{followerCount.toLocaleString()}</div>
            <button 
              onClick={() => {
                const newCount = prompt('Update follower count:', followerCount.toString())
                if (newCount && !isNaN(parseInt(newCount))) {
                  const count = parseInt(newCount)
                  setFollowerCount(count)
                  localStorage.setItem('followerCount', count.toString())
                }
              }}
              className="luxury-button-secondary text-xs mt-1"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Growth Strategy Dropdown */}
      <div className="luxury-card mb-6">
        <button
          onClick={() => setShowStrategy(!showStrategy)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="luxury-heading-md">Growth Strategy</span>
          </div>
          {showStrategy ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showStrategy && (
          <div className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Phase 1: 0-100 Followers</h4>
                <p className="text-sm text-gray-600">Post 3x daily, focus on conspiracy content, no monetization</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Phase 2: 100-500 Followers</h4>
                <p className="text-sm text-gray-600">Increase to 4x daily, mix trending topics, build authority</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2">Phase 3: 500-1000 Followers</h4>
                <p className="text-sm text-gray-600">Maintain consistency, test product mentions, prepare monetization</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm mb-2">
              <span>Progress to 1K followers</span>
              <span className="font-bold">{Math.round((followerCount / 1000) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((followerCount / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Tips Dropdown */}
      <div className="luxury-card mb-6">
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-green-600" />
            <span className="luxury-heading-md">Best Practices</span>
          </div>
          {showTips ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showTips && (
          <div className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Top Viral Hook Patterns</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Government Money:</strong> "The government spent $2.4M studying this"
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Leaked Files:</strong> "LEAKED: 1973 CIA files finally exposed"
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <strong>Deleted Content:</strong> "They deleted this 3 times from the internet"
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Content Categories</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>Declassified Documents</span>
                    <span className="font-bold text-green-600">95% viral</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>Suppressed Science</span>
                    <span className="font-bold text-green-600">92% viral</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>Psychology Secrets</span>
                    <span className="font-bold text-green-600">90% viral</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Posting Schedule Dropdown */}
      <div className="luxury-card mb-6">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="luxury-heading-md">Posting Schedule</span>
          </div>
          {showSchedule ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showSchedule && (
          <div className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Best Posting Times (EST)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-orange-50 rounded text-sm">
                    <span>6:00 AM - 9:00 AM</span>
                    <span className="font-bold">High engagement</span>
                  </div>
                  <div className="flex justify-between p-2 bg-orange-50 rounded text-sm">
                    <span>12:00 PM - 1:00 PM</span>
                    <span className="font-bold">Medium engagement</span>
                  </div>
                  <div className="flex justify-between p-2 bg-orange-50 rounded text-sm">
                    <span>7:00 PM - 9:00 PM</span>
                    <span className="font-bold">Highest engagement</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Daily Content Mix</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded text-sm">
                    <strong>Morning:</strong> Conspiracy or shocking content
                  </div>
                  <div className="p-2 bg-blue-50 rounded text-sm">
                    <strong>Afternoon:</strong> Educational or science content
                  </div>
                  <div className="p-2 bg-blue-50 rounded text-sm">
                    <strong>Evening:</strong> Psychology or personal content
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Generator */}
      <div className="luxury-card">
        <div className="mb-6">
          <h2 className="luxury-heading-lg mb-2">Generate Content</h2>
          <p className="luxury-body-muted">Create viral content optimized for your growth phase</p>
        </div>
        <RealContentGenerator />
      </div>
    </div>
  )
}