/**
 * DEBUG: Check what Shotstack Ingest API actually returns
 */

export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const ingestId = url.searchParams.get('id');
    const useProduction = url.searchParams.get('production') === 'true';
    
    if (!ingestId) {
      throw new Error('Missing ingest ID parameter');
    }
    
    const apiKey = useProduction 
      ? env.SHOTSTACK_PRODUCTION_API_KEY 
      : env.SHOTSTACK_SANDBOX_API_KEY;
    
    const ownerId = useProduction
      ? env.SHOTSTACK_PRODUCTION_OWNER_ID
      : env.SHOTSTACK_SANDBOX_OWNER_ID;
    
    const ingestBaseUrl = useProduction 
      ? 'https://api.shotstack.io/ingest/v1' 
      : 'https://api.shotstack.io/ingest/stage';
    
    console.log(`🔍 DEBUG: Checking ingest ${ingestId}`);
    console.log(`🔍 URL: ${ingestBaseUrl}/sources/${ingestId}`);
    
    // Check ingest status
    const ingestResponse = await fetch(`${ingestBaseUrl}/sources/${ingestId}`, {
      headers: { 
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      }
    });
    
    console.log(`🔍 Response status: ${ingestResponse.status} ${ingestResponse.statusText}`);
    
    const responseText = await ingestResponse.text();
    console.log(`🔍 Raw response: ${responseText}`);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw_response: responseText };
    }
    
    return new Response(JSON.stringify({
      success: ingestResponse.ok,
      ingest_id: ingestId,
      api_endpoint: `${ingestBaseUrl}/sources/${ingestId}`,
      response_status: ingestResponse.status,
      response_ok: ingestResponse.ok,
      raw_response: responseText,
      parsed_response: responseData,
      timestamp: new Date().toISOString()
    }, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Debug status check failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}