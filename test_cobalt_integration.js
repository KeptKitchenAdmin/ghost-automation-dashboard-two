#!/usr/bin/env node

/**
 * Test script for Cobalt YouTube extraction integration
 * Run with: node test_cobalt_integration.js
 */

async function testCobaltIntegration() {
  console.log('🧪 Testing Cobalt YouTube Integration');
  console.log('=====================================\n');
  
  // Test data
  const testUrls = [
    'https://youtu.be/dQw4w9WgXcQ', // Rick Roll - usually works
    'https://www.youtube.com/watch?v=9bZkp7q19f0', // PSY - Gangnam Style
    'https://www.youtube.com/watch?v=kJQP7kiw5Fk' // Luis Fonsi - Despacito
  ];
  
  const API_ENDPOINT = 'http://localhost:8788/api/youtube-extract'; // Local test
  // const API_ENDPOINT = 'https://ghost-automation-dashboard-three.pages.dev/api/youtube-extract'; // Production
  
  for (const youtubeUrl of testUrls) {
    try {
      console.log(`🔍 Testing: ${youtubeUrl}`);
      console.log(`📡 Calling API: ${API_ENDPOINT}`);
      
      const startTime = Date.now();
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ youtubeUrl })
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`⏱️  Request took: ${duration}ms`);
      console.log(`📊 Response status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ SUCCESS!');
        console.log(`📹 Direct URL: ${data.direct_url?.url || 'N/A'}`);
        console.log(`🎯 Quality: ${data.direct_url?.quality || 'N/A'}`);
        console.log(`📝 Title: ${data.direct_url?.title || 'N/A'}`);
        console.log(`🔧 Method: ${data.extraction_method}`);
        console.log(`🌐 Instance: ${data.cobalt_instance}`);
      } else {
        console.log('❌ FAILED!');
        console.log(`💥 Error: ${data.error}`);
        console.log(`🔍 Error Type: ${data.error_type}`);
        console.log(`💡 Note: ${data.note}`);
      }
      
    } catch (error) {
      console.log('💥 REQUEST FAILED!');
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('\n' + '─'.repeat(50) + '\n');
  }
}

// Direct Cobalt API test
async function testCobaltDirect() {
  console.log('🔗 Direct Cobalt API Test');
  console.log('=========================\n');
  
  const testUrl = 'https://youtu.be/dQw4w9WgXcQ';
  const cobaltUrl = 'https://cobalt-latest-qymt.onrender.com/';
  
  try {
    console.log(`🎯 Testing URL: ${testUrl}`);
    console.log(`🔗 Cobalt Instance: ${cobaltUrl}`);
    
    const response = await fetch(cobaltUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        url: testUrl,
        vCodec: "h264",
        vQuality: "720",
        aFormat: "mp3",
        isAudioOnly: false
      })
    });
    
    console.log(`📊 Status: ${response.status}`);
    
    const data = await response.json();
    console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.log(`❌ Direct test failed: ${error.message}`);
  }
}

// Run tests
async function main() {
  console.log('🚀 Starting Cobalt Integration Tests\n');
  
  // Test direct Cobalt API first
  await testCobaltDirect();
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Then test through our API wrapper
  await testCobaltIntegration();
  
  console.log('🏁 Tests completed!');
}

main().catch(console.error);