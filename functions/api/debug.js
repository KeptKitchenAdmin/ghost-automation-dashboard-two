/**
 * Debug function to test Pages Functions and environment variables
 */

export async function onRequestGet(context) {
  const { env } = context;
  
  return new Response(JSON.stringify({
    success: true,
    message: "Debug function working!",
    timestamp: new Date().toISOString(),
    environment_check: {
      has_anthropic_key: !!env.ANTHROPIC_API_KEY,
      has_shotstack_sandbox_key: !!env.SHOTSTACK_SANDBOX_API_KEY,
      has_shotstack_production_key: !!env.SHOTSTACK_PRODUCTION_API_KEY,
      has_shotstack_sandbox_owner: !!env.SHOTSTACK_SANDBOX_OWNER_ID,
      has_shotstack_production_owner: !!env.SHOTSTACK_PRODUCTION_OWNER_ID,
      all_env_keys: Object.keys(env).filter(key => key.includes('SHOTSTACK') || key.includes('ANTHROPIC'))
    }
  }, null, 2), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    
    return new Response(JSON.stringify({
      success: true,
      message: "POST request received successfully!",
      received_data: body,
      environment_check: {
        has_anthropic_key: !!env.ANTHROPIC_API_KEY,
        has_shotstack_sandbox_key: !!env.SHOTSTACK_SANDBOX_API_KEY
      }
    }, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }, null, 2), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}