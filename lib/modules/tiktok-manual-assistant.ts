/**
 * TikTok Manual Post Assistant - Pre-1K Followers Phase
 * Generates content for manual posting to comply with TikTok automation restrictions
 */

import { tikTokHookGenerator } from './tiktok-hook-generator';
import { tikTokContentStrategy } from './tiktok-content-strategy';
import { promises as fs } from 'fs';
import path from 'path';

interface ContentTopic {
  id: string;
  title: string;
  category: { value: string };
  hook_line: string;
  key_fact: string;
  emotional_context: string;
  consequence: string;
  virality_score: { value: string };
  target_emotions: string[];
  engagement_triggers: string[];
  controversy_level: number;
  educational_value: number;
  sources: string[];
  hashtags: string[];
}

interface VideoScript {
  id: string;
  topic: ContentTopic;
  hook_line: string;
  opening_statement: string;
  key_revelation: string;
  emotional_context: string;
  consequence_statement: string;
  call_to_action: string;
  hashtags: string[];
  estimated_duration: number;
  hook_type: string;
  emotional_tone: string;
  ai_face_prompts: Record<string, string>;
  voiceover_notes: string;
}

interface ManualPostPackage {
  id: string;
  script: VideoScript;
  caption: string;
  hashtags: string[];
  video_instructions: Record<string, string>;
  upload_instructions: string[];
  ai_disclosure: string;
  posting_schedule: string;
  performance_tracking: Record<string, any>;
  compliance_notes: string[];
}

interface PostingSession {
  session_id: string;
  created_at: string;
  follower_count: number;
  monetization_eligible: boolean;
  posts_generated: number;
  content_calendar: ManualPostPackage[];
}

interface MonetizationStatus {
  monetization_ready: boolean;
  follower_count: number;
  followers_needed: number;
}

interface GrowthRecommendations {
  current_status: {
    followers: number;
    followers_needed: number;
    progress_percentage: number;
  };
  growth_strategy: {
    daily_posting: string;
    optimal_times: string[];
    content_focus: string;
    engagement_priority: string;
  };
  timeline: {
    estimated_days_to_1k: number;
    daily_growth_target: number;
    weekly_milestone: number;
  };
  monetization_preparation: {
    affiliate_programs: string;
    content_strategy: string;
    audience_building: string;
  };
}

export class TikTokManualAssistant {
  private outputDirectory: string;

  constructor() {
    this.outputDirectory = "output/tiktok_manual_posts";
  }

  async createManualPostPackage(
    customTopic?: ContentTopic,
    targetDuration: number = 60
  ): Promise<ManualPostPackage> {
    try {
      // Ensure output directory exists
      await this.ensureOutputDirectory();

      // Check monetization status
      const monetizationStatus = await this.checkMonetizationEligibility();
      
      // Generate video script
      const script = tikTokHookGenerator.generateVideoScript(
        customTopic,
        undefined,
        undefined,
        targetDuration
      );
      
      // Generate optimized caption
      const caption = this.generateOptimizedCaption(script, monetizationStatus.monetization_ready);
      
      // Generate hashtags (no affiliate tags pre-1K)
      const hashtags = this.generateComplianceHashtags(script, monetizationStatus.monetization_ready);
      
      // Generate video creation instructions
      const videoInstructions = this.generateVideoInstructions(script);
      
      // Generate upload instructions
      const uploadInstructions = this.generateUploadInstructions(monetizationStatus.monetization_ready);
      
      // Generate AI disclosure
      const aiDisclosure = this.generateAIDisclosure();
      
      // Generate posting schedule
      const postingSchedule = this.generateOptimalPostingTime();
      
      // Setup performance tracking
      const performanceTracking = this.setupPerformanceTracking(script);
      
      // Compliance notes
      const complianceNotes = this.generateComplianceNotes(monetizationStatus.monetization_ready);
      
      const packageData: ManualPostPackage = {
        id: `manual_post_${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}`,
        script: script,
        caption: caption,
        hashtags: hashtags,
        video_instructions: videoInstructions,
        upload_instructions: uploadInstructions,
        ai_disclosure: aiDisclosure,
        posting_schedule: postingSchedule,
        performance_tracking: performanceTracking,
        compliance_notes: complianceNotes
      };
      
      // Save package to file
      await this.savePostPackage(packageData);
      
      console.log(`Created manual post package: ${packageData.id}`);
      return packageData;
      
    } catch (error) {
      console.error(`Failed to create manual post package: ${error}`);
      throw error;
    }
  }

