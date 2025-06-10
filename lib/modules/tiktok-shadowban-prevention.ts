/**
 * TikTok Shadowban Prevention System
 * Implements comprehensive anti-shadowban safeguards for sustainable long-term growth
 */

import { BaseModel } from '../base-model';

// Interfaces
export interface VideoConfig {
  length: number;
  voice_speed: number;
  background_music: string;
  text_placement: string;
  transition_style: string;
  color_scheme: string;
  font_style: string;
}

export interface SafetyScore {
  score: number;
  issues: string[];
  is_safe: boolean;
  recommendations: string[];
}

export interface AIDisclosure {
  text: string;
  placement: string;
  duration: number;
  size: string;
  timestamp: string;
}

export interface PostingScheduleCheck {
  can_post: boolean;
  reason?: string;
  next_available: Date;
  recommended_next?: Date;
  safety_score?: number;
}

export interface ShadowbanRisk {
  risk_level: string;
  risk_score: number;
  risk_factors: string[];
  recommended_action: string;
  recovery_strategy: Record<string, any>;
}

export interface VariedContent {
  script: string;
  video_config: VideoConfig;
  ai_disclosure: AIDisclosure;
  safety_score: number;
  variation_id: string;
}

export class TikTokShadowbanPrevention extends BaseModel {
  private anti_shadowban_variation: Record<string, any[]>;
  private safe_health_claims: Record<string, string[]>;
  private ai_disclosure_options: string[];
  private disclosure_placement: Record<string, any>;
  private quality_safeguards: Record<string, any>;
  private content_red_flags: string[];
  private safe_categories: string[];

  constructor() {
    super();
    
    // Content variation patterns to prevent detection
    this.anti_shadowban_variation = {
      video_length: [15, 18, 22, 25, 30],  // Vary length randomly
      voice_speed: [0.9, 1.0, 1.1],  // Slight speed variations
      background_music: ["upbeat_1", "calm_2", "energetic_3", "ambient_4"],
      text_placement: ["top", "center", "bottom", "side"],
      transitions: ["fade", "slide", "zoom", "cut", "dissolve"],
      color_schemes: ["warm", "cool", "neutral", "vibrant"],
      font_styles: ["modern", "classic", "bold", "minimal"]
    };
    
    // Safe health claims and compliant language
    this.safe_health_claims = {
      acceptable_claims: [
        "Tired all the time? Try vitamin C",
        "Can't sleep? Magnesium may help",
        "Brain fog? B-vitamins support cognitive function",
        "Low energy? Iron deficiency is common",
        "Stress eating? Ashwagandha supports stress response",
        "Always hungry? Protein helps with satiety",
        "Feeling sluggish? CoQ10 supports cellular energy",
        "Poor focus? Omega-3s support brain health"
      ],
      
      safe_language: [
        "may help", "supports", "research shows", "studies suggest",
        "commonly used for", "traditionally supports", "may improve",
        "research indicates", "studies find", "evidence suggests",
        "may support", "traditionally used", "research-backed"
      ],
      
      avoid_language: [
        "cures", "treats", "heals", "fixes", "guaranteed",
        "doctors hate this", "medical breakthrough", "miracle",
        "instant cure", "secret remedy", "banned by FDA"
      ]
    };
    
    // AI disclosure strategies (compliant but minimal)
    this.ai_disclosure_options = [
      "Content created with AI assistance #ai #educational",
      "AI-generated educational content #aiassisted",
      "Created using artificial intelligence #technology",
      "Educational content with AI support #learn",
      "AI-assisted educational material #science"
    ];
    
    this.disclosure_placement = {
      methods: [
        "video_description_end",
        "small_corner_text_1sec",
        "caption_hashtag_area",
        "quick_flash_overlay"
      ],
      text_size: "small_but_readable",
      duration_seconds: [1, 2],  // Brief but visible
      rotation_pattern: "random"
    };
    
    // Quality and safety checks
    this.quality_safeguards = {
      originality_score_min: 85,  // Minimum 85% original content
      duplicate_detection: true,
      fact_checking: true,
      controversy_level: "medium",  // Avoid extreme controversy
      max_hashtags: 5,  // Don't spam hashtags
      community_guidelines: "strict"
    };
    
    // Red flags to completely avoid
    this.content_red_flags = [
      "claims of curing diseases",
      "anti-vaccine content",
      "dangerous health advice",
      "unregulated substance promotion",
      "harmful conspiracy theories",
      "community guideline violations",
      "fake medical credentials",
      "emergency medical advice"
    ];
    
    // Safe content categories
    this.safe_categories = [
      "educational_health_content",
      "historical_facts_documents",
      "nutrition_education",
      "lifestyle_wellness_tips",
      "science_research_explanations",
      "supplement_education",
      "fitness_motivation",
      "mental_health_awareness"
    ];
  }

