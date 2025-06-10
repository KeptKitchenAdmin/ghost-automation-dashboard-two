export interface ProductCategory {
  id: string;
  name: string;
  subcategories: ProductSubcategory[];
  targetDemographics: string[];
  averagePrice: PriceRange;
  popularityScore: number;
  trendinessScore: number;
  contentPotential: number;
}

export interface ProductSubcategory {
  id: string;
  name: string;
  keywords: string[];
  contentAngles: string[];
  painPoints: string[];
  benefits: string[];
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface CategoryInsight {
  category: string;
  opportunity: 'high' | 'medium' | 'low';
  reasoning: string;
  recommendedApproach: string;
  contentIdeas: string[];
}

export class UniversalProductCategories {
  private categories: Record<string, ProductCategory>;
  private trendingProducts: Map<string, number>;

  constructor() {
    this.categories = {
      health_wellness: {
        id: 'health_wellness',
        name: 'Health & Wellness',
        subcategories: [
          {
            id: 'supplements',
            name: 'Dietary Supplements',
            keywords: ['protein', 'vitamins', 'minerals', 'omega-3', 'probiotics'],
            contentAngles: ['before/after', 'daily routine', 'expert recommendation', 'scientific backing'],
            painPoints: ['energy loss', 'poor sleep', 'weak immunity', 'muscle recovery'],
            benefits: ['increased energy', 'better sleep', 'stronger immune system', 'faster recovery']
          },
          {
            id: 'fitness_equipment',
            name: 'Fitness Equipment',
            keywords: ['resistance bands', 'dumbbells', 'yoga mat', 'foam roller', 'kettlebell'],
            contentAngles: ['home workout', 'space-saving', 'beginner-friendly', 'professional results'],
            painPoints: ['gym costs', 'time constraints', 'equipment storage', 'workout variety'],
            benefits: ['convenience', 'cost savings', 'privacy', 'flexible scheduling']
          }
        ],
        targetDemographics: ['fitness enthusiasts', 'health-conscious adults', 'busy professionals'],
        averagePrice: { min: 15, max: 200, currency: 'USD' },
        popularityScore: 95,
        trendinessScore: 88,
        contentPotential: 92
      },

      beauty_skincare: {
        id: 'beauty_skincare',
        name: 'Beauty & Skincare',
        subcategories: [
          {
            id: 'skincare_products',
            name: 'Skincare Products',
            keywords: ['serum', 'moisturizer', 'cleanser', 'sunscreen', 'retinol'],
            contentAngles: ['skin transformation', 'routine reveal', 'ingredient education', 'dermatologist approved'],
            painPoints: ['acne', 'aging signs', 'dry skin', 'sensitivity', 'uneven tone'],
            benefits: ['clear skin', 'youthful appearance', 'hydration', 'protection', 'confidence']
          },
          {
            id: 'makeup_tools',
            name: 'Makeup & Tools',
            keywords: ['foundation', 'concealer', 'brushes', 'palette', 'lipstick'],
            contentAngles: ['makeup tutorial', 'tool comparison', 'look recreation', 'budget vs luxury'],
            painPoints: ['poor application', 'color matching', 'longevity', 'tool quality'],
            benefits: ['flawless finish', 'perfect match', 'long-lasting', 'professional results']
          }
        ],
        targetDemographics: ['young women', 'beauty enthusiasts', 'professionals', 'content creators'],
        averagePrice: { min: 10, max: 150, currency: 'USD' },
        popularityScore: 93,
        trendinessScore: 85,
        contentPotential: 96
      },

      tech_gadgets: {
        id: 'tech_gadgets',
        name: 'Tech & Gadgets',
        subcategories: [
          {
            id: 'smart_devices',
            name: 'Smart Devices',
            keywords: ['smartwatch', 'earbuds', 'tablet', 'smart home', 'fitness tracker'],
            contentAngles: ['unboxing', 'feature demo', 'comparison', 'life integration'],
            painPoints: ['outdated tech', 'complexity', 'compatibility', 'battery life'],
            benefits: ['convenience', 'efficiency', 'connectivity', 'modern lifestyle']
          },
          {
            id: 'accessories',
            name: 'Tech Accessories',
            keywords: ['phone case', 'charger', 'stand', 'cable', 'adapter'],
            contentAngles: ['protection demo', 'convenience showcase', 'durability test', 'aesthetic appeal'],
            painPoints: ['device damage', 'charging issues', 'organization', 'compatibility'],
            benefits: ['protection', 'convenience', 'organization', 'style']
          }
        ],
        targetDemographics: ['tech enthusiasts', 'young professionals', 'students', 'early adopters'],
        averagePrice: { min: 20, max: 500, currency: 'USD' },
        popularityScore: 89,
        trendinessScore: 94,
        contentPotential: 88
      },

      home_lifestyle: {
        id: 'home_lifestyle',
        name: 'Home & Lifestyle',
        subcategories: [
          {
            id: 'home_decor',
            name: 'Home Decor',
            keywords: ['wall art', 'plants', 'lighting', 'storage', 'furniture'],
            contentAngles: ['room transformation', 'aesthetic creation', 'organization hacks', 'DIY projects'],
            painPoints: ['cluttered space', 'poor lighting', 'lack of style', 'limited space'],
            benefits: ['beautiful space', 'better mood', 'organization', 'comfort']
          },
          {
            id: 'kitchen_gadgets',
            name: 'Kitchen Gadgets',
            keywords: ['air fryer', 'blender', 'coffee maker', 'meal prep', 'storage'],
            contentAngles: ['recipe creation', 'time-saving demo', 'healthy cooking', 'kitchen tour'],
            painPoints: ['meal prep time', 'unhealthy eating', 'kitchen clutter', 'cooking skills'],
            benefits: ['quick meals', 'healthy options', 'space efficiency', 'cooking confidence']
          }
        ],
        targetDemographics: ['homeowners', 'renters', 'cooking enthusiasts', 'organization lovers'],
        averagePrice: { min: 25, max: 300, currency: 'USD' },
        popularityScore: 78,
        trendinessScore: 72,
        contentPotential: 81
      },

      fashion_accessories: {
        id: 'fashion_accessories',
        name: 'Fashion & Accessories',
        subcategories: [
          {
            id: 'clothing',
            name: 'Clothing',
            keywords: ['dress', 'jeans', 'shoes', 'jacket', 'activewear'],
            contentAngles: ['outfit styling', 'try-on haul', 'seasonal trends', 'versatile pieces'],
            painPoints: ['outdated wardrobe', 'poor fit', 'limited budget', 'style confusion'],
            benefits: ['confidence boost', 'perfect fit', 'style variety', 'value for money']
          },
          {
            id: 'accessories',
            name: 'Fashion Accessories',
            keywords: ['jewelry', 'bags', 'watches', 'sunglasses', 'belts'],
            contentAngles: ['accessory styling', 'luxury vs budget', 'versatility demo', 'trend spotlight'],
            painPoints: ['boring outfits', 'lack of accessories', 'quality concerns', 'style matching'],
            benefits: ['outfit elevation', 'personal style', 'quality pieces', 'confidence']
          }
        ],
        targetDemographics: ['fashion enthusiasts', 'young adults', 'professionals', 'trend followers'],
        averagePrice: { min: 15, max: 250, currency: 'USD' },
        popularityScore: 86,
        trendinessScore: 91,
        contentPotential: 89
      }
    };

    this.trendingProducts = new Map([
      ['air fryer', 95],
      ['LED strip lights', 88],
      ['wireless earbuds', 92],
      ['skincare serum', 90],
      ['resistance bands', 85],
      ['phone case', 78],
      ['coffee maker', 82],
      ['yoga mat', 80]
    ]);
  }

