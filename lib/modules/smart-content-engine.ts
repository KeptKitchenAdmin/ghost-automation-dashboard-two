/**
 * Smart Content Selection Engine
 * Data-driven content generation machine that analyzes GhostMoss data
 * and intelligently selects optimal content for HeyGen vs Image Montage
 */

enum ContentPriority {
  URGENT = "urgent",        // >90% viral potential, trending now
  HIGH = "high",           // 80-90% viral potential  
  MEDIUM = "medium",       // 70-80% viral potential
  LOW = "low"             // <70% viral potential
}

enum ContentTier {
  HEYGEN_HUMAN = "heygen_human",
  IMAGE_MONTAGE = "image_montage"
}

enum VideoPlatform {
  HEYGEN = "heygen",
  ARCADS = "arcads",
  AUTO = "auto"
}

enum ContentStrategy {
  VIRAL_ENGAGEMENT = "viral_engagement",
  MARKETING_CONVERSION = "marketing_conversion",
  AUTHORITY_BUILDING = "authority_building",
  DIVERSIFIED = "diversified"
}

interface ProductAnalysis {
  product_id: string;
  product_name: string;
  viral_potential: number;
  revenue_potential: number;
  competition_level: number;
  trend_velocity: string;
  target_audience: string;
  commission_rate: number;
  price: number;
  profit_per_sale: number;
  content_angles: string[];
  content_priority: ContentPriority;
  recommended_tier: ContentTier;
}

interface ContentRecommendation {
  content_id: string;
  content_type: string; // "product_review", "suppressed_science", "lifestyle_hack"
  recommended_tier: ContentTier;
  priority: ContentPriority;
  data_source: string; // "ghostmoss_product", "content_database", "trend_analysis"
  
  // Data backing the recommendation
  viral_score: number;
  revenue_potential: number;
  engagement_prediction: number;
  
  // Content specifics
  title: string;
  hook: string;
  script_outline: string[];
  target_audience: string;
  hashtags: string[];
  
  // Production details
  estimated_production_cost: number;
  expected_roi: number;
  optimal_posting_times: string[];
}

interface VideoGenerationRequest {
  content_id: string;
  content_type: string;
  title: string;
  script_data: {
    content_type: string;
    topic: string;
    hook: string;
    script_outline: string[];
    target_audience: string;
    hashtags: string[];
    product_name?: string;
    personal_result?: string;
  };
  preferred_platform: VideoPlatform;
  strategy: ContentStrategy;
  variations_requested: number;
  trust_factor_required: number;
  revenue_potential: number;
  target_audience: string;
  urgency: ContentPriority;
}

interface VideoGenerationResponse {
  request_id: string;
  platform_used: VideoPlatform;
  videos: any[];
  estimated_completion_time: string;
  strategy_explanation: string;
}

interface ContentGenerationResults {
  total_content_pieces: number;
  total_videos_generated: number;
  platform_breakdown: Record<string, {
    content_count: number;
    video_count: number;
    content_types: string[];
  }>;
  content_pipeline: Array<{
    content_id: string;
    platform: string;
    videos_generated: number;
    status: string;
    estimated_completion: string;
    strategy_explanation: string;
  }>;
  estimated_completion: string;
  strategy_summary: string[];
}

interface ContentTopic {
  id: string;
  title: string;
  hook: string;
  viral_potential: number;
  estimated_engagement: number;
  tags: string[];
}

interface ContentQueueStats {
  total_pending: number;
  estimated_completion_time: string;
  monthly_revenue_potential: number;
}

interface ContentQueue {
  heygen_queue: any[];
  montage_queue: any[];
  ready_to_post: any[];
  tier_budget: {
    heygen_monthly_limit: number;
    heygen_used_this_month: number;
    target_heygen_ratio: number;
  };
  queue_stats: ContentQueueStats;
}

export class SmartContentEngine {
  private tierBudget = {
    heygen_monthly_limit: 10,
    heygen_used_this_month: 0,
    target_heygen_ratio: 0.25
  };

  private platformStrategy = {
    heygen_content_types: ["suppressed_science", "medical_revelations", "government_experiments"],
    arcads_content_types: ["product_review", "lifestyle_hack", "trend_analysis"],
    auto_variation_rules: {
      product_review: 3,  // 3 variations for product content
      lifestyle_hack: 2,  // 2 variations for lifestyle content
      suppressed_science: 1,  // 1 authoritative video for science content
      trend_analysis: 2   // 2 variations for trend content
    }
  };

