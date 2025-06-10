'use client'

import React, { useState, useEffect } from 'react'
import { 
  Video, 
  Crown, 
  Zap, 
  Play, 
  MoreHorizontal,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Plus,
  Filter,
  Clock,
  CheckCircle,
  Settings,
  Download,
  Upload,
  Bot,
  Image as ImageIcon,
  Users,
  Sparkles,
  Send
} from 'lucide-react'
import { RealContentGenerator } from '@/components/RealContentGenerator'

interface ContentItem {
  id: string
  title: string
  type: 'product_review' | 'suppressed_science' | 'lifestyle_hack' | 'trend_analysis'
  tier: 'heygen_human' | 'image_montage'
  status: 'analyzing' | 'generating' | 'ready_to_post' | 'posted' | 'viral'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  views?: number
  engagement?: number
  revenue?: number
  viral_score: number
  revenue_potential: number
  expected_roi: number
  hook: string
  target_audience: string
  hashtags: string[]
  thumbnail?: string
  video_url?: string
  script_outline?: string[]
  publishedAt?: Date
  generatedAt?: Date
  estimatedCompletionTime?: string
}

export default function ContentHub() {
  const [activeTab, setActiveTab] = useState<'ready_to_post' | 'generating' | 'analyzing' | 'posted'>('ready_to_post')
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadContentPipeline()
  }, [])

  const loadContentPipeline = async () => {
    setLoading(true)
    try {
      // Load content from your smart content generation API
      const response = await fetch('/api/content/generate?limit=10')
      if (response.ok) {
        const data = await response.json()
        // Transform API recommendations into content items with pipeline stages
        const transformedContent = data.data.recommendations.map((rec: any, index: number) => ({
          id: rec.content_id,
          title: rec.title,
          type: rec.content_type,
          tier: rec.recommended_tier,
          status: index < 3 ? 'ready_to_post' : index < 6 ? 'generating' : 'analyzing',
          priority: rec.priority,
          viral_score: rec.viral_score,
          revenue_potential: rec.revenue_potential,
          expected_roi: rec.expected_roi,
          hook: rec.hook,
          target_audience: rec.target_audience,
          hashtags: rec.hashtags,
          script_outline: rec.script_outline,
          generatedAt: index < 3 ? new Date(Date.now() - Math.random() * 3600000) : undefined,
          estimatedCompletionTime: index >= 3 ? `${Math.floor(Math.random() * 3 + 1)} hours` : undefined,
          video_url: index < 3 ? `/content/video_${rec.content_id}.mp4` : undefined
        }))
        setContentItems(transformedContent)
      } else {
        // Fallback with mock pipeline data
        setContentItems(getMockPipelineContent())
      }
    } catch (error) {
      console.error('Failed to load content pipeline:', error)
      setContentItems(getMockPipelineContent())
    }
    setLoading(false)
  }

  const getMockPipelineContent = (): ContentItem[] => [
    {
      id: 'ready_001',
      title: 'I Used This Viral LED Face Mask for 30 Days - Shocking Results',
      type: 'product_review',
      tier: 'heygen_human',
      status: 'ready_to_post',
      priority: 'urgent',
      viral_score: 92,
      revenue_potential: 280,
      expected_roi: 84,
      hook: 'Everyone said this LED mask was just a scam, but after 30 days...',
      target_audience: 'Women 18-35, skincare enthusiasts',
      hashtags: ['#tiktokshop', '#skincare', '#antiaging', '#ledmask', '#beforeandafter'],
      video_url: '/content/led_mask_review.mp4',
      generatedAt: new Date(Date.now() - 1800000), // 30 min ago
      script_outline: ['Hook: Skeptical about LED masks', 'Before: Show skin concerns', 'Demo: Using the mask', 'After: Results', 'CTA: Discount code']
    },
    {
      id: 'ready_002',
      title: 'The Government Studied Starvation Psychology on Americans for 40 Years',
      type: 'suppressed_science',
      tier: 'heygen_human',
      status: 'ready_to_post',
      priority: 'high',
      viral_score: 95,
      revenue_potential: 0,
      expected_roi: 75,
      hook: 'The government did starvation experiments on Americans and this explains why every diet fails...',
      target_audience: 'Truth-seekers, health-conscious, diet culture critics',
      hashtags: ['#suppressed', '#dietculture', '#truth', '#psychology', '#mindblown'],
      video_url: '/content/starvation_study.mp4',
      generatedAt: new Date(Date.now() - 3600000), // 1 hour ago
      script_outline: ['Hook: Government starvation study', 'Experiment details', 'Psychological damage', 'Modern impact', 'CTA: Follow for truth']
    },
    {
      id: 'ready_003',
      title: 'This Smart Water Bottle Actually Changed My Health',
      type: 'product_review',
      tier: 'heygen_human',
      status: 'ready_to_post',
      priority: 'high',
      viral_score: 88,
      revenue_potential: 150,
      expected_roi: 45,
      hook: 'I was dehydrated for years until I got this smart water bottle',
      target_audience: 'Health-conscious 20-40, tech lovers',
      hashtags: ['#smartwater', '#healthtech', '#hydration', '#wellness', '#tiktokshop'],
      video_url: '/content/smart_bottle.mp4',
      generatedAt: new Date(Date.now() - 2700000), // 45 min ago
    },
    {
      id: 'gen_001',
      title: 'BMI Was Invented by an Astronomer, Not a Doctor',
      type: 'suppressed_science',
      tier: 'heygen_human',
      status: 'generating',
      priority: 'high',
      viral_score: 85,
      revenue_potential: 0,
      expected_roi: 60,
      hook: 'Your doctor uses BMI to judge your health but it was invented by an astronomer in 1830...',
      target_audience: 'Body positive advocates, health-conscious',
      hashtags: ['#bmi', '#bodypositive', '#medicallies', '#health', '#truth'],
      estimatedCompletionTime: '2 hours'
    },
    {
      id: 'gen_002',
      title: 'This Declassified Document Proves Media Control Since 1950s',
      type: 'trend_analysis',
      tier: 'image_montage',
      status: 'generating',
      priority: 'medium',
      viral_score: 78,
      revenue_potential: 0,
      expected_roi: 25,
      hook: 'This declassified CIA document shows they\'ve been controlling the news since the 1950s...',
      target_audience: 'Conspiracy theorists, media critics',
      hashtags: ['#declassified', '#cia', '#media', '#conspiracy', '#truth'],
      estimatedCompletionTime: '1 hour'
    },
    {
      id: 'analyze_001',
      title: 'Posture Corrector Belt Review',
      type: 'product_review',
      tier: 'heygen_human',
      status: 'analyzing',
      priority: 'medium',
      viral_score: 82,
      revenue_potential: 200,
      expected_roi: 50,
      hook: 'This invisible posture belt fixed my back pain in 2 weeks',
      target_audience: 'Desk workers, students, back pain sufferers',
      hashtags: ['#posture', '#backpain', '#health', '#productivity', '#tiktokshop'],
      estimatedCompletionTime: '3 hours'
    }
  ]

  const filteredContent = contentItems.filter(item => {
    if (activeTab === 'posted') return item.status === 'posted' || item.status === 'viral'
    return item.status === activeTab
  })

  const getTabCounts = () => {
    return {
      ready_to_post: contentItems.filter(item => item.status === 'ready_to_post').length,
      generating: contentItems.filter(item => item.status === 'generating').length,
      analyzing: contentItems.filter(item => item.status === 'analyzing').length,
      posted: contentItems.filter(item => item.status === 'posted' || item.status === 'viral').length
    }
  }

  const tabCounts = getTabCounts()

  return (
    <div style={{backgroundColor: 'var(--luxury-white)', minHeight: '100vh'}}>
      <div className="luxury-container">
        
        {/* Header Section */}
        <div className="text-center luxury-section">
          <h1 className="luxury-heading-xl">
            Content Studio
          </h1>
          <p className="luxury-body-muted max-w-2xl mx-auto">
            Generate high-converting viral content with intelligent A/B testing and audience optimization
          </p>
        </div>
        
        <div className="flex items-center justify-between luxury-section">
          <div></div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = '/shadowban-safe'}
              className="luxury-button-secondary"
            >
              Advanced Options
            </button>
            <button 
              onClick={loadContentPipeline}
              className="luxury-button-primary"
            >
              Generate Content
            </button>
          </div>
        </div>

        {/* Content Generator */}
        <div className="luxury-section">
          <RealContentGenerator />
        </div>
        
      </div>
    </div>
  )
}