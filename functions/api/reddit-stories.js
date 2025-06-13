/**
 * Cloudflare Pages Function: Secure Reddit + Claude API Handler
 * Environment Variables: ANTHROPIC_API_KEY (server-side only)
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { category, duration } = await request.json();
    
    console.log(`🔍 Server: Finding Reddit stories for category: ${category}`);
    
    // Step 1: Scrape Reddit stories (server-side for better reliability)
    const stories = await scrapeRedditStories(category, 5);
    if (stories.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No suitable stories found in this category'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const selectedStory = stories[0]; // Use highest scoring story
    
    // Step 2: Enhance story with Claude (if API key available)
    let enhancedScript = selectedStory.content;
    
    if (env.ANTHROPIC_API_KEY) {
      try {
        console.log('✨ Server: Enhancing story with Claude AI...');
        enhancedScript = await enhanceStoryWithClaude(selectedStory, duration, env.ANTHROPIC_API_KEY);
        console.log('✅ Server: Story enhanced successfully');
      } catch (claudeError) {
        console.warn('⚠️ Server: Claude enhancement failed, using fallback:', claudeError);
        enhancedScript = createFallbackEnhancement(selectedStory, category);
      }
    } else {
      console.log('⚠️ Server: Claude API key not configured, using fallback');
      enhancedScript = createFallbackEnhancement(selectedStory, category);
    }
    
    return new Response(JSON.stringify({
      success: true,
      story: selectedStory,
      enhancedScript: enhancedScript
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Server: Reddit stories processing failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to process Reddit stories'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Reddit scraping logic (server-side)
async function scrapeRedditStories(category, limit = 5) {
  const subredditConfigs = {
    drama: ['AmItheAsshole', 'relationship_advice', 'tifu', 'confessions'],
    horror: ['nosleep', 'LetsNotMeet', 'creepyencounters', 'missing411'],
    revenge: ['MaliciousCompliance', 'pettyrevenge', 'ProRevenge', 'NuclearRevenge'],
    wholesome: ['MadeMeSmile', 'wholesomememes', 'HumansBeingBros'],
    mystery: ['mystery', 'UnresolvedMysteries', 'RBI', 'whatisthisthing']
  };
  
  const subreddits = subredditConfigs[category] || subredditConfigs.drama;
  const stories = [];
  
  for (const subreddit of subreddits) {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=${Math.ceil(limit / subreddits.length)}`,
        {
          headers: {
            'User-Agent': 'RedditVideoBot/1.0'
          }
        }
      );
      
      if (!response.ok) continue;
      
      const data = await response.json();
      const posts = data.data.children;
      
      for (const post of posts) {
        const postData = post.data;
        
        // Filter quality content
        if (
          postData.upvote_ratio < 0.8 ||
          postData.ups < 500 ||
          postData.selftext.length < 200 ||
          postData.selftext.length > 3000 ||
          postData.over_18 ||
          postData.stickied ||
          containsProblematicContent(postData.selftext)
        ) {
          continue;
        }
        
        const story = {
          id: postData.id,
          title: postData.title,
          content: postData.selftext,
          subreddit: postData.subreddit,
          upvotes: postData.ups,
          comments: postData.num_comments,
          created_utc: postData.created_utc,
          url: `https://reddit.com${postData.permalink}`,
          viral_score: calculateViralScore(postData),
          category,
          estimated_duration: estimateDuration(postData.selftext)
        };
        
        stories.push(story);
      }
    } catch (error) {
      console.error(`Error scraping r/${subreddit}:`, error);
    }
  }
  
  return stories
    .sort((a, b) => b.viral_score - a.viral_score)
    .slice(0, limit);
}

// Claude API integration (server-side with secure API key)
async function enhanceStoryWithClaude(story, targetDurationMinutes, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Transform this Reddit story into an engaging ${targetDurationMinutes}-minute video script:

STORY: ${story.content}

Requirements:
- Add compelling hook (first 5 seconds)
- Enhance narrative flow
- Add emotional moments
- Include call-to-action
- Keep original story essence
- Target duration: ${targetDurationMinutes} minutes

Format as natural speech for voiceover.`
      }]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.content[0].text;
}

// Fallback enhancement (no API needed)
function createFallbackEnhancement(story, category) {
  const hooks = {
    drama: "You won't believe what happened next...",
    horror: "This story still gives me chills...",
    revenge: "They thought they could get away with it...",
    wholesome: "This will restore your faith in humanity...",
    mystery: "No one could explain what happened..."
  };
  
  const hook = hooks[category] || "Here's a story that will blow your mind...";
  return `${hook}\n\n${story.content}\n\nWhat do you think? Let me know in the comments!`;
}

// Utility functions
function calculateViralScore(postData) {
  const ageHours = (Date.now() / 1000 - postData.created_utc) / 3600;
  const upvoteRate = postData.ups / Math.max(ageHours, 1);
  const commentRate = postData.num_comments / Math.max(ageHours, 1);
  const ratio = postData.upvote_ratio;
  
  return (upvoteRate * 0.4 + commentRate * 0.3 + ratio * 100 * 0.3) / 10;
}

function estimateDuration(content) {
  const wordCount = content.split(' ').length;
  return Math.ceil((wordCount / 150) * 60);
}

function containsProblematicContent(text) {
  const bannedWords = [
    'suicide', 'self-harm', 'rape', 'abuse', 'violence',
    'drugs', 'illegal', 'racist', 'sexist'
  ];
  
  const lowerText = text.toLowerCase();
  return bannedWords.some(word => lowerText.includes(word));
}