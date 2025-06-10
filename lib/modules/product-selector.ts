/**
 * Product Selection Logic System
 * Advanced product analysis and selection for optimal affiliate performance
 */

import { BaseModel } from '../base-model';

// Interfaces
export interface ProductMetrics {
  product_id: string;
  name: string;
  category: string;
  price: number;
  conversion_rate: number;
  total_purchases: number;
  saves_per_video: number;
  engagement_rate: number;
  trend_velocity: number;
  competition_level: string;
  profit_margin: number;
  affiliate_commission: number;
}

export interface ProductOpportunity {
  product: ProductMetrics;
  opportunity_score: number;
  reasons: string[];
  optimal_audience: string;
  recommended_approach: string;
  estimated_daily_revenue: number;
  confidence_level: number;
}

export interface MarketTrend {
  category: string;
  growth_rate: number;
  saturation_level: number;
  emerging_keywords: string[];
  top_performers: string[];
  seasonal_factor: number;
}

export interface PerformanceCriteria {
  min_conversion_rate: number;
  min_total_purchases: number;
  min_saves_per_video: number;
  min_engagement_rate: number;
  min_trend_velocity: number;
  max_competition_level: string;
}

export interface CategoryBreakdown {
  count: number;
  avg_score: number;
  top_product: string | null;
}

export interface CategoryData {
  trend_data: MarketTrend;
  top_products: Array<{ name: string; performance_score: number }>;
  opportunity_gaps: string[];
  recommendation: string;
}

export interface OverallInsights {
  top_opportunities: string[];
  emerging_trends: string[];
  recommendations: string[];
  risk_factors: string[];
}

export interface MarketAnalysis {
  [category: string]: CategoryData | OverallInsights | undefined;
  overall_insights?: OverallInsights;
}

export class ProductSelector extends BaseModel {
  private tiktok_shop_api_key?: string;
  private affiliate_networks: Record<string, string | undefined>;
  private performance_criteria: PerformanceCriteria;
  private category_multipliers: Record<string, number>;

  constructor() {
    super();
    
    this.tiktok_shop_api_key = process.env.TIKTOK_SHOP_API_KEY;
    this.affiliate_networks = {
      amazon: process.env.AMAZON_AFFILIATE_KEY,
      clickbank: process.env.CLICKBANK_API_KEY,
      shareASale: process.env.SHAREASALE_API_KEY,
      cj_affiliate: process.env.CJ_AFFILIATE_KEY
    };
    
    // Performance thresholds (customizable via dashboard)
    this.performance_criteria = {
      min_conversion_rate: 0.03,  // 3%
      min_total_purchases: 10000,
      min_saves_per_video: 5000,
      min_engagement_rate: 0.05,  // 5%
      min_trend_velocity: 0.1,
      max_competition_level: "medium"
    };
    
    // Category multipliers for opportunity scoring
    this.category_multipliers = {
      beauty: 1.2,      // High engagement category
      fashion: 1.1,     // Visual appeal
      tech: 1.0,        // Steady demand
      fitness: 1.15,    // Growing trend
      home: 0.9,        // Lower engagement
      finance: 0.8,     // Restricted content
      food: 1.1,        // Universal appeal
      pets: 1.3         // High emotional engagement
    };
  }

  async select_product(category: string, target_audience: string): Promise<ProductMetrics> {
    try {
      console.log(`Selecting product for category: ${category}, audience: ${target_audience}`);
      
      // Get products from multiple sources
      const products = await this.get_products_from_all_sources(category);
      
      // Filter by performance criteria
      const qualified_products = this.filter_by_performance(products);
      
      // Analyze market opportunities
      const opportunities = await this.analyze_opportunities(qualified_products, target_audience);
      
      // Select best opportunity
      const best_product = this.select_best_opportunity(opportunities);
      
      console.log(`Selected product: ${best_product.product.name} with score: ${best_product.opportunity_score}`);
      return best_product.product;
      
    } catch (error) {
      console.error(`Product selection failed: ${error}`);
      throw error;
    }
  }

