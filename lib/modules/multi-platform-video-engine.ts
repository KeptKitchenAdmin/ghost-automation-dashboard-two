/**
 * Multi-Platform Video Generation Engine
 * Intelligent router between HeyGen and Arcads based on content strategy
 */

import { HeyGenIntegration, HeyGenVideoResponse } from './heygen-integration';
import { ArcadsIntegration, ArcadsVideoResponse } from './arcads-integration';
import { SupplementVideoGenerator, SupplementVideoResponse } from './supplement-video-generator';

export enum VideoPlatform {
  HEYGEN = "heygen",
  ARCADS = "arcads",
  SUPPLEMENT_VIRAL = "supplement_viral",  // High-converting supplement videos
  AUTO = "auto"  // Let engine decide
}

export enum ContentStrategy {
  AUTHORITY_BUILDING = "authority",  // Serious, trust-based content
  MARKETING_CONVERSION = "marketing",  // Product-focused, conversion-driven
  VIRAL_ENGAGEMENT = "viral",  // High-engagement, shareable content
  SUPPLEMENT_VIRAL = "supplement_viral",  // High-converting supplement content ($10k-$60k potential)
  DIVERSIFIED = "diversified"  // Mix of platforms for variety
}

export interface VideoGenerationRequest {
  content_id: string;
  content_type: string;  // "product_review", "suppressed_science", "lifestyle_hack", "trend_analysis"
  title: string;
  script_data: Record<string, any>;
  
  // Strategy settings
  preferred_platform?: VideoPlatform;
  strategy?: ContentStrategy;
  variations_requested?: number;
  
  // Content specifics
  trust_factor_required?: number;  // 0-1, higher = more authority needed
  revenue_potential?: number;
  target_audience?: string;
  urgency?: string;  // "urgent", "high", "medium", "low"
}

export interface VideoGenerationResponse {
  request_id: string;
  platform_used: VideoPlatform;
  videos: Array<HeyGenVideoResponse | ArcadsVideoResponse | SupplementVideoResponse>;
  strategy_explanation: string;
  estimated_completion_time: string;
  cost_breakdown: Record<string, any>;
}

interface PlatformProfile {
  strengths: string[];
  weaknesses: string[];
  optimal_content: string[];
  trust_threshold: number;
  generation_time: string;
  monthly_limit: number;
  cost_per_video: number;
  revenue_potential?: string;
}

interface UsageStats {
  used: number;
  limit: number;
}

interface MonthlyStrategy {
  heygen_percentage: number;
  arcads_percentage: number;
  supplement_percentage: number;
  variation_target: number;
  authority_priority: boolean;
  revenue_priority: boolean;
}

export class PlatformRouter {
  public platform_profiles: Record<VideoPlatform, PlatformProfile>;
  public usage_stats: Record<VideoPlatform, UsageStats>;
  public monthly_strategy: MonthlyStrategy;

  constructor() {
    // Platform strengths and weaknesses
    this.platform_profiles = {
      [VideoPlatform.HEYGEN]: {
        strengths: ["authority", "trust", "serious_content", "credibility"],
        weaknesses: ["cost", "slower_generation", "monthly_limits"],
        optimal_content: ["suppressed_science", "medical_revelations", "government_coverups"],
        trust_threshold: 0.7,
        generation_time: "3-5 minutes",
        monthly_limit: 10,
        cost_per_video: 0.0
      },
      [VideoPlatform.ARCADS]: {
        strengths: ["ugc_style", "variations", "marketing", "speed", "diversity"],
        weaknesses: ["less_authority", "commercial_feel"],
        optimal_content: ["product_review", "lifestyle_hack", "trend_analysis"],
        trust_threshold: 0.5,
        generation_time: "2-3 minutes",
        monthly_limit: 100,
        cost_per_video: 0.0
      },
      [VideoPlatform.SUPPLEMENT_VIRAL]: {
        strengths: ["highest_revenue", "proven_conversion", "emotional_targeting", "american_pain_points"],
        weaknesses: ["supplement_specific", "higher_production_cost"],
        optimal_content: ["supplement_viral", "health_products", "pain_point_targeting"],
        trust_threshold: 0.8,
        generation_time: "3-5 minutes",
        monthly_limit: 50,
        cost_per_video: 5.0,
        revenue_potential: "10k_to_60k_per_viral_video"
      },
      [VideoPlatform.AUTO]: {
        strengths: [],
        weaknesses: [],
        optimal_content: [],
        trust_threshold: 0.5,
        generation_time: "",
        monthly_limit: 0,
        cost_per_video: 0.0
      }
    };

    // Current month usage tracking
    this.usage_stats = {
      [VideoPlatform.HEYGEN]: { used: 0, limit: 10 },
      [VideoPlatform.ARCADS]: { used: 0, limit: 100 },
      [VideoPlatform.SUPPLEMENT_VIRAL]: { used: 0, limit: 50 },
      [VideoPlatform.AUTO]: { used: 0, limit: 0 }
    };

    // Strategic content distribution (monthly targets)
    this.monthly_strategy = {
      heygen_percentage: 0.20,  // 20% high-authority content
      arcads_percentage: 0.60,  // 60% marketing/ugc content
      supplement_percentage: 0.20,  // 20% high-revenue supplement content
      variation_target: 2.5,    // Average variations per content
      authority_priority: true,   // Prioritize authority building
      revenue_priority: true    // Prioritize high-revenue supplement content
    };
  }

