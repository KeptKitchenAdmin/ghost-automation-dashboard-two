interface AuthorityScript {
  hook: string;
  problem: string;
  solution: string;
  authority: string;
  cta: string;
  hashtags: string[];
  keywords: string[];
}

interface GeneratedContent {
  script: AuthorityScript;
  voiceoverText: string;
  captions: string[];
  visualSuggestions: string[];
  engagementTips: string[];
}

export class ViralAuthorityContentGenerator {
  private authorityTemplates: Record<string, string[]>;
  private hookTemplates: string[];
  private ctaTemplates: string[];

  constructor() {
    this.authorityTemplates = {
      experience: [
        "After {years} years in {industry}, I discovered",
        "My {achievement} taught me",
        "Working with {number}+ {clients/customers} showed me",
        "Through {experience}, I learned"
      ],
      results: [
        "This helped {number} people achieve {result}",
        "My clients saw {percentage}% improvement in {metric}",
        "This method generated {result} in just {timeframe}",
        "Over {number} success stories prove"
      ],
      credentials: [
        "As a certified {credential}",
        "With my {degree/certification} in {field}",
        "Featured in {publication/media}",
        "Recognized by {organization} for {achievement}"
      ],
      social_proof: [
        "{number}K followers trust this advice",
        "Join {number}+ people who've transformed their {area}",
        "The strategy that went viral with {number}M views",
        "What {number} professionals don't want you to know"
      ]
    };

    this.hookTemplates = [
      "The {industry} secret they don't want you to know...",
      "Stop doing {common_mistake} immediately",
      "Why 99% of people fail at {topic}",
      "The hidden truth about {topic}",
      "This one thing changed everything",
      "POV: You finally understand {topic}",
      "Nobody talks about this {industry} hack",
      "The {price} mistake that's costing you {result}"
    ];

    this.ctaTemplates = [
      "Follow for more {industry} secrets",
      "Share this before it gets taken down",
      "Comment '{keyword}' for the full guide",
      "Save this for later (you'll need it)",
      "Which tip helped you most? Let me know!",
      "Tag someone who needs to see this",
      "Part 2 coming if this helps you",
      "Drop a ❤️ if this opened your eyes"
    ];
  }

  generateAuthorityContent(
    topic: string,
    niche: string,
    targetAudience: string,
    problemPoint: string,
    solution: string,
    credentials?: {
      years?: number;
      achievement?: string;
      metric?: string;
      socialProof?: number;
    }
  ): GeneratedContent {
    const script = this.createAuthorityScript(
      topic,
      niche,
      problemPoint,
      solution,
      credentials
    );

    const voiceoverText = this.generateVoiceover(script);
    const captions = this.createCaptions(script);
    const visualSuggestions = this.getVisualSuggestions(script, niche);
    const engagementTips = this.getEngagementTips(targetAudience);

    return {
      script,
      voiceoverText,
      captions,
      visualSuggestions,
      engagementTips
    };
  }

  private createAuthorityScript(
    topic: string,
    niche: string,
    problemPoint: string,
    solution: string,
    credentials?: any
  ): AuthorityScript {
    // Select templates based on available credentials
    const authorityType = credentials?.achievement ? 'results' : 
                         credentials?.years ? 'experience' : 
                         credentials?.socialProof ? 'social_proof' : 
                         'credentials';

    const authorityTemplate = this.selectRandom(this.authorityTemplates[authorityType]);
    const hookTemplate = this.selectRandom(this.hookTemplates);
    const ctaTemplate = this.selectRandom(this.ctaTemplates);

    // Build the authority statement
    let authority = authorityTemplate;
    if (credentials) {
      authority = authority
        .replace('{years}', credentials.years?.toString() || '5')
        .replace('{industry}', niche)
        .replace('{achievement}', credentials.achievement || 'breakthrough')
        .replace('{number}', credentials.socialProof?.toString() || '1000')
        .replace('{clients/customers}', 'clients')
        .replace('{result}', solution)
        .replace('{percentage}', '87')
        .replace('{metric}', credentials.metric || 'results')
        .replace('{timeframe}', '30 days');
    }

    // Build the hook
    const hook = hookTemplate
      .replace('{industry}', niche)
      .replace('{topic}', topic)
      .replace('{common_mistake}', problemPoint.split(' ')[0])
      .replace('{price}', '$500');

    // Build the CTA
    const cta = ctaTemplate
      .replace('{industry}', niche)
      .replace('{keyword}', topic.split(' ')[0].toUpperCase());

    return {
      hook,
      problem: `Most people struggle with ${problemPoint} because they don't understand the real issue.`,
      solution: `Here's what actually works: ${solution}`,
      authority,
      cta,
      hashtags: this.generateHashtags(topic, niche),
      keywords: this.extractKeywords(topic, niche, solution)
    };
  }

