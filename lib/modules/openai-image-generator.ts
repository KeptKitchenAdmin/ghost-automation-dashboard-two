/**
 * OpenAI Image Generation for Supplement Viral Videos
 * High-converting visual content targeting American health epidemics
 * Generates hook, problem, solution, and proof images
 */

import { AmericanPainPoint } from './supplement-pain-point-engine';

export enum ImageType {
  HOOK_PROBLEM = "hook_problem",           // Problem visualization - grab attention
  EMOTIONAL_STRUGGLE = "emotional_struggle", // Amplify the pain point emotionally
  SOLUTION_PRODUCT = "solution_product",   // Product introduction
  SOCIAL_PROOF = "social_proof",          // Credibility and testimonials
  INGREDIENT_DISPLAY = "ingredient_display", // Show ingredients/transparency
  BEFORE_AFTER = "before_after"          // Transformation imagery
}

export enum ImageStyle {
  DOCUMENTARY_PHOTOGRAPHY = "documentary_photography",
  EMOTIONAL_REALISM = "emotional_realism",
  WORKPLACE_STRUGGLE = "workplace_struggle",
  NIGHT_PHOTOGRAPHY = "night_photography",
  MEDICAL_DOCUMENTARY = "medical_documentary",
  PRODUCT_PHOTOGRAPHY = "product_photography",
  SCIENTIFIC_DATA = "scientific_data",
  TESTIMONIAL_GRID = "testimonial_grid",
  MEDICAL_AUTHORITY = "medical_authority"
}

export interface SupplementImageRequest {
  image_type: ImageType;
  pain_point: AmericanPainPoint;
  product_info: Record<string, any>;
  style: ImageStyle;
  custom_prompt_additions?: string;
}

export interface SupplementImageResponse {
  image_url: string;
  image_type: ImageType;
  pain_point: AmericanPainPoint;
  style: ImageStyle;
  prompt_used: string;
  generation_time: number;
  cost: number;
}

interface HookPrompt {
  primary: string;
  style: ImageStyle;
  mood: string;
  variants: string[];
}

interface PromptVariant {
  primary: string;
  style: ImageStyle;
  variants: string[];
}

interface GenerationConfig {
  model: string;
  quality: string;
  size: string;
  style: string;
  response_format: string;
}

export class SupplementImagePrompts {
  public hook_prompts: Record<AmericanPainPoint, HookPrompt>;
  public solution_prompts: Record<string, PromptVariant>;
  public proof_prompts: Record<string, PromptVariant>;

