export interface GrowthMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followers: number;
  engagementRate: number;
  viralScore: number;
}

export interface ContentPerformance {
  contentId: string;
  timestamp: Date;
  metrics: GrowthMetrics;
  trending: boolean;
  reachType: 'organic' | 'paid' | 'viral';
}

export interface GrowthStrategy {
  name: string;
  description: string;
  tactics: string[];
  expectedGrowth: number;
  timeframe: string;
  requirements: string[];
}

export interface ViralTrigger {
  type: 'hashtag' | 'sound' | 'trend' | 'challenge' | 'duet' | 'stitch';
  identifier: string;
  potentialReach: number;
  competition: 'low' | 'medium' | 'high';
  timing: 'emerging' | 'peak' | 'declining';
}

export class ViralGrowthIntegration {
  private growthStrategies: Record<string, GrowthStrategy>;
  private viralTriggers: ViralTrigger[];
  private performanceHistory: ContentPerformance[];

  constructor() {
    this.growthStrategies = {
      rapid_growth: {
        name: 'Rapid Viral Growth',
        description: 'Aggressive growth through viral content and trends',
        tactics: [
          'Post 3-5 times daily at peak hours',
          'Jump on trends within 24 hours',
          'Create controversial or polarizing content',
          'Use all 5 hashtag slots strategically',
          'Engage with every comment in first hour',
          'Collaborate with 5+ creators weekly'
        ],
        expectedGrowth: 1000,
        timeframe: '7 days',
        requirements: ['High content volume', 'Quick production', 'Trend awareness']
      },
      steady_authority: {
        name: 'Authority Building',
        description: 'Sustainable growth through expertise and value',
        tactics: [
          'Post 1-2 high-quality pieces daily',
          'Create educational series content',
          'Build email list from TikTok traffic',
          'Host weekly live sessions',
          'Develop signature content format',
          'Cross-promote on other platforms'
        ],
        expectedGrowth: 500,
        timeframe: '30 days',
        requirements: ['Expertise', 'Consistency', 'Value delivery']
      },
      engagement_focus: {
        name: 'Community Engagement',
        description: 'Growth through community building and interaction',
        tactics: [
          'Reply to 100% of comments',
          'Create response videos to questions',
          'Host challenges and contests',
          'Feature followers in content',
          'Build inside jokes and recurring themes',
          'Create exclusive content for engaged fans'
        ],
        expectedGrowth: 300,
        timeframe: '14 days',
        requirements: ['Time investment', 'Personal brand', 'Community management']
      }
    };

    this.viralTriggers = [];
    this.performanceHistory = [];
  }

  analyzeViralPotential(
    content: {
      hook: string;
      topic: string;
      format: string;
      hashtags: string[];
      soundId?: string;
    }
  ): {
    viralScore: number;
    factors: string[];
    recommendations: string[];
    estimatedReach: number;
  } {
    let score = 0;
    const factors: string[] = [];
    const recommendations: string[] = [];

    // Hook analysis
    const hookWords = content.hook.toLowerCase().split(' ');
    const viralHookWords = ['secret', 'never', 'stop', 'immediately', 'warning', 'breaking', 'exposed', 'truth'];
    const hookScore = hookWords.filter(word => viralHookWords.includes(word)).length * 10;
    score += hookScore;
    if (hookScore > 0) factors.push(`Strong hook words (+${hookScore})`);

    // Format analysis
    const viralFormats = ['pov', 'storytime', 'tutorial', 'reaction', 'challenge', 'transformation'];
    if (viralFormats.includes(content.format.toLowerCase())) {
      score += 15;
      factors.push(`Viral format: ${content.format} (+15)`);
    }

    // Hashtag analysis
    const trendingHashtags = this.checkTrendingHashtags(content.hashtags);
    score += trendingHashtags.length * 10;
    if (trendingHashtags.length > 0) {
      factors.push(`Trending hashtags: ${trendingHashtags.join(', ')} (+${trendingHashtags.length * 10})`);
    }

    // Sound analysis
    if (content.soundId) {
      score += 20;
      factors.push('Using sound/audio (+20)');
    }

    // Topic relevance
    const trendingTopics = ['ai', 'chatgpt', 'sidehustle', 'moneytok', 'lifehack'];
    if (trendingTopics.some(topic => content.topic.toLowerCase().includes(topic))) {
      score += 25;
      factors.push('Trending topic (+25)');
    }

    // Recommendations based on score
    if (score < 50) {
      recommendations.push('Add trending sound to boost visibility');
      recommendations.push('Use more viral hook words');
      recommendations.push('Consider jumping on current challenge');
    } else if (score < 75) {
      recommendations.push('Post at peak time (6-9 PM)');
      recommendations.push('Prepare quick responses for early comments');
    } else {
      recommendations.push('Have follow-up content ready');
      recommendations.push('Prepare to handle viral traffic');
    }

    const estimatedReach = Math.floor(1000 * Math.pow(1.5, score / 10));

    return {
      viralScore: Math.min(score, 100),
      factors,
      recommendations,
      estimatedReach
    };
  }

