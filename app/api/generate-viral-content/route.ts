
import { NextRequest, NextResponse } from 'next/server'
import { viralScriptGenerator } from '../../../lib/modules/viral-script-generator'
import { fastmossProductDiscovery } from '../../../lib/modules/fastmoss-integration'
import { v4 as uuidv4 } from 'uuid'

interface TrendingProduct {
  name: string
  price: string
  sales?: string
  rating?: string
  commission?: string
  category?: string
  description?: string
}

interface GenerateViralContentRequest {
  useCustomProducts?: boolean
  customProducts?: TrendingProduct[]
  scriptsPerProduct?: number
}

interface GenerateViralContentResponse {
  success: boolean
  scripts: any[]
  analytics: {
    total_scripts: number
    generation_time: number
    estimated_cost: number
    average_word_count: number
    categories_processed: string[]
  }
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateViralContentRequest = await request.json()
    const startTime = Date.now()
    
    console.log('🚀 Starting viral content generation...')
    
    // Default trending products
    const defaultTrendingProducts: TrendingProduct[] = [
      {
        name: 'Wireless Magnetic Car Phone Mount with Fast Charging',
        price: '$19.99',
        sales: '25,000+ sold',
        rating: '4.8/5',
        commission: '20%',
        category: 'automotive',
        description: 'Magnetic car mount with wireless charging for phones'
      },
      {
        name: 'LED Strip Lights RGB Color Changing with Remote',
        price: '$15.99',
        sales: '18,000+ sold',
        rating: '4.6/5',
        commission: '22%',
        category: 'home_decor',
        description: 'Color changing LED lights for room decoration'
      },
      {
        name: 'Bluetooth Sleep Headphones Wireless Headband',
        price: '$24.99',
        sales: '12,000+ sold',
        rating: '4.7/5',
        commission: '25%',
        category: 'tech_gadgets',
        description: 'Comfortable headband with built-in bluetooth speakers for sleep'
      },
      {
        name: 'Collagen Peptides Powder Anti-Aging Supplement',
        price: '$39.99',
        sales: '15,000+ sold',
        rating: '4.9/5',
        commission: '30%',
        category: 'beauty_wellness',
        description: 'Hydrolyzed collagen powder for skin health and anti-aging'
      },
      {
        name: 'Electric Kitchen Knife Sharpener Professional',
        price: '$29.99',
        sales: '8,500+ sold',
        rating: '4.5/5',
        commission: '18%',
        category: 'home_kitchen',
        description: 'Professional electric knife sharpener for kitchen knives'
      }
    ]
    
    // Choose products to process
    const productsToProcess = body.useCustomProducts && body.customProducts 
      ? body.customProducts 
      : defaultTrendingProducts
    
    const scriptsPerProduct = body.scriptsPerProduct || 2
    
    console.log(`📦 Processing ${productsToProcess.length} products with ${scriptsPerProduct} scripts each`)
    
    // Generate scripts for all products
    const allScripts: any[] = []
    const categories: string[] = []
    
    for (const product of productsToProcess) {
      // Add category to tracking
      if (product.category && !categories.includes(product.category)) {
        categories.push(product.category)
      }
      
      // Generate multiple script variations
      for (let i = 0; i < scriptsPerProduct; i++) {
        const scriptResult = viralScriptGenerator.generateProductContent(
          {
            name: product.name,
            category: product.category || 'general',
            price: typeof product.price === 'string' ? parseFloat(product.price) || 0 : product.price,
            monthly_sales: product.sales,
            growth_rate: '100%',
            competition_level: 'Medium'
          },
          Date.now() + i // variation seed
        )
        
        // Calculate viral score based on engagement factors
        const viralScore = calculateViralScore(scriptResult.script)
        const wordCount = scriptResult.script.split(' ').length
        
        const enhancedScript = {
          id: uuidv4(),
          product: {
            name: product.name,
            price: product.price,
            sales: product.sales,
            rating: product.rating,
            commission: product.commission,
            category: product.category
          },
          script: {
            full_script: scriptResult.script,
            hook: scriptResult.hooks[0] || '',
            problem: 'Addresses key pain points',
            solution: `${product.name} solves the problem`,
            cta: 'Link in bio!'
          },
          viral_score: viralScore,
          word_count: wordCount,
          duration_estimate: estimateDuration(scriptResult.script),
          claude_insights: {
            pain_point: extractPainPoint(product),
            emotional_trigger: extractEmotionalTrigger(scriptResult.script),
            target_audience: getTargetAudience(product.category || 'general')
          },
          hooks: scriptResult.hooks,
          hashtags: scriptResult.hashtags,
          posting_tips: scriptResult.posting_tips,
          business_rationale: scriptResult.business_rationale,
          generated_at: new Date().toISOString()
        }
        
        allScripts.push(enhancedScript)
      }
    }
    