  constructor() {
    // Hook images - problem visualization for each American pain point
    this.hook_prompts = {
      [AmericanPainPoint.CHRONIC_FATIGUE]: {
        primary: "Photorealistic American office worker slumped over desk at 2pm, multiple empty coffee cups, fluorescent lighting, looks completely defeated and drained, corporate hell aesthetic, exhausted eyes, head in hands",
        style: ImageStyle.WORKPLACE_STRUGGLE,
        mood: "systemic_exhaustion",
        variants: [
          "Young professional falling asleep at laptop, 3pm energy crash visible, office cubicle environment, zombie-like exhaustion",
          "Parent sitting in car after work, too tired to go inside house, keys in lap, completely drained expression",
          "Person lying on couch fully clothed after work, shoes still on, passed out from exhaustion, modern American home"
        ]
      },

      [AmericanPainPoint.SLEEP_EPIDEMIC]: {
        primary: "Person lying awake in bed at 3:17am, phone showing the late hour, dark circles under eyes, exhausted but wired, typical American bedroom with blackout curtains, insomnia crisis",
        style: ImageStyle.NIGHT_PHOTOGRAPHY,
        mood: "chronic_insomnia",
        variants: [
          "Bedroom scene showing person tossing and turning, sheets twisted, clock showing 2:45am, frustrated expression",
          "Person sitting on edge of bed at 4am, head in hands, bedroom lit only by phone screen, pure exhaustion",
          "Split screen: person in bed wide awake vs same person exhausted during daytime, sleep cycle destroyed"
        ]
      },

      [AmericanPainPoint.BRAIN_FOG_MEMORY]: {
        primary: "American professional looking confused and lost at computer screen, sticky notes everywhere, holding head in hands, can't focus or remember basic tasks, cognitive decline visible",
        style: ImageStyle.WORKPLACE_STRUGGLE,
        mood: "mental_imprisonment",
        variants: [
          "Person standing in kitchen holding car keys, looking completely lost, can't remember what they were doing",
          "Student staring blankly at textbook, words blurring together, brain fog preventing comprehension",
          "Parent forgetting child's name mid-sentence, embarrassed expression, family dinner table scene"
        ]
      },

      [AmericanPainPoint.METABOLIC_DAMAGE]: {
        primary: "Person standing on scale looking defeated, healthy salad and gym membership card visible nearby, frustrated expression, represents the metabolic damage epidemic making weight loss impossible",
        style: ImageStyle.EMOTIONAL_REALISM,
        mood: "betrayed_by_body",
        variants: [
          "Side-by-side comparison: person eating small salad vs thin friend eating pizza, weight gain despite eating less",
          "Closet full of progressively larger clothing sizes, person holding old jeans that no longer fit",
          "Person crying in fitting room mirror, clothes don't fit despite diet and exercise efforts"
        ]
      },

      [AmericanPainPoint.ANXIETY_DEPRESSION]: {
        primary: "Young American in modern apartment, hand on chest feeling heart race, anxiety attack visible on face, overwhelmed by modern life stressors, panic epidemic representation",
        style: ImageStyle.EMOTIONAL_REALISM,
        mood: "anxiety_epidemic",
        variants: [
          "Person avoiding social gathering, sitting alone in car outside party, too anxious to go inside",
          "Workplace anxiety: person sweating during normal meeting, heart racing over minor work stress",
          "Parent having panic attack while kids play nearby, trying to hide mental health struggle"
        ]
      },

      [AmericanPainPoint.CHRONIC_INFLAMMATION]: {
        primary: "Young person (25-35) holding inflamed joints in pain, moving like elderly person, inflammation visible, American lifestyle causing premature aging and chronic pain",
        style: ImageStyle.MEDICAL_DOCUMENTARY,
        mood: "premature_suffering",
        variants: [
          "Person struggling to open jar due to joint inflammation, age 30 but hands look 70",
          "Young athlete on sidelines due to chronic inflammation, dream destroyed by American diet",
          "Office worker with heating pad on back, chronic inflammation from sitting and processed food"
        ]
      },

      [AmericanPainPoint.HORMONAL_IMBALANCE]: {
        primary: "Woman looking in mirror not recognizing herself, mood swings visible, hormonal chaos from birth control and processed food, identity crisis from hormone disruption",
        style: ImageStyle.EMOTIONAL_REALISM,
        mood: "identity_loss",
        variants: [
          "Woman crying over minor issue, hormonal imbalance causing emotional instability",
          "Side-by-side: same woman during different weeks of cycle, completely different person",
          "Couple arguing due to hormonal mood swings destroying relationship, frustrated expressions"
        ]
      }
    };

    // Solution/product images
    this.solution_prompts = {
      supplement_bottle: {
        primary: "Clean, professional product shot of supplement bottle on pure white background, modern pharmaceutical-grade label design, high-quality studio lighting, trustworthy appearance",
        style: ImageStyle.PRODUCT_PHOTOGRAPHY,
        variants: [
          "Supplement bottle with ingredients list clearly visible, nutritional facts panel prominent, transparency focus",
          "Hand holding supplement bottle, showing size and premium quality, professional lighting",
          "Supplement bottle with natural ingredient sources arranged around it, herbs and plants visible"
        ]
      },

      transformation: {
        primary: "Split screen showing same person: left side showing the problem state, right side showing energetic and vibrant transformation, clear before/after, professional photography",
        style: ImageStyle.DOCUMENTARY_PHOTOGRAPHY,
        variants: [
          "Energy transformation: exhausted office worker on left, same person energetic and focused on right",
          "Sleep transformation: insomniac in bed on left, same person sleeping peacefully on right",
          "Cognitive transformation: confused person on left, sharp and focused same person on right"
        ]
      }
    };

    // Social proof images
    this.proof_prompts = {
      study_results: {
        primary: "Professional scientific study chart showing positive supplement results, clean graphs and data visualization, medical research aesthetic, credible presentation, peer-reviewed appearance",
        style: ImageStyle.SCIENTIFIC_DATA,
        variants: [
          "Multiple research papers scattered showing supplement studies, prestigious journal headers visible",
          "Doctor pointing to research data on computer screen, clinical study results showing efficacy",
          "Before/after blood work results showing supplement impact, medical lab report format"
        ]
      },

      customer_testimonials: {
        primary: "Collage of diverse, happy customers with authentic 5-star ratings, real people success stories, professional testimonial layout, trustworthy social proof",
        style: ImageStyle.TESTIMONIAL_GRID,
        variants: [
          "Screenshot grid of positive Amazon reviews, verified purchase badges visible",
          "Video testimonial thumbnails showing real customers, play buttons and star ratings",
          "Text message screenshots from customers sharing their success stories"
        ]
      },

      doctor_endorsement: {
        primary: "Professional doctor in white coat pointing to supplement bottle, medical office background, trustworthy healthcare professional giving endorsement, medical authority",
        style: ImageStyle.MEDICAL_AUTHORITY,
        variants: [
          "Doctor explaining supplement science to patient, medical diagram on wall behind",
          "Physician writing supplement recommendation on prescription pad, professional consultation",
          "Medical conference speaker presenting supplement research to audience of doctors"
        ]
      }
    };
  }
}

