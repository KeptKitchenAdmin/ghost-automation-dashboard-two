# 🤖 Claude Code Memory & Instructions

## 📝 **Project Context:**
This is an AI automation agency platform with Claude-powered income systems. The project includes:
- Complete 90-day SaaS plan implemented in 1 week
- Frontend: Next.js dashboard deployed on Cloudflare Pages
- **Live URL:** https://ghost-automation-dashboard-three.pages.dev/
- **GitHub Repository:** ghost-automation-dashboard-three (ONLY this repository)
- Multiple income systems: TikTok automation, email sequences, PDF generation, pixel tracking

## 🚀 **CRITICAL: WE USE CLOUDFLARE PAGES, NOT VERCEL!**
**We have moved AWAY from Vercel and Workers. All deployments go through GitHub → Cloudflare Pages → Live Website**

### **Repository Information:**
- **Repository Name:** ghost-automation-dashboard-two
- **GitHub URL:** github.com/KeptKitchenAdmin/ghost-automation-dashboard-two
- **Pages Project:** ghost-automation-dashboard-three
- **Current Deployment:** https://e1a52479.ghost-automation-dashboard-three.pages.dev
- **This is the ONLY repository for this project - all work is done here**

### **Deployment Process (Cloudflare Pages):**
1. Make changes and commit to git normally
2. Push to GitHub: `git push origin main`
3. Deploy to Cloudflare Pages: `npm run deploy`
4. Changes are live immediately at: https://ghost-automation-dashboard-three.pages.dev/

### **Cloudflare Configuration:**
- **Platform:** Cloudflare Pages (static site hosting)
- **Build Output:** `out/` directory (Next.js static export)
- **Deployment Command:** `npx wrangler pages deploy out --project-name=ghost-automation-dashboard-three`

## 🎯 **System Architecture:**
- **Frontend:** `/ghost-automation-dashboard-three/` - Next.js 14 with TypeScript
- **Deployment:** Static export with `output: 'export'` in next.config.js
- **API Routes:** Currently disabled (not compatible with static export)
- **Assets:** Served from Cloudflare Pages

## ✅ **Working Configuration:**
```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
}

// package.json
"scripts": {
  "deploy": "npm run build && npx wrangler pages deploy out --project-name=ghost-automation-dashboard-three"
}
```

## 🔧 **Development Workflow:**
1. Edit files locally
2. Build: `npm run build`
3. Test locally if needed
4. Commit: `git add . && git commit -m "message"`
5. Push: `git push origin main`
6. Deploy: `npm run deploy`
7. View live at: https://ghost-automation-dashboard-three.pages.dev/

## 🚨 **IMPORTANT NOTES:**

### **Static Export Limitations:**
- API routes with dynamic parameters (`[param]`) are NOT supported
- All API functionality must be separate Cloudflare Workers or external services
- Client-side data fetching only

### **Cloudflare Pages Benefits:**
- Global edge deployment
- No cold starts
- Built-in DDoS protection
- Free tier includes unlimited bandwidth
- Automatic deployments from Git

### **Deployment Troubleshooting:**
1. **"Not Found" errors:** Check that build output exists in `out/` directory
2. **Missing assets:** Ensure `npm run build` was run before deploy
3. **API routes not working:** Remember they're not supported with static export

### **Emergency Recovery:**
```bash
# If deployment fails:
npm run build  # Rebuild the static files
npm run deploy  # Deploy again

# Check deployment logs:
wrangler pages deployment list --project-name=ghost-automation-dashboard-three
```

## 📱 **Live App:**
- **URL:** https://ghost-automation-dashboard-three.pages.dev/
- **Platform:** Cloudflare Pages
- **Status:** 100% functional frontend (API routes need separate deployment)

## 🚫 **CRITICAL RULE: NO PLACEHOLDER DATA EVER**
**ZERO TOLERANCE POLICY FOR FAKE DATA**

### **Data Policy:**
- **NEVER** use fake, placeholder, mock, demo, or sample data in frontend components
- **ONLY** display real data from actual APIs/databases OR zeros/empty states
- **NO** hard-coded numbers like $12,000, 250K views, fake usernames, etc.
- **ALL** metrics must be either real or zero until real data is available

### **What This Means:**
```javascript
// ❌ WRONG - Never do this
const revenue = [
  { month: 'Jan', amount: 12000 },
  { month: 'Feb', amount: 15000 }
]

// ✅ CORRECT - Real data or zeros
const revenue = realApiData || [
  { month: 'Jan', amount: 0 },
  { month: 'Feb', amount: 0 }
]
```

### **Empty State Requirements:**
- Show meaningful empty states when no real data exists
- Use appropriate loading states while fetching real data
- Never fake engagement metrics, revenue, or user activity

