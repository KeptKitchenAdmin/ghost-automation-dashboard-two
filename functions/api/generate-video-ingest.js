/**
 * Shotstack Ingest API + Video Generation
 * Step 1: Ingest YouTube URL → Step 2: Render with trimming
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
    
    console.log(`🎬 Server: Starting Shotstack Ingest + Render (${useProduction ? 'Production' : 'Sandbox'})`);
    console.log(`📹 YouTube URL: ${backgroundVideoUrl}`);
    console.log(`⏱️ Start: ${startTime}s, Duration: ${duration}s`);
    
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
    
    // STEP 1: INGEST YOUTUBE VIDEO
    console.log('📥 Step 1: Ingesting YouTube video...');
    const ingestUrl = useProduction 
      ? 'https://api.shotstack.io/ingest/v1/sources'
      : 'https://api.shotstack.io/ingest/stage/sources';
    
    const ingestResponse = await fetch(ingestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      },
      body: JSON.stringify({
        url: backgroundVideoUrl
      })
    });
    
    console.log(`📥 Ingest response: ${ingestResponse.status} ${ingestResponse.statusText}`);
    
    if (!ingestResponse.ok) {
      const errorText = await ingestResponse.text();
      console.error('❌ Ingest failed:', errorText);
      throw new Error(`Shotstack ingest failed: ${ingestResponse.status} - ${errorText}`);
    }
    
    const ingestData = await ingestResponse.json();
    console.log('✅ Ingest successful:', ingestData.data.id);
    
    // STEP 2: WAIT FOR INGEST COMPLETION
    console.log('⏳ Step 2: Waiting for ingest completion...');
    const ingestedSource = await pollIngestCompletion(ingestData.data.id, apiKey, ownerId, useProduction);
    console.log('✅ Video ingested and ready:', ingestedSource.url);
    
    // STEP 3: CREATE VIDEO RENDER WITH SHOTSTACK-HOSTED URL
    console.log('🎥 Step 3: Creating video render...');
    const renderJob = await createVideoRender({
      ingestedVideoUrl: ingestedSource.url,
      duration,
      startTime,
      addCaptions,
      captionText: enhancedScript
    }, apiKey, ownerId, useProduction);
    
    // STEP 4: WAIT FOR RENDER COMPLETION
    console.log('⏳ Step 4: Waiting for render completion...');
    const completedVideo = await pollRenderCompletion(renderJob.id, apiKey, ownerId, useProduction);
    
    console.log(`✅ Server: Video generation complete!`);
    
    return new Response(JSON.stringify({
      success: true,
      videoUrl: completedVideo.url,
      ingestedUrl: ingestedSource.url,
      costs: {
        shotstack_cost: useProduction ? (duration / 60) * 0.40 : 0.00,
        elevenlabs_cost: 0.00, // No voiceover in this version
        total_cost: useProduction ? (duration / 60) * 0.40 : 0.00
      },
      mode: useProduction ? 'production' : 'sandbox',
      debug: {
        ingest_id: ingestData.data.id,
        render_id: renderJob.id,
        original_youtube_url: backgroundVideoUrl,
        shotstack_hosted_url: ingestedSource.url
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Server: Ingest + Video generation failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Ingest + Video generation failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Poll ingest completion
async function pollIngestCompletion(ingestId, apiKey, ownerId, isProduction) {
  const baseUrl = isProduction 
    ? 'https://api.shotstack.io/ingest/v1' 
    : 'https://api.shotstack.io/ingest/stage';
  
  const maxAttempts = 60; // 5 minutes max for ingest
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(`${baseUrl}/sources/${ingestId}`, {
      headers: { 
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ingest status check failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`📊 Ingest status: ${data.data.status}`);
    
    if (data.data.status === 'ready') {
      return { 
        url: data.data.url,
        id: data.data.id 
      };
    } else if (data.data.status === 'failed') {
      throw new Error(`Ingest failed: ${data.data.error || 'Unknown error'}`);
    }
    
    // Wait 5 seconds between checks
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }
  
  throw new Error('Ingest timeout - YouTube video processing took too long');
}

// Create video render with ingested video
async function createVideoRender(params, apiKey, ownerId, isProduction) {
  const baseUrl = isProduction 
    ? 'https://api.shotstack.io/v1' 
    : 'https://api.shotstack.io/stage';
  
  const timeline = {
    background: '#000000',
    tracks: [
      // Video track with Shotstack-hosted URL and trimming
      {
        clips: [{
          asset: {
            type: 'video',
            src: params.ingestedVideoUrl, // Shotstack-hosted URL
            trim: params.startTime, // Start time in source video
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
  
  console.log('🎬 Render request with ingested video:', {
    ingestedUrl: params.ingestedVideoUrl,
    trim: params.startTime,
    duration: params.duration
  });
  
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

// Poll render completion
async function pollRenderCompletion(renderId, apiKey, ownerId, isProduction) {
  const baseUrl = isProduction 
    ? 'https://api.shotstack.io/v1' 
    : 'https://api.shotstack.io/stage';
  
  const maxAttempts = 120; // 10 minutes max for render
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
    console.log(`🎬 Render status: ${data.response.status}`);
    
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

// Generate caption clips
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