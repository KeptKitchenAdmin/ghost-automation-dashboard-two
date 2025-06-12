// Uses Node.js modules, cannot use edge runtime

import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

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
}

function executeRealContentGeneration(request: RealContentRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    // Use environment variable or fallback to relative path for Cloudflare Pages compatibility
    const backendPath = process.env.BACKEND_PATH || '../'
    
    const inputData = {
      content_type: request.contentType,
      business_model: request.businessModel,
      target_product: request.targetProduct || 'viral content',
      service_type: request.serviceType,
      call_to_action: request.callToAction || 'Follow for more content like this',
      variation_seed: request.variationSeed || Date.now(),
      use_real_data: request.useRealData !== false
    }
    
    const pythonProcess = spawn('python3', ['-c', `
import sys
import json
import os
sys.path.append('${backendPath}')

try:
    from modules.fastmoss_integration import FastmossProductDiscovery
    from modules.kolodata_scraper import KoloDataScraper
    from modules.viral_script_generator import ViralScriptGenerator
    from modules.creative_intelligence import CreativeIntelligence
    import asyncio
    from datetime import datetime
    import random

    async def main():
        try:
            # Read input from stdin
            input_data = json.loads(input())
            content_type = input_data['content_type']
            target_product = input_data['target_product']
            variation_seed = input_data['variation_seed']
            
            print(f"🔍 Generating real content for: {content_type}", file=sys.stderr)
            
            real_product_data = None
            fastmoss_data = None
            kalo_data = None
            
            # Try to get real FastMoss data
            try:
                if os.getenv('FASTMOSS_API_KEY'):
                    fastmoss = FastmossProductDiscovery()
                    trending_products = await fastmoss.get_trending_products(limit=5)
                    if trending_products:
                        # Filter by content type or use top product
                        real_product_data = trending_products[0]
                        fastmoss_data = {
                            'total_products': len(trending_products),
                            'top_opportunity_score': trending_products[0].opportunity_score if trending_products else 0,
                            'categories': list(set([p.category for p in trending_products])),
                            'avg_trend_velocity': sum([p.trend_velocity for p in trending_products]) / len(trending_products) if trending_products else 0
                        }
                        print(f"✅ FastMoss data loaded: {real_product_data.name}", file=sys.stderr)
                else:
                    print("⚠️ No FastMoss API key found", file=sys.stderr)
            except Exception as e:
                print(f"⚠️ FastMoss data unavailable: {e}", file=sys.stderr)
            
            # Try to get real KaloData
            try:
                if os.path.exists(f'{backendPath}/data') and any(f.startswith('kalodata_') for f in os.listdir(f'{backendPath}/data')):
                    # Load most recent KaloData file
                    data_dir = f'{backendPath}/data'
                    kalo_files = [f for f in os.listdir(data_dir) if f.startswith('kalodata_') and f.endswith('.json')]
                    if kalo_files:
                        latest_file = sorted(kalo_files)[-1]
                        with open(os.path.join(data_dir, latest_file), 'r') as f:
                            kalo_raw = json.load(f)
                            if kalo_raw.get('products'):
                                kalo_data = {
                                    'products_analyzed': len(kalo_raw['products']),
                                    'top_performers': kalo_raw['products'][:3],
                                    'market_insights': kalo_raw.get('insights', {}),
                                    'data_freshness': latest_file
                                }
                                print(f"✅ KaloData loaded: {len(kalo_raw['products'])} products", file=sys.stderr)
                else:
                    print("⚠️ No KaloData files found", file=sys.stderr)
            except Exception as e:
                print(f"⚠️ KaloData unavailable: {e}", file=sys.stderr)
            
            # Generate intelligent content based on real data
            generator = ViralScriptGenerator()
            intelligence = CreativeIntelligence()
            
            # Use real product data if available, otherwise intelligent defaults
            if real_product_data:
                product_context = {
                    'name': real_product_data.name,
                    'category': real_product_data.category,
                    'price': real_product_data.price,
                    'trend_velocity': real_product_data.trend_velocity,
                    'competition_level': real_product_data.competition_level,
                    'opportunity_score': real_product_data.opportunity_score
                }
            elif kalo_data and kalo_data['top_performers']:
                top_performer = kalo_data['top_performers'][0]
                product_context = {
                    'name': top_performer.get('name', target_product),
                    'category': top_performer.get('category', 'trending'),
                    'monthly_sales': top_performer.get('monthly_sales', 'High'),
                    'growth_rate': top_performer.get('growth_rate', 'Growing'),
                    'competition_level': top_performer.get('competition_level', 'Medium')
                }
            else:
                # Intelligent content based on content type patterns
                category_mapping = {
                    'viral-growth-conspiracy': 'government_research',
                    'viral-affiliate': 'lifestyle_product',
                    'luxury-lifestyle': 'premium_lifestyle',
                    'client-transformation': 'business_service',
                    'ai-demo': 'tech_innovation'
                }
                product_context = {
                    'name': target_product,
                    'category': category_mapping.get(content_type, 'general'),
                    'context': content_type
                }
            
            # Generate content with real data context
            if content_type == 'viral-growth-conspiracy':
                # Educational/Authority content - use intelligence module
                content = intelligence.generate_authority_content(
                    topic='declassified_research',
                    variation_seed=variation_seed
                )
            elif content_type == 'viral-affiliate':
                # Product content - use real product data
                content = generator.generate_product_content(
                    product_context,
                    variation_seed=variation_seed
                )
            elif content_type == 'luxury-lifestyle':
                # Lifestyle content
                content = generator.generate_lifestyle_content(
                    product_context,
                    variation_seed=variation_seed
                )
            elif content_type == 'client-transformation':
                # Service/Business content
                content = generator.generate_service_content(
                    product_context,
                    variation_seed=variation_seed
                )
            else:
                # AI Demo content
                content = generator.generate_tech_content(
                    product_context,
                    variation_seed=variation_seed
                )
            
            # Add call to action
            if input_data.get('call_to_action'):
                content['script'] = content['script'].replace(
                    'Follow for more content like this!',
                    input_data['call_to_action']
                )
            
            # Build response with real data
            result = {
                'success': True,
                'content': {
                    'script': content['script'],
                    'hooks': content.get('hooks', [content['script'].split('\\n')[0], f"This will change everything...", f"You need to see this...", f"Wait until you discover...", f"This is absolutely incredible..."]),
                    'hashtags': content.get('hashtags', ['#viral', '#trending', '#fyp']),
                    'postingTips': content.get('posting_tips', [
                        '🔥 Real data-driven content generation active',
                        f'📊 FastMoss integration: {"✅ Connected" if fastmoss_data else "⚠️ Limited"}',
                        f'📈 KaloData integration: {"✅ Connected" if kalo_data else "⚠️ Limited"}',
                        'Post during peak engagement times for your niche'
                    ]),
                    'businessRationale': content.get('business_rationale', f'Content generated using real market data. FastMoss: {"Connected" if fastmoss_data else "Offline"}. KaloData: {"Connected" if kalo_data else "Offline"}.'),
                    'productData': real_product_data.to_dict() if real_product_data and hasattr(real_product_data, 'to_dict') else product_context,
                    'fastmossData': fastmoss_data,
                    'kaloData': kalo_data
                },
                'dataSource': {
                    'fastmoss_connected': fastmoss_data is not None,
                    'kalodata_connected': kalo_data is not None,
                    'real_products_used': real_product_data is not None,
                    'generation_method': 'real_data_driven' if (fastmoss_data or kalo_data) else 'intelligent_fallback'
                }
            }
            
            print(json.dumps(result))
            
        except Exception as e:
            import traceback
            print(json.dumps({
                "success": False, 
                "error": str(e),
                "traceback": traceback.format_exc(),
                "fallback_used": True
            }))

    if __name__ == "__main__":
        asyncio.run(main())
    
except ImportError as e:
    # Fallback if modules not available
    print(json.dumps({
        "success": False,
        "error": f"Backend modules not available: {e}",
        "fallback_required": True
    }))
    `], {
      cwd: backendPath,
      env: { ...process.env }
    })
    
    let output = ''
    let errorOutput = ''
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output)
          if (result.success === false && result.fallback_required) {
            // Use TypeScript fallback with indication
            resolve({
              success: true,
              content: generateIntelligentFallback(request),
              dataSource: {
                fastmoss_connected: false,
                kalodata_connected: false,
                real_products_used: false,
                generation_method: 'typescript_fallback',
                note: 'Backend modules unavailable, using intelligent fallback'
              }
            })
          } else {
            resolve(result)
          }
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError}. Output: ${output}`))
        }
      } else {
        reject(new Error(`Python script failed with code ${code}: ${errorOutput}`))
      }
    })
    
    // Send input data to Python script
    pythonProcess.stdin.write(JSON.stringify(inputData))
    pythonProcess.stdin.end()
    
    // Timeout after 30 seconds
    setTimeout(() => {
      pythonProcess.kill()
      reject(new Error('Generation timeout'))
    }, 30 * 1000)
  })
}

// Intelligent TypeScript fallback when Python backend unavailable
function generateIntelligentFallback(request: RealContentRequest): any {
  const { contentType, targetProduct, variationSeed } = request
  
  // Use variation seed for consistent but different content
  const rand = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
  
  const variation = Math.floor(rand(variationSeed || Date.now()) * 3)
  
  const templates = {
    'viral-growth-conspiracy': [
      {
        script: `The sugar industry paid Harvard scientists to lie about heart disease.

