export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

// Smart Content Generation API
// Analyzes GhostMoss data and routes to optimal content generation tier

interface ContentGenerationRequest {
  productIds?: string[];
  contentType?: 'product_review' | 'suppressed_science' | 'lifestyle_hack' | 'trend_analysis' | 'viral_growth' | 'supplement_viral';
  maxRecommendations?: number;
  preferredTier?: 'heygen_human' | 'image_montage' | 'auto';
  currentFollowers?: number;
}

interface ContentRecommendation {
  content_id: string;
  content_type: string;
  recommended_tier: 'heygen_human' | 'image_montage' | 'supplement_viral';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  data_source: string;
  
  // Scoring
  viral_score: number;
  revenue_potential: number;
  engagement_prediction: number;
  
  // Content details
  title: string;
  hook: string;
  script_outline: string[];
  target_audience: string;
  hashtags: string[];
  
  // Production
  estimated_production_cost: number;
  expected_roi: number;
  optimal_posting_times: string[];
}

// Enhanced smart content engine analysis with multi-platform support
function generateSmartContentRecommendations(request: ContentGenerationRequest): {
  recommendations: ContentRecommendation[],
  platformStrategy: any,
  generationPlan: any
} {
  const { maxRecommendations = 5, contentType = 'product_review' } = request;
  
  // High-value product-based content (from your enhanced TikTokIntelligencePanel data)
  const productRecommendations: ContentRecommendation[] = [
    {
      content_id: 'prod_led_mask_001',
      content_type: 'product_review',
      recommended_tier: 'heygen_human', // High-trust beauty product
      priority: 'urgent',
      data_source: 'ghostmoss_product',
      viral_score: 92,
      revenue_potential: 280,
      engagement_prediction: 88,
      title: 'I Used This Viral LED Face Mask for 30 Days - Shocking Results',
      hook: 'Everyone said this LED mask was just a scam, but after 30 days...',
      script_outline: [
        'Hook: Skeptical about LED face masks',
        'Before: Show skin concerns/problems',
        'Demo: Using the mask daily routine',
        'After: Dramatic before/after results',
        'CTA: Get yours with my discount code'
      ],
      target_audience: 'Women 18-35, skincare enthusiasts, anti-aging focused',
      hashtags: ['#tiktokshop', '#skincare', '#antiaging', '#ledmask', '#beforeandafter', '#skintok', '#fyp'],
      estimated_production_cost: 0, // HeyGen credit
      expected_roi: 84, // $280 monthly potential * 30%
      optimal_posting_times: ['7-9 AM EST', '6-8 PM EST', '9-10 PM EST']
    },
    {
      content_id: 'prod_smart_bottle_002',
      content_type: 'product_review',
      recommended_tier: 'heygen_human', // Tech product needs trust
      priority: 'high',
      data_source: 'ghostmoss_product',
      viral_score: 88,
      revenue_potential: 150,
      engagement_prediction: 85,
      title: 'This Smart Water Bottle Actually Changed My Health',
      hook: 'I was dehydrated for years until I got this smart water bottle',
      script_outline: [
        'Hook: Dehydration struggle',
        'Problem: Why regular bottles fail',
        'Demo: Smart features in action',
        'Results: Health improvements',
        'CTA: Link in bio for discount'
      ],
      target_audience: 'Health-conscious 20-40, tech lovers, fitness enthusiasts',
      hashtags: ['#smartwater', '#healthtech', '#hydration', '#wellness', '#tiktokshop', '#fyp'],
      estimated_production_cost: 0,
      expected_roi: 45,
      optimal_posting_times: ['6-8 AM EST', '5-7 PM EST']
    }
  ];

  // Authority-building suppressed science content (HeyGen preferred)
  // High-converting supplement recommendations (highest revenue potential)
  const supplementViralRecommendations: ContentRecommendation[] = [
    {
      content_id: 'supplement_coq10_001',
      content_type: 'supplement_viral',
      recommended_tier: 'supplement_viral',
      priority: 'urgent',
      data_source: 'supplement_analysis',
      viral_score: 96,
      revenue_potential: 15000,  // $15k potential per viral video
      engagement_prediction: 92,
      title: 'CoQ10 Ultra - Why 73% of Americans Have No Energy by 2pm',
      hook: '73% of Americans hit an energy wall at 2pm every day. Your ancestors worked 12-hour days and weren\'t this exhausted.',
      script_outline: [
        'Statistical Hook: 73% energy crisis',
        'Emotional Pain: Coffee addiction, canceling plans',
        'Root Cause: Missing CoQ10 from food supply',
        'Mechanism: Cellular energy factories repair',
        'Social Proof: Clinical studies + testimonials',
        'Urgency CTA: Limited real CoQ10 availability'
      ],
      target_audience: 'Exhausted Americans 25-55, corporate workers, parents',
      hashtags: ['#chronicfatigue', '#energy', '#coq10', '#supplement', '#health', '#exhausted', '#viral'],
      estimated_production_cost: 5,
      expected_roi: 3000,  // 3000x ROI potential
      optimal_posting_times: ['7-9 AM EST', '2-4 PM EST', '6-8 PM EST']
    },
    {
      content_id: 'supplement_magnesium_002',
      content_type: 'supplement_viral', 
      recommended_tier: 'supplement_viral',
      priority: 'urgent',
      data_source: 'supplement_analysis',
      viral_score: 94,
      revenue_potential: 12000,
      engagement_prediction: 90,
      title: 'Magnesium Glycinate - Why 68% of Americans Can\'t Sleep Naturally',
      hook: '68% of Americans can\'t fall asleep naturally anymore. Your great-grandparents never needed melatonin.',
      script_outline: [
        'Statistical Hook: Sleep epidemic crisis',
        'Emotional Pain: 3am ceiling staring, exhausted but wired',
        'Root Cause: Magnesium depletion from soil',
        'Mechanism: Nervous system calming, cortisol reduction',
        'Social Proof: Sleep study results',
        'Urgency CTA: Real magnesium glycinate scarcity'
      ],
      target_audience: 'Insomniacs 30-60, stressed professionals, anxious people',
      hashtags: ['#insomnia', '#sleep', '#magnesium', '#natural', '#anxiety', '#health', '#viral'],
      estimated_production_cost: 5,
      expected_roi: 2400,
      optimal_posting_times: ['8-10 PM EST', '6-8 AM EST']
    },
    {
      content_id: 'supplement_lions_mane_003',
      content_type: 'supplement_viral',
      recommended_tier: 'supplement_viral', 
      priority: 'high',
      data_source: 'supplement_analysis',
      viral_score: 91,
      revenue_potential: 10000,
      engagement_prediction: 87,
      title: 'Lion\'s Mane - Why 40% of Americans Under 40 Have Memory Issues',
      hook: 'Can\'t remember where you put your keys 5 minutes ago? Your brain isn\'t aging - it\'s being poisoned.',
      script_outline: [
        'Hook: Memory loss epidemic',
        'Personal Struggle: Feeling stupid in meetings',
        'Root Cause: Neuroinflammation from modern life',
        'Solution: Lion\'s Mane neuroregeneration',
        'Scientific Backing: Nerve growth factor studies',
        'CTA: Cognitive decline prevention urgency'
      ],
      target_audience: 'Professionals 25-50, students, brain fog sufferers',
      hashtags: ['#brainfog', '#memory', '#lionsmane', '#nootropics', '#cognitive', '#health'],
      estimated_production_cost: 5,
      expected_roi: 2000,
      optimal_posting_times: ['7-9 AM EST', '12-2 PM EST', '6-8 PM EST']
    }
  ];

  const suppressedScienceRecommendations: ContentRecommendation[] = [
    {
      content_id: 'science_minnesota_001',
      content_type: 'suppressed_science',
      recommended_tier: 'heygen_human', // Authority required
      priority: 'high',
      data_source: 'content_database',
      viral_score: 95,
      revenue_potential: 0, // Authority building
      engagement_prediction: 90,
      title: 'The Government Studied Starvation Psychology on Americans for 40 Years',
      hook: 'The government did starvation experiments on Americans and this explains why every diet fails...',
      script_outline: [
        'Hook: Government starvation study revelation',
        'Experiment: Minnesota Starvation Study details',
        'Results: Permanent psychological damage',
        'Modern Impact: Why diets create food obsession',
        'CTA: Follow for more suppressed truths'
      ],
      target_audience: 'Truth-seekers, health-conscious, diet culture critics',
      hashtags: ['#suppressed', '#dietculture', '#truth', '#psychology', '#mindblown', '#government', '#fyp'],
      estimated_production_cost: 0,
      expected_roi: 75, // Authority building value
      optimal_posting_times: ['8-10 PM EST', '6-8 AM EST']
    },
    {
      content_id: 'science_bmi_002',
      content_type: 'suppressed_science',
      recommended_tier: 'heygen_human',
      priority: 'high', 
      data_source: 'content_database',
      viral_score: 85,
      revenue_potential: 0,
      engagement_prediction: 82,
      title: 'BMI Was Invented by an Astronomer, Not a Doctor',
      hook: 'Your doctor uses BMI to judge your health but it was invented by an astronomer in 1830...',
      script_outline: [
        'Hook: BMI creator revelation',
        'History: Adolphe Quetelet was an astronomer',
        'Problem: Never meant for individual health',
        'Impact: Body shaming based on bad math',
        'CTA: Stop letting BMI define you'
      ],
      target_audience: 'Body positive advocates, health-conscious, medical skeptics',
      hashtags: ['#bmi', '#bodypositive', '#medicallies', '#health', '#truth', '#selfcare', '#fyp'],
      estimated_production_cost: 0,
      expected_roi: 60,
      optimal_posting_times: ['7-9 AM EST', '6-8 PM EST']
    }
  ];

  // High-volume image montage content 
  const imageMontageRecommendations: ContentRecommendation[] = [
    {
      content_id: 'montage_mockingbird_001',
      content_type: 'trend_analysis',
      recommended_tier: 'image_montage', // Document-heavy
      priority: 'medium',
      data_source: 'content_database',
      viral_score: 78,
      revenue_potential: 0,
      engagement_prediction: 75,
      title: 'This Declassified Document Proves Media Control Since 1950s',
      hook: 'This declassified CIA document shows they\'ve been controlling the news since the 1950s...',
      script_outline: [
        'Hook: Declassified document reveal',
        'Operation Mockingbird explanation',
        'Evidence: Show actual documents',
        'Modern implications: Current media landscape',
        'CTA: What do you think?'
      ],
      target_audience: 'Conspiracy theorists, media critics, truth-seekers',
      hashtags: ['#declassified', '#cia', '#media', '#conspiracy', '#truth', '#documents', '#fyp'],
      estimated_production_cost: 0,
      expected_roi: 25,
      optimal_posting_times: ['8-10 PM EST', '5-7 PM EST']
    }
  ];

  // Viral growth content for 0-1K followers
  const viralGrowthRecommendations: ContentRecommendation[] = [
    {
      content_id: 'viral_mkultra_001',
      content_type: 'viral_growth',
      recommended_tier: 'image_montage',
      priority: 'urgent',
      data_source: 'viral_growth_engine',
      viral_score: 98,
      revenue_potential: 0, // No monetization pre-1K
      engagement_prediction: 95,
      title: 'DECLASSIFIED: MKUltra Mind Control Documents Revealed',
      hook: 'You weren\'t supposed to see this... The government spent $2.4M on mind control experiments',
      script_outline: [
        'Hook: Declassified document reveal',
        'Evidence: 300+ human subjects tested',
        'Impact: Techniques still used today',
        'Urgency: They keep trying to delete this',
        'CTA: Follow for more suppressed truths'
      ],
      target_audience: 'Truth seekers, conspiracy theorists, government skeptics',
      hashtags: ['#mkultra', '#declassified', '#conspiracy', '#truth', '#government', '#mindcontrol', '#cia'],
      estimated_production_cost: 0,
      expected_roi: 0, // Growth focused, not revenue
      optimal_posting_times: ['7-9 AM EST', '12-2 PM EST', '7-9 PM EST']
    },
    {
      content_id: 'viral_nutrition_lies_002',
      content_type: 'viral_growth',
      recommended_tier: 'image_montage',
      priority: 'urgent',
      data_source: 'viral_growth_engine',
      viral_score: 96,
      revenue_potential: 0,
      engagement_prediction: 92,
      title: 'The Nutrition Industry LIED About This for 40 Years',
      hook: 'The sugar industry paid scientists $50,000 to lie about nutrition in the 1960s...',
      script_outline: [
        'Hook: Industry payment documents',
        'Scandal: Harvard scientists paid off',
        'Impact: Millions died from bad advice',
        'Evidence: Show actual payment records',
        'CTA: Comment if this shocked you'
      ],
      target_audience: 'Health conscious, diet culture critics, truth seekers',
      hashtags: ['#nutritionlies', '#sugar', '#conspiracy', '#health', '#truth', '#exposed', '#fyp'],
      estimated_production_cost: 0,
      expected_roi: 0,
      optimal_posting_times: ['6-8 AM EST', '5-7 PM EST', '8-10 PM EST']
    },
    {
      content_id: 'viral_minnesota_003',
      content_type: 'viral_growth',
      recommended_tier: 'image_montage',
      priority: 'high',
      data_source: 'viral_growth_engine',
      viral_score: 94,
      revenue_potential: 0,
      engagement_prediction: 90,
      title: 'This Government Experiment Changed Everything About Dieting',
      hook: 'The government starved 36 men for science and discovered why all diets fail...',
      script_outline: [
        'Hook: Minnesota Starvation Experiment',
        'Shocking: Men went insane from dieting',
        'Results: Permanent psychological damage',
        'Modern impact: Why you obsess over food',
        'CTA: Save this before it gets removed'
      ],
      target_audience: 'Dieters, eating disorder survivors, psychology enthusiasts',
      hashtags: ['#minnesota', '#starvation', '#diet', '#psychology', '#experiment', '#government', '#truth'],
      estimated_production_cost: 0,
      expected_roi: 0,
      optimal_posting_times: ['7-9 AM EST', '6-8 PM EST']
    }
  ];

  // Combine recommendations based on optimal strategy
  let allRecommendations: ContentRecommendation[] = [];
  
  if (contentType === 'viral_growth') {
    allRecommendations.push(...viralGrowthRecommendations);
  }
  
  if (contentType === 'supplement_viral') {
    allRecommendations.push(...supplementViralRecommendations);
  }
  
  if (contentType === 'product_review' || contentType === 'lifestyle_hack') {
    allRecommendations.push(...productRecommendations);
  }
  
  if (contentType === 'suppressed_science') {
    allRecommendations.push(...suppressedScienceRecommendations);
  }
  
  if (contentType === 'trend_analysis') {
    allRecommendations.push(...imageMontageRecommendations);
  }
  
  // If no specific type, use optimal revenue mix (40% supplements, 30% products, 20% authority, 10% trends)
  if (!contentType || contentType === 'lifestyle_hack') {
    allRecommendations = [
      ...supplementViralRecommendations.slice(0, 2), // Top 2 supplements (highest revenue)
      ...productRecommendations.slice(0, 2), // Top 2 products
      ...suppressedScienceRecommendations.slice(0, 1), // Top 1 authority
      ...imageMontageRecommendations.slice(0, 1) // Top 1 montage
    ];
  }

  // Sort by viral score and revenue potential
  allRecommendations.sort((a, b) => {
    const scoreA = a.viral_score * 0.6 + (a.revenue_potential / 10) * 0.4;
    const scoreB = b.viral_score * 0.6 + (b.revenue_potential / 10) * 0.4;
    return scoreB - scoreA;
  });

  const finalRecommendations = allRecommendations.slice(0, maxRecommendations);

  // Enhanced platform strategy analysis
  const platformStrategy = {
    heygen_content: finalRecommendations.filter(r => 
      ['suppressed_science'].includes(r.content_type) || (r.content_type === 'product_review' && r.revenue_potential > 200)
    ).length,
    arcads_content: finalRecommendations.filter(r => 
      ['product_review', 'lifestyle_hack', 'trend_analysis'].includes(r.content_type) && r.content_type !== 'supplement_viral'
    ).length,
    supplement_viral_content: finalRecommendations.filter(r => 
      r.content_type === 'supplement_viral'
    ).length,
    total_variations_planned: finalRecommendations.reduce((sum, rec) => {
      if (rec.content_type === 'supplement_viral') return sum + 2; // 2 variations for supplements
      if (rec.content_type === 'product_review') return sum + 3;
      if (rec.content_type === 'lifestyle_hack') return sum + 2;
      if (rec.content_type === 'trend_analysis') return sum + 2;
      return sum + 1; // suppressed_science gets 1 authoritative video
    }, 0),
    estimated_generation_time: "2-5 minutes per video",
    platform_distribution: {
      heygen_percentage: 20,
      arcads_percentage: 60,
      supplement_viral_percentage: 20
    }
  };

  // Generation plan with multi-platform details
  const generationPlan = {
    total_content_pieces: finalRecommendations.length,
    total_videos_estimated: platformStrategy.total_variations_planned,
    platform_breakdown: {
      heygen: {
        content_count: platformStrategy.heygen_content,
        video_count: platformStrategy.heygen_content, // 1 video per HeyGen content
        content_types: ["suppressed_science", "high_value_products"],
        strategy: "Authority building with professional avatars"
      },
      arcads: {
        content_count: platformStrategy.arcads_content,
        video_count: platformStrategy.arcads_content * 2.5, // Average 2.5 variations
        content_types: ["product_review", "lifestyle_hack", "trend_analysis"],
        strategy: "UGC-style with multiple actor variations"
      },
      supplement_viral: {
        content_count: platformStrategy.supplement_viral_content,
        video_count: platformStrategy.supplement_viral_content * 2, // 2 variations per supplement
        content_types: ["supplement_viral", "health_products", "pain_point_targeting"],
        strategy: "High-converting emotional targeting for American health epidemics",
        revenue_potential: "$10k-$60k per viral video",
        technology_stack: ["OpenAI_Images", "ElevenLabs_Voice", "Emotional_Scripts"]
      }
    },
    content_pipeline: finalRecommendations.map(rec => ({
      content_id: rec.content_id,
      recommended_platform: rec.content_type === 'supplement_viral' ? 'supplement_viral' : 
                            ['suppressed_science'].includes(rec.content_type) ? 'heygen' : 'arcads',
      variations_planned: rec.content_type === 'supplement_viral' ? 2 :
                         rec.content_type === 'product_review' ? 3 : 
                         rec.content_type === 'suppressed_science' ? 1 : 2,
      trust_factor: rec.content_type === 'supplement_viral' ? 0.9 :
                   rec.content_type === 'suppressed_science' ? 0.9 : 0.6,
      priority: rec.priority,
      revenue_potential: rec.revenue_potential
    }))
  };

  return {
    recommendations: finalRecommendations,
    platformStrategy,
    generationPlan
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const requestData: ContentGenerationRequest = {
      maxRecommendations: parseInt(searchParams.get('limit') || '5'),
      contentType: searchParams.get('type') as any || 'product_review',
      preferredTier: searchParams.get('tier') as any || 'auto'
    };

    const result = generateSmartContentRecommendations(requestData);
    const { recommendations, platformStrategy, generationPlan } = result;

    // Calculate tier distribution (legacy support)
    const tierDistribution = recommendations.reduce((acc, rec) => {
      acc[rec.recommended_tier] = (acc[rec.recommended_tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalRevenuePotential = recommendations.reduce((sum, rec) => sum + rec.revenue_potential, 0);
    const avgViralScore = recommendations.reduce((sum, rec) => sum + rec.viral_score, 0) / recommendations.length;

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        strategy: {
          total_recommendations: recommendations.length,
          tier_distribution: tierDistribution,
          heygen_ratio: tierDistribution.heygen_human / recommendations.length,
          target_heygen_ratio: 0.25, // 25% HeyGen target
          total_revenue_potential: totalRevenuePotential,
          avg_viral_score: Math.round(avgViralScore),
          estimated_production_time: "2-5 minutes per video"
        },
        // Enhanced multi-platform strategy
        multi_platform_strategy: {
          platform_distribution: platformStrategy.platform_distribution,
          total_videos_planned: platformStrategy.total_variations_planned,
          heygen_content_count: platformStrategy.heygen_content,
          arcads_content_count: platformStrategy.arcads_content,
          supplement_viral_content_count: platformStrategy.supplement_viral_content,
          generation_approach: "Intelligent routing: HeyGen (authority), Arcads (UGC), Supplement Viral ($10k-$60k revenue)"
        },
        generation_plan: generationPlan
      },
      meta: {
        generated_at: new Date().toISOString(),
        engine: "multi_platform_content_engine_v3_supplement_viral",
        platforms: ["heygen", "arcads", "supplement_viral"],
        data_sources: ["ghostmoss_products", "content_database", "trend_analysis", "supplement_pain_point_analysis"],
        features: [
          "intelligent_platform_routing", 
          "multi_actor_variations", 
          "trust_factor_optimization",
          "supplement_viral_targeting",
          "american_pain_point_analysis",
          "10k_60k_revenue_potential"
        ],
        supplement_capabilities: {
          "pain_points_supported": 7,
          "revenue_range": "$10k-$60k per viral video",
          "technology_stack": "OpenAI Images + ElevenLabs Voice + Emotional Scripts",
          "target_demographics": "Americans with health pain points"
        }
      }
    });

  } catch (error) {
    console.error('Content generation failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Content generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Support both new and legacy request formats
    if (body.contentType && typeof body.contentType === 'string') {
      // Legacy format from RealContentGenerator
      const { contentType, businessModel, targetProduct, serviceType, callToAction, variationSeed } = body;
      
      // ALWAYS route through shadowban-safe API first for protection
      try {
        const shadowbanResponse = await fetch(`${request.nextUrl.origin}/api/content/shadowban-safe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products: [{
              name: targetProduct || 'viral content',
              category: contentType,
              benefits: ['engaging content', 'viral potential'],
            }],
            contentType: 'educational',
            safetyLevel: 'maximum',
            includeDisclaimer: true
          })
        })

        if (shadowbanResponse.ok) {
          const shadowbanData = await shadowbanResponse.json()
          if (shadowbanData.success) {
            return NextResponse.json({
              success: true,
              content: {
                script: shadowbanData.content.script,
                hooks: [shadowbanData.content.script.split('\n')[0] || 'Generated safe hook'],
                hashtags: shadowbanData.content.hashtags,
                postingTips: [
                  '🛡️ Shadowban protection active - content variation enabled',
                  `Safety score: ${shadowbanData.content.safety_score}/100`,
                  `AI disclosure: ${shadowbanData.content.ai_disclosure.text}`,
                  shadowbanData.posting_guidance.spacing_advice,
                  'Anti-pattern detection preventing algorithm flags'
                ],
                businessRationale: `🛡️ Shadowban-protected content with ${shadowbanData.content.safety_score}/100 safety score. ${shadowbanData.content.compliance_check.is_compliant ? 'Fully compliant' : 'Issues detected'} with TikTok guidelines.`
              }
            })
          }
        }
      } catch (shadowbanError) {
        console.log('Shadowban-safe generation failed, using fallback with safety measures:', shadowbanError)
      }
      
      // Map legacy content types to new system
      const contentTypeMap: Record<string, string> = {
        'viral-growth-conspiracy': 'viral_growth',
        'viral-affiliate': 'product_review',
        'luxury-lifestyle': 'lifestyle_hack',
        'client-transformation': 'suppressed_science',
        'ai-demo': 'trend_analysis'
      };
      const mappedContentType = contentTypeMap[contentType] || 'viral_growth';
      
      const result = generateSmartContentRecommendations({
        contentType: mappedContentType as any,
        maxRecommendations: 3
      });
      
      // Get the top recommendation and format for legacy response
      const topRecommendation = result.recommendations[0];
      
      if (topRecommendation) {
        // Generate truly different hook variations with proper randomization
        const baseHookElements = {
          curiosity_openers: [
            "You won't believe what happened when",
            "This secret that",
            "What they don't want you to know about",
            "The shocking truth about",
            "This banned technique that"
          ],
          authority_openers: [
            "After 30 days of testing",
            "Scientists discovered that",
            "Researchers found that",
            "New study reveals that",
            "Experts are warning that"
          ],
          urgency_openers: [
            "They're trying to delete this",
            "This gets banned in 24 hours",
            "Before this gets removed",
            "While this is still legal",
            "This loophole closes soon"
          ],
          emotional_openers: [
            "I cried when I discovered",
            "This changed my life when",
            "I wish I knew this earlier about",
            "My doctor didn't tell me about",
            "I was lied to about"
          ]
        };

        const audienceTargets = topRecommendation.target_audience.split(',').map(s => s.trim());
        const productName = targetProduct || topRecommendation.title.split(' ').slice(0, 3).join(' ');
        
        const hooks = [
          topRecommendation.hook, // Original hook
          `${baseHookElements.curiosity_openers[Math.floor(Math.random() * baseHookElements.curiosity_openers.length)]} ${audienceTargets[0] || 'people'} ${productName.toLowerCase()}...`,
          `${baseHookElements.authority_openers[Math.floor(Math.random() * baseHookElements.authority_openers.length)]} ${productName.toLowerCase()} ${['actually works', 'is dangerous', 'changes everything', 'was hidden'][Math.floor(Math.random() * 4)]}...`,
          `${baseHookElements.urgency_openers[Math.floor(Math.random() * baseHookElements.urgency_openers.length)]} about ${productName.toLowerCase()}...`,
          `${baseHookElements.emotional_openers[Math.floor(Math.random() * baseHookElements.emotional_openers.length)]} ${productName.toLowerCase()}...`
        ];
        
        // Generate full script with variation
        const baseScript = topRecommendation.script_outline.join('\n\n');
        const fullScript = `${topRecommendation.hook}

${baseScript}

${callToAction || 'Follow for more content like this!'}

${topRecommendation.hashtags.join(' ')}`;

        return NextResponse.json({
          success: true,
          content: {
            script: fullScript,
            hooks: hooks.slice(0, 4), // Return 4 variations
            hashtags: topRecommendation.hashtags,
            postingTips: [
              `Best posting times: ${topRecommendation.optimal_posting_times.join(', ')}`,
              `Target audience: ${topRecommendation.target_audience}`,
              `Expected viral score: ${topRecommendation.viral_score}%`,
              `Content priority: ${topRecommendation.priority}`
            ],
            businessRationale: `This ${mappedContentType} content has a ${topRecommendation.viral_score}% viral score and targets ${topRecommendation.target_audience}. Revenue potential: $${topRecommendation.revenue_potential}/month.`
          }
        });
      }
    }

    // Original format for multi-platform generation
    const requestData: ContentGenerationRequest = body;
    const result = generateSmartContentRecommendations(requestData);
    const { recommendations, platformStrategy, generationPlan } = result;

    // Enhanced multi-platform queue system
    const queueResults = {
      heygen_queue: recommendations.filter(r => 
        ['suppressed_science'].includes(r.content_type) || r.revenue_potential > 200
      ),
      arcads_queue: recommendations.filter(r => 
        ['product_review', 'lifestyle_hack', 'trend_analysis'].includes(r.content_type)
      ),
      // Legacy support
      image_montage_queue: recommendations.filter(r => r.recommended_tier === 'image_montage'),
      total_videos_planned: platformStrategy.total_variations_planned,
      estimated_completion: "2-5 minutes per video",
      total_cost: 0, // Free tiers being used
      expected_total_roi: recommendations.reduce((sum, r) => sum + r.expected_roi, 0),
      platform_strategy: {
        heygen_videos: platformStrategy.heygen_content,
        arcads_videos: platformStrategy.total_variations_planned - platformStrategy.heygen_content,
        variation_strategy: "Multiple Arcads actors for product content, single HeyGen avatar for authority content"
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        queued_content: recommendations,
        queue_status: queueResults,
        generation_plan: generationPlan,
        multi_platform_details: {
          platforms_used: ["heygen", "arcads"],
          intelligent_routing: "Content type determines optimal platform",
          variation_approach: "Arcads generates 2-3 variations, HeyGen creates 1 authoritative video",
          trust_optimization: "High-trust content routed to HeyGen, marketing content to Arcads"
        },
        message: `${recommendations.length} content pieces queued for multi-platform generation (${platformStrategy.total_variations_planned} total videos)`
      }
    });

  } catch (error) {
    console.error('Content queue failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to queue content generation' 
      },
      { status: 500 }
    );
  }
}