  generate_varied_content(base_script: string, product_info: Record<string, any>): VariedContent {
    // Select random variations
    const video_config: VideoConfig = {
      length: this.randomChoice(this.anti_shadowban_variation.video_length),
      voice_speed: this.randomChoice(this.anti_shadowban_variation.voice_speed),
      background_music: this.randomChoice(this.anti_shadowban_variation.background_music),
      text_placement: this.randomChoice(this.anti_shadowban_variation.text_placement),
      transition_style: this.randomChoice(this.anti_shadowban_variation.transitions),
      color_scheme: this.randomChoice(this.anti_shadowban_variation.color_schemes),
      font_style: this.randomChoice(this.anti_shadowban_variation.font_styles)
    };
    
    // Make script compliant and varied
    const compliant_script = this.make_script_compliant(base_script, product_info);
    const varied_script = this.add_script_variations(compliant_script);
    
    // Add AI disclosure
    const ai_disclosure = this.generate_ai_disclosure();
    
    return {
      script: varied_script,
      video_config,
      ai_disclosure,
      safety_score: this.calculate_safety_score(varied_script),
      variation_id: this.generate_variation_id()
    };
  }

  make_script_compliant(script: string, product_info: Record<string, any>): string {
    let compliant_script = script;
    
    // Replace dangerous language with safe alternatives
    for (const avoid_term of this.safe_health_claims.avoid_language) {
      const safe_replacement = this.randomChoice(this.safe_health_claims.safe_language);
      const regex = new RegExp(`\\b${this.escapeRegex(avoid_term)}\\b`, 'gi');
      compliant_script = compliant_script.replace(regex, safe_replacement);
    }
    
    // Add compliance disclaimers naturally
    const disclaimers = [
      "Not medical advice - consult your doctor",
      "Educational content only",
      "Individual results may vary",
      "Always check with healthcare provider",
      "For educational purposes"
    ];
    
    // Add disclaimer at end if health-related
    const healthKeywords = ["health", "supplement", "vitamin", "energy", "sleep"];
    if (healthKeywords.some(term => script.toLowerCase().includes(term))) {
      compliant_script += `\n\n${this.randomChoice(disclaimers)}`;
    }
    
    return compliant_script;
  }

  add_script_variations(script: string): string {
    // Vary opening phrases
    const openings = [
      "Ever wonder why...", "Did you know...", "Here's something crazy...",
      "This might shock you...", "Scientists discovered...", "Research shows..."
    ];
    
    // Vary transition phrases
    const transitions = [
      "But here's the thing...", "The crazy part is...", "What's interesting is...",
      "Studies reveal...", "The research shows...", "Evidence suggests..."
    ];
    
    // Vary closing CTAs
    const closings = [
      "Try this and let me know!", "Have you experienced this?",
      "Drop a comment with your thoughts!", "Share if this helped!",
      "What's your experience?", "Anyone else notice this?"
    ];
    
    // Apply random variations
    let varied_script = script;
    
    // Sometimes add varied opening
    if (Math.random() < 0.3) {
      varied_script = `${this.randomChoice(openings)} ${varied_script}`;
    }
    
    // Sometimes add transition
    if (Math.random() < 0.4) {
      const sentences = varied_script.split('. ');
      if (sentences.length > 2) {
        const insert_point = Math.floor(sentences.length / 2);
        sentences.splice(insert_point, 0, this.randomChoice(transitions));
        varied_script = sentences.join('. ');
      }
    }
    
    // Sometimes add varied closing
    if (Math.random() < 0.5) {
      varied_script += `\n\n${this.randomChoice(closings)}`;
    }
    
    return varied_script;
  }

