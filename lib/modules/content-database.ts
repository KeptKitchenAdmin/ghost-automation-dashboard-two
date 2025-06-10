/**
 * Content Database with Tier Assignments
 * Multi-tier TikTok content strategy database with smart tier selection
 */

enum ContentTier {
  HEYGEN_HUMAN = "heygen_human",
  IMAGE_MONTAGE = "image_montage"
}

enum ContentPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low"
}

enum ContentCategory {
  SUPPRESSED_SCIENCE = "suppressed_science",
  GOVERNMENT_COVERUPS = "government_coverups",
  MEDICAL_ESTABLISHMENT = "medical_establishment",
  PSYCHOLOGICAL_MANIPULATION = "psychological_manipulation",
  PERSONAL_HEALTH = "personal_health",
  HISTORICAL_DOCUMENTS = "historical_documents",
  STATISTICAL_MANIPULATION = "statistical_manipulation",
  PROPAGANDA_TECHNIQUES = "propaganda_techniques"
}

export interface ContentTopic {
  id: string;
  title: string;
  category: ContentCategory;
  recommended_tier: ContentTier;
  priority: ContentPriority;
  hook: string;
  suppressed_fact: string;
  personal_impact: string;
  evidence: string;
  emotional_tone: string;
  target_emotions: string[];
  viral_potential: number; // 0-1 score
  controversy_level: string; // low, medium, high, very_high
  estimated_engagement: number;
  tags: string[];
  sources: string[];
  tier_reasoning: string;
}

interface TierAssignment {
  topic_id: string;
  assigned_tier: ContentTier;
  confidence_score: number;
  reasoning: string;
  factors: {
    authority_required: boolean;
    trust_factor_needed: boolean;
    visual_complexity: string;
    emotional_impact: string;
    viral_potential: number;
  };
}

export class ContentDatabase {
  private topics: ContentTopic[];
  private tierAssignments: Map<string, TierAssignment>;

  constructor() {
    this.topics = this.initializeTopics();
    this.tierAssignments = new Map();
    this.generateTierAssignments();
  }

