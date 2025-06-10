/**
 * Hybrid Script Generator - Claude + OpenAI System
 * Uses Claude for strategic template design and OpenAI for high-volume production
 * Combines psychological insight with automation capability
 */

import OpenAI from 'openai';
import { logger } from '../utils/logger';

export interface PainPointTemplate {
  emotional_triggers: string[];
  hook_formulas: string[];
  scientific_mechanisms: string[];
  conversion_angles: string[];
}

export interface ScriptStructure {
  sections: string[];
  timing: Record<string, string>;
}

export interface ProductData {
  name: string;
  price: string;
  category?: string;
}

export interface ScriptSection {
  hook: string;
  problem: string;
  mechanism: string;
  proof: string;
  cta: string;
  full_script: string;
}

export interface GeneratedScript {
  script: ScriptSection;
  product: ProductData;
  template_used: string;
  word_count: number;
  estimated_duration: number;
  psychological_profile: {
    pain_point: string;
    emotional_triggers: string[];
    conversion_angle: string;
  };
  generated_at: string;
  viral_score?: number;
}

export interface PerformanceAnalytics {
  total_scripts: number;
  average_viral_score: number;
  pain_point_distribution: Record<string, number>;
  top_scoring_script: GeneratedScript;
  generation_timestamp: string;
}

export class ClaudeTemplateEngine {
  private pain_point_templates: Record<string, PainPointTemplate> = {
    chronic_fatigue: {
      emotional_triggers: [
        'exhausted_by_2pm',
        'coffee_dependency_shame', 
        'guilt_about_tiredness',
        'missing_life_moments',
        'work_performance_anxiety'
      ],
      hook_formulas: [
        '[Shocking_Statistic] + [Personal_Relatability] + [Hidden_Cause_Reveal]',
        '[Time_Urgency] + [Energy_Transformation] + [Social_Proof]',
        '[Medical_Conspiracy] + [Simple_Solution] + [Scarcity]'
      ],
      scientific_mechanisms: [
        'mitochondrial_energy_production',
        'adrenal_fatigue_recovery',
        'cellular_oxidative_stress',
        'nutrient_deficiency_cascade'
      ],
      conversion_angles: [
        'ancestral_health_wisdom',
        'medical_establishment_suppression',
        'pharmaceutical_profit_motive',
        'natural_vs_synthetic_superiority'
      ]
    },
    
    weight_struggle: {
      emotional_triggers: [
        'metabolism_betrayal',
        'diet_failure_shame',
        'body_image_frustration',
        'clothes_not_fitting',
        'social_comparison_pain'
      ],
      hook_formulas: [
        '[Metabolism_Myth] + [Personal_Story] + [Scientific_Truth]',
        '[Diet_Industry_Lie] + [Real_Cause] + [Simple_Fix]',
        '[Age_Excuse] + [Hormonal_Truth] + [Transformation_Proof]'
      ],
      scientific_mechanisms: [
        'thyroid_hormone_optimization',
        'insulin_sensitivity_restoration',
        'gut_microbiome_rebalancing',
        'cortisol_stress_reduction'
      ],
      conversion_angles: [
        'pharmaceutical_weight_loss_dangers',
        'diet_industry_profit_conspiracy',
        'natural_hormone_optimization',
        'ancestral_eating_patterns'
      ]
    },
    
    brain_fog: {
      emotional_triggers: [
        'memory_embarrassment',
        'focus_productivity_loss',
        'mental_clarity_desperation',
        'aging_brain_fear',
        'cognitive_decline_anxiety'
      ],
      hook_formulas: [
        '[Memory_Scare] + [Age_Reality] + [Brain_Food_Solution]',
        '[Focus_Loss_Story] + [Neurotransmitter_Science] + [Supplement_Fix]',
        '[Dementia_Prevention] + [Neuroplasticity_Hope] + [Action_Steps]'
      ],
      scientific_mechanisms: [
        'neurotransmitter_synthesis',
        'brain_derived_neurotrophic_factor',
        'neuroinflammation_reduction',
        'blood_brain_barrier_optimization'
      ],
      conversion_angles: [
        'pharmaceutical_cognitive_risks',
        'natural_nootropic_superiority',
        'brain_aging_reversal_possibility',
        'memory_enhancement_protocols'
      ]
    },
    
    joint_pain: {
      emotional_triggers: [
        'mobility_limitation_fear',
        'chronic_pain_exhaustion',
        'activity_avoidance_sadness',
        'aging_acceptance_resistance',
        'pain_medication_concerns'
      ],
      hook_formulas: [
        '[Mobility_Loss_Fear] + [Inflammation_Truth] + [Natural_Relief]',
        '[Pain_Medication_Risks] + [Root_Cause_Fix] + [Movement_Freedom]',
        '[Cartilage_Regeneration] + [Success_Story] + [Time_Sensitivity]'
      ],
      scientific_mechanisms: [
        'inflammatory_cascade_interruption',
        'cartilage_matrix_regeneration',
        'synovial_fluid_optimization',
        'collagen_synthesis_enhancement'
      ],
      conversion_angles: [
        'nsaid_long_term_dangers',
        'natural_inflammation_control',
        'joint_regeneration_possibility',
        'pain_free_movement_restoration'
      ]
    },
    
    sleep_issues: {
      emotional_triggers: [
        'insomnia_desperation',
        'sleep_medication_dependency',
        'daytime_fatigue_impact',
        'sleep_quality_frustration',
        'health_consequence_anxiety'
      ],
      hook_formulas: [
        '[Sleep_Deprivation_Consequences] + [Melatonin_Myth] + [Natural_Solution]',
        '[Sleep_Medication_Addiction] + [Root_Cause_Address] + [Deep_Sleep_Promise]',
        '[Circadian_Rhythm_Science] + [Personal_Transformation] + [Simple_Protocol]'
      ],
      scientific_mechanisms: [
        'circadian_rhythm_optimization',
        'neurotransmitter_balance_restoration',
        'stress_hormone_regulation',
        'sleep_architecture_improvement'
      ],
      conversion_angles: [
        'sleep_medication_dependency_risks',
        'natural_sleep_cycle_restoration',
        'deep_sleep_health_benefits',
        'circadian_biology_optimization'
      ]
    }
  };

