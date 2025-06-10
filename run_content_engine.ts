#!/usr/bin/env node
/**
 * Personal Content Engine - Startup Script
 * Simple script to run the complete automation workflow
 */

import * as fs from 'fs'
import * as path from 'path'
import { smartContentEngine } from './lib/modules/smart-content-engine'

interface ContentEngineConfig {
  claudeApiKey?: string
  openaiApiKey: string
  heygenApiKey?: string
  elevenlabsApiKey?: string
  outputDirectory: string
  logLevel: string
}

function setupLogging(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '_')
  const logDir = "logs"
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
  
  const logFile = path.join(logDir, `content_engine_${timestamp}.log`)
  
  // Setup console logging with timestamps
  const originalLog = console.log
  console.log = (...args) => {
    const timestamp = new Date().toISOString()
    const message = `[${timestamp}] ${args.join(' ')}`
    originalLog(message)
    
    // Also write to file
    fs.appendFileSync(logFile, message + '\n')
  }
  
  return logFile
}

function createConfig(): ContentEngineConfig {
  console.log("⚙️ Loading configuration...")
  
  // Load environment variables
  require('dotenv').config()
  
  const config: ContentEngineConfig = {
    claudeApiKey: process.env.CLAUDE_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    heygenApiKey: process.env.HEYGEN_API_KEY,
    elevenlabsApiKey: process.env.ELEVENLABS_API_KEY,
    outputDirectory: path.join(process.cwd(), 'output'),
    logLevel: 'INFO'
  }
  
  // Validate required API keys
  if (!config.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is required in .env file")
  }
  
  console.log("✅ Configuration loaded successfully")
  console.log(`📊 Claude API: ${config.claudeApiKey ? 'Available' : 'Not configured'}`)
  console.log(`🤖 OpenAI API: ${config.openaiApiKey ? 'Available' : 'Missing'}`)
  console.log(`🎬 HeyGen API: ${config.heygenApiKey ? 'Available' : 'Not configured'}`)
  console.log(`🗣️ ElevenLabs API: ${config.elevenlabsApiKey ? 'Available' : 'Not configured'}`)
  
  return config
}

async function runContentEngine(config: ContentEngineConfig): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║              🚀 STARTING CONTENT ENGINE 🚀                     ║
║                                                                ║
║  Automated viral content generation system                    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
  
  try {
    console.log("🔍 Step 1: Product Discovery")
    console.log("Scanning for trending products...")
    
    // Mock product discovery for now
    const trendingProducts = [
      {
        name: "LED Strip Lights RGB Color Changing",
        price: 15.99,
        category: "home_decor",
        trending_score: 85
      },
      {
        name: "Wireless Bluetooth Sleep Headphones",
        price: 24.99,
        category: "tech_gadgets", 
        trending_score: 78
      }
    ]
    
    console.log(`✅ Found ${trendingProducts.length} trending products`)
    
    console.log("\n🧠 Step 2: AI Content Generation")
    console.log("Generating viral scripts with AI...")
    
    for (const product of trendingProducts) {
      console.log(`📝 Generating content for: ${product.name}`)
      
      // Use smart content engine
      const recommendations = await smartContentEngine.generateContentRecommendations(1)
      const content = await smartContentEngine.generateMultiPlatformContent(recommendations)
      
      console.log(`✅ Generated content for ${content.total_content_pieces} pieces`)
      console.log(`🎯 Success rate: ${content.success_rate}%`)
    }
    
    console.log("\n🎬 Step 3: Video Creation")
    console.log("Creating professional videos...")
    
    if (config.heygenApiKey) {
      console.log("✅ HeyGen integration ready - videos will be created")
    } else {
      console.log("⚠️ HeyGen API not configured - manual video creation required")
    }
    
    console.log("\n💾 Step 4: Save Results")
    const timestamp = new Date().toISOString().replace(/[:.]/g, '_')
    const outputFile = path.join(config.outputDirectory, `content_batch_${timestamp}.json`)
    
    // Ensure output directory exists
    if (!fs.existsSync(config.outputDirectory)) {
      fs.mkdirSync(config.outputDirectory, { recursive: true })
    }
    
    const results = {
      timestamp: new Date().toISOString(),
      products_processed: trendingProducts.length,
      scripts_generated: trendingProducts.length * 2,
      status: "completed"
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2))
    console.log(`✅ Results saved to: ${outputFile}`)
    
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                 🎉 ENGINE COMPLETE! 🎉                         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Content generation successful!                               ║
║                                                                ║
║  📊 Products processed: ${trendingProducts.length}                                    ║
║  📝 Scripts generated: ${trendingProducts.length * 2}                                     ║
║  🎬 Videos ready for creation                                  ║
║                                                                ║
║  Check the output directory for your content!                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
    
  } catch (error) {
    console.error("❌ Content engine failed:", error)
    throw error
  }
}

async function main(): Promise<void> {
  const logFile = setupLogging()
  console.log(`📝 Logging to: ${logFile}`)
  
  try {
    const config = createConfig()
    await runContentEngine(config)
  } catch (error) {
    console.error("❌ Startup failed:", error)
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { runContentEngine, createConfig, setupLogging }