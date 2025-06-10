/**
 * TikTok Content Strategy Module - Pre-Monetization Phase
 * Manages controversial educational content library for viral growth to 1K followers
 */

enum ContentCategory {
  SUPPRESSED_SCIENCE = "suppressed_science",
  GOVERNMENT_COVERUPS = "government_coverups", 
  HEALTH_DISTORTIONS = "health_distortions",
  BEHAVIORAL_CONTROL = "behavioral_control",
  PROPAGANDA_TECHNIQUES = "propaganda_techniques",
  PSYOPS_EXPERIMENTS = "psyops_experiments"
}

enum ViralityScore {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  EXTREME = "extreme"
}

interface ContentTopic {
  id: string;
  title: string;
  category: ContentCategory;
  hook_line: string;
  key_fact: string;
  emotional_context: string;
  consequence: string;
  virality_score: ViralityScore;
  target_emotions: string[];
  engagement_triggers: string[];
  controversy_level: number; // 1-10 scale
  educational_value: number; // 1-10 scale
  sources: string[];
  hashtags: string[];
}

interface ContentCalendarItem {
  day: number;
  topic: ContentTopic;
  recommended_posting_time: string;
  expected_engagement: {
    estimated_views: number;
    estimated_likes: number;
    estimated_comments: number;
    estimated_shares: number;
  };
}

interface PerformanceAnalysis {
  topic: string;
  performance_score: number;
  exceeded_expectations: boolean;
  best_metric: string;
  optimization_suggestions: string[];
}

export class TikTokContentStrategy {
  private contentLibrary: ContentTopic[];
  private usedTopics: Set<string>;

  constructor() {
    this.contentLibrary = this.initializeContentLibrary();
    this.usedTopics = new Set<string>();
  }

