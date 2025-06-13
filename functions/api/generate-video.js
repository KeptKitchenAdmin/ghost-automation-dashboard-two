/**
 * Cloudflare Pages Function: Secure Shotstack Video Generation
 * Environment Variables: SHOTSTACK_SANDBOX_API_KEY, SHOTSTACK_PRODUCTION_API_KEY (server-side only)
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
    
    console.log(`🎬 Server: Starting video generation (${useProduction ? 'Production' : 'Sandbox'})`);
    
    // Debug environment variables
    console.log('🔍 Server: Environment variables check:', {
      hasSandboxKey: !!env.SHOTSTACK_SANDBOX_API_KEY,
      hasProductionKey: !!env.SHOTSTACK_PRODUCTION_API_KEY,
      sandboxKeyLength: env.SHOTSTACK_SANDBOX_API_KEY?.length || 0,
      productionKeyLength: env.SHOTSTACK_PRODUCTION_API_KEY?.length || 0,
      useProduction,
      // Check ALL possible Shotstack key variations
      allEnvKeys: Object.keys(env),
      shotstackVariations: {
        'SHOTSTACK_API_KEY': !!env.SHOTSTACK_API_KEY,
        'SHOTSTACK_SANDBOX_API_KEY': !!env.SHOTSTACK_SANDBOX_API_KEY,
        'SHOTSTACK_PRODUCTION_API_KEY': !!env.SHOTSTACK_PRODUCTION_API_KEY,
        'SHOTSTACK_SANDBOX': !!env.SHOTSTACK_SANDBOX,
        'SHOTSTACK_PRODUCTION': !!env.SHOTSTACK_PRODUCTION
      }
    });
    
    // Select correct API key and Owner ID based on mode
    const apiKey = useProduction 
      ? env.SHOTSTACK_PRODUCTION_API_KEY 
      : env.SHOTSTACK_SANDBOX_API_KEY;
    
    const ownerId = useProduction
      ? env.SHOTSTACK_PRODUCTION_OWNER_ID
      : env.SHOTSTACK_SANDBOX_OWNER_ID;
    
    if (!apiKey || !ownerId) {
      const mode = useProduction ? 'Production' : 'Sandbox';
      const debugInfo = {
        mode,
        hasApiKey: !!apiKey,
        hasOwnerId: !!ownerId,
        availableKeys: Object.keys(env).filter(key => key.includes('SHOTSTACK')),
        allEnvKeys: Object.keys(env).length
      };
      console.error('❌ Server: Missing Shotstack credentials:', debugInfo);
      throw new Error(`${mode} Shotstack API key or Owner ID not configured - Debug: ${JSON.stringify(debugInfo)}`);
    }
    
    // Step 1: Create voiceover with ElevenLabs (via Shotstack)
    console.log('🎤 Server: Creating voiceover...');
    const voiceoverAsset = await createVoiceoverAsset(enhancedScript, voiceSettings.voice_id, apiKey, ownerId, useProduction);
    
    // Step 2: Wait for voiceover to be ready
    const voiceoverUrl = await pollAssetStatus(voiceoverAsset.id, apiKey, ownerId, useProduction);
    
    // Step 3: Create video composition
    console.log('🎥 Server: Creating video composition...');
    const renderJob = await createVideoRender({
      audioUrl: voiceoverUrl.url,
      backgroundVideoUrl,
      duration,
      startTime,
      addCaptions,
      captionText: enhancedScript
    }, apiKey, ownerId, useProduction);
    
    // Step 4: Poll for render completion
    console.log('⏳ Server: Waiting for render completion...');
    const completedVideo = await pollRenderCompletion(renderJob.id, apiKey, ownerId, useProduction);
    
    // Step 5: Calculate costs
    const costs = calculateCosts(duration, enhancedScript.length, useProduction);
    
    console.log(`✅ Server: Video generation complete! Cost: $${costs.total_cost.toFixed(2)}`);
    
    return new Response(JSON.stringify({
      success: true,
      videoUrl: completedVideo.url,
      audioUrl: voiceoverUrl.url,
      costs: costs,
      mode: useProduction ? 'production' : 'sandbox'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Server: Video generation failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Video generation failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Shotstack API integration functions
async function createVoiceoverAsset(text, voiceId, apiKey, ownerId, isProduction) {
  const baseUrl = isProduction 
    ? 'https://api.shotstack.io/v1' 
    : 'https://api.shotstack.io/stage';
  
  const response = await fetch(`${baseUrl}/assets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'x-shotstack-owner': ownerId
    },
    body: JSON.stringify({
      provider: 'elevenlabs',
      options: {
        type: 'text-to-speech',
        text: text,
        voice: voiceId
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create voiceover: ${response.statusText}`);
  }
  
  const data = await response.json();
  return { id: data.data.id };
}

async function createVideoRender(params, apiKey, ownerId, isProduction) {
  const baseUrl = isProduction 
    ? 'https://api.shotstack.io/v1' 
    : 'https://api.shotstack.io/stage';
  
  const timeline = {
    background: '#000000',
    tracks: [
      // Audio track
      {
        clips: [{
          asset: {
            type: 'audio',
            src: params.audioUrl
          },
          start: 0,
          length: params.duration
        }]
      },
      // Background video track with trimming
      {
        clips: [{
          asset: {
            type: 'video',
            src: params.backgroundVideoUrl,
            trim: params.startTime, // Start at specified time in source video
            volume: 1
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
    throw new Error(`Failed to create render: ${response.statusText}`);
  }
  
  const data = await response.json();
  return { id: data.response.id };
}

async function pollAssetStatus(assetId, apiKey, ownerId, isProduction) {
  const baseUrl = isProduction 
    ? 'https://api.shotstack.io/v1' 
    : 'https://api.shotstack.io/stage';
  
  const maxAttempts = 60; // 5 minutes max
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(`${baseUrl}/assets/${assetId}`, {
      headers: { 
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      }
    });
    
    if (!response.ok) {
      throw new Error(`Asset status check failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data.status === 'ready') {
      return { url: data.data.url };
    } else if (data.data.status === 'failed') {
      throw new Error(`Asset generation failed: ${data.data.error || 'Unknown error'}`);
    }
    
    // Wait 5 seconds between checks
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }
  
  throw new Error('Asset generation timeout');
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
  // Simple caption implementation - split text into chunks
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

// Calculate actual costs based on usage
function calculateCosts(durationSeconds, textLength, isProduction) {
  const durationMinutes = durationSeconds / 60;
  
  // Shotstack costs (approximate)
  const shotstackCost = isProduction ? durationMinutes * 0.40 : 0; // Sandbox is free
  
  // ElevenLabs costs (via Shotstack)
  const elevenlabsCost = isProduction ? (textLength / 1000) * 0.018 : 0; // Sandbox is free
  
  return {
    shotstack_cost: shotstackCost,
    elevenlabs_cost: elevenlabsCost,
    total_cost: shotstackCost + elevenlabsCost
  };
}