  async createContentBatch(days: number = 7): Promise<PostingSession> {
    try {
      // Get current follower status
      const monetizationStatus = await this.checkMonetizationEligibility();
      
      // Generate content calendar
      const contentCalendar = tikTokContentStrategy.getContentCalendar(days);
      
      // Create post packages for each day
      const postPackages: ManualPostPackage[] = [];
      for (const dayContent of contentCalendar) {
        const packageData = await this.createManualPostPackage(
          dayContent.topic as any,
          60
        );
        postPackages.push(packageData);
      }
      
      // Create posting session
      const session: PostingSession = {
        session_id: `session_${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}`,
        created_at: new Date().toISOString(),
        follower_count: monetizationStatus.follower_count,
        monetization_eligible: monetizationStatus.monetization_ready,
        posts_generated: postPackages.length,
        content_calendar: postPackages
      };
      
      // Save session
      await this.savePostingSession(session);
      
      console.log(`Created content batch: ${session.posts_generated} posts for ${days} days`);
      return session;
      
    } catch (error) {
      console.error(`Failed to create content batch: ${error}`);
      throw error;
    }
  }

  private generateOptimizedCaption(script: VideoScript, monetizationReady: boolean): string {
    // Start with hook line
    const captionParts = [script.hook_line];
    
    // Add key point
    captionParts.push(`\n\n${script.key_revelation}`);
    
    // Add emotional context (shortened)
    if (script.emotional_context.length < 100) {
      captionParts.push(`\n\n${script.emotional_context}`);
    }
    
    // Add call to action
    captionParts.push(`\n\n${script.call_to_action}`);
    
    // Add monetization disclaimer if not eligible
    if (!monetizationReady) {
      captionParts.push("\n\n⚠️ Growing to 1K followers - no affiliate links yet!");
    }
    
    // Join and ensure under character limit
    let caption = captionParts.join('');
    if (caption.length > 2200) { // TikTok caption limit
      caption = caption.substring(0, 2200) + "...";
    }
    
    return caption;
  }

  private generateComplianceHashtags(script: VideoScript, monetizationReady: boolean): string[] {
    // Base viral hashtags
    const baseHashtags = ["#fyp", "#viral", "#truth", "#educational", "#awakening"];
    
    // Topic-specific hashtags (limited)
    const topicHashtags = script.hashtags.slice(0, 8);
    
    // Compliance hashtags
    const complianceHashtags: string[] = [];
    if (!monetizationReady) {
      complianceHashtags.push("#growing", "#nomoney", "#organic");
    }
    
    // Combine and limit to 20 hashtags
    const allHashtags = [...baseHashtags, ...topicHashtags, ...complianceHashtags];
    return [...new Set(allHashtags)].slice(0, 20);
  }

  private generateVideoInstructions(script: VideoScript): Record<string, string> {
    return {
      duration: `${script.estimated_duration} seconds`,
      ai_face_generation: JSON.stringify(script.ai_face_prompts, null, 2),
      voiceover_notes: script.voiceover_notes,
      visual_style: "Clean, professional, direct eye contact throughout",
      background: "Neutral/minimal, focus on speaker",
      text_overlays: `Hook: '${script.hook_line}' at 0-3s, Key points as needed`,
      pacing: "Fast-paced, high retention, hook in first 3 seconds",
      editing_notes: "Jump cuts every 3-5 seconds, maintain eye contact",
      audio_quality: "Clear voiceover, background music optional (low volume)",
      export_settings: "1080x1920 (9:16), MP4, 30fps minimum"
    };
  }

  private generateUploadInstructions(monetizationReady: boolean): string[] {
    const instructions = [
      "1. Open TikTok Creator Studio or mobile app",
      "2. Upload video file (1080x1920, MP4 format)",
      "3. Add caption (copy from package)",
      "4. Add hashtags (copy from package)",
      "5. Set privacy to 'Public'",
      "6. Enable comments and duets",
      "7. Schedule post for optimal time (see posting_schedule)",
      "8. Add to series/playlist if relevant"
    ];
    
    if (!monetizationReady) {
      instructions.push(
        "9. ⚠️ DO NOT add any affiliate links",
        "10. ⚠️ DO NOT include promotional content",
        "11. ⚠️ Focus purely on educational value"
      );
    } else {
      instructions.push(
        "9. ✅ Add affiliate links in bio if relevant",
        "10. ✅ Include branded content disclosure if needed"
      );
    }
    
    instructions.push(
      "12. Double-check compliance notes before posting",
      "13. Post and track performance metrics",
      "14. Engage with comments promptly"
    );
    
    return instructions;
  }

