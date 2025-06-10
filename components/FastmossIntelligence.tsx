'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Eye, 
  DollarSign, 
  Users, 
  BarChart3,
  Lightbulb,
  PlayCircle,
  Star,
  ExternalLink,
  ShoppingCart
} from 'lucide-react'
import Image from 'next/image'

interface ProductOpportunity {
  product_id: string
  name: string
  category: string
  price: number
  trend_velocity: number
  opportunity_score: number
  video_count: number
  top_video_views: number
  avg_engagement_rate: number
  fastmoss_url: string
  tiktok_search_url: string
  image_url: string
  description: string
  revenue_potential: number
  commission_rate: number
  estimated_monthly_sales: number
}

interface VideoPattern {
  pattern_id: string
  hook_type: string
  video_length: number
  presentation_style: string
  voice_type: string
  success_score: number
  engagement_rate: number
  view_count: number
  script_structure: {
    hook: string
    build: string
    cta: string
  }
}

export function FastmossIntelligence() {
  const [activeTab, setActiveTab] = useState('opportunities')
  const [loading, setLoading] = useState(false)
  const [opportunities, setOpportunities] = useState<ProductOpportunity[]>([])
  const [patterns, setPatterns] = useState<VideoPattern[]>([])
  const [contentGaps, setContentGaps] = useState<any[]>([])

  useEffect(() => {
    loadFastmossData()
  }, [])

  const loadFastmossData = async () => {
    setLoading(true)
    
    // Simulate API calls to backend Fastmoss integration
    setTimeout(() => {
      // Set empty arrays for all data
      setOpportunities([])
      setPatterns([])
      setContentGaps([])

      setLoading(false)
    }, 1500)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'luxury_tech': 'text-blue-500',
      'luxury_workspace': 'text-purple-500',
      'health_luxury': 'text-green-500',
      'luxury_beauty': 'text-pink-500'
    }
    return colors[category as keyof typeof colors] || 'text-gray-400'
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'luxury_tech': <Zap className="w-4 h-4" />,
      'luxury_workspace': <Target className="w-4 h-4" />,
      'health_luxury': <Users className="w-4 h-4" />,
      'luxury_beauty': <Star className="w-4 h-4" />
    }
    return icons[category as keyof typeof icons] || <Star className="w-4 h-4" />
  }

  const generateContentIdea = (opportunity: ProductOpportunity) => {
    // Generate Claude-powered content idea based on opportunity
    setLoading(true)
    setTimeout(() => {
      alert(`🤖 Claude Content Idea Generated!\n\nProduct: ${opportunity.name}\nHook: "Most people waste money on ${opportunity.category.replace('_', ' ')} - here's the only one that matters"\nAngle: Authority-based product demo\nCTA: "Link in bio for exclusive discount"`)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Fastmoss Intelligence
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time product opportunities and creative intelligence from trending TikTok data
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'opportunities'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          🎯 Product Opportunities
        </button>
        <button
          onClick={() => setActiveTab('patterns')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'patterns'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          🧠 Winning Patterns
        </button>
        <button
          onClick={() => setActiveTab('gaps')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'gaps'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          💡 Content Gaps
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading Fastmoss data...</span>
        </div>
      )}

      {/* Product Opportunities Tab */}
      {activeTab === 'opportunities' && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Revenue Opportunities
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Sorted by highest money-making potential • Updated {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 px-4 py-2 rounded-lg">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Monthly Potential</div>
              <div className="text-2xl font-bold text-green-600">
                $0
              </div>
            </div>
          </div>
          
          {opportunities.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Product Opportunities Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connect your Fastmoss account to discover high-revenue product opportunities
              </p>
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Connect Fastmoss
              </button>
            </div>
          ) : (
            opportunities.map((opportunity, index) => (
              <div key={opportunity.product_id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/80 dark:to-gray-800/80 hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-700/90 dark:hover:to-gray-800/90 transition-all duration-200 shadow-sm hover:shadow-md">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={opportunity.image_url}
                        alt={opportunity.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`flex items-center space-x-1 ${getCategoryColor(opportunity.category)}`}>
                            {getCategoryIcon(opportunity.category)}
                            <span className="text-sm font-medium capitalize">{opportunity.category.replace('_', ' ')}</span>
                          </div>
                          <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                            💰 ${opportunity.revenue_potential.toLocaleString()}/mo potential
                          </div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {opportunity.name}
                        </h4>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                          {opportunity.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Opportunity</div>
                        <div className="text-lg font-bold text-primary-600">{opportunity.opportunity_score}/100</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Price</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">${opportunity.price}</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Commission</div>
                        <div className="text-lg font-bold text-green-600">{(opportunity.commission_rate * 100).toFixed(0)}%</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Monthly Sales</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{opportunity.estimated_monthly_sales}</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Competition</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{opportunity.video_count} videos</div>
                      </div>
                    </div>
                    
                    {/* Performance Indicators */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Trend: {(opportunity.trend_velocity * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Engagement: {(opportunity.avg_engagement_rate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Top: {(opportunity.top_video_views / 1000).toFixed(0)}K views</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => generateContentIdea(opportunity)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 text-sm font-medium shadow-sm"
                      >
                        <span>🤖 Generate Content</span>
                      </button>
                      
                      <a
                        href={opportunity.tiktok_search_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-sm"
                      >
                        <span>📱 View on TikTok</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      
                      <a
                        href={opportunity.fastmoss_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 text-sm font-medium shadow-sm"
                      >
                        <span>📊 Fastmoss Data</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium shadow-sm">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Get Affiliate Link</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Winning Patterns Tab */}
      {activeTab === 'patterns' && !loading && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Successful Video Patterns
          </h3>
          
          {patterns.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <PlayCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Winning Patterns Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Analyze viral content to identify successful video patterns and script structures
              </p>
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Analyze Content
              </button>
            </div>
          ) : (
            patterns.map((pattern) => (
              <div key={pattern.pattern_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <PlayCircle className="w-5 h-5 text-primary-500" />
                      <span className="font-semibold text-gray-900 dark:text-white capitalize">
                        {pattern.hook_type.replace('_', ' ')} Hook
                      </span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {pattern.success_score}/100
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {pattern.presentation_style} • {pattern.voice_type} voice • {pattern.video_length}s
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Performance</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(pattern.view_count / 1000).toFixed(0)}K views
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hook:</div>
                  <div className="text-gray-900 dark:text-white mb-2">"{pattern.script_structure.hook}"</div>
                  
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Build:</div>
                  <div className="text-gray-900 dark:text-white mb-2">"{pattern.script_structure.build}"</div>
                  
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA:</div>
                  <div className="text-gray-900 dark:text-white">"{pattern.script_structure.cta}"</div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>📊 {(pattern.engagement_rate * 100).toFixed(1)}% engagement</span>
                  <span>🎯 Converts to sales</span>
                  <span>✅ Proven formula</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Content Gaps Tab */}
      {activeTab === 'gaps' && !loading && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Blue Ocean Opportunities
          </h3>
          
          {contentGaps.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <Lightbulb className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Content Gaps Identified
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Discover untapped content opportunities with low competition and high potential
              </p>
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Find Opportunities
              </button>
            </div>
          ) : (
            contentGaps.map((gap, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {gap.product}
                      </span>
                      <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        {gap.gap_type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Opportunity Score</div>
                        <div className="text-lg font-bold text-primary-600">{gap.opportunity_score}/100</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Current Videos</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{gap.current_video_count}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">💡 Suggested Approach:</div>
                      <div className="text-gray-900 dark:text-white">{gap.suggested_approach}</div>
                    </div>
                  </div>
                  
                  <button className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-sm font-medium">
                    🚀 Create Content
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}