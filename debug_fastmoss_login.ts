#!/usr/bin/env node
/**
 * Debug FastMoss Login - Manual Investigation
 * Opens FastMoss login page in non-headless mode to see actual page structure
 */

import * as dotenv from 'dotenv'
import { chromium } from 'playwright'

async function debugFastmossLogin(): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║              🔍 FASTMOSS LOGIN DEBUG MODE 🔍                   ║
║                                                                ║
║  This will open FastMoss in a visible browser window          ║
║  so we can see the actual login page structure                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
  
  // Load environment variables
  dotenv.config()
  const email = process.env.FASTMOSS_EMAIL
  const password = process.env.FASTMOSS_PASSWORD
  
  if (!email || !password) {
    console.log("❌ FastMoss credentials not found")
    return
  }
  
  console.log("✅ FastMoss credentials loaded")
  console.log(`📧 Email: ${email}`)
  
  try {
    // Launch browser in non-headless mode for debugging
    const browser = await chromium.launch({ 
      headless: false,
      devtools: true 
    })
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    })
    
    const page = await context.newPage()
    
    console.log("🌐 Opening FastMoss login page...")
    await page.goto('https://fastmoss.com/login')
    
    // Wait for page to load
    await page.waitForTimeout(3000)
    
    console.log("🔍 Current page URL:", page.url())
    console.log("📄 Page title:", await page.title())
    
    // Try to find login elements
    const emailInput = await page.locator('input[type="email"], input[name="email"], #email').first()
    const passwordInput = await page.locator('input[type="password"], input[name="password"], #password').first()
    
    if (await emailInput.isVisible()) {
      console.log("✅ Email input found")
      await emailInput.fill(email)
    } else {
      console.log("❌ Email input not found")
    }
    
    if (await passwordInput.isVisible()) {
      console.log("✅ Password input found")
      await passwordInput.fill(password)
    } else {
      console.log("❌ Password input not found")
    }
    
    // Look for login button
    const loginButton = await page.locator('button[type="submit"], input[type="submit"], button:has-text("login"), button:has-text("sign in")').first()
    
    if (await loginButton.isVisible()) {
      console.log("✅ Login button found")
      console.log("🖱️ Click login button to continue manually...")
    } else {
      console.log("❌ Login button not found")
    }
    
    console.log("👀 Browser window opened for manual debugging")
    console.log("🔍 Inspect the page elements manually")
    console.log("⏸️ Press Ctrl+C when done...")
    
    // Keep browser open for manual inspection
    await page.waitForTimeout(300000) // 5 minutes
    
    await browser.close()
    
  } catch (error) {
    console.error("❌ Debug failed:", error)
    console.log("💡 Try installing Playwright: npm install playwright")
  }
}

if (require.main === module) {
  debugFastmossLogin().catch(console.error)
}

export { debugFastmossLogin }