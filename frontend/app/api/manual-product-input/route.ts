import { NextRequest, NextResponse } from 'next/server'
import { viralScriptGenerator } from '@/lib/modules/viral-script-generator'
import { v4 as uuidv4 } from 'uuid'

interface ManualProduct {
  name: string
  price: string
  sales: string
  rating: string
  commission: string
  category?: string
  source?: string
}

interface ManualProductInputRequest {
  products: ManualProduct[]
  scriptsPerProduct?: number
}

interface ManualProductInputResponse {
  success: boolean
  scripts: any[]
  analytics: {
    total_scripts: number
    processing_time: number
    estimated_cost: number
    average_word_count: number
    product_count: number
  }
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ManualProductInputRequest = await request.json()
    const startTime = Date.now()
    
    console.log('📝 Processing manual product input...')
    
    if (!body.products || body.products.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No products provided',
        scripts: [],
        analytics: {
          total_scripts: 0,
          processing_time: 0,
          estimated_cost: 0,
          average_word_count: 0,
          product_count: 0
        },
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }
    
    const scriptsPerProduct = body.scriptsPerProduct || 2
    
    console.log(`🎯 Processing ${body.products.length} manually entered products`)
    console.log(`📊 Generating ${scriptsPerProduct} scripts per product`)
    
    const allScripts: any[] = []
    
    // Process each manual product
    for (const product of body.products) {
      console.log(`📦 Processing: ${product.name}`)
      
      // Generate multiple script variations for each product
      for (let i = 0; i < scriptsPerProduct; i++) {
        const scriptResult = viralScriptGenerator.generateProductContent(
          {
            name: product.name,
            category: categorizeManualProduct(product),
            price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
            monthly_sales: product.sales,
            growth_rate: estimateGrowthFromSales(product.sales),
            competition_level: estimateCompetitionLevel(product.sales)
          },
          Date.now() + i // variation seed
        )
        
        // Enhanced script with manual product insights
        const viralScore = calculateViralScore(scriptResult.script, product)
        const wordCount = scriptResult.script.split(' ').length
        
        const enhancedScript = {
          id: uuidv4(),
          product: {
            name: product.name,
            price: product.price,
            sales: product.sales,
            rating: product.rating,
            commission: product.commission,
            category: categorizeManualProduct(product),
            source: 'manual_input'
          },
          script: {
            full_script: scriptResult.script,
            hook: scriptResult.hooks[0] || generateCustomHook(product),
            problem: generateProblemStatement(product),
            solution: generateSolutionStatement(product),
            cta: generateCustomCTA(product)
          },
          viral_score: viralScore,
          word_count: wordCount,
          duration_estimate: estimateDuration(scriptResult.script),
          claude_insights: {
            pain_point: extractPainPointFromProduct(product),
            emotional_trigger: generateEmotionalTrigger(product),
            target_audience: inferTargetAudience(product),
            sales_psychology: analyzeSalesPsychology(product)
          },
          hooks: scriptResult.hooks,
          hashtags: generateContextualHashtags(product),
          posting_tips: generateCustomPostingTips(product),
          business_rationale: generateBusinessRationale(product),
          generated_at: new Date().toISOString(),
          variation_number: i + 1
        }
        
        allScripts.push(enhancedScript)
      }
    }
    
    const endTime = Date.now()
    const processingTime = (endTime - startTime) / 1000
    
    // Calculate analytics
    const analytics = {
      total_scripts: allScripts.length,
      processing_time: processingTime,
      estimated_cost: 0.015 * allScripts.length, // Slightly lower cost for manual input
      average_word_count: Math.round(
        allScripts.reduce((sum, script) => sum + script.word_count, 0) / allScripts.length
      ),
      product_count: body.products.length
    }
    
    console.log(`✅ Generated ${allScripts.length} scripts from ${body.products.length} manual products`)
    console.log(`⏱️ Processing time: ${processingTime.toFixed(1)}s`)
    
