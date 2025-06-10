/**
 * Smart Product Analyzer - Personal Content Engine
 * Intelligent filtering and ranking system for viral content opportunities
 * Combines FastMoss and KoloData to identify winning products
 */

import { BaseModel } from '../base-model';

// Interfaces
export interface ProductCriteria {
  max_price: number;
  min_commission: number;
  min_rating: number;
  max_monthly_sales: number;
  min_monthly_sales: number;
  min_profit_per_sale: number;
  blacklisted_keywords: string[];
  preferred_categories: string[];
}

export interface ProductMetrics {
  id: string;
  name: string;
  price: number;
  commission: number;
  rating: number;
  sales_count: number;
  trend_score: number;
  link: string;
  source: string;
  scraped_at?: string;
  monthly_sales?: number;
  revenue?: number;
  growth_rate?: number;
  competition_level?: string;
  top_creators?: number;
}

export interface EnrichedProduct extends ProductMetrics {
  profit_per_sale?: number;
  category: string;
  viral_indicators: string[];
  controversy_potential: number;
  content_angles: string[];
  target_audience: string;
  estimated_ctr: number;
  market_saturation: string;
  opportunity_score: number;
  score_breakdown: ScoreBreakdown;
  recommendation: string;
}

export interface ScoreBreakdown {
  profit_potential: number;
  viral_indicators: number;
  market_opportunity: number;
  trend_momentum: number;
  content_angles: number;
  conversion_likelihood: number;
}

export interface AnalysisReport {
  analysis_timestamp: string;
  criteria_used: ProductCriteria;
  total_products_analyzed: number;
  top_opportunities: EnrichedProduct[];
  category_breakdown: Record<string, CategoryBreakdown>;
  scoring_summary: ScoringSummary;
}

export interface CategoryBreakdown {
  count: number;
  avg_score: number;
  top_product: string | null;
}

export interface ScoringSummary {
  highest_score: number;
  lowest_score: number;
  average_score: number;
  products_above_80: number;
  products_above_60: number;
}

export class ProductAnalyzer extends BaseModel {
  private criteria: ProductCriteria;
  private viral_keywords: string[];
  private scoring_weights: Record<string, number>;

  constructor(criteria?: Partial<ProductCriteria>) {
    super();
    
    this.criteria = {
      max_price: 100.0,
      min_commission: 15.0,
      min_rating: 4.5,
      max_monthly_sales: 50000,
      min_monthly_sales: 1000,
      min_profit_per_sale: 15.0,
      blacklisted_keywords: [
        'adult', 'nsfw', 'explicit', 'gambling', 'casino',
        'crypto', 'bitcoin', 'investment', 'forex', 'trading'
      ],
      preferred_categories: [
        'health', 'beauty', 'fitness', 'wellness', 'skincare',
        'tech', 'gadgets', 'home', 'kitchen', 'lifestyle'
      ],
      ...criteria
    };

    this.viral_keywords = [
      'viral', 'trending', 'tiktok famous', 'went viral',
      'everyone\'s buying', 'sold out', 'must have',
      'life changing', 'game changer', 'mind blown',
      'secret', 'hidden', 'banned', 'suppressed'
    ];

    this.scoring_weights = {
      profit_potential: 0.25,
      viral_indicators: 0.20,
      market_opportunity: 0.20,
      trend_momentum: 0.15,
      content_angles: 0.10,
      conversion_likelihood: 0.10
    };
  }

