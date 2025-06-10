/**
 * 🔥 VIRAL AUTHORITY CONTENT GENERATOR
 * Builds conspiracy/educational content for FOLLOWER GROWTH (Pre-1K)
 * Focus: Addictive, shareable truth bombs that build audience to 1K followers
 */

interface AuthorityCategory {
  topics: string[];
  shock_factor: number;
  viral_potential: string;
}

interface EngagementPrompts {
  comment_farming: string[];
  follow_ctas: string[];
  urgency_creators: string[];
  cliffhangers: string[];
}

interface HookDetails {
  hook: string;
  shock_stat: string;
  emotional_trigger: string;
  urgency_element: string;
  engagement_prompt: string;
}

interface ContentStructure {
  hook: HookDetails;
  body_segments: string[];
  visual_cues: string[];
  engagement_elements: string[];
  cta: string;
  follow_up_tease: string;
}

export class ViralAuthorityContentGenerator {
  private authorityCategories: Record<string, AuthorityCategory>;
  private viralHooks: string[];
  private engagementPrompts: EngagementPrompts;

  constructor() {
    // 🎯 VIRAL GROWTH CATEGORIES (Pre-Monetization)
    this.authorityCategories = {
      government_experiments: {
        topics: ['MKUltra', 'human testing', 'classified programs', 'mind control', 'secret trials'],
        shock_factor: 10,
        viral_potential: 'MAXIMUM'
      },
      health_industry_lies: {
        topics: ['nutrition fraud', 'BMI scam', 'sugar lobby', 'suppressed studies', 'pharma coverups'],
        shock_factor: 9,
        viral_potential: 'HIGH'
      },
      historical_coverups: {
        topics: ['Minnesota Starvation', 'hidden documents', 'censored research', 'banned studies'],
        shock_factor: 8,
        viral_potential: 'HIGH'
      },
      scientific_censorship: {
        topics: ['silenced scientists', 'deleted research', 'industry influence', 'academic fraud'],
        shock_factor: 7,
        viral_potential: 'MEDIUM'
      }
    };
    
    // 🔥 VIRAL HOOKS (First 3 Seconds Are CRITICAL)
    this.viralHooks = [
      "You weren't supposed to see this...",
      "The government spent $2.4M to prove this and then buried it...",
      "This document was classified for 50 years...",
      "They deleted this study 3 times...",
      "The FDA doesn't want you to know this...",
      "This scientist was silenced for revealing...",
      "Declassified: What they did to people in the 1950s...",
      "The nutrition industry LIED about this for decades...",
      "This government experiment proves everything wrong...",
      "LEAKED: Internal documents reveal the truth..."
    ];
    
    // 💬 ENGAGEMENT FARMING ELEMENTS
    this.engagementPrompts = {
      comment_farming: [
        "Comment if you already knew this",
        "Type 'EXPOSED' if this shocked you",
        "Comment your thoughts below",
        "Did you know this? Comment below",
        "Share this if more people need to see it"
      ],
      follow_ctas: [
        "Follow for more suppressed truths",
        "Follow me for daily truth bombs",
        "Follow if you want to learn what they hide",
        "Hit follow for more declassified content",
        "Follow for content they don't want you to see"
      ],
      urgency_creators: [
        "They keep trying to delete this",
        "Save this before it gets removed",
        "Screenshot this - they might take it down",
        "Share before they censor it",
        "This won't stay up long"
      ],
      cliffhangers: [
        "Wait until you see what they did next...",
        "But that's not even the worst part...",
        "The next document will shock you...",
        "Part 2 will blow your mind...",
        "Follow to see the full truth..."
      ]
    };
  }

  generateDocumentImages(topic: string, documentType: string = "classified"): string[] {
    const documentPrompts: Record<string, string[]> = {
      mkultra: [
        "Vintage 1950s government document with 'TOP SECRET - MKUltra' header, typewriter font, official CIA letterhead, redacted sections with black bars, aged paper texture, authentic government seal",
        "Declassified document showing human experiment data, charts with psychological test results, clinical notes about mind control subjects, official government stamps, yellowed paper",
        "Medical experiment report with subject numbers, psychological evaluation charts, handwritten notes in margins, 'CLASSIFIED - EYES ONLY' watermark"
      ],
      nutrition_fraud: [
        "1960s sugar industry internal memo revealing lobby tactics, corporate letterhead, charts showing hidden payments to scientists, aged business document style",
        "Government nutrition study results showing BMI fraud, statistical charts proving BMI inaccuracy, official health department letterhead, scientific data tables",
        "FDA internal document discussing industry influence, meeting notes about suppressed studies, official government formatting, highlighted key sections"
      ],
      historical_coverup: [
        "Minnesota Starvation Experiment documentation, clinical photos of subjects, medical charts showing dangerous weight loss, university research letterhead",
        "Suppressed nutrition study results, before/after comparison charts, academic institution letterhead, research data proving government guidelines wrong",
        "Historical document showing industry influence on health recommendations, timeline of events, corporate-government communication records"
      ]
    };
    
    const topicKey = topic.toLowerCase().replace(' ', '_');
    const prompts = documentPrompts[topicKey] || documentPrompts.mkultra;
    
    // Return mock image URLs (in production, would call image generation API)
    return prompts.slice(0, 3).map((prompt, index) => 
      `https://generated-documents.example.com/${topicKey}_${index + 1}.jpg`
    );
  }

