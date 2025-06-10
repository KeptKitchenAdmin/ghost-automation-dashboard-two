/**
 * Optimized Dual AI System - Claude Strategy + OpenAI Production
 * Cost-optimized system using Claude for emotional intelligence and OpenAI for bulk generation
 * Claude: Strategic templates, psychological analysis, emotional intelligence
 * OpenAI: High-volume script production with GPT-4o-mini for cost efficiency
 */

import OpenAI from 'openai';
import { logger } from '../utils/logger';

export interface ProductData {
  name: string;
  price: string;
  category?: string;
}

export interface ClaudeAnalysis {
  pain_point: string;
  emotional_triggers: string[];
  hook_formulas: string[];
  scientific_mechanism: string;
  conversion_psychology: string;
  viral_elements: string;
}

export interface ScriptSection {
  hook: string;
  problem: string;
  science: string;
  proof: string;
  cta: string;
  full_script: string;
}

export interface GeneratedScript {
  script: ScriptSection;
  product: ProductData;
  word_count: number;
  duration_estimate: number;
  claude_insights: {
    pain_point?: string;
    emotional_trigger?: string;
    scientific_mechanism?: string;
  };
  variation_number: number;
  generated_at: string;
  cost_efficiency: {
    model_used: string;
    estimated_cost: number;
  };
  viral_score?: number;
}

export interface SystemAnalytics {
  total_scripts: number;
  categories_processed: string[];
  claude_api_calls: number;
  openai_api_calls: number;
  estimated_total_cost: number;
  average_word_count: number;
  average_duration: number;
}

export interface BatchResult {
  scripts: GeneratedScript[];
  analytics: SystemAnalytics;
}

export class ClaudeStrategyEngine {
  private claude_client: any; // Would be Anthropic client in real implementation
  private template_cache: Record<string, ClaudeAnalysis> = {};

  constructor(claude_api_key: string) {
    // Would initialize Anthropic client here
    logger.info("Claude Strategy Engine initialized");
  }

  async analyzeProductPsychology(product: ProductData): Promise<ClaudeAnalysis> {
    const cache_key = this.getProductCategory(product);
    
    if (this.template_cache[cache_key]) {
      logger.info(`Using cached psychological analysis for ${cache_key}`);
      return this.template_cache[cache_key];
    }

    try {
      // In real implementation, would call Claude API
      const analysis = await this.mockClaudeAnalysis(product);
      this.template_cache[cache_key] = analysis;
      
      logger.info(`Claude analyzed psychology for ${cache_key}: ${analysis.pain_point}`);
      return analysis;
      
    } catch (error) {
      logger.error(`Claude analysis failed: ${error}`);
      return this.getFallbackAnalysis(product);
    }
  }

  getProductCategory(product: ProductData): string {
    const name = product.name.toLowerCase();
    
    if (['energy', 'fatigue', 'tired', 'vitality'].some(word => name.includes(word))) {
      return 'energy';
    } else if (['weight', 'fat', 'metabolism', 'burn'].some(word => name.includes(word))) {
      return 'weight';
    } else if (['brain', 'focus', 'memory', 'cognitive'].some(word => name.includes(word))) {
      return 'brain';
    } else if (['joint', 'pain', 'inflammation'].some(word => name.includes(word))) {
      return 'joint';
    } else if (['sleep', 'rest', 'melatonin'].some(word => name.includes(word))) {
      return 'sleep';
    } else {
      return 'general';
    }
  }

  private async mockClaudeAnalysis(product: ProductData): Promise<ClaudeAnalysis> {
    // Mock Claude analysis - would be real API call in production
    const category = this.getProductCategory(product);
    
    const categoryTemplates: Record<string, ClaudeAnalysis> = {
      energy: {
        pain_point: 'chronic_fatigue_and_energy_crashes',
        emotional_triggers: [
          'afternoon_energy_crashes',
          'coffee_dependency_shame', 
          'missing_life_moments',
          'productivity_anxiety',
          'exhaustion_guilt'
        ],
        hook_formulas: [
          'Shocking energy statistic + personal story + hidden cause',
          'Coffee addiction confession + mitochondrial science + transformation',
          'Age excuse debunk + cellular energy + proof'
        ],
        scientific_mechanism: 'mitochondrial_energy_production',
        conversion_psychology: 'urgency_and_transformation_proof',
        viral_elements: 'relatable_exhaustion_and_quick_fix_promise'
      },
      weight: {
        pain_point: 'metabolism_and_weight_struggle',
        emotional_triggers: [
          'scale_disappointment',
          'diet_failure_shame',
          'metabolism_betrayal',
          'clothes_not_fitting',
          'body_comparison_pain'
        ],
        hook_formulas: [
          'Metabolism myth debunk + personal struggle + scientific truth',
          'Diet industry lie + hormonal cause + natural solution',
          'Age/genetics excuse + metabolic reset + transformation'
        ],
        scientific_mechanism: 'metabolic_hormone_optimization',
        conversion_psychology: 'body_transformation_urgency',
        viral_elements: 'before_after_potential_and_myth_busting'
      },
      brain: {
        pain_point: 'cognitive_decline_and_brain_fog',
        emotional_triggers: [
          'memory_embarrassment',
          'focus_productivity_loss',
          'mental_clarity_desperation',
          'aging_brain_fear',
          'cognitive_decline_anxiety'
        ],
        hook_formulas: [
          'Memory scare + age reality + brain food solution',
          'Focus loss story + neurotransmitter science + supplement fix',
          'Dementia prevention + neuroplasticity hope + action steps'
        ],
        scientific_mechanism: 'neurotransmitter_synthesis',
        conversion_psychology: 'cognitive_protection_urgency',
        viral_elements: 'brain_health_fear_and_optimization_promise'
      }
    };

    return categoryTemplates[category] || categoryTemplates.energy;
  }