  async analyze_products(
    fastmoss_products: Record<string, any>[],
    kolodata_products: Record<string, any>[] = []
  ): Promise<EnrichedProduct[]> {
    console.log('🧠 Starting intelligent product analysis...');
    
    // Step 1: Merge and deduplicate data sources
    const merged_products = this.merge_product_data(fastmoss_products, kolodata_products);
    console.log(`Merged ${merged_products.length} unique products`);
    
    // Step 2: Apply basic filters
    const filtered_products = this.apply_filters(merged_products);
    console.log(`Filtered to ${filtered_products.length} qualifying products`);
    
    // Step 3: Enrich with analytics
    const enriched_products = this.enrich_products(filtered_products);
    
    // Step 4: Calculate opportunity scores
    const scored_products = this.calculate_opportunity_scores(enriched_products);
    
    // Step 5: Rank by opportunity
    const ranked_products = scored_products.sort((a, b) => b.opportunity_score - a.opportunity_score);
    
    console.log(`✅ Analysis complete. Top opportunity score: ${ranked_products[0]?.opportunity_score?.toFixed(2) || 'N/A'}`);
    return ranked_products;
  }

  private merge_product_data(
    fastmoss_products: Record<string, any>[],
    kolodata_products: Record<string, any>[]
  ): ProductMetrics[] {
    const merged: Record<string, ProductMetrics> = {};
    
    // Process FastMoss products first
    for (const product of fastmoss_products) {
      const product_key = this.normalize_product_name(product.name || '');
      if (product_key) {
        merged[product_key] = {
          id: product.id || `fm_${this.hash_string(product_key)}`,
          name: product.name,
          price: this.parse_price(product.price),
          commission: this.parse_percentage(product.commission),
          rating: this.parse_rating(product.rating),
          sales_count: this.parse_number(product.sales),
          trend_score: this.parse_number(product.trend_score),
          link: product.link,
          source: 'fastmoss',
          scraped_at: product.scraped_at,
          monthly_sales: undefined,
          revenue: undefined,
          growth_rate: undefined,
          competition_level: undefined,
          top_creators: undefined
        };
      }
    }
    
    // Enrich with KoloData analytics
    for (const product of kolodata_products) {
      const product_key = this.normalize_product_name(product.name || '');
      if (product_key) {
        if (merged[product_key]) {
          // Enrich existing product
          Object.assign(merged[product_key], {
            monthly_sales: this.parse_number(product.monthly_sales),
            revenue: this.parse_price(product.revenue),
            growth_rate: this.parse_percentage(product.growth_rate),
            competition_level: product.competition_level,
            top_creators: this.parse_number(product.top_creators),
            source: 'fastmoss+kolodata'
          });
        } else {
          // Add new product from KoloData only
          merged[product_key] = {
            id: product.id || `kd_${this.hash_string(product_key)}`,
            name: product.name,
            price: this.parse_price(product.price),
            commission: 0,
            rating: this.parse_rating(product.rating),
            sales_count: 0,
            trend_score: 0,
            link: product.link,
            source: 'kolodata',
            scraped_at: product.scraped_at,
            monthly_sales: this.parse_number(product.monthly_sales),
            revenue: this.parse_price(product.revenue),
            growth_rate: this.parse_percentage(product.growth_rate),
            competition_level: product.competition_level,
            top_creators: this.parse_number(product.top_creators)
          };
        }
      }
    }
    
    return Object.values(merged);
  }

  private apply_filters(products: ProductMetrics[]): ProductMetrics[] {
    const filtered: ProductMetrics[] = [];
    
    for (const product of products) {
      // Skip if missing critical data
      if (!product.name || !product.price) {
        continue;
      }
      
      // Price filter
      if (product.price > this.criteria.max_price) {
        continue;
      }
      
      // Commission filter (only if available)
      if (product.commission && product.commission < this.criteria.min_commission) {
        continue;
      }
      
      // Rating filter (only if available)
      if (product.rating && product.rating < this.criteria.min_rating) {
        continue;
      }
      
      // Monthly sales filter (avoid oversaturation)
      if (product.monthly_sales) {
        if (product.monthly_sales > this.criteria.max_monthly_sales ||
            product.monthly_sales < this.criteria.min_monthly_sales) {
          continue;
        }
      }
      
      // Profit per sale filter
      const profit_per_sale = this.calculate_profit_per_sale(product);
      if (profit_per_sale && profit_per_sale < this.criteria.min_profit_per_sale) {
        continue;
      }
      
      // Blacklisted keywords filter
      if (this.contains_blacklisted_keywords(product.name)) {
        continue;
      }
      
      filtered.push(product);
    }
    
    return filtered;
  }