  routeContent(request: VideoGenerationRequest): VideoPlatform {
    // If platform specified and available, use it
    if (request.preferred_platform && request.preferred_platform !== VideoPlatform.AUTO) {
      if (this.platformAvailable(request.preferred_platform)) {
        return request.preferred_platform;
      }
    }

    // First check if this is supplement content - highest priority
    if (this.isSupplementContent(request)) {
      if (this.platformAvailable(VideoPlatform.SUPPLEMENT_VIRAL)) {
        console.log("Routing to SUPPLEMENT_VIRAL - detected health/supplement content");
        return VideoPlatform.SUPPLEMENT_VIRAL;
      }
    }

    // Calculate routing score for each platform
    const heygen_score = this.calculatePlatformScore(request, VideoPlatform.HEYGEN);
    const arcads_score = this.calculatePlatformScore(request, VideoPlatform.ARCADS);
    const supplement_score = this.calculatePlatformScore(request, VideoPlatform.SUPPLEMENT_VIRAL);

    console.log(`Platform scores - HeyGen: ${heygen_score.toFixed(2)}, Arcads: ${arcads_score.toFixed(2)}, Supplement: ${supplement_score.toFixed(2)}`);

    // Choose platform with highest score
    if (supplement_score > heygen_score && supplement_score > arcads_score) {
      return VideoPlatform.SUPPLEMENT_VIRAL;
    } else if (heygen_score > arcads_score) {
      return VideoPlatform.HEYGEN;
    } else {
      return VideoPlatform.ARCADS;
    }
  }

  private calculatePlatformScore(request: VideoGenerationRequest, platform: VideoPlatform): number {
    let score = 0.0;
    const profile = this.platform_profiles[platform];

    // Content type alignment (40% of score)
    if (profile.optimal_content.includes(request.content_type)) {
      score += 40;
    } else if (request.content_type === "suppressed_science" && platform === VideoPlatform.HEYGEN) {
      score += 40;  // HeyGen excels at authority content
    } else if (["product_review", "lifestyle_hack"].includes(request.content_type) && platform === VideoPlatform.ARCADS) {
      score += 40;  // Arcads excels at marketing content
    }

    // Trust factor alignment (30% of score)
    const trust_alignment = Math.abs((request.trust_factor_required || 0.5) - profile.trust_threshold);
    score += Math.max(0, 30 - (trust_alignment * 50));

    // Platform availability (20% of score)
    if (this.platformAvailable(platform)) {
      score += 20;
    } else {
      score -= 30;  // Heavy penalty for unavailable platforms
    }

    // Strategy alignment (10% of score)
    if (request.strategy === ContentStrategy.AUTHORITY_BUILDING && platform === VideoPlatform.HEYGEN) {
      score += 10;
    } else if (request.strategy === ContentStrategy.MARKETING_CONVERSION && platform === VideoPlatform.ARCADS) {
      score += 10;
    } else if (request.strategy === ContentStrategy.VIRAL_ENGAGEMENT && platform === VideoPlatform.ARCADS) {
      score += 10;
    }

    // Monthly distribution balance bonus
    const heygen_usage_ratio = this.usage_stats[VideoPlatform.HEYGEN].used / Math.max(this.usage_stats[VideoPlatform.HEYGEN].limit, 1);
    const arcads_usage_ratio = this.usage_stats[VideoPlatform.ARCADS].used / Math.max(this.usage_stats[VideoPlatform.ARCADS].limit, 1);

    if (platform === VideoPlatform.HEYGEN && heygen_usage_ratio < this.monthly_strategy.heygen_percentage) {
      score += 15;  // Bonus for using under-utilized HeyGen
    } else if (platform === VideoPlatform.ARCADS && arcads_usage_ratio < this.monthly_strategy.arcads_percentage) {
      score += 5;   // Smaller bonus for Arcads (we want more of this anyway)
    }

    return score;
  }

