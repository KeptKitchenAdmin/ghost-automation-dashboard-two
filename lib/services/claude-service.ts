import Anthropic from '@anthropic-ai/sdk';
import { RedditStory } from '../types/reddit-automation';

export class ClaudeService {
  private anthropic: Anthropic;
  private isProcessing = false;
  
  // 🚨 REALISTIC API LIMITS BASED ON YOUR ACTUAL BUDGETS
  private static dailyUsageCount = 0;
  private static dailyUsageCost = 0;
  private static lastResetDate = new Date().toDateString();
  private static readonly DAILY_LIMITS = {
    MAX_CALLS: 20,         // Max 20 Claude calls per day ($30/month ÷ $1.50 avg)
    MAX_COST: 1.00,        // Max $1 Claude spending per day ($30/month budget)
    MAX_TOKENS: 200000,    // Max 200K tokens per day
    MAX_CONCURRENT: 1      // Max 1 concurrent call
  };
  private static totalTokensToday = 0;

  constructor() {
    // Server-side only - safe environment variable access
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
    this.resetDailyLimitsIfNeeded();
  }

  private resetDailyLimitsIfNeeded(): void {
    const today = new Date().toDateString();
    if (ClaudeService.lastResetDate !== today) {
      console.log('🔄 Resetting daily API limits for new day');
      ClaudeService.dailyUsageCount = 0;
      ClaudeService.dailyUsageCost = 0;
      ClaudeService.totalTokensToday = 0;
      ClaudeService.lastResetDate = today;
    }
  }

  private checkDailyLimits(estimatedCost: number, estimatedTokens: number): void {
    this.resetDailyLimitsIfNeeded();

    // Check daily call limit
    if (ClaudeService.dailyUsageCount >= ClaudeService.DAILY_LIMITS.MAX_CALLS) {
      throw new Error(`Daily Claude API call limit reached (${ClaudeService.DAILY_LIMITS.MAX_CALLS} calls). Try again tomorrow.`);
    }

    // Check daily cost limit
    if (ClaudeService.dailyUsageCost + estimatedCost > ClaudeService.DAILY_LIMITS.MAX_COST) {
      throw new Error(`Daily Claude cost limit would be exceeded. Remaining budget: ${(ClaudeService.DAILY_LIMITS.MAX_COST - ClaudeService.dailyUsageCost).toFixed(2)}`);
    }

    // Check daily token limit
    if (ClaudeService.totalTokensToday + estimatedTokens > ClaudeService.DAILY_LIMITS.MAX_TOKENS) {
      throw new Error(`Daily Claude token limit would be exceeded. Remaining tokens: ${ClaudeService.DAILY_LIMITS.MAX_TOKENS - ClaudeService.totalTokensToday}`);
    }

    // Check concurrent processing limit
    if (this.isProcessing) {
      throw new Error('Claude API is already processing another request. Please wait.');
    }
  }

  private updateDailyUsage(actualCost: number, actualTokens: number): void {
    ClaudeService.dailyUsageCount++;
    ClaudeService.dailyUsageCost += actualCost;
    ClaudeService.totalTokensToday += actualTokens;
    
    console.log(`📊 Daily Claude usage: ${ClaudeService.dailyUsageCount}/${ClaudeService.DAILY_LIMITS.MAX_CALLS} calls, ${ClaudeService.dailyUsageCost.toFixed(2)}/${ClaudeService.DAILY_LIMITS.MAX_COST} cost, ${ClaudeService.totalTokensToday}/${ClaudeService.DAILY_LIMITS.MAX_TOKENS} tokens`);
  }

  // Expose current usage for monitoring
  static getCurrentUsage() {
    return {
      callsToday: this.dailyUsageCount,
      costToday: this.dailyUsageCost,
      tokensToday: this.totalTokensToday,
      limits: this.DAILY_LIMITS,
      resetDate: this.lastResetDate
    };
  }

