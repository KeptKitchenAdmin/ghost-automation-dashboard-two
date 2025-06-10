/**
 * Supplement Pain Point & Ingredient Matching Engine
 * High-converting supplement video generation targeting American health epidemics
 * Revenue potential: $10k-$60k per viral video
 */

export enum AmericanPainPoint {
  CHRONIC_FATIGUE = "chronic_fatigue",
  SLEEP_EPIDEMIC = "sleep_epidemic",
  BRAIN_FOG_MEMORY = "brain_fog_memory",
  METABOLIC_DAMAGE = "metabolic_damage",
  ANXIETY_DEPRESSION = "anxiety_depression",
  CHRONIC_INFLAMMATION = "chronic_inflammation",
  HORMONAL_IMBALANCE = "hormonal_imbalance"
}

export interface IngredientMatch {
  pain_point: AmericanPainPoint;
  match_score: number;  // 0-100 percentage
  matched_ingredients: string[];
  mechanism: string;
  suggested_hook: string;
  emotional_triggers: string[];
  viral_potential: number;
  revenue_potential: number;
}

export interface SupplementAnalysis {
  product_id: string;
  product_name: string;
  best_pain_point_match: IngredientMatch;
  all_matches: IngredientMatch[];
  viral_score: number;
  revenue_estimate: number;
  content_priority: string;
  suggested_script_elements: Record<string, any>;
}

interface PainPointData {
  primary_ingredients: string[];
  mechanism: string;
  statistical_hook: string;
  emotional_hooks: string[];
  emotional_amplification: string[];
  american_specificity: string;
  demographic_impact: number;
  viral_potential: number;
  revenue_multiplier: number;
}

export class PainPointDatabase {
  public pain_points: Record<AmericanPainPoint, PainPointData>;
  public mechanism_explanations: Record<string, Partial<Record<AmericanPainPoint, string>>>;