  async analyze_market(): Promise<MarketAnalysis> {
    try {
      // Analyze all major categories
      const categories = ["beauty", "fashion", "tech", "fitness", "home", "food", "pets"];
      
      const market_analysis: MarketAnalysis = {};
      
      for (const category of categories) {
        const trend_data = await this.analyze_category_trends(category);
        const top_products = await this.get_top_performers(category);
        const opportunity_gaps = await this.identify_opportunity_gaps(category);
        
        market_analysis[category] = {
          trend_data,
          top_products,
          opportunity_gaps,
          recommendation: this.generate_category_recommendation(trend_data, opportunity_gaps)
        };
      }
      
      // Overall market insights
      market_analysis.overall_insights = await this.generate_market_insights(market_analysis);
      
      return market_analysis;
      
    } catch (error) {
      console.error(`Market analysis failed: ${error}`);
      throw error;
    }
  }

  private async get_products_from_all_sources(category: string): Promise<Record<string, any>[]> {
    const all_products: Record<string, any>[] = [];
    
    // Get from TikTok Shop
    const tiktok_products = await this.get_tiktok_shop_products(category);
    all_products.push(...tiktok_products);
    
    // Get from affiliate networks
    for (const [network, api_key] of Object.entries(this.affiliate_networks)) {
      if (api_key) {
        const network_products = await this.get_affiliate_network_products(network, category);
        all_products.push(...network_products);
      }
    }
    
    return all_products;
  }

  private async get_tiktok_shop_products(category: string): Promise<Record<string, any>[]> {
    try {
      if (!this.tiktok_shop_api_key) {
        console.warn("TikTok Shop API key not configured, using mock data");
        return this.get_mock_tiktok_products(category);
      }
      
      // In a real implementation, this would make actual API calls
      // For now, return mock data
      return this.get_mock_tiktok_products(category);
      
    } catch (error) {
      console.error(`TikTok Shop API call failed: ${error}`);
      return this.get_mock_tiktok_products(category);
    }
  }

  private get_mock_tiktok_products(category: string): Record<string, any>[] {
    const mock_products: Record<string, Record<string, any>[]> = {
      beauty: [
        {
          product_id: "beauty_001",
          name: "Hydrating Face Serum with Vitamin C",
          category: "beauty",
          price: 29.99,
          conversion_rate: 0.045,
          total_purchases: 15000,
          saves_per_video: 8500,
          engagement_rate: 0.078,
          trend_velocity: 0.25,
          competition_level: "medium",
          profit_margin: 0.40,
          affiliate_commission: 12.00
        },
        {
          product_id: "beauty_002",
          name: "LED Light Therapy Mask",
          category: "beauty",
          price: 89.99,
          conversion_rate: 0.035,
          total_purchases: 12000,
          saves_per_video: 6800,
          engagement_rate: 0.065,
          trend_velocity: 0.18,
          competition_level: "low",
          profit_margin: 0.50,
          affiliate_commission: 45.00
        }
      ],
      fitness: [
        {
          product_id: "fitness_001",
          name: "Resistance Bands Set with Door Anchor",
          category: "fitness",
          price: 19.99,
          conversion_rate: 0.055,
          total_purchases: 25000,
          saves_per_video: 12000,
          engagement_rate: 0.085,
          trend_velocity: 0.30,
          competition_level: "high",
          profit_margin: 0.35,
          affiliate_commission: 7.00
        }
      ],
      tech: [
        {
          product_id: "tech_001",
          name: "Wireless Phone Charger Stand",
          category: "tech",
          price: 34.99,
          conversion_rate: 0.038,
          total_purchases: 18000,
          saves_per_video: 7200,
          engagement_rate: 0.055,
          trend_velocity: 0.15,
          competition_level: "medium",
          profit_margin: 0.45,
          affiliate_commission: 15.75
        }
      ]
    };
    
    return mock_products[category] || [];
  }