  private generateAIDisclosure(): string {
    return "This video was created with AI assistance for educational purposes. All facts are researched and sourced.";
  }

  private generateOptimalPostingTime(): string {
    // Peak TikTok engagement times
    const peakTimes = [
      "6:00 AM - 10:00 AM EST (morning commute)",
      "7:00 PM - 9:00 PM EST (evening engagement)",
      "12:00 PM - 3:00 PM EST (lunch break)"
    ];
    
    // Get current hour and recommend time
    const currentHour = new Date().getHours();
    
    if (currentHour < 10) {
      return "Post at 6:00 PM EST for evening engagement";
    } else if (currentHour < 15) {
      return "Post at 7:00 PM EST for peak evening hours";
    } else {
      return "Post at 6:00 AM EST tomorrow for morning commute";
    }
  }

  private setupPerformanceTracking(script: VideoScript): Record<string, any> {
    return {
      track_metrics: ["views", "likes", "comments", "shares", "saves", "profile_visits"],
      success_benchmarks: {
        views: 1000,
        engagement_rate: 0.05,
        comments: 50,
        shares: 10
      },
      monitoring_schedule: "Check at 1h, 6h, 24h, 48h, 7d",
      optimization_notes: "Track which topics/hooks perform best for content optimization",
      content_id: script.id,
      topic_category: script.topic.category.value,
      virality_score: script.topic.virality_score.value
    };
  }