  private generateVoiceover(script: AuthorityScript): string {
    return `${script.hook}

${script.problem}

${script.authority}

${script.solution}

${script.cta}`;
  }

  private createCaptions(script: AuthorityScript): string[] {
    return [
      script.hook,
      script.problem,
      script.authority,
      script.solution,
      "The results speak for themselves",
      script.cta
    ];
  }

  private getVisualSuggestions(script: AuthorityScript, niche: string): string[] {
    const suggestions = [
      "Open with dramatic close-up of your face",
      "Quick montage of common mistakes",
      "Show credentials/achievements on screen",
      "Before/after transformation visuals",
      "Data/statistics overlay animation",
      "Client testimonials or results",
      "Behind-the-scenes of your process",
      "Screen recording of proof/results"
    ];

    // Add niche-specific visuals
    const nicheVisuals: Record<string, string[]> = {
      fitness: ["Workout demonstrations", "Body transformation photos", "Meal prep visuals"],
      business: ["Revenue graphs", "Dashboard screenshots", "Office/workspace shots"],
      beauty: ["Product close-ups", "Application techniques", "Before/after skin"],
      tech: ["Screen recordings", "Code snippets", "Tool demonstrations"],
      finance: ["Chart analysis", "Portfolio growth", "Calculator visuals"]
    };

    if (nicheVisuals[niche.toLowerCase()]) {
      suggestions.push(...nicheVisuals[niche.toLowerCase()]);
    }

    return suggestions.slice(0, 8);
  }

  private getEngagementTips(targetAudience: string): string[] {
    return [
      "Post during peak hours (6-9 AM, 7-9 PM)",
      "Respond to comments within first hour",
      "Use trending audio if it fits your message",
      "Create a response video to top comments",
      "Share behind-the-scenes in stories",
      "Go live to discuss the topic deeper",
      "Create a series expanding on each point",
      "Collaborate with others in your niche"
    ];
  }

  private generateHashtags(topic: string, niche: string): string[] {
    const baseHashtags = [
      `#${niche.toLowerCase()}tips`,
      `#${niche.toLowerCase()}secrets`,
      `#${topic.toLowerCase().replace(/\s+/g, '')}`,
      '#viralcontent',
      '#contentcreator'
    ];

    const nicheHashtags: Record<string, string[]> = {
      fitness: ['#fitnesstips', '#workoutmotivation', '#healthylifestyle'],
      business: ['#entrepreneur', '#businessgrowth', '#successtips'],
      beauty: ['#beautyhacks', '#skincaretips', '#makeuptutorial'],
      tech: ['#techtips', '#programming', '#techlife'],
      finance: ['#moneytips', '#investing', '#financialfreedom']
    };

    const relevant = nicheHashtags[niche.toLowerCase()] || [];
    return [...baseHashtags, ...relevant].slice(0, 5);
  }

  private extractKeywords(topic: string, niche: string, solution: string): string[] {
    const words = `${topic} ${niche} ${solution}`.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'some', 'any', 'few', 'more', 'most', 'other', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'but', 'if', 'or', 'because', 'until', 'while', 'of', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'];
    
    return words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .filter((word, index, self) => self.indexOf(word) === index)
      .slice(0, 10);
  }

  private selectRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateBatchContent(
    topics: Array<{
      topic: string;
      niche: string;
      targetAudience: string;
      problemPoint: string;
      solution: string;
      credentials?: any;
    }>,
    count: number = 5
  ): GeneratedContent[] {
    const contents: GeneratedContent[] = [];
    
    for (let i = 0; i < count && i < topics.length; i++) {
      const topicData = topics[i];
      contents.push(
        this.generateAuthorityContent(
          topicData.topic,
          topicData.niche,
          topicData.targetAudience,
          topicData.problemPoint,
          topicData.solution,
          topicData.credentials
        )
      );
    }

    return contents;
  }

  getContentCalendar(contents: GeneratedContent[], startDate: Date = new Date()): Array<{
    date: string;
    time: string;
    content: GeneratedContent;
    postingTips: string[];
  }> {
    const calendar = [];
    const optimalTimes = ['09:00', '12:00', '17:00', '20:00'];
    let currentDate = new Date(startDate);
    let timeIndex = 0;

    for (const content of contents) {
      calendar.push({
        date: currentDate.toISOString().split('T')[0],
        time: optimalTimes[timeIndex % optimalTimes.length],
        content,
        postingTips: [
          'Check trending sounds before posting',
          'Update hashtags with current trends',
          'Prepare to engage with comments immediately',
          'Have follow-up content ready'
        ]
      });

      // Move to next posting slot
      timeIndex++;
      if (timeIndex % optimalTimes.length === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return calendar;
  }
}

// Export singleton instance
export const viralAuthorityContentGenerator = new ViralAuthorityContentGenerator();