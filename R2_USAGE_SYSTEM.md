# R2-Only API Usage Tracking System

## ✅ IMPLEMENTATION COMPLETE

This system tracks API usage ONLY during content generation and stores all data in Cloudflare R2 storage. **NO EXTERNAL API CALLS ARE MADE FOR MONITORING.**

## 🎯 System Overview

### **Content Generation Workflow:**
```
User clicks "Generate Content"
├── OpenAI API call → Log to R2 → ENDS
├── HeyGen API call → Log to R2 → ENDS  
├── ElevenLabs API call → Log to R2 → ENDS
└── Assembly/download → COMPLETE → ALL API CALLS STOP
```

### **Dashboard Workflow:**
```
User visits /api-usage
├── Reads ONLY from R2 storage files
├── Shows cumulative usage data
├── Manual refresh button (reads R2 again)
└── ZERO external API calls
```

## 📁 File Structure

### **Core System Files:**
- `lib/usage/r2-logger.ts` - Usage logging during content generation
- `lib/usage/r2-storage.ts` - R2 storage operations
- `app/api/usage/log/route.ts` - API route to store usage logs
- `app/api/usage/stats/route.ts` - API route to read usage statistics
- `app/api-usage/page.tsx` - Dashboard (R2-only, no external calls)

### **R2 Storage Structure:**
```
usage-logs/
├── daily/
│   ├── 2025-06-10.json
│   ├── 2025-06-11.json
│   └── ...
└── monthly/ (auto-aggregated)
    ├── 2025-06.json
    └── ...
```

## 🎯 Free Plan Limits (CONFIRMED)

### **Actual Account Limits:**
- **OpenAI:** $20/month budget (currently $0.01 used) - 4,000-20,000 clip capacity
- **ElevenLabs:** 10,000 credits/month - 65-130 clip capacity  
- **HeyGen:** 10 credits/month - ~20 clip capacity ⚠️ **BOTTLENECK**
- **Google Cloud:** $300 credit, 88 days remaining - 25,000+ clip capacity

### **System Capacity:**
- **Monthly Limit:** ~20 clips (limited by HeyGen's 10 credits)
- **Recommended Daily Limit:** 1 clip (~20 clips ÷ 30 days)
- **Safety Buffer:** Keep 2 HeyGen credits as emergency reserve

## 🔧 Usage During Content Generation

### **In Your Content Generation Code:**
```typescript
import { R2UsageLogger } from '../lib/usage/r2-logger'

// After OpenAI call:
await R2UsageLogger.logOpenAI({
  operation: 'script-generation',
  tokens: 1500,
  cost: 0.045,
  model: 'gpt-4'
})

// After HeyGen call (TRACK CAREFULLY - BOTTLENECK SERVICE):
await R2UsageLogger.logHeyGen({
  operation: 'video-generation',
  cost: 0.30,
  credits: 0.5  // Typically 0.5 credits per clip
})

// After ElevenLabs call:
await R2UsageLogger.logElevenLabs({
  operation: 'voice-synthesis',
  characters: 500,
  cost: 0.002,
  credits: 150  // Estimated credits used
})

// After Google Cloud call:
await R2UsageLogger.logGoogleCloud({
  operation: 'speech-to-text',
  cost: 0.012
})
```

## 📊 Dashboard Features

### **What the Dashboard Shows:**
- ✅ Daily usage costs from R2 logs
- ✅ Monthly usage costs from R2 logs  
- ✅ Token/character/request counts
- ✅ Manual refresh button
- ✅ Last updated timestamp
- ✅ "Data Source: R2 Storage Only" indicator

### **What the Dashboard NEVER Does:**
- ❌ Call OpenAI usage API
- ❌ Call ElevenLabs subscription API
- ❌ Call HeyGen API for monitoring
- ❌ Background polling or intervals
- ❌ Automatic refresh on page load

## 🔒 Privacy & Security

### **API Key Usage:**
- ✅ API keys used ONLY during content generation
- ✅ API keys NEVER used for monitoring/dashboard
- ✅ Complete privacy - no external monitoring

### **Data Storage:**
- ✅ All usage data stored in YOUR R2 storage
- ✅ No data sent to external monitoring services
- ✅ You own and control all usage data

## 🚀 Environment Variables

Only these are needed for R2 storage:

```bash
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
R2_BUCKET_NAME=ghosttrace-output  # Optional
```

Your existing API keys (OpenAI, ElevenLabs, HeyGen) are only used during content generation.

## ✅ Verification

### **External API Call Check:**
```bash
# Search for monitoring API calls (should return empty)
grep -r "https://api.openai.com.*usage\|subscription" app/ lib/
```

### **R2-Only Operations:**
- Dashboard reads from `/api/usage/stats` (R2 only)
- Usage logging writes to `/api/usage/log` (R2 only)
- No external API endpoints called

## 🎯 System Guarantees

1. **✅ API calls ONLY during content generation (30-60 seconds)**
2. **✅ Complete API silence outside content generation**  
3. **✅ Dashboard reads ONLY from R2 storage**
4. **✅ No background processes or polling**
5. **✅ Manual refresh control**
6. **✅ Privacy-first design**

## 📈 Usage Pattern

```
Content Generation: Brief API usage → Log to R2 → Silence
Dashboard Usage: Read R2 → Display → No external calls
Result: Complete control over API usage timing
```

**This system provides complete visibility into your API usage without any monitoring overhead or privacy concerns.**