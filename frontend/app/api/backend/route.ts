import { NextRequest, NextResponse } from 'next/server'

// Dashboard HTML
const dashboardHTML = `
<html>
    <head>
        <title>Affiliate Video Automation Dashboard</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .module { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .button { background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            .status { color: #28a745; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>🎬 Affiliate Video Automation System v0.5</h1>
        
        <div class="module">
            <h2>🧠 System Status</h2>
            <p class="status">✅ All modules initialized and ready</p>
            <p>GitHub: Connected to GhostOps23/claude-affiliate-automation</p>
        </div>
        
        <div class="module">
            <h2>🎯 Quick Actions</h2>
            <button class="button" onclick="generateVideo()">Generate New Video</button>
            <button class="button" onclick="viewQueue()">View Preview Queue</button>
            <button class="button" onclick="analyzeProducts()">Analyze Products</button>
            <button class="button" onclick="checkTrends()">Check Trends</button>
        </div>
        
        <div class="module">
            <h2>📊 Performance Metrics</h2>
            <p>Videos Generated: 0</p>
            <p>Revenue Tracked: $0.00</p>
            <p>Conversion Rate: 0.0%</p>
        </div>
        
        <script>
            function generateVideo() { window.location.href = '/api/videos/create'; }
            function viewQueue() { window.location.href = '/api/queue/status'; }
            function analyzeProducts() { window.location.href = '/api/products/analyze'; }
            function checkTrends() { window.location.href = '/api/trends/current'; }
        </script>
    </body>
</html>
`

export async function GET() {
  return new Response(dashboardHTML, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}