  private script_structures: Record<string, ScriptStructure> = {
    shock_revelation: {
      sections: [
        'shocking_statistic_hook',
        'personal_relatability',
        'hidden_cause_reveal',
        'scientific_mechanism',
        'transformation_proof',
        'urgency_scarcity_cta'
      ],
      timing: {
        hook: '0-3 seconds',
        problem: '3-8 seconds',
        solution: '8-15 seconds',
        proof: '15-20 seconds',
        cta: '20-25 seconds'
      }
    },
    
    conspiracy_truth: {
      sections: [
        'industry_lie_expose',
        'profit_motive_reveal',
        'suppressed_truth',
        'natural_alternative',
        'success_testimonial',
        'limited_time_action'
      ],
      timing: {
        hook: '0-4 seconds',
        expose: '4-10 seconds',
        truth: '10-16 seconds',
        solution: '16-22 seconds',
        cta: '22-25 seconds'
      }
    },
    
    transformation_story: {
      sections: [
        'struggle_identification',
        'failed_attempts_empathy',
        'discovery_moment',
        'mechanism_explanation',
        'results_demonstration',
        'availability_urgency'
      ],
      timing: {
        struggle: '0-5 seconds',
        empathy: '5-10 seconds',
        discovery: '10-15 seconds',
        results: '15-20 seconds',
        cta: '20-25 seconds'
      }
    }
  };