  private getFallbackAnalysis(product: ProductData): ClaudeAnalysis {
    return {
      pain_point: 'general_health_optimization',
      emotional_triggers: ['health_anxiety', 'aging_fear', 'energy_loss', 'performance_decline', 'wellness_guilt'],
      hook_formulas: ['Health scare + personal story + solution', 'Age reversal angle + science + proof', 'Hidden health truth + revelation + action'],
      scientific_mechanism: 'nutritional_optimization',
      conversion_psychology: 'health_urgency_and_social_proof',
      viral_elements: 'health_transformation_and_longevity_appeal'
    };
  }
}

export class OpenAIProductionEngine {
  private client: OpenAI;
  private model: string = "gpt-4o-mini";

  constructor(openai_api_key: string) {
    this.client = new OpenAI({ apiKey: openai_api_key });
  }

  async generateBulkScripts(
    products: ProductData[],
    claude_analysis: ClaudeAnalysis,
    scripts_per_product: number = 3
  ): Promise<GeneratedScript[]> {
    const all_scripts: GeneratedScript[] = [];

    for (const product of products) {
      try {
        logger.info(`Generating ${scripts_per_product} scripts for ${product.name}`);

        const product_scripts = await this.generateProductScripts(
          product, claude_analysis, scripts_per_product
        );

        all_scripts.push(...product_scripts);

        // Rate limiting (GPT-4o-mini allows higher rates)
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        logger.error(`Failed to generate scripts for ${product.name}: ${error}`);
      }
    }

    return all_scripts;
  }

