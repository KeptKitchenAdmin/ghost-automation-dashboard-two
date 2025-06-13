/**
 * YouTube URL extraction using Cobalt API
 * Personal cobalt instance deployed on Render for reliable YouTube downloads
 */

export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    const { youtubeUrl } = await request.json();
    
    if (!youtubeUrl) {
      throw new Error('YouTube URL is required');
    }
    
    console.log(`🔍 Extracting YouTube URL: ${youtubeUrl}`);
    
    // Validate YouTube URL format
    if (!isValidYouTubeUrl(youtubeUrl)) {
      throw new Error('Invalid YouTube URL format');
    }
    
    console.log(`📹 Processing YouTube URL: ${youtubeUrl}`);
    
    // Extract video using Cobalt API
    const directUrl = await extractWithCobaltAPI(youtubeUrl);
    
    return new Response(JSON.stringify({
      success: true,
      original_url: youtubeUrl,
      direct_url: directUrl,
      extraction_method: 'cobalt_api',
      cobalt_instance: 'https://cobalt-latest-qymt.onrender.com',
      note: 'Direct MP4 URL extracted via personal Cobalt instance for Shotstack compatibility'
    }, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('❌ YouTube extraction failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      error_type: error.constructor.name,
      original_url: youtubeUrl || 'unknown',
      cobalt_instance: 'https://cobalt-latest-qymt.onrender.com',
      note: 'YouTube URL extraction failed - Cobalt instance may be sleeping or video may be restricted'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

function isValidYouTubeUrl(url) {
  const patterns = [
    /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/,
    /^https?:\/\/(www\.)?youtube\.com\/v\//,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\//
  ];
  
  return patterns.some(pattern => pattern.test(url));
}

async function extractWithCobaltAPI(youtubeUrl) {
  const COBALT_API_URL = 'https://cobalt-latest-qymt.onrender.com/';
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 seconds
  
  console.log(`🔗 Calling Cobalt API: ${COBALT_API_URL}`);
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${MAX_RETRIES} for URL: ${youtubeUrl}`);
      
      const requestBody = {
        url: youtubeUrl,
        vCodec: "h264",
        vQuality: "720",
        aFormat: "mp3",
        isAudioOnly: false
      };
      
      console.log(`📤 Sending request to Cobalt:`, requestBody);
      
      const response = await fetch(COBALT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; Ghost-Automation/1.0)'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log(`📥 Cobalt response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ Cobalt HTTP error: ${response.status} - ${errorText}`);
        
        if (response.status === 503 && attempt < MAX_RETRIES) {
          console.log(`⏳ Cobalt instance may be sleeping, waiting ${RETRY_DELAY/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
        
        throw new Error(`Cobalt API returned ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`📊 Cobalt response data:`, data);
      
      // Handle Cobalt response format
      if (data.status === 'error') {
        const errorCode = data.error?.code || 'unknown_error';
        console.log(`❌ Cobalt API error: ${errorCode}`);
        
        // Handle specific error codes
        if (errorCode === 'error.api.youtube.login' && attempt < MAX_RETRIES) {
          console.log(`🔄 YouTube login issue, retrying with different parameters...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        throw new Error(`Cobalt extraction failed: ${errorCode}`);
      }
      
      // Success case - extract the direct URL
      if (data.status === 'tunnel' && data.url) {
        console.log(`✅ Cobalt extraction successful`);
        
        return {
          url: data.url,
          quality: requestBody.vQuality,
          type: 'video/mp4',
          title: data.filename || 'YouTube Video',
          extraction_method: 'cobalt',
          instance: COBALT_API_URL
        };
      }
      
      // Handle stream/redirect case
      if (data.status === 'stream' || data.status === 'redirect') {
        console.log(`✅ Cobalt extraction successful (${data.status})`);
        
        return {
          url: data.url,
          quality: requestBody.vQuality,
          type: 'video/mp4',
          title: data.filename || 'YouTube Video',
          extraction_method: 'cobalt',
          instance: COBALT_API_URL
        };
      }
      
      // Unexpected response format
      throw new Error(`Unexpected Cobalt response format: ${JSON.stringify(data)}`);
      
    } catch (error) {
      console.log(`❌ Cobalt attempt ${attempt} failed:`, error.message);
      
      if (attempt === MAX_RETRIES) {
        throw new Error(`Cobalt extraction failed after ${MAX_RETRIES} attempts: ${error.message}`);
      }
      
      // Wait before retry
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Waiting ${RETRY_DELAY/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
}