  getTemplateForProduct(product: ProductData): {
    pain_point: string;
    emotional_triggers: string[];
    hook_formulas: string[];
    scientific_mechanisms: string[];
    conversion_angles: string[];
    script_structure: ScriptStructure;
    product_context: ProductData;
  } {
    const pain_point = this.analyzeProductPainPoint(product);
    const template = this.pain_point_templates[pain_point] || this.pain_point_templates.chronic_fatigue;
    const structure = this.selectScriptStructure(product, pain_point);
    
    return {
      pain_point,
      emotional_triggers: template.emotional_triggers,
      hook_formulas: template.hook_formulas,
      scientific_mechanisms: template.scientific_mechanisms,
      conversion_angles: template.conversion_angles,
      script_structure: structure,
      product_context: product
    };
  }
    
  private analyzeProductPainPoint(product: ProductData): string {
    const name = product.name.toLowerCase();
    
    const pain_point_keywords: Record<string, string[]> = {
      chronic_fatigue: ['energy', 'fatigue', 'tired', 'exhausted', 'vitality', 'stamina'],
      weight_struggle: ['weight', 'fat', 'metabolism', 'diet', 'slim', 'lean', 'burn'],
      brain_fog: ['brain', 'focus', 'memory', 'cognitive', 'mental', 'clarity', 'nootropic'],
      joint_pain: ['joint', 'pain', 'arthritis', 'mobility', 'inflammation', 'cartilage'],
      sleep_issues: ['sleep', 'insomnia', 'rest', 'melatonin', 'circadian', 'dream']
    };
    
    const scores: Record<string, number> = {};
    for (const [pain_point, keywords] of Object.entries(pain_point_keywords)) {
      scores[pain_point] = keywords.filter(keyword => name.includes(keyword)).length;
    }
    
    return Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0] || 'chronic_fatigue';
  }
    
  private selectScriptStructure(product: ProductData, pain_point: string): ScriptStructure {
    if (product.name.toLowerCase().includes('conspiracy')) {
      return this.script_structures.conspiracy_truth;
    } else if (['weight_struggle', 'chronic_fatigue'].includes(pain_point)) {
      return this.script_structures.transformation_story;
    } else {
      return this.script_structures.shock_revelation;
    }
  }
}

export class OpenAIProductionEngine {
  private client: OpenAI;
  private claudeEngine: ClaudeTemplateEngine;

  constructor(openai_api_key: string) {
    this.client = new OpenAI({ apiKey: openai_api_key });
    this.claudeEngine = new ClaudeTemplateEngine();
  }

  async generateBulkScripts(products: ProductData[], scripts_per_product: number = 3): Promise<GeneratedScript[]> {
    const all_scripts: GeneratedScript[] = [];
    
    for (const product of products) {
      try {
        const template = this.claudeEngine.getTemplateForProduct(product);
        const variations = await this.generateScriptVariations(product, template, scripts_per_product);
        all_scripts.push(...variations);
        
        logger.info(`Generated ${variations.length} scripts for ${product.name}`);
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        logger.error(`Failed to generate scripts for ${product.name}: ${error}`);
      }
    }
    
    return all_scripts;
  }
    
  private async generateScriptVariations(
    product: ProductData, 
    template: any, 
    count: number
  ): Promise<GeneratedScript[]> {
    const variations: GeneratedScript[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const emotional_trigger = template.emotional_triggers[Math.floor(Math.random() * template.emotional_triggers.length)];
        const hook_formula = template.hook_formulas[Math.floor(Math.random() * template.hook_formulas.length)];
        const mechanism = template.scientific_mechanisms[Math.floor(Math.random() * template.scientific_mechanisms.length)];
        const conversion_angle = template.conversion_angles[Math.floor(Math.random() * template.conversion_angles.length)];
        
        const prompt = this.createProductionPrompt(
          product, template, emotional_trigger, hook_formula, mechanism, conversion_angle, i + 1
        );
        
        const response = await this.client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 400
        });
        
        const script_content = response.choices?.[0]?.message?.content || '';
        const structured_script = this.parseOpenAIResponse(script_content, product, template);
        
