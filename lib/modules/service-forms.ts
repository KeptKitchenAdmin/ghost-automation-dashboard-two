/**
 * Service Forms and Pricing Configuration
 * Defines service packages, pricing tiers, and form structures
 */

import { v4 as uuidv4 } from 'uuid';

interface RateLimit {
  requests: number;
  per_hour: boolean;
  last_reset: number;
  count: number;
}

interface PriceTiers {
  basic: number;
  pro: number;
  enterprise: number;
}

interface FormField {
  name: string;
  type: 'select' | 'textarea' | 'text' | 'checkbox';
  label: string;
  options?: string[];
  placeholder?: string;
  required: boolean;
}

interface ServicePackage {
  name: string;
  description: string;
  base_price: number;
  price_tiers: PriceTiers;
  default_timeline_weeks: number;
  deliverables: {
    basic: string[];
    pro: string[];
    enterprise: string[];
  };
  required_inputs: string[];
  form_fields: FormField[];
}

interface ServicePackages {
  [key: string]: ServicePackage;
}

interface ServiceFormResponse {
  service_type: string;
  service_name: string;
  description: string;
  pricing: {
    base_price: number;
    tiers: {
      [tier: string]: {
        price: number;
        deliverables: string[];
      };
    };
  };
  form_fields: FormField[];
  estimated_timeline: number;
}

