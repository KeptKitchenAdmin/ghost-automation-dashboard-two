/**
 * Simplified Video Generation Function for Testing
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    console.log('🎬 Server: Received video generation request:', body);
    
    const {
      enhancedScript,
      backgroundVideoUrl,
      voiceSettings,
      duration,
      startTime,
      useProduction = false,
      addCaptions = true
    } = body;
    
    // Test environment variables
    const apiKey = useProduction 
      ? env.SHOTSTACK_PRODUCTION_API_KEY 
      : env.SHOTSTACK_SANDBOX_API_KEY;
    
    const ownerId = useProduction
      ? env.SHOTSTACK_PRODUCTION_OWNER_ID
      : env.SHOTSTACK_SANDBOX_OWNER_ID;
    
    console.log('🔍 Server: Environment check:', {
      useProduction,
      hasApiKey: !!apiKey,
      hasOwnerId: !!ownerId,
      apiKeyLength: apiKey?.length || 0,
      ownerIdLength: ownerId?.length || 0
    });
    
    if (!apiKey || !ownerId) {
      const mode = useProduction ? 'Production' : 'Sandbox';
      throw new Error(`${mode} Shotstack API key or Owner ID not configured`);
    }
    
    // Test a simple Shotstack API call - just check authentication
    const baseUrl = useProduction 
      ? 'https://api.shotstack.io/v1' 
      : 'https://api.shotstack.io/stage';
    
    console.log('🔗 Server: Testing Shotstack connection...');
    
    const testResponse = await fetch(`${baseUrl}/assets`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      }
    });
    
    console.log('📡 Server: Shotstack response status:', testResponse.status);
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('❌ Shotstack API error:', errorText);
      throw new Error(`Shotstack API error: ${testResponse.status} - ${errorText}`);
    }
    
    // If we get here, Shotstack is working
    const testResult = await testResponse.json();
    console.log('✅ Server: Shotstack API connection successful');
    
    // Return a mock successful response
    return new Response(JSON.stringify({
      success: true,
      videoUrl: "https://example.com/test-video.mp4",
      audioUrl: "https://example.com/test-audio.mp3",
      costs: {
        shotstack_cost: 0.00,
        elevenlabs_cost: 0.00,
        total_cost: 0.00
      },
      mode: useProduction ? 'production' : 'sandbox',
      debug: {
        shotstack_api_working: true,
        api_key_configured: !!apiKey,
        owner_id_configured: !!ownerId,
        test_response_status: testResponse.status
      }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Server: Video generation failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Video generation failed',
      stack: error.stack,
      debug: {
        error_type: error.constructor.name,
        error_message: error.message
      }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}