  private async get_affiliate_network_products(network: string, category: string): Promise<Record<string, any>[]> {
    try {
      // Each network has different API structure
      if (network === "amazon") {
        return await this.get_amazon_products(category);
      } else if (network === "clickbank") {
        return await this.get_clickbank_products(category);
      }
      // Add other networks as needed
      
      return [];
      
    } catch (error) {
      console.error(`Failed to get products from ${network}: ${error}`);
      return [];
    }
  }

  private async get_amazon_products(category: string): Promise<Record<string, any>[]> {
    // Mock implementation - replace with actual Amazon API calls
    return [];
  }

  private async get_clickbank_products(category: string): Promise<Record<string, any>[]> {
    // Mock implementation - replace with actual ClickBank API calls
    return [];
  }

  private filter_by_performance(products: Record<string, any>[]): ProductMetrics[] {
    const qualified_products: ProductMetrics[] = [];
    
    for (const product_data of products) {
      try {
        const product: ProductMetrics = {
          product_id: product_data.product_id,
          name: product_data.name,
          category: product_data.category,
          price: product_data.price,
          conversion_rate: product_data.conversion_rate,
          total_purchases: product_data.total_purchases,
          saves_per_video: product_data.saves_per_video,
          engagement_rate: product_data.engagement_rate,
          trend_velocity: product_data.trend_velocity,
          competition_level: product_data.competition_level,
          profit_margin: product_data.profit_margin,
          affiliate_commission: product_data.affiliate_commission
        };
        
        // Apply performance filters
        if (product.conversion_rate >= this.performance_criteria.min_conversion_rate &&
            product.total_purchases >= this.performance_criteria.min_total_purchases &&
            product.saves_per_video >= this.performance_criteria.min_saves_per_video &&
            product.engagement_rate >= this.performance_criteria.min_engagement_rate &&
            product.trend_velocity >= this.performance_criteria.min_trend_velocity) {
          
          qualified_products.push(product);
        }
        
      } catch (error) {
        console.warn(`Failed to validate product: ${error}`);
      }
    }
    
    console.log(`Filtered ${qualified_products.length} qualified products from ${products.length} total`);
    return qualified_products;
  }

  private async analyze_opportunities(products: ProductMetrics[], target_audience: string): Promise<ProductOpportunity[]> {
    const opportunities: ProductOpportunity[] = [];
    
    for (const product of products) {
      const opportunity_score = await this.calculate_opportunity_score(product, target_audience);
      const reasons = this.generate_opportunity_reasons(product, opportunity_score);
      const optimal_audience = this.determine_optimal_audience(product);
      const approach = this.recommend_approach(product, target_audience);
      const revenue_estimate = this.estimate_daily_revenue(product);
      const confidence = this.calculate_confidence_level(product);
      
      const opportunity: ProductOpportunity = {
        product,
        opportunity_score,
        reasons,
        optimal_audience,
        recommended_approach: approach,
        estimated_daily_revenue: revenue_estimate,
        confidence_level: confidence
      };
      
      opportunities.push(opportunity);
    }
    
    // Sort by opportunity score
    opportunities.sort((a, b) => b.opportunity_score - a.opportunity_score);
    return opportunities;
  }

  private async calculate_opportunity_score(product: ProductMetrics, target_audience: string): Promise<number> {
    let score = 0.0;
    
    // Performance metrics (40% weight)
    const performance_score = (
      (product.conversion_rate * 10) * 0.3 +  // Conversion rate
      (Math.min(product.engagement_rate * 10, 1)) * 0.3 +  // Engagement rate
      (Math.min(product.trend_velocity * 2, 1)) * 0.4  // Trend velocity
    );
    score += performance_score * 0.4;
    
    // Market factors (30% weight)
    const competition_multiplier: Record<string, number> = { low: 1.0, medium: 0.8, high: 0.6 };
    const comp_mult = competition_multiplier[product.competition_level] || 0.7;
    const category_multiplier = this.category_multipliers[product.category] || 1.0;
    const market_score = comp_mult * category_multiplier;
    score += market_score * 0.3;
    
    // Financial potential (30% weight)
    const financial_score = Math.min((product.affiliate_commission / product.price) * 2, 1.0);
    score += financial_score * 0.3;
    
    // Audience match bonus
    const audience_match = await this.calculate_audience_match(product, target_audience);
    score *= (1 + audience_match * 0.2);
    
    return Math.min(score, 1.0);
  }

