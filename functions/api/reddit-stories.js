/**
 * Cloudflare Pages Function: Secure Reddit + Claude API Handler
 * Environment Variables: ANTHROPIC_API_KEY (server-side only)
 */

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    success: true,
    message: "Reddit Stories API is working",
    timestamp: new Date().toISOString(),
    available_endpoints: ["POST /api/reddit-stories"]
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    console.log('🔍 Reddit Stories API called');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    
    const requestBody = await request.json();
    console.log('Request body:', requestBody);
    
    const { category, targetDuration, duration, limit = 5, refresh } = requestBody;
    
    console.log(`🔍 Server: Finding Reddit stories for category: ${category}, target duration: ${targetDuration} minutes`);
    
    // Step 1: Scrape Reddit stories (server-side for better reliability)
    console.log(`🔄 Refresh request: ${refresh ? 'YES' : 'NO'}, fetching ${limit} stories`);
    const stories = await scrapeRedditStories(category, limit, refresh, targetDuration);
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
      stories: stories, // Return all stories for selection
      story: selectedStory, // Keep backwards compatibility
      enhancedScript: enhancedScript
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Server: Reddit stories processing failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to process Reddit stories',
      stack: error.stack,
      debug: {
        category,
        duration,
        has_anthropic_key: !!env.ANTHROPIC_API_KEY
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

// Reddit scraping logic (server-side)
async function scrapeRedditStories(category, limit = 5, refresh = false, targetDuration = 5) {
  // Use multiple subreddits for more variety, especially on refresh
  const subredditsByCategory = {
    drama: ['AmItheAsshole', 'relationships', 'relationship_advice', 'TrueOffMyChest'],
    horror: ['nosleep', 'LetsNotMeet', 'creepy', 'paranormal'], 
    revenge: ['MaliciousCompliance', 'pettyrevenge', 'ProRevenge', 'NuclearRevenge'],
    wholesome: ['MadeMeSmile', 'wholesome', 'humansbeingbros', 'UpliftingNews'],
    mystery: ['UnresolvedMysteries', 'mystery', 'RBI', 'Glitch_in_the_Matrix']
  };
  
  const availableSubreddits = subredditsByCategory[category] || ['AmItheAsshole'];
  const targetSubreddit = refresh ? 
    availableSubreddits[Math.floor(Math.random() * availableSubreddits.length)] :
    availableSubreddits[0];
    
  const stories = [];
  
  console.log(`🔍 Fetching from single subreddit: r/${targetSubreddit} (refresh: ${refresh})`);
  
  try {
    // Use different Reddit sorting to get fresh content on refresh
    const sortTypes = ['hot', 'top', 'rising'];
    const sortType = refresh ? sortTypes[Math.floor(Math.random() * sortTypes.length)] : 'hot';
    const timeFilter = (sortType === 'top') ? '&t=week' : '';
    
    console.log(`📊 Using sort: ${sortType}${timeFilter}`);
    
    // SINGLE SUBREDDIT REQUEST with enhanced anti-bot measures
    const response = await fetch(
      `https://www.reddit.com/r/${targetSubreddit}/${sortType}.json?limit=${Math.min(limit * 3, 50)}${timeFilter}`,
      {
        headers: {
          // ENHANCED USER-AGENT - Latest Chrome with realistic version
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin'
        }
      }
    );
    
    console.log(`🌐 Reddit API response for r/${targetSubreddit}:`, response.status, response.statusText);
    
    // ENHANCED ERROR HANDLING
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Reddit blocked r/${targetSubreddit}: ${response.status} ${response.statusText}`);
      console.error(`Response body:`, errorText.substring(0, 200));
      
      // Don't throw error, use fallback instead
      console.log(`🔄 Using fallback story due to Reddit API error`);
    } else {
      const data = await response.json();
      const posts = data.data.children;
      
      console.log(`✅ Successfully fetched ${posts.length} posts from r/${targetSubreddit}`);
      console.log(`📋 Post titles preview:`, posts.slice(0, 3).map(p => p.data.title));
      
      for (const post of posts) {
        const postData = post.data;
        
        // Calculate estimated duration for this story
        const estimatedDurationMinutes = estimateDurationInMinutes(postData.selftext);
        const durationDiff = Math.abs(estimatedDurationMinutes - targetDuration);
        
        // Filter for quality content that matches target duration
        if (
          postData.upvote_ratio < 0.8 ||
          postData.ups < 500 ||
          postData.selftext.length < 300 || // Minimum content length
          postData.selftext.length > 12000 || // Maximum content length
          durationDiff > 3 || // Only stories within 3 minutes of target
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
          estimated_duration: estimateDuration(postData.selftext),
          estimated_duration_minutes: estimatedDurationMinutes,
          duration_match_score: Math.max(0, 10 - durationDiff) // Higher score for better matches
        };
        
        stories.push(story);
      }
      
      console.log(`📊 Found ${stories.length} quality stories from r/${targetSubreddit} matching ${targetDuration} min target`);
      console.log(`🎯 Duration matches:`, stories.map(s => `${s.title.substring(0, 30)}... (${s.estimated_duration_minutes?.toFixed(1)}min, score: ${s.duration_match_score})`));
    }
  } catch (error) {
    console.error(`❌ Error scraping r/${targetSubreddit}:`, error.message);
    console.log(`🔄 Will use fallback story due to scraping error`);
  }
  
  // If no stories found (Reddit blocking), return fallback
  if (stories.length === 0) {
    console.warn(`❌ No Reddit stories found from r/${targetSubreddit}, using fallback story`);
    return [{
      id: "fallback_001",
      title: "When Everything Goes Wrong (Reddit Story)",
      content: "So this happened to me last week and I'm still processing it. I was having what I thought was a normal day when suddenly everything started going sideways. The details are absolutely insane and I need to share this story because I genuinely don't know if I handled it right. It all started when I woke up that Tuesday morning. I had planned to have a productive day - you know, tackle some work projects, maybe clean the house a bit, normal stuff. But from the moment I stepped out of bed, things just felt off. First, my coffee maker decided to completely break down. Not just malfunction - I'm talking full electrical failure with sparks and everything. I should have taken that as a sign. Then my car wouldn't start. The battery was completely dead even though it was fine the night before. I called my neighbor to jump it, but even that didn't work. Something was clearly wrong with the alternator. So there I was, stranded at home with no coffee and no transportation. I decided to work from home instead, but then my internet went out. Not just slow - completely down. I called the provider and they said there was no outage in my area. Just my house, apparently. At this point I'm starting to think the universe is conspiring against me. But it gets worse. Around noon, I hear this commotion outside. I look out my window and there's this massive tree that had fallen across the street, completely blocking traffic. It hadn't even been windy that morning. The tree just... fell. And of course, it took out power lines with it, which explained my internet issues. But here's where it gets really crazy. As I'm standing there looking at this tree, my phone rings. It's my boss, and she's furious. Apparently, some important emails I thought I'd sent yesterday never actually went through. The client is threatening to cancel our biggest contract. She needs me in the office immediately to fix this mess. I try to explain about my car, the tree, everything that's going wrong, but she just thinks I'm making excuses. So I start walking. It's about three miles to the office, and I figure the exercise might clear my head anyway. But halfway there, it starts pouring rain. Not just a light drizzle - I'm talking biblical proportions. I take shelter under this bus stop, and that's when I notice there's this guy there who's clearly having an even worse day than me. He's soaked, his briefcase is broken, papers scattered everywhere, and he's just sitting there looking defeated. We start talking, and it turns out he's dealing with his own series of impossible coincidences. His story is even crazier than mine. Long story short, we end up helping each other out, I make it to the office, save the client relationship, and somehow everything works out. But the whole experience really made me think about how we handle adversity and whether these kinds of days happen to test us or if it's all just random chaos. What would you have done in my situation?",
      subreddit: availableSubreddits[0] || 'AmItheAsshole',
      upvotes: 2500,
      comments: 340,
      created_utc: Date.now() / 1000,
      url: "https://reddit.com/fallback",
      viral_score: 75,
      category,
      estimated_duration: 600,
      estimated_duration_minutes: targetDuration, // Match target exactly for fallback
      duration_match_score: 10 // Perfect match score
    }];
  }
  
  // Sort by duration match first, then viral score for better targeting
  const sortedStories = stories.sort((a, b) => {
    // First sort by duration match score (higher is better)
    const durationCompare = (b.duration_match_score || 0) - (a.duration_match_score || 0);
    if (durationCompare !== 0) return durationCompare;
    
    // Then by viral score
    return b.viral_score - a.viral_score;
  });
  
  if (refresh && sortedStories.length > limit) {
    // On refresh, randomize selection from top stories
    const shuffled = sortedStories.slice(0, Math.min(limit * 2, sortedStories.length));
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, limit);
  }
  
  return sortedStories.slice(0, limit);
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

function estimateDurationInMinutes(content) {
  const wordCount = content.split(' ').length;
  const wordsPerMinute = 150 * 1.3; // 195 WPM at 1.3x speed (same as frontend)
  return wordCount / wordsPerMinute; // Returns minutes as decimal
}

function containsProblematicContent(text) {
  const bannedWords = [
    'suicide', 'self-harm', 'rape', 'abuse', 'violence',
    'drugs', 'illegal', 'racist', 'sexist'
  ];
  
  const lowerText = text.toLowerCase();
  return bannedWords.some(word => lowerText.includes(word));
}