export class OpenAIImageGenerator {
  private api_key: string;
  private base_url: string;
  private prompt_database: SupplementImagePrompts;
  private generation_config: GenerationConfig;
  private cost_per_image: number;

  constructor(api_key?: string) {
    this.api_key = api_key || process.env.OPENAI_API_KEY || '';
    if (!this.api_key) {
      throw new Error("OpenAI API key is required");
    }

    this.base_url = "https://api.openai.com/v1";
    this.prompt_database = new SupplementImagePrompts();

    // Generation settings
    this.generation_config = {
      model: "dall-e-3",
      quality: "hd",
      size: "1024x1792",  // Vertical format for TikTok/social media
      style: "vivid",     // More dramatic and eye-catching
      response_format: "url"
    };

    // Cost tracking
    this.cost_per_image = 0.08;  // DALL-E 3 HD pricing
  }

  async generateSupplementImageSequence(
    pain_point: AmericanPainPoint,
    product_info: Record<string, any>
  ): Promise<SupplementImageResponse[]> {
    try {
      console.log(`Generating image sequence for ${pain_point} supplement content`);

      const image_sequence: SupplementImageResponse[] = [];

      // 1. Hook image - problem visualization
      const hook_request: SupplementImageRequest = {
        image_type: ImageType.HOOK_PROBLEM,
        pain_point: pain_point,
        product_info: product_info,
        style: this.prompt_database.hook_prompts[pain_point].style
      };
      const hook_image = await this.generateSingleImage(hook_request);
      image_sequence.push(hook_image);

      // 2. Emotional struggle amplification
      const struggle_request: SupplementImageRequest = {
        image_type: ImageType.EMOTIONAL_STRUGGLE,
        pain_point: pain_point,
        product_info: product_info,
        style: this.prompt_database.hook_prompts[pain_point].style
      };
      const struggle_image = await this.generateSingleImage(struggle_request);
      image_sequence.push(struggle_image);

      // 3. Solution/product introduction
      const solution_request: SupplementImageRequest = {
        image_type: ImageType.SOLUTION_PRODUCT,
        pain_point: pain_point,
        product_info: product_info,
        style: ImageStyle.PRODUCT_PHOTOGRAPHY
      };
      const solution_image = await this.generateSingleImage(solution_request);
      image_sequence.push(solution_image);

      // 4. Social proof
      const proof_request: SupplementImageRequest = {
        image_type: ImageType.SOCIAL_PROOF,
        pain_point: pain_point,
        product_info: product_info,
        style: ImageStyle.SCIENTIFIC_DATA
      };
      const proof_image = await this.generateSingleImage(proof_request);
      image_sequence.push(proof_image);

      // 5. Ingredient display for transparency
      const ingredient_request: SupplementImageRequest = {
        image_type: ImageType.INGREDIENT_DISPLAY,
        pain_point: pain_point,
        product_info: product_info,
        style: ImageStyle.PRODUCT_PHOTOGRAPHY
      };
      const ingredient_image = await this.generateSingleImage(ingredient_request);
      image_sequence.push(ingredient_image);

      console.log(`Generated ${image_sequence.length} images for supplement video sequence`);
      return image_sequence;

    } catch (error) {
      console.error(`Image sequence generation failed: ${error}`);
      throw error;
    }
  }