  private async calculate_audience_match(product: ProductMetrics, target_audience: string): Promise<number> {
    // Simple keyword matching - could be enhanced with ML
    const audience_keywords = target_audience.toLowerCase().split(' ');
    const product_keywords = (product.name + " " + product.category).toLowerCase().split(' ');
    
    const matches = audience_keywords.filter(keyword => product_keywords.includes(keyword)).length;
    const total_keywords = audience_keywords.length;
    
    return total_keywords > 0 ? matches / total_keywords : 0.5;
  }

  private generate_opportunity_reasons(product: ProductMetrics, score: number): string[] {
    const reasons: string[] = [];
    
    if (product.conversion_rate > 0.04) {
      reasons.push(`High conversion rate (${(product.conversion_rate * 100).toFixed(1)}%)`);
    }
    
    if (product.trend_velocity > 0.2) {
      reasons.push("Strong upward trend");
    }
    
    if (product.competition_level === "low") {
      reasons.push("Low competition market");
    }
    
    if (product.affiliate_commission / product.price > 0.3) {
      reasons.push("High commission rate");
    }
    
    if (product.engagement_rate > 0.06) {
      reasons.push("High audience engagement");
    }
    
    if (score > 0.8) {
      reasons.push("Excellent overall opportunity");
    } else if (score > 0.6) {
      reasons.push("Good opportunity potential");
    }
    
    return reasons;
  }

  private determine_optimal_audience(product: ProductMetrics): string {
    const audience_mapping: Record<string, string> = {
      beauty: "Women 18-35, beauty enthusiasts, skincare focused",
      fitness: "Health-conscious adults 25-45, fitness beginners to intermediate",
      tech: "Tech-savvy individuals 20-40, early adopters, productivity focused",
      fashion: "Style-conscious individuals 18-40, trend followers",
      home: "Homeowners and renters 25-50, organization enthusiasts",
      food: "Food lovers 20-60, cooking enthusiasts, health-conscious",
      pets: "Pet owners 25-55, animal lovers, premium pet care"
    };
    
    return audience_mapping[product.category] || "General audience interested in quality products";
  }

  private recommend_approach(product: ProductMetrics, target_audience: string): string {
    if (product.price < 30) {
      return "Impulse purchase focus - emphasize value and immediate benefits";
    } else if (product.price < 100) {
      return "Problem-solution approach - highlight specific pain points it solves";
    } else {
      return "Investment positioning - focus on long-term value and premium quality";
    }
  }

  private estimate_daily_revenue(product: ProductMetrics): number {
    // Conservative estimate based on typical TikTok performance
    const estimated_daily_views = 10000;  // Conservative estimate for new creators
    const conversion_factor = product.conversion_rate * 0.1;  // Only 10% of conversions attributed to our content
    const daily_sales = estimated_daily_views * conversion_factor;
    const daily_revenue = daily_sales * product.affiliate_commission;
    
    return Math.round(daily_revenue * 100) / 100;
  }

  private calculate_confidence_level(product: ProductMetrics): number {
    let confidence = 0.5;  // Base confidence
    
    // Increase confidence based on data quality
    if (product.total_purchases > 50000) {
      confidence += 0.2;
    } else if (product.total_purchases > 20000) {
      confidence += 0.1;
    }
    
    if (product.saves_per_video > 10000) {
      confidence += 0.1;
    }
    
    // Decrease confidence for high competition
    if (product.competition_level === "high") {
      confidence -= 0.1;
    }
    
    return Math.min(confidence, 0.95);
  }

