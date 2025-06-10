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

## 💡 **Remember:**
- We do NOT use Vercel anymore
- All deployments go through Cloudflare Workers
- Use `npm run deploy` after pushing to GitHub
- API routes need to be deployed as separate Workers