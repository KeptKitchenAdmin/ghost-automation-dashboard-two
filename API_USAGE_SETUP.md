# Simple API Usage Tracking Setup

## Environment Variables Required

Add these to your Cloudflare Pages environment variables:

```bash
# Cloudflare (for R2 storage only)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
```

**Note:** Your existing API keys (OpenAI, ElevenLabs, etc.) are only used when you generate content - never for monitoring.

## How It Works

### 1. Content Generation Only
- **NO automatic API monitoring or polling**
- **NO constant API calls for usage tracking**
- API calls ONLY happen when you generate content
- Usage is logged locally after each generation

### 2. Simple Data Storage
- Usage logs stored in Cloudflare R2 (`usage-logs/YYYY-MM-DD.json`)
- Daily and monthly totals calculated from logs
- Manual refresh to view current statistics

### 3. Privacy & Control
- Your API keys never used for monitoring
- No external API calls except when creating content
- Complete control over when to track usage

## Usage in Your Content Generation Code

```typescript
import { UsageTracker } from '../lib/api-usage/usage-tracker'

// After making an OpenAI call:
await UsageTracker.logUsage('openai', {
  tokens: 1500,
  cost: 0.045,
  operation: 'text-generation'
})

// After making an ElevenLabs call:
await UsageTracker.logUsage('elevenlabs', {
  cost: 0.002,
  operation: 'voice-synthesis'
})

// After making a HeyGen call:
await UsageTracker.logUsage('heygen', {
  cost: 0.30,
  operation: 'video-creation'
})
```

## Dashboard Features

Your dashboard shows:
- ✅ **Manual refresh button** - no automatic polling
- ✅ **Real usage data** from your content generation
- ✅ **Zero values** when no content has been generated
- ✅ **Daily and monthly totals** from R2 logs
- ✅ **Last updated timestamp**

## API Endpoints

- `GET /api/usage/stats` - Get usage statistics from R2 logs
- `POST /api/usage/log` - Log usage when content is generated (internal)

## Key Benefits

✅ **No API monitoring** - calls only during content generation  
✅ **Complete privacy** - your keys never used for tracking  
✅ **Manual control** - refresh usage data when you want  
✅ **R2 storage** - persistent usage logs  
✅ **Edge Runtime compatible**

## How to Use

1. Generate content using your existing systems
2. Add usage logging calls after each API request
3. Visit `/api-usage` and click "Refresh Usage Data"
4. View your cumulative usage statistics

Your dashboard tracks actual usage from content generation - **no constant monitoring required!**