  private async generateProductScripts(
    product: ProductData,
    claude_analysis: ClaudeAnalysis,
    count: number
  ): Promise<GeneratedScript[]> {
    const scripts: GeneratedScript[] = [];

    for (let i = 0; i < count; i++) {
      try {
        const prompt = this.createOptimizedPrompt(product, claude_analysis, i + 1);

        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 250
        });

        const script_content = response.choices?.[0]?.message?.content || '';
        const structured_script = this.structureScriptResponse(
          script_content, product, claude_analysis, i + 1
        );

        scripts.push(structured_script);

      } catch (error) {
        logger.error(`Failed to generate script variation ${i + 1}: ${error}`);
      }
    }

    return scripts;
  }

  private createOptimizedPrompt(
    product: ProductData,
    claude_analysis: ClaudeAnalysis,
    variation_num: number
  ): string {
    const triggers = claude_analysis.emotional_triggers;
    const hooks = claude_analysis.hook_formulas;

    const trigger = triggers[(variation_num - 1) % triggers.length] || 'health_anxiety';
    const hook_formula = hooks[(variation_num - 1) % hooks.length] || 'problem + solution + proof';

    return `Create a viral TikTok supplement script using these psychological insights:

PRODUCT: ${product.name} ($${product.price})
PAIN POINT: ${claude_analysis.pain_point}
EMOTIONAL TRIGGER: ${trigger}
HOOK FORMULA: ${hook_formula}
SCIENTIFIC FOCUS: ${claude_analysis.scientific_mechanism}

SCRIPT REQUIREMENTS:
• LENGTH: Exactly 150-200 words (TikTok-optimized)
• STRUCTURE: Hook (0-5s) → Problem (5-10s) → Science (10-15s) → Proof (15-20s) → CTA (20-25s)
• TONE: Conversational, authentic, not salesy
• INCLUDE: One "mishearing" word for engagement
• END: Strong call-to-action

PSYCHOLOGICAL ELEMENTS TO INCLUDE:
• Emotional trigger: ${trigger}
• Scientific credibility: ${claude_analysis.scientific_mechanism}
• Conversion psychology: ${claude_analysis.conversion_psychology}

OUTPUT FORMAT:
[HOOK] (attention-grabbing opening)
[PROBLEM] (emotional relatability) 
[SCIENCE] (mechanism explanation)
[PROOF] (social proof/results)
[CTA] (urgent call-to-action)

Create variation #${variation_num} that sounds natural and converts.`;
  }

  private structureScriptResponse(
    response: string,
    product: ProductData,
    claude_analysis: ClaudeAnalysis,
    variation_num: number
  ): GeneratedScript {
    const sections: Record<string, string> = {};
    const lines = response.trim().split('\n');
    let current_section: string | null = null;
    let current_content: string[] = [];

    for (const line of lines) {
      const trimmed_line = line.trim();
      if (trimmed_line.startsWith('[') && trimmed_line.includes(']')) {
        // Save previous section
        if (current_section && current_content.length > 0) {
          sections[current_section] = current_content.join(' ').trim();
        }

        // Start new section
        const section_match = trimmed_line.match(/\[([^\]]+)\]/);
        current_section = section_match ? section_match[1].toLowerCase() : null;
        current_content = [];
        
        // Add content after the bracket if exists
        const after_bracket = trimmed_line.substring(trimmed_line.indexOf(']') + 1).trim();
        if (after_bracket) {
          current_content.push(after_bracket);
        }
      } else if (line && current_section) {
        current_content.push(trimmed_line);
      }
    }

    // Save last section
    if (current_section && current_content.length > 0) {
      sections[current_section] = current_content.join(' ').trim();
    }

    // Create full script
    const full_script = [
      sections.hook || '',
      sections.problem || '',
      sections.science || '',
      sections.proof || '',
      sections.cta || ''
    ].join(' ').trim();

    const word_count = full_script.split(' ').length;
    const duration_estimate = word_count / 2.5;

    return {
      script: {
        hook: sections.hook || '',
        problem: sections.problem || '',
        science: sections.science || '',
        proof: sections.proof || '',
        cta: sections.cta || '',
        full_script
      },
      product,
      word_count,
      duration_estimate: Math.round(duration_estimate * 10) / 10,
      claude_insights: {
        pain_point: claude_analysis.pain_point,
        emotional_trigger: claude_analysis.emotional_triggers[0],
        scientific_mechanism: claude_analysis.scientific_mechanism
      },
      variation_number: variation_num,
      generated_at: new Date().toISOString(),
      cost_efficiency: {
        model_used: this.model,
        estimated_cost: Math.round(word_count * 0.0001 * 10000) / 10000
      }
    };
  }
}

export class OptimizedDualAISystem {
  private claude_engine: ClaudeStrategyEngine;
  private openai_engine: OpenAIProductionEngine;

  constructor(claude_api_key: string, openai_api_key: string) {
    this.claude_engine = new ClaudeStrategyEngine(claude_api_key);
    this.openai_engine = new OpenAIProductionEngine(openai_api_key);
  }

  async generateOptimizedContentBatch(
    products: ProductData[],
    scripts_per_product: number = 3
  ): Promise<BatchResult> {
    logger.info(`Starting optimized dual AI generation for ${products.length} products`);

    // Step 1: Group products by category to minimize Claude calls
    const product_categories: Record<string, ProductData[]> = {};
    for (const product of products) {
      const category = this.claude_engine.getProductCategory(product);
      if (!product_categories[category]) {
        product_categories[category] = [];
      }
      product_categories[category].push(product);
    }

    logger.info(`Product categories identified: ${Object.keys(product_categories).join(', ')}`);

    // Step 2: Get Claude analysis for each category (cost-efficient)
    const category_analyses: Record<string, ClaudeAnalysis> = {};
    for (const [category, category_products] of Object.entries(product_categories)) {
      try {
        const representative_product = category_products[0];
        const analysis = await this.claude_engine.analyzeProductPsychology(representative_product);
        category_analyses[category] = analysis;
        logger.info(`Claude analyzed ${category} category`);
      } catch (error) {
        logger.error(`Claude analysis failed for ${category}: ${error}`);
        // Use fallback analysis
        category_analyses[category] = {
          pain_point: 'general_health_optimization',
          emotional_triggers: ['health_anxiety', 'aging_fear', 'energy_loss'],
          hook_formulas: ['Health scare + solution', 'Age reversal + proof'],
          scientific_mechanism: 'nutritional_optimization',
          conversion_psychology: 'health_urgency',
          viral_elements: 'health_transformation'
        };
      }
    }

    // Step 3: Generate scripts with OpenAI using Claude insights
    const all_scripts: GeneratedScript[] = [];
    let total_cost_estimate = 0;

    for (const [category, category_products] of Object.entries(product_categories)) {
      const claude_analysis = category_analyses[category];

      const category_scripts = await this.openai_engine.generateBulkScripts(
        category_products, claude_analysis, scripts_per_product
      );

      all_scripts.push(...category_scripts);

      const category_cost = category_scripts.reduce((sum, script) => 
        sum + script.cost_efficiency.estimated_cost, 0
      );
      total_cost_estimate += category_cost;

      logger.info(`Generated ${category_scripts.length} scripts for ${category} category`);
    }

    // Step 4: Score and rank scripts
    const scored_scripts = this.scoreScripts(all_scripts);

    // Step 5: Return results with analytics
    const analytics: SystemAnalytics = {
      total_scripts: scored_scripts.length,
      categories_processed: Object.keys(product_categories),
      claude_api_calls: Object.keys(category_analyses).length,
      openai_api_calls: all_scripts.length,
      estimated_total_cost: Math.round(total_cost_estimate * 10000) / 10000,
      average_word_count: scored_scripts.length > 0 ? 
        Math.round(scored_scripts.reduce((sum, s) => sum + s.word_count, 0) / scored_scripts.length) : 0,
      average_duration: scored_scripts.length > 0 ? 
        Math.round((scored_scripts.reduce((sum, s) => sum + s.duration_estimate, 0) / scored_scripts.length) * 10) / 10 : 0
    };

    return {
      scripts: scored_scripts,
      analytics
    };
  }

