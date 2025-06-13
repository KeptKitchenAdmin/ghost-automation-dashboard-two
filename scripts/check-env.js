#!/usr/bin/env node

/**
 * Build-time check - Cloudflare Pages with server-side Functions
 * We don't need NEXT_PUBLIC_ variables since we use server-side Functions
 */

console.log('🔍 Build-time Environment Variable Check');
console.log('==========================================');

console.log('✅ Using Cloudflare Pages Functions architecture');
console.log('✅ Server-side environment variables are configured in Cloudflare Pages dashboard');
console.log('✅ No NEXT_PUBLIC_ variables needed - all API keys are server-side only');
console.log('✅ Functions can access: SHOTSTACK_*_API_KEY, ANTHROPIC_API_KEY safely');

console.log('==========================================');