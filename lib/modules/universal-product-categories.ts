/**
 * Universal Product Categories - All TikTok Shop Products
 * Comprehensive psychological frameworks for ALL product types, not just supplements
 * Covers beauty, tech, home, fashion, fitness, kitchen, and more
 */

interface Product {
  name: string;
  description: string;
}

interface CategoryPsychology {
  pain_point: string;
  emotional_triggers: string[];
  hook_formulas: string[];
  conversion_psychology: string;
  viral_elements: string;
}

export class UniversalProductCategories {
  private categoryKeywords: Record<string, string[]>;
  private categoryPsychology: Record<string, CategoryPsychology>;

  constructor() {
    this.categoryKeywords = {
      beauty_skincare: [
        'skincare', 'serum', 'cream', 'moisturizer', 'cleanser', 'toner',
        'makeup', 'foundation', 'concealer', 'lipstick', 'mascara', 'eyeshadow',
        'anti-aging', 'wrinkle', 'acne', 'glow', 'brightening', 'vitamin c'
      ],
      
      hair_care: [
        'hair', 'shampoo', 'conditioner', 'hair mask', 'hair oil', 'styling',
        'curling', 'straightening', 'hair growth', 'scalp', 'dandruff', 'dye'
      ],
      
      tech_gadgets: [
        'phone', 'case', 'charger', 'wireless', 'bluetooth', 'headphones',
        'earbuds', 'smart', 'device', 'electronic', 'gadget', 'camera',
        'tablet', 'laptop', 'computer', 'gaming', 'tech', 'digital'
      ],
      
      home_kitchen: [
        'kitchen', 'cooking', 'utensil', 'cookware', 'appliance', 'blender',
        'air fryer', 'coffee', 'storage', 'container', 'organizer', 'cleaning',
        'home', 'decor', 'furniture', 'organization', 'gadget'
      ],
      
      fashion_accessories: [
        'clothing', 'dress', 'shirt', 'pants', 'shoes', 'sneakers', 'boots',
        'jewelry', 'necklace', 'earrings', 'ring', 'watch', 'bag', 'purse',
        'wallet', 'sunglasses', 'hat', 'scarf', 'belt', 'fashion'
      ],
      
      fitness_wellness: [
        'fitness', 'workout', 'exercise', 'yoga', 'gym', 'weights', 'resistance',
        'protein', 'supplement', 'vitamin', 'health', 'wellness', 'meditation',
        'massage', 'recovery', 'muscle', 'energy', 'stamina'
      ],
      
      baby_kids: [
        'baby', 'infant', 'toddler', 'kids', 'children', 'toys', 'educational',
        'diaper', 'feeding', 'stroller', 'car seat', 'monitor', 'clothing',
        'nursery', 'playtime', 'development'
      ],
      
      pet_supplies: [
        'dog', 'cat', 'pet', 'puppy', 'kitten', 'food', 'treats', 'toy',
        'collar', 'leash', 'bed', 'grooming', 'training', 'health', 'care'
      ],
      
      automotive: [
        'car', 'auto', 'vehicle', 'driving', 'dashboard', 'seat', 'cover',
        'organizer', 'charger', 'mount', 'cleaning', 'maintenance', 'tool'
      ],
      
      outdoor_sports: [
        'outdoor', 'camping', 'hiking', 'sports', 'running', 'cycling',
        'swimming', 'fishing', 'hunting', 'travel', 'backpack', 'gear'
      ]
    };
    
    this.categoryPsychology = {
      beauty_skincare: {
        pain_point: 'skin_confidence_and_aging_anxiety',
        emotional_triggers: [
          'mirror_disappointment',
          'aging_fear_and_wrinkles',
          'skin_texture_embarrassment',
          'makeup_dependency_frustration',
          'social_comparison_pressure'
        ],
        hook_formulas: [
          'Age reversal shock + skin transformation + simple routine',
          'Skincare myth debunk + ingredient science + before/after',
          'Celebrity secret reveal + accessible product + quick results'
        ],
        conversion_psychology: 'beauty_transformation_urgency',
        viral_elements: 'before_after_potential_and_quick_results'
      },
      
      hair_care: {
        pain_point: 'hair_damage_and_styling_struggles',
        emotional_triggers: [
          'bad_hair_day_frustration',
          'hair_damage_from_styling',
          'thinning_hair_anxiety',
          'expensive_salon_dependence',
          'hair_routine_time_stress'
        ],
        hook_formulas: [
          'Hair transformation shock + damage reversal + salon results',
          'Styling hack reveal + time saving + professional look',
          'Hair growth secret + ingredient science + visible results'
        ],
        conversion_psychology: 'hair_transformation_and_convenience',
        viral_elements: 'dramatic_hair_transformations_and_time_hacks'
      },
      
      tech_gadgets: {
        pain_point: 'tech_frustration_and_convenience_need',
        emotional_triggers: [
          'slow_charging_frustration',
          'broken_phone_anxiety',
          'tech_complexity_overwhelm',
          'expensive_repair_stress',
          'missing_features_envy'
        ],
        hook_formulas: [
          'Tech problem solution + innovation showcase + price comparison',
          'Hidden feature reveal + productivity boost + lifestyle upgrade',
          'Expensive alternative + affordable solution + same results'
        ],
        conversion_psychology: 'convenience_and_cost_savings',
        viral_elements: 'problem_solving_and_tech_hacks'
      },
      
      home_kitchen: {
        pain_point: 'cooking_difficulty_and_kitchen_chaos',
        emotional_triggers: [
          'cooking_failure_embarrassment',
          'kitchen_mess_overwhelm',
          'meal_prep_time_stress',
          'expensive_takeout_guilt',
          'organization_chaos_frustration'
        ],
        hook_formulas: [
          'Cooking transformation + kitchen hack + time savings',
          'Organization miracle + space maximization + aesthetic appeal',
          'Expensive appliance alternative + same results + fraction cost'
        ],
        conversion_psychology: 'home_efficiency_and_cooking_confidence',
        viral_elements: 'satisfying_organization_and_cooking_hacks'
      },
      
      fashion_accessories: {
        pain_point: 'style_confidence_and_wardrobe_struggles',
        emotional_triggers: [
          'outfit_choice_paralysis',
          'body_image_clothing_anxiety',
          'expensive_fashion_pressure',
          'trend_keeping_up_stress',
          'comfort_vs_style_conflict'
        ],
        hook_formulas: [
          'Style transformation + confidence boost + affordable luxury',
          'Fashion hack + versatility showcase + wardrobe multiplication',
          'Comfort meets style + all-day wearability + compliment magnet'
        ],
        conversion_psychology: 'style_confidence_and_value',
        viral_elements: 'outfit_transformations_and_style_hacks'
      },
      
      fitness_wellness: {
        pain_point: 'fitness_motivation_and_results_plateau',
        emotional_triggers: [
          'gym_intimidation_anxiety',
          'workout_result_disappointment',
          'fitness_time_constraint_stress',
          'body_transformation_impatience',
          'expensive_fitness_guilt'
        ],
        hook_formulas: [
          'Fitness breakthrough + home workout + quick results',
          'Exercise myth debunk + efficient method + body transformation',
          'Expensive gym alternative + convenient solution + better results'
        ],
        conversion_psychology: 'body_transformation_and_convenience',
        viral_elements: 'fitness_transformations_and_workout_hacks'
      },
      
      baby_kids: {
        pain_point: 'parenting_stress_and_child_development_anxiety',
        emotional_triggers: [
          'parenting_inadequacy_fear',
          'child_safety_hypervigilance',
          'developmental_milestone_worry',
          'expensive_baby_product_guilt',
          'sleep_deprivation_exhaustion'
        ],
        hook_formulas: [
          'Parenting hack + child development + peace of mind',
          'Safety innovation + parent relief + child happiness',
          'Educational toy + development boost + screen time alternative'
        ],
        conversion_psychology: 'child_wellbeing_and_parenting_confidence',
        viral_elements: 'cute_baby_content_and_parenting_solutions'
      },
      
      pet_supplies: {
        pain_point: 'pet_health_anxiety_and_behavior_challenges',
        emotional_triggers: [
          'pet_health_worry_guilt',
          'behavioral_problem_embarrassment',
          'expensive_vet_bill_stress',
          'pet_happiness_responsibility',
          'training_failure_frustration'
        ],
        hook_formulas: [
          'Pet health solution + behavior improvement + owner relief',
          'Training breakthrough + behavior transformation + bonding enhancement',
          'Expensive vet alternative + preventive care + pet happiness'
        ],
        conversion_psychology: 'pet_wellbeing_and_owner_peace_of_mind',
        viral_elements: 'cute_pet_content_and_training_transformations'
      },
      
      automotive: {
        pain_point: 'car_maintenance_stress_and_driving_inconvenience',
        emotional_triggers: [
          'car_breakdown_anxiety',
          'expensive_repair_stress',
          'driving_safety_concern',
          'car_organization_chaos',
          'maintenance_ignorance_embarrassment'
        ],
        hook_formulas: [
          'Car problem solution + safety enhancement + cost savings',
          'Maintenance hack + car longevity + repair prevention',
          'Driving convenience + organization solution + travel comfort'
        ],
        conversion_psychology: 'safety_and_cost_savings',
        viral_elements: 'car_hacks_and_safety_demonstrations'
      },
      
      outdoor_sports: {
        pain_point: 'outdoor_adventure_preparation_and_gear_overwhelm',
        emotional_triggers: [
          'outdoor_skill_inadequacy',
          'expensive_gear_pressure',
          'adventure_safety_anxiety',
          'weather_unpredictability_stress',
          'gear_weight_inconvenience'
        ],
        hook_formulas: [
          'Adventure gear hack + outdoor confidence + safety assurance',
          'Expensive equipment alternative + same performance + portability',
          'Outdoor skill upgrade + gear innovation + adventure enhancement'
        ],
        conversion_psychology: 'adventure_confidence_and_gear_optimization',
        viral_elements: 'outdoor_adventures_and_gear_demonstrations'
      }
    };
  }