  private initializeTopics(): ContentTopic[] {
    return [
      {
        id: "minnesota_experiment",
        title: "The Minnesota Starvation Experiment Proves Diets Are Torture",
        category: ContentCategory.SUPPRESSED_SCIENCE,
        recommended_tier: ContentTier.HEYGEN_HUMAN,
        priority: ContentPriority.HIGH,
        hook: "You were never meant to know this about hunger...",
        suppressed_fact: "The Minnesota Starvation Experiment documented that calorie restriction causes obsessive food thoughts, depression, and metabolic damage",
        personal_impact: "This explains why your hunger feels 'broken' and why 95% of diets fail",
        evidence: "University of Minnesota archives, Ancel Keys original research",
        emotional_tone: "validating",
        target_emotions: ["validation", "relief", "anger"],
        viral_potential: 0.85,
        controversy_level: "medium",
        estimated_engagement: 0.08,
        tags: ["#metabolism", "#dietculture", "#hunger", "#science"],
        sources: ["University of Minnesota", "Ancel Keys Research"],
        tier_reasoning: "Requires human authority to deliver scientific credibility"
      },
      
      {
        id: "mkultra_lsd",
        title: "MKUltra: Government Drugged Its Own Citizens",
        category: ContentCategory.GOVERNMENT_COVERUPS,
        recommended_tier: ContentTier.HEYGEN_HUMAN,
        priority: ContentPriority.HIGH,
        hook: "The government actually tested LSD on unknowing Americans...",
        suppressed_fact: "MKUltra program ran for 20+ years, drugging citizens including children in orphanages",
        personal_impact: "The mind control techniques developed are still used in modern advertising and propaganda",
        evidence: "Declassified CIA documents, Senate Church Committee reports",
        emotional_tone: "outraged",
        target_emotions: ["shock", "outrage", "awakening"],
        viral_potential: 0.95,
        controversy_level: "very_high",
        estimated_engagement: 0.12,
        tags: ["#mkultra", "#cia", "#mindcontrol", "#declassified"],
        sources: ["CIA FOIA Documents", "Church Committee"],
        tier_reasoning: "High-controversy government content requires human credibility"
      },

      {
        id: "bmi_astronomer",
        title: "BMI Was Created by an Astronomer, Not a Doctor",
        category: ContentCategory.MEDICAL_ESTABLISHMENT,
        recommended_tier: ContentTier.IMAGE_MONTAGE,
        priority: ContentPriority.MEDIUM,
        hook: "They never told you BMI was made up by someone who never studied bodies...",
        suppressed_fact: "Adolphe Quetelet was an astronomer who created BMI in 1830s for population averages, not individual health",
        personal_impact: "Insurance companies and doctors still use this 200-year-old population math to shame your body",
        evidence: "Historical BMI research, Quetelet's original papers",
        emotional_tone: "validating",
        target_emotions: ["validation", "relief", "anger"],
        viral_potential: 0.75,
        controversy_level: "medium",
        estimated_engagement: 0.06,
        tags: ["#bmi", "#bodypositivity", "#medicalgaslighting"],
        sources: ["Historical Research", "Quetelet Papers"],
        tier_reasoning: "Historical facts work well with visual storytelling"
      },

      {
        id: "operation_mockingbird",
        title: "Operation Mockingbird: CIA Bought the News",
        category: ContentCategory.PROPAGANDA_TECHNIQUES,
        recommended_tier: ContentTier.HEYGEN_HUMAN,
        priority: ContentPriority.HIGH,
        hook: "The news you watch was literally bought by the CIA...",
        suppressed_fact: "Operation Mockingbird placed CIA assets in major news organizations to control public opinion",
        personal_impact: "This explains why mainstream media all says the same thing and dissent gets labeled 'misinformation'",
        evidence: "Church Committee reports, Carl Bernstein investigation",
        emotional_tone: "conspiratorial",
        target_emotions: ["awakening", "distrust", "validation"],
        viral_potential: 0.90,
        controversy_level: "very_high",
        estimated_engagement: 0.10,
        tags: ["#mockingbird", "#cia", "#media", "#propaganda"],
        sources: ["Church Committee", "Bernstein Investigation"],
        tier_reasoning: "Controversial media claims need human authority"
      },

      {
        id: "sugar_industry_coverup",
        title: "Big Sugar Paid Scientists to Blame Fat",
        category: ContentCategory.STATISTICAL_MANIPULATION,
        recommended_tier: ContentTier.IMAGE_MONTAGE,
        priority: ContentPriority.MEDIUM,
        hook: "The sugar industry literally paid scientists to lie about what makes you fat...",
        suppressed_fact: "Sugar Research Foundation paid Harvard scientists to publish studies blaming heart disease on fat, not sugar",
        personal_impact: "This is why you've been told to eat low-fat foods packed with sugar for 60 years",
        evidence: "JAMA Internal Medicine, Sugar Industry documents",
        emotional_tone: "angry",
        target_emotions: ["betrayal", "anger", "vindication"],
        viral_potential: 0.80,
        controversy_level: "high",
        estimated_engagement: 0.07,
        tags: ["#sugar", "#industry", "#obesity", "#corruption"],
        sources: ["JAMA", "Industry Documents"],
        tier_reasoning: "Industry corruption stories work well with data visualization"
      }
    ];
  }

  private generateTierAssignments(): void {
    for (const topic of this.topics) {
      const assignment = this.calculateTierAssignment(topic);
      this.tierAssignments.set(topic.id, assignment);
    }
  }

  private calculateTierAssignment(topic: ContentTopic): TierAssignment {
    const factors = {
      authority_required: this.requiresAuthority(topic),
      trust_factor_needed: this.needsTrustFactor(topic),
      visual_complexity: this.assessVisualComplexity(topic),
      emotional_impact: this.assessEmotionalImpact(topic),
      viral_potential: topic.viral_potential
    };

    let score = 0;
    let reasoning = "";

    // Authority requirement (+30 points for HeyGen)
    if (factors.authority_required) {
      score += 30;
      reasoning += "Requires human authority figure. ";
    }

    // Trust factor (+25 points for HeyGen)
    if (factors.trust_factor_needed) {
      score += 25;
      reasoning += "High trust factor needed for controversial claims. ";
    }

    // High controversy (+20 points for HeyGen)
    if (topic.controversy_level === "very_high") {
      score += 20;
      reasoning += "Very high controversy needs human credibility. ";
    }

    // Government/medical topics (+15 points for HeyGen)
    if ([ContentCategory.GOVERNMENT_COVERUPS, ContentCategory.MEDICAL_ESTABLISHMENT].includes(topic.category)) {
      score += 15;
      reasoning += "Sensitive category benefits from human presenter. ";
    }

    // High viral potential (+10 points for HeyGen)
    if (topic.viral_potential > 0.85) {
      score += 10;
      reasoning += "High viral potential justifies premium tier. ";
    }

    const assignedTier = score >= 50 ? ContentTier.HEYGEN_HUMAN : ContentTier.IMAGE_MONTAGE;
    const confidence = Math.min(score / 100, 1.0);

    if (assignedTier === ContentTier.IMAGE_MONTAGE) {
      reasoning += "Good fit for visual storytelling and data presentation.";
    }

    return {
      topic_id: topic.id,
      assigned_tier: assignedTier,
      confidence_score: confidence,
      reasoning: reasoning.trim(),
      factors: factors
    };
  }