  private scoreScripts(scripts: GeneratedScript[]): GeneratedScript[] {
    for (const script of scripts) {
      script.viral_score = this.calculateViralScore(script);
    }

    return scripts.sort((a, b) => (b.viral_score || 0) - (a.viral_score || 0));
  }

  private calculateViralScore(script: GeneratedScript): number {
    const full_script = script.script.full_script;
    const word_count = script.word_count;

    let score = 50; // Base score

    // Optimal length (150-200 words)
    if (word_count >= 150 && word_count <= 200) {
      score += 20;
    } else if (word_count >= 140 && word_count <= 210) {
      score += 15;
    } else if (word_count < 100 || word_count > 250) {
      score -= 10;
    }

    // Viral keywords
    const viral_words = [
      'shocking', 'secret', 'doctors', 'scientists', 'study', 'proven',
      'breakthrough', 'discovered', 'truth', 'hidden', 'reveals'
    ];
    const viral_count = viral_words.filter(word => 
      full_script.toLowerCase().includes(word.toLowerCase())
    ).length;
    score += Math.min(viral_count * 4, 20);

    // Emotional engagement
    const emotion_words = [
      'struggled', 'frustrated', 'desperate', 'amazed', 'shocked',
      'transformed', 'incredible', 'life-changing', 'finally'
    ];
    const emotion_count = emotion_words.filter(word => 
      full_script.toLowerCase().includes(word.toLowerCase())
    ).length;
    score += Math.min(emotion_count * 3, 15);

    // Call to action strength
    const cta = script.script.cta;
    const strong_ctas = ['link in bio', 'comment', 'dm me', 'save this', 'follow for'];
    if (strong_ctas.some(phrase => cta.toLowerCase().includes(phrase))) {
      score += 10;
    }

    // Claude insights bonus
    if (script.claude_insights.pain_point) {
      score += 5;
    }

    return Math.min(100, score);
  }
}

// Example usage and testing
export async function testOptimizedDualSystem(): Promise<BatchResult | null> {
  const claude_key = process.env.CLAUDE_API_KEY;
  const openai_key = process.env.OPENAI_API_KEY;

  if (!claude_key || !openai_key) {
    console.log("❌ Missing API keys");
    return null;
  }

  const products: ProductData[] = [
    {
      name: 'Advanced Energy Complex with CoQ10',
      price: '39.99',
      category: 'energy'
    },
    {
      name: 'Metabolic Fat Burner with Green Tea',
      price: '29.99', 
      category: 'weight'
    }
  ];

  const system = new OptimizedDualAISystem(claude_key, openai_key);
  const results = await system.generateOptimizedContentBatch(products, 2);

  console.log(`Generated ${results.analytics.total_scripts} scripts`);
  console.log(`Claude calls: ${results.analytics.claude_api_calls}`);
  console.log(`OpenAI calls: ${results.analytics.openai_api_calls}`);
  console.log(`Estimated cost: $${results.analytics.estimated_total_cost}`);

  if (results.scripts.length > 0) {
    const top_script = results.scripts[0];
    console.log(`\nTop Script (Score: ${top_script.viral_score}):`);
    console.log(`Product: ${top_script.product.name}`);
    console.log(`Words: ${top_script.word_count}`);
    console.log(`Duration: ${top_script.duration_estimate}s`);
    console.log(`Script: ${top_script.script.full_script}`);
  }

  return results;
}

export default OptimizedDualAISystem;