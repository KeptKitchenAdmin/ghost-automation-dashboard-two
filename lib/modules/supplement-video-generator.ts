/**
 * Supplement Viral Video Generator
 * Complete system for generating $10k-$60k viral supplement videos
 * Combines pain point analysis, script generation, images, and voice
 */

import { SupplementPainPointEngine, SupplementAnalysis, AmericanPainPoint, IngredientMatch } from './supplement-pain-point-engine';
import { OpenAIImageGenerator, SupplementImageRequest, SupplementImageResponse, ImageType } from './openai-image-generator';
import { ElevenLabsVoiceGenerator, VoiceRequest, VoiceResponse, VoicePersona, EmotionalTone } from './elevenlabs-voice-generator';

export enum SupplementVideoFormat {
  VIRAL_SHORT = "viral_short",         // 15-30 seconds for TikTok/Reels
  EXTENDED_STORY = "extended_story",   // 45-60 seconds for deeper storytelling
  MULTI_VARIANT = "multi_variant"      // Multiple versions for A/B testing
}

export interface SupplementScriptRequest {
  product_info: Record<string, any>;
  pain_point_analysis: IngredientMatch;
  video_format: SupplementVideoFormat;
  target_length_seconds?: number;
  emphasis_type?: string; // "emotional_hook", "scientific_authority", "social_proof"
}

export interface SupplementScript {
  full_script: string;
  script_segments: Array<{
    text: string;
    emotion: string;
    timing: string;
    purpose?: string;
  }>;
  hook_variations: string[];
  emotional_flow: string[];
  estimated_duration: number;
  viral_score_prediction: number;
  target_pain_point: AmericanPainPoint;
  key_ingredients_mentioned: string[];
}

export interface SupplementVideoAssets {
  images: SupplementImageResponse[];
  voiceovers: VoiceResponse[];
  script: SupplementScript;
  assembly_instructions: Record<string, any>;
  estimated_production_cost: number;
  estimated_revenue_potential: number;
}

export interface SupplementVideoResponse {
  video_id: string;
  product_info: Record<string, any>;
  pain_point_analysis: SupplementAnalysis;
  video_assets: SupplementVideoAssets;
  performance_predictions: Record<string, any>;
  generation_metadata: Record<string, any>;
}

export class SupplementScriptEngine {
  private script_templates = {
    emotional_discovery: {
      structure: ["statistical_hook", "personal_struggle", "ingredient_revelation", "mechanism_explanation", "social_proof", "urgency_cta"],
      viral_potential: 0.95,
      best_for: ["chronic_fatigue", "brain_fog_memory", "anxiety_depression"]
    },
    
    scientific_authority: {
      structure: ["study_hook", "problem_amplification", "research_backing", "ingredient_science", "expert_endorsement", "scarcity_cta"],
      viral_potential: 0.85,
      best_for: ["chronic_inflammation", "metabolic_damage", "hormonal_imbalance"]
    },
    
    conspiracy_revelation: {
      structure: ["conspiracy_hook", "system_failure", "hidden_solution", "suppressed_evidence", "insider_knowledge", "revolution_cta"],
      viral_potential: 0.92,
      best_for: ["chronic_inflammation", "metabolic_damage", "sleep_epidemic"]
    }
  };

