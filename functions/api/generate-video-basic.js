/**
 * Basic video generation - just video, no voiceover (for testing)
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
    
    console.log(`🎬 Server: Starting BASIC video generation (${useProduction ? 'Production' : 'Sandbox'})`);
    
    // Select correct API key and Owner ID based on mode
    const apiKey = useProduction 
      ? env.SHOTSTACK_PRODUCTION_API_KEY 
      : env.SHOTSTACK_SANDBOX_API_KEY;
    
    const ownerId = useProduction
      ? env.SHOTSTACK_PRODUCTION_OWNER_ID
      : env.SHOTSTACK_SANDBOX_OWNER_ID;
    
    if (!apiKey || !ownerId) {
      const mode = useProduction ? 'Production' : 'Sandbox';
      throw new Error(`${mode} Shotstack API key or Owner ID not configured`);
    }
    
    console.log('🎥 Server: Creating basic video composition (no voiceover)...');
    
    // Create simple video render - just the background video trimmed
    const renderJob = await createBasicVideoRender({
      backgroundVideoUrl,
      duration,
      startTime,
      addCaptions,
      captionText: enhancedScript
    }, apiKey, ownerId, useProduction);
    
    console.log('⏳ Server: Waiting for render completion...');
    const completedVideo = await pollRenderCompletion(renderJob.id, apiKey, ownerId, useProduction);
    
    console.log(`✅ Server: Basic video generation complete!`);
    
    return new Response(JSON.stringify({
      success: true,
      videoUrl: completedVideo.url,
      audioUrl: null, // No separate audio for basic version
      costs: {
        shotstack_cost: 0.00, // Sandbox is free
        elevenlabs_cost: 0.00, // No voiceover
        total_cost: 0.00
      },
      mode: useProduction ? 'production' : 'sandbox'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Server: Basic video generation failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Basic video generation failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function createBasicVideoRender(params, apiKey, ownerId, isProduction) {
  const baseUrl = isProduction 
    ? 'https://api.shotstack.io/v1' 
    : 'https://api.shotstack.io/stage';
  
  const timeline = {
    background: '#000000',
    tracks: [
      // Just background video track with trimming
      {
        clips: [{
          asset: {
            type: 'video',
            src: params.backgroundVideoUrl,
            trim: params.startTime, // Start at specified time in source video
            volume: 0.3 // Lower the original audio
          },
          start: 0,
          length: params.duration,
          fit: 'crop',
          scale: 1.0
        }]
      }
    ]
  };
  
  // Add captions if requested
  if (params.addCaptions) {
    const captionClips = generateCaptionClips(params.captionText, params.duration);
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
        height: 1920 // Vertical format for YouTube Shorts
      }
    }
  };
  
  const response = await fetch(`${baseUrl}/render`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'x-shotstack-owner': ownerId
    },
    body: JSON.stringify(renderRequest)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create render: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return { id: data.response.id };
}

async function pollRenderCompletion(renderId, apiKey, ownerId, isProduction) {
  const baseUrl = isProduction 
    ? 'https://api.shotstack.io/v1' 
    : 'https://api.shotstack.io/stage';
  
  const maxAttempts = 120; // 10 minutes max
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(`${baseUrl}/render/${renderId}`, {
      headers: { 
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      }
    });
    
    if (!response.ok) {
      throw new Error(`Render status check failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.response.status === 'done') {
      return { url: data.response.url };
    } else if (data.response.status === 'failed') {
      throw new Error(`Render failed: ${data.response.error || 'Unknown error'}`);
    }
    
    // Wait 5 seconds between checks
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }
  
  throw new Error('Render timeout - video processing took too long');
}

// Generate caption clips for the timeline
function generateCaptionClips(text, duration) {
  const words = text.split(' ');
  const wordsPerSecond = 2;
  const chunkSize = Math.ceil(wordsPerSecond * 3); // 3-second chunks
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