/**
 * Check Shotstack Ingest + Render Status
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
    
    // Check ingest status
    const ingestResponse = await fetch(`${ingestBaseUrl}/sources/${ingestId}`, {
      headers: { 
        'x-api-key': apiKey,
        'x-shotstack-owner': ownerId
      }
    });
    
    if (!ingestResponse.ok) {
      throw new Error(`Ingest status check failed: ${ingestResponse.statusText}`);
    }
    
    const ingestData = await ingestResponse.json();
    const ingestStatus = ingestData.data.status;
    
    console.log(`📊 Ingest status: ${ingestStatus}`);
    
    let result = {
      success: true,
      ingest_id: ingestId,
      ingest_status: ingestStatus,
      timestamp: new Date().toISOString()
    };
    
    if (ingestStatus === 'failed') {
      result.error = `Ingest failed: ${ingestData.data.error || 'Unknown error'}`;
      result.success = false;
    } else if (ingestStatus === 'ready') {
      result.ingest_url = ingestData.data.url;
      result.message = "✅ YouTube video ingested successfully! Ready for rendering.";
      
      // TODO: Could automatically start render here
      // For now, just return the ingested URL
    } else {
      result.message = `⏳ Still processing... Status: ${ingestStatus}`;
    }
    
    return new Response(JSON.stringify(result, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Status check failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}