In 1967, they paid researchers to blame saturated fat instead of sugar.

Here's what the documents revealed:
• Sugar Research Foundation paid $6,500 (worth $50,000 today)
• Harvard scientists published biased studies in prestigious journals
• These lies shaped dietary guidelines for 50 years
• Heart disease rates skyrocketed while we avoided the wrong foods

The truth was buried until 2016 when JAMA exposed the scandal.

Millions suffered because of corporate greed and scientific corruption.

This same playbook is still being used today.

${request.callToAction || 'Follow for more suppressed health truths.'}`,
        hooks: [
          "The sugar industry paid Harvard scientists to lie about heart disease...",
          "This 50-year cover-up killed millions of Americans...",
          "Harvard took $50,000 to blame fat instead of sugar...",
          "The dietary guidelines you follow are based on paid lies...",
          "JAMA exposed this nutrition scandal that shaped everything..."
        ]
      },
      {
        script: `Octopuses have three hearts and blue blood.

But that's not even the weirdest part.

Here's what will blow your mind:
• They can taste with their arms
• Each arm has its own brain
• They can change color instantly to match ANY surface
• They've been observed using tools and solving puzzles

Two hearts pump blood to their gills, one to their body.

When they swim, the main heart stops beating - that's why they prefer crawling.

The blue blood comes from copper-based hemocyanin instead of iron.

