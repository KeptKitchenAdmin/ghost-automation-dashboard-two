export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    success: true,
    message: "Cloudflare Functions are working!",
    timestamp: new Date().toISOString(),
    path: context.request.url
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestPost(context) {
  return new Response(JSON.stringify({
    success: true,
    message: "POST request to Functions working!",
    timestamp: new Date().toISOString()
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}