  private enrich_products(products: ProductMetrics[]): EnrichedProduct[] {
    const enriched: EnrichedProduct[] = [];
    
    for (const product of products) {
      const enriched_product: EnrichedProduct = {
        ...product,
        profit_per_sale: this.calculate_profit_per_sale(product),
        category: this.categorize_product(product.name),
        viral_indicators: this.detect_viral_indicators(product.name),
        controversy_potential: this.calculate_controversy_potential(product.name),
        content_angles: this.generate_content_angles(product),
        target_audience: this.determine_target_audience(product),
        estimated_ctr: this.estimate_click_through_rate(product),
        market_saturation: this.assess_market_saturation(product),
        opportunity_score: 0,
        score_breakdown: {
          profit_potential: 0,
          viral_indicators: 0,
          market_opportunity: 0,
          trend_momentum: 0,
          content_angles: 0,
          conversion_likelihood: 0
        },
        recommendation: ''
      };
      
      enriched.push(enriched_product);
    }
    
    return enriched;
  }

  private calculate_opportunity_scores(products: EnrichedProduct[]): EnrichedProduct[] {
    for (const product of products) {
      const scores: ScoreBreakdown = {
        profit_potential: 0,
        viral_indicators: 0,
        market_opportunity: 0,
        trend_momentum: 0,
        content_angles: 0,
        conversion_likelihood: 0
      };
      
      // 1. Profit Potential Score (0-1)
      const profit_score = Math.min(1.0, (product.profit_per_sale || 0) / 50.0);
      scores.profit_potential = profit_score;
      
      // 2. Viral Indicators Score (0-1)
      const viral_count = product.viral_indicators.length;
      const viral_score = Math.min(1.0, viral_count / 5.0);
      scores.viral_indicators = viral_score;
      
      // 3. Market Opportunity Score (0-1)
      const market_score = this.calculate_market_opportunity_score(product);
      scores.market_opportunity = market_score;
      
      // 4. Trend Momentum Score (0-1)
      const trend_score = this.calculate_trend_momentum_score(product);
      scores.trend_momentum = trend_score;
      
      // 5. Content Angles Score (0-1)
      const content_score = Math.min(1.0, product.controversy_potential);
      scores.content_angles = content_score;
      
      // 6. Conversion Likelihood Score (0-1)
      const conversion_score = this.calculate_conversion_likelihood_score(product);
      scores.conversion_likelihood = conversion_score;
      
      // Calculate weighted overall score
      const opportunity_score = Object.entries(this.scoring_weights).reduce(
        (total, [factor, weight]) => total + scores[factor as keyof ScoreBreakdown] * weight,
        0
      );
      
      product.opportunity_score = opportunity_score;
      product.score_breakdown = scores;
      product.recommendation = this.generate_recommendation(product, opportunity_score);
    }
    
    return products;
  }

  private calculate_market_opportunity_score(product: ProductMetrics): number {
    let score = 0.5; // Base score
    
    // Competition analysis
    if (product.competition_level) {
      const comp_level = product.competition_level.toLowerCase();
      if (comp_level.includes('low')) {
        score += 0.3;
      } else if (comp_level.includes('medium')) {
        score += 0.1;
      } else if (comp_level.includes('high')) {
        score -= 0.2;
      }
    }
    
    // Sales volume sweet spot
    const monthly_sales = product.monthly_sales || 0;
    if (monthly_sales) {
      if (monthly_sales >= 5000 && monthly_sales <= 25000) {
        score += 0.2; // Sweet spot
      } else if (monthly_sales >= 1000 && monthly_sales < 5000) {
        score += 0.3; // Growing market
      } else if (monthly_sales > 25000) {
        score -= 0.1; // Saturated
      }
    }
    
    return Math.max(0.0, Math.min(1.0, score));
  }

