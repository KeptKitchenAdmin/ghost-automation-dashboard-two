'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface UsageStats {
  daily: {
    openai: { tokens: number; requests: number; cost: number };
    anthropic: { tokens: number; requests: number; cost: number };
    elevenlabs: { characters: number; requests: number; cost: number };
    heygen: { requests: number; cost: number };
    googleCloud: { requests: number; cost: number };
  };
  monthly: {
    openai: { tokens: number; requests: number; cost: number };
    anthropic: { tokens: number; requests: number; cost: number };
    elevenlabs: { characters: number; requests: number; cost: number };
    heygen: { requests: number; cost: number };
    googleCloud: { requests: number; cost: number };
  };
  summary: {
    dailyTotal: number;
    monthlyTotal: number;
    lastUpdated: string;
  };
}

// Get usage statistics from R2 storage ONLY - NO EXTERNAL API CALLS
const getUsageStatsFromR2 = async (): Promise<UsageStats> => {
  try {
    const response = await fetch('/api/usage/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.success) {
      return result.stats
    } else {
      throw new Error(result.error || 'Failed to fetch usage stats')
    }
  } catch (error) {
    console.error('Failed to fetch usage stats from R2:', error)
    
    // Return empty state - NO FAKE DATA
    return createEmptyStats()
  }
}

function createEmptyStats(): UsageStats {
  return {
    daily: {
      openai: { tokens: 0, requests: 0, cost: 0 },
      anthropic: { tokens: 0, requests: 0, cost: 0 },
      elevenlabs: { characters: 0, requests: 0, cost: 0 },
      heygen: { requests: 0, cost: 0 },
      googleCloud: { requests: 0, cost: 0 }
    },
    monthly: {
      openai: { tokens: 0, requests: 0, cost: 0 },
      anthropic: { tokens: 0, requests: 0, cost: 0 },
      elevenlabs: { characters: 0, requests: 0, cost: 0 },
      heygen: { requests: 0, cost: 0 },
      googleCloud: { requests: 0, cost: 0 }
    },
    summary: {
      dailyTotal: 0,
      monthlyTotal: 0,
      lastUpdated: new Date().toISOString()
    }
  }
}