        variations.push(structured_script);
        
      } catch (error) {
        logger.error(`Failed to generate variation ${i + 1}: ${error}`);
      }
    }
    
    return variations;
  }
    
  private createProductionPrompt(
    product: ProductData, 
    template: any,
    emotional_trigger: string, 
    hook_formula: string, 
    mechanism: string, 
    conversion_angle: string, 
    variation_number: number
  ): string {
    return `Generate a viral supplement script using this Claude-designed psychological framework:

PRODUCT: ${product.name}
PRICE: ${product.price}
PAIN POINT: ${template.pain_point}

PSYCHOLOGICAL TEMPLATE:
- Emotional Trigger: ${emotional_trigger}
- Hook Formula: ${hook_formula}
- Scientific Mechanism: ${mechanism}
- Conversion Angle: ${conversion_angle}

SCRIPT STRUCTURE (Claude-designed):
${JSON.stringify(template.script_structure, null, 2)}

REQUIREMENTS:
1. 20-25 seconds when spoken (80-100 words)
2. Start with hook that embodies: ${hook_formula}
3. Target emotional trigger: ${emotional_trigger}
4. Explain mechanism: ${mechanism}
5. Use conversion angle: ${conversion_angle}
6. End with urgent CTA
7. Sound natural and conversational
8. Include "mishearing" words for engagement

OUTPUT FORMAT:
Hook: [0-3 seconds opening that grabs attention]
Problem: [3-8 seconds emotional trigger and relatability]
Mechanism: [8-15 seconds scientific explanation]
Proof: [15-20 seconds social proof or transformation]
CTA: [20-25 seconds urgent call to action]

Generate variation #${variation_number} that sounds authentic and converts.`;
  }
    
  private parseOpenAIResponse(response: string, product: ProductData, template: any): GeneratedScript {
    const lines = response.trim().split('\n');
    const script_sections: Record<string, string> = {};
    
    let current_section: string | null = null;
    let current_content: string[] = [];
    
    for (const line of lines) {
      const trimmed_line = line.trim();
      if (trimmed_line.includes(':') && ['hook', 'problem', 'mechanism', 'proof', 'cta'].some(section => 
        trimmed_line.toLowerCase().includes(section)
      )) {
        if (current_section && current_content.length > 0) {
          script_sections[current_section] = current_content.join(' ').trim();
        }
        
        const parts = trimmed_line.split(':', 2);
        current_section = parts[0].toLowerCase().trim();
        current_content = parts.length > 1 && parts[1].trim() ? [parts[1].trim()] : [];
      } else if (current_section && trimmed_line) {
        current_content.push(trimmed_line);
      }
    }
    
    if (current_section && current_content.length > 0) {
      script_sections[current_section] = current_content.join(' ').trim();
    }
    
    const full_script = [
      script_sections.hook || '',
      script_sections.problem || '',
      script_sections.mechanism || '',
      script_sections.proof || '',
      script_sections.cta || ''
    ].join(' ').trim();
    
    const word_count = full_script.split(' ').length;
    
    return {
      script: {
        hook: script_sections.hook || '',
        problem: script_sections.problem || '',
        mechanism: script_sections.mechanism || '',
        proof: script_sections.proof || '',
        cta: script_sections.cta || '',
        full_script
      },
      product,
      template_used: template.pain_point,
      word_count,
      estimated_duration: word_count / 2.5,
      psychological_profile: {
        pain_point: template.pain_point,
        emotional_triggers: template.emotional_triggers,
        conversion_angle: template.conversion_angles[0]
      },
      generated_at: new Date().toISOString()
    };
  }
}

export class HybridScriptGenerator {
  private openaiEngine: OpenAIProductionEngine;
  private claudeEngine: ClaudeTemplateEngine;

  constructor(openai_api_key: string) {
    this.openaiEngine = new OpenAIProductionEngine(openai_api_key);
    this.claudeEngine = new ClaudeTemplateEngine();
  }