${request.callToAction || 'Follow for more mind-blowing nature facts.'}`,
        hooks: [
          "Octopuses have three hearts and blue blood...",
          "This sea creature is basically an alien living on Earth...",
          "Each octopus arm has its own brain - here's why that's terrifying...",
          "Octopuses can taste with their arms and it gets weirder...",
          "This animal is so smart it uses tools and solves puzzles..."
        ]
      },
      {
        script: `The food pyramid was designed by the grain industry, not health experts.

Government documents reveal the shocking truth.

What really happened:
• Grain lobbyists influenced USDA recommendations
• Health experts' warnings were ignored
• Bread and cereal companies wrote the guidelines
• Obesity rates tripled after its introduction

The pyramid told you to eat 11 servings of grain per day.

Meanwhile, vegetables were minimized to a tiny section.

This wasn't about health - it was about profit.

${request.callToAction || 'Follow for more nutrition industry secrets.'}`,
        hooks: [
          "The food pyramid was designed by the grain industry, not doctors...",
          "This government lie made America obese...",
          "11 servings of bread per day - the industry's perfect scam...",
          "The USDA let corporations write our dietary guidelines...",
          "This is why obesity tripled after the food pyramid..."
        ]
      }
    ],
    'viral-affiliate': [
      {
        script: `I tested this ${targetProduct || 'product'} for 30 days so you don't have to.

Here's my honest review:

The Good:
• Actually works as advertised
• High quality materials
• Easy to use daily
• Noticeable results after 2 weeks

The Not So Good:
• Takes time to see full results
• Price point is higher than alternatives
• Not a magic solution

Bottom line: Worth it if you're serious about results.

${request.callToAction || 'Link in bio if you want to try it yourself.'}