  private initializeContentLibrary(): ContentTopic[] {
    return [
      // Suppressed Science
      {
        id: "minnesota_starvation",
        title: "The Minnesota Starvation Experiment: Hidden Truth About Restriction",
        category: ContentCategory.SUPPRESSED_SCIENCE,
        hook_line: "You were never meant to know this about starvation...",
        key_fact: "The Minnesota Starvation Experiment proved that calorie restriction causes obsessive food thoughts, depression, and metabolic damage",
        emotional_context: "They tested this on conscientious objectors during WWII and documented the psychological torture of restriction",
        consequence: "This explains why 95% of diets fail and why your hunger feels 'broken' - it's not you, it's designed restriction",
        virality_score: ViralityScore.HIGH,
        target_emotions: ["shock", "validation", "anger"],
        engagement_triggers: ["hidden_truth", "scientific_proof", "personal_validation"],
        controversy_level: 7,
        educational_value: 9,
        sources: ["University of Minnesota Archives", "Ancel Keys Research"],
        hashtags: ["#suppressed", "#dietculture", "#metabolism", "#truth", "#science"]
      },
      
      {
        id: "mkultra_lsd",
        title: "MKUltra: When Government Drugged Its Own Citizens",
        category: ContentCategory.GOVERNMENT_COVERUPS,
        hook_line: "The government actually tested LSD on its own citizens...",
        key_fact: "MKUltra program ran for 20+ years, drugging unknowing Americans including children in orphanages",
        emotional_context: "They wanted to create the perfect mind control drug and used American citizens as lab rats",
        consequence: "The techniques they developed are still used in modern psychological manipulation and advertising",
        virality_score: ViralityScore.EXTREME,
        target_emotions: ["outrage", "fear", "curiosity"],
        engagement_triggers: ["government_conspiracy", "mind_control", "hidden_history"],
        controversy_level: 9,
        educational_value: 8,
        sources: ["CIA FOIA Documents", "Senate Church Committee Report"],
        hashtags: ["#mkultra", "#cia", "#mindcontrol", "#truth", "#declassified"]
      },
      
      {
        id: "bmi_astronomer",
        title: "BMI Was Invented by an Astronomer, Not a Doctor",
        category: ContentCategory.HEALTH_DISTORTIONS,
        hook_line: "They never told you BMI was made up by someone who never studied bodies...",
        key_fact: "Adolphe Quetelet was an astronomer and mathematician who created BMI in the 1830s to study population averages, not individual health",
        emotional_context: "He literally said it shouldn't be used to determine if individuals are healthy",
        consequence: "Yet insurance companies and doctors still use this 200-year-old population math to shame your body",
        virality_score: ViralityScore.HIGH,
        target_emotions: ["validation", "anger", "relief"],
        engagement_triggers: ["body_shame", "medical_lies", "self_acceptance"],
        controversy_level: 6,
        educational_value: 8,
        sources: ["Historical BMI Research", "Quetelet Original Papers"],
        hashtags: ["#bmi", "#bodypositivity", "#medicalgaslighting", "#healthateverysize", "#truth"]
      },
      
      {
        id: "ancel_keys_seed_oils",
        title: "The Man Who Demonized Red Meat While Promoting Poison",
        category: ContentCategory.HEALTH_DISTORTIONS,
        hook_line: "One man changed what you think about food... and it was all wrong",
        key_fact: "Ancel Keys cherry-picked data from 7 countries while ignoring 15 others that contradicted his hypothesis about saturated fat",
        emotional_context: "Meanwhile, he helped promote seed oils that are literally industrial lubricants as 'heart healthy'",
        consequence: "This is why you've been told to avoid red meat while eating inflammatory oils that damage your cells",
        virality_score: ViralityScore.HIGH,
        target_emotions: ["betrayal", "anger", "vindication"],
        engagement_triggers: ["food_lies", "industry_corruption", "health_truth"],
        controversy_level: 8,
        educational_value: 9,
        sources: ["Seven Countries Study Critique", "Seed Oil Industry History"],
        hashtags: ["#seedoils", "#saturatedfat", "#nutritionlies", "#realfood", "#health"]
      },
      
      {
        id: "operation_mockingbird",
        title: "Operation Mockingbird: When CIA Bought the News",
        category: ContentCategory.PROPAGANDA_TECHNIQUES,
        hook_line: "The news you watch was literally bought by the CIA...",
        key_fact: "Operation Mockingbird placed CIA assets in major news organizations to control narratives and public opinion",
        emotional_context: "They didn't just influence foreign countries - they programmed American minds through trusted news sources",
        consequence: "This explains why mainstream media all says the same thing and real dissent gets labeled as 'misinformation'",
        virality_score: ViralityScore.EXTREME,
        target_emotions: ["distrust", "awakening", "validation"],
        engagement_triggers: ["media_control", "propaganda", "awakening"],
        controversy_level: 9,
        educational_value: 8,
        sources: ["Church Committee Reports", "Carl Bernstein Investigation"],
        hashtags: ["#mockingbird", "#cia", "#media", "#propaganda", "#truth"]
      },
      
      {
        id: "calories_lie",
        title: "Calories In, Calories Out: The Biggest Lie Ever Told",
        category: ContentCategory.HEALTH_DISTORTIONS,
        hook_line: "If you've ever felt like your hunger is broken... it's not. They just lied to you.",
        key_fact: "Calorie counting ignores hormones, insulin, leptin, ghrelin, and metabolic adaptation",
        emotional_context: "They simplified complex biochemistry into basic math to sell you diet products",
        consequence: "This is why you can eat 1200 calories and still gain weight while your friend eats 3000 and stays thin",
        virality_score: ViralityScore.HIGH,
        target_emotions: ["validation", "relief", "understanding"],
        engagement_triggers: ["weight_struggle", "metabolism", "body_trust"],
        controversy_level: 7,
        educational_value: 9,
        sources: ["Metabolic Research", "Hormone Studies"],
        hashtags: ["#calories", "#metabolism", "#hormones", "#dietculture", "#truth"]
      },
      
      {
        id: "stanford_prison",
        title: "The Stanford Prison Experiment: How Normal People Become Monsters",
        category: ContentCategory.BEHAVIORAL_CONTROL,
        hook_line: "They proved anyone can become evil... and it only takes 6 days",
        key_fact: "The Stanford Prison Experiment showed how quickly normal college students became abusive guards or broken prisoners",
        emotional_context: "It revealed how authority and environment can make good people do terrible things",
        consequence: "This explains how ordinary people participated in historical atrocities and modern workplace abuse",
        virality_score: ViralityScore.HIGH,
        target_emotions: ["fear", "self_reflection", "awareness"],
        engagement_triggers: ["human_nature", "authority", "psychology"],
        controversy_level: 8,
        educational_value: 9,
        sources: ["Philip Zimbardo Research", "Stanford Archives"],
        hashtags: ["#stanford", "#psychology", "#authority", "#humanature", "#experiment"]
      },
      
      {
        id: "fluoride_mind_control",
        title: "Fluoride: From Rat Poison to Your Water Supply",
        category: ContentCategory.SUPPRESSED_SCIENCE,
        hook_line: "They put rat poison in your water and called it dental care...",
        key_fact: "Sodium fluoride is literally the active ingredient in rat poison and was industrial waste before being added to water",
        emotional_context: "The Fluoride studies showing dental benefits were funded by the same companies dumping toxic waste",
        consequence: "Meanwhile, Harvard studies link fluoride to lowered IQ and docility - perfect for population control",
        virality_score: ViralityScore.EXTREME,
        target_emotions: ["shock", "fear", "awakening"],
        engagement_triggers: ["water_contamination", "population_control", "health_conspiracy"],
        controversy_level: 9,
        educational_value: 7,
        sources: ["Harvard Fluoride Studies", "Industrial Waste Documentation"],
        hashtags: ["#fluoride", "#water", "#poison", "#dental", "#truth"]
      },
      
      {
        id: "milgram_obedience",
        title: "The Milgram Experiment: Why You'd Torture Someone If Asked",
        category: ContentCategory.BEHAVIORAL_CONTROL,
        hook_line: "65% of people will torture someone to death if an authority figure tells them to...",
        key_fact: "The Milgram Obedience Experiment proved most people will inflict lethal electric shocks when instructed by authority",
        emotional_context: "Participants believed they were killing someone but continued because a man in a lab coat said to",
        consequence: "This explains how ordinary people become complicit in systemic oppression and follow harmful orders",
        virality_score: ViralityScore.HIGH,
        target_emotions: ["fear", "self_examination", "awareness"],
        engagement_triggers: ["obedience", "authority", "moral_courage"],
        controversy_level: 8,
        educational_value: 9,
        sources: ["Stanley Milgram Research", "Yale University Archives"],
        hashtags: ["#milgram", "#obedience", "#authority", "#psychology", "#compliance"]
      },
      
      {
        id: "sugar_industry_coverup",
        title: "Big Sugar Paid Scientists to Blame Fat Instead",
        category: ContentCategory.HEALTH_DISTORTIONS,
        hook_line: "The sugar industry literally paid scientists to lie about what makes you fat...",
        key_fact: "In the 1960s, the Sugar Research Foundation paid Harvard scientists to publish studies blaming heart disease on fat, not sugar",
        emotional_context: "They buried their own research showing sugar causes heart disease and obesity",
        consequence: "This is why you've been told to eat low-fat foods packed with sugar for 60 years",
        virality_score: ViralityScore.HIGH,
        target_emotions: ["betrayal", "anger", "vindication"],
        engagement_triggers: ["industry_lies", "sugar_addiction", "health_corruption"],
        controversy_level: 8,
        educational_value: 9,
        sources: ["JAMA Internal Medicine", "Sugar Industry Documents"],
        hashtags: ["#sugar", "#industry", "#obesity", "#heartdisease", "#corruption"]
      }
    ];
  }

