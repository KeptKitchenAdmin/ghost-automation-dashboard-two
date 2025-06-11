'use client'

import React, { useState, useEffect } from 'react'
import { RealContentGenerator } from '@/components/RealContentGenerator'

export default function ContentHub() {
  const [followerCount, setFollowerCount] = useState(0)
  
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

      {/* Main Content Generator */}
      <div className="luxury-card">
        <RealContentGenerator />
      </div>
    </div>
  )
}