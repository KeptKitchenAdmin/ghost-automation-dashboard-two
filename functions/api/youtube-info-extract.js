/**
 * YouTube get_video_info API extractor
 * Uses YouTube's internal endpoint to get direct video URLs
 */

export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    const { youtubeUrl } = await request.json();
    
    if (!youtubeUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'YouTube URL is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🔍 Extracting video from: ${youtubeUrl}`);
    
    // Extract video ID
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid YouTube URL format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`📹 Video ID: ${videoId}`);
    
    // Call YouTube's get_video_info endpoint
    const infoUrl = `https://www.youtube.com/get_video_info?video_id=${videoId}&el=embedded&eurl=https://youtube.googleapis.com/v/${videoId}&hl=en`;
    
    console.log('🔍 Fetching video info from YouTube...');
    const response = await fetch(infoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.youtube.com/'
      }
    });
    
    if (!response.ok) {
      throw new Error(`YouTube API returned ${response.status}`);
    }
    
    const rawData = await response.text();
    console.log(`📊 Got response, parsing data...`);
    
    // Parse URL-encoded response
    const videoInfo = parseVideoInfo(rawData);
    
    // Check if video is available
    if (videoInfo.status === 'fail') {
      throw new Error(videoInfo.reason || 'Video unavailable');
    }
    
    // Extract streaming data
    const streamingData = extractStreamingData(videoInfo);
    if (!streamingData) {
      throw new Error('No streaming data found');
    }
    
    // Find best MP4 format
    const mp4Url = findBestMp4Format(streamingData);
    if (!mp4Url) {
      throw new Error('No MP4 format found');
    }
    
    console.log('✅ Successfully extracted direct MP4 URL');
    
    return new Response(JSON.stringify({
      success: true,
      url: mp4Url,
      videoId: videoId,
      title: videoInfo.title || 'Unknown',
      duration: videoInfo.length_seconds || 0
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ YouTube extraction failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
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

function parseVideoInfo(rawData) {
  // Parse URL-encoded data
  const params = new URLSearchParams(rawData);
  const info = {};
  
  for (const [key, value] of params) {
    info[key] = value;
  }
  
  // Parse player_response if it exists
  if (info.player_response) {
    try {
      info.player_response = JSON.parse(info.player_response);
    } catch (e) {
      console.error('Failed to parse player_response');
    }
  }
  
  return info;
}

function extractStreamingData(videoInfo) {
  // Try to get streaming data from player_response
  if (videoInfo.player_response?.streamingData) {
    return videoInfo.player_response.streamingData;
  }
  
  // Fallback: try to parse from other fields
  if (videoInfo.url_encoded_fmt_stream_map) {
    return parseStreamMap(videoInfo.url_encoded_fmt_stream_map);
  }
  
  return null;
}

function findBestMp4Format(streamingData) {
  // Combine formats and adaptiveFormats
  const allFormats = [
    ...(streamingData.formats || []),
    ...(streamingData.adaptiveFormats || [])
  ];
  
  // Filter for MP4 formats with video
  const mp4Formats = allFormats.filter(format => {
    const mimeType = format.mimeType || '';
    return mimeType.includes('video/mp4') && format.url;
  });
  
  if (mp4Formats.length === 0) {
    return null;
  }
  
  // Sort by quality (height) and pick the best
  mp4Formats.sort((a, b) => {
    const heightA = parseInt(a.height || a.quality || '0');
    const heightB = parseInt(b.height || b.quality || '0');
    return heightB - heightA;
  });
  
  // Return the URL of the best format
  return mp4Formats[0].url;
}

function parseStreamMap(streamMap) {
  // Parse legacy stream map format
  const formats = [];
  const streams = streamMap.split(',');
  
  for (const stream of streams) {
    const params = new URLSearchParams(stream);
    const format = {};
    
    for (const [key, value] of params) {
      format[key] = decodeURIComponent(value);
    }
    
    if (format.url) {
      formats.push(format);
    }
  }
  
  return { formats };
}