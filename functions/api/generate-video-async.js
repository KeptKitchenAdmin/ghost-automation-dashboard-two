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
    
    const uploadResponse = await fetch(`${baseUrl}/ingest/${stage}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({}) // Empty body as per docs
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('❌ Failed to get upload URL:', errorText);
      throw new Error(`Failed to get upload URL: ${uploadResponse.status} - ${errorText}`);
    }
    
    const uploadData = await uploadResponse.json();
    console.log('✅ Upload response:', JSON.stringify(uploadData, null, 2));
    
    // Extract the signed URL, ID, and SOURCE URL from the response
    const signedUrl = uploadData.data.attributes.url;
    const sourceId = uploadData.data.attributes.id;
    const sourceUrl = uploadData.data.attributes.source; // This is what we need for the timeline!
    
    // STEP 2: Upload raw video file to signed URL
    console.log('📤 Step 2: Uploading video file to signed URL...');
    
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
    
    if (!putResponse.ok) {
      const errorText = await putResponse.text();
      console.error('❌ Failed to upload video:', errorText);
      throw new Error(`Failed to upload video: ${putResponse.status} - ${errorText}`);
    }
    
    console.log('✅ Video uploaded successfully');
    
    if (!sourceUrl) {
      throw new Error('No source URL returned from upload - check the upload response structure');
    }
    
    console.log(`📹 Using source URL: ${sourceUrl}`);
    
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

