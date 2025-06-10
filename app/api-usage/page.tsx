'use client'

import React, { useState } from 'react'

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
      <div className="luxury-container luxury-padding">
        <div className="luxury-card">
          <div className="text-center">
            <h2 className="luxury-heading-lg mb-4">API Usage Dashboard</h2>
            <p className="luxury-body text-warm-gray-600 mb-6">
              Track usage from your content generation activities
            </p>
            <button 
              onClick={refreshUsageData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Load Usage Data from R2 Storage
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="luxury-container luxury-padding">
      {/* Header */}
      <div className="luxury-card mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="luxury-heading-xl mb-2">API Usage Dashboard</h1>
            <p className="luxury-body-muted">
              Usage data from content generation activities (stored in R2)
            </p>
            {lastRefresh && (
              <p className="luxury-body-small text-warm-gray-400 mt-1">
                Last updated: {lastRefresh}
              </p>
            )}
          </div>
          <div className="text-right">
            <button 
              onClick={refreshUsageData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-3"
            >
              {loading ? 'Loading from R2...' : 'Refresh from R2 Storage'}
            </button>
            <div className="luxury-body-small text-warm-gray-500 mb-1">Total Daily Cost</div>
            <div className="luxury-heading-lg">
              ${usageStats?.summary.dailyTotal.toFixed(2) || '0.00'}
            </div>
            <div className="luxury-body-small text-warm-gray-500 mt-1">
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
            <div key={service} className="luxury-card">
              {/* Service Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" 
                       style={{backgroundColor: getServiceColor(service)}}></div>
                  <h3 className="luxury-heading-md capitalize">
                    {service === 'googleCloud' ? 'Google Cloud' : service}
                  </h3>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                  R2 LOGGED
                </span>
              </div>

              {/* Daily Usage */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="luxury-body-small text-warm-gray-600">Today</span>
                  <span className="luxury-body-small font-medium">
                    ${dailyData.cost.toFixed(3)}
                  </span>
                </div>
                <div className="luxury-body-small text-warm-gray-500">
                  {dailyData.requests} requests
                  {dailyData.tokens ? ` • ${dailyData.tokens.toLocaleString()} tokens` : ''}
                  {(dailyData as any).characters ? ` • ${(dailyData as any).characters.toLocaleString()} chars` : ''}
                </div>
              </div>

              {/* Monthly Usage */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="luxury-body-small text-warm-gray-600">This Month</span>
                  <span className="luxury-body-small font-medium">
                    ${monthlyData.cost.toFixed(2)}
                  </span>
                </div>
                <div className="luxury-body-small text-warm-gray-500">
                  {monthlyData.requests} requests
                  {monthlyData.tokens ? ` • ${monthlyData.tokens.toLocaleString()} tokens` : ''}
                  {(monthlyData as any).characters ? ` • ${(monthlyData as any).characters.toLocaleString()} chars` : ''}
                </div>
              </div>

              {/* Data Source */}
              <div className="pt-4 border-t border-warm-gray-200">
                <div className="luxury-body-small text-warm-gray-600 mb-1">Data Source</div>
                <div className="luxury-body font-medium text-blue-600">
                  R2 Storage Only
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Information */}
      <div className="luxury-card mt-8">
        <h2 className="luxury-heading-lg mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="luxury-heading-md mb-3 text-blue-600">Data Source</h3>
            <ul className="space-y-2 luxury-body-small">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></div>
                <span>Usage logged during content generation only</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></div>
                <span>Data stored in Cloudflare R2 storage</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></div>
                <span>Manual refresh to view current statistics</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></div>
                <span>Zero external API monitoring calls</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="luxury-heading-md mb-3 text-green-600">Privacy & Control</h3>
            <ul className="space-y-2 luxury-body-small">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></div>
                <span>API keys never used for monitoring</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></div>
                <span>Usage data stays in your R2 storage</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></div>
                <span>No background processes or polling</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5"></div>
                <span>Complete control over data refresh</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Free Plan Limits */}
      <div className="luxury-card mt-8 bg-green-50 border-green-200">
        <h2 className="luxury-heading-lg mb-4 text-green-800">Free Plan Capacity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="luxury-heading-md text-green-600">~20 clips/month</div>
            <div className="luxury-body-small text-green-700">Total Capacity</div>
            <div className="luxury-body-small text-green-600 mt-1">Limited by HeyGen (10 credits)</div>
          </div>
          <div className="text-center">
            <div className="luxury-heading-md text-blue-600">$20/month</div>
            <div className="luxury-body-small text-blue-700">OpenAI Budget</div>
            <div className="luxury-body-small text-blue-600 mt-1">4,000-20,000 clip capacity</div>
          </div>
          <div className="text-center">
            <div className="luxury-heading-md text-amber-600">10K credits</div>
            <div className="luxury-body-small text-amber-700">ElevenLabs</div>
            <div className="luxury-body-small text-amber-600 mt-1">65-130 clip capacity</div>
          </div>
          <div className="text-center">
            <div className="luxury-heading-md text-purple-600">$300 credit</div>
            <div className="luxury-body-small text-purple-700">Google Cloud</div>
            <div className="luxury-body-small text-purple-600 mt-1">25,000+ clip capacity</div>
          </div>
        </div>
      </div>

      {/* Implementation Note */}
      <div className="luxury-card mt-8 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
            <span className="text-white text-xs">ℹ</span>
          </div>
          <div>
            <h3 className="luxury-heading-md text-blue-800 mb-2">Content Generation Only</h3>
            <p className="luxury-body-small text-blue-700">
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