  async generateDailyContentBatch(
    products: ProductData[], 
    total_scripts_target: number = 50
  ): Promise<GeneratedScript[]> {
    logger.info(`Starting hybrid script generation for ${products.length} products, target: ${total_scripts_target} scripts`);
    
    const scripts_per_product = Math.max(1, Math.floor(total_scripts_target / products.length));
    const all_scripts = await this.openaiEngine.generateBulkScripts(products, scripts_per_product);
    const scored_scripts = this.scoreScripts(all_scripts);
    
    return scored_scripts.slice(0, total_scripts_target);
  }
    
  private scoreScripts(scripts: GeneratedScript[]): GeneratedScript[] {
    for (const script of scripts) {
      script.viral_score = this.calculateViralScore(script);
    }
    
    return scripts.sort((a, b) => (b.viral_score || 0) - (a.viral_score || 0));
  }
    
  private calculateViralScore(script: GeneratedScript): number {
    const full_script = script.script.full_script;
    let score = 50;
    
    // Length optimization (80-100 words is ideal)
    if (script.word_count >= 80 && script.word_count <= 100) {
      score += 15;
    } else if (script.word_count >= 70 && script.word_count <= 110) {
      score += 10;
    }
    
    // Viral keywords
    const viral_keywords = [
      'shocking', 'secret', 'truth', 'never', 'finally', 'discovered',
      'proven', 'scientists', 'doctors', 'breakthrough', 'revolutionary'
    ];
    const keyword_count = viral_keywords.filter(keyword => 
      full_script.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    score += Math.min(keyword_count * 3, 15);
    
    // Emotional triggers
    const emotional_words = [
      'frustrated', 'desperate', 'tired', 'exhausted', 'struggled',
      'amazed', 'incredible', 'transformed', 'changed', 'life-changing'
    ];
    const emotion_count = emotional_words.filter(word => 
      full_script.toLowerCase().includes(word.toLowerCase())
    ).length;
    score += Math.min(emotion_count * 2, 10);
    
    // Call to action strength
    const cta = script.script.cta;
    if (['link in bio', 'comment', 'dm me', 'save this'].some(phrase => 
      cta.toLowerCase().includes(phrase)
    )) {
      score += 10;
    }
    
    return Math.min(100, score);
  }

  getPerformanceAnalytics(scripts: GeneratedScript[]): PerformanceAnalytics {
    if (scripts.length === 0) {
      return {
        total_scripts: 0,
        average_viral_score: 0,
        pain_point_distribution: {},
        top_scoring_script: {} as GeneratedScript,
        generation_timestamp: new Date().toISOString()
      };
    }
    
    const pain_points = scripts.map(s => s.template_used || 'unknown');
    const avg_score = scripts.reduce((sum, s) => sum + (s.viral_score || 0), 0) / scripts.length;
    const pain_point_distribution: Record<string, number> = {};
    
    pain_points.forEach(pp => {
      pain_point_distribution[pp] = (pain_point_distribution[pp] || 0) + 1;
    });
    
    return {
      total_scripts: scripts.length,
      average_viral_score: Math.round(avg_score * 10) / 10,
      pain_point_distribution,
      top_scoring_script: scripts.reduce((max, script) => 
        (script.viral_score || 0) > (max.viral_score || 0) ? script : max
      ),
      generation_timestamp: new Date().toISOString()
    };
  }
}

// Example usage
export async function demoHybridGeneration(): Promise<GeneratedScript[]> {
  const products: ProductData[] = [
    {
      name: 'Advanced Energy Complex with CoQ10',
      price: '$39.99',
      category: 'energy'
    },
    {
      name: 'Metabolic Boost Weight Management',
      price: '$29.99', 
      category: 'weight'
    }
  ];
  
  const openai_key = process.env.OPENAI_API_KEY;
  if (!openai_key) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  
  const generator = new HybridScriptGenerator(openai_key);
  const scripts = await generator.generateDailyContentBatch(products, 10);
  const analytics = generator.getPerformanceAnalytics(scripts);
  
  console.log(`Generated ${scripts.length} scripts`);
  console.log(`Average viral score: ${analytics.average_viral_score}`);
  
  return scripts;
}