  constructor() {
    this.pain_points = {
      [AmericanPainPoint.CHRONIC_FATIGUE]: {
        primary_ingredients: [
          "CoQ10", "B-Complex", "Iron", "Vitamin D3", "Rhodiola Rosea",
          "Cordyceps", "NAD+", "PQQ", "Ribose", "Magnesium", "B12",
          "Adaptogens", "Ginseng", "Ashwagandha"
        ],
        mechanism: "mitochondrial_energy_production",
        statistical_hook: "73% of Americans are exhausted by 2pm every single day",
        emotional_hooks: [
          "Why are 80% of Americans exhausted by 2pm every day?",
          "Your ancestors worked 12-hour days and weren't this tired",
          "This is why you're more tired than your grandparents ever were",
          "The energy crisis isn't just about gas prices"
        ],
        emotional_amplification: [
          "You're drinking 3 cups of coffee just to feel human",
          "You're canceling plans because you're too exhausted to socialize",
          "Your kids think you're lazy but you're actually dying inside",
          "You feel guilty for being tired when you 'should' have energy"
        ],
        american_specificity: "corporate_exhaustion_epidemic",
        demographic_impact: 73,
        viral_potential: 95,
        revenue_multiplier: 1.4
      },

      [AmericanPainPoint.SLEEP_EPIDEMIC]: {
        primary_ingredients: [
          "Magnesium Glycinate", "L-Theanine", "GABA", "Melatonin",
          "Valerian Root", "Passionflower", "Ashwagandha", "Glycine",
          "Chamomile", "5-HTP", "Tart Cherry", "Lemon Balm"
        ],
        mechanism: "nervous_system_calm_cortisol_reduction",
        statistical_hook: "68% of Americans can't fall asleep naturally anymore",
        emotional_hooks: [
          "70% of Americans can't sleep naturally anymore - here's why",
          "Your phone isn't the only thing keeping you awake",
          "This is what 60 years of processed food did to your sleep",
          "Why melatonin stopped working for you"
        ],
        emotional_amplification: [
          "You're lying awake replaying every mistake you've ever made",
          "You're too wired to sleep but too tired to function",
          "You dread bedtime because you know you'll just stare at the ceiling",
          "You wake up more tired than when you went to bed"
        ],
        american_specificity: "stress_cortisol_epidemic",
        demographic_impact: 68,
        viral_potential: 92,
        revenue_multiplier: 1.3
      },

      [AmericanPainPoint.BRAIN_FOG_MEMORY]: {
        primary_ingredients: [
          "Lion's Mane", "Alpha-GPC", "Phosphatidylserine", "Omega-3 DHA",
          "Bacopa Monnieri", "Ginkgo Biloba", "Huperzine A", "PQQ",
          "Acetyl-L-Carnitine", "Rhodiola", "MCT Oil", "Curcumin"
        ],
        mechanism: "neuroplasticity_acetylcholine_brain_derived_neurotrophic_factor",
        statistical_hook: "Over 40% of Americans under 40 have memory problems",
        emotional_hooks: [
          "Can't remember where you put your keys 5 minutes ago?",
          "Your brain isn't aging - it's being poisoned",
          "Why your focus is worse than a goldfish",
          "The cognitive decline epidemic they don't want you to know about"
        ],
        emotional_amplification: [
          "You feel stupid in meetings when you used to be sharp",
          "You can't finish sentences without forgetting what you were saying",
          "You're embarrassed by your memory in front of coworkers",
          "You feel like your intelligence is slipping away"
        ],
        american_specificity: "digital_brain_damage",
        demographic_impact: 42,
        viral_potential: 88,
        revenue_multiplier: 1.5
      },

      [AmericanPainPoint.METABOLIC_DAMAGE]: {
        primary_ingredients: [
          "Berberine", "Chromium", "Alpha Lipoic Acid", "Cinnamon Extract",
          "Green Tea EGCG", "Bitter Melon", "Gymnema Sylvestre", "Vanadium",
          "White Kidney Bean", "Forskolin", "CLA", "Green Coffee Bean"
        ],
        mechanism: "insulin_sensitivity_glucose_metabolism_mitochondrial_function",
        statistical_hook: "Only 12% of Americans have healthy metabolism",
        emotional_hooks: [
          "Why Americans gain weight eating the same calories as skinny Europeans",
          "Your metabolism was sabotaged before you were born",
          "This is why your grandma stayed thin eating butter and cream",
          "The real reason 73% of Americans are overweight"
        ],
        emotional_amplification: [
          "You're eating less than your thin friends but still gaining weight",
          "You avoid mirrors and photos of yourself",
          "You're buying bigger clothes every few months",
          "You feel betrayed by your own body"
        ],
        american_specificity: "processed_food_metabolic_destruction",
        demographic_impact: 88,
        viral_potential: 94,
        revenue_multiplier: 1.6
      },

      [AmericanPainPoint.ANXIETY_DEPRESSION]: {
        primary_ingredients: [
          "Ashwagandha", "L-Theanine", "GABA", "Magnesium", "5-HTP",
          "SAM-e", "Rhodiola", "Holy Basil", "Lemon Balm", "Passionflower",
          "St. John's Wort", "Inositol", "Taurine"
        ],
        mechanism: "cortisol_regulation_neurotransmitter_balance_HPA_axis",
        statistical_hook: "Anxiety rates tripled in the last 20 years",
        emotional_hooks: [
          "Why anxiety and depression rates tripled in 20 years",
          "Your mental health crisis has a physical cause",
          "This deficiency is making 40% of Americans depressed",
          "Why therapy isn't fixing your anxiety"
        ],
        emotional_amplification: [
          "Your heart races over things that shouldn't matter",
          "You're avoiding situations you used to enjoy",
          "You feel like you're going crazy but all your tests are 'normal'",
          "You're exhausted from worrying about everything"
        ],
        american_specificity: "stress_anxiety_epidemic",
        demographic_impact: 45,
        viral_potential: 90,
        revenue_multiplier: 1.3
      },

      [AmericanPainPoint.CHRONIC_INFLAMMATION]: {
        primary_ingredients: [
          "Curcumin", "Omega-3 EPA", "Quercetin", "Resveratrol",
          "Boswellia", "Ginger", "Tart Cherry", "Green Tea EGCG",
          "Bromelain", "MSM", "Frankincense", "Black Pepper Extract"
        ],
        mechanism: "inflammatory_pathway_inhibition_antioxidant_protection",
        statistical_hook: "90% of American diseases are caused by chronic inflammation",
        emotional_hooks: [
          "This is in 90% of American foods and its slowly killing you",
          "Why your joints hurt more than your parents' did at your age",
          "The inflammation epidemic destroying American health",
          "Why young people have arthritis now"
        ],
        emotional_amplification: [
          "You wake up stiff and sore every morning",
          "Your joints ache when the weather changes",
          "You feel older than your age",
          "You're popping ibuprofen like candy"
        ],
        american_specificity: "inflammatory_food_epidemic",
        demographic_impact: 90,
        viral_potential: 87,
        revenue_multiplier: 1.2
      },

      [AmericanPainPoint.HORMONAL_IMBALANCE]: {
        primary_ingredients: [
          "DIM", "Vitex", "Maca Root", "Ashwagandha", "Zinc",
          "Vitamin D3", "Magnesium", "Omega-3", "Evening Primrose",
          "Black Cohosh", "Red Clover", "DHEA", "Pregnenolone"
        ],
        mechanism: "hormone_production_detoxification_endocrine_support",
        statistical_hook: "80% of American women have hormonal imbalances",
        emotional_hooks: [
          "Why your hormones are more damaged than your grandparents ever were",
          "This is what birth control and processed food did to your hormones",
          "Why American women feel crazy during their cycles",
          "The endocrine disruption epidemic"
        ],
        emotional_amplification: [
          "You feel like a different person depending on the week",
          "Your mood swings are destroying your relationships",
          "You don't recognize yourself anymore",
          "You feel broken and unfixable"
        ],
        american_specificity: "endocrine_disruption_epidemic",
        demographic_impact: 75,
        viral_potential: 85,
        revenue_multiplier: 1.4
      }
    };

    // Mechanism explanations for ingredients
    this.mechanism_explanations = {
      'CoQ10': {
        [AmericanPainPoint.CHRONIC_FATIGUE]: 'powers your cellular energy factories (mitochondria) that have been damaged by processed food and stress'
      },
      'Magnesium Glycinate': {
        [AmericanPainPoint.SLEEP_EPIDEMIC]: 'calms your overactive nervous system and reduces the cortisol keeping you wired at night'
      },
      "Lion's Mane": {
        [AmericanPainPoint.BRAIN_FOG_MEMORY]: 'regenerates brain cells and rebuilds the neural pathways damaged by inflammation'
      },
      'Berberine': {
        [AmericanPainPoint.METABOLIC_DAMAGE]: 'resets your insulin sensitivity and repairs the metabolic damage from decades of processed food'
      },
      'Ashwagandha': {
        [AmericanPainPoint.ANXIETY_DEPRESSION]: 'regulates cortisol and rebalances the stress hormones wreaking havoc on your mental health'
      },
      'Curcumin': {
        [AmericanPainPoint.CHRONIC_INFLAMMATION]: 'shuts down the inflammatory pathways causing 90% of American diseases'
      },
      'DIM': {
        [AmericanPainPoint.HORMONAL_IMBALANCE]: 'helps your liver detox excess estrogen and rebalance your hormones naturally'
      }
    };
  }
}