  createShockingHook(category: string, topic: string): HookDetails {
    const baseHook = this.viralHooks[Math.floor(Math.random() * this.viralHooks.length)];
    
    const categoryCustomizations: Record<string, any> = {
      government_experiments: {
        prefix: "DECLASSIFIED: ",
        shock_stats: ["$2.4 million", "50 years classified", "300+ victims", "illegal experiments"],
        emotional_trigger: "What they did to innocent people will haunt you..."
      },
      health_industry_lies: {
        prefix: "EXPOSED: ",
        shock_stats: ["$1 billion coverup", "40 years of lies", "millions affected", "industry fraud"],
        emotional_trigger: "Everything you know about health is a lie..."
      },
      historical_coverups: {
        prefix: "HIDDEN TRUTH: ",
        shock_stats: ["decades suppressed", "thousands of subjects", "government sanctioned", "still classified"],
        emotional_trigger: "The history they don't teach you..."
      },
      scientific_censorship: {
        prefix: "SILENCED: ",
        shock_stats: ["career destroyed", "research buried", "truth suppressed", "industry pressure"],
        emotional_trigger: "Scientists risk everything to reveal this..."
      }
    };

    const customization = categoryCustomizations[category] || categoryCustomizations.government_experiments;
    const shockStat = customization.shock_stats[Math.floor(Math.random() * customization.shock_stats.length)];
    const urgencyElement = this.engagementPrompts.urgency_creators[Math.floor(Math.random() * this.engagementPrompts.urgency_creators.length)];
    const engagementPrompt = this.engagementPrompts.comment_farming[Math.floor(Math.random() * this.engagementPrompts.comment_farming.length)];

    return {
      hook: `${customization.prefix}${baseHook}`,
      shock_stat: shockStat,
      emotional_trigger: customization.emotional_trigger,
      urgency_element: urgencyElement,
      engagement_prompt: engagementPrompt
    };
  }

  generateViralContent(category: string, topic: string, targetLength: number = 60): ContentStructure {
    if (!this.authorityCategories[category]) {
      throw new Error(`Category ${category} not supported`);
    }

    const hook = this.createShockingHook(category, topic);
    
    // Generate body segments based on category
    const bodySegments = this.generateBodySegments(category, topic, targetLength);
    
    // Visual cues for maximum engagement
    const visualCues = [
      "Flash dramatic text overlay during hook",
      "Show document images with zoom effects",
      "Use red arrows pointing to key information",
      "Add dramatic background music",
      "Include shocking statistics as text overlays",
      "Use before/after comparison visuals",
      "Add countdown timer for urgency"
    ];

    // Engagement elements throughout video
    const engagementElements = [
      "Ask viewers to comment their thoughts",
      "Request likes for algorithm boost",
      "Encourage shares to spread truth",
      "Build suspense for next revelation",
      "Use call-and-response patterns",
      "Create anticipation for follow-up content"
    ];

    const cta = this.engagementPrompts.follow_ctas[Math.floor(Math.random() * this.engagementPrompts.follow_ctas.length)];
    const followUpTease = this.engagementPrompts.cliffhangers[Math.floor(Math.random() * this.engagementPrompts.cliffhangers.length)];

    return {
      hook,
      body_segments: bodySegments,
      visual_cues: visualCues.slice(0, 4),
      engagement_elements: engagementElements.slice(0, 3),
      cta,
      follow_up_tease: followUpTease
    };
  }