  private scoringWeights = {
    viral_potential: 0.35,      // How likely to go viral
    revenue_potential: 0.30,    // Expected revenue
    production_efficiency: 0.20, // Cost/time to produce
    strategic_value: 0.15       // Long-term brand building
  };

  private contentTypes = {
    product_review: {
      tier_preference: ContentTier.HEYGEN_HUMAN,  // Trust factor important
      viral_modifier: 1.2,
      revenue_potential: "high",
      production_cost: "medium"
    },
    suppressed_science: {
      tier_preference: ContentTier.HEYGEN_HUMAN,  // Authority required
      viral_modifier: 1.5,
      revenue_potential: "medium", 
      production_cost: "medium"
    },
    lifestyle_hack: {
      tier_preference: ContentTier.IMAGE_MONTAGE, // High volume ok
      viral_modifier: 1.1,
      revenue_potential: "medium",
      production_cost: "low"
    },
    trend_analysis: {
      tier_preference: ContentTier.IMAGE_MONTAGE, // Data-heavy
      viral_modifier: 1.3,
      revenue_potential: "low",
      production_cost: "low"
    }
  };

  async analyzeGhostmossProducts(products: Array<Record<string, any>>): Promise<ProductAnalysis[]> {
    const analyses: ProductAnalysis[] = [];
    
    for (const product of products) {
      try {
        const analysis = await this.analyzeSingleProduct(product);
        analyses.push(analysis);
      } catch (error) {
        console.error(`Failed to analyze product ${product?.id || 'unknown'}:`, error);
      }
    }
    
    // Sort by content generation potential
    analyses.sort((a, b) => (b.viral_potential * b.revenue_potential) - (a.viral_potential * a.revenue_potential));
    
    console.log(`Analyzed ${analyses.length} products for content potential`);
    return analyses;
  }

  private async analyzeSingleProduct(product: Record<string, any>): Promise<ProductAnalysis> {
    // Extract product metrics
    const viralPotential = Number(product.viralPotential || 0);
    const commissionRate = Number(product.commission || 0);
    const price = Number(product.price || 0);
    const rating = Number(product.rating || 0);
    
    // Calculate derived metrics
    const profitPerSale = price * (commissionRate / 100);
    const revenuePotential = profitPerSale * Number(product.sales || 0) / 30; // Monthly estimate
    
    // Analyze content angles
    const contentAngles = await this.generateContentAngles(product);
    
    // Determine priority
    const priority = this.calculateContentPriority(viralPotential, revenuePotential, rating);
    
    // Recommend tier
    const recommendedTier = this.recommendContentTier(product, priority);
    
    return {
      product_id: product.id || '',
      product_name: product.name || '',
      viral_potential: viralPotential,
      revenue_potential: revenuePotential,
      competition_level: Number(product.aiInsights?.competitorCount || 0),
      trend_velocity: product.trendVelocity || 'Low',
      target_audience: product.aiInsights?.targetAudience || '',
      commission_rate: commissionRate,
      price: price,
      profit_per_sale: profitPerSale,
      content_angles: contentAngles,
      content_priority: priority,
      recommended_tier: recommendedTier
    };
  }

  private async generateContentAngles(product: Record<string, any>): Promise<string[]> {
    const name = product.name || '';
    const category = product.category || '';
    const rating = Number(product.rating || 0);
    
    const angles: string[] = [];
    
    // High-rating angle
    if (rating >= 4.5) {
      angles.push(`Why ${name} has ${rating} stars (honest review)`);
    }
    
    // Problem-solution angle
    angles.push(`This ${category} product solves a problem you didn't know you had`);
    
    // Trend angle
    angles.push(`Everyone's talking about ${name} - here's why`);
    
    // Before/after angle
    angles.push(`My life before vs after using ${name}`);
    
    // Value angle
    angles.push(`Expensive vs cheap ${category} - ${name} is the sweet spot`);
    
    return angles.slice(0, 3); // Top 3 angles
  }