export class SupplementPainPointEngine {
  private pain_point_db: PainPointDatabase;
  private emotional_weights: Record<string, number>;
  private american_pain_triggers: Record<string, number>;

  constructor() {
    this.pain_point_db = new PainPointDatabase();

    // Emotional trigger weights for viral potential
    this.emotional_weights = {
      shame: 35,        // Weight, memory, energy shame
      fear: 30,         // Health decline, aging, disease
      frustration: 25,  // Nothing working, feeling broken
      hope: 10          // Possibility of healing
    };

    // American-specific targeting
    this.american_pain_triggers = {
      workplace_suffering: 40,   // Corporate exhaustion, brain fog at work
      social_isolation: 30,      // Too tired/anxious to socialize
      family_guilt: 20,          // Can't be present for kids/spouse
      identity_loss: 10          // Not feeling like yourself anymore
    };
  }

  analyzeSupplementProduct(product: Record<string, any>): SupplementAnalysis | null {
    try {
      console.log(`Analyzing supplement: ${product.name || 'Unknown'}`);

      // Extract product ingredients
      const ingredients = this.extractIngredients(product);

      // Match to all pain points
      const all_matches: IngredientMatch[] = [];
      for (const pain_point of Object.values(AmericanPainPoint)) {
        const match = this.matchProductToPainPoint(product, pain_point, ingredients);
        if (match.match_score >= 30) {  // Only include decent matches
          all_matches.push(match);
        }
      }

      // Sort by match score and select best
      all_matches.sort((a, b) => b.match_score - a.match_score);
      const best_match = all_matches[0];

      if (!best_match) {
        console.warn(`No good pain point matches for ${product.name}`);
        return null;
      }

      // Calculate viral score and revenue
      const viral_score = this.calculateViralScore(product, best_match);
      const revenue_estimate = this.calculateRevenuePotential(product, best_match);

      // Generate script elements
      const script_elements = this.generateScriptElements(product, best_match);

      const analysis: SupplementAnalysis = {
        product_id: product.id || '',
        product_name: product.name || '',
        best_pain_point_match: best_match,
        all_matches,
        viral_score,
        revenue_estimate,
        content_priority: this.determinePriority(viral_score, revenue_estimate),
        suggested_script_elements: script_elements
      };

      console.log(`Analysis complete: ${analysis.product_name} - ${analysis.best_pain_point_match.pain_point} (viral: ${viral_score.toFixed(1)})`);
      return analysis;

    } catch (error) {
      console.error(`Supplement analysis failed:`, error);
      return null;
    }
  }

