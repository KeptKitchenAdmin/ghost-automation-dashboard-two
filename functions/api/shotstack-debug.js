/**
 * DEBUG: Show EXACT Shotstack API request and response
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const {
      enhancedScript,
      backgroundVideoUrl,
      voiceSettings,
      duration,
      startTime,
      useProduction = false,
      addCaptions = true
    } = await request.json();
    
    console.log('🔍 DEBUGGING SHOTSTACK API REQUEST');
    console.log('Background Video URL:', backgroundVideoUrl);
    console.log('Duration:', duration);
    console.log('Start Time:', startTime);
    
    const apiKey = useProduction 
      ? env.SHOTSTACK_PRODUCTION_API_KEY 
      : env.SHOTSTACK_SANDBOX_API_KEY;
    
    const ownerId = useProduction
      ? env.SHOTSTACK_PRODUCTION_OWNER_ID
      : env.SHOTSTACK_SANDBOX_OWNER_ID;
    
    const baseUrl = useProduction 
      ? 'https://api.shotstack.io/v1' 
      : 'https://api.shotstack.io/stage';
    
    // BUILD THE EXACT TIMELINE WE'RE SENDING
    const timeline = {
      background: '#000000',
      tracks: [
        {
          clips: [{
            asset: {
              type: 'video',
              src: backgroundVideoUrl, // THIS IS THE YOUTUBE URL!
              trim: startTime, // Trim parameter
              volume: 0.3
            },
            start: 0,
            length: duration,
            fit: 'crop',
            scale: 1.0
          }]
        }
      ]
    };
    
    // Add captions
    if (addCaptions) {
      const captionClips = generateCaptionClips(enhancedScript, duration);
      timeline.tracks.push({
        clips: captionClips
      });
    }
    
    const renderRequest = {
      timeline,
      output: {
        format: 'mp4',
        resolution: 'hd',
        size: {
          width: 1080,
          height: 1920
        }
      }
    };
    
    console.log('📤 EXACT REQUEST TO SHOTSTACK:');
    console.log('URL:', `${baseUrl}/render`);
    console.log('Headers:', {
      'Content-Type': 'application/json',
      'x-api-key': apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING',
      'x-shotstack-owner': ownerId ? `${ownerId.substring(0, 10)}...` : 'MISSING'
    });
    console.log('Body:', JSON.stringify(renderRequest, null, 2));
    
    // MAKE THE ACTUAL REQUEST
    const response = await fetch(`${baseUrl}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      },
      body: JSON.stringify(renderRequest)
    });
    
    console.log('📥 SHOTSTACK RESPONSE:');
    console.log('Status:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw_response: responseText };
    }
    
    return new Response(JSON.stringify({
      success: response.ok,
      shotstack_request: {
        url: `${baseUrl}/render`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING',
          'x-shotstack-owner': ownerId ? `${ownerId.substring(0, 10)}...` : 'MISSING'
        },
        body: renderRequest
      },
      shotstack_response: {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data: responseData
      },
      analysis: {
        youtube_url: backgroundVideoUrl,
        is_youtube: backgroundVideoUrl?.includes('youtube.com') || backgroundVideoUrl?.includes('youtu.be'),
        trim_value: startTime,
        duration_value: duration
      }
    }, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

function generateCaptionClips(text, duration) {
  const words = text.split(' ');
  const wordsPerSecond = 2;
  const chunkSize = Math.ceil(wordsPerSecond * 3);
  const clips = [];
  
  let currentTime = 0;
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    const clipDuration = Math.min(3, duration - currentTime);
    
    if (clipDuration <= 0) break;
    
    clips.push({
      asset: {
        type: 'title',
        text: chunk,
        style: 'subtitle',
        color: '#ffffff',
        size: 'medium',
        background: 'rgba(0,0,0,0.5)',
        position: 'bottom'
      },
      start: currentTime,
      length: clipDuration,
      transition: {
        in: 'fade',
        out: 'fade'
      }
    });
    
    currentTime += clipDuration;
  }
  
  return clips;
}