interface PricingCalculation {
  base_price: number;
  tier: string;
  tier_multiplier: number;
  complexity_adjustments: Record<string, any>;
  final_price: number;
  deliverables: string[];
  estimated_timeline_weeks: number;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class ServiceConfiguration {
  private servicePackages: ServicePackages;

  constructor() {
    // Define service packages
    this.servicePackages = {
      ai_content_automation: {
        name: "AI Content Automation Setup",
        description: "Complete AI-powered content creation system for your business",
        base_price: 2500.0,
        price_tiers: {
          basic: 1.0,      // $2,500
          pro: 1.8,        // $4,500  
          enterprise: 3.2  // $8,000
        },
        default_timeline_weeks: 4,
        deliverables: {
          basic: [
            "AI content generation system setup",
            "3 content templates",
            "Basic automation workflows",
            "Training documentation",
            "2 weeks support"
          ],
          pro: [
            "Advanced AI content generation system",
            "10 custom content templates",
            "Multi-platform automation",
            "Performance analytics dashboard",
            "Custom integrations (3)",
            "Training & onboarding",
            "4 weeks support"
          ],
          enterprise: [
            "Enterprise AI content ecosystem",
            "Unlimited custom templates",
            "Full platform automation",
            "Advanced analytics & reporting",
            "Custom integrations (unlimited)",
            "White-label options",
            "Dedicated account manager",
            "12 weeks support",
            "Monthly strategy calls"
          ]
        },
        required_inputs: [
          "target_audience",
          "content_types_needed",
          "current_platforms",
          "brand_voice",
          "integration_requirements"
        ],
        form_fields: [
          {
            name: "business_type",
            type: "select",
            label: "Business Type",
            options: ["E-commerce", "SaaS", "Service Business", "Agency", "Personal Brand"],
            required: true
          },
          {
            name: "target_audience",
            type: "textarea",
            label: "Describe your target audience",
            placeholder: "Who are your ideal customers?",
            required: true
          },
          {
            name: "content_types",
            type: "checkbox",
            label: "Content types needed",
            options: ["Social media posts", "Blog articles", "Email campaigns", "Video scripts", "Product descriptions"],
            required: true
          },
          {
            name: "current_platforms",
            type: "checkbox",
            label: "Current platforms",
            options: ["Instagram", "TikTok", "YouTube", "LinkedIn", "Twitter", "Facebook", "Website/Blog"],
            required: true
          },
          {
            name: "brand_voice",
            type: "select",
            label: "Brand voice/tone",
            options: ["Professional", "Casual/Friendly", "Authoritative", "Playful", "Luxury", "Technical"],
            required: true
          },
          {
            name: "content_volume",
            type: "select",
            label: "Desired content volume per month",
            options: ["1-10 pieces", "11-50 pieces", "51-100 pieces", "100+ pieces"],
            required: true
          },
          {
            name: "current_tools",
            type: "text",
            label: "Current tools/platforms used",
            placeholder: "List any current tools, CRM, etc.",
            required: false
          },
          {
            name: "integration_needs",
            type: "textarea",
            label: "Integration requirements",
            placeholder: "What systems need to integrate? (CRM, email platform, etc.)",
            required: false
          }
        ]
      },

      viral_video_package: {
        name: "Viral Video Creation Package",
        description: "AI-powered viral video creation system with TikTok optimization",
        base_price: 1500.0,
        price_tiers: {
          basic: 1.0,      // $1,500
          pro: 2.0,        // $3,000
          enterprise: 4.0  // $6,000
        },
        default_timeline_weeks: 3,
        deliverables: {
          basic: [
            "10 viral video scripts",
            "Basic persona templates",
            "TikTok posting automation",
            "Performance tracking",
            "1 week support"
          ],
          pro: [
            "30 viral video scripts",
            "5 custom personas",
            "Multi-platform automation (TikTok, Instagram, YouTube)",
            "Advanced analytics dashboard",
            "Trend analysis integration",
            "Voice generation setup",
            "4 weeks support"
          ],
          enterprise: [
            "Unlimited viral video generation",
            "Custom persona development",
            "Full automation ecosystem",
            "Real-time trend adaptation",
            "Advanced AI voice/visual generation",
            "Revenue optimization system",
            "White-label options",
            "12 weeks support",
            "Monthly optimization calls"
          ]
        },
        required_inputs: [
          "niche_focus",
          "target_demographic",
          "content_style",
          "posting_frequency",
          "monetization_goals"
        ],
        form_fields: [
          {
            name: "niche_focus",
            type: "select",
            label: "Primary niche/industry",
            options: ["Fitness", "Business/Finance", "Lifestyle", "Tech/AI", "Fashion", "Food", "Travel", "Education", "Entertainment"],
            required: true
          },
          {
            name: "target_demographic",
            type: "select",
            label: "Target demographic",
            options: ["Gen Z (16-24)", "Millennials (25-40)", "Gen X (41-56)", "All ages"],
            required: true
          },
          {
            name: "content_style",
            type: "checkbox",
            label: "Preferred content styles",
            options: ["Educational", "Entertainment", "Behind-the-scenes", "Trending challenges", "Product demos", "Storytelling"],
            required: true
          },
          {
            name: "posting_frequency",
            type: "select",
            label: "Desired posting frequency",
            options: ["1-2 videos/day", "3-5 videos/day", "5-10 videos/day", "10+ videos/day"],
            required: true
          },
          {
            name: "monetization_goals",
            type: "checkbox",
            label: "Monetization goals",
            options: ["Affiliate marketing", "Product sales", "Service promotion", "Brand building", "Lead generation"],
            required: true
          },
          {
            name: "current_following",
            type: "select",
            label: "Current follower count",
            options: ["0-1K", "1K-10K", "10K-100K", "100K+"],
            required: false
          },
          {
            name: "persona_preferences",
            type: "textarea",
            label: "Persona preferences",
            placeholder: "Describe the type of personas/characters you'd like (age, style, personality)",
            required: false
          }
        ]
      },

      full_social_media_ai: {
        name: "Full Social Media AI System",
        description: "Complete AI-powered social media automation across all platforms",
        base_price: 5000.0,
        price_tiers: {
          basic: 1.0,      // $5,000
          pro: 1.6,        // $8,000
          enterprise: 2.4  // $12,000
        },
        default_timeline_weeks: 6,
        deliverables: {
          basic: [
            "Multi-platform content automation",
            "AI-powered posting schedules",
            "Basic analytics dashboard",
            "Content calendar system",
            "4 weeks support"
          ],
          pro: [
            "Advanced multi-platform automation",
            "AI audience analysis & targeting",
            "Dynamic content optimization",
            "Advanced analytics & insights",
            "Competitor monitoring",
            "Engagement automation",
            "8 weeks support"
          ],
          enterprise: [
            "Enterprise social media ecosystem",
            "AI-powered strategy optimization",
            "Real-time performance adaptation",
            "Advanced audience insights",
            "Influencer collaboration tools",
            "Revenue attribution tracking",
            "Custom integrations",
            "Dedicated account manager",
            "16 weeks support",
            "Weekly strategy sessions"
          ]
        },
        required_inputs: [
          "platforms_needed",
          "business_goals",
          "current_social_presence",
          "team_size",
          "budget_range"
        ],
        form_fields: [
          {
            name: "platforms_needed",
            type: "checkbox",
            label: "Platforms to automate",
            options: ["Instagram", "TikTok", "YouTube", "LinkedIn", "Twitter", "Facebook", "Pinterest"],
            required: true
          },
          {
            name: "business_goals",
            type: "checkbox",
            label: "Primary business goals",
            options: ["Brand awareness", "Lead generation", "Sales conversion", "Audience growth", "Engagement increase"],
            required: true
          },
          {
            name: "current_social_presence",
            type: "textarea",
            label: "Current social media presence",
            placeholder: "Describe your current social media accounts, follower counts, posting frequency",
            required: true
          },
          {
            name: "team_size",
            type: "select",
            label: "Marketing team size",
            options: ["Just me", "2-5 people", "6-15 people", "15+ people"],
            required: true
          },
          {
            name: "content_budget",
            type: "select",
            label: "Monthly content creation budget",
            options: ["Under $1K", "$1K-$5K", "$5K-$15K", "$15K+"],
            required: false
          },
          {
            name: "automation_level",
            type: "select",
            label: "Desired automation level",
            options: ["Minimal (content creation only)", "Moderate (creation + scheduling)", "High (full automation)", "Maximum (AI-driven everything)"],
            required: true
          }
        ]
      },

      custom_automation_build: {
        name: "Custom Automation Build",
        description: "Bespoke AI automation solution tailored to your specific needs",
        base_price: 8000.0,
        price_tiers: {
          basic: 1.0,      // $8,000
          pro: 1.75,       // $14,000
          enterprise: 3.0  // $24,000
        },
        default_timeline_weeks: 8,
        deliverables: {
          basic: [
            "Custom automation analysis",
            "Tailored AI system design",
            "Core automation implementation",
            "Basic integration setup",
            "Documentation & training",
            "6 weeks support"
          ],
          pro: [
            "Comprehensive automation audit",
            "Advanced AI system architecture",
            "Full custom implementation",
            "Multiple system integrations",
            "Advanced analytics & reporting",
            "Team training & onboarding",
            "12 weeks support",
            "Monthly optimization"
          ],
          enterprise: [
            "Enterprise automation ecosystem",
            "AI-powered business optimization",
            "Complete workflow automation",
            "Enterprise integrations",
            "Advanced AI/ML implementations",
            "Dedicated development team",
            "24/7 support",
            "Ongoing optimization",
            "Quarterly strategy reviews"
          ]
        },
        required_inputs: [
          "business_type",
          "automation_needs",
          "current_systems",
          "team_structure",
          "technical_requirements"
        ],
        form_fields: [
          {
            name: "business_type",
            type: "select",
            label: "Business type",
            options: ["E-commerce", "SaaS", "Agency", "Consulting", "Manufacturing", "Healthcare", "Finance", "Other"],
            required: true
          },
          {
            name: "automation_needs",
            type: "textarea",
            label: "Describe your automation needs",
            placeholder: "What processes do you want to automate? What problems are you solving?",
            required: true
          },
          {
            name: "current_systems",
            type: "textarea",
            label: "Current systems and tools",
            placeholder: "List your current software, tools, platforms, APIs",
            required: true
          },
          {
            name: "team_structure",
            type: "textarea",
            label: "Team structure",
            placeholder: "Describe your team, roles, and who will use the automation",
            required: true
          },
          {
            name: "technical_requirements",
            type: "textarea",
            label: "Technical requirements",
            placeholder: "Any specific technical requirements, constraints, or preferences",
            required: false
          },
          {
            name: "budget_range",
            type: "select",
            label: "Budget range",
            options: ["$5K-$15K", "$15K-$30K", "$30K-$50K", "$50K+"],
            required: true
          },
          {
            name: "timeline_urgency",
            type: "select",
            label: "Timeline urgency",
            options: ["Flexible", "Moderate", "Urgent", "ASAP"],
            required: true
          },
          {
            name: "success_metrics",
            type: "textarea",
            label: "Success metrics",
            placeholder: "How will you measure the success of this automation?",
            required: false
          }
        ]
      }
    };
  }

  private getRecommendedLlms(serviceType: string): string[] {
    const llmRecommendations: Record<string, string[]> = {
      ai_content_automation: ["claude_code", "claude_sonnet", "gpt4"],
      viral_video_package: ["claude_sonnet", "claude_haiku", "gpt4"],
      full_social_media_ai: ["claude_sonnet", "gpt4", "claude_code"],
      custom_automation_build: ["claude_code", "gpt4", "claude_sonnet"]
    };

    return llmRecommendations[serviceType] || ["claude_sonnet"];
  }

  getServiceForm(serviceType: string): ServiceFormResponse {
    if (!(serviceType in this.servicePackages)) {
      throw new Error(`Unknown service type: ${serviceType}`);
    }

    const config = this.servicePackages[serviceType];

    return {
      service_type: serviceType,
      service_name: config.name,
      description: config.description,
      pricing: {
        base_price: config.base_price,
        tiers: Object.fromEntries(
          Object.entries(config.price_tiers).map(([tier, multiplier]) => [
            tier,
            {
              price: config.base_price * multiplier,
              deliverables: config.deliverables[tier as keyof typeof config.deliverables]
            }
          ])
        )
      },
      form_fields: config.form_fields,
      estimated_timeline: config.default_timeline_weeks
    };
  }

  calculatePricing(
    serviceType: string,
    tier: string,
    customRequirements: Record<string, any> = {}
  ): PricingCalculation {
    if (!(serviceType in this.servicePackages)) {
      throw new Error(`Unknown service type: ${serviceType}`);
    }

    const config = this.servicePackages[serviceType];
    const basePrice = config.base_price;
    const tierMultiplier = config.price_tiers[tier as keyof PriceTiers] || 1.0;

    // Base calculation
    let calculatedPrice = basePrice * tierMultiplier;

    // Add complexity adjustments based on requirements
    if (Object.keys(customRequirements).length > 0) {
      const complexityMultiplier = this.calculateComplexityMultiplier(serviceType, customRequirements);
      calculatedPrice *= complexityMultiplier;
    }

    return {
      base_price: basePrice,
      tier: tier,
      tier_multiplier: tierMultiplier,
      complexity_adjustments: customRequirements,
      final_price: calculatedPrice,
      deliverables: config.deliverables[tier as keyof typeof config.deliverables],
      estimated_timeline_weeks: config.default_timeline_weeks
    };
  }

  private calculateComplexityMultiplier(serviceType: string, requirements: Record<string, any>): number {
    let multiplier = 1.0;

    // Add complexity factors based on service type
    if (serviceType === "ai_content_automation") {
      const platforms = requirements.current_platforms;
      if (Array.isArray(platforms) && platforms.length > 5) {
        multiplier += 0.2;
      }

      const volume = requirements.content_volume || "";
      if (volume.includes("100+")) {
        multiplier += 0.3;
      }

    } else if (serviceType === "viral_video_package") {
      const frequency = requirements.posting_frequency || "";
      if (frequency.includes("10+")) {
        multiplier += 0.4;
      }

    } else if (serviceType === "full_social_media_ai") {
      const platforms = requirements.platforms_needed;
      if (Array.isArray(platforms) && platforms.length > 4) {
        multiplier += 0.3;
      }

    } else if (serviceType === "custom_automation_build") {
      const budget = requirements.budget_range || "";
      if (budget.includes("$50K+")) {
        multiplier += 0.5;
      }
      const urgency = requirements.timeline_urgency || "";
      if (["Urgent", "ASAP"].includes(urgency)) {
        multiplier += 0.3;
      }
    }

    return Math.min(multiplier, 2.0); // Cap at 2x multiplier
  }

  validateServiceRequest(serviceType: string, tier: string, requirements: Record<string, any>): ValidationResult {
    if (!(serviceType in this.servicePackages)) {
      return { valid: false, errors: ["Invalid service type"], warnings: [] };
    }

    const config = this.servicePackages[serviceType];
    const errors: string[] = [];

    // Check tier validity
    if (!(tier in config.price_tiers)) {
      errors.push(`Invalid tier: ${tier}`);
    }

    // Check required fields
    const requiredFields = config.form_fields
      .filter(field => field.required)
      .map(field => field.name);

    for (const field of requiredFields) {
      if (!(field in requirements) || !requirements[field]) {
        errors.push(`Required field missing: ${field}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      warnings: []
    };
  }
}

// Service configuration instance
export const serviceConfig = new ServiceConfiguration();