  categorizeProduct(product: Product): string {
    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    const textToAnalyze = `${name} ${description}`;
    
    const categoryScores: Record<string, number> = {};
    
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      const score = keywords.reduce((count, keyword) => 
        textToAnalyze.includes(keyword) ? count + 1 : count, 0
      );
      if (score > 0) {
        categoryScores[category] = score;
      }
    }
    
    if (Object.keys(categoryScores).length > 0) {
      return Object.entries(categoryScores).reduce((a, b) => 
        categoryScores[a[0]] > categoryScores[b[0]] ? a : b
      )[0];
    }
    
    return 'general';
  }

  getPsychologyForCategory(category: string): CategoryPsychology {
    return this.categoryPsychology[category] || {
      pain_point: 'general_product_need_and_convenience',
      emotional_triggers: [
        'daily_inconvenience_frustration',
        'expensive_alternative_stress',
        'quality_vs_price_dilemma',
        'lifestyle_improvement_desire',
        'social_validation_need'
      ],
      hook_formulas: [
        'Problem solution + convenience + value demonstration',
        'Expensive alternative + affordable option + same results',
        'Lifestyle upgrade + convenience + social appeal'
      ],
      conversion_psychology: 'convenience_and_value',
      viral_elements: 'problem_solving_and_lifestyle_enhancement'
    };
  }

  getAllSupportedCategories(): string[] {
    return Object.keys(this.categoryKeywords);
  }
}