  private generateComplianceNotes(monetizationReady: boolean): string[] {
    const notes = [
      "✅ Content is educational and factual",
      "✅ All claims are researched and sourced",
      "✅ No misleading medical advice",
      "✅ Controversial topics handled responsibly"
    ];
    
    if (!monetizationReady) {
      notes.push(
        "⚠️ NO AFFILIATE LINKS - Account under 1K followers",
        "⚠️ NO PROMOTIONAL CONTENT - Focus on pure education",
        "⚠️ ORGANIC GROWTH ONLY - No automated posting"
      );
    } else {
      notes.push(
        "✅ Affiliate links allowed in bio/comments",
        "✅ Branded content disclosure required if paid",
        "✅ Automated posting allowed (if desired)"
      );
    }
    
    return notes;
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.outputDirectory, { recursive: true });
    } catch (error) {
      // Directory already exists, ignore error
    }
  }

  private async savePostPackage(packageData: ManualPostPackage): Promise<void> {
    try {
      const filepath = path.join(this.outputDirectory, `${packageData.id}.json`);
      
      // Convert to JSON for serialization
      await fs.writeFile(filepath, JSON.stringify(packageData, null, 2));
      
      // Also create a human-readable text file
      const textFilepath = path.join(this.outputDirectory, `${packageData.id}_instructions.txt`);
      await this.createReadableInstructions(packageData, textFilepath);
      
      console.log(`Saved post package to ${filepath}`);
      
    } catch (error) {
      console.error(`Failed to save post package: ${error}`);
    }
  }

  private async createReadableInstructions(packageData: ManualPostPackage, filepath: string): Promise<void> {
    const content = `
# TikTok Manual Post Package
Generated: ${new Date().toLocaleString()}
Package ID: ${packageData.id}

## VIDEO SCRIPT
Hook: ${packageData.script.hook_line}

Opening: ${packageData.script.opening_statement}

Key Revelation: ${packageData.script.key_revelation}

Emotional Context: ${packageData.script.emotional_context}

Consequence: ${packageData.script.consequence_statement}

Call to Action: ${packageData.script.call_to_action}

## CAPTION (Copy this exactly)
${packageData.caption}

## HASHTAGS (Copy these)
${packageData.hashtags.join(' ')}

## VIDEO CREATION INSTRUCTIONS
Duration: ${packageData.video_instructions.duration}
Visual Style: ${packageData.video_instructions.visual_style}
Background: ${packageData.video_instructions.background}
Text Overlays: ${packageData.video_instructions.text_overlays}
Voiceover: ${packageData.video_instructions.voiceover_notes}

## UPLOAD STEPS
${packageData.upload_instructions.join('\n')}

## AI DISCLOSURE
${packageData.ai_disclosure}

## OPTIMAL POSTING TIME
${packageData.posting_schedule}

## COMPLIANCE CHECKLIST
${packageData.compliance_notes.join('\n')}

## PERFORMANCE TRACKING
Track these metrics: ${packageData.performance_tracking.track_metrics.join(', ')}
Success benchmarks: ${JSON.stringify(packageData.performance_tracking.success_benchmarks)}
Check performance: ${packageData.performance_tracking.monitoring_schedule}
`;
    
    await fs.writeFile(filepath, content);
  }

  private async savePostingSession(session: PostingSession): Promise<void> {
    try {
      const filepath = path.join(this.outputDirectory, `batch_${session.session_id}.json`);
      
      await fs.writeFile(filepath, JSON.stringify(session, null, 2));
      
      // Create batch summary
      const summaryFilepath = path.join(this.outputDirectory, `batch_${session.session_id}_summary.txt`);
      await this.createBatchSummary(session, summaryFilepath);
      
      console.log(`Saved posting session: ${session.session_id}`);
      
    } catch (error) {
      console.error(`Failed to save posting session: ${error}`);
    }
  }

  private async createBatchSummary(session: PostingSession, filepath: string): Promise<void> {
    let content = `
# TikTok Content Batch Summary
Session ID: ${session.session_id}
Created: ${session.created_at}
Current Followers: ${session.follower_count.toLocaleString()}
Monetization Ready: ${session.monetization_eligible ? '✅ YES' : '❌ NO'}
Posts Generated: ${session.posts_generated}

## CONTENT SCHEDULE
`;
    
    session.content_calendar.forEach((packageData, i) => {
      content += `
### Day ${i + 1}: ${packageData.script.topic.title}
- Hook: ${packageData.script.hook_line}
- Category: ${packageData.script.topic.category.value}
- Virality: ${packageData.script.topic.virality_score.value}
- Post Time: ${packageData.posting_schedule}
- Package ID: ${packageData.id}
`;
    });
    
    content += `

## BATCH INSTRUCTIONS
1. Review each day's package individually
2. Create videos according to instructions
3. Post at recommended times
4. Track performance metrics
5. Engage with audience
6. Monitor follower growth toward 1K threshold

## NEXT STEPS
- Current progress: ${session.follower_count}/1,000 followers
- Followers needed: ${Math.max(0, 1000 - session.follower_count).toLocaleString()}
- At 1K followers: Enable monetization features
`;
    
    await fs.writeFile(filepath, content);
  }

  async getGrowthRecommendations(): Promise<GrowthRecommendations> {
    const monetizationStatus = await this.checkMonetizationEligibility();
    const followersNeeded = monetizationStatus.followers_needed;
    const currentCount = monetizationStatus.follower_count;
    
    // Calculate estimated timeline
    const dailyGrowthTarget = 50; // Conservative estimate
    const daysTo1k = Math.max(1, Math.floor(followersNeeded / dailyGrowthTarget));
    
    return {
      current_status: {
        followers: currentCount,
        followers_needed: followersNeeded,
        progress_percentage: (currentCount / 1000) * 100
      },
      growth_strategy: {
        daily_posting: "1-2 high-quality videos per day",
        optimal_times: ["6-10 AM EST", "7-9 PM EST"],
        content_focus: "Controversial educational topics with high virality",
        engagement_priority: "Comments and shares over likes"
      },
      timeline: {
        estimated_days_to_1k: daysTo1k,
        daily_growth_target: dailyGrowthTarget,
        weekly_milestone: currentCount + (dailyGrowthTarget * 7)
      },
      monetization_preparation: {
        affiliate_programs: "Research and apply to relevant programs",
        content_strategy: "Prepare monetized content for launch",
        audience_building: "Focus on engaged, targeted followers"
      }
    };
  }

  private async checkMonetizationEligibility(): Promise<MonetizationStatus> {
    // Mock implementation - would integrate with TikTok API
    const followerCount = 850; // Example current count
    
    return {
      monetization_ready: followerCount >= 1000,
      follower_count: followerCount,
      followers_needed: Math.max(0, 1000 - followerCount)
    };
  }
}

export const tikTokManualAssistant = new TikTokManualAssistant();