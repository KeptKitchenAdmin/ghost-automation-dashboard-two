'use client'

import React, { useState, useEffect } from 'react'
import { RealContentGenerator } from '@/components/RealContentGenerator'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function ContentHub() {
  const [followerCount, setFollowerCount] = useState(0)
  
  useEffect(() => {
    const savedCount = localStorage.getItem('followerCount')
    if (savedCount) setFollowerCount(parseInt(savedCount))
  }, [])

  return (
    <div className="container-app py-8">
      {/* Clean Header */}
      <Card className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white mb-2">Content Generation Hub</h1>
            <p className="text-gray-400">
              Generate viral content optimized for TikTok growth
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Followers</div>
            <div className="text-xl font-medium text-blue-400">{followerCount.toLocaleString()}</div>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => {
                const newCount = prompt('Update follower count:', followerCount.toString())
                if (newCount && !isNaN(parseInt(newCount))) {
                  const count = parseInt(newCount)
                  setFollowerCount(count)
                  localStorage.setItem('followerCount', count.toString())
                }
              }}
              className="mt-1"
            >
              Update
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content Generator */}
      <Card>
        <RealContentGenerator />
      </Card>
    </div>
  )
}