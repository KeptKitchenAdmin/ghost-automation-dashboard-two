# 🚀 Phase 7.3: Cloudflare Pages Environment Variables Setup Guide

## 🎯 **Critical Environment Variables for Reddit Video Automation**

### **Step 1: Access Cloudflare Pages Dashboard**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **ghost-automation-dashboard-three**
3. Go to **Settings** → **Environment variables**

### **Step 2: Core Reddit Automation APIs**

```bash
# =============================================================================
# REDDIT VIDEO AUTOMATION CORE APIS (REQUIRED)
# =============================================================================

# Anthropic Claude API (Story enhancement)
ANTHROPIC_API_KEY=sk-ant-your-key-here
# Get from: https://console.anthropic.com/
# Budget: $1/day limit

# Shotstack Video API (Video generation)  
SHOTSTACK_API_KEY=your-shotstack-key-here
# Get from: https://dashboard.shotstack.io/
# Budget: $5/day limit

# ElevenLabs Voice API (Voice synthesis)
ELEVENLABS_API_KEY=your-elevenlabs-key-here  
# Get from: https://elevenlabs.io/
# Budget: $2/day limit
```

### **Step 3: Cloudflare R2 Storage (REQUIRED)**

```bash
# =============================================================================
# CLOUDFLARE R2 STORAGE CONFIGURATION
# =============================================================================

# Cloudflare Account ID
CLOUDFLARE_ACCOUNT_ID=your-account-id
# Find in: Cloudflare Dashboard → Right sidebar

# R2 Access Keys
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
# Create in: Cloudflare Dashboard → R2 → Manage R2 API tokens

# R2 Bucket Settings
R2_BUCKET_NAME=ghosttrace-output
R2_PUBLIC_DOMAIN=your-bucket.r2.dev
# Set up in: R2 → Create bucket → Custom domain (optional)
```

### **Step 4: Security & Protection Settings**

```bash
# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================

# API Security Key (generate random 32-character string)
API_SECRET_KEY=your-random-32-char-secret-key

# Allowed Origins (your production URL)
ALLOWED_ORIGINS=https://ghost-automation-dashboard-three.pages.dev

# Production Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ghost-automation-dashboard-three.pages.dev
```

### **Step 5: Budget Protection (CRITICAL)**

```bash
# =============================================================================
# DAILY BUDGET LIMITS (CRITICAL FOR COST CONTROL)
# =============================================================================

# API Daily Spending Limits
CLAUDE_DAILY_BUDGET=1.00
SHOTSTACK_DAILY_BUDGET=5.00
ELEVENLABS_DAILY_BUDGET=2.00

# Usage Thresholds
USAGE_ALERT_THRESHOLD=0.80
EMERGENCY_STOP_THRESHOLD=0.95

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

## 🔧 **Environment Variables Verification Checklist**

### **Required for Basic Functionality:**
- [ ] `ANTHROPIC_API_KEY` - Claude story enhancement
- [ ] `SHOTSTACK_API_KEY` - Video generation
- [ ] `CLOUDFLARE_ACCOUNT_ID` - R2 storage access
- [ ] `R2_ACCESS_KEY_ID` - R2 storage authentication  
- [ ] `R2_SECRET_ACCESS_KEY` - R2 storage authentication
- [ ] `R2_BUCKET_NAME` - File storage location

### **Required for Security:**
- [ ] `API_SECRET_KEY` - API endpoint protection
- [ ] `ALLOWED_ORIGINS` - CORS security
- [ ] `NODE_ENV=production` - Production environment

### **Required for Budget Protection:**
- [ ] `CLAUDE_DAILY_BUDGET` - Claude spending limit
- [ ] `SHOTSTACK_DAILY_BUDGET` - Shotstack spending limit
- [ ] `USAGE_ALERT_THRESHOLD` - Usage warning threshold

## 🚀 **How to Set Environment Variables in Cloudflare Pages**

### **Method 1: Cloudflare Dashboard (Recommended)**
1. Go to Cloudflare Dashboard → Pages → ghost-automation-dashboard-three
2. Click **Settings** → **Environment variables**
3. Click **Add variable**
4. Enter **Variable name** and **Value**
5. Click **Save**
6. Repeat for each variable
7. **Deploy** → **Create new deployment** to apply changes

### **Method 2: Wrangler CLI**
```bash
# Set a single environment variable
wrangler pages secret put ANTHROPIC_API_KEY --project-name=ghost-automation-dashboard-three