  getCategoryByName(categoryName: string): ProductCategory | null {
    return this.categories[categoryName] || null;
  }

  getAllCategories(): ProductCategory[] {
    return Object.values(this.categories);
  }

  getSubcategoriesByCategory(categoryId: string): ProductSubcategory[] {
    const category = this.categories[categoryId];
    return category ? category.subcategories : [];
  }

  searchProducts(query: string): {
    categories: ProductCategory[];
    subcategories: ProductSubcategory[];
    relevanceScore: number;
  } {
    const queryLower = query.toLowerCase();
    const matchingCategories: ProductCategory[] = [];
    const matchingSubcategories: ProductSubcategory[] = [];
    let totalRelevance = 0;

    Object.values(this.categories).forEach(category => {
      let categoryRelevance = 0;

      // Check category name
      if (category.name.toLowerCase().includes(queryLower)) {
        categoryRelevance += 50;
      }

      // Check subcategories
      category.subcategories.forEach(sub => {
        let subRelevance = 0;

        if (sub.name.toLowerCase().includes(queryLower)) {
          subRelevance += 40;
        }

        // Check keywords
        const keywordMatches = sub.keywords.filter(keyword => 
          keyword.toLowerCase().includes(queryLower) || queryLower.includes(keyword.toLowerCase())
        );
        subRelevance += keywordMatches.length * 20;

        if (subRelevance > 0) {
          matchingSubcategories.push(sub);
          categoryRelevance += subRelevance;
        }
      });

      if (categoryRelevance > 0) {
        matchingCategories.push(category);
        totalRelevance += categoryRelevance;
      }
    });

    return {
      categories: matchingCategories,
      subcategories: matchingSubcategories,
      relevanceScore: Math.min(totalRelevance, 100)
    };
  }