  generate_ai_disclosure(): AIDisclosure {
    const disclosure_text = this.randomChoice(this.ai_disclosure_options);
    const placement_method = this.randomChoice(this.disclosure_placement.methods);
    const duration = this.randomChoice(this.disclosure_placement.duration_seconds);
    
    return {
      text: disclosure_text,
      placement: placement_method as string,
      duration: duration as number,
      size: this.disclosure_placement.text_size,
      timestamp: new Date().toISOString()
    };
  }

  calculate_safety_score(script: string): number {
    let score = 100;
    const script_lower = script.toLowerCase();
    
    // Deduct points for risky language
    for (const red_flag of this.safe_health_claims.avoid_language) {
      if (script_lower.includes(red_flag.toLowerCase())) {
        score -= 20;
      }
    }
    
    // Deduct points for red flag content
    for (const red_flag of this.content_red_flags) {
      const key_words = red_flag.split(' ');
      if (key_words.every(word => script_lower.includes(word.toLowerCase()))) {
        score -= 30;
      }
    }
    
    // Add points for safe language
    const safe_word_count = this.safe_health_claims.safe_language.filter(
      term => script_lower.includes(term.toLowerCase())
    ).length;
    score += Math.min(safe_word_count * 2, 20);
    
    // Ensure score is within bounds
    return Math.max(0, Math.min(100, score));
  }