  private emotional_hooks: Record<AmericanPainPoint, string[]> = {
    [AmericanPainPoint.CHRONIC_FATIGUE]: [
      "73% of Americans hit an energy wall at 2pm every day",
      "Your ancestors worked 12-hour days and weren't this exhausted",
      "Why coffee stopped working and you need 3 cups just to function",
      "The energy crisis that's not about gas prices"
    ],
    
    [AmericanPainPoint.SLEEP_EPIDEMIC]: [
      "68% of Americans can't fall asleep naturally anymore",
      "Your great-grandparents never needed melatonin to sleep",
      "Why Americans need pills to do what humans did naturally for 200,000 years",
      "The sleep epidemic that's destroying American health"
    ],
    
    [AmericanPainPoint.BRAIN_FOG_MEMORY]: [
      "40% of Americans under 40 have memory problems their grandparents never had",
      "Can't remember where you put your keys 5 minutes ago?",
      "Your brain isn't aging - it's being systematically poisoned",
      "Why your focus is worse than a goldfish with ADHD"
    ],
    
    [AmericanPainPoint.METABOLIC_DAMAGE]: [
      "Only 12% of Americans have healthy metabolism",
      "Why Americans gain weight eating the same calories as skinny Europeans",
      "Your metabolism was sabotaged before you were even born",
      "The real reason 73% of Americans are overweight"
    ],
    
    [AmericanPainPoint.ANXIETY_DEPRESSION]: [
      "Anxiety rates tripled in 20 years - this isn't normal",
      "Your mental health crisis has a physical cause nobody talks about",
      "Why therapy isn't fixing your anxiety (and what will)",
      "The nutritional deficiency making 40% of Americans depressed"
    ],
    
    [AmericanPainPoint.CHRONIC_INFLAMMATION]: [
      "90% of American diseases stem from one hidden cause",
      "Why young Americans have arthritis their grandparents never got",
      "This is in 90% of American food and it's slowly killing you",
      "The inflammation epidemic destroying American health from the inside"
    ],
    
    [AmericanPainPoint.HORMONAL_IMBALANCE]: [
      "80% of American women have hormone levels their great-grandmothers never experienced",
      "Why your hormones are more damaged than a 70-year-old's",
      "The birth control and processed food hormone disaster",
      "Why American women feel like different people every week"
    ]
  };

  private struggle_amplification: Record<AmericanPainPoint, string[]> = {
    [AmericanPainPoint.CHRONIC_FATIGUE]: [
      "You're drinking 3 cups of coffee just to feel human",
      "You cancel plans because you're too exhausted to socialize",
      "Your kids think you're lazy but you're literally dying inside",
      "You feel guilty for being tired when you 'should' have energy"
    ],
    
    [AmericanPainPoint.SLEEP_EPIDEMIC]: [
      "You lie awake replaying every embarrassing moment from 5th grade",
      "You're too wired to sleep but too tired to function",
      "You dread bedtime because you know you'll stare at the ceiling for hours",
      "You wake up more exhausted than when you went to bed"
    ],
    
    [AmericanPainPoint.BRAIN_FOG_MEMORY]: [
      "You feel stupid in meetings when you used to be the sharp one",
      "You can't finish sentences without forgetting what you were saying",
      "You're embarrassed by your memory in front of colleagues",
      "You feel like your intelligence is slowly slipping away"
    ],
    
    [AmericanPainPoint.METABOLIC_DAMAGE]: [
      "You eat less than your thin friends but still gain weight",
      "You avoid mirrors and photos of yourself",
      "You buy bigger clothes every few months",
      "You feel completely betrayed by your own body"
    ],
    
    [AmericanPainPoint.ANXIETY_DEPRESSION]: [
      "Your heart races over things that shouldn't matter",
      "You avoid situations you used to enjoy",
      "You feel like you're going crazy but all your tests are 'normal'",
      "You're exhausted from worrying about literally everything"
    ],
    
    [AmericanPainPoint.CHRONIC_INFLAMMATION]: [
      "You wake up stiff and sore every single morning",
      "Your joints ache when the weather changes",
      "You feel older than your actual age",
      "You're popping ibuprofen like candy just to function"
    ],
    
    [AmericanPainPoint.HORMONAL_IMBALANCE]: [
      "You feel like a completely different person depending on the week",
      "Your mood swings are destroying your relationships",
      "You don't recognize yourself in the mirror anymore",
      "You feel broken and unfixable"
    ]
  };