  async generateSingleImage(request: SupplementImageRequest): Promise<SupplementImageResponse> {
    try {
      const start_time = Date.now();

      // Build prompt based on request type
      const prompt = this.buildImagePrompt(request);

      // Generate image via OpenAI API
      const image_url = await this.callOpenAIAPI(prompt);

      const generation_time = (Date.now() - start_time) / 1000;

      const response: SupplementImageResponse = {
        image_url: image_url,
        image_type: request.image_type,
        pain_point: request.pain_point,
        style: request.style,
        prompt_used: prompt,
        generation_time: generation_time,
        cost: this.cost_per_image
      };

      console.log(`Generated ${request.image_type} image in ${generation_time.toFixed(1)}s`);
      return response;

    } catch (error) {
      console.error(`Single image generation failed: ${error}`);
      throw error;
    }
  }

  private buildImagePrompt(request: SupplementImageRequest): string {
    let base_prompt: string;

    if (request.image_type === ImageType.HOOK_PROBLEM) {
      // Use pain point specific hook prompt
      base_prompt = this.prompt_database.hook_prompts[request.pain_point].primary;

    } else if (request.image_type === ImageType.EMOTIONAL_STRUGGLE) {
      // Use variant hook prompt for emotional amplification
      const variants = this.prompt_database.hook_prompts[request.pain_point].variants;
      base_prompt = variants[0];  // Use first variant

    } else if (request.image_type === ImageType.SOLUTION_PRODUCT) {
      // Product shot with supplement name
      const product_name = request.product_info?.name || 'Premium Supplement';
      base_prompt = `Professional product photography of ${product_name} supplement bottle, clean white background, pharmaceutical grade appearance, modern label design, high-quality studio lighting, premium health product`;

    } else if (request.image_type === ImageType.SOCIAL_PROOF) {
      // Scientific credibility
      base_prompt = this.prompt_database.proof_prompts.study_results.primary;

    } else if (request.image_type === ImageType.INGREDIENT_DISPLAY) {
      // Ingredient transparency
      base_prompt = "Supplement bottle with ingredients list clearly visible, nutritional facts panel prominent, clean product photography, transparency and trust focus, pharmaceutical quality";

    } else {
      // Fallback
      base_prompt = "Professional supplement marketing image, high quality, clean design";
    }

    // Add style and quality modifiers
    const style_modifiers: Record<ImageStyle, string> = {
      [ImageStyle.DOCUMENTARY_PHOTOGRAPHY]: ", photojournalistic style, authentic documentary photography, raw emotional truth",
      [ImageStyle.EMOTIONAL_REALISM]: ", emotional photography, authentic human struggle, realistic lighting",
      [ImageStyle.WORKPLACE_STRUGGLE]: ", corporate environment, office lighting, professional workplace setting",
      [ImageStyle.NIGHT_PHOTOGRAPHY]: ", low light photography, nighttime mood, soft artificial lighting",
      [ImageStyle.MEDICAL_DOCUMENTARY]: ", medical photography style, clinical documentation, health crisis representation",
      [ImageStyle.PRODUCT_PHOTOGRAPHY]: ", commercial product photography, studio lighting, professional marketing image",
      [ImageStyle.SCIENTIFIC_DATA]: ", scientific visualization, clean data presentation, medical research aesthetic",
      [ImageStyle.TESTIMONIAL_GRID]: ", social media layout, user-generated content style, authentic testimonials",
      [ImageStyle.MEDICAL_AUTHORITY]: ", medical professional photography, clinical environment, authoritative presence"
    };

    const style_modifier = style_modifiers[request.style] || "";

    // Quality and format modifiers
    const quality_modifiers = ", photorealistic, high resolution, professional quality, dramatic lighting, emotionally impactful, viral content style, American demographic, modern day setting";

    // Combine prompt elements
    let full_prompt = base_prompt + style_modifier + quality_modifiers;

    // Add custom additions if provided
    if (request.custom_prompt_additions) {
      full_prompt += `, ${request.custom_prompt_additions}`;
    }

    // Ensure prompt length is optimal (DALL-E 3 works best with detailed prompts)
    if (full_prompt.length > 4000) {
      full_prompt = full_prompt.substring(0, 4000);
    }

    return full_prompt;
  }