  getCategoryInsights(categoryId: string): CategoryInsight {
    const category = this.categories[categoryId];
    if (!category) {
      throw new Error(`Category ${categoryId} not found`);
    }

    const opportunity = this.calculateOpportunity(category);
    const contentIdeas = this.generateContentIdeas(category);

    return {
      category: category.name,
      opportunity,
      reasoning: this.getOpportunityReasoning(category, opportunity),
      recommendedApproach: this.getRecommendedApproach(category, opportunity),
      contentIdeas
    };
  }

  getTrendingProducts(limit: number = 10): Array<{name: string, score: number}> {
    return Array.from(this.trendingProducts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([name, score]) => ({ name, score }));
  }

  suggestContentAngles(productKeywords: string[]): {
    angles: string[];
    hooks: string[];
    painPoints: string[];
    benefits: string[];
  } {
    const allAngles: string[] = [];
    const allHooks: string[] = [];
    const allPainPoints: string[] = [];
    const allBenefits: string[] = [];

    Object.values(this.categories).forEach(category => {
      category.subcategories.forEach(sub => {
        const hasMatch = productKeywords.some(keyword => 
          sub.keywords.some(subKeyword => 
            subKeyword.toLowerCase().includes(keyword.toLowerCase())
          )
        );

        if (hasMatch) {
          allAngles.push(...sub.contentAngles);
          allPainPoints.push(...sub.painPoints);
          allBenefits.push(...sub.benefits);
        }
      });
    });

    // Generate hooks based on pain points and benefits
    allPainPoints.forEach(pain => {
      allHooks.push(`Stop struggling with ${pain}`);
      allHooks.push(`The secret to overcoming ${pain}`);
    });

    allBenefits.forEach(benefit => {
      allHooks.push(`Finally achieve ${benefit}`);
      allHooks.push(`This changed my ${benefit} game`);
    });

    // Remove duplicates and limit results
    return {
      angles: [...new Set(allAngles)].slice(0, 8),
      hooks: [...new Set(allHooks)].slice(0, 10),
      painPoints: [...new Set(allPainPoints)].slice(0, 6),
      benefits: [...new Set(allBenefits)].slice(0, 6)
    };
  }