  private isSupplementContent(request: VideoGenerationRequest): boolean {
    // Check content type
    if (request.content_type === "supplement_viral") {
      return true;
    }

    // Check title and script data for health/supplement keywords
    const content_text = `${request.title} ${JSON.stringify(request.script_data)}`.toLowerCase();

    // Health/supplement keywords that indicate viral supplement potential
    const supplement_keywords = [
      // Supplement types
      "supplement", "vitamin", "mineral", "probiotic", "omega", "magnesium",
      "coq10", "vitamin d", "b12", "iron", "zinc", "ashwagandha", "curcumin",
      "fish oil", "multivitamin", "protein powder", "creatine", "collagen",

      // Health pain points (American epidemics)
      "chronic fatigue", "brain fog", "memory loss", "insomnia", "sleep problems",
      "anxiety", "depression", "inflammation", "joint pain", "arthritis",
      "weight gain", "metabolism", "hormonal imbalance", "thyroid", "adrenal",
      "digestive issues", "gut health", "autoimmune", "energy crash",

      // Health claims/language
      "natural remedy", "scientifically proven", "clinical study", "fda approved",
      "doctor recommended", "breakthrough discovery", "ancient wisdom",
      "pharmaceutical grade", "bioavailable", "absorption"
    ];

    // Count matches
    const matches = supplement_keywords.filter(keyword => content_text.includes(keyword)).length;

    // Also check revenue potential - supplements typically have high revenue
    const high_revenue = (request.revenue_potential || 0) > 100;

    // Supplement content if multiple keyword matches OR high revenue health product
    return matches >= 2 || (matches >= 1 && high_revenue);
  }

  public platformAvailable(platform: VideoPlatform): boolean {
    const usage = this.usage_stats[platform];
    return usage.used < usage.limit;
  }

  determineVariationStrategy(request: VideoGenerationRequest, chosen_platform: VideoPlatform): number {
    const base_variations = request.variations_requested || 1;

    // Arcads is better for variations due to diverse actor pool
    if (chosen_platform === VideoPlatform.ARCADS) {
      if (request.content_type === "product_review") {
        return Math.min(3, Math.max(base_variations, 2));  // 2-3 variations for products
      } else if ((request.revenue_potential || 0) > 100) {  // High-value content
        return Math.min(3, Math.max(base_variations, 2));
      } else {
        return Math.max(base_variations, 1);
      }
    }
    // HeyGen typically single videos for authority
    else {
      return 1;  // Usually 1 authoritative video
    }
  }

  getStrategyExplanation(request: VideoGenerationRequest, chosen_platform: VideoPlatform, num_variations: number): string {
    const explanations: string[] = [];

    // Platform choice explanation
    if (chosen_platform === VideoPlatform.HEYGEN) {
      if (request.content_type === "suppressed_science") {
        explanations.push("HeyGen chosen for authority-building content requiring high trust factor");
      } else if ((request.trust_factor_required || 0.5) > 0.7) {
        explanations.push("HeyGen chosen due to high trust factor requirement");
      } else {
        explanations.push("HeyGen chosen for credible human delivery");
      }
    } else if (chosen_platform === VideoPlatform.ARCADS) {
      if (request.content_type === "product_review") {
        explanations.push("Arcads chosen for authentic UGC-style product content");
      } else if ((request.revenue_potential || 0) > 0) {
        explanations.push("Arcads chosen for marketing-optimized conversion content");
      } else {
        explanations.push("Arcads chosen for engaging, diverse content variations");
      }
    } else if (chosen_platform === VideoPlatform.SUPPLEMENT_VIRAL) {
      explanations.push("Supplement Viral chosen for high-converting health content");
    }

    // Variation explanation
    if (num_variations > 1) {
      explanations.push(`${num_variations} variations to test different actors and approaches`);
    }

    // Strategy alignment
    if (request.strategy === ContentStrategy.AUTHORITY_BUILDING) {
      explanations.push("Aligned with authority-building content strategy");
    } else if (request.strategy === ContentStrategy.MARKETING_CONVERSION) {
      explanations.push("Optimized for marketing conversion strategy");
    }

    return explanations.join(" | ");
  }
}