  selectGrowthStrategy(
    goals: {
      targetFollowers: number;
      currentFollowers: number;
      timeframe: number;
      contentCapacity: number;
      niche: string;
    }
  ): {
    strategy: GrowthStrategy;
    customizedTactics: string[];
    milestones: Array<{ day: number; target: number; action: string }>;
  } {
    const dailyGrowthNeeded = (goals.targetFollowers - goals.currentFollowers) / goals.timeframe;
    
    let selectedStrategy: GrowthStrategy;
    if (dailyGrowthNeeded > 100) {
      selectedStrategy = this.growthStrategies.rapid_growth;
    } else if (goals.contentCapacity < 2) {
      selectedStrategy = this.growthStrategies.steady_authority;
    } else {
      selectedStrategy = this.growthStrategies.engagement_focus;
    }

    const customizedTactics = this.customizeTactics(selectedStrategy, goals.niche);
    const milestones = this.createMilestones(goals, selectedStrategy);

    return {
      strategy: selectedStrategy,
      customizedTactics,
      milestones
    };
  }

  trackPerformance(
    contentId: string,
    metrics: Partial<GrowthMetrics>
  ): ContentPerformance {
    const performance: ContentPerformance = {
      contentId,
      timestamp: new Date(),
      metrics: {
        views: metrics.views || 0,
        likes: metrics.likes || 0,
        comments: metrics.comments || 0,
        shares: metrics.shares || 0,
        saves: metrics.saves || 0,
        followers: metrics.followers || 0,
        engagementRate: this.calculateEngagementRate(metrics),
        viralScore: this.calculateViralScore(metrics)
      },
      trending: (metrics.views || 0) > 10000,
      reachType: this.determineReachType(metrics)
    };

    this.performanceHistory.push(performance);
    return performance;
  }

  identifyViralTriggers(niche: string): ViralTrigger[] {
    // Simulated trending data - in production, this would pull from TikTok API
    const triggers: ViralTrigger[] = [
      {
        type: 'hashtag',
        identifier: `#${niche}tok`,
        potentialReach: 1000000,
        competition: 'high',
        timing: 'peak'
      },
      {
        type: 'sound',
        identifier: 'trending_audio_12345',
        potentialReach: 5000000,
        competition: 'medium',
        timing: 'emerging'
      },
      {
        type: 'challenge',
        identifier: `${niche}Challenge`,
        potentialReach: 2000000,
        competition: 'low',
        timing: 'emerging'
      }
    ];

    this.viralTriggers = triggers;
    return triggers;
  }

  generateGrowthReport(): {
    summary: {
      totalViews: number;
      totalEngagement: number;
      averageViralScore: number;
      bestPerformingContent: string[];
    };
    insights: string[];
    nextSteps: string[];
  } {
    const summary = {
      totalViews: this.performanceHistory.reduce((sum, p) => sum + p.metrics.views, 0),
      totalEngagement: this.performanceHistory.reduce((sum, p) => 
        sum + p.metrics.likes + p.metrics.comments + p.metrics.shares, 0),
      averageViralScore: this.performanceHistory.length > 0
        ? this.performanceHistory.reduce((sum, p) => sum + p.metrics.viralScore, 0) / this.performanceHistory.length
        : 0,
      bestPerformingContent: this.performanceHistory
        .sort((a, b) => b.metrics.viralScore - a.metrics.viralScore)
        .slice(0, 3)
        .map(p => p.contentId)
    };

    const insights = this.generateInsights();
    const nextSteps = this.generateNextSteps(summary);

    return { summary, insights, nextSteps };
  }

