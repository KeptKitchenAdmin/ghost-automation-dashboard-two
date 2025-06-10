#!/usr/bin/env node
/**
 * Content Engine Demo - Test with Sample Data
 * Shows how the system works while you set up accounts
 */

interface DemoProduct {
  name: string
  price: string
  sales: string
  rating: string
  commission: string
  trend_score: string
  source: string
}

interface DemoScript {
  hook: string
  problem: string
  solution: string
  cta: string
  full_script: string
}

interface DemoVideo {
  video_id: string
  status: string
  duration: number
  format: string
}

function createSampleProducts(): DemoProduct[] {
  return [
    {
      name: 'Anti-Aging Vitamin C Serum',
      price: '$29.99',
      sales: '15,000+ sold',
      rating: '4.8/5',
      commission: '25%',
      trend_score: '85/100',
      source: 'demo'
    },
    {
      name: 'Smart Fitness Tracker Watch',
      price: '$49.99',
      sales: '8,500+ sold',
      rating: '4.6/5',
      commission: '20%',
      trend_score: '78/100',
      source: 'demo'
    },
    {
      name: 'Kitchen Meal Prep Container Set',
      price: '$34.99',
      sales: '12,200+ sold',
      rating: '4.7/5',
      commission: '18%',
      trend_score: '72/100',
      source: 'demo'
    }
  ]
}

function demoProductAnalysis(): DemoProduct[] {
  console.log("🎯 DEMO: Product Analysis")
  console.log("=".repeat(50))
  
  const products = createSampleProducts()
  
  products.forEach((product, index) => {
    console.log(`\n${index + 1}. ${product.name}`)
    console.log(`   💰 Price: ${product.price}`)
    console.log(`   📊 Sales: ${product.sales}`)
    console.log(`   ⭐ Rating: ${product.rating}`)
    console.log(`   💸 Commission: ${product.commission}`)
    console.log(`   🔥 Trend Score: ${product.trend_score}`)
    
    // Calculate opportunity score
    const priceNum = parseFloat(product.price.replace('$', ''))
    const commissionNum = parseFloat(product.commission.replace('%', ''))
    const salesNum = parseInt(product.sales.replace(/[,+ sold]/g, ''))
    
    const opportunityScore = (priceNum * commissionNum * salesNum) / 10000
    console.log(`   🎯 Opportunity Score: ${opportunityScore.toFixed(1)}`)
  })
  
  return products
}

function demoScriptGeneration(): DemoScript {
  console.log("\n\n✍️ DEMO: Viral Script Generation")
  console.log("=".repeat(50))
  
  const product = {
    name: 'Anti-Aging Vitamin C Serum',
    price: '$29.99',
    category: 'beauty'
  }
  
  // Sample script (what AI would generate)
  const sampleScript: DemoScript = {
    hook: "You'll never guess what happened when I tried this $30 serum...",
    problem: "I was spending hundreds on expensive skincare with zero results.",
    solution: "This Anti-Aging Vitamin C Serum completely transformed my skin in just 2 weeks.",
    cta: "Link in bio before it sells out again!",
    full_script: "You'll never guess what happened when I tried this $30 serum... I was spending hundreds on expensive skincare with zero results. This Anti-Aging Vitamin C Serum completely transformed my skin in just 2 weeks. Link in bio before it sells out again!"
  }
  
  console.log(`\n🎬 Generated Script for: ${product.name}`)
  console.log(`📱 Category: ${product.category}`)
  console.log(`🎭 Avatar: Female beauty enthusiast`)
  console.log(`\n📝 Script Structure:`)
  console.log(`[0-3s] HOOK: ${sampleScript.hook}`)
  console.log(`[3-8s] PROBLEM: ${sampleScript.problem}`)
  console.log(`[8-15s] SOLUTION: ${sampleScript.solution}`)
  console.log(`[15-18s] CTA: ${sampleScript.cta}`)
  
  console.log(`\n🎯 Full Script (${sampleScript.full_script.split(' ').length} words):`)
  console.log(`"${sampleScript.full_script}"`)
  
  return sampleScript
}

function demoVideoCreation(): DemoVideo {
  console.log("\n\n🎬 DEMO: Video Creation Process")
  console.log("=".repeat(50))
  
  console.log("🤖 Avatar Selection:")
  console.log("   • Product: Anti-Aging Vitamin C Serum")
  console.log("   • Category: Beauty")
  console.log("   • Selected Avatar: Female 25-35 Beauty Enthusiast")
  console.log("   • Voice: Enthusiastic, authentic female voice")
  console.log("   • Background: Clean white background")
  
  console.log("\n📹 Video Specifications:")
  console.log("   • Format: 9:16 vertical (TikTok optimized)")
  console.log("   • Duration: ~18 seconds")
  console.log("   • Quality: HD 1080x1920")
  console.log("   • Style: Professional talking head")
  
  console.log("\n⚙️ HeyGen API Process:")
  console.log("   ✅ Script processed")
  console.log("   ✅ Avatar selected")
  console.log("   ✅ Voice synthesized")
  console.log("   ✅ Video rendered")
  console.log("   ✅ Ready for download")
  
  return {
    video_id: 'demo_video_12345',
    status: 'completed',
    duration: 18.5,
    format: '9:16 vertical'
  }
}

async function runDemo(): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║               🎬 Content Engine Demo Mode                      ║
║                                                                ║
║  This shows how the system works with sample data             ║
║  while you set up your OpenAI billing and FastMoss account    ║
╚════════════════════════════════════════════════════════════════╝
`)
  
  // Demo product analysis
  const products = demoProductAnalysis()
  
  // Demo script generation
  const script = demoScriptGeneration()
  
  // Demo video creation
  const video = demoVideoCreation()
  
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                     🎉 DEMO COMPLETE! 🎉                       ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  This is exactly how your system will work with real data:    ║
║                                                                ║
║  1. 🔍 Scrape trending products from FastMoss/KoloData        ║
║  2. 🎯 Analyze and rank by opportunity score                  ║
║  3. ✍️ Generate viral scripts with AI                         ║
║  4. 🎬 Create professional videos with HeyGen avatars         ║
║                                                                ║
║  Ready to go live? Complete these steps:                      ║
║  • Add OpenAI billing ($5 minimum)                           ║
║  • Create FastMoss account                                    ║
║  • Run: npm run demo:content                                  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
}

if (require.main === module) {
  runDemo().catch(console.error)
}

export { runDemo, demoProductAnalysis, demoScriptGeneration, demoVideoCreation }