  private extractIngredients(product: Record<string, any>): string[] {
    const text = `${product.name || ''} ${product.description || ''} ${product.ingredients || ''}`.toLowerCase();

    // All possible supplement ingredients to detect
    const all_ingredients = new Set<string>();
    for (const pain_point_data of Object.values(this.pain_point_db.pain_points)) {
      pain_point_data.primary_ingredients.forEach(ing => all_ingredients.add(ing.toLowerCase()));
    }

    const found_ingredients: string[] = [];
    for (const ingredient of all_ingredients) {
      // Handle compound names like "Alpha-GPC"
      const ingredient_variants = [
        ingredient,
        ingredient.replace('-', ' '),
        ingredient.replace(' ', ''),
        ingredient.replace("'", '')
      ];

      for (const variant of ingredient_variants) {
        if (text.includes(variant)) {
          // Convert back to standard format
          let original = variant;
          for (const pain_data of Object.values(this.pain_point_db.pain_points)) {
            const found = pain_data.primary_ingredients.find(
              orig => orig.toLowerCase() === ingredient
            );
            if (found) {
              original = found;
              break;
            }
          }
          found_ingredients.push(original);
          break;
        }
      }
    }

    return [...new Set(found_ingredients)];  // Remove duplicates
  }

  private matchProductToPainPoint(
    product: Record<string, any>,
    pain_point: AmericanPainPoint,
    ingredients: string[]
  ): IngredientMatch {
    const pain_data = this.pain_point_db.pain_points[pain_point];
    const required_ingredients = pain_data.primary_ingredients;

    // Find matching ingredients
    const matched: string[] = [];
    for (const ingredient of ingredients) {
      if (required_ingredients.some(req => req.toLowerCase() === ingredient.toLowerCase())) {
        matched.push(ingredient);
      }
    }

    // Calculate match score
    let match_score = required_ingredients.length > 0 ? (matched.length / required_ingredients.length) * 100 : 0;

    // Boost score for primary ingredients
    let primary_boost = 0;
    if (matched.length > 0) {
      const primary_ingredients = required_ingredients.slice(0, 3);  // Top 3 most important
      for (const primary of primary_ingredients) {
        if (matched.some(m => m.toLowerCase() === primary.toLowerCase())) {
          primary_boost += 20;
        }
      }
    }

    const final_score = Math.min(match_score + primary_boost, 100);

    // Calculate viral and revenue potential
    const viral_potential = pain_data.viral_potential * (final_score / 100);
    const revenue_potential = this.estimateRevenueForPainPoint(product, pain_point, final_score);

    return {
      pain_point,
      match_score: final_score,
      matched_ingredients: matched,
      mechanism: pain_data.mechanism,
      suggested_hook: pain_data.emotional_hooks[0],  // Primary hook
      emotional_triggers: pain_data.emotional_amplification.slice(0, 2),  // Top 2 triggers
      viral_potential,
      revenue_potential
    };
  }