  private generateBodySegments(category: string, topic: string, targetLength: number): string[] {
    const segmentTemplates: Record<string, string[]> = {
      government_experiments: [
        "In {year}, the government began secret experiments on {subjects}",
        "Documents show they used {methods} without consent",
        "The results were so shocking they classified everything for {duration}",
        "Victims suffered {consequences} that lasted {timeframe}",
        "When exposed, officials claimed it was for {justification}"
      ],
      health_industry_lies: [
        "For {duration}, the {industry} has hidden the truth about {topic}",
        "Internal documents reveal they knew {truth} but promoted {lie}",
        "They spent ${amount} to silence researchers who discovered {finding}",
        "The real data shows {shocking_statistic} that contradicts everything",
        "This coverup has affected {number} of people worldwide"
      ],
      historical_coverups: [
        "The {experiment_name} study from {year} was buried for {reason}",
        "Researchers found {shocking_result} that challenged {belief}",
        "When officials saw the data, they immediately {action}",
        "The truth about {topic} has been hidden from the public",
        "These findings would change everything we know about {subject}"
      ],
      scientific_censorship: [
        "Dr. {name} discovered {finding} that threatened {industry}",
        "Their research showed {result} contradicting official guidelines",
        "Within months, their funding was cut and career destroyed",
        "The study was removed from {publication} under pressure",
        "Today, this suppressed research is finally being revealed"
      ]
    };

    const templates = segmentTemplates[category] || segmentTemplates.government_experiments;
    
    // Fill templates with topic-specific content
    return templates.map(template => 
      this.fillTemplate(template, category, topic)
    ).slice(0, Math.floor(targetLength / 12)); // ~12 seconds per segment
  }

  private fillTemplate(template: string, category: string, topic: string): string {
    const replacements: Record<string, string[]> = {
      year: ['1950', '1960', '1970', '1980'],
      subjects: ['unwilling participants', 'test subjects', 'vulnerable individuals', 'unsuspecting citizens'],
      methods: ['psychological manipulation', 'chemical compounds', 'behavioral conditioning', 'mind control techniques'],
      duration: ['50 years', '30 years', 'decades', '40 years'],
      consequences: ['permanent psychological damage', 'lasting trauma', 'severe health issues', 'memory loss'],
      timeframe: ['their entire lives', 'decades', 'years', 'permanently'],
      justification: ['national security', 'scientific progress', 'public safety', 'defense research'],
      industry: ['food industry', 'pharmaceutical companies', 'health organizations', 'government agencies'],
      truth: ['the dangers', 'the real effects', 'the harmful impact', 'the long-term consequences'],
      lie: ['safety claims', 'health benefits', 'positive effects', 'recommended guidelines'],
      amount: ['millions', 'billions', 'countless dollars', 'enormous sums'],
      finding: ['dangerous side effects', 'harmful consequences', 'negative results', 'concerning data'],
      shocking_statistic: ['opposite results', 'dangerous levels', 'alarming rates', 'shocking numbers'],
      number: ['millions', 'countless numbers', 'generations', 'entire populations']
    };

    let result = template;
    for (const [key, values] of Object.entries(replacements)) {
      const placeholder = `{${key}}`;
      if (result.includes(placeholder)) {
        const replacement = values[Math.floor(Math.random() * values.length)];
        result = result.replace(placeholder, replacement);
      }
    }

    return result;
  }

  generateContentSeries(category: string, episodeCount: number = 5): ContentStructure[] {
    const categoryData = this.authorityCategories[category];
    if (!categoryData) {
      throw new Error(`Category ${category} not supported`);
    }

    const series: ContentStructure[] = [];
    const topics = categoryData.topics.slice(0, episodeCount);

    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      const content = this.generateViralContent(category, topic);
      
      // Modify for series continuity
      if (i > 0) {
        content.hook.hook = `Part ${i + 1}: ${content.hook.hook}`;
      }
      
      if (i < topics.length - 1) {
        content.follow_up_tease = `Tomorrow: The shocking truth about ${topics[i + 1]}...`;
      }

      series.push(content);
    }

    return series;
  }

  getOptimalPostingStrategy(): {
    timing: string[];
    frequency: string;
    engagement_tactics: string[];
    growth_metrics: string[];
  } {
    return {
      timing: [
        "6-9 AM: Morning commute hook videos",
        "12-1 PM: Lunch break engagement content", 
        "7-9 PM: Peak evening viral content",
        "10-11 PM: Cliffhanger content for tomorrow"
      ],
      frequency: "2-3 posts daily for maximum algorithm favor",
      engagement_tactics: [
        "Respond to every comment within first hour",
        "Create response videos to top comments",
        "Use live streams to build deeper connection",
        "Cross-promote on other platforms",
        "Collaborate with similar truth-telling accounts"
      ],
      growth_metrics: [
        "Target 50+ comments per video",
        "Aim for 15%+ engagement rate",
        "Focus on shares over likes for viral growth",
        "Track follower velocity (followers per day)",
        "Monitor retention rate through full video"
      ]
    };
  }
}