export class MultiPlatformVideoEngine {
  private heygen_integration?: HeyGenIntegration;
  private arcads_integration?: ArcadsIntegration;
  private supplement_generator?: SupplementVideoGenerator;
  private router: PlatformRouter;

  constructor(
    heygen_api_key?: string,
    arcads_api_key?: string,
    openai_api_key?: string,
    elevenlabs_api_key?: string
  ) {
    this.heygen_integration = heygen_api_key ? new HeyGenIntegration(heygen_api_key) : undefined;
    this.arcads_integration = arcads_api_key ? new ArcadsIntegration() : undefined;
    this.supplement_generator = (openai_api_key || elevenlabs_api_key) ? 
      new SupplementVideoGenerator(openai_api_key, elevenlabs_api_key) : undefined;
    this.router = new PlatformRouter();

    if (!this.heygen_integration && !this.arcads_integration && !this.supplement_generator) {
      throw new Error("At least one platform API key is required");
    }
  }

  async generateVideoContent(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      console.log(`Processing video generation request: ${request.content_id}`);

      // Route to optimal platform
      const chosen_platform = this.router.routeContent(request);

      // Determine variation strategy
      const num_variations = this.router.determineVariationStrategy(request, chosen_platform);

      // Generate strategy explanation
      const strategy_explanation = this.router.getStrategyExplanation(request, chosen_platform, num_variations);

      // Generate videos
      const videos = await this.generateVideos(request, chosen_platform, num_variations);

      // Update usage stats
      this.router.usage_stats[chosen_platform].used += videos.length;

      // Calculate cost breakdown
      const cost_breakdown = this.calculateCosts(chosen_platform, videos.length);

      // Estimate completion time
      const platform_profile = this.router.platform_profiles[chosen_platform];
      const estimated_time = `${platform_profile.generation_time} per video`;

      const response: VideoGenerationResponse = {
        request_id: request.content_id,
        platform_used: chosen_platform,
        videos: videos,
        strategy_explanation: strategy_explanation,
        estimated_completion_time: estimated_time,
        cost_breakdown: cost_breakdown
      };

      console.log(`Generated ${videos.length} videos using ${chosen_platform}`);
      return response;

    } catch (error) {
      console.error(`Video generation failed: ${error}`);
      throw error;
    }
  }

  private async generateVideos(
    request: VideoGenerationRequest,
    platform: VideoPlatform,
    num_variations: number
  ): Promise<Array<HeyGenVideoResponse | ArcadsVideoResponse | SupplementVideoResponse>> {
    const videos: Array<HeyGenVideoResponse | ArcadsVideoResponse | SupplementVideoResponse> = [];

    if (platform === VideoPlatform.HEYGEN && this.heygen_integration) {
      // HeyGen typically generates single authoritative video
      const video = await this.heygen_integration.createHumanAvatarVideo(request.script_data as any);
      videos.push(video);

    } else if (platform === VideoPlatform.ARCADS && this.arcads_integration) {
      // Arcads can generate multiple variations
      if (num_variations > 1) {
        const variations = await this.arcads_integration.createMultipleVariations(
          request.script_data, num_variations
        );
        videos.push(...variations);
      } else {
        const video = await this.arcads_integration.createUGCVideo(request.script_data);
        videos.push(video);
      }

    } else if (platform === VideoPlatform.SUPPLEMENT_VIRAL && this.supplement_generator) {
      // Supplement viral generates high-converting health content
      const product_info = {
        name: request.title,
        description: JSON.stringify(request.script_data),
        price: 49.99,  // Default price for supplements
        commission: 25,  // Default commission
        ...request.script_data  // Include any additional product data
      };

      if (num_variations > 1) {
        // Generate multiple supplement video variations
        const variations = await this.supplement_generator.createVideoVariations(product_info, num_variations);
        videos.push(...variations);
      } else {
        // Generate single supplement video
        const video = await this.supplement_generator.createSupplementVideo(product_info);
        videos.push(video);
      }

    } else {
      throw new Error(`Platform ${platform} not available or configured`);
    }

    return videos;
  }

  private calculateCosts(platform: VideoPlatform, num_videos: number): Record<string, any> {
    const profile = this.router.platform_profiles[platform];
    const cost_per_video = profile.cost_per_video;

    return {
      platform: platform,
      videos_generated: num_videos,
      cost_per_video: cost_per_video,
      total_cost: cost_per_video * num_videos,
      currency: "USD",
      billing_type: cost_per_video === 0 ? "free_tier" : "pay_per_use"
    };
  }

  async generateContentBatch(requests: VideoGenerationRequest[]): Promise<VideoGenerationResponse[]> {
    const responses: VideoGenerationResponse[] = [];

    // Process requests with concurrency control
    const maxConcurrent = 3;
    const semaphore = new Array(maxConcurrent).fill(null);
    
    const processRequest = async (request: VideoGenerationRequest): Promise<VideoGenerationResponse | null> => {
      try {
        return await this.generateVideoContent(request);
      } catch (error) {
        console.error(`Batch generation error: ${error}`);
        return null;
      }
    };

    // Process in batches
    for (let i = 0; i < requests.length; i += maxConcurrent) {
      const batch = requests.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(request => processRequest(request));
      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach(result => {
        if (result) {
          responses.push(result);
        }
      });
    }

    console.log(`Completed batch generation: ${responses.length} successful`);
    return responses;
  }

  getPlatformStats(): Record<string, any> {
    return {
      usage_stats: this.router.usage_stats,
      monthly_strategy: this.router.monthly_strategy,
      platform_profiles: this.router.platform_profiles,
      available_platforms: [VideoPlatform.HEYGEN, VideoPlatform.ARCADS, VideoPlatform.SUPPLEMENT_VIRAL]
        .filter(platform => this.router.platformAvailable(platform))
        .map(platform => platform.toString()),
      revenue_potential: {
        heygen: "Authority building",
        arcads: "Marketing conversion",
        supplement_viral: "$10k-$60k per viral video"
      }
    };
  }
}

