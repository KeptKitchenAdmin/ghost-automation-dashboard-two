/**
 * Simplified Reddit Stories Function for Testing
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { category, duration } = await request.json();
    
    console.log(`🔍 Server: Testing reddit stories for category: ${category}`);
    
    // Return a simple test story
    const testStory = {
      id: "test123",
      title: "Test Story",
      content: "This is a test story to verify the function works.",
      subreddit: "test",
      upvotes: 1000,
      comments: 50,
      created_utc: Date.now() / 1000,
      url: "https://reddit.com/test",
      viral_score: 85,
      category,
      estimated_duration: duration
    };
    
    const enhancedScript = `Here's a ${category} story that will grab your attention...

${testStory.content}

What do you think? Let me know in the comments!`;
    
    return new Response(JSON.stringify({
      success: true,
      story: testStory,
      enhancedScript: enhancedScript,
      debug: {
        has_anthropic_key: !!env.ANTHROPIC_API_KEY,
        category,
        duration
      }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Server: Reddit stories processing failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to process Reddit stories',
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

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    message: "Reddit Stories function is working! Use POST with {category, duration}"
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}