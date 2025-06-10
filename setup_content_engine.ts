#!/usr/bin/env node
/**
 * Personal Content Engine - Setup Script
 * Installs dependencies and validates the environment
 */

import { spawn, exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

async function runCommand(command: string, description: string): Promise<boolean> {
  console.log(`📦 ${description}...`)
  try {
    const { stdout, stderr } = await execAsync(command)
    if (stderr && !stderr.includes('warning')) {
      console.log(`⚠️ ${description} warnings:`, stderr)
    }
    console.log(`✅ ${description} completed successfully`)
    return true
  } catch (error: any) {
    console.log(`❌ ${description} failed:`)
    console.log(`   Error: ${error.message}`)
    return false
  }
}

function checkNodeVersion(): boolean {
  console.log("🟢 Checking Node.js version...")
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
  
  if (majorVersion < 16) {
    console.log("❌ Node.js 16 or higher is required")
    console.log(`   Current version: ${nodeVersion}`)
    return false
  }
  
  console.log(`✅ Node.js version ${nodeVersion} is compatible`)
  return true
}

async function installDependencies(): Promise<boolean> {
  console.log("\n📦 Installing Node.js dependencies...")
  
  const commands = [
    { cmd: "npm install", desc: "Installing core dependencies" },
    { cmd: "npm install playwright", desc: "Installing browser automation" },
    { cmd: "npx playwright install chromium", desc: "Installing Chromium browser" }
  ]
  
  for (const { cmd, desc } of commands) {
    const success = await runCommand(cmd, desc)
    if (!success) {
      return false
    }
  }
  
  return true
}

function checkEnvironmentFile(): boolean {
  console.log("\n🔑 Checking environment configuration...")
  
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    console.log("⚠️ .env file not found")
    console.log("📝 Creating example .env file...")
    
    const exampleEnv = `# AI API Keys
CLAUDE_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# FastMoss Credentials
FASTMOSS_EMAIL=your_email@example.com
FASTMOSS_PASSWORD=your_password_here

# Optional: HeyGen for video creation
HEYGEN_API_KEY=your_heygen_api_key_here

# Optional: ElevenLabs for voice generation
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here`
    
    fs.writeFileSync(envPath, exampleEnv)
    console.log("✅ Example .env file created")
    console.log("🔧 Please edit .env file with your actual API keys")
    return false
  }
  
  console.log("✅ .env file found")
  return true
}

function createDirectories(): void {
  console.log("\n📁 Creating required directories...")
  
  const directories = ['data', 'logs', 'output', 'output/videos']
  
  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
      console.log(`✅ Created directory: ${dir}`)
    } else {
      console.log(`✅ Directory exists: ${dir}`)
    }
  })
}

function validateSetup(): boolean {
  console.log("\n🔍 Validating setup...")
  
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.js'
  ]
  
  let allValid = true
  
  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      console.log(`✅ Found: ${file}`)
    } else {
      console.log(`❌ Missing: ${file}`)
      allValid = false
    }
  })
  
  return allValid
}

async function main(): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║            🚀 CONTENT ENGINE SETUP WIZARD 🚀                   ║
║                                                                ║
║  This will prepare your system for AI content automation      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
  
  // Step 1: Check Node version
  if (!checkNodeVersion()) {
    console.log("\n❌ Setup failed: Node.js version incompatible")
    process.exit(1)
  }
  
  // Step 2: Install dependencies
  const depsInstalled = await installDependencies()
  if (!depsInstalled) {
    console.log("\n❌ Setup failed: Dependency installation failed")
    process.exit(1)
  }
  
  // Step 3: Check environment
  const envReady = checkEnvironmentFile()
  
  // Step 4: Create directories
  createDirectories()
  
  // Step 5: Validate setup
  const setupValid = validateSetup()
  
  if (setupValid && envReady) {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                 ✅ SETUP COMPLETE! ✅                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Your content engine is ready to use!                         ║
║                                                                ║
║  Next steps:                                                   ║
║  1. Add your API keys to .env file                            ║
║  2. Run: npm run start:engine                                 ║
║  3. Start generating viral content!                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
  } else {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                 ⚠️ SETUP INCOMPLETE ⚠️                         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Please resolve the issues above and run setup again.         ║
║                                                                ║
║  Need help? Check the README.md file                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { checkNodeVersion, installDependencies, checkEnvironmentFile, createDirectories, validateSetup }