  async enhanceStory(story: RedditStory, targetDurationMinutes: number = 5): Promise<string> {
    // Check if Claude is available
    if (!this.anthropic || !process.env.ANTHROPIC_API_KEY) {
      console.log('⚠️ Claude API not configured, using fallback enhancement');
      return this.fallbackEnhancement(story);
    }

    const estimatedTokens = Math.ceil(story.content.length / 4);
    const estimatedCost = (estimatedTokens / 1000000) * 3; // $3 per 1M tokens

    // Check all limits before processing
    this.checkDailyLimits(estimatedCost, estimatedTokens);

    console.log('🔒 API SAFETY: Starting Claude API call for user content creation');
    this.isProcessing = true;

    try {
      // If cost too high, use fallback
      if (estimatedCost > 0.50) {
        console.log(`Story too expensive (${estimatedCost.toFixed(3)}), using fallback enhancement`);
        return this.fallbackEnhancement(story);
      }

      console.log(`Claude story enhancement - Duration: ${targetDurationMinutes}min - Estimated cost: ${estimatedCost.toFixed(3)}`);

      const prompt = this.buildEnhancementPrompt(story, targetDurationMinutes);

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: Math.min(2000, Math.floor(targetDurationMinutes * 400)), // Scale tokens with duration
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const actualTokens = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);
      const actualCost = (actualTokens / 1000000) * 3;

      // Update usage tracking
      this.updateDailyUsage(actualCost, actualTokens);

      // Log usage to storage if available
      try {
        // This would integrate with R2 storage when available
        console.log(`Claude API usage logged: ${actualCost.toFixed(4)} cost, ${actualTokens} tokens`);
      } catch (error) {
        console.warn('Failed to log API usage:', error);
      }

      const enhanced = response.content[0].type === 'text' ? response.content[0].text : '';
      
      if (enhanced.length < story.content.length * 0.8) {
        console.warn('Enhancement too short, using original');
        return story.content;
      }

      console.log(`✅ Claude story enhancement complete - Actual cost: ${actualCost.toFixed(3)}`);
      return enhanced;

    } catch (error) {
      console.error('Claude story enhancement failed:', error);
      return this.fallbackEnhancement(story);
    } finally {
      this.isProcessing = false;
    }
  }

  private fallbackEnhancement(story: RedditStory): string {
    console.log('Using fallback story enhancement (NO API calls)');
    
    const hooks = {
      drama: "You won't believe what happened next...",
      horror: "This story still gives me chills...",
      revenge: "They thought they could get away with it...",
      wholesome: "This will restore your faith in humanity...",
      mystery: "No one could explain what happened..."
    };

    const hook = hooks[story.category] || "Here's a story that will blow your mind...";
    const enhanced = `${hook}\n\n${story.content}\n\nWhat do you think? Let me know in the comments!`;
    
    return enhanced;
  }

  private buildEnhancementPrompt(story: RedditStory, targetDurationMinutes: number): string {
    const categoryInstructions = {
      drama: 'Structure for maximum emotional impact and pacing',
      horror: 'Organize for suspense and atmospheric tension buildup',
      revenge: 'Structure the setup and payoff for maximum satisfaction',
      wholesome: 'Pace the heartwarming moments for emotional resonance',
      mystery: 'Build intrigue through strategic information reveal'
    };

    return `Transform this Reddit story into an engaging YouTube script format WHILE KEEPING ALL FACTS EXACTLY THE SAME.

ORIGINAL STORY (r/${story.subreddit}):
Title: ${story.title}
Content: ${story.content}

CRITICAL RULES:
- DO NOT add any new facts, details, or information
- DO NOT change what actually happened
- DO NOT make up dialogue, names, or events
- ONLY improve how the true story is told

INSTRUCTIONS FOR PRESENTATION:
- ${categoryInstructions[story.category]}
- Start with an immediate hook using the actual story details
- Break into clear segments perfect for voiceover pacing
- Add strategic pauses marked with [PAUSE] for dramatic effect
- Use natural speech patterns and contractions
- Target ${targetDurationMinutes} minutes when read aloud (${Math.floor(targetDurationMinutes * 150)} words approximately)
- End with engaging question to audience about the real situation

KEEP THE STORY 100% TRUTHFUL - only improve pacing, structure, and delivery.

Return ONLY the restructured script with no explanations:`;
  }

  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}