  private async callOpenAIAPI(prompt: string): Promise<string> {
    const headers = {
      "Authorization": `Bearer ${this.api_key}`,
      "Content-Type": "application/json"
    };

    const payload = {
      model: this.generation_config.model,
      prompt: prompt,
      n: 1,
      size: this.generation_config.size,
      quality: this.generation_config.quality,
      style: this.generation_config.style,
      response_format: this.generation_config.response_format
    };

    try {
      const response = await fetch(`${this.base_url}/images/generations`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const image_url = data.data[0].url;
        return image_url;
      } else {
        const error_text = await response.text();
        throw new Error(`OpenAI API error ${response.status}: ${error_text}`);
      }

    } catch (error) {
      console.error(`OpenAI API call failed: ${error}`);
      throw error;
    }
  }

  async generateVariationImages(
    base_request: SupplementImageRequest,
    num_variations: number = 3
  ): Promise<SupplementImageResponse[]> {
    const variations: SupplementImageResponse[] = [];

    for (let i = 0; i < num_variations; i++) {
      // Modify prompt slightly for each variation
      const varied_request = { ...base_request };

      if (base_request.image_type === ImageType.HOOK_PROBLEM) {
        // Use different hook variants
        const variants = this.prompt_database.hook_prompts[base_request.pain_point].variants;
        if (i < variants.length) {
          varied_request.custom_prompt_additions = `Variation style: ${variants[i]}`;
        }
      }

      const variation = await this.generateSingleImage(varied_request);
      variations.push(variation);

      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return variations;
  }

  calculateSequenceCost(num_images: number): number {
    return num_images * this.cost_per_image;
  }

  getGenerationStats(): Record<string, any> {
    return {
      platform: "openai_dalle3",
      cost_per_image: this.cost_per_image,
      optimal_format: "1024x1792 (TikTok vertical)",
      generation_time: "10-30 seconds per image",
      supported_pain_points: Object.keys(AmericanPainPoint).length,
      image_types_per_sequence: 5,
      estimated_sequence_cost: this.calculateSequenceCost(5),
      quality: "HD photorealistic"
    };
  }
}

// Example usage function
export async function generateSupplementImagesExample(): Promise<void> {
  const sample_product = {
    name: "CoQ10 Ultra Absorption",
    description: "Premium CoQ10 with PQQ for cellular energy",
    price: 45.99
  };

  const generator = new OpenAIImageGenerator();

  try {
    // Generate full image sequence for chronic fatigue supplement
    const image_sequence = await generator.generateSupplementImageSequence(
      AmericanPainPoint.CHRONIC_FATIGUE,
      sample_product
    );

    console.log(`Generated ${image_sequence.length} images for supplement video:`);
    let total_cost = 0;
    image_sequence.forEach((image, i) => {
      console.log(`${i + 1}. ${image.image_type} - ${image.style}`);
      console.log(`   URL: ${image.image_url}`);
      console.log(`   Cost: $${image.cost}`);
      console.log(`   Time: ${image.generation_time.toFixed(1)}s`);
      total_cost += image.cost;
    });

    console.log(`\nTotal sequence cost: $${total_cost}`);

  } catch (error) {
    console.error('Example failed:', error);
  }
}