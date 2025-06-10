#!/usr/bin/env node
/**
 * ChromeDriver Fix Script
 * Automatically fixes ChromeDriver version issues
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

async function fixChromeDriver(): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                🔧 CHROMEDRIVER FIX UTILITY 🔧                  ║
║                                                                ║
║  This will fix ChromeDriver version mismatches                ║
║  and ensure browser automation works properly                  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
  
  console.log("🔍 Step 1: Checking Chrome browser version...")
  
  try {
    // Check if Playwright is installed (preferred for TypeScript)
    const playwrightCheck = await checkPlaywright()
    if (playwrightCheck) {
      console.log("✅ Playwright is already installed and ready")
      console.log("💡 Playwright manages browser binaries automatically")
      return
    }
    
    // Check Chrome version
    const chromeVersion = await getChromeVersion()
    if (chromeVersion) {
      console.log(`✅ Chrome version detected: ${chromeVersion}`)
    } else {
      console.log("❌ Chrome browser not found")
      await installChrome()
      return
    }
    
    console.log("\n🔄 Step 2: Installing/Updating browser automation...")
    
    // Install Playwright (preferred for TypeScript projects)
    await installPlaywright()
    
    console.log("\n✅ Step 3: Verification...")
    await verifyInstallation()
    
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  ✅ FIX COMPLETE! ✅                            ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Browser automation is now ready!                             ║
║                                                                ║
║  What was fixed:                                               ║
║  • Playwright browser automation installed                    ║
║  • Chromium browser binaries updated                          ║
║  • Version compatibility verified                             ║
║                                                                ║
║  You can now run scripts that use browser automation!         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
    
  } catch (error) {
    console.error("❌ Fix failed:", error)
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    ⚠️ FIX FAILED ⚠️                            ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Manual steps to resolve:                                     ║
║                                                                ║
║  1. Install Playwright:                                       ║
║     npm install playwright                                    ║
║                                                                ║
║  2. Install browsers:                                         ║
║     npx playwright install chromium                           ║
║                                                                ║
║  3. Test installation:                                        ║
║     npx playwright test --version                             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
  }
}

async function checkPlaywright(): Promise<boolean> {
  try {
    await execAsync('npx playwright --version')
    return true
  } catch (error) {
    return false
  }
}

async function getChromeVersion(): Promise<string | null> {
  const chromePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ]
  
  for (const chromePath of chromePaths) {
    try {
      if (fs.existsSync(chromePath)) {
        const { stdout } = await execAsync(`"${chromePath}" --version`)
        return stdout.trim()
      }
    } catch (error) {
      continue
    }
  }
  
  // Try system chrome command
  try {
    const { stdout } = await execAsync('chrome --version')
    return stdout.trim()
  } catch (error) {
    try {
      const { stdout } = await execAsync('google-chrome --version')
      return stdout.trim()
    } catch (error) {
      return null
    }
  }
}

async function installChrome(): Promise<void> {
  console.log("📦 Installing Chrome browser...")
  
  const platform = process.platform
  
  if (platform === 'darwin') {
    console.log("🍎 macOS detected - please install Chrome manually:")
    console.log("   1. Visit https://www.google.com/chrome/")
    console.log("   2. Download and install Chrome")
    console.log("   3. Run this script again")
  } else if (platform === 'linux') {
    console.log("🐧 Linux detected - attempting automatic installation...")
    try {
      await execAsync('wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -')
      await execAsync('sudo sh -c \'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list\'')
      await execAsync('sudo apt-get update')
      await execAsync('sudo apt-get install -y google-chrome-stable')
      console.log("✅ Chrome installed successfully")
    } catch (error) {
      console.log("❌ Automatic installation failed")
      console.log("💡 Please install Chrome manually and run this script again")
    }
  } else {
    console.log("🪟 Windows detected - please install Chrome manually:")
    console.log("   1. Visit https://www.google.com/chrome/")
    console.log("   2. Download and install Chrome")
    console.log("   3. Run this script again")
  }
}

async function installPlaywright(): Promise<void> {
  console.log("📦 Installing Playwright...")
  
  try {
    await execAsync('npm install playwright')
    console.log("✅ Playwright installed")
    
    console.log("📦 Installing Chromium browser...")
    await execAsync('npx playwright install chromium')
    console.log("✅ Chromium browser installed")
    
  } catch (error) {
    console.log("❌ Playwright installation failed")
    throw error
  }
}

async function verifyInstallation(): Promise<void> {
  console.log("🔍 Verifying installation...")
  
  try {
    const { stdout } = await execAsync('npx playwright --version')
    console.log(`✅ Playwright version: ${stdout.trim()}`)
    
    // Test browser launch
    console.log("🧪 Testing browser launch...")
    const testScript = `
      const { chromium } = require('playwright');
      (async () => {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://example.com');
        console.log('✅ Browser test successful');
        await browser.close();
      })();
    `
    
    const testFile = path.join(process.cwd(), 'temp_browser_test.js')
    fs.writeFileSync(testFile, testScript)
    
    await execAsync(`node ${testFile}`)
    
    // Clean up test file
    fs.unlinkSync(testFile)
    
    console.log("✅ Browser automation verified")
    
  } catch (error) {
    console.log("❌ Verification failed")
    throw error
  }
}

if (require.main === module) {
  fixChromeDriver().catch(console.error)
}

export { fixChromeDriver, checkPlaywright, getChromeVersion, installPlaywright }