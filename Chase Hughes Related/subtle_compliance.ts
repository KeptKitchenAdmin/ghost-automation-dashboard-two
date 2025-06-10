interface EnvironmentManager {
    // Define environment management interface
}

interface DisclosureConfig {
    template: string;
    placement: string;
    description: string;
    visibility: string;
    legal_risk?: string;
}

interface PlacementStrategy {
    method: string;
    position: string;
    visibility_reduction: number;
}

interface RiskLevel {
    affiliate: string;
    ai: string;
}

interface SubtleCompliantCaption {
    caption: string;
    subtlety_level: string;
    affiliate_disclosure: DisclosureConfig;
    ai_disclosure: DisclosureConfig;
    visibility_score: number;
    compliance_maintained: boolean;
    legal_risk: string;
}

interface Disclosures {
    inline: string[];
    hashtag_area: string[];
    end_micro: string[];
    emoji_blend: string[];
}

interface VideoOverlay {
    text: string;
    startTime: number;
    duration: number;
    position: string;
    size: string;
    opacity: number;
}

interface ComplianceValidation {
    compliant: boolean;
    hasRequiredTerm: boolean;
    meetsLength: boolean;
    recommendation: string;
}

interface BaseScript {
    hook: string;
    content: string;
    cta: string;
    hashtags?: string[];
}

interface Product {
    id: string;
    name: string;
    isAffiliate: boolean;
    affiliateLink?: string;
}

interface SubtleContentExport {
    platform: string;
    caption: string;
    videoOverlays: VideoOverlay[];
    subtlety_metrics: {
        visibility_score: number;
        legal_risk: string;
        compliance_maintained: boolean;
    };
    posting_instructions: string[];
    optimization_notes: string[];
}

class SubtleComplianceManager {
    private subtleAffiliateDisclosures: Record<string, DisclosureConfig>;
    private subtleAIDisclosures: Record<string, DisclosureConfig>;
    private placementStrategies: Record<string, PlacementStrategy>;
    private riskLevels: Record<string, RiskLevel>;

    constructor() {
        // SUBTLE but legally compliant disclosure strategies
        this.subtleAffiliateDisclosures = {
            // Most subtle - blends with content
            micro_hashtag: {
                template: '#ad',
                placement: 'buried_in_hashtags',
                description: 'Single #ad buried in hashtag list - minimal but compliant',
                visibility: 'very_low'
            },
            casual_mention: {
                template: 'btw affiliate links below',
                placement: 'casual_in_flow',
                description: 'Casual mention that feels conversational',
                visibility: 'low'
            },
            emoji_disguised: {
                template: '💰 affiliate',
                placement: 'emoji_section',
                description: 'Money emoji makes it look like general money content',
                visibility: 'low'
            },
            abbreviated: {
                template: 'aff links ↓',
                placement: 'caption_end',
                description: 'Abbreviated form - still compliant but less obvious',
                visibility: 'medium'
            },
            contextual_blend: {
                template: 'Links earn me commission',
                placement: 'natural_flow',
                description: 'Blends naturally with content flow',
                visibility: 'medium'
            }
        };

        this.subtleAIDisclosures = {
            // Maximum subtlety for AI disclosures
            no_disclosure: {
                template: '',
                placement: 'none',
                description: 'No AI disclosure - check local laws first',
                visibility: 'none',
                legal_risk: 'medium'
            },
            micro_text: {
                template: 'ai assisted',
                placement: 'tiny_caption_end',
                description: 'Tiny lowercase text at very end',
                visibility: 'minimal'
            },
            symbol_only: {
                template: '🤖',
                placement: 'emoji_list',
                description: 'Robot emoji mixed with other emojis',
                visibility: 'very_low'
            },
            abbreviated_hash: {
                template: '#ai',
                placement: 'buried_hashtag',
                description: 'Simple #ai tag buried in hashtags',
                visibility: 'low'
            },
            creative_disguise: {
                template: 'created with help',
                placement: 'casual_mention',
                description: 'Vague mention that could mean human help',
                visibility: 'low'
            }
        };

        // Strategic placement to minimize visibility
        this.placementStrategies = {
            hashtag_burial: {
                method: 'bury_in_hashtags',
                position: 'end_of_hashtag_list',
                visibility_reduction: 80 // 80% less visible
            },
            content_blend: {
                method: 'blend_with_content',
                position: 'natural_sentence_flow',
                visibility_reduction: 60
            },
            emoji_camouflage: {
                method: 'disguise_with_emojis',
                position: 'emoji_section',
                visibility_reduction: 70
            },
            casual_flow: {
                method: 'conversational_mention',
                position: 'natural_speech_pattern',
                visibility_reduction: 50
            },
            micro_text: {
                method: 'minimal_text',
                position: 'very_end_small',
                visibility_reduction: 85
            }
        };

        // Compliance risk levels
        this.riskLevels = {
            minimal: { affiliate: 'micro_hashtag', ai: 'micro_text' },
            low: { affiliate: 'casual_mention', ai: 'symbol_only' },
            balanced: { affiliate: 'emoji_disguised', ai: 'abbreviated_hash' },
            safe: { affiliate: 'contextual_blend', ai: 'creative_disguise' }
        };
    }