  private calculate_trend_momentum_score(product: ProductMetrics): number {
    let score = 0.5; // Base score
    
    // Growth rate
    const growth_rate = product.growth_rate || 0;
    if (growth_rate) {
      if (growth_rate > 20) {
        score += 0.4;
      } else if (growth_rate > 10) {
        score += 0.2;
      } else if (growth_rate < -10) {
        score -= 0.3;
      }
    }
    
    // Trend score from FastMoss
    const trend_score = product.trend_score || 0;
    if (trend_score) {
      score += Math.min(0.3, trend_score / 100.0 * 0.3);
    }
    
    return Math.max(0.0, Math.min(1.0, score));
  }

  private calculate_conversion_likelihood_score(product: ProductMetrics): number {
    let score = 0.5; // Base score
    
    // Price point optimization
    const price = product.price || 0;
    if (price) {
      if (price >= 15 && price <= 40) {
        score += 0.3; // Sweet spot
      } else if (price > 40 && price <= 80) {
        score += 0.1; // Good
      } else if (price > 100) {
        score -= 0.2; // High resistance
      }
    }
    
    // Rating impact
    const rating = product.rating || 0;
    if (rating) {
      if (rating >= 4.7) {
        score += 0.2;
      } else if (rating >= 4.5) {
        score += 0.1;
      } else if (rating < 4.0) {
        score -= 0.2;
      }
    }
    
    // Category appeal
    const category = this.categorize_product(product.name).toLowerCase();
    const high_appeal_categories = ['beauty', 'health', 'tech', 'fitness'];
    if (high_appeal_categories.some(cat => category.includes(cat))) {
      score += 0.1;
    }
    
    return Math.max(0.0, Math.min(1.0, score));
  }

  private generate_recommendation(product: ProductMetrics, score: number): string {
    if (score >= 0.8) {
      return "🚀 IMMEDIATE OPPORTUNITY - Create content ASAP";
    } else if (score >= 0.6) {
      return "⭐ HIGH POTENTIAL - Strong candidate for content creation";
    } else if (score >= 0.4) {
      return "💡 MODERATE POTENTIAL - Consider if matches your niche";
    } else {
      return "⚠️ LOW PRIORITY - Better opportunities available";
    }
  }

  // Utility parsing methods
  private normalize_product_name(name: string): string {
    if (!name) return '';
    // Remove common variations and normalize
    const normalized = name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    return normalized.substring(0, 50); // Limit length
  }

  private parse_price(price_text: string | undefined): number {
    if (!price_text) return 0.0;
    try {
      // Remove currency symbols and extract number
      const price_match = String(price_text).replace(/,/g, '').match(/[\d]+\.?\d*/);
      return price_match ? parseFloat(price_match[0]) : 0.0;
    } catch {
      return 0.0;
    }
  }

  private parse_percentage(percent_text: string | undefined): number {
    if (!percent_text) return 0.0;
    try {
      const percent_match = String(percent_text).match(/([\d.]+)/);
      return percent_match ? parseFloat(percent_match[1]) : 0.0;
    } catch {
      return 0.0;
    }
  }

  private parse_number(number_text: string | undefined): number {
    if (!number_text) return 0;
    try {
      // Handle k, m suffixes
      let text = String(number_text).toLowerCase().replace(/,/g, '');
      let multiplier = 1;
      
      if (text.includes('k')) {
        multiplier = 1000;
        text = text.replace('k', '');
      } else if (text.includes('m')) {
        multiplier = 1000000;
        text = text.replace('m', '');
      }
      
      const number_match = text.match(/([\d.]+)/);
      if (number_match) {
        return Math.floor(parseFloat(number_match[1]) * multiplier);
      }
      return 0;
    } catch {
      return 0;
    }
  }