    const response: ManualProductInputResponse = {
      success: true,
      scripts: allScripts.sort((a, b) => b.viral_score - a.viral_score), // Sort by viral score
      analytics,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Manual product input error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      scripts: [],
      analytics: {
        total_scripts: 0,
        processing_time: 0,
        estimated_cost: 0,
        average_word_count: 0,
        product_count: 0
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Helper functions for manual product processing
function categorizeManualProduct(product: ManualProduct): string {
  const name = product.name.toLowerCase()
  
  if (name.includes('beauty') || name.includes('skin') || name.includes('collagen') || name.includes('anti-aging')) {
    return 'beauty_wellness'
  }
  if (name.includes('kitchen') || name.includes('knife') || name.includes('cooking') || name.includes('food')) {
    return 'home_kitchen'
  }
  if (name.includes('car') || name.includes('mount') || name.includes('automotive') || name.includes('vehicle')) {
    return 'automotive'
  }
  if (name.includes('led') || name.includes('light') || name.includes('home') || name.includes('decor')) {
    return 'home_decor'
  }
  if (name.includes('bluetooth') || name.includes('wireless') || name.includes('tech') || name.includes('electronic')) {
    return 'tech_gadgets'
  }
  if (name.includes('fitness') || name.includes('health') || name.includes('workout') || name.includes('exercise')) {
    return 'fitness'
  }
  
  return 'general'
}

function estimateGrowthFromSales(sales: string): string {
  const salesNumber = parseInt(sales.replace(/[^0-9]/g, ''))
  
  if (salesNumber > 20000) return '200%+'
  if (salesNumber > 10000) return '150%'
  if (salesNumber > 5000) return '120%'
  return '100%'
}

function estimateCompetitionLevel(sales: string): string {
  const salesNumber = parseInt(sales.replace(/[^0-9]/g, ''))
  
  if (salesNumber > 25000) return 'High'
  if (salesNumber > 10000) return 'Medium'
  return 'Low'
}

function calculateViralScore(script: string, product: ManualProduct): number {
  let score = 60 // Higher base score for manual input
  
  // Product-specific viral indicators
  const rating = parseFloat(product.rating.replace(/[^0-9.]/g, ''))
  if (rating >= 4.8) score += 15
  else if (rating >= 4.5) score += 10
  else if (rating >= 4.0) score += 5
  
  // Sales volume impact
  const salesNumber = parseInt(product.sales.replace(/[^0-9]/g, ''))
  if (salesNumber > 20000) score += 10
  else if (salesNumber > 10000) score += 7
  else if (salesNumber > 5000) score += 5
  
  // Commission attractiveness
  const commissionRate = parseFloat(product.commission.replace(/[^0-9.]/g, ''))
  if (commissionRate >= 25) score += 8
  else if (commissionRate >= 20) score += 5
  
  // Script quality indicators
  const viralWords = ['amazing', 'incredible', 'game-changer', 'life-changing', 'revolutionary']
  score += viralWords.filter(word => script.toLowerCase().includes(word)).length * 3
  
  return Math.min(100, Math.max(0, score))
}

function generateCustomHook(product: ManualProduct): string {
  const hooks = [
    `This ${product.name} has ${product.sales} and here's why...`,
    `${product.rating} stars can't be wrong about this ${product.name}...`,
    `I tested this ${product.name} so you don't have to...`,
    `Everyone's buying this ${product.name} but here's the truth...`,
    `This ${product.name} is trending for a reason...`
  ]
  
  return hooks[Math.floor(Math.random() * hooks.length)]
}

function generateProblemStatement(product: ManualProduct): string {
  const category = categorizeManualProduct(product)
  const problems: Record<string, string> = {
    beauty_wellness: 'Struggling with visible signs of aging and skin concerns',
    home_kitchen: 'Frustrated with dull kitchen tools that make cooking difficult',
    automotive: 'Dangerous phone fumbling while driving',
    home_decor: 'Living with boring, outdated lighting',
    tech_gadgets: 'Can\'t sleep comfortably with traditional headphones',
    fitness: 'No time for gym visits and expensive memberships',
    general: 'Daily frustrations that seem impossible to solve'
  }
  
  return problems[category] || problems.general
}

function generateSolutionStatement(product: ManualProduct): string {
  return `${product.name} solves this problem with proven results - ${product.sales} and ${product.rating} prove it works`
}

function generateCustomCTA(product: ManualProduct): string {
  const ctas = [
    `Comment 'LINK' for this ${product.name}!`,
    `Save this post and get yours today!`,
    `Follow for more ${categorizeManualProduct(product)} finds!`,
    `Share with someone who needs this!`,
    `Link in bio for this game-changer!`
  ]
  
  return ctas[Math.floor(Math.random() * ctas.length)]
}

function extractPainPointFromProduct(product: ManualProduct): string {
  const category = categorizeManualProduct(product)
  const painPoints: Record<string, string> = {
    beauty_wellness: 'Aging skin and loss of youthful appearance',
    home_kitchen: 'Inefficient cooking tools and meal preparation',
    automotive: 'Unsafe phone usage while driving',
    home_decor: 'Inadequate lighting and boring home aesthetics',
    tech_gadgets: 'Discomfort during sleep and relaxation',
    fitness: 'Lack of convenient exercise options',
    general: 'Unmet daily needs and frustrations'
  }
  
  return painPoints[category] || painPoints.general
}

function generateEmotionalTrigger(product: ManualProduct): string {
  const rating = parseFloat(product.rating.replace(/[^0-9.]/g, ''))
  const salesNumber = parseInt(product.sales.replace(/[^0-9]/g, ''))
  
  if (rating >= 4.8 && salesNumber > 15000) {
    return 'FOMO - everyone else is already benefiting from this'
  }
  if (rating >= 4.5) {
    return 'Trust and social proof from thousands of satisfied customers'
  }
  
  return 'Curiosity about how this product could improve their life'
}

function inferTargetAudience(product: ManualProduct): string {
  const category = categorizeManualProduct(product)
  const audiences: Record<string, string> = {
    beauty_wellness: 'Health-conscious individuals, women 25-45, anti-aging market',
    home_kitchen: 'Home cooks, cooking enthusiasts, kitchen upgrade seekers',
    automotive: 'Daily commuters, safety-conscious drivers, tech adopters',
    home_decor: 'Home improvement enthusiasts, renters, mood lighting seekers',
    tech_gadgets: 'Sleep optimization seekers, tech enthusiasts, wellness focused',
    fitness: 'Busy professionals, home workout enthusiasts, health conscious',
    general: 'General consumers seeking convenience and quality'
  }
  
  return audiences[category] || audiences.general
}

function analyzeSalesPsychology(product: ManualProduct): string {
  const salesNumber = parseInt(product.sales.replace(/[^0-9]/g, ''))
  const rating = parseFloat(product.rating.replace(/[^0-9.]/g, ''))
  
  let psychology = `Social proof from ${product.sales} creates trust. `
  psychology += `${product.rating} rating builds credibility. `
  
  if (salesNumber > 20000) {
    psychology += 'High sales volume suggests viral popularity and FOMO.'
  } else if (salesNumber > 10000) {
    psychology += 'Strong sales indicate proven market demand.'
  } else {
    psychology += 'Emerging product with growth potential.'
  }
  
  return psychology
}

function generateContextualHashtags(product: ManualProduct): string[] {
  const category = categorizeManualProduct(product)
  const baseHashtags = ['#viral', '#trending', '#musthave', '#review']
  
  const categoryHashtags: Record<string, string[]> = {
    beauty_wellness: ['#beauty', '#antiaging', '#skincare', '#wellness'],
    home_kitchen: ['#kitchen', '#cooking', '#foodprep', '#chef'],
    automotive: ['#car', '#safety', '#driving', '#cartech'],
    home_decor: ['#homedecor', '#lighting', '#moodlighting', '#interior'],
    tech_gadgets: ['#tech', '#sleep', '#wellness', '#gadgets'],
    fitness: ['#fitness', '#health', '#workout', '#homegym'],
    general: ['#lifestyle', '#convenient', '#quality', '#recommended']
  }
  
  return [...baseHashtags, ...categoryHashtags[category] || categoryHashtags.general]
}

function generateCustomPostingTips(product: ManualProduct): string[] {
  const tips = [
    `Highlight the ${product.rating} rating for credibility`,
    `Mention ${product.sales} for social proof`,
    `Show before/after or demo if possible`,
    `Post during peak engagement hours for your audience`,
    `Respond to comments quickly to boost engagement`
  ]
  
  const category = categorizeManualProduct(product)
  if (category === 'beauty_wellness') {
    tips.push('Use natural lighting for beauty product demos')
  }
  if (category === 'tech_gadgets') {
    tips.push('Show the product in use for tech demos')
  }
  
  return tips
}

function generateBusinessRationale(product: ManualProduct): string {
  const commissionRate = parseFloat(product.commission.replace(/[^0-9.]/g, ''))
  const category = categorizeManualProduct(product)
  
  return `Manual input product with ${product.commission} commission rate. Category: ${category}. High engagement potential due to ${product.rating} rating and ${product.sales}. Proven market demand with strong conversion indicators.`
}

function estimateDuration(script: string): number {
  const wordCount = script.split(' ').length
  return Math.round((wordCount / 150) * 60 * 10) / 10 // 150 words per minute
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'Manual Product Input API - TypeScript Version',
    description: 'Process manually entered products for viral content generation',
    features: [
      'Custom product input processing',
      'Enhanced viral scoring for manual products',
      'Category-specific content optimization',
      'Sales psychology analysis',
      'No Python dependencies'
    ],
    sample_request: {
      products: [
        {
          name: 'Example Product Name',
          price: '$29.99',
          sales: '10,000+ sold',
          rating: '4.7/5',
          commission: '25%'
        }
      ],
      scriptsPerProduct: 2
    }
  })
}