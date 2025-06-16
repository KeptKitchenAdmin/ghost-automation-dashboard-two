/**
 * Proper Shotstack Video Generation with 3-Step Upload Workflow
 * 1. Get signed upload URL from Shotstack
 * 2. Upload raw video file to signed URL
 * 3. Create render with source URL + voiceover script
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    console.log(`🎬 Starting Shotstack video generation...`);
    
    // Parse FormData
    const formData = await request.formData();
    const videoFile = formData.get('videoFile');
    const data = JSON.parse(formData.get('data'));
    
    const {
      selectedStory,
      targetDuration,
      voiceSettings,
      duration,
      startTime,
      trimDuration,
      useProduction = false,
      addCaptions = true
    } = data;
    
    if (!videoFile) {
      throw new Error('No video file provided');
    }
    
    console.log(`📹 Processing video: ${videoFile.name} (${(videoFile.size / 1024 / 1024).toFixed(1)}MB)`);
    console.log(`📖 Story: ${selectedStory.title} (${targetDuration} minutes)`);
    
    const apiKey = useProduction 
      ? env.SHOTSTACK_PRODUCTION_API_KEY 
      : env.SHOTSTACK_SANDBOX_API_KEY;
    
    if (!apiKey) {
      throw new Error(`Shotstack API key not configured for ${useProduction ? 'production' : 'sandbox'} mode`);
    }
    
    const baseUrl = useProduction 
      ? 'https://api.shotstack.io' 
      : 'https://api.shotstack.io';
      
    const stage = useProduction ? 'v1' : 'stage';
    
    // STEP 1: Get signed upload URL from Shotstack
    console.log('📝 Step 1: Getting signed upload URL from Shotstack...');
    console.log(`📍 Upload endpoint: ${baseUrl}/ingest/${stage}/upload`);
    
    const uploadResponse = await fetch(`${baseUrl}/ingest/${stage}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({}) // Empty body as per docs
    });
    
    console.log('📊 Upload endpoint response status:', uploadResponse.status);
    console.log('📊 Upload endpoint response headers:', uploadResponse.headers);
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('❌ Failed to get upload URL:', errorText);
      throw new Error(`Failed to get upload URL: ${uploadResponse.status} - ${errorText}`);
    }
    
    const uploadData = await uploadResponse.json();
    console.log('✅ Full upload response:', JSON.stringify(uploadData, null, 2));
    console.log('🔍 Response structure:');
    console.log('  - data:', uploadData.data);
    console.log('  - data.attributes:', uploadData.data?.attributes);
    console.log('  - data.id:', uploadData.data?.id);
    console.log('  - data.type:', uploadData.data?.type);
    
    // Extract the signed URL and ID from the response
    const signedUrl = uploadData.data?.attributes?.url || uploadData.data?.url;
    const sourceId = uploadData.data?.attributes?.id || uploadData.data?.id;
    
    // Log what we found
    console.log('📋 Extracted from response:');
    console.log('  - Signed URL:', signedUrl);
    console.log('  - Source ID:', sourceId);
    
    if (!signedUrl || !sourceId) {
      throw new Error(`Missing required fields from upload response. Got: ${JSON.stringify(uploadData)}`);
    }
    
    // STEP 2: Upload raw video file to signed URL
    console.log('📤 Step 2: Uploading video file to signed URL...');
    console.log(`📍 PUT URL: ${signedUrl}`);
    console.log(`📦 File size: ${videoFile.size} bytes`);
    
    // Convert file to ArrayBuffer for upload
    const videoBuffer = await videoFile.arrayBuffer();
    
    const putResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: videoBuffer,
      // IMPORTANT: Do NOT set Content-Type header as per Shotstack docs
      headers: {
        'Content-Length': videoFile.size.toString()
      }
    });
    
    console.log('📊 PUT response status:', putResponse.status);
    console.log('📊 PUT response headers:', Object.fromEntries(putResponse.headers));
    
    if (!putResponse.ok) {
      const errorText = await putResponse.text();
      console.error('❌ Failed to upload video:', errorText);
      throw new Error(`Failed to upload video: ${putResponse.status} - ${errorText}`);
    }
    
    console.log('✅ Video uploaded to S3 successfully');
    
    // STEP 2.5: Check if we need to wait for import to complete
    console.log('⏳ Checking if upload needs processing...');
    
    // Some services require checking status after upload
    // Try to get the source status
    const statusUrl = `${baseUrl}/ingest/${stage}/sources/${sourceId}`;
    console.log(`📍 Checking source status at: ${statusUrl}`);
    
    const statusResponse = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    });
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('📊 Source status:', JSON.stringify(statusData, null, 2));
      
      // Check if status indicates it's still processing
      const status = statusData.data?.attributes?.status;
      console.log(`📊 Import status: ${status}`);
      
      if (status === 'importing' || status === 'queued') {
        console.log('⏳ Source is still importing, waiting...');
        // You might need to poll here until status is 'ready'
      }
    }
    
    // Construct the source URL from the source ID
    // Format: https://shotstack-api-{stage}-sources.s3.amazonaws.com/{sourceId}
    const sourceUrl = `https://shotstack-api-${stage}-sources.s3.amazonaws.com/${sourceId}`;
    
    console.log(`📹 Constructed source URL: ${sourceUrl}`);
    
    // STEP 3: Create render with source URL + voiceover
    console.log('🎥 Step 3: Creating render with voiceover...');
    
    // Create the timeline with video and voiceover
    const timeline = {
      tracks: [
        {
          // Video track
          clips: [{
            asset: {
              type: "video",
              src: sourceUrl // Use the source URL from step 1
            },
            start: 0,
            length: trimDuration || duration,
            offset: {
              x: 0,
              y: 0
            },
            scale: 1
          }]
        },
        {
          // Voiceover track using Shotstack's ElevenLabs integration via Create API
          clips: [{
            asset: {
              type: "audio",
              provider: "elevenlabs",
              options: {
                type: "text-to-speech",
                text: selectedStory.content, // The Reddit story text
                voice: voiceSettings.voice_id // e.g., "Adam", "Bella", etc.
              }
            },
            start: 0,
            length: trimDuration || duration
          }]
        }
      ]
    };
    
    // Add captions track if requested
    if (addCaptions) {
      timeline.tracks.push({
        clips: [{
          asset: {
            type: "html",
            html: `<div style="font-family: Arial; font-size: 24px; color: white; text-align: center; background: rgba(0,0,0,0.8); padding: 10px;">{{caption}}</div>`,
            width: 1920,
            height: 100
          },
          start: 0,
          length: trimDuration || duration,
          position: "bottom"
        }]
      });
    }
    
    const renderBody = {
      timeline: timeline,
      output: {
        format: "mp4",
        resolution: "hd",
        fps: 30
      },
      callback: env.SHOTSTACK_CALLBACK_URL || null
    };
    
    const renderResponse = await fetch(`${baseUrl}/edit/${stage}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(renderBody)
    });
    
    if (!renderResponse.ok) {
      const errorText = await renderResponse.text();
      console.error('❌ Failed to create render:', errorText);
      throw new Error(`Failed to create render: ${renderResponse.status} - ${errorText}`);
    }
    
    const renderData = await renderResponse.json();
    const renderId = renderData.data.id;
    
    console.log(`✅ Render started with ID: ${renderId}`);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Video generation started successfully!",
      render_id: renderId,
      source_id: sourceId,
      estimated_time: "3-5 minutes",
      status_check_url: `/api/shotstack-status?id=${renderId}`,
      mode: useProduction ? 'production' : 'sandbox'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Video generation failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to generate video'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

