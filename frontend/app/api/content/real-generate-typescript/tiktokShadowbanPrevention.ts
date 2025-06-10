export interface ShadowbanPreventionConfig {
  maxHashtagsPerPost: number;
  maxMentionsPerPost: number;
  minTimeBetweenPosts: number;
  maxPostsPerDay: number;
  maxDailyFollows: number;
  maxDailyLikes: number;
  maxDailyComments: number;
  bannedWords: string[];
  riskyHashtags: string[];
  safePractices: string[];
}

export interface ContentCheckResult {
  isSafe: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
  modifiedContent?: string;
}

export interface ActivityTracker {
  posts: number;
  follows: number;
  likes: number;
  comments: number;
  lastPostTime: Date | null;
  dailyReset: Date;
}

export class TikTokShadowbanPrevention {
  private config: ShadowbanPreventionConfig;
  private activityTracker: ActivityTracker;

  constructor() {
    this.config = {
      maxHashtagsPerPost: 5,
      maxMentionsPerPost: 2,
      minTimeBetweenPosts: 3600,
      maxPostsPerDay: 3,
      maxDailyFollows: 100,
      maxDailyLikes: 500,
      maxDailyComments: 50,
      bannedWords: [
        'follow for follow', 'f4f', 'like for like', 'l4l',
        'sub4sub', 'follow back', 'followback', 'team follow',
        'follow train', 'follow party', 'recent for recent',
        'row for row', 'share for share', 's4s',
        'gain followers', 'get followers', 'free followers',
        'boost your', 'grow your', 'increase your'
      ],
      riskyHashtags: [
        '#followforfollow', '#likeforlike', '#f4f', '#l4l',
        '#followback', '#teamfollowback', '#followtrain',
        '#spam4spam', '#recent4recent', '#shoutout4shoutout'
      ],
      safePractices: [
        'Use trending sounds appropriately',
        'Create original content',
        'Engage authentically with comments',
        'Post at optimal times for your audience',
        'Use relevant hashtags sparingly',
        'Maintain consistent posting schedule',
        'Avoid repetitive content',
        'Build genuine community connections'
      ]
    };

    this.activityTracker = {
      posts: 0,
      follows: 0,
      likes: 0,
      comments: 0,
      lastPostTime: null,
      dailyReset: new Date()
    };
  }

  checkContent(content: string, hashtags: string[] = [], mentions: string[] = []): ContentCheckResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;
    let modifiedContent = content;

    // Check for banned words
    const contentLower = content.toLowerCase();
    for (const bannedWord of this.config.bannedWords) {
      if (contentLower.includes(bannedWord)) {
        issues.push(`Contains banned phrase: "${bannedWord}"`);
        score -= 20;
        modifiedContent = modifiedContent.replace(new RegExp(bannedWord, 'gi'), '');
      }
    }

    // Check hashtag count
    if (hashtags.length > this.config.maxHashtagsPerPost) {
      issues.push(`Too many hashtags (${hashtags.length}/${this.config.maxHashtagsPerPost})`);
      suggestions.push(`Use only ${this.config.maxHashtagsPerPost} most relevant hashtags`);
      score -= 15;
    }

    // Check for risky hashtags
    for (const hashtag of hashtags) {
      if (this.config.riskyHashtags.includes(hashtag.toLowerCase())) {
        issues.push(`Risky hashtag detected: ${hashtag}`);
        suggestions.push(`Replace ${hashtag} with a more specific, niche hashtag`);
        score -= 10;
      }
    }

    // Check mention count
    if (mentions.length > this.config.maxMentionsPerPost) {
      issues.push(`Too many mentions (${mentions.length}/${this.config.maxMentionsPerPost})`);
      suggestions.push('Reduce mentions to avoid spam detection');
      score -= 10;
    }

    // Check for repetitive patterns
    const words = content.split(/\s+/);
    const wordCount: Record<string, number> = {};
    for (const word of words) {
      if (word.length > 3) {
        wordCount[word.toLowerCase()] = (wordCount[word.toLowerCase()] || 0) + 1;
      }
    }

    const repetitiveWords = Object.entries(wordCount)
      .filter(([_, count]) => count > 3)
      .map(([word, _]) => word);

    if (repetitiveWords.length > 0) {
      issues.push(`Repetitive words detected: ${repetitiveWords.join(', ')}`);
      suggestions.push('Vary your vocabulary to appear more natural');
      score -= 5 * repetitiveWords.length;
    }

    // Clean up modified content
    modifiedContent = modifiedContent.trim().replace(/\s+/g, ' ');