# Bulk upload from file
wrangler pages secret bulk .env.production --project-name=ghost-automation-dashboard-three
```

## 🔒 **Security Best Practices**

### **API Key Management:**
- **Never commit real API keys to git**
- **Use different keys for development vs production**
- **Regularly rotate API keys** (monthly recommended)
- **Monitor API usage** through provider dashboards

### **Access Control:**
- **Restrict R2 bucket access** to specific IPs if needed
- **Enable Cloudflare security features** (Bot Fight Mode, etc.)
- **Monitor deployment logs** for suspicious activity

### **Budget Protection:**
- **Set conservative daily limits** initially
- **Monitor costs daily** for first week
- **Set up billing alerts** in API provider dashboards
- **Review usage patterns** weekly

## 🧪 **Testing Environment Variables**

### **Test API Connection:**
```bash
# Test from local development
npm run dev
# Visit: http://localhost:3000/api/reddit-automation/usage-stats
# Should return usage statistics JSON
```

### **Test Production Deployment:**
```bash
# Deploy to Cloudflare Pages
npm run deploy

# Test live API
curl https://ghost-automation-dashboard-three.pages.dev/api/reddit-automation/usage-stats
# Should return JSON with current usage stats
```

## ⚠️ **Common Setup Issues & Solutions**

### **Issue: API routes return 500 errors**
**Solution:** Check that all required environment variables are set
```bash
# Missing variables will cause runtime errors
# Check Cloudflare Pages deployment logs for specific errors
```

### **Issue: R2 storage connection fails**
**Solution:** Verify R2 credentials and bucket permissions
```bash
# Test R2 access with wrangler CLI:
wrangler r2 object list --bucket=ghosttrace-output
```

### **Issue: CORS errors in browser**
**Solution:** Ensure ALLOWED_ORIGINS matches your domain exactly
```bash
ALLOWED_ORIGINS=https://ghost-automation-dashboard-three.pages.dev
# No trailing slash, exact match required
```

### **Issue: Budget limits not working**
**Solution:** Verify budget protection environment variables
```bash
# All budget variables must be set as numbers (no quotes):
CLAUDE_DAILY_BUDGET=1.00
SHOTSTACK_DAILY_BUDGET=5.00
```

## 📊 **Post-Setup Verification**

### **1. Test API Endpoints:**
- [ ] GET `/api/reddit-automation/usage-stats` - Returns current usage
- [ ] POST `/api/reddit-automation/scrape` - Scrapes Reddit stories
- [ ] POST `/api/upload` - Uploads files to R2 storage

### **2. Test Budget Protection:**
- [ ] Usage limits prevent excessive API calls
- [ ] Daily budgets reset at midnight UTC
- [ ] Emergency stops activate when threshold reached

### **3. Test File Storage:**
- [ ] Files upload successfully to R2 bucket
- [ ] Public URLs are accessible
- [ ] Usage logs are stored correctly

## 🎯 **Success Criteria**

**Phase 7.3 Complete When:**
- ✅ All required environment variables set in Cloudflare Pages
- ✅ API endpoints respond correctly in production
- ✅ R2 storage integration working
- ✅ Budget protection active and tested
- ✅ Security measures in place (CORS, API keys)
- ✅ Usage monitoring functional

**Ready for Phase 7.4: R2 Storage Integration Testing**