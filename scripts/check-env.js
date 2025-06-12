#!/usr/bin/env node

/**
 * Build-time environment variable checker
 * Verifies that all required NEXT_PUBLIC_ variables are available during build
 */

console.log('🔍 Build-time Environment Variable Check');
console.log('==========================================');

const requiredVars = [
  'NEXT_PUBLIC_SHOTSTACK_SANDBOX_API_KEY',
  'NEXT_PUBLIC_SHOTSTACK_PRODUCTION_API_KEY', 
  'NEXT_PUBLIC_ANTHROPIC_API_KEY'
];

let missingVars = [];
let foundVars = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    foundVars.push(`✅ ${varName}: ***${value.slice(-4)}`);
  } else {
    missingVars.push(`❌ ${varName}: MISSING`);
  }
});

console.log('\nFound variables:');
foundVars.forEach(v => console.log(v));

console.log('\nMissing variables:');
missingVars.forEach(v => console.log(v));

console.log('\nAll NEXT_PUBLIC_ variables:');
Object.keys(process.env)
  .filter(key => key.startsWith('NEXT_PUBLIC_'))
  .forEach(key => {
    const value = process.env[key];
    console.log(`  ${key}: ${value ? `***${value.slice(-4)}` : 'EMPTY'}`);
  });

if (missingVars.length > 0) {
  console.log('\n⚠️  Some required environment variables are missing.');
  console.log('   Make sure they are set in Cloudflare Pages environment variables.');
} else {
  console.log('\n✅ All required environment variables are available!');
}

console.log('==========================================');