  private calculateViralScore(product: Record<string, any>, match: IngredientMatch): number {
    const factors = {
      pain_point_relatability: match.viral_potential,  // Base viral potential from pain point
      ingredient_match_strength: match.match_score,    // How well ingredients match
      price_impulse_factor: (product.price || 0) <= 80 ? 100 : 60,  // Under $80 = impulse buy
      commission_motivation: (product.commission || 0) >= 20 ? 100 : 70,  // High commission = more promotion
      market_saturation: (product.monthly_sales || 50000) < 30000 ? 100 : 50  // Not oversaturated
    };

    // Weighted viral score
    const viral_score = (
      factors.pain_point_relatability * 0.35 +
      factors.ingredient_match_strength * 0.25 +
      factors.price_impulse_factor * 0.20 +
      factors.commission_motivation * 0.15 +
      factors.market_saturation * 0.05
    );

    return Math.min(viral_score, 100);
  }

  private calculateRevenuePotential(product: Record<string, any>, match: IngredientMatch): number {
    const price = product.price || 0;
    const commission_rate = (product.commission || 0) / 100;
    const viral_score = this.calculateViralScore(product, match);

    // Base revenue per video calculation
    const commission_per_sale = price * commission_rate;

    // Estimated conversions based on viral score
    const estimated_views = (viral_score / 100) * 1000000;  // Up to 1M views for perfect viral score
    const conversion_rate = 0.08;  // 8% conversion rate for supplement content
    const estimated_sales = estimated_views * conversion_rate;

    let revenue_estimate = estimated_sales * commission_per_sale;

    // Apply pain point revenue multiplier
    const pain_data = this.pain_point_db.pain_points[match.pain_point];
    revenue_estimate *= pain_data.revenue_multiplier;

    return Math.min(revenue_estimate, 60000);  // Cap at $60k as specified
  }

  private estimateRevenueForPainPoint(
    product: Record<string, any>,
    pain_point: AmericanPainPoint,
    match_score: number
  ): number {
    const pain_data = this.pain_point_db.pain_points[pain_point];
    const base_revenue = 5000;  // Base $5k revenue potential

    // Apply demographic impact multiplier
    const demographic_multiplier = pain_data.demographic_impact / 50;  // Normalize to ~2x max

    // Apply match score multiplier
    const match_multiplier = match_score / 100;

    // Apply pain point specific revenue multiplier
    const pain_multiplier = pain_data.revenue_multiplier;

    const estimated_revenue = base_revenue * demographic_multiplier * match_multiplier * pain_multiplier;

    return Math.min(estimated_revenue, 60000);
  }

  private determinePriority(viral_score: number, revenue_estimate: number): string {
    const combined_score = (viral_score * 0.6) + (Math.min(revenue_estimate / 1000, 60) * 0.4);

    if (combined_score >= 80) {
      return "urgent";
    } else if (combined_score >= 65) {
      return "high";
    } else if (combined_score >= 50) {
      return "medium";
    } else {
      return "low";
    }
  }

