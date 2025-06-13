/**
 * Minimal Shotstack API test - just to verify authentication and basic request
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const { useProduction = false } = body;
    
    const apiKey = useProduction 
      ? env.SHOTSTACK_PRODUCTION_API_KEY 
      : env.SHOTSTACK_SANDBOX_API_KEY;
    
    const ownerId = useProduction
      ? env.SHOTSTACK_PRODUCTION_OWNER_ID
      : env.SHOTSTACK_SANDBOX_OWNER_ID;
    
    const baseUrl = useProduction 
      ? 'https://api.shotstack.io/v1' 
      : 'https://api.shotstack.io/stage';
    
    console.log('🔍 Testing Shotstack API...');
    console.log('Base URL:', baseUrl);
    console.log('Has API Key:', !!apiKey);
    console.log('Has Owner ID:', !!ownerId);
    
    // Test 1: Simple GET request to check authentication
    const authTest = await fetch(`${baseUrl}/render`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      }
    });
    
    console.log('Auth test response:', authTest.status, authTest.statusText);
    
    if (!authTest.ok) {
      const errorText = await authTest.text();
      console.error('Auth test failed:', errorText);
      throw new Error(`Shotstack auth failed: ${authTest.status} - ${errorText}`);
    }
    
    // Test 2: Minimal render request with stock video
    const minimalRender = {
      timeline: {
        background: '#000000',
        tracks: [
          {
            clips: [
              {
                asset: {
                  type: 'video',
                  src: 'https://shotstack-assets.s3.amazonaws.com/footage/beach.mp4' // Shotstack stock video
                },
                start: 0,
                length: 5,
                fit: 'crop'
              }
            ]
          }
        ]
      },
      output: {
        format: 'mp4',
        resolution: 'sd'
      }
    };
    
    console.log('🎬 Testing minimal render request...');
    
    const renderResponse = await fetch(`${baseUrl}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      },
      body: JSON.stringify(minimalRender)
    });
    
    console.log('Render test response:', renderResponse.status, renderResponse.statusText);
    
    if (!renderResponse.ok) {
      const errorText = await renderResponse.text();
      console.error('Render test failed:', errorText);
      throw new Error(`Shotstack render failed: ${renderResponse.status} - ${errorText}`);
    }
    
    const renderResult = await renderResponse.json();
    console.log('✅ Render submitted successfully:', renderResult.response.id);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Shotstack API test successful!",
      auth_test: {
        status: authTest.status,
        success: authTest.ok
      },
      render_test: {
        status: renderResponse.status,
        success: renderResponse.ok,
        render_id: renderResult.response.id
      },
      debug: {
        base_url: baseUrl,
        mode: useProduction ? 'production' : 'sandbox'
      }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Shotstack test failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack?.substring(0, 500)
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}