  generateSupplementScript(request: SupplementScriptRequest): SupplementScript {
    try {
      console.log(`Generating script for ${request.pain_point_analysis.pain_point}`);
      
      // Select optimal template
      const templateName = this.selectOptimalTemplate(request);
      const template = this.script_templates[templateName as keyof typeof this.script_templates];
      
      // Generate script segments
      const script_segments: Array<{text: string; emotion: string; timing: string; purpose?: string}> = [];
      for (const segment_type of template.structure) {
        const segment = this.generateScriptSegment(segment_type, request);
        script_segments.push(segment);
      }
      
      // Combine into full script
      const full_script = this.assembleFullScript(script_segments);
      
      // Generate hook variations for A/B testing
      const hook_variations = this.generateHookVariations(request);
      
      // Calculate emotional flow
      const emotional_flow = script_segments.map(seg => seg.emotion);
      
      // Estimate duration (150 words per minute average)
      const word_count = full_script.split(' ').length;
      const estimated_duration = (word_count / 150) * 60;
      
      // Predict viral score
      const viral_score = this.calculateScriptViralScore(request, template);
      
      const script: SupplementScript = {
        full_script,
        script_segments,
        hook_variations,
        emotional_flow,
        estimated_duration,
        viral_score_prediction: viral_score,
        target_pain_point: request.pain_point_analysis.pain_point,
        key_ingredients_mentioned: request.pain_point_analysis.matched_ingredients
      };
      
      console.log(`Script generated: ${word_count} words, ${estimated_duration.toFixed(1)}s, viral score ${viral_score.toFixed(1)}`);
      return script;
      
    } catch (error) {
      console.error(`Script generation failed: ${error}`);
      throw error;
    }
  }

  private selectOptimalTemplate(request: SupplementScriptRequest): string {
    const pain_point = request.pain_point_analysis.pain_point;
    
    // Choose template based on pain point characteristics
    if ([AmericanPainPoint.CHRONIC_FATIGUE, AmericanPainPoint.ANXIETY_DEPRESSION].includes(pain_point)) {
      return "emotional_discovery";
    } else if ([AmericanPainPoint.CHRONIC_INFLAMMATION, AmericanPainPoint.METABOLIC_DAMAGE].includes(pain_point)) {
      return "conspiracy_revelation";
    } else {
      return "scientific_authority";
    }
  }

  private generateScriptSegment(segment_type: string, request: SupplementScriptRequest): {text: string; emotion: string; timing: string; purpose: string} {
    const pain_point = request.pain_point_analysis.pain_point;
    const product = request.product_info;
    const primary_ingredient = request.pain_point_analysis.matched_ingredients[0] || "key nutrients";
    
    const segment_generators: Record<string, () => {text: string; emotion: string; timing: string; purpose: string}> = {
      statistical_hook: () => ({
        text: this.getRandomItem(this.emotional_hooks[pain_point]),
        emotion: "shocking_revelation",
        timing: "0-3s",
        purpose: "grab_attention"
      }),
      
      personal_struggle: () => ({
        text: this.getRandomItem(this.struggle_amplification[pain_point]),
        emotion: "empathetic_understanding", 
        timing: "3-8s",
        purpose: "emotional_connection"
      }),
      
      ingredient_revelation: () => ({
        text: `The real problem? Your body is desperately missing ${primary_ingredient}. Your great-grandparents got this naturally, but it's been stripped from our food supply.`,
        emotion: "hopeful_excitement",
        timing: "8-15s", 
        purpose: "solution_introduction"
      }),
      
      mechanism_explanation: () => ({
        text: `Here's what ${primary_ingredient} actually does: ${this.getMechanismExplanation(primary_ingredient, pain_point)}`,
        emotion: "confident_authority",
        timing: "15-22s",
        purpose: "credibility_building"
      }),
      
      social_proof: () => ({
        text: `"I tried everything for my ${pain_point.replace('_', ' ')}. This was the only thing that actually worked." - Sarah, verified buyer`,
        emotion: "confident_authority",
        timing: "22-27s",
        purpose: "social_validation"
      }),
      
      urgency_cta: () => ({
        text: `Link in bio, but they're limiting orders to 3 bottles per person. Don't wait - your ${pain_point.replace('_', ' ')} won't fix itself.`,
        emotion: "urgent_concern",
        timing: "27-30s",
        purpose: "action_driver"
      }),
      
      study_hook: () => ({
        text: `Over 200 published studies prove ${primary_ingredient} works. So why don't doctors tell you about it?`,
        emotion: "shocking_revelation",
        timing: "0-4s",
        purpose: "authority_establishment"
      }),
      
      conspiracy_hook: () => ({
        text: `The supplement industry doesn't want you to know this about ${primary_ingredient}...`,
        emotion: "shocking_revelation", 
        timing: "0-3s",
        purpose: "conspiracy_intrigue"
      }),
      
      scarcity_cta: () => ({
        text: `Real ${primary_ingredient} is expensive to source. Most companies use cheap synthetics. This is one of the few using the real thing.`,
        emotion: "urgent_concern",
        timing: "25-30s",
        purpose: "scarcity_urgency"
      })
    };
    
    const generator = segment_generators[segment_type];
    if (generator) {
      return generator();
    } else {
      // Fallback segment
      return {
        text: `This supplement contains ${primary_ingredient} for ${pain_point.replace('_', ' ')} support.`,
        emotion: "confident_authority",
        timing: "unknown",
        purpose: "fallback"
      };
    }
  }