    return {
      isSafe: score >= 70,
      score: Math.max(0, score),
      issues,
      suggestions: suggestions.length > 0 ? suggestions : this.config.safePractices.slice(0, 3),
      modifiedContent: modifiedContent !== content ? modifiedContent : undefined
    };
  }

  canPost(): { allowed: boolean; reason?: string; waitTime?: number } {
    this.resetDailyLimits();

    if (this.activityTracker.posts >= this.config.maxPostsPerDay) {
      return {
        allowed: false,
        reason: `Daily post limit reached (${this.config.maxPostsPerDay})`,
        waitTime: this.getTimeUntilReset()
      };
    }

    if (this.activityTracker.lastPostTime) {
      const timeSinceLastPost = Date.now() - this.activityTracker.lastPostTime.getTime();
      const waitTimeMs = this.config.minTimeBetweenPosts * 1000 - timeSinceLastPost;

      if (waitTimeMs > 0) {
        return {
          allowed: false,
          reason: 'Too soon since last post',
          waitTime: Math.ceil(waitTimeMs / 1000)
        };
      }
    }

    return { allowed: true };
  }

  recordPost(): void {
    this.activityTracker.posts++;
    this.activityTracker.lastPostTime = new Date();
  }

  canEngage(type: 'follow' | 'like' | 'comment'): { allowed: boolean; reason?: string } {
    this.resetDailyLimits();

    const limits = {
      follow: this.config.maxDailyFollows,
      like: this.config.maxDailyLikes,
      comment: this.config.maxDailyComments
    };

    const current = {
      follow: this.activityTracker.follows,
      like: this.activityTracker.likes,
      comment: this.activityTracker.comments
    };

    if (current[type] >= limits[type]) {
      return {
        allowed: false,
        reason: `Daily ${type} limit reached (${limits[type]})`
      };
    }

    return { allowed: true };
  }

  recordEngagement(type: 'follow' | 'like' | 'comment'): void {
    if (type === 'follow') this.activityTracker.follows++;
    else if (type === 'like') this.activityTracker.likes++;
    else if (type === 'comment') this.activityTracker.comments++;
  }

  getOptimalPostingTimes(): string[] {
    return [
      '6:00 AM - 10:00 AM (Morning commute)',
      '12:00 PM - 1:00 PM (Lunch break)',
      '5:00 PM - 7:00 PM (After work)',
      '8:00 PM - 11:00 PM (Evening relaxation)'
    ];
  }

  getSafeHashtagStrategy(niche: string): string[] {
    const strategies = {
      general: [
        'Mix popular and niche hashtags',
        'Use 3-5 hashtags maximum',
        'Include location-based hashtags',
        'Create a branded hashtag',
        'Research competitor hashtags'
      ],
      specific: [
        `Use specific ${niche} community hashtags`,
        'Participate in weekly hashtag challenges',
        'Create content series with unique hashtags',
        'Engage with posts using your target hashtags',
        'Track hashtag performance weekly'
      ]
    };

    return [...strategies.general, ...strategies.specific];
  }

  getActivityReport(): {
    daily: ActivityTracker;
    limits: {
      posts: string;
      follows: string;
      likes: string;
      comments: string;
    };
    recommendations: string[];
  } {
    this.resetDailyLimits();

    return {
      daily: { ...this.activityTracker },
      limits: {
        posts: `${this.activityTracker.posts}/${this.config.maxPostsPerDay}`,
        follows: `${this.activityTracker.follows}/${this.config.maxDailyFollows}`,
        likes: `${this.activityTracker.likes}/${this.config.maxDailyLikes}`,
        comments: `${this.activityTracker.comments}/${this.config.maxDailyComments}`
      },
      recommendations: this.getRecommendations()
    };
  }

  private resetDailyLimits(): void {
    const now = new Date();
    const resetTime = new Date(this.activityTracker.dailyReset);
    
    if (now.getDate() !== resetTime.getDate() || 
        now.getMonth() !== resetTime.getMonth() || 
        now.getFullYear() !== resetTime.getFullYear()) {
      this.activityTracker = {
        posts: 0,
        follows: 0,
        likes: 0,
        comments: 0,
        lastPostTime: null,
        dailyReset: now
      };
    }
  }

  private getTimeUntilReset(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return Math.ceil((tomorrow.getTime() - now.getTime()) / 1000);
  }

  private getRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.activityTracker.posts === 0) {
      recommendations.push('Start with 1-2 high-quality posts today');
    }

    if (this.activityTracker.follows < 20) {
      recommendations.push('Engage with 20-30 accounts in your niche');
    }

    if (this.activityTracker.comments < 10) {
      recommendations.push('Leave thoughtful comments on trending posts');
    }

    recommendations.push(...this.config.safePractices.slice(0, 3));

    return recommendations;
  }
}

// Export singleton instance
export const shadowbanPrevention = new TikTokShadowbanPrevention();