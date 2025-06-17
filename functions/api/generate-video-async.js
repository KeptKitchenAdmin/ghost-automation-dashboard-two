/**
 * Proper Shotstack Video Generation with 3-Step Upload Workflow
 * 1. Get signed upload URL from Shotstack
 * 2. Upload raw video file to signed URL
 * 3. Create audio with Shotstack's built-in TTS
 * 4. Create render with video + audio
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
    console.log(`📝 Story Analysis:`);
    console.log(`  - Total Characters: ${selectedStory.content.length}`);
    console.log(`  - Word Count: ${selectedStory.content.split(' ').length}`);
    console.log(`  - Story Preview: "${selectedStory.content.substring(0, 200)}..."`);
    console.log(`  - Story Type: ${typeof selectedStory.content}`);
    console.log(`  - Has Newlines: ${selectedStory.content.includes('\n')}`);
    console.log(`  - Has Special Chars: ${/[^\x20-\x7E]/.test(selectedStory.content)}`);
    console.log(`  - Full Story Object:`, JSON.stringify(selectedStory, null, 2));
    
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
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('❌ Failed to get upload URL:', errorText);
      throw new Error(`Failed to get upload URL: ${uploadResponse.status} - ${errorText}`);
    }
    
    const uploadData = await uploadResponse.json();
    console.log('✅ Upload response received');
    
    // Extract the signed URL and ID from the response
    const signedUrl = uploadData.data?.attributes?.url || uploadData.data?.url;
    const sourceId = uploadData.data?.attributes?.id || uploadData.data?.id;
    
    if (!signedUrl || !sourceId) {
      throw new Error(`Missing required fields from upload response. Got: ${JSON.stringify(uploadData)}`);
    }
    
    // STEP 2: Upload raw video file to signed URL
    console.log('📤 Step 2: Uploading video file to signed URL...');
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
    
    if (!putResponse.ok) {
      const errorText = await putResponse.text();
      console.error('❌ Failed to upload video:', errorText);
      throw new Error(`Failed to upload video: ${putResponse.status} - ${errorText}`);
    }
    
    console.log('✅ Video uploaded successfully');
    
    // Construct the source URL from the source ID
    const sourceUrl = `https://shotstack-api-${stage}-sources.s3.amazonaws.com/${sourceId}`;
    console.log(`📹 Video source URL: ${sourceUrl}`);
    
    // STEP 3: Generate audio using Shotstack's built-in TTS
    console.log('🎤 Step 3: Generating voiceover with Shotstack TTS...');
    
    const createUrl = `${baseUrl}/create/${stage}/assets`;
    
    // CRITICAL: Ensure story content is under 2000 characters for Shotstack TTS
    // Validate story content first
    if (!selectedStory.content || typeof selectedStory.content !== 'string') {
      throw new Error('Invalid story content: must be a non-empty string');
    }
    
    // Clean and prepare story text
    let storyText = selectedStory.content.trim()
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/\s+/g, ' '); // Normalize whitespace
    
    // More conservative truncation to ensure we stay well under 2000 chars
    if (storyText.length > 1900) {  // Extra safety buffer
      console.log(`⚠️ Story too long (${storyText.length} chars), truncating to 1900 chars`);
      storyText = storyText.substring(0, 1900) + "...";
    }
    
    const audioPayload = {
      provider: "shotstack",  // Using Shotstack's built-in TTS (NOT elevenlabs)
      options: {
        type: "text-to-speech",
        text: storyText,  // Truncated story text (under 2000 chars)
        voice: voiceSettings.voice_id || "Matthew",
        language: "en-US",
        newscaster: true  // Professional news-style delivery
      }
    };
    
    console.log('🎙️ Calling Shotstack TTS...');
    console.log('📊 TTS Payload Details:');
    console.log('  - Provider:', audioPayload.provider);
    console.log('  - Original Text Length:', selectedStory.content.length);
    console.log('  - Final Text Length:', audioPayload.options.text.length);
    console.log('  - Text Preview:', audioPayload.options.text.substring(0, 100) + '...');
    console.log('  - Text End:', '...' + audioPayload.options.text.substring(audioPayload.options.text.length - 100));
    console.log('  - Voice:', audioPayload.options.voice);
    console.log('  - Full Payload:', JSON.stringify(audioPayload, null, 2));
    
    const audioCreateResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(audioPayload)
    });
    
    if (!audioCreateResponse.ok) {
      const errorText = await audioCreateResponse.text();
      console.error('❌ Failed to create Shotstack TTS audio:', errorText);
      throw new Error(`Failed to create audio: ${audioCreateResponse.status} - ${errorText}`);
    }
    
    const audioData = await audioCreateResponse.json();
    console.log('✅ Shotstack TTS audio created successfully');
    
    const audioUrl = audioData.data.attributes.url;
    console.log(`🎵 Audio URL: ${audioUrl}`);
    
    // STEP 4: Create render with video + audio
    console.log('🎥 Step 4: Creating render with video and voiceover...');
    
    // Create the timeline with video and voiceover
    const timeline = {
      tracks: [
        {
          // Video track
          clips: [{
            asset: {
              type: "video",
              src: sourceUrl // Use the uploaded video URL
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
          // Audio track with Shotstack TTS
          clips: [{
            asset: {
              type: "audio",
              src: audioUrl // URL from Shotstack TTS
            },
            start: 0,
            length: trimDuration || duration,
            volume: 1.0
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