  private getMechanismExplanation(ingredient: string, pain_point: AmericanPainPoint): string {
    const explanations: Record<string, string> = {
      [`CoQ10_${pain_point}`]: "powers your cellular energy factories that have been damaged by processed food and chronic stress",
      [`Magnesium Glycinate_${pain_point}`]: "calms your overactive nervous system and reduces the cortisol keeping you wired at night",
      [`Lion's Mane_${pain_point}`]: "regenerates brain cells and rebuilds the neural pathways damaged by inflammation",
      [`Berberine_${pain_point}`]: "resets your insulin sensitivity and repairs metabolic damage from decades of processed food",
      [`Ashwagandha_${pain_point}`]: "regulates cortisol and rebalances the stress hormones wreaking havoc on your mental health",
      [`Curcumin_${pain_point}`]: "shuts down the inflammatory pathways causing 90% of American diseases"
    };
    
    return explanations[`${ingredient}_${pain_point}`] || "supports your body's natural healing processes";
  }

  private assembleFullScript(segments: Array<{text: string; emotion: string; timing: string; purpose?: string}>): string {
    const script_parts = segments.map(segment => segment.text);
    return script_parts.join(" ... ");
  }

  private generateHookVariations(request: SupplementScriptRequest): string[] {
    const pain_point = request.pain_point_analysis.pain_point;
    const available_hooks = this.emotional_hooks[pain_point];
    
    // Return 3 different hooks for testing
    return available_hooks.length >= 3 ? available_hooks.slice(0, 3) : available_hooks;
  }

  private calculateScriptViralScore(request: SupplementScriptRequest, template: any): number {
    const base_score = template.viral_potential * 100;
    
    // Adjust for pain point relatability
    const pain_point_scores: Record<AmericanPainPoint, number> = {
      [AmericanPainPoint.CHRONIC_FATIGUE]: 95,
      [AmericanPainPoint.METABOLIC_DAMAGE]: 92,
      [AmericanPainPoint.BRAIN_FOG_MEMORY]: 88,
      [AmericanPainPoint.SLEEP_EPIDEMIC]: 90,
      [AmericanPainPoint.ANXIETY_DEPRESSION]: 87,
      [AmericanPainPoint.CHRONIC_INFLAMMATION]: 85,
      [AmericanPainPoint.HORMONAL_IMBALANCE]: 83
    };
    
    const pain_score = pain_point_scores[request.pain_point_analysis.pain_point] || 80;
    
    // Combine scores
    const final_score = (base_score * 0.6) + (pain_score * 0.4);
    
    return Math.min(final_score, 100);
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}

export class SupplementVideoGenerator {
  private pain_point_engine: SupplementPainPointEngine;
  private script_engine: SupplementScriptEngine;
  private image_generator: OpenAIImageGenerator;
  private voice_generator: ElevenLabsVoiceGenerator;
  
  constructor(openai_api_key?: string, elevenlabs_api_key?: string) {
    this.pain_point_engine = new SupplementPainPointEngine();
    this.script_engine = new SupplementScriptEngine();
    this.image_generator = new OpenAIImageGenerator(openai_api_key);
    this.voice_generator = new ElevenLabsVoiceGenerator(elevenlabs_api_key);
  }