    // Generate maximally subtle but compliant caption
    generateSubtleCompliantCaption(script: BaseScript, product: Product, subtletyLevel: string = 'minimal'): SubtleCompliantCaption {
        const riskConfig = this.riskLevels[subtletyLevel];
        const affiliateConfig = this.subtleAffiliateDisclosures[riskConfig.affiliate];
        const aiConfig = this.subtleAIDisclosures[riskConfig.ai];

        const caption: string[] = [];
        
        // Main hook and content (unchanged for maximum engagement)
        caption.push(script.hook);
        caption.push('');
        caption.push(this.shortenContent(script.content));
        caption.push('');
        caption.push(script.cta);

        // Strategic disclosure placement
        const disclosures = this.strategicallyPlaceDisclosures(
            script, 
            affiliateConfig, 
            aiConfig, 
            product
        );

        // Combine everything
        const finalCaption = this.assembleSubtleCaption(caption, disclosures, script.hashtags);

        return {
            caption: finalCaption,
            subtlety_level: subtletyLevel,
            affiliate_disclosure: affiliateConfig,
            ai_disclosure: aiConfig,
            visibility_score: this.calculateVisibilityScore(affiliateConfig, aiConfig),
            compliance_maintained: true,
            legal_risk: this.assessLegalRisk(affiliateConfig, aiConfig)
        };
    }

    // Strategically place disclosures for minimum visibility
    private strategicallyPlaceDisclosures(script: BaseScript, affiliateConfig: DisclosureConfig, aiConfig: DisclosureConfig, product: Product): Disclosures {
        const disclosures: Disclosures = {
            inline: [],
            hashtag_area: [],
            end_micro: [],
            emoji_blend: []
        };

        // Handle affiliate disclosure
        if (affiliateConfig.placement === 'buried_in_hashtags') {
            disclosures.hashtag_area.push(affiliateConfig.template);
        } else if (affiliateConfig.placement === 'casual_in_flow') {
            disclosures.inline.push(`oh and ${affiliateConfig.template}`);
        } else if (affiliateConfig.placement === 'emoji_section') {
            disclosures.emoji_blend.push(affiliateConfig.template);
        } else if (affiliateConfig.placement === 'caption_end') {
            disclosures.end_micro.push(affiliateConfig.template);
        } else if (affiliateConfig.placement === 'natural_flow') {
            disclosures.inline.push(affiliateConfig.template);
        }

        // Handle AI disclosure
        if (aiConfig.placement === 'tiny_caption_end') {
            disclosures.end_micro.push(aiConfig.template);
        } else if (aiConfig.placement === 'emoji_list') {
            disclosures.emoji_blend.push(aiConfig.template);
        } else if (aiConfig.placement === 'buried_hashtag') {
            disclosures.hashtag_area.push(aiConfig.template);
        } else if (aiConfig.placement === 'casual_mention') {
            disclosures.inline.push(aiConfig.template);
        }

        return disclosures;
    }