  private generateScriptElements(product: Record<string, any>, match: IngredientMatch): Record<string, any> {
    const pain_data = this.pain_point_db.pain_points[match.pain_point];
    const primary_ingredient = match.matched_ingredients[0] || "key nutrients";

    // Get mechanism explanation
    let mechanism_explanation = "supports your body's natural healing processes";
    if (primary_ingredient in this.pain_point_db.mechanism_explanations) {
      const mechanism_data = this.pain_point_db.mechanism_explanations[primary_ingredient];
      if (match.pain_point in mechanism_data) {
        mechanism_explanation = mechanism_data[match.pain_point] || 'provides targeted support for this specific health concern';
      }
    }

    return {
      statistical_hook: pain_data.statistical_hook,
      emotional_hooks: pain_data.emotional_hooks,
      emotional_amplification: pain_data.emotional_amplification,
      primary_ingredient,
      mechanism_explanation,
      social_proof_angle: `This isn't some random herb - ${primary_ingredient} has over 200 published studies`,
      urgency_scarcity: `Real ${primary_ingredient} is expensive to source. Most companies use cheap synthetic versions that don't work.`,
      cta_elements: {
        urgency: "Don't wait - your " + match.pain_point.replace('_', ' ') + " won't fix itself",
        scarcity: "they're limiting orders to 3 bottles per person",
        action: "Link in bio"
      }
    };
  }

  getTopSupplementOpportunities(products: Array<Record<string, any>>, limit: number = 10): SupplementAnalysis[] {
    const analyses: SupplementAnalysis[] = [];

    for (const product of products) {
      const analysis = this.analyzeSupplementProduct(product);
      if (analysis && analysis.viral_score >= 60) {  // Only high-potential content
        analyses.push(analysis);
      }
    }

    // Sort by revenue potential and viral score
    analyses.sort((a, b) => {
      const scoreA = a.revenue_estimate + a.viral_score;
      const scoreB = b.revenue_estimate + b.viral_score;
      return scoreB - scoreA;
    });

    return analyses.slice(0, limit);
  }
}

// Export default instance
export const supplementPainPointEngine = new SupplementPainPointEngine();

// Example usage function
export function testSupplementEngine(): void {
  const sample_products = [
    {
      id: "sup_001",
      name: "CoQ10 Ubiquinol 200mg with PQQ",
      description: "High-absorption CoQ10 with PQQ for cellular energy production",
      price: 45.99,
      commission: 25,
      monthly_sales: 15000
    },
    {
      id: "sup_002",
      name: "Magnesium Glycinate Complex Sleep Support",
      description: "Chelated magnesium with L-theanine and GABA for deep sleep",
      price: 34.99,
      commission: 30,
      monthly_sales: 8000
    },
    {
      id: "sup_003",
      name: "Lion's Mane Mushroom Extract for Brain Health",
      description: "Organic Lion's Mane with Alpha-GPC for cognitive support",
      price: 52.99,
      commission: 28,
      monthly_sales: 12000
    }
  ];

  const engine = new SupplementPainPointEngine();

  console.log("🎯 Supplement Pain Point Analysis Results:");
  for (const product of sample_products) {
    const analysis = engine.analyzeSupplementProduct(product);
    if (analysis) {
      console.log(`\n✅ ${analysis.product_name}`);
      console.log(`   Pain Point: ${analysis.best_pain_point_match.pain_point}`);
      console.log(`   Match Score: ${analysis.best_pain_point_match.match_score.toFixed(1)}%`);
      console.log(`   Viral Score: ${analysis.viral_score.toFixed(1)}`);
      console.log(`   Revenue Estimate: $${analysis.revenue_estimate.toLocaleString()}`);
      console.log(`   Priority: ${analysis.content_priority}`);
      console.log(`   Hook: ${analysis.best_pain_point_match.suggested_hook}`);
    }
  }
}