*I may earn a commission if you purchase through my link*`,
        hooks: [
          `I tested this ${targetProduct || 'product'} for 30 days...`,
          `Everyone's talking about this ${targetProduct || 'product'}...`,
          `This ${targetProduct || 'product'} is everywhere on TikTok...`,
          `You won't believe what this ${targetProduct || 'product'} did...`,
          `This ${targetProduct || 'product'} broke the internet...`
        ]
      },
      {
        script: `This ${targetProduct || 'product'} has 50,000 five-star reviews but here's what they don't tell you.

I bought it to test the hype.

After 2 weeks of use:

What actually happened:
• Results showed up faster than expected
• Way easier to use than similar products
• Quality feels premium for the price
• Customer service responded in 2 hours

What they don't mention:
• Takes 3-5 days to see any changes
• Instructions could be clearer
• Shipping took longer than promised

Real talk: It works, but manage your expectations.

${request.callToAction || 'Link in bio for current discount.'}

*Honest review - I may earn a commission*`,
        hooks: [
          `This has 50,000 five-star reviews but here's the truth...`,
          `I tested the most hyped ${targetProduct || 'product'} on TikTok...`,
          `Everyone's buying this but nobody talks about...`,
          `This ${targetProduct || 'product'} has a secret they don't tell you...`,
          `50,000 people can't be wrong... or can they?`
        ]
      }
    ],
    'luxury-lifestyle': [
      {
        script: `This AI system built my entire business while I slept.

I'm sharing the exact blueprint that generated $47K last month.

Here's what it automated:
• Content creation across 5 platforms
• Lead generation and nurturing
• Client onboarding and delivery
• Payment processing and invoicing

Zero employees. Zero overhead. Pure profit.

The system runs 24/7 without me touching anything.

Most people don't realize AI can already do this.

${request.callToAction || 'Follow to see how this changes everything.'}`,
        hooks: [
          "This AI system made $47K while I was sleeping...",
          "I built a business with zero employees using this...",
          "My entire company runs on autopilot thanks to AI...",
          "This automation blueprint changed my life in 30 days...",
          "AI replaced my entire team and tripled my revenue..."
        ]
      },
      {
        script: `Honey never spoils. Ever.

Archaeologists found 3,000-year-old honey in Egyptian tombs that was still perfectly edible.

Here's why honey is basically immortal:
• It has a pH so low that bacteria can't survive
• It naturally dehydrates bacteria through osmosis
• Bees add enzymes that break down into hydrogen peroxide
• The sugar concentration is so high it preserves itself

Ancient Egyptians used honey to preserve mummies.

Vikings fermented it into mead for their celebrations.

A single bee produces only 1/12th of a teaspoon of honey in her entire lifetime.

${request.callToAction || 'Follow for more incredible nature secrets.'}`,
        hooks: [
          "Honey never spoils - archaeologists found 3,000-year-old honey that's still edible...",
          "This food is literally immortal and here's the science behind it...",
          "Ancient Egyptians used this to preserve mummies...",
          "A single bee only makes 1/12th teaspoon of this in her entire life...",
          "This natural substance creates its own hydrogen peroxide..."
        ]
      }
    ]
  }
  
  const typeKey = contentType as keyof typeof templates
  const selectedTemplates = templates[typeKey] || templates['viral-affiliate']
  const template = selectedTemplates[variation] || selectedTemplates[0]
  
  // Generate 5+ hook variations dynamically
  const baseHooks = template.hooks || [];
  const scriptFirstLine = template.script.split('\n')[0];
  
  // Create additional hook variations based on content
  const dynamicHooks = generateDynamicHooks(template.script, contentType, targetProduct || 'this');
  
  // Combine template hooks with dynamic variations, ensure minimum 5 unique hooks
  const allHooks = [...baseHooks, ...dynamicHooks];
  const uniqueHooks = [...new Set(allHooks)]; // Remove duplicates
  
  // If still less than 5, generate more variations
  while (uniqueHooks.length < 5) {
    const additionalHook = generateVariationHook(scriptFirstLine, uniqueHooks.length);
    if (!uniqueHooks.includes(additionalHook)) {
      uniqueHooks.push(additionalHook);
    }
  }

  return {
    script: template.script,
    hooks: uniqueHooks.slice(0, 8), // Return max 8 hooks for variety
    hashtags: ['#viral', '#trending', '#fyp', '#real', '#honest'],
    postingTips: [
      '⚠️ Backend data unavailable - using intelligent fallback',
      'Content generated with TypeScript templates',
      'For full FastMoss + KaloData integration, check backend connection', 
      'Post during peak hours for maximum reach'
    ],
    businessRationale: 'Intelligent fallback content generated. FastMoss and KaloData integrations offline - check backend connection for real product data.'
  }