  private calculateContentPriority(viralPotential: number, revenuePotential: number, rating: number): ContentPriority {
    // Weighted priority score
    const score = (
      viralPotential * 0.4 +
      Math.min(revenuePotential * 2, 100) * 0.4 +  // Cap revenue influence
      rating * 20 * 0.2  // Convert 5-star to 100 scale
    );
    
    if (score >= 90) {
      return ContentPriority.URGENT;
    } else if (score >= 80) {
      return ContentPriority.HIGH;
    } else if (score >= 70) {
      return ContentPriority.MEDIUM;
    } else {
      return ContentPriority.LOW;
    }
  }

  private recommendContentTier(product: Record<string, any>, priority: ContentPriority): ContentTier {
    const category = (product.category || '').toLowerCase();
    const viralPotential = Number(product.viralPotential || 0);
    
    // High-trust categories prefer human avatars
    const trustCategories = ['health', 'beauty', 'tech'];
    
    // Check HeyGen budget
    const heygenAvailable = this.tierBudget.heygen_used_this_month < this.tierBudget.heygen_monthly_limit;
    
    // Decision logic
    if (!heygenAvailable) {
      return ContentTier.IMAGE_MONTAGE;
    }
    
    // Urgent/High priority + trust category = HeyGen
    if ([ContentPriority.URGENT, ContentPriority.HIGH].includes(priority)) {
      if (trustCategories.includes(category) || viralPotential >= 85) {
        return ContentTier.HEYGEN_HUMAN;
      }
    }
    
    // Default to image montage for volume
    return ContentTier.IMAGE_MONTAGE;
  }

  async generateContentRecommendations(maxRecommendations: number = 10): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    // 1. Get product recommendations from GhostMoss data
    const productRecs = await this.getProductContentRecommendations();
    recommendations.push(...productRecs.slice(0, 6)); // Top 6 product-based content
    
    // 2. Get suppressed science content from database
    const scienceRecs = await this.getSuppressedScienceRecommendations();
    recommendations.push(...scienceRecs.slice(0, 3)); // Top 3 authority-building content
    
    // 3. Get trending topic content
    const trendRecs = await this.getTrendingContentRecommendations();
    recommendations.push(...trendRecs.slice(0, 1)); // Top 1 trending topic
    
    // Sort by expected ROI and viral potential
    recommendations.sort((a, b) => (b.viral_score * b.expected_roi) - (a.viral_score * a.expected_roi));
    