  generate_variation_id(): string {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const random_suffix = Array.from({ length: 4 }, () => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');
    return `VAR_${timestamp}_${random_suffix}`;
  }

  check_posting_schedule(last_post_times: Date[]): PostingScheduleCheck {
    const now = new Date();
    
    // Check daily limits
    const today_posts = last_post_times.filter(
      post => post.toDateString() === now.toDateString()
    );
    
    if (today_posts.length >= 3) {  // Max 3 posts per day
      return {
        can_post: false,
        reason: "daily_limit_reached",
        next_available: new Date(now.getTime() + 24 * 60 * 60 * 1000)
      };
    }
    
    // Check minimum spacing (4 hours)
    if (last_post_times.length > 0) {
      const latest_post = new Date(Math.max(...last_post_times.map(d => d.getTime())));
      const time_since_last = now.getTime() - latest_post.getTime();
      const min_spacing = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      
      if (time_since_last < min_spacing) {
        return {
          can_post: false,
          reason: "too_soon",
          next_available: new Date(latest_post.getTime() + min_spacing)
        };
      }
    }
    
    // Generate randomized next posting time
    const next_post_delay = (Math.floor(Math.random() * 5) + 4) * 60 * 60 * 1000 + // 4-8 hours
                           Math.floor(Math.random() * 60) * 60 * 1000; // 0-59 minutes
    
    return {
      can_post: true,
      recommended_next: new Date(now.getTime() + next_post_delay),
      safety_score: 95,
      next_available: now
    };
  }

  detect_shadowban_risk(metrics: Record<string, number>): ShadowbanRisk {
    const risk_factors: string[] = [];
    let risk_score = 0;
    
    // Check view drop
    if (metrics.view_drop_percentage !== undefined) {
      if (metrics.view_drop_percentage > 50) {
        risk_factors.push("severe_view_drop");
        risk_score += 40;
      } else if (metrics.view_drop_percentage > 30) {
        risk_factors.push("moderate_view_drop");
        risk_score += 20;
      }
    }
    
    // Check reach decline
    if (metrics.reach_decline !== undefined && metrics.reach_decline > 40) {
      risk_factors.push("reach_decline");
      risk_score += 30;
    }
    
    // Check FYP disappearance
    if (metrics.fyp_appearance !== undefined && metrics.fyp_appearance < 0.1) {
      risk_factors.push("fyp_disappearance");
      risk_score += 35;
    }
    
    // Check engagement rate
    if (metrics.engagement_rate !== undefined && metrics.engagement_rate < 0.02) {
      risk_factors.push("low_engagement");
      risk_score += 15;
    }
    
    // Determine risk level
    let risk_level: string;
    let action: string;
    
    if (risk_score >= 60) {
      risk_level = "high";
      action = "pause_posting_48h";
    } else if (risk_score >= 30) {
      risk_level = "medium";
      action = "review_content_strategy";
    } else {
      risk_level = "low";
      action = "continue_monitoring";
    }
    
    return {
      risk_level,
      risk_score,
      risk_factors,
      recommended_action: action,
      recovery_strategy: this.get_recovery_strategy(risk_level)
    };
  }

  get_recovery_strategy(risk_level: string): Record<string, any> {
    if (risk_level === "high") {
      return {
        pause_posting: "48_hours",
        content_audit: true,
        strategy_change: "educational_focus",
        engagement_focus: "genuine_interactions",
        hashtag_cleanup: true
      };
    } else if (risk_level === "medium") {
      return {
        reduce_posting: "50_percent",
        diversify_content: true,
        increase_variations: true,
        monitor_closely: true
      };
    } else {
      return {
        maintain_current: true,
        small_adjustments: true,
        continue_monitoring: true
      };
    }
  }

  generate_compliant_hashtags(content_topic: string, max_tags: number = 5): string[] {
    // Base educational hashtags
    const base_tags = ["#educational", "#health", "#wellness", "#tips", "#science"];
    
    // Topic-specific safe hashtags
    const topic_hashtags: Record<string, string[]> = {
      supplements: ["#supplements", "#nutrition", "#vitamins", "#minerals"],
      energy: ["#energy", "#vitality", "#naturalenergy", "#healthylifestyle"],
      sleep: ["#sleep", "#sleephealth", "#insomnia", "#sleeptips"],
      stress: ["#stressrelief", "#mentalhealth", "#wellness", "#selfcare"],
      fitness: ["#fitness", "#exercise", "#workout", "#healthylife"]
    };
    
    // Get relevant hashtags
    const relevant_tags: string[] = [];
    for (const [topic, tags] of Object.entries(topic_hashtags)) {
      if (content_topic.toLowerCase().includes(topic)) {
        relevant_tags.push(...tags.slice(0, 2));  // Max 2 per topic
      }
    }
    
    // Combine and randomize
    const all_tags = [...base_tags, ...relevant_tags];
    const selected_tags = this.randomSample(all_tags, Math.min(max_tags, all_tags.length));
    
    return selected_tags;
  }

  audit_content_safety(content: Record<string, any>): SafetyScore {
    const script = content.script || "";
    const safety_issues: string[] = [];
    
    // Check for red flags
    for (const red_flag of this.content_red_flags) {
      const words = red_flag.split(' ');
      if (words.some(word => script.toLowerCase().includes(word.toLowerCase()))) {
        safety_issues.push(`Contains red flag: ${red_flag}`);
      }
    }
    
    // Check for dangerous language
    for (const avoid_term of this.safe_health_claims.avoid_language) {
      if (script.toLowerCase().includes(avoid_term.toLowerCase())) {
        safety_issues.push(`Contains dangerous language: ${avoid_term}`);
      }
    }
    
    // Check AI disclosure
    const description = (content.description || "").toLowerCase();
    const has_ai_disclosure = ["ai", "artificial intelligence", "generated"].some(
      disclosure => description.includes(disclosure)
    );
    
    if (!has_ai_disclosure) {
      safety_issues.push("Missing AI disclosure");
    }
    
    // Calculate overall safety
    const safety_score = Math.max(0, 100 - safety_issues.length * 15);
    
    return {
      score: safety_score,
      issues: safety_issues,
      is_safe: safety_issues.length === 0,
      recommendations: this.get_safety_recommendations(safety_issues)
    };
  }

  get_safety_recommendations(safety_issues: string[]): string[] {
    const recommendations: string[] = [];
    
    for (const issue of safety_issues) {
      if (issue.includes("red flag")) {
        recommendations.push("Remove or reframe controversial content");
      } else if (issue.includes("dangerous language")) {
        recommendations.push("Replace with safe, compliant language");
      } else if (issue.includes("AI disclosure")) {
        recommendations.push("Add AI disclosure to description or video");
      }
    }
    
    return recommendations;
  }

  // Utility methods
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private randomSample<T>(array: T[], n: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Global instance
export const shadowban_prevention = new TikTokShadowbanPrevention();