// Helper function to generate dynamic hook variations
function generateDynamicHooks(script: string, contentType: string, targetProduct: string): string[] {
  const hooks: string[] = [];
  const firstSentence = script.split('.')[0] + '...';
  
  // Content-specific hook patterns
  if (contentType === 'viral-growth-conspiracy') {
    hooks.push(
      `This will change everything you believe...`,
      `You weren't supposed to learn this...`,
      `The truth they've been hiding...`,
      `This secret is finally exposed...`,
      `What I discovered will shock you...`
    );
  } else if (contentType === 'viral-affiliate') {
    hooks.push(
      `I tested ${targetProduct || 'this'} so you don't have to...`,
      `Everyone's buying ${targetProduct || 'this'} but here's the truth...`,
      `${targetProduct || 'This product'} broke the internet and here's why...`,
      `The ${targetProduct || 'product'} everyone's talking about...`,
      `Is ${targetProduct || 'this'} worth the hype? My honest review...`
    );
  } else if (contentType === 'luxury-lifestyle') {
    hooks.push(
      `This changed my entire business...`,
      `From broke to $47K/month using this...`,
      `The system that runs my life...`,
      `How I automated everything...`,
      `This one change made me rich...`
    );
  }
  
  // Add first sentence variation if not already included
  if (!hooks.some(hook => hook.includes(firstSentence.split(' ').slice(0, 3).join(' ')))) {
    hooks.push(firstSentence);
  }
  
  return hooks;
}

// Helper function to generate additional hook variations
function generateVariationHook(baseLine: string, variation: number): string {
  const patterns = [
    `Wait until you hear this...`,
    `This will blow your mind...`,
    `You need to see this...`,
    `This changes everything...`,
    `I can't believe this is real...`,
    `This is absolutely insane...`,
    `You won't believe what happened...`,
    `This discovery is mind-blowing...`
  ];
  
  return patterns[variation % patterns.length] || `${baseLine}...`;
}
}

export async function POST(request: NextRequest) {
  try {
    const body: RealContentRequest = await request.json()
    
    console.log('🚀 Generating real content with FastMoss + KaloData integration...')
    
    const startTime = Date.now()
    const result = await executeRealContentGeneration(body)
    const endTime = Date.now()
    
    console.log(`✅ Real content generated in ${(endTime - startTime) / 1000}s`)
    
    // FACT-CHECK the generated content
    if (result.success && result.content) {
      console.log('🔍 Running fact-check on generated content...')
      
      try {
        const factCheckResponse = await fetch(`${request.nextUrl.origin}/api/fact-check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: result.content.script,
            contentType: body.contentType,
            claims: [] // API will auto-extract claims
          })
        })
        
        if (factCheckResponse.ok) {
          const factCheck = await factCheckResponse.json()
          
          // Add fact-check results to response
          result.factCheck = factCheck
          
          // Add fact-check warnings to posting tips
          if (!factCheck.safeToPublish) {
            result.content.postingTips = [
              '⚠️ FACT-CHECK WARNING: Content has accuracy issues',
              `📊 Accuracy Score: ${factCheck.overallScore}/100`,
              ...factCheck.recommendations,
              ...(result.content.postingTips || [])
            ]
          } else {
            result.content.postingTips = [
              `✅ Fact-checked: ${factCheck.overallScore}/100 accuracy`,
              ...(result.content.postingTips || [])
            ]
          }
          
          console.log(`🔍 Fact-check complete: ${factCheck.overallScore}/100`)
        }
      } catch (factCheckError) {
        console.error('Fact-check failed:', factCheckError)
        // Add warning if fact-check fails
        result.content.postingTips = [
          '⚠️ Fact-check unavailable - manual verification recommended',
          ...(result.content.postingTips || [])
        ]
      }
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Real content generation failed:', error)
    
    // Fallback to intelligent TypeScript generation
    const body: RealContentRequest = await request.json()
    const fallbackContent = generateIntelligentFallback(body)
    
    return NextResponse.json({
      success: true,
      content: {
        ...fallbackContent,
        postingTips: [
          '⚠️ Backend connection failed - used intelligent fallback',
          'FastMoss + KaloData data not available',
          'Check backend Python modules for full functionality',
          ...fallbackContent.postingTips.slice(1)
        ]
      },
      dataSource: {
        fastmoss_connected: false,
        kalodata_connected: false,
        real_products_used: false,
        generation_method: 'error_fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'Real Content Generation API with FastMoss + KaloData Integration',
    features: [
      'FastMoss trending product integration',
      'KaloData market analytics integration', 
      'Real TikTok product data',
      'Intelligent content generation',
      'TypeScript fallback system'
    ],
    dataConnections: {
      fastmoss: 'Trending products + opportunity scoring',
      kalodata: 'Market analytics + competition data',
      fallback: 'Intelligent TypeScript templates'
    }
  })
}