// Example usage function
export async function multiPlatformExample(): Promise<void> {
  // Initialize with all platforms
  const engine = new MultiPlatformVideoEngine(
    "your_heygen_key",
    "your_arcads_key",
    "your_openai_key",
    "your_elevenlabs_key"
  );

  // Example content requests
  const requests: VideoGenerationRequest[] = [
    {
      content_id: "authority_001",
      content_type: "suppressed_science",
      title: "Government Starvation Experiments on Americans",
      script_data: {
        topic: "minnesota_starvation_experiment",
        suppressed_fact: "Government studied starvation psychology for 40 years",
        personal_impact: "explains why diets fail and create obsession"
      },
      trust_factor_required: 0.9,
      strategy: ContentStrategy.AUTHORITY_BUILDING,
      variations_requested: 1
    },
    {
      content_id: "product_001",
      content_type: "product_review",
      title: "LED Face Mask Review",
      script_data: {
        content_type: "product_review",
        product_name: "LED Face Mask Pro",
        personal_result: "amazing skin transformation in 2 weeks"
      },
      trust_factor_required: 0.6,
      revenue_potential: 280,
      strategy: ContentStrategy.MARKETING_CONVERSION,
      variations_requested: 3
    },
    {
      content_id: "supplement_001",
      content_type: "supplement_viral",
      title: "CoQ10 Ultra for Chronic Fatigue",
      script_data: {
        content_type: "supplement_viral",
        product_name: "CoQ10 Ultra Absorption Complex",
        ingredients: "CoQ10, PQQ, Ubiquinol",
        price: 49.99,
        commission: 30,
        description: "Premium CoQ10 for cellular energy production"
      },
      trust_factor_required: 0.9,
      revenue_potential: 15000,  // High revenue potential for supplements
      strategy: ContentStrategy.SUPPLEMENT_VIRAL,
      variations_requested: 2
    }
  ];

  try {
    // Generate content batch
    const responses = await engine.generateContentBatch(requests);

    responses.forEach(response => {
      console.log(`\n✅ Generated content: ${response.request_id}`);
      console.log(`Platform: ${response.platform_used}`);
      console.log(`Videos: ${response.videos.length}`);
      console.log(`Strategy: ${response.strategy_explanation}`);
      console.log(`Estimated time: ${response.estimated_completion_time}`);
    });

    // Get platform stats
    const stats = engine.getPlatformStats();
    console.log(`\n📊 Platform Stats:`, stats);

  } catch (error) {
    console.error('Example failed:', error);
  }
}