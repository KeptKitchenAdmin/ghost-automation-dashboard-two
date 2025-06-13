/**
 * Async Shotstack Ingest + Render (Non-blocking)
 * Returns immediately with job ID, check status separately
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
    
    console.log(`🎬 Server: Starting ASYNC Shotstack process`);
    console.log(`📹 YouTube URL: ${backgroundVideoUrl}`);
    
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
    
    // STEP 1: START INGEST (NON-BLOCKING)
    console.log('📥 Starting YouTube ingest...');
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
      console.error('❌ Request details:', {
        url: ingestUrl,
        method: 'POST',
        hasApiKey: !!apiKey,
        hasOwnerId: !!ownerId,
        youtubeUrl: backgroundVideoUrl
      });
      throw new Error(`Shotstack ingest failed: ${ingestResponse.status} - ${errorText}`);
    }
    
    const ingestData = await ingestResponse.json();
    console.log('✅ Ingest started:', ingestData.data.id);
    
    // RETURN IMMEDIATELY - Don't wait for completion
    return new Response(JSON.stringify({
      success: true,
      message: "Video generation started! Check status with the ingest ID.",
      ingest_id: ingestData.data.id,
      estimated_time: "5-10 minutes",
      status_check_url: `/api/shotstack-status?id=${ingestData.data.id}`,
      debug: {
        youtube_url: backgroundVideoUrl,
        start_time: startTime,
        duration: duration,
        mode: useProduction ? 'production' : 'sandbox'
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Server: Async video generation failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to start video generation'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}