  getContentTopic(
    category?: ContentCategory,
    minVirality?: ViralityScore,
    avoidUsed: boolean = true
  ): ContentTopic {
    let availableTopics = [...this.contentLibrary];
    
    // Filter by category if specified
    if (category) {
      availableTopics = availableTopics.filter(t => t.category === category);
    }
    
    // Filter by virality score
    if (minVirality) {
      const viralityOrder = [ViralityScore.LOW, ViralityScore.MEDIUM, ViralityScore.HIGH, ViralityScore.EXTREME];
      const minIndex = viralityOrder.indexOf(minVirality);
      availableTopics = availableTopics.filter(t => viralityOrder.indexOf(t.virality_score) >= minIndex);
    }
    
    // Avoid recently used topics
    if (avoidUsed) {
      availableTopics = availableTopics.filter(t => !this.usedTopics.has(t.id));
    }
    
    if (availableTopics.length === 0) {
      // Reset used topics if we've exhausted all options
      this.usedTopics.clear();
      availableTopics = [...this.contentLibrary];
    }
    
    // Select topic based on weighted virality score
    const topic = this.weightedRandomSelection(availableTopics);
    this.usedTopics.add(topic.id);
    
    console.log(`Selected content topic: ${topic.title} (virality: ${topic.virality_score})`);
    return topic;
  }

  private weightedRandomSelection(topics: ContentTopic[]): ContentTopic {
    const weights: Record<ViralityScore, number> = {
      [ViralityScore.LOW]: 1,
      [ViralityScore.MEDIUM]: 2,
      [ViralityScore.HIGH]: 4,
      [ViralityScore.EXTREME]: 8
    };
    
    const weightedTopics: ContentTopic[] = [];
    for (const topic of topics) {
      const weight = weights[topic.virality_score];
      for (let i = 0; i < weight; i++) {
        weightedTopics.push(topic);
      }
    }
    
    return weightedTopics[Math.floor(Math.random() * weightedTopics.length)];
  }