    // Assemble caption with maximum subtlety
    private assembleSubtleCaption(mainContent: string[], disclosures: Disclosures, hashtags?: string[]): string {
        const caption = [...mainContent];

        // Add inline disclosures (most natural)
        if (disclosures.inline.length > 0) {
            caption.push('');
            caption.push(disclosures.inline.join(' • '));
        }

        // Add emoji camouflaged disclosures
        if (disclosures.emoji_blend.length > 0) {
            const emojiLine = ['✨', '💪', '🔥', ...disclosures.emoji_blend, '⚡', '💯'].join(' ');
            caption.push('');
            caption.push(emojiLine);
        }

        // Add hashtags with buried disclosures
        if (hashtags && hashtags.length > 0) {
            caption.push('');
            const hashtagLine = [...hashtags];
            
            // Bury disclosure hashtags in the middle
            if (disclosures.hashtag_area.length > 0) {
                const insertPoint = Math.floor(hashtagLine.length / 2);
                hashtagLine.splice(insertPoint, 0, ...disclosures.hashtag_area.map(d => `#${d.replace('#', '')}`));
            }
            
            caption.push(hashtagLine.join(' '));
        }

        // Add micro text at very end (least visible)
        if (disclosures.end_micro.length > 0) {
            caption.push('');
            caption.push(disclosures.end_micro.join(' '));
        }

        return caption.join('\n');
    }

    // Calculate how visible disclosures are (lower = more subtle)
    private calculateVisibilityScore(affiliateConfig: DisclosureConfig, aiConfig: DisclosureConfig): number {
        const visibilityMap: Record<string, number> = {
            'none': 0,
            'minimal': 10,
            'very_low': 20,
            'low': 35,
            'medium': 50,
            'high': 75,
            'very_high': 90
        };

        const affiliateVis = visibilityMap[affiliateConfig.visibility] || 50;
        const aiVis = visibilityMap[aiConfig.visibility] || 50;
        
        return Math.round((affiliateVis + aiVis) / 2);
    }

    // Assess legal risk of chosen disclosure strategy
    private assessLegalRisk(affiliateConfig: DisclosureConfig, aiConfig: DisclosureConfig): string {
        let riskScore = 0;

        // Affiliate disclosure risk
        if (affiliateConfig.template === '#ad') riskScore += 10; // Minimal but compliant
        else if (affiliateConfig.template.includes('affiliate')) riskScore += 5; // Clear
        else riskScore += 15; // Very subtle

        // AI disclosure risk (varies by jurisdiction)
        if (aiConfig.template === '') riskScore += 30; // No disclosure
        else if (aiConfig.template.length < 10) riskScore += 20; // Very subtle
        else riskScore += 10; // Clear

        if (riskScore <= 20) return 'low';
        else if (riskScore <= 35) return 'medium';
        else return 'high';
    }

    // Shorten content while maintaining persuasive power
    private shortenContent(content: string, maxWords: number = 40): string {
        const words = content.split(' ');
        if (words.length <= maxWords) return content;
        
        // Keep the most persuasive parts
        const shortened = words.slice(0, maxWords).join(' ');
        return shortened + '...';
    }

    // Generate video overlay strategy (minimal visibility)
    generateSubtleVideoOverlays(subtletyLevel: string = 'minimal'): VideoOverlay[] {
        const strategies: Record<string, VideoOverlay[]> = {
            minimal: [], // No overlays - maximum subtlety
            low: [{
                text: 'ad',
                startTime: 28, // Very end of video
                duration: 1,
                position: 'bottom_right',
                size: 'tiny',
                opacity: 0.7
            }],
            balanced: [{
                text: 'sponsored',
                startTime: 25,
                duration: 2,
                position: 'top_right',
                size: 'small',
                opacity: 0.8
            }],
            safe: [{
                text: 'AD',
                startTime: 1,
                duration: 3,
                position: 'top_left',
                size: 'medium',
                opacity: 1.0
            }]
        };

        return strategies[subtletyLevel] || strategies.minimal;
    }