  private parse_rating(rating_text: string | undefined): number {
    if (!rating_text) return 0.0;
    try {
      const rating_match = String(rating_text).match(/([\d.]+)/);
      let rating = rating_match ? parseFloat(rating_match[1]) : 0.0;
      // Normalize to 5-star scale if needed
      if (rating > 5) {
        rating = rating / 2; // Convert from 10-point scale
      }
      return rating;
    } catch {
      return 0.0;
    }
  }

  private calculate_profit_per_sale(product: ProductMetrics): number | undefined {
    const price = product.price || 0;
    const commission = product.commission || 0;
    
    if (price && commission) {
      return price * (commission / 100);
    }
    return undefined;
  }

  private contains_blacklisted_keywords(name: string): boolean {
    const name_lower = name.toLowerCase();
    return this.criteria.blacklisted_keywords.some(keyword => name_lower.includes(keyword));
  }

  private categorize_product(name: string): string {
    const name_lower = name.toLowerCase();
    
    const category_keywords: Record<string, string[]> = {
      beauty: ['beauty', 'makeup', 'skincare', 'cosmetic', 'serum', 'cream', 'mask'],
      health: ['health', 'wellness', 'supplement', 'vitamin', 'detox', 'cleanse'],
      fitness: ['fitness', 'workout', 'protein', 'gym', 'exercise', 'muscle'],
      tech: ['tech', 'gadget', 'device', 'phone', 'electronic', 'smart', 'wireless'],
      home: ['home', 'kitchen', 'house', 'cleaning', 'organization', 'decor'],
      fashion: ['fashion', 'clothing', 'shoes', 'accessories', 'jewelry', 'style']
    };
    
    for (const [category, keywords] of Object.entries(category_keywords)) {
      if (keywords.some(keyword => name_lower.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  }

  private detect_viral_indicators(name: string): string[] {
    const name_lower = name.toLowerCase();
    const found: string[] = [];
    
    for (const indicator of this.viral_keywords) {
      if (name_lower.includes(indicator)) {
        found.push(indicator);
      }
    }
    
    return found;
  }

  private calculate_controversy_potential(name: string): number {
    const controversy_keywords = [
      'secret', 'hidden', 'banned', 'suppressed', 'forbidden',
      'ancient', 'underground', 'conspiracy', 'truth', 'exposed',
      'doctors hate', 'industry', 'big pharma', 'government'
    ];
    
    const name_lower = name.toLowerCase();
    let score = 0.0;
    
    for (const keyword of controversy_keywords) {
      if (name_lower.includes(keyword)) {
        score += 0.2;
      }
    }
    
    return Math.min(1.0, score);
  }

  private generate_content_angles(product: ProductMetrics): string[] {
    const angles: string[] = [];
    const category = this.categorize_product(product.name);
    const name = product.name;
    
    // Category-specific angles
    if (category === 'beauty') {
      angles.push(
        `I tested ${name} for 30 days - shocking results`,
        `Why beauty brands don't want you to know about ${name}`,
        `The ${name} that changed my skin forever`
      );
    } else if (category === 'health') {
      angles.push(
        `Doctors don't want you to know about ${name}`,
        `The ${name} that Big Pharma tried to suppress`,
        `Ancient secret: ${name} revealed`
      );
    } else if (category === 'tech') {
      angles.push(
        `Big Tech tried to hide ${name}`,
        `The ${name} Apple doesn't want you to have`,
        `Why tech companies fear ${name}`
      );
    }
    
    // Generic viral angles
    angles.push(
      `You weren't meant to know about ${name}`,
      `The truth about ${name} will shock you`,
      `Everyone's buying ${name} except you`
    );
    
    return angles.slice(0, 5); // Return top 5
  }

  private determine_target_audience(product: ProductMetrics): string {
    const category = this.categorize_product(product.name);
    const price = product.price || 0;
    
    const audience_map: Record<string, string> = {
      beauty: 'Women 18-35, skincare enthusiasts',
      health: 'Health-conscious 25-50, wellness seekers',
      fitness: 'Fitness enthusiasts 20-40, gym-goers',
      tech: 'Tech lovers 18-45, early adopters',
      home: 'Homeowners 25-55, organization lovers'
    };
    
    let base_audience = audience_map[category] || 'General audience 18-45';
    
    // Adjust for price point
    if (price > 50) {
      base_audience += ', higher income';
    } else if (price < 20) {
      base_audience += ', budget-conscious';
    }
    
    return base_audience;
  }

  private estimate_click_through_rate(product: ProductMetrics & { viral_indicators?: string[], controversy_potential?: number }): number {
    let base_ctr = 0.03; // 3% base CTR
    
    // Adjust for viral indicators
    const viral_count = product.viral_indicators?.length || 0;
    base_ctr += viral_count * 0.005;
    
    // Adjust for controversy
    const controversy = product.controversy_potential || 0;
    base_ctr += controversy * 0.02;
    
    // Adjust for price point
    const price = product.price || 0;
    if (price >= 15 && price <= 40) {
      base_ctr += 0.01; // Sweet spot bonus
    }
    
    return Math.min(0.15, base_ctr); // Cap at 15%
  }

  private assess_market_saturation(product: ProductMetrics): string {
    const monthly_sales = product.monthly_sales || 0;
    const competition = (product.competition_level || '').toLowerCase();
    
    if (competition.includes('high') || monthly_sales > 30000) {
      return 'High';
    } else if (competition.includes('medium') || (monthly_sales >= 10000 && monthly_sales <= 30000)) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }

  private hash_string(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  async export_analysis_report(products: EnrichedProduct[], filename?: string): Promise<string> {
    if (!filename) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                       new Date().toTimeString().split(' ')[0].replace(/:/g, '');
      filename = `data/product_analysis_${timestamp}.json`;
    }
    
    // Create comprehensive report
    const report: AnalysisReport = {
      analysis_timestamp: new Date().toISOString(),
      criteria_used: this.criteria,
      total_products_analyzed: products.length,
      top_opportunities: products.slice(0, 10), // Top 10
      category_breakdown: this.get_category_breakdown(products),
      scoring_summary: this.get_scoring_summary(products)
    };
    
    try {
      // In a browser environment, we would use different storage
      console.log('Analysis report generated:', report);
      return filename;
    } catch (e) {
      console.error('Failed to export report:', e);
      return '';
    }
  }

  private get_category_breakdown(products: EnrichedProduct[]): Record<string, CategoryBreakdown> {
    const breakdown: Record<string, CategoryBreakdown> = {};
    
    for (const product of products) {
      const category = product.category || 'other';
      if (!breakdown[category]) {
        breakdown[category] = {
          count: 0,
          avg_score: 0,
          top_product: null
        };
      }
      breakdown[category].count += 1;
    }
    
    // Calculate averages and find top products
    for (const category in breakdown) {
      const category_products = products.filter(p => p.category === category);
      if (category_products.length > 0) {
        breakdown[category].avg_score = category_products.reduce((sum, p) => sum + (p.opportunity_score || 0), 0) / category_products.length;
        const top_product = category_products.reduce((max, p) => (p.opportunity_score || 0) > (max.opportunity_score || 0) ? p : max);
        breakdown[category].top_product = top_product.name;
      }
    }
    
    return breakdown;
  }

  private get_scoring_summary(products: EnrichedProduct[]): ScoringSummary {
    if (products.length === 0) {
      return {
        highest_score: 0,
        lowest_score: 0,
        average_score: 0,
        products_above_80: 0,
        products_above_60: 0
      };
    }
    
    const scores = products.map(p => p.opportunity_score || 0);
    return {
      highest_score: Math.max(...scores),
      lowest_score: Math.min(...scores),
      average_score: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      products_above_80: scores.filter(s => s >= 0.8).length,
      products_above_60: scores.filter(s => s >= 0.6).length
    };
  }
}