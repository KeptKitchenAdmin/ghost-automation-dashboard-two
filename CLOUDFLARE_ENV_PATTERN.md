# Cloudflare Pages Functions Environment Variable Access Pattern

## 🔒 **Secure Server-Side Environment Variables**

### **Cloudflare Pages Functions Pattern:**

```javascript
// /functions/api/example.js
export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Access environment variables from Cloudflare Pages
  const apiKey = env.MY_SECRET_KEY;
  const databaseUrl = env.DATABASE_URL;
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  
  // Use the environment variables securely on server-side
  console.log('API Key length:', apiKey?.length || 0);
  
  return new Response(JSON.stringify({
    success: true,
    hasApiKey: !!apiKey
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### **Next.js API Routes Pattern (for reference - won't work with static export):**

```typescript
// /app/api/example/route.ts
export async function POST(request: Request, { env }: { env?: any }) {
  // Cloudflare env access (when available) + fallback to process.env
  const apiKey = env?.MY_SECRET_KEY || process.env.MY_SECRET_KEY;
  const databaseUrl = env?.DATABASE_URL || process.env.DATABASE_URL;
  
  // Use the environment variables
  if (!apiKey) {
    throw new Error('API key not configured');
  }
  
  // ... rest of the logic
}
```

## 🌟 **Current Implementation:**

### **Active Cloudflare Pages Functions:**
- **`/functions/api/reddit-stories.js`** - Uses `env.ANTHROPIC_API_KEY`
- **`/functions/api/generate-video.js`** - Uses `env.SHOTSTACK_SANDBOX_API_KEY` and `env.SHOTSTACK_PRODUCTION_API_KEY`

### **Environment Variables in Cloudflare Pages:**
```
ANTHROPIC_API_KEY=your_claude_api_key
SHOTSTACK_SANDBOX_API_KEY=your_shotstack_sandbox_key
SHOTSTACK_PRODUCTION_API_KEY=your_shotstack_production_key
CLOUDFLARE_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
```

## 🔐 **Security Benefits:**

1. **Server-side only** - Environment variables never exposed to client
2. **No NEXT_PUBLIC_** prefix needed - keeps keys completely private
3. **Cloudflare Pages secure storage** - Environment variables encrypted at rest
4. **Runtime access only** - Variables only available during function execution

## 📝 **Usage Notes:**

- **Cloudflare Pages Functions** (`/functions/`) use `env.VARIABLE_NAME`
- **Next.js API Routes** (when working) use `env?.VARIABLE_NAME || process.env.VARIABLE_NAME`
- **Static export mode** only supports Cloudflare Pages Functions
- **Never use `NEXT_PUBLIC_`** as it exposes variables to the client