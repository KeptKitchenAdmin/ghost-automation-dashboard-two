#!/usr/bin/env node

/**
 * Debug script for Cobalt API
 * This replicates EXACTLY what the frontend is doing
 */

async function debugCobaltAPI() {
  console.log('🔍 COBALT API DEBUG REPORT');
  console.log('=' .repeat(60));
  console.log('Date:', new Date().toISOString());
  console.log('=' .repeat(60) + '\n');

  // Test URLs
  const testUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',  // Rick Roll
    'https://youtu.be/jNQXAC9IVRw',                  // Me at the zoo
    'https://www.youtube.com/watch?v=aqz-KE-bpKQ'    // Big Buck Bunny
  ];

  for (const youtubeUrl of testUrls) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${youtubeUrl}`);
    console.log('='.repeat(60));

    // Exact request body from frontend
    const requestBody = {
      url: youtubeUrl,
      videoQuality: "720",
      audioFormat: "mp3",
      youtubeVideoCodec: "h264"
    };

    console.log('\n📤 REQUEST DETAILS:');
    console.log('Endpoint: https://cobalt-latest-qymt.onrender.com/');
    console.log('Method: POST');
    console.log('Headers:');
    console.log(JSON.stringify({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }, null, 2));
    console.log('Body:');
    console.log(JSON.stringify(requestBody, null, 2));

    try {
      const startTime = Date.now();
      
      const response = await fetch('https://cobalt-latest-qymt.onrender.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const duration = Date.now() - startTime;

      console.log('\n📥 RESPONSE DETAILS:');
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Duration: ${duration}ms`);
      console.log('Headers:');
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log(JSON.stringify(headers, null, 2));

      const responseData = await response.json();
      console.log('\nResponse Body:');
      console.log(JSON.stringify(responseData, null, 2));

      // Analyze response
      if (responseData.status === 'error') {
        console.log('\n❌ ERROR ANALYSIS:');
        console.log(`Error Code: ${responseData.error?.code}`);
        console.log(`Error Details: ${JSON.stringify(responseData.error)}`);
      } else if (responseData.url) {
        console.log('\n✅ SUCCESS!');
        console.log(`Direct URL: ${responseData.url}`);
        console.log(`Status: ${responseData.status}`);
      }

    } catch (error) {
      console.log('\n💥 REQUEST FAILED:');
      console.log(`Error Type: ${error.constructor.name}`);
      console.log(`Error Message: ${error.message}`);
      console.log(`Stack: ${error.stack}`);
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('MANUAL TEST COMMANDS:');
  console.log('='.repeat(60));
  console.log('\nTest with curl (exact same request):');
  console.log(`
curl -X POST "https://cobalt-latest-qymt.onrender.com/" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "videoQuality": "720",
    "audioFormat": "mp3",
    "youtubeVideoCodec": "h264"
  }' \\
  -v
`);

  console.log('\n' + '='.repeat(60));
  console.log('RECOMMENDATIONS:');
  console.log('='.repeat(60));
  console.log('1. If getting "youtube.login" errors, YouTube might be blocking your Cobalt instance');
  console.log('2. Try accessing Cobalt web UI: https://cobalt-latest-qymt.onrender.com/');
  console.log('3. Check Cobalt logs on Render dashboard');
  console.log('4. Consider using a different YouTube URL or testing with non-YouTube URLs');
}

// Run the debug
debugCobaltAPI().catch(console.error);