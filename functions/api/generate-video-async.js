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
      uploadedVideo,
      voiceSettings,
      duration,
      startTime,
      trimDuration,
      useProduction = false,
      addCaptions = true
    } = await request.json();
    
    console.log(`🎬 Server: Starting ASYNC Shotstack process`);
    
    // Handle uploaded video file or URL
    let actualVideoUrl;
    if (uploadedVideo) {
      console.log(`📹 Processing uploaded video: ${uploadedVideo.filename}`);
      // For uploaded videos, we need to process the base64 data
      // Shotstack can accept base64 data directly in some cases, or we need to convert it
      actualVideoUrl = uploadedVideo.base64;
    } else if (backgroundVideoUrl) {
      console.log(`📹 Input URL: ${backgroundVideoUrl}`);
      actualVideoUrl = backgroundVideoUrl;
    } else {
      throw new Error('No video source provided - need either uploadedVideo or backgroundVideoUrl');
    }
    
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
    console.log('📥 Starting video ingest...');
    const ingestUrl = useProduction 
      ? 'https://api.shotstack.io/ingest/v1/sources'
      : 'https://api.shotstack.io/ingest/stage/sources';
    
    let ingestBody;
    if (uploadedVideo) {
      // For uploaded videos, use Shotstack's upload endpoint
      console.log('📤 Uploading video file to Shotstack...');
      ingestBody = {
        url: actualVideoUrl // Base64 data URL
      };
    } else {
      // For URL-based videos
      ingestBody = {
        url: actualVideoUrl
      };
    }
    
    const ingestResponse = await fetch(ingestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      },
      body: JSON.stringify(ingestBody)
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
        video_source: uploadedVideo ? 'uploaded_file' : 'url',
        video_url: backgroundVideoUrl,
        uploaded_filename: uploadedVideo?.filename,
        start_time: startTime,
        duration: duration,
        trim_duration: trimDuration,
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

// Helper functions for YouTube URL processing
function isYouTubeUrl(url) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

async function extractYouTubeUrl(youtubeUrl) {
  // Extract video ID from YouTube URL
  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL format');
  }
  
  // Try multiple extraction methods
  return await extractWithPublicAPI(videoId);
}

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function extractWithPublicAPI(videoId) {
  // Method 1: Try YouTube Video Downloader API (RapidAPI)
  try {
    console.log('🔍 Trying YouTube Video Downloader API...');
    
    const response = await fetch(`https://youtube-video-download-info.p.rapidapi.com/dl?id=${videoId}`, {
      headers: {
        'X-RapidAPI-Key': env.RAPIDAPI_KEY || 'demo-key',
        'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ RapidAPI response received for: ${data.title}`);
      
      // Look for MP4 links
      const mp4Links = data.link?.filter(link => 
        link.type === 'mp4' && link.size && link.link
      );
      
      if (mp4Links && mp4Links.length > 0) {
        // Sort by quality (720p, 480p, etc.)
        const bestLink = mp4Links.sort((a, b) => 
          parseInt(b.q?.replace('p', '') || '0') - parseInt(a.q?.replace('p', '') || '0')
        )[0];
        
        console.log(`✅ Found MP4 via RapidAPI: ${bestLink.q}`);
        return bestLink.link;
      }
    }
  } catch (error) {
    console.log('❌ RapidAPI YouTube downloader failed:', error.message);
  }
  
  // Method 2: Try YouTube Media Downloader API
  try {
    console.log('🔍 Trying YouTube Media Downloader API...');
    
    const response = await fetch(`https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}`, {
      headers: {
        'X-RapidAPI-Key': env.RAPIDAPI_KEY || 'demo-key',
        'X-RapidAPI-Host': 'youtube-media-downloader.p.rapidapi.com'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Media Downloader API response received`);
      
      // Look for video formats
      const videoFormats = data.videos?.filter(video => 
        video.extension === 'mp4' && video.url
      );
      
      if (videoFormats && videoFormats.length > 0) {
        // Get highest quality
        const bestVideo = videoFormats.sort((a, b) => 
          parseInt(b.quality?.replace('p', '') || '0') - parseInt(a.quality?.replace('p', '') || '0')
        )[0];
        
        console.log(`✅ Found MP4 via Media Downloader: ${bestVideo.quality}`);
        return bestVideo.url;
      }
    }
  } catch (error) {
    console.log('❌ Media Downloader API failed:', error.message);
  }
  
  // Method 3: Try Social Media Video Downloader API
  try {
    console.log('🔍 Trying Social Media Downloader API...');
    
    const response = await fetch('https://social-media-video-downloader.p.rapidapi.com/smvd/get/all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': env.RAPIDAPI_KEY || 'demo-key',
        'X-RapidAPI-Host': 'social-media-video-downloader.p.rapidapi.com'
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Social Media Downloader response received`);
      
      // Look for video links
      const videoLinks = data.links?.filter(link => 
        link.type?.includes('video') && link.url
      );
      
      if (videoLinks && videoLinks.length > 0) {
        const bestVideo = videoLinks[0]; // Usually first is best quality
        console.log(`✅ Found video via Social Media Downloader`);
        return bestVideo.url;
      }
    }
  } catch (error) {
    console.log('❌ Social Media Downloader API failed:', error.message);
  }
  
  // Method 4: Fallback to Invidious (free but less reliable)
  const invidiousInstances = [
    'https://invidious.kavin.rocks',
    'https://vid.puffyan.us'
  ];
  
  for (const instance of invidiousInstances) {
    try {
      console.log(`🔍 Trying Invidious fallback: ${instance}`);
      
      const response = await fetch(`${instance}/api/v1/videos/${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Ghost-Automation/1.0)'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        const mp4Streams = data.formatStreams?.filter(stream => 
          stream.type?.includes('mp4') && stream.url
        );
        
        if (mp4Streams && mp4Streams.length > 0) {
          const bestStream = mp4Streams[0];
          console.log(`✅ Found MP4 via Invidious fallback: ${bestStream.quality}`);
          return bestStream.url;
        }
      }
    } catch (error) {
      console.log(`❌ Invidious ${instance} failed:`, error.message);
      continue;
    }
  }
  
  // If all methods fail
  throw new Error('YouTube extraction failed. All downloader services unavailable. Please add RAPIDAPI_KEY to environment variables or use a direct video URL.');
}