  async createSupplementVideo(
    product_info: Record<string, any>, 
    video_format: SupplementVideoFormat = SupplementVideoFormat.VIRAL_SHORT
  ): Promise<SupplementVideoResponse> {
    try {
      const video_id = `supplement_${Math.floor(Date.now() / 1000)}`;
      console.log(`Creating supplement video ${video_id} for ${product_info.name || 'Unknown Product'}`);
      
      // 1. Analyze product for pain point matching
      const pain_point_analysis = this.pain_point_engine.analyzeSupplementProduct(product_info);
      
      if (!pain_point_analysis || pain_point_analysis.viral_score < 60) {
        throw new Error(`Product ${product_info.name} has insufficient viral potential (score: ${pain_point_analysis?.viral_score || 0})`);
      }
      
      // 2. Generate emotional script
      const script_request: SupplementScriptRequest = {
        product_info,
        pain_point_analysis: pain_point_analysis.best_pain_point_match,
        video_format,
        target_length_seconds: video_format === SupplementVideoFormat.VIRAL_SHORT ? 30 : 60
      };
      
      const script = this.script_engine.generateSupplementScript(script_request);
      
      // 3. Generate image sequence
      const images = await this.image_generator.generateSupplementImageSequence(
        pain_point_analysis.best_pain_point_match.pain_point,
        product_info
      );
      
      // 4. Generate voiceover
      const voiceover_request: VoiceRequest = {
        script: script.full_script,
        voice_persona: VoicePersona.CONCERNED_FEMALE,  // Default to highest converting
        emotional_tone: EmotionalTone.SHOCKING_REVELATION,
        pain_point: pain_point_analysis.best_pain_point_match.pain_point
      };
      
      const voiceover = await this.voice_generator.generateSupplementVoiceover(voiceover_request);
      
      // 5. Create video assets bundle
      const video_assets: SupplementVideoAssets = {
        images,
        voiceovers: [voiceover],
        script,
        assembly_instructions: this.createAssemblyInstructions(images, voiceover, script),
        estimated_production_cost: this.calculateProductionCost(images, [voiceover]),
        estimated_revenue_potential: pain_point_analysis.revenue_estimate
      };
      
      // 6. Generate performance predictions
      const performance_predictions = this.generatePerformancePredictions(pain_point_analysis, script);
      
      // 7. Create final response
      const response: SupplementVideoResponse = {
        video_id,
        product_info,
        pain_point_analysis,
        video_assets,
        performance_predictions,
        generation_metadata: {
          generated_at: new Date().toISOString(),
          generation_time: "estimated_3_5_minutes",
          format: video_format,
          components: {
            images: images.length,
            voiceover_segments: 1,
            script_words: script.full_script.split(' ').length,
            estimated_duration: script.estimated_duration
          }
        }
      };
      
      console.log(`Supplement video ${video_id} created successfully - Revenue potential: $${pain_point_analysis.revenue_estimate.toLocaleString()}`);
      return response;
      
    } catch (error) {
      console.error(`Supplement video creation failed: ${error}`);
      throw error;
    }
  }

  private createAssemblyInstructions(
    images: SupplementImageResponse[], 
    voiceover: VoiceResponse, 
    script: SupplementScript
  ): Record<string, any> {
    return {
      video_format: "vertical_9_16",
      total_duration: script.estimated_duration,
      image_sequence: images.map(img => ({
        image_url: img.image_url,
        display_duration: script.estimated_duration / images.length,
        image_type: img.image_type,
        transition: "quick_cut"
      })),
      audio_track: {
        voiceover_url: voiceover.audio_url,
        volume: 0.8,
        background_music: null  // Could add background music
      },
      text_overlays: script.script_segments.map(segment => ({
        text: segment.text.length > 50 ? segment.text.substring(0, 50) + "..." : segment.text,
        timing: segment.timing,
        style: "supplement_viral_style"
      })),
      effects: {
        transitions: "fast_cuts",
        color_grading: "warm_health_focused",
        text_animations: "pop_in_emphasis"
      }
    };
  }

  private calculateProductionCost(images: SupplementImageResponse[], voiceovers: VoiceResponse[]): number {
    const image_cost = images.reduce((sum, img) => sum + img.cost, 0);
    const voice_cost = voiceovers.reduce((sum, voice) => sum + voice.cost, 0);
    
    return image_cost + voice_cost;
  }