    return recommendations.slice(0, maxRecommendations);
  }

  async generateMultiPlatformContent(recommendations: ContentRecommendation[]): Promise<ContentGenerationResults> {
    try {
      // Convert recommendations to video generation requests
      const videoRequests: VideoGenerationRequest[] = [];
      
      for (const rec of recommendations) {
        // Determine optimal platform and strategy
        const preferredPlatform = this.determineOptimalPlatform(rec);
        const strategy = this.determineContentStrategy(rec);
        const variations = this.platformStrategy.auto_variation_rules[rec.content_type as keyof typeof this.platformStrategy.auto_variation_rules] || 1;
        
        // Create video generation request
        const request: VideoGenerationRequest = {
          content_id: rec.content_id,
          content_type: rec.content_type,
          title: rec.title,
          script_data: {
            content_type: rec.content_type,
            topic: rec.title,
            hook: rec.hook,
            script_outline: rec.script_outline,
            target_audience: rec.target_audience,
            hashtags: rec.hashtags,
            product_name: rec.content_type === "product_review" ? rec.title : undefined,
            personal_result: rec.content_type === "product_review" ? "amazing results" : undefined
          },
          preferred_platform: preferredPlatform,
          strategy: strategy,
          variations_requested: variations,
          trust_factor_required: this.calculateTrustFactor(rec),
          revenue_potential: rec.revenue_potential,
          target_audience: rec.target_audience,
          urgency: rec.priority
        };
        
        videoRequests.push(request);
      }
      
      // Simulate video generation responses
      const videoResponses: VideoGenerationResponse[] = videoRequests.map(req => ({
        request_id: req.content_id,
        platform_used: req.preferred_platform,
        videos: Array(req.variations_requested).fill(null).map((_, i) => ({ id: `${req.content_id}_${i}` })),
        estimated_completion_time: "2-5 minutes",
        strategy_explanation: `Using ${req.preferred_platform} for ${req.content_type} with ${req.strategy} strategy`
      }));
      
      // Process results
      const generationResults: ContentGenerationResults = {
        total_content_pieces: recommendations.length,
        total_videos_generated: videoResponses.reduce((sum, resp) => sum + resp.videos.length, 0),
        platform_breakdown: {},
        content_pipeline: [],
        estimated_completion: "2-5 minutes per video",
        strategy_summary: []
      };
      
      // Organize results by platform
      for (const response of videoResponses) {
        const platform = response.platform_used;
        if (!generationResults.platform_breakdown[platform]) {
          generationResults.platform_breakdown[platform] = {
            content_count: 0,
            video_count: 0,
            content_types: []
          };
        }
        
        generationResults.platform_breakdown[platform].content_count += 1;
        generationResults.platform_breakdown[platform].video_count += response.videos.length;
        
        // Find matching recommendation
        const matchingRec = recommendations.find(r => r.content_id === response.request_id);
        if (matchingRec) {
          generationResults.platform_breakdown[platform].content_types.push(matchingRec.content_type);
        }
        
        // Add to content pipeline
        const pipelineItem = {
          content_id: response.request_id,
          platform: platform,
          videos_generated: response.videos.length,
          status: "generating",
          estimated_completion: response.estimated_completion_time,
          strategy_explanation: response.strategy_explanation
        };
        generationResults.content_pipeline.push(pipelineItem);
        generationResults.strategy_summary.push(response.strategy_explanation);
      }
      
      console.log(`Multi-platform generation completed: ${generationResults.total_videos_generated} videos across ${Object.keys(generationResults.platform_breakdown).length} platforms`);
      return generationResults;
      
    } catch (error) {
      console.error(`Multi-platform content generation failed:`, error);
      throw error;
    }
  }

  private determineOptimalPlatform(recommendation: ContentRecommendation): VideoPlatform {
    if (this.platformStrategy.heygen_content_types.includes(recommendation.content_type)) {
      return VideoPlatform.HEYGEN;
    } else if (this.platformStrategy.arcads_content_types.includes(recommendation.content_type)) {
      return VideoPlatform.ARCADS;
    } else {
      return VideoPlatform.AUTO; // Let the router decide
    }
  }

  private determineContentStrategy(recommendation: ContentRecommendation): ContentStrategy {
    if (recommendation.content_type === "suppressed_science") {
      return ContentStrategy.AUTHORITY_BUILDING;
    } else if (recommendation.revenue_potential > 100) {
      return ContentStrategy.MARKETING_CONVERSION;
    } else if (recommendation.viral_score > 85) {
      return ContentStrategy.VIRAL_ENGAGEMENT;
    } else {
      return ContentStrategy.DIVERSIFIED;
    }
  }

  private calculateTrustFactor(recommendation: ContentRecommendation): number {
    if (recommendation.content_type === "suppressed_science") {
      return 0.9; // High trust required
    } else if (recommendation.content_type === "product_review" && recommendation.revenue_potential > 200) {
      return 0.7; // Medium-high trust for expensive products
    } else if (recommendation.content_type === "product_review") {
      return 0.5; // Medium trust for regular products
    } else {
      return 0.3; // Lower trust for lifestyle/trend content
    }
  }

  private async getProductContentRecommendations(): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    // Simulate high-value product data
    const highValueProducts = [
      {
        id: "gm_001",
        name: "LED Face Mask Pro",
        category: "Beauty",
        viral_potential: 92,
        revenue_potential: 280,  // Monthly
        commission_rate: 28,
        price: 39.99,
        target_audience: "Women 18-35, skincare enthusiasts"
      },
      {
        id: "gm_002", 
        name: "Smart Water Bottle",
        category: "Tech",
        viral_potential: 88,
        revenue_potential: 150,
        commission_rate: 22,
        price: 29.99,
        target_audience: "Health-conscious 20-40, tech lovers"
      }
    ];
    
    for (const product of highValueProducts) {
      const rec: ContentRecommendation = {
        content_id: `product_${product.id}`,
        content_type: "product_review",
        recommended_tier: ContentTier.HEYGEN_HUMAN,
        priority: ContentPriority.HIGH,
        data_source: "ghostmoss_product",
        viral_score: product.viral_potential,
        revenue_potential: product.revenue_potential,
        engagement_prediction: 85.0,
        title: `Honest Review: ${product.name} (Is it worth the hype?)`,
        hook: `I tested the viral ${product.name} for 30 days - here's what happened`,
        script_outline: [
          "Hook: Personal testing experience",
          "Problem: Common issue this solves", 
          "Demo: Show product in action",
          "Results: Before/after or benefits",
          "CTA: Link in bio for discount"
        ],
        target_audience: product.target_audience,
        hashtags: ["#tiktokshop", "#viral", `#${product.category.toLowerCase()}`, "#honestreviews", "#fyp"],
        estimated_production_cost: 0.0,  // HeyGen credit cost
        expected_roi: product.revenue_potential * 0.3,  // 30% of monthly potential
        optimal_posting_times: ["7-9 AM EST", "6-8 PM EST"]
      };
      recommendations.push(rec);
    }
    
    return recommendations;
  }

  private async getSuppressedScienceRecommendations(): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    // Simulate high-priority topics from content database
    const topics: ContentTopic[] = [
      {
        id: "sci_001",
        title: "The Hidden Health Benefits They Don't Want You to Know",
        hook: "Doctors hate this one simple trick that's been suppressed for decades",
        viral_potential: 0.88,
        estimated_engagement: 0.82,
        tags: ["#health", "#medical", "#suppressed"]
      }
    ];
    
    for (const topic of topics) {
      const rec: ContentRecommendation = {
        content_id: `science_${topic.id}`,
        content_type: "suppressed_science",
        recommended_tier: ContentTier.HEYGEN_HUMAN,
        priority: ContentPriority.HIGH,
        data_source: "content_database",
        viral_score: topic.viral_potential * 100,
        revenue_potential: 0.0,  // Authority building, not direct revenue
        engagement_prediction: topic.estimated_engagement * 100,
        title: topic.title,
        hook: topic.hook,
        script_outline: [
          "Hook: Grab attention with shocking fact",
          "Revelation: Share the suppressed information",
          "Evidence: Reference sources/documents", 
          "Personal Impact: Why this matters to viewer",
          "CTA: Follow for more suppressed truths"
        ],
        target_audience: "Truth-seekers, conspiracy theorists, health-conscious",
        hashtags: [...topic.tags, "#suppressed", "#truth", "#mindblown"],
        estimated_production_cost: 0.0,
        expected_roi: 50.0,  // Authority building value
        optimal_posting_times: ["8-10 PM EST", "6-8 AM EST"]
      };
      recommendations.push(rec);
    }
    
    return recommendations;
  }

  private async getTrendingContentRecommendations(): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    // This would integrate with trend analysis APIs
    // For now, creating strategic trending content
    
    const trendingRec: ContentRecommendation = {
      content_id: "trend_001",
      content_type: "trend_analysis", 
      recommended_tier: ContentTier.IMAGE_MONTAGE,
      priority: ContentPriority.MEDIUM,
      data_source: "trend_analysis",
      viral_score: 75.0,
      revenue_potential: 0.0,
      engagement_prediction: 70.0,
      title: "Why everyone's obsessed with this TikTok trend",
      hook: "This trend is everywhere but here's what they're not telling you",
      script_outline: [
        "Hook: Trend observation",
        "Analysis: What's really happening",
        "Data: Show the numbers/proof",
        "Implications: Why this matters",
        "CTA: What do you think?"
      ],
      target_audience: "TikTok trend followers 16-30",
      hashtags: ["#trending", "#viral", "#analysis", "#tiktoktok", "#fyp"],
      estimated_production_cost: 0.0,
      expected_roi: 25.0,
      optimal_posting_times: ["5-7 PM EST", "9-11 PM EST"]
    };
    
    recommendations.push(trendingRec);
    return recommendations;
  }

  getContentGenerationQueue(): ContentQueue {
    return {
      heygen_queue: [],      // Content waiting for HeyGen generation
      montage_queue: [],     // Content waiting for image montage
      ready_to_post: [],     // Generated content ready for posting
      tier_budget: this.tierBudget,
      queue_stats: {
        total_pending: 0,
        estimated_completion_time: "2-4 hours",
        monthly_revenue_potential: 0
      }
    };
  }
}

export const smartContentEngine = new SmartContentEngine();