    const endTime = Date.now()
    const generationTime = (endTime - startTime) / 1000
    
    // Calculate analytics
    const analytics = {
      total_scripts: allScripts.length,
      generation_time: generationTime,
      estimated_cost: 0.02 * allScripts.length, // Mock cost estimation
      average_word_count: Math.round(
        allScripts.reduce((sum, script) => sum + script.word_count, 0) / allScripts.length
      ),
      categories_processed: categories
    }
    
    console.log(`✅ Generated ${allScripts.length} scripts in ${generationTime.toFixed(1)}s`)
    
    const response: GenerateViralContentResponse = {
      success: true,
      scripts: allScripts.sort((a, b) => b.viral_score - a.viral_score), // Sort by viral score
      analytics,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Viral content generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      scripts: [],
      analytics: {
        total_scripts: 0,
        generation_time: 0,
        estimated_cost: 0,
        average_word_count: 0,
        categories_processed: []
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Helper functions
function calculateViralScore(script: string): number {
  let score = 50 // Base score
  
  // Check for viral elements
  const viralWords = ['amazing', 'incredible', 'shocking', 'mind-blowing', 'life-changing', 'secret', 'truth']
  score += viralWords.filter(word => script.toLowerCase().includes(word)).length * 5
  
  // Check for engagement triggers
  const triggers = ['you', 'your', 'why', 'how', 'what', 'never', 'always']
  score += triggers.filter(trigger => script.toLowerCase().includes(trigger)).length * 2
  
  // Check for social proof
  if (script.toLowerCase().includes('review') || script.toLowerCase().includes('rating')) {
    score += 10
  }
  
  // Check for urgency
  if (script.toLowerCase().includes('now') || script.toLowerCase().includes('today')) {
    score += 8
  }
  
  return Math.min(100, Math.max(0, score))
}

function estimateDuration(script: string): number {
  const wordCount = script.split(' ').length
  return Math.round((wordCount / 150) * 60 * 10) / 10 // 150 words per minute
}

function extractPainPoint(product: TrendingProduct): string {
  const painPoints: Record<string, string> = {
    automotive: 'Fumbling with phone while driving',
    home_decor: 'Boring, outdated room lighting',
    tech_gadgets: 'Discomfort while trying to sleep with headphones',
    beauty_wellness: 'Visible signs of aging and poor skin health',
    home_kitchen: 'Dull knives making cooking frustrating',
    general: 'Common daily frustrations'
  }
  
  return painPoints[product.category || 'general']
}

function extractEmotionalTrigger(script: string): string {
  if (script.toLowerCase().includes('amazing') || script.toLowerCase().includes('incredible')) {
    return 'Excitement and amazement at product capabilities'
  }
  if (script.toLowerCase().includes('frustrated') || script.toLowerCase().includes('annoying')) {
    return 'Relief from daily frustrations'
  }
  if (script.toLowerCase().includes('secret') || script.toLowerCase().includes('truth')) {
    return 'Curiosity about hidden information'
  }
  return 'Desire for improvement and positive change'
}

function getTargetAudience(category: string): string {
  const audiences: Record<string, string> = {
    automotive: 'Busy commuters and road trip enthusiasts',
    home_decor: 'Home improvement enthusiasts and young renters',
    tech_gadgets: 'Sleep-conscious tech users and wellness seekers',
    beauty_wellness: 'Health-conscious individuals focused on anti-aging',
    home_kitchen: 'Home cooks and culinary enthusiasts',
    general: 'General consumer audience'
  }
  
  return audiences[category] || audiences.general
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'Viral Content Generation API - TypeScript Version',
    features: [
      'Automatic viral script generation',
      'Custom product input support',
      'Multiple script variations per product',
      'Performance analytics and scoring',
      'No Python dependencies'
    ],
    environment: {
      typescript_native: true,
      viral_script_generator: 'Ready',
      fastmoss_integration: 'Ready'
    }
  })
}