  private generatePerformancePredictions(analysis: SupplementAnalysis, script: SupplementScript): Record<string, any> {
    return {
      viral_score: script.viral_score_prediction,
      revenue_estimate: analysis.revenue_estimate,
      engagement_prediction: {
        estimated_views: Math.floor(script.viral_score_prediction * 10000),  // Up to 1M views
        estimated_engagement_rate: 0.15,  // 15% engagement for supplement content
        estimated_conversion_rate: 0.08,  // 8% conversion rate
        estimated_sales: Math.floor(script.viral_score_prediction * 800)  // Estimated sales
      },
      optimal_posting_times: ["7-9 AM EST", "6-8 PM EST", "9-10 PM EST"],
      target_demographics: {
        primary: "Adults 25-55 with health concerns",
        secondary: "Health-conscious Americans seeking solutions",
        pain_point: analysis.best_pain_point_match.pain_point
      },
      a_b_testing_recommendations: {
        test_hook_variations: script.hook_variations,
        test_voice_personas: ["concerned_female", "authoritative_male"],
        test_thumbnails: "Problem vs solution split-screen"
      }
    };
  }

  async createVideoVariations(product_info: Record<string, any>, num_variations: number = 3): Promise<SupplementVideoResponse[]> {
    const variations: SupplementVideoResponse[] = [];
    
    for (let i = 0; i < num_variations; i++) {
      try {
        // Use different video formats and approaches
        const format_options = [SupplementVideoFormat.VIRAL_SHORT, SupplementVideoFormat.EXTENDED_STORY];
        const selected_format = format_options[i % format_options.length];
        
        const video = await this.createSupplementVideo(product_info, selected_format);
        variations.push(video);
        
        // Small delay between generations
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Failed to create variation ${i+1}: ${error}`);
        continue;
      }
    }
    
    return variations;
  }

  getSupplementGenerationStats(): Record<string, any> {
    return {
      platform: "supplement_viral_generator",
      target_revenue_per_video: "$10k - $60k",
      production_cost_per_video: "$5 - $15",
      roi_potential: "1000x - 4000x",
      generation_time: "3-5 minutes per video",
      components: {
        pain_points_supported: Object.keys(AmericanPainPoint).length,
        script_templates: Object.keys(this.script_engine['script_templates']).length,
        image_types_per_video: 5,
        voice_personas: 5
      },
      success_metrics: {
        minimum_viral_score: 60,
        target_engagement_rate: "15%+",
        target_conversion_rate: "8%+",
        optimal_video_length: "15-30 seconds"
      }
    };
  }
}

// Example usage
export async function createSupplementVideoExample(): Promise<void> {
  const sample_product = {
    id: "coq10_ultra",
    name: "CoQ10 Ultra Absorption Complex",
    description: "Premium CoQ10 with PQQ and Ubiquinol for maximum cellular energy production",
    price: 49.99,
    commission: 30,
    monthly_sales: 12000,
    ingredients: "CoQ10, PQQ, Ubiquinol, BioPerine"
  };
  
  const generator = new SupplementVideoGenerator();
  
  // Create single viral video
  const video_response = await generator.createSupplementVideo(sample_product);
  
  console.log(`🎬 Supplement Video Created: ${video_response.video_id}`);
  console.log(`   Pain Point: ${video_response.pain_point_analysis.best_pain_point_match.pain_point}`);
  console.log(`   Viral Score: ${video_response.video_assets.script.viral_score_prediction.toFixed(1)}`);
  console.log(`   Revenue Estimate: $${video_response.video_assets.estimated_revenue_potential.toLocaleString()}`);
  console.log(`   Production Cost: $${video_response.video_assets.estimated_production_cost.toFixed(2)}`);
  console.log(`   ROI: ${Math.floor(video_response.video_assets.estimated_revenue_potential / video_response.video_assets.estimated_production_cost)}x`);
  console.log(`   Duration: ${video_response.video_assets.script.estimated_duration.toFixed(1)}s`);
  console.log(`   Images: ${video_response.video_assets.images.length}`);
  
  console.log(`\n📝 Script Preview:`);
  console.log(`   ${video_response.video_assets.script.full_script.substring(0, 200)}...`);
  
  console.log(`\n🎯 Performance Predictions:`);
  const predictions = video_response.performance_predictions;
  console.log(`   Views: ${predictions.engagement_prediction.estimated_views.toLocaleString()}`);
  console.log(`   Engagement: ${(predictions.engagement_prediction.estimated_engagement_rate * 100).toFixed(1)}%`);
  console.log(`   Sales: ${predictions.engagement_prediction.estimated_sales.toLocaleString()}`);
}