### **Why This Matters:**
- Prevents misleading analytics and false expectations
- Ensures accurate business decision making
- Maintains system integrity and trust
- Avoids confusion between real and fake performance data

**This rule applies to ALL components: charts, metrics, activity feeds, lead trackers, etc.**

## 🚨 **CRITICAL RULE: API CALLS ONLY DURING CONTENT GENERATION**
**ABSOLUTE PROHIBITION ON MONITORING/BACKGROUND API CALLS**

### **✅ CORRECT API USAGE - BRIEF CONTENT GENERATION WORKFLOW:**
```
User clicks "Generate Content"
├── OpenAI API call → script generated → CALL ENDS
├── HeyGen API call → video generated → CALL ENDS  
├── ElevenLabs API call → audio generated → CALL ENDS
└── Assembly/download → COMPLETE → ALL API CALLS STOP
```
**Duration: 30-60 seconds total, then COMPLETE SILENCE**

### **❌ NEVER BUILD THESE PATTERNS:**
- Background processes making API calls
- Polling timers checking usage every X seconds  
- Dashboard components that call APIs on page load
- "Refresh" buttons that call external APIs for monitoring
- Any ongoing/continuous API communication
- Monitoring API calls (OpenAI usage API, ElevenLabs subscription API, etc.)
- Automatic polling or intervals of any kind

### **✅ REQUIRED ARCHITECTURE:**
- **APIs called ONLY during transactional content generation**
- **Dashboard reads ONLY from Cloudflare R2 storage**
- **Usage logging happens AFTER each API call (to R2)**
- **Zero external API calls outside content generation workflow**
- **All usage data stored locally in R2, never fetched from APIs**

### **🎯 API CALL TIMING:**
- **Active API usage:** 30-60 seconds during generation
- **Rest of time:** COMPLETE API SILENCE
- **Dashboard:** Reads R2 files only, NEVER calls external APIs
- **Monitoring:** ZERO - all data comes from R2 logs

### **Why This Matters:**
- Prevents unnecessary API costs and rate limiting
- Ensures complete privacy (APIs never used for monitoring)
- Maintains predictable, controlled API usage patterns
- Avoids background processes that could fail or consume resources

**This rule applies to ALL external API integrations: OpenAI, Anthropic, ElevenLabs, HeyGen, Google Cloud, etc.**

## 🗄️ **CLOUDFLARE R2 STORAGE INTEGRATION**

### **R2 Configuration:**
R2 storage is configured to handle large assets and uploads that exceed Cloudflare Pages' 25MB limit.

```javascript
// Environment Variables Required:
CLOUDFLARE_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=ghosttrace-output  // optional, defaults to your existing bucket
```

### **File Upload Strategy:**
- **Small files (< 10MB):** Uploaded to R2 for consistency
- **Large files (> 10MB):** Automatically routed to R2 storage
- **Video/Audio files:** Always use R2 regardless of size
- **Documents (PDF, ZIP):** Always use R2 regardless of size

### **R2 API Endpoints:**
- `POST /api/upload` - Upload files with automatic R2 routing
- `GET /api/upload` - Health check and configuration status

### **Usage Example:**
```javascript
// Upload a file to R2 storage
const formData = new FormData();
formData.append('file', selectedFile);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result.url contains the R2 public URL
```

### **Benefits:**
- **No size limits:** R2 can handle files much larger than 25MB
- **Global CDN:** Files served from Cloudflare's edge network
- **Cost effective:** R2 storage is significantly cheaper than alternatives
- **Seamless integration:** Automatic fallback to R2 for large files

## ⚡ **WEBPACK CACHE ELIMINATION**

### **Cache Issues RESOLVED:**
The project was experiencing 203MB webpack cache files that exceeded Cloudflare Pages' 25MB limit. This has been completely resolved:

- **✅ Removed ALL edge runtime** from 17 API routes
- **✅ Completely disabled webpack cache** (no more .pack files)
- **✅ Output size reduced** from 203MB to 1.6MB (99.2% reduction)
- **✅ Static export works perfectly** for Cloudflare Pages

### **Key Fixes Applied:**
1. Removed `export const runtime = 'edge'` from all API routes
2. Disabled ALL webpack caching mechanisms in next.config.js
3. Removed splitChunks optimization that was creating large files
4. Clean build process with zero cache artifacts

### **Monitoring:**
```bash
# Check for cache files (should return 0)
find out -name "*.pack" | wc -l

# Check output size (should be ~1.6MB)
du -sh out/
```

## 💡 **Remember:**
- We do NOT use Vercel anymore
- All deployments go through Cloudflare Pages
- Use `npm run deploy` after pushing to GitHub
- Large files automatically use R2 storage
- Zero webpack cache files in production builds