  private requiresAuthority(topic: ContentTopic): boolean {
    return [
      ContentCategory.SUPPRESSED_SCIENCE,
      ContentCategory.GOVERNMENT_COVERUPS,
      ContentCategory.MEDICAL_ESTABLISHMENT
    ].includes(topic.category);
  }

  private needsTrustFactor(topic: ContentTopic): boolean {
    return topic.controversy_level === "very_high" || 
           topic.category === ContentCategory.GOVERNMENT_COVERUPS;
  }

  private assessVisualComplexity(topic: ContentTopic): string {
    if (topic.category === ContentCategory.STATISTICAL_MANIPULATION) return "high";
    if (topic.category === ContentCategory.HISTORICAL_DOCUMENTS) return "medium";
    return "low";
  }

  private assessEmotionalImpact(topic: ContentTopic): string {
    if (topic.viral_potential > 0.85) return "high";
    if (topic.viral_potential > 0.70) return "medium";
    return "low";
  }

  getTopicsByTier(tier: ContentTier): ContentTopic[] {
    return this.topics.filter(topic => 
      this.tierAssignments.get(topic.id)?.assigned_tier === tier
    );
  }

  getTopicsByCategory(category: ContentCategory): ContentTopic[] {
    return this.topics.filter(topic => topic.category === category);
  }

  getHighPriorityTopics(): ContentTopic[] {
    return this.topics.filter(topic => topic.priority === ContentPriority.HIGH);
  }

  getTierAssignment(topicId: string): TierAssignment | undefined {
    return this.tierAssignments.get(topicId);
  }

  getRandomTopic(tier?: ContentTier, category?: ContentCategory): ContentTopic {
    let filteredTopics = [...this.topics];

    if (tier) {
      filteredTopics = filteredTopics.filter(topic => 
        this.tierAssignments.get(topic.id)?.assigned_tier === tier
      );
    }

    if (category) {
      filteredTopics = filteredTopics.filter(topic => topic.category === category);
    }

    if (filteredTopics.length === 0) {
      filteredTopics = this.topics;
    }

    return filteredTopics[Math.floor(Math.random() * filteredTopics.length)];
  }

  getTierDistribution(): Record<ContentTier, number> {
    const distribution: Record<ContentTier, number> = {
      [ContentTier.HEYGEN_HUMAN]: 0,
      [ContentTier.IMAGE_MONTAGE]: 0
    };

    for (const assignment of this.tierAssignments.values()) {
      distribution[assignment.assigned_tier]++;
    }

    return distribution;
  }

  getTopicMetrics(): {
    total_topics: number;
    avg_viral_potential: number;
    tier_distribution: Record<ContentTier, number>;
    category_breakdown: Record<ContentCategory, number>;
  } {
    const categoryBreakdown: Record<ContentCategory, number> = {} as Record<ContentCategory, number>;
    
    for (const category of Object.values(ContentCategory)) {
      categoryBreakdown[category] = 0;
    }

    for (const topic of this.topics) {
      categoryBreakdown[topic.category]++;
    }

    const avgViralPotential = this.topics.reduce((sum, topic) => sum + topic.viral_potential, 0) / this.topics.length;

    return {
      total_topics: this.topics.length,
      avg_viral_potential: avgViralPotential,
      tier_distribution: this.getTierDistribution(),
      category_breakdown: categoryBreakdown
    };
  }
}

export const contentDatabase = new ContentDatabase();