export default function APIUsagePage() {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<string>('')

  // Manual refresh - reads ONLY from R2 storage, NO EXTERNAL API CALLS
  const refreshUsageData = async () => {
    setLoading(true)
    try {
      const stats = await getUsageStatsFromR2()
      setUsageStats(stats)
      setLastRefresh(new Date().toLocaleString())
    } catch (error) {
      console.error('Failed to refresh usage data from R2:', error)
      setUsageStats(createEmptyStats())
    } finally {
      setLoading(false)
    }
  }

  // Load data once on mount - NO INTERVALS OR POLLING
  React.useEffect(() => {
    refreshUsageData()
  }, [])

  const getServiceColor = (service: string): string => {
    const colors: Record<string, string> = {
      openai: '#10B981',     // Green
      anthropic: '#8B5CF6',  // Purple  
      elevenlabs: '#F59E0B', // Amber
      heygen: '#EF4444',     // Red
      googleCloud: '#3B82F6' // Blue
    }
    return colors[service] || '#6B7280'
  }

  if (!usageStats && !loading) {
    return (
      <div className="container-app py-8">
        <div className="card p-6">
          <div className="text-center">
            <h2 className="text-xl font-medium text-white mb-4">API Usage Dashboard</h2>
            <p className="text-gray-400 mb-6">
              Track usage from your content generation activities
            </p>
            <button 
              onClick={refreshUsageData}
              className="btn-primary"
            >
              Load Usage Data
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white mb-2">API Usage Dashboard</h1>
            <p className="text-gray-400">
              Real-time usage tracking from your content generation
            </p>
            {lastRefresh && (
              <p className="text-sm text-gray-400 mt-1">
                Last updated: {lastRefresh}
              </p>
            )}
          </div>
          <div className="text-right">
            <button 
              onClick={refreshUsageData}
              disabled={loading}
              className="btn-primary mb-3"
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
            <div className="text-sm text-gray-500 mb-1">Total Daily Cost</div>
            <div className="text-xl font-medium text-white mb-4">
              ${usageStats?.summary.dailyTotal.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Monthly: ${usageStats?.summary.monthlyTotal.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['openai', 'anthropic', 'elevenlabs', 'heygen', 'googleCloud'].map((service) => {
          const dailyData = usageStats?.daily[service as keyof typeof usageStats.daily] || { tokens: 0, characters: 0, requests: 0, cost: 0 };
          const monthlyData = usageStats?.monthly[service as keyof typeof usageStats.monthly] || { tokens: 0, characters: 0, requests: 0, cost: 0 };
          
          return (
            <div key={service} className="card p-6">
              {/* Service Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" 
                       style={{backgroundColor: getServiceColor(service)}}></div>
                  <h3 className="text-lg font-medium text-white capitalize">
                    {service === 'googleCloud' ? 'Google Cloud' : service}
                  </h3>
                </div>
              </div>

              {/* Daily Usage */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Today</span>
                  <span className="text-sm font-medium text-white">
                    ${dailyData.cost.toFixed(3)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {dailyData.requests} requests
                  {dailyData.tokens ? ` • ${dailyData.tokens.toLocaleString()} tokens` : ''}
                  {(dailyData as any).characters ? ` • ${(dailyData as any).characters.toLocaleString()} chars` : ''}
                </div>
              </div>

              {/* Monthly Usage */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">This Month</span>
                  <span className="text-sm font-medium text-white">
                    ${monthlyData.cost.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {monthlyData.requests} requests
                  {monthlyData.tokens ? ` • ${monthlyData.tokens.toLocaleString()} tokens` : ''}
                  {(monthlyData as any).characters ? ` • ${(monthlyData as any).characters.toLocaleString()} chars` : ''}
                </div>
              </div>

              {/* Available Credits */}
              <div className="mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600">
                <div className="text-sm text-gray-400 mb-2">Available Credits</div>
                {service === 'openai' && (
                  <div className="text-sm font-medium text-green-400">
                    ${monthlyData.cost.toFixed(2)} / $20.00 used
                  </div>
                )}
                {service === 'elevenlabs' && (
                  <div className="text-sm font-medium text-green-400">
                    {(monthlyData as any).characters || 0} / 10,000 credits used
                  </div>
                )}
                {service === 'heygen' && (
                  <div className="text-sm font-medium text-green-400">
                    {monthlyData.requests * 0.5} / 10 credits used
                  </div>
                )}
                {service === 'googleCloud' && (
                  <div className="text-sm font-medium text-green-400">
                    ${monthlyData.cost.toFixed(2)} / $300.00 used
                  </div>
                )}
                {service === 'anthropic' && (
                  <div className="text-sm font-medium text-green-400">
                    ${monthlyData.cost.toFixed(2)} / $15.00 used
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* System Information */}
      <div className="card p-6 mt-8">
        <h2 className="text-xl font-medium text-white mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-blue-400 mb-3">Data Source</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></div>
                <span className="text-gray-300">Usage logged during content generation only</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></div>
                <span className="text-gray-300">Secure data storage with instant access</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></div>
                <span className="text-gray-300">Manual refresh to view current statistics</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></div>
                <span className="text-gray-300">Zero external API monitoring calls</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-green-400 mb-3">Privacy & Control</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></div>
                <span className="text-gray-300">API keys never used for monitoring</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></div>
                <span className="text-gray-300">Your usage data stays private and secure</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></div>
                <span className="text-gray-300">No background processes or polling</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></div>
                <span className="text-gray-300">Complete control over data refresh</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Free Plan Limits */}
      <div className="card p-6 mt-8 bg-green-900 border-green-700">
        <h2 className="text-xl font-medium text-green-300 mb-4">Free Plan Capacity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-medium text-green-400">~20 clips/month</div>
            <div className="text-sm text-green-500">Total Capacity</div>
            <div className="text-sm text-green-400 mt-1">Limited by HeyGen (10 credits)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-blue-400">$20/month</div>
            <div className="text-sm text-blue-500">OpenAI Budget</div>
            <div className="text-sm text-blue-400 mt-1">4,000-20,000 clip capacity</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-yellow-400">10K credits</div>
            <div className="text-sm text-yellow-500">ElevenLabs</div>
            <div className="text-sm text-yellow-400 mt-1">65-130 clip capacity</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-purple-400">$300 credit</div>
            <div className="text-sm text-purple-500">Google Cloud</div>
            <div className="text-sm text-purple-400 mt-1">25,000+ clip capacity</div>
          </div>
        </div>
      </div>

      {/* Implementation Note */}
      <div className="card p-6 mt-8 bg-blue-900 border-blue-700">
        <div className="flex items-start">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
            <span className="text-white text-xs">ℹ</span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-300 mb-2">Content Generation Only</h3>
            <p className="text-sm text-blue-400">
              This dashboard shows usage data logged during your content generation workflow: 
              OpenAI → HeyGen → ElevenLabs → Google Cloud. No external APIs are called for monitoring purposes.
              All data comes from R2 storage logs created during actual content generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getServiceColor(service: string): string {
  const colors: Record<string, string> = {
    openai: '#10B981',     // Green
    anthropic: '#8B5CF6',  // Purple  
    elevenlabs: '#F59E0B', // Amber
    heygen: '#EF4444',     // Red
    googleCloud: '#3B82F6' // Blue
  }
  return colors[service] || '#6B7280'
}