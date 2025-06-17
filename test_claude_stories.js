// Quick test to verify Claude story generation works
// Run: node test_claude_stories.js

async function testClaudeStories() {
  const API_KEY = process.env.ANTHROPIC_API_KEY;
  
  if (!API_KEY) {
    console.error('❌ ERROR: ANTHROPIC_API_KEY environment variable not set');
    console.log('Set it with: export ANTHROPIC_API_KEY="your-key-here"');
    return;
  }

  console.log('🧪 Testing Claude story generation...\n');

  const prompt = `I need you to find 3 REAL Reddit stories from r/AmItheAsshole that would work for a 5-minute video.

CRITICAL REQUIREMENTS:
- These MUST be real Reddit posts that actually exist
- Include real post IDs, real upvote counts, real details
- Each story should be 300-1800 characters (to fit TTS limits)
- DO NOT make up or fabricate stories

Return ONLY a JSON array with real Reddit stories.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Claude API call successful!\n');
    console.log('Response preview:', data.content[0].text.substring(0, 500) + '...\n');
    
    // Try to parse stories
    const jsonMatch = data.content[0].text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      const stories = JSON.parse(jsonMatch[0]);
      console.log(`📚 Found ${stories.length} stories:`);
      stories.forEach((story, i) => {
        console.log(`\n${i + 1}. ${story.title}`);
        console.log(`   Subreddit: r/${story.subreddit}`);
        console.log(`   Length: ${story.content.length} chars`);
        console.log(`   Upvotes: ${story.upvotes}`);
      });
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

testClaudeStories();