/**
 * Ultra-simple video generation debug function
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    console.log('🎬 Debug: Function called');
    
    const body = await request.json();
    console.log('📥 Debug: Request body parsed:', Object.keys(body));
    
    // Just check environment variables
    const debugInfo = {
      has_shotstack_sandbox_key: !!env.SHOTSTACK_SANDBOX_API_KEY,
      has_shotstack_production_key: !!env.SHOTSTACK_PRODUCTION_API_KEY,
      has_shotstack_sandbox_owner: !!env.SHOTSTACK_SANDBOX_OWNER_ID,
      has_shotstack_production_owner: !!env.SHOTSTACK_PRODUCTION_OWNER_ID,
      env_keys_count: Object.keys(env).length,
      body_keys: Object.keys(body)
    };
    
    console.log('🔍 Debug: Environment check:', debugInfo);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Debug function reached successfully!",
      debug: debugInfo,
      timestamp: new Date().toISOString()
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Debug: Error occurred:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: `Debug error: ${error.message}`,
      error_type: error.constructor.name,
      stack: error.stack?.substring(0, 500) // Truncate stack trace
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    message: "Video debug function working! Use POST to test."
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}