  getCompetitorAnalysis(categoryId: string): {
    competitionLevel: 'low' | 'medium' | 'high';
    marketSaturation: number;
    opportunities: string[];
    threats: string[];
  } {
    const category = this.categories[categoryId];
    if (!category) {
      throw new Error(`Category ${categoryId} not found`);
    }

    const competitionLevel = this.determineCompetitionLevel(category);
    const marketSaturation = this.calculateMarketSaturation(category);

    return {
      competitionLevel,
      marketSaturation,
      opportunities: this.identifyOpportunities(category),
      threats: this.identifyThreats(category)
    };
  }

  private calculateOpportunity(category: ProductCategory): 'high' | 'medium' | 'low' {
    const score = (category.popularityScore + category.trendinessScore + category.contentPotential) / 3;
    
    if (score >= 85) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  }

  private getOpportunityReasoning(category: ProductCategory, opportunity: string): string {
    const reasons = [];
    
    if (category.popularityScore > 85) {
      reasons.push('high consumer demand');
    }
    
    if (category.trendinessScore > 85) {
      reasons.push('currently trending');
    }
    
    if (category.contentPotential > 85) {
      reasons.push('excellent content creation potential');
    }

    return `${opportunity.charAt(0).toUpperCase() + opportunity.slice(1)} opportunity due to ${reasons.join(', ')}.`;
  }

  private getRecommendedApproach(category: ProductCategory, opportunity: string): string {
    const approaches = {
      high: 'Aggressive content creation with focus on trending formats and viral potential',
      medium: 'Consistent content with emphasis on education and value delivery',
      low: 'Niche-focused approach with deep expertise and community building'
    };

    return approaches[opportunity as keyof typeof approaches];
  }

  private generateContentIdeas(category: ProductCategory): string[] {
    const ideas: string[] = [];
    
    category.subcategories.forEach(sub => {
      sub.contentAngles.forEach(angle => {
        ideas.push(`${angle} featuring ${sub.name.toLowerCase()}`);
      });
    });

    // Add category-specific ideas
    ideas.push(`${category.name} haul and honest reviews`);
    ideas.push(`Budget vs luxury ${category.name.toLowerCase()} comparison`);
    ideas.push(`${category.name} mistakes everyone makes`);
    ideas.push(`My ${category.name.toLowerCase()} routine that changed everything`);

    return ideas.slice(0, 12);
  }

  private determineCompetitionLevel(category: ProductCategory): 'low' | 'medium' | 'high' {
    if (category.popularityScore > 90) return 'high';
    if (category.popularityScore > 75) return 'medium';
    return 'low';
  }

  private calculateMarketSaturation(category: ProductCategory): number {
    // Simplified calculation based on popularity and trending scores
    return Math.min((category.popularityScore + category.trendinessScore) / 2, 100);
  }

  private identifyOpportunities(category: ProductCategory): string[] {
    const opportunities = [];
    
    if (category.trendinessScore > 85) {
      opportunities.push('Ride the current trend wave for maximum visibility');
    }
    
    if (category.contentPotential > 85) {
      opportunities.push('High viral content potential');
    }
    
    if (category.averagePrice.max > 100) {
      opportunities.push('High-value affiliate commissions available');
    }

    opportunities.push('Growing market with engaged audience');
    opportunities.push('Multiple content angle possibilities');

    return opportunities;
  }

  private identifyThreats(category: ProductCategory): string[] {
    const threats = [];
    
    if (category.popularityScore > 90) {
      threats.push('High competition from established creators');
    }
    
    if (category.trendinessScore < 70) {
      threats.push('Declining trend interest');
    }
    
    threats.push('Market saturation in popular niches');
    threats.push('Constant need for fresh content angles');

    return threats;
  }
}

// Export singleton instance
export const universalProductCategories = new UniversalProductCategories();