export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server'
import { viralScriptGenerator } from '../../../../lib/modules/viral-script-generator'
import { creativeIntelligence } from '../../../../lib/modules/creative-intelligence'
import { fastmossProductDiscovery } from '../../../../lib/modules/fastmoss-integration'
import { kaloDataScraper } from '../../../../lib/modules/kalodata-scraper'

interface RealContentRequest {
  contentType: string
  businessModel: string
  targetProduct?: string
  serviceType?: string
  callToAction?: string
  variationSeed?: number
  useRealData?: boolean
}

interface RealContentResponse {
  success: boolean
  content: {
    script: string
    hooks: string[]
    hashtags: string[]
    postingTips: string[]
    businessRationale: string
    productData?: any
    fastmossData?: any
    kaloData?: any
  }
  dataSource?: {
    fastmoss_connected: boolean
    kalodata_connected: boolean
    real_products_used: boolean
    generation_method: string
    note?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RealContentRequest = await request.json()
    
    console.log('🚀 Generating real content with TypeScript modules...')
    
    const startTime = Date.now()
    
    // Initialize data containers
    let realProductData = null
    let fastmossData = null
    let kaloData = null
    
    // Try to get real FastMoss data
    if (process.env.FASTMOSS_API_KEY) {
      try {
        const trendingProducts = await fastmossProductDiscovery.getTrendingProducts(5)
        if (trendingProducts.length > 0) {
          realProductData = trendingProducts[0]
          fastmossData = {
            total_products: trendingProducts.length,
            top_opportunity_score: trendingProducts[0].opportunity_score,
            categories: [...new Set(trendingProducts.map(p => p.category))],
            avg_trend_velocity: trendingProducts.reduce((sum, p) => sum + p.trend_velocity, 0) / trendingProducts.length
          }
          console.log(`✅ FastMoss data loaded: ${realProductData.name}`)
        }
      } catch (error) {
        console.warn('⚠️ FastMoss data unavailable:', error)
      }
    } else {
      console.log('⚠️ No FastMoss API key found')
    }
    
    // Try to get KaloData
    try {
      const kaloResponse = await kaloDataScraper.scrapeProducts()
      if (kaloResponse.products.length > 0) {
        const topPerformers = await kaloDataScraper.getTopPerformers(3)
        kaloData = {
          products_analyzed: kaloResponse.products.length,
          top_performers: topPerformers,
          market_insights: kaloResponse.insights,
          data_freshness: kaloResponse.data_freshness
        }
        console.log(`✅ KaloData loaded: ${kaloResponse.products.length} products`)
      }
    } catch (error) {
      console.warn('⚠️ KaloData unavailable:', error)
    }
    
    // Generate content based on type
    let content
    const productContext = realProductData ? {
      name: realProductData.name,
      category: realProductData.category,
      price: realProductData.price,
      trend_velocity: realProductData.trend_velocity,
      competition_level: realProductData.competition_level,
      opportunity_score: realProductData.opportunity_score
    } : kaloData?.top_performers?.[0] ? {
      name: kaloData.top_performers[0].name,
      category: kaloData.top_performers[0].category,
      monthly_sales: kaloData.top_performers[0].monthly_sales.toString(),
      growth_rate: kaloData.top_performers[0].growth_rate,
      competition_level: kaloData.top_performers[0].competition_level
    } : {
      name: body.targetProduct || 'this product',
      category: body.contentType.includes('viral') ? 'trending' : 'general',
      context: body.contentType
    }
    
    const variationSeed = body.variationSeed || Date.now()
    
    switch (body.contentType) {
      case 'viral-growth-conspiracy':
        content = creativeIntelligence.generateAuthorityContent('declassified_research', variationSeed)
        break
      
      case 'viral-affiliate':
        content = viralScriptGenerator.generateProductContent(productContext, variationSeed)
        break
      
      case 'luxury-lifestyle':
        content = viralScriptGenerator.generateLifestyleContent(productContext, variationSeed)
        break
      
      case 'client-transformation':
        content = viralScriptGenerator.generateServiceContent(productContext, variationSeed)
        break
      
      case 'ai-demo':
      default:
        content = viralScriptGenerator.generateTechContent(productContext, variationSeed)
        break
    }
    
    // Update call to action if provided
    if (body.callToAction) {
      content.script = content.script.replace(
        /Follow for more.*$/m,
        body.callToAction
      )
    }
    
    const endTime = Date.now()
    console.log(`✅ Content generated in ${(endTime - startTime) / 1000}s`)
    
    // Build response
    const response: RealContentResponse = {
      success: true,
      content: {
        script: content.script,
        hooks: content.hooks,
        hashtags: content.hashtags,
        postingTips: [
          '🔥 TypeScript-powered content generation',
          `📊 FastMoss integration: ${fastmossData ? '✅ Connected' : '⚠️ Using mock data'}`,
          `📈 KaloData integration: ${kaloData ? '✅ Connected' : '⚠️ Using mock data'}`,
          ...content.posting_tips
        ],
        businessRationale: content.business_rationale || 'Content optimized for engagement and conversion',
        productData: realProductData?.to_dict ? realProductData.to_dict() : productContext,
        fastmossData,
        kaloData
      },
      dataSource: {
        fastmoss_connected: !!fastmossData,
        kalodata_connected: !!kaloData,
        real_products_used: !!realProductData,
        generation_method: 'typescript_native',
        note: 'Pure TypeScript implementation - no Python dependencies'
      }
    }
    
    // Optional: Add fact-checking
    if (process.env.FACT_CHECK_ENABLED === 'true') {
      try {
        const factCheckResponse = await fetch(`${request.nextUrl.origin}/api/fact-check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: content.script,
            contentType: body.contentType,
            claims: []
          })
        })
        
        if (factCheckResponse.ok) {
          const factCheck = await factCheckResponse.json()
          if (!factCheck.safeToPublish) {
            response.content.postingTips.unshift(
              `⚠️ Fact-check warning: ${factCheck.overallScore}/100 accuracy`
            )
          }
        }
      } catch (error) {
        console.error('Fact-check failed:', error)
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Content generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      content: {
        script: 'Error generating content',
        hooks: [],
        hashtags: [],
        postingTips: ['Error occurred - please try again'],
        businessRationale: 'Generation failed'
      }
    }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'Real Content Generation API - TypeScript Version',
    features: [
      'Pure TypeScript implementation',
      'FastMoss trending product integration',
      'KaloData market analytics integration',
      'Dynamic hook generation system',
      'No Python dependencies'
    ],
    dataConnections: {
      fastmoss: 'Trending products + opportunity scoring',
      kalodata: 'Market analytics + competition data',
      generation: 'Native TypeScript content generation'
    },
    environment: {
      fastmoss_configured: !!process.env.FASTMOSS_API_KEY,
      kalodata_configured: !!process.env.KALODATA_API_KEY,
      fact_check_enabled: process.env.FACT_CHECK_ENABLED === 'true'
    }
  })
}