  getContentCalendar(days: number = 7): ContentCalendarItem[] {
    const calendar: ContentCalendarItem[] = [];
    
    for (let day = 0; day < days; day++) {
      let topic: ContentTopic;
      
      // Vary content categories and virality for engagement
      if (day % 3 === 0) {
        // High virality controversial topics
        topic = this.getContentTopic(undefined, ViralityScore.HIGH);
      } else if (day % 3 === 1) {
        // Government/conspiracy topics
        const categories = [ContentCategory.GOVERNMENT_COVERUPS, ContentCategory.PSYOPS_EXPERIMENTS];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        topic = this.getContentTopic(randomCategory);
      } else {
        // Health distortion topics
        topic = this.getContentTopic(ContentCategory.HEALTH_DISTORTIONS);
      }
      
      calendar.push({
        day: day + 1,
        topic: topic,
        recommended_posting_time: "6:00 PM", // Peak TikTok engagement
        expected_engagement: this.estimateEngagement(topic)
      });
    }
    
    return calendar;
  }

  private estimateEngagement(topic: ContentTopic): {
    estimated_views: number;
    estimated_likes: number;
    estimated_comments: number;
    estimated_shares: number;
  } {
    const baseMultipliers: Record<ViralityScore, number> = {
      [ViralityScore.LOW]: 1,
      [ViralityScore.MEDIUM]: 2.5,
      [ViralityScore.HIGH]: 5,
      [ViralityScore.EXTREME]: 10
    };
    
    const multiplier = baseMultipliers[topic.virality_score];
    const controversyBoost = topic.controversy_level * 0.1;
    
    return {
      estimated_views: Math.round(1000 * multiplier * (1 + controversyBoost)),
      estimated_likes: Math.round(100 * multiplier * (1 + controversyBoost)),
      estimated_comments: Math.round(20 * multiplier * (1 + controversyBoost)),
      estimated_shares: Math.round(10 * multiplier * (1 + controversyBoost))
    };
  }

  getTrendingHookPatterns(): string[] {
    return [
      "You were never meant to know this...",
      "They deleted this from your history books...",
      "This 'scientific' rule was made up by...",
      "If you've ever felt like [problem], it's not you...",
      "The [authority] actually [shocking action]...",
      "One [person] changed [thing] and it was all wrong...",
      "They want you [doing thing] but here's what they don't tell you...",
      "[Number]% of people will [shocking behavior] if...",
      "They put [harmful thing] in your [everyday item]...",
      "The [industry] literally paid scientists to lie about..."
    ];
  }

  analyzeContentPerformance(topicId: string, metrics: Record<string, number>): PerformanceAnalysis | { error: string } {
    const topic = this.contentLibrary.find(t => t.id === topicId);
    if (!topic) {
      return { error: "Topic not found" };
    }
    
    const expected = this.estimateEngagement(topic);
    
    const performanceRatio = {
      views: (metrics.views || 0) / expected.estimated_views,
      likes: (metrics.likes || 0) / expected.estimated_likes,
      comments: (metrics.comments || 0) / expected.estimated_comments,
      shares: (metrics.shares || 0) / expected.estimated_shares
    };
    
    const avgPerformance = Object.values(performanceRatio).reduce((a, b) => a + b, 0) / Object.values(performanceRatio).length;
    const bestMetric = Object.keys(performanceRatio).reduce((a, b) => 
      performanceRatio[a as keyof typeof performanceRatio] > performanceRatio[b as keyof typeof performanceRatio] ? a : b
    );
    
    return {
      topic: topic.title,
      performance_score: avgPerformance,
      exceeded_expectations: avgPerformance > 1.0,
      best_metric: bestMetric,
      optimization_suggestions: this.generateOptimizationSuggestions(topic, performanceRatio)
    };
  }

  private generateOptimizationSuggestions(topic: ContentTopic, performance: Record<string, number>): string[] {
    const suggestions: string[] = [];
    
    if (performance.views < 0.5) {
      suggestions.push("Try stronger hook lines or trending audio");
    }
    
    if (performance.comments > 2.0) {
      suggestions.push("High engagement topic - create follow-up content");
    }
    
    if (performance.shares > 1.5) {
      suggestions.push("Viral potential - amplify similar controversial angles");
    }
    
    return suggestions;
  }
}

export const tikTokContentStrategy = new TikTokContentStrategy();