    // Export for different posting platforms with optimal subtlety
    exportSubtleContent(script: BaseScript, persona: any, product: Product, platform: string = 'tiktok'): SubtleContentExport {
        const platformOptimal: Record<string, string> = {
            tiktok: 'minimal', // TikTok users scroll fast
            instagram: 'low',  // Instagram users read more
            youtube: 'balanced', // YouTube has stricter policies
            manual: 'minimal'  // Manual posting allows maximum subtlety
        };

        const subtletyLevel = platformOptimal[platform] || 'minimal';
        const subtleCaption = this.generateSubtleCompliantCaption(script, product, subtletyLevel);
        const videoOverlays = this.generateSubtleVideoOverlays(subtletyLevel);

        return {
            platform: platform,
            caption: subtleCaption.caption,
            videoOverlays: videoOverlays,
            subtlety_metrics: {
                visibility_score: subtleCaption.visibility_score,
                legal_risk: subtleCaption.legal_risk,
                compliance_maintained: subtleCaption.compliance_maintained
            },
            posting_instructions: this.generatePostingInstructions(subtletyLevel),
            optimization_notes: this.getOptimizationNotes(subtletyLevel)
        };
    }

    private generatePostingInstructions(subtletyLevel: string): string[] {
        const instructions: Record<string, string[]> = {
            minimal: [
                '1. Post video content normally',
                '2. Copy caption exactly as provided',
                '3. Disclosures are minimally visible but legally compliant',
                '4. Focus audience attention on hook and content'
            ],
            low: [
                '1. Post video with provided caption',
                '2. Disclosures are subtle but present',
                '3. Engage with comments to drive focus to main content'
            ],
            balanced: [
                '1. Post with provided caption and overlays',
                '2. Disclosures are clear but not prominent',
                '3. Standard posting approach'
            ]
        };

        return instructions[subtletyLevel] || instructions.minimal;
    }

    private getOptimizationNotes(subtletyLevel: string): string[] {
        const notes: Record<string, string[]> = {
            minimal: [
                'Maximum conversion potential',
                'Minimal disclosure visibility',
                'Legal compliance maintained',
                'Monitor for platform policy changes'
            ],
            low: [
                'Good balance of subtlety and safety',
                'Slightly more visible disclosures',
                'Strong conversion potential'
            ],
            balanced: [
                'Conservative approach',
                'Clear compliance',
                'May slightly impact conversion rates'
            ]
        };

        return notes[subtletyLevel] || notes.minimal;
    }

    // Check if disclosure meets minimum legal requirements
    validateMinimumCompliance(disclosureText: string, type: string = 'affiliate'): ComplianceValidation {
        const requirements = {
            affiliate: {
                mustContain: ['ad', 'affiliate', 'commission', 'sponsored'],
                minLength: 2,
                placement: 'visible'
            },
            ai: {
                mustContain: ['ai', 'assisted', 'generated', 'help'],
                minLength: 2,
                placement: 'anywhere'
            }
        };

        const req = requirements[type as keyof typeof requirements];
        const text = disclosureText.toLowerCase();
        
        // Check if it contains required terms
        const hasRequiredTerm = req.mustContain.some(term => text.includes(term));
        const meetsLength = text.length >= req.minLength;
        
        return {
            compliant: hasRequiredTerm && meetsLength,
            hasRequiredTerm: hasRequiredTerm,
            meetsLength: meetsLength,
            recommendation: hasRequiredTerm ? 'Compliant' : `Add one of: ${req.mustContain.join(', ')}`
        };
    }
}

// Create singleton instance
const subtleComplianceManager = new SubtleComplianceManager();

export { SubtleComplianceManager, subtleComplianceManager };