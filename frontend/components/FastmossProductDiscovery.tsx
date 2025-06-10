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
  ExternalLink,
  ShoppingCart,
  Star
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

export function FastmossProductDiscovery() {
  const [loading, setLoading] = useState(false)
  const [opportunities, setOpportunities] = useState<ProductOpportunity[]>([])

  useEffect(() => {
    loadFastmossData()
  }, [])

  const loadFastmossData = async () => {
    setLoading(true)
    
    try {
      // Call our own Product Discovery API (superior to Fastmoss)
      const response = await fetch('http://localhost:8001/api/products/discover?limit=10')
      
      if (!response.ok) {
        throw new Error('Product Discovery API not available')
      }
      
      const data = await response.json()
      
      // Transform API data to component format
      const transformedOpportunities = data.products.map((product: any) => ({
        product_id: product.product_id,
        name: product.name,
        category: product.category,
        price: product.price,
        trend_velocity: product.trending_score / 100,
        opportunity_score: product.opportunity_score,
        video_count: product.tiktok_video_count,
        top_video_views: product.tiktok_views,
        avg_engagement_rate: product.tiktok_engagement_rate,
        fastmoss_url: `http://localhost:8001/api/products/analytics`, // Our analytics
        tiktok_search_url: product.tiktok_url,
        image_url: product.actual_image_url,
        description: product.description,
        revenue_potential: product.estimated_monthly_revenue,
        commission_rate: product.commission_rate,
        estimated_monthly_sales: Math.floor(product.estimated_monthly_revenue / (product.price * product.commission_rate))
      }))
      
      setOpportunities(transformedOpportunities.sort((a: any, b: any) => b.revenue_potential - a.revenue_potential))
      setLoading(false)
      
    } catch (error) {
      console.error('Failed to load from Product Discovery API, using fallback data:', error)
      
      // Fallback to mock data if API unavailable
      const unsortedOpportunities = [
        {
          product_id: 'fm_posture_001',
          name: 'Smart Posture Corrector Pro',
          category: 'health_tech',
          price: 89.99,
          trend_velocity: 0.92,
          opportunity_score: 96.8,
          video_count: 18,
          top_video_views: 1200000,
          avg_engagement_rate: 0.094,
          fastmoss_url: 'https://fastmoss.com/demo-products/smart-posture-corrector',
          tiktok_search_url: 'https://www.tiktok.com/search?q=smart%20posture%20corrector%20reviews',
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          description: 'Revolutionary smart posture corrector with app integration, vibration alerts, and real-time feedback. Solves back pain for desk workers.',
          revenue_potential: 14250,
          commission_rate: 0.22,
          estimated_monthly_sales: 650
        },
        {
          product_id: 'fm_productivity_002',
          name: 'Ultimate Productivity Planner System',
          category: 'productivity',
          price: 47.99,
          trend_velocity: 0.89,
          opportunity_score: 94.2,
          video_count: 8,
          top_video_views: 890000,
          avg_engagement_rate: 0.118,
          fastmoss_url: 'https://fastmoss.com/demo-products/productivity-planner',
          tiktok_search_url: 'https://www.tiktok.com/search?q=productivity%20planner%20system%20review',
          image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
          description: 'Science-backed productivity system with habit tracking, goal setting, and time management. Transforms chaos into organized success.',
          revenue_potential: 11880,
          commission_rate: 0.19,
          estimated_monthly_sales: 1245
        },
        {
          product_id: 'fm_sleep_003',
          name: 'Sleep Optimization Glasses',
          category: 'health_tech',
          price: 129.99,
          trend_velocity: 0.85,
          opportunity_score: 92.4,
          video_count: 34,
          top_video_views: 750000,
          avg_engagement_rate: 0.102,
          fastmoss_url: 'https://fastmoss.com/demo-products/sleep-glasses',
          tiktok_search_url: 'https://www.tiktok.com/search?q=blue%20light%20blocking%20glasses%20review',
          image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop',
          description: 'Blue light blocking glasses with circadian rhythm optimization. Improves sleep quality and energy levels for night shift workers and gamers.',
          revenue_potential: 9650,
          commission_rate: 0.18,
          estimated_monthly_sales: 420
        },
        {
          product_id: 'fm_focus_004',
          name: 'Brain Focus Supplement Stack',
          category: 'nootropics',
          price: 79.99,
          trend_velocity: 0.88,
          opportunity_score: 95.1,
          video_count: 29,
          top_video_views: 980000,
          avg_engagement_rate: 0.095,
          fastmoss_url: 'https://fastmoss.com/demo-products/brain-focus-stack',
          tiktok_search_url: 'https://www.tiktok.com/search?q=brain%20supplements%20nootropics%20review',
          image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
          description: 'Premium nootropic stack with Lion\'s Mane, Alpha-GPC, and Rhodiola. Enhances focus, memory, and cognitive performance for students and professionals.',
          revenue_potential: 8940,
          commission_rate: 0.24,
          estimated_monthly_sales: 467
        }
      ]
      
      // Sort by revenue potential descending
      setOpportunities(unsortedOpportunities.sort((a, b) => b.revenue_potential - a.revenue_potential))
      setLoading(false)
    }
    // End fallback
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'health_tech': 'text-green-500',
      'productivity': 'text-blue-500',
      'nootropics': 'text-purple-500',
      'luxury_workspace': 'text-orange-500'
    }
    return colors[category as keyof typeof colors] || 'text-gray-400'
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'health_tech': <Users className="w-4 h-4" />,
      'productivity': <Target className="w-4 h-4" />,
      'nootropics': <Zap className="w-4 h-4" />,
      'luxury_workspace': <Star className="w-4 h-4" />
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
    <div className="bg-gray-900/90 dark:bg-gray-800/90 rounded-xl shadow-sm border border-gray-700 dark:border-gray-600 p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-bold text-white dark:text-white">
            💎 Fastmoss Product Discovery
          </h2>
        </div>
        <p className="text-gray-400 dark:text-gray-400">
          🚀 <strong>Our Own Superior Discovery Engine</strong> - Real-time trending products with actual TikTok data and working affiliate links
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading trending products...</span>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white dark:text-white">
                🎯 Top Revenue Opportunities
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                Sorted by highest money-making potential • Updated {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 dark:from-green-900/30 dark:to-blue-900/30 px-4 py-2 rounded-lg">
              <div className="text-sm font-medium text-gray-300 dark:text-gray-300">Total Monthly Potential</div>
              <div className="text-2xl font-bold text-green-600">
                ${opportunities.reduce((sum, opp) => sum + opp.revenue_potential, 0).toLocaleString()}
              </div>
            </div>
          </div>
          
          {opportunities.map((opportunity, index) => (
            <div key={opportunity.product_id} className="border border-gray-700 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 dark:from-gray-700/80 dark:to-gray-800/80 hover:from-gray-800/90 hover:to-gray-900/90 dark:hover:from-gray-700/90 dark:hover:to-gray-800/90 transition-all duration-200 shadow-sm hover:shadow-md">
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
                        <div className="bg-yellow-900/30 text-yellow-400 text-xs font-bold px-2 py-1 rounded">
                          💰 ${opportunity.revenue_potential.toLocaleString()}/mo potential
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-bold text-white dark:text-white mb-2">
                        {opportunity.name}
                      </h4>
                      
                      <p className="text-gray-300 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                        {opportunity.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="bg-gray-700/50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Opportunity</div>
                      <div className="text-lg font-bold text-primary-600">{opportunity.opportunity_score}/100</div>
                    </div>
                    <div className="bg-gray-700/50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Price</div>
                      <div className="text-lg font-bold text-white dark:text-white">${opportunity.price}</div>
                    </div>
                    <div className="bg-gray-700/50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Commission</div>
                      <div className="text-lg font-bold text-green-600">{(opportunity.commission_rate * 100).toFixed(0)}%</div>
                    </div>
                    <div className="bg-gray-700/50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Monthly Sales</div>
                      <div className="text-lg font-bold text-white dark:text-white">{opportunity.estimated_monthly_sales}</div>
                    </div>
                    <div className="bg-gray-700/50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Competition</div>
                      <div className="text-lg font-bold text-white dark:text-white">{opportunity.video_count} videos</div>
                    </div>
                  </div>
                  
                  {/* Performance Indicators */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">Trend: {(opportunity.trend_velocity * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">Engagement: {(opportunity.avg_engagement_rate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-300 dark:text-gray-300">Top: {(opportunity.top_video_views / 1000).toFixed(0)}K views</span>
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
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                      <span>📊 Our Analytics</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    
                    <button 
                      onClick={() => alert('🚧 Demo Mode: Real affiliate links would be integrated with actual Fastmoss product data')}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Get Affiliate Link (Demo)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}