import { NextResponse } from 'next/server';
import { ClaudeService } from '../../../../lib/services/claude-service';
import type { VideoGenerationRequest } from '../../../../lib/types/reddit-automation';

export async function POST(request: Request) {
  try {
    const body: VideoGenerationRequest = await request.json();
    const { story, background_url, voice_settings, video_config } = body;
    
    console.log(`🎬 API: Starting video generation for story: ${story.id}`);
    
    if (!story || !story.content) {
      return NextResponse.json({ 
        success: false, 
        error: 'Story content is required' 
      }, { status: 400 });
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Start async video generation process
    generateVideoAsync(jobId, body).catch(error => {
      console.error(`❌ Background video generation failed for job ${jobId}:`, error);
    });
    
    return NextResponse.json({
      success: true,
      jobId,
      message: 'Video generation started',
      story_id: story.id,
      estimated_duration: '2-5 minutes',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ API: Video generation request failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start video generation',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

async function generateVideoAsync(jobId: string, request: VideoGenerationRequest) {
  try {
    console.log(`🔄 Background: Processing video generation job ${jobId}`);
    
    // Step 1: Enhance story with Claude (if configured)
    let enhancedContent = request.story.content;
    try {
      if (process.env.ANTHROPIC_API_KEY) {
        const claude = new ClaudeService();
        enhancedContent = await claude.enhanceStory(
          request.story, 
          request.video_config.duration / 60
        );
        console.log(`✅ Background: Story enhanced with Claude for job ${jobId}`);
      } else {
        console.log(`⚠️ Background: Claude API key not configured for job ${jobId}`);
        // Use fallback enhancement
        const hooks = {
          drama: "You won't believe what happened next...",
          horror: "This story still gives me chills...",
          revenge: "They thought they could get away with it...",
          wholesome: "This will restore your faith in humanity...",
          mystery: "No one could explain what happened..."
        };
        const hook = hooks[request.story.category] || "Here's a story that will blow your mind...";
        enhancedContent = `${hook}\n\n${request.story.content}\n\nWhat do you think? Let me know in the comments!`;
      }
    } catch (claudeError) {
      console.warn(`⚠️ Background: Claude enhancement failed for job ${jobId}, using fallback:`, claudeError);
    }

    // Step 2: Generate video with Shotstack (if configured)
    let videoResult = null;
    try {
      if (process.env.SHOTSTACK_API_KEY) {
        // Note: Shotstack integration would go here
        // For now, simulate the process
        console.log(`⚠️ Background: Shotstack integration not yet implemented for job ${jobId}`);
        
        // Simulate video generation delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        videoResult = {
          videoUrl: `#simulated_video_${jobId}`,
          audioUrl: `#simulated_audio_${jobId}`,
          costs: {
            shotstack_cost: 0,
            elevenlabs_cost: 0,
            total_cost: 0
          }
        };
      } else {
        console.log(`⚠️ Background: Shotstack API key not configured for job ${jobId}`);
      }
    } catch (shotstackError) {
      console.warn(`⚠️ Background: Shotstack generation failed for job ${jobId}:`, shotstackError);
    }

    console.log(`✅ Background: Video generation completed for job ${jobId}`);
    
    // In a real implementation, you would store the result in a database
    // For now, we'll just log the completion
    
  } catch (error) {
    console.error(`❌ Background: Video generation failed for job ${jobId}:`, error);
  }
}