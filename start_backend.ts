#!/usr/bin/env node
/**
 * Backend Server Startup Script
 * Starts the Next.js API server for client portal
 */

import { spawn } from 'child_process'
import path from 'path'

async function startBackend() {
  console.log("🚀 Starting AI Automation Backend Server...")
  console.log("📡 API will be available at: http://localhost:3000")
  console.log("📊 Dashboard API endpoints ready for frontend connection")
  console.log("⚡ Starting server...")
  
  try {
    // Start Next.js development server
    const nextProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    })
    
    nextProcess.on('error', (error) => {
      console.error(`❌ Failed to start server: ${error.message}`)
      console.log("💡 Try installing dependencies: npm install")
    })
    
    nextProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`)
    })
    
  } catch (error) {
    console.error(`❌ Failed to start server: ${error}`)
    console.log("💡 Try installing dependencies: npm install")
  }
}

if (require.main === module) {
  startBackend()
}