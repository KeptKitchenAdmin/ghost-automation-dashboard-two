# 🚀 Phase 7: Cloudflare Pages Functions Setup

## 🎯 **Cloudflare Pages Functions Configuration**

### **Why We Need Functions:**
- Current setup: `output: 'export'` (static export) - API routes disabled
- Reddit automation needs: Server-side API processing
- Solution: Cloudflare Pages Functions for server-side routes

### **Deployment Strategy:**
1. **Static Pages**: Frontend dashboard (current working setup)
2. **Pages Functions**: API routes for Reddit automation
3. **R2 Storage**: File storage and logging

## 🔧 **Configuration Changes Required**

### **1. Next.js Config Update:**
```javascript
// next.config.js - Enable hybrid deployment
const nextConfig = {
  // Remove 'export' to enable API routes
  // output: 'export', // REMOVE THIS LINE
  
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  
  // Optimize for Cloudflare Pages
  experimental: {
    runtime: 'nodejs',
  },
  
  // Webpack optimization for Cloudflare
  webpack: (config, { dev, isServer }) => {
    config.cache = false;
    
    if (config.optimization) {
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }
    
    return config;
  },
}
```

### **2. Environment Variables Setup:**
Required for Cloudflare Pages dashboard:

```bash
# Reddit Automation APIs
ANTHROPIC_API_KEY=your_anthropic_key
SHOTSTACK_API_KEY=your_shotstack_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Cloudflare R2 Storage
CLOUDFLARE_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_PUBLIC_DOMAIN=your_r2_domain

# Security
ALLOWED_ORIGINS=https://ghost-automation-dashboard-three.pages.dev
API_SECRET_KEY=your_secret_key
```

### **3. Deployment Commands:**
```bash
# Build for Cloudflare Pages Functions
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy .next --project-name=ghost-automation-dashboard-three --compatibility-date=2024-01-01

# Alternative: Use built-in deployment
npm run deploy:functions
```

### **4. Package.json Updates:**
```json
{
  "scripts": {
    "build": "next build",
    "deploy": "npm run build && npx wrangler pages deploy .next --project-name=ghost-automation-dashboard-three",
    "deploy:functions": "npm run build && npx wrangler pages deploy .next --project-name=ghost-automation-dashboard-three --compatibility-date=2024-01-01",
    "test:api": "node test_end_to_end_workflow.ts"
  }
}
```

## 🛣️ **API Routes Available**

### **Reddit Automation APIs:**
- `POST /api/reddit-automation/scrape` - Scrape Reddit stories
- `POST /api/reddit-automation/generate-video` - Generate videos
- `GET /api/reddit-automation/usage-stats` - Get usage statistics
- `GET /api/reddit-automation/progress/[jobId]` - Check progress

### **File Management:**
- `POST /api/upload` - Upload files to R2 storage
- `GET /api/usage/stats` - Usage statistics

### **Content Generation:**
- `POST /api/content/generate` - Generate viral content
- `POST /api/video/generate` - Generate videos

## 🔒 **Security Configuration**

### **Rate Limiting:**
- Built-in client-side queue management
- API budget protection (Claude: $1/day, Shotstack: $5/day)
- Request throttling and user limits

### **CORS Configuration:**
```javascript
// Automatic CORS for Pages Functions
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://ghost-automation-dashboard-three.pages.dev',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

## 📊 **Testing Strategy**

### **1. Local Testing:**
```bash
# Test API routes locally
npm run dev
# Visit: http://localhost:3000/api/reddit-automation/usage-stats
```

### **2. Production Testing:**
```bash
# Run end-to-end tests
node test_end_to_end_workflow.ts
node test_performance_benchmark.ts
```

### **3. Live API Testing:**
- Test scraping: Categories → Stories selection
- Test generation: Story → Video workflow
- Test monitoring: Usage statistics tracking

## 🚀 **Deployment Process**

### **Phase 7.1: Enable Functions**
1. Update next.config.js (remove static export)
2. Set environment variables in Cloudflare dashboard
3. Deploy with Functions enabled
4. Test API endpoints

### **Phase 7.2: Full Workflow Testing**
1. Test complete Reddit automation workflow
2. Verify R2 storage integration
3. Test usage limits and budget protection
4. Performance benchmarking

### **Phase 7.3: Production Validation**
1. User acceptance testing
2. Load testing with real traffic
3. Monitor performance and costs
4. Documentation completion

## ⚡ **Expected Performance**

### **Cloudflare Pages Functions Benefits:**
- **Global edge deployment** - Sub-100ms response times
- **Auto-scaling** - Handles traffic spikes automatically  
- **No cold starts** - Always-warm function execution
- **Built-in DDoS protection** - Enterprise-grade security
- **Cost effective** - Pay only for actual usage

### **API Response Times:**
- Reddit scraping: 2-5 seconds
- Video generation: 30-60 seconds  
- File uploads: 5-15 seconds
- Usage stats: <500ms

## 🎯 **Success Criteria**

### **Phase 7 Complete When:**
- ✅ All API routes functional on Cloudflare Pages
- ✅ End-to-end workflow works (Categories → Videos)
- ✅ R2 storage integration verified
- ✅ Budget protection active and tested
- ✅ Performance meets targets (<100ms for stats, <60s for generation)
- ✅ User acceptance validation complete
- ✅ Documentation complete

This setup will provide a fully functional Reddit video automation system deployed on Cloudflare Pages with global performance and enterprise security.