  private checkTrendingHashtags(hashtags: string[]): string[] {
    const trending = ['fyp', 'viral', 'trending', 'foryou', 'tiktok'];
    return hashtags.filter(tag => trending.some(t => tag.toLowerCase().includes(t)));
  }

  private calculateEngagementRate(metrics: Partial<GrowthMetrics>): number {
    if (!metrics.views || metrics.views === 0) return 0;
    const engagement = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
    return (engagement / metrics.views) * 100;
  }

  private calculateViralScore(metrics: Partial<GrowthMetrics>): number {
    const viewScore = Math.min((metrics.views || 0) / 10000, 1) * 30;
    const engagementScore = this.calculateEngagementRate(metrics) * 2;
    const shareScore = Math.min((metrics.shares || 0) / 100, 1) * 20;
    const saveScore = Math.min((metrics.saves || 0) / 50, 1) * 20;
    
    return Math.min(viewScore + engagementScore + shareScore + saveScore, 100);
  }

  private determineReachType(metrics: Partial<GrowthMetrics>): 'organic' | 'paid' | 'viral' {
    if ((metrics.views || 0) > 100000) return 'viral';
    if ((metrics.views || 0) < 1000) return 'organic';
    return 'organic';
  }

  private customizeTactics(strategy: GrowthStrategy, niche: string): string[] {
    const customTactics = [...strategy.tactics];
    
    const nicheTactics: Record<string, string[]> = {
      fitness: ['Share workout transformations', 'Create 30-day challenges'],
      business: ['Share income proofs', 'Break down success strategies'],
      beauty: ['Show before/after results', 'Create get-ready-with-me content'],
      tech: ['Demo new tools', 'Share productivity hacks'],
      finance: ['Break down complex topics', 'Share market updates']
    };

    if (nicheTactics[niche.toLowerCase()]) {
      customTactics.push(...nicheTactics[niche.toLowerCase()]);
    }

    return customTactics;
  }

  private createMilestones(
    goals: any,
    strategy: GrowthStrategy
  ): Array<{ day: number; target: number; action: string }> {
    const milestones = [];
    const totalDays = goals.timeframe;
    const totalGrowth = goals.targetFollowers - goals.currentFollowers;

    for (let i = 1; i <= 5; i++) {
      const day = Math.floor((totalDays / 5) * i);
      const target = goals.currentFollowers + Math.floor((totalGrowth / 5) * i);
      const action = strategy.tactics[i - 1] || 'Continue growth tactics';

      milestones.push({ day, target, action });
    }

    return milestones;
  }

  private generateInsights(): string[] {
    const insights: string[] = [];

    if (this.performanceHistory.length === 0) {
      return ['No performance data yet. Start posting to gather insights.'];
    }

    const avgViews = this.performanceHistory.reduce((sum, p) => sum + p.metrics.views, 0) / this.performanceHistory.length;
    
    if (avgViews > 10000) {
      insights.push('Your content is performing above average');
    } else {
      insights.push('Focus on improving hooks to increase views');
    }

    const viralContent = this.performanceHistory.filter(p => p.metrics.viralScore > 80);
    if (viralContent.length > 0) {
      insights.push(`${viralContent.length} pieces went viral - analyze and replicate`);
    }

    return insights;
  }

  private generateNextSteps(summary: any): string[] {
    const steps: string[] = [];

    if (summary.averageViralScore < 50) {
      steps.push('Study viral content in your niche');
      steps.push('Test more trending sounds and effects');
    }

    if (summary.totalEngagement < summary.totalViews * 0.05) {
      steps.push('Improve CTAs to boost engagement');
      steps.push('Ask questions to encourage comments');
    }

    steps.push('Double down on content similar to top performers');
    steps.push('Test posting at different times');

    return steps;
  }
}

// Export singleton instance
export const viralGrowthIntegration = new ViralGrowthIntegration();