  private select_best_opportunity(opportunities: ProductOpportunity[]): ProductOpportunity {
    if (opportunities.length === 0) {
      throw new Error("No qualified product opportunities found");
    }
    
    // Already sorted by opportunity score, return the best one
    const best_opportunity = opportunities[0];
    
    console.log(`Selected best opportunity: ${best_opportunity.product.name} ` +
               `(Score: ${best_opportunity.opportunity_score.toFixed(3)})`);
    
    return best_opportunity;
  }

  private async analyze_category_trends(category: string): Promise<MarketTrend> {
    // Mock implementation - replace with real trend analysis
    return {
      category,
      growth_rate: 0.15,  // 15% growth
      saturation_level: 0.6,  // 60% saturated
      emerging_keywords: ["sustainable", "eco-friendly", "smart"],
      top_performers: ["Product A", "Product B", "Product C"],
      seasonal_factor: 1.0
    };
  }

  private async get_top_performers(category: string): Promise<Array<{ name: string; performance_score: number }>> {
    // Mock implementation - replace with real data
    return [
      { name: "Top Product 1", performance_score: 0.95 },
      { name: "Top Product 2", performance_score: 0.88 },
      { name: "Top Product 3", performance_score: 0.82 }
    ];
  }

  private async identify_opportunity_gaps(category: string): Promise<string[]> {
    // Mock implementation - replace with real analysis
    return [
      "Underserved price point: $50-75 range",
      "Limited eco-friendly options",
      "Opportunity for subscription model",
      "Mobile-first user experience gap"
    ];
  }

  private generate_category_recommendation(trend_data: MarketTrend, gaps: string[]): string {
    if (trend_data.growth_rate > 0.2) {
      return `High growth category (${(trend_data.growth_rate * 100).toFixed(1)}%) - prioritize for immediate expansion`;
    } else if (trend_data.saturation_level < 0.5) {
      return "Emerging market with low saturation - good long-term opportunity";
    } else {
      return "Mature market - focus on differentiation and niche targeting";
    }
  }

  private async generate_market_insights(analysis: MarketAnalysis): Promise<{
    top_opportunities: string[];
    emerging_trends: string[];
    recommendations: string[];
    risk_factors: string[];
  }> {
    const insights = {
      top_opportunities: [] as string[],
      emerging_trends: [] as string[],
      recommendations: [] as string[],
      risk_factors: [] as string[]
    };
    
    // Analyze patterns across categories
    for (const [category, data] of Object.entries(analysis)) {
      if (category !== "overall_insights" && data && 'trend_data' in data) {
        const trend = (data as CategoryData).trend_data;
        if (trend.growth_rate > 0.2) {
          insights.top_opportunities.push(`${category}: ${(trend.growth_rate * 100).toFixed(1)}% growth`);
        }
      }
    }
    
    insights.emerging_trends = [
      "Sustainability focus across all categories",
      "Smart/connected product integration",
      "Subscription and recurring revenue models",
      "Mobile-first shopping experiences"
    ];
    
    insights.recommendations = [
      "Focus on categories with >15% growth rate",
      "Target products with low competition levels",
      "Emphasize sustainable and eco-friendly options",
      "Consider seasonal factors in content planning"
    ];
    
    insights.risk_factors = [
      "High competition in beauty and fitness categories",
      "Potential market saturation in tech accessories",
      "Seasonal variance in home and fashion categories"
    ];
    
    return insights;
  }

  update_performance_criteria(new_criteria: Partial<PerformanceCriteria>): void {
    Object.assign(this.performance_criteria, new_criteria);
    console.log(`Updated performance criteria:`, this.performance_criteria);
  }

  get_performance_criteria(): PerformanceCriteria {
    return { ...this.performance_criteria };
  }
}