export function testUniversalCategories(): void {
  const categorizer = new UniversalProductCategories();
  
  const testProducts: Product[] = [
    { name: 'iPhone 15 Pro Case with MagSafe', description: 'Protective phone case' },
    { name: 'Anti-Aging Vitamin C Serum', description: 'Skincare brightening serum' },
    { name: 'Air Fryer Kitchen Appliance', description: 'Cooking gadget for healthy meals' },
    { name: 'Wireless Bluetooth Earbuds', description: 'Noise cancelling headphones' },
    { name: 'Dog Training Treats', description: 'Pet behavior training rewards' },
    { name: 'Yoga Mat Exercise Equipment', description: 'Fitness workout gear' },
    { name: 'Baby Monitor with Camera', description: 'Infant safety monitoring device' }
  ];
  
  console.log("🎯 Universal Product Category Testing:");
  console.log("=".repeat(50));
  
  for (const product of testProducts) {
    const category = categorizer.categorizeProduct(product);
    const psychology = categorizer.getPsychologyForCategory(category);
    
    console.log(`\n📦 Product: ${product.name}`);
    console.log(`🏷️ Category: ${category}`);
    console.log(`🧠 Pain Point: ${psychology.pain_point}`);
    console.log(`💭 Emotional Triggers: ${psychology.emotional_triggers.slice(0, 2).join(', ')}`);
    console.log(`🎣 Hook Formula: ${psychology.hook_formulas[0]}`);
  }
  
  console.log(`\n✅ Total Categories Supported: ${categorizer.getAllSupportedCategories().length}`);
  console.log(`📋 Categories: ${categorizer.getAllSupportedCategories().join(', ')}`);
}