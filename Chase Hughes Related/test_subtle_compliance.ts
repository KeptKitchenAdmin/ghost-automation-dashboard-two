import { subtleComplianceManager } from './subtle_compliance.js';

interface ViralAutomationEngine {
    createViralCampaign(config: any): Promise<any>;
    generatedScripts: any[];
    activePersonas: any[];
}

interface Product {
    id: string;
    name: string;
    isAffiliate: boolean;
    affiliateLink?: string;
}

async function testSubtleCompliance(): Promise<void> {
    console.log('🥷 Testing SUBTLE Compliance System - Maximum Conversion Focus\n');
    
    try {
        // Mock ViralAutomationEngine for testing
        const engine: ViralAutomationEngine = {
            createViralCampaign: async (config: any) => ({ id: 'test_campaign' }),
            generatedScripts: [{
                id: 'test_script',
                hook: 'This fitness hack shocked everyone',
                content: 'Most people waste months trying the wrong approach when there\'s actually a simple method that works faster than anything else.',
                cta: 'Want to know what it is? Link in bio!'
            }],
            activePersonas: [{
                id: 'fitness_influencer',
                name: 'Jordan Smith',
                niche: 'fitness'
            }]
        };

        const campaign = await engine.createViralCampaign({
            personaCount: 1,
            scriptsPerPersona: 1,
            niche: 'fitness'
        });
        
        const script = engine.generatedScripts[0];
        const persona = engine.activePersonas[0];
        const product: Product = {
            id: 'tiktok_ads_course',
            name: 'TikTok Ads Mastery',
            isAffiliate: true,
            affiliateLink: 'https://course.example.com?ref=ghost'
        };

        console.log('🎯 ORIGINAL SCRIPT:');
        console.log(`Hook: ${script.hook}`);
        console.log(`Content: ${script.content.substring(0, 100)}...`);
        console.log(`CTA: ${script.cta}\n`);

        // Test different subtlety levels
        const subtletyLevels = ['minimal', 'low', 'balanced'];
        
        for (const level of subtletyLevels) {
            console.log(`\n${'='.repeat(50)}`);
            console.log(`🥷 SUBTLETY LEVEL: ${level.toUpperCase()}`);
            console.log(`${'='.repeat(50)}`);
            
            const subtleCaption = subtleComplianceManager.generateSubtleCompliantCaption(
                script, product, level
            );
            
            console.log('📱 GENERATED CAPTION:');
            console.log('---');
            console.log(subtleCaption.caption);
            console.log('---\n');
            
            console.log('📊 SUBTLETY METRICS:');
            console.log(`   👁️  Visibility Score: ${subtleCaption.visibility_score}/100 (lower = more subtle)`);
            console.log(`   ⚖️  Legal Risk: ${subtleCaption.legal_risk}`);
            console.log(`   ✅ Compliance: ${subtleCaption.compliance_maintained ? 'Maintained' : 'RISK'}`);
            console.log(`   🎯 Affiliate Disclosure: "${subtleCaption.affiliate_disclosure.template}"`);
            console.log(`   🤖 AI Disclosure: "${subtleCaption.ai_disclosure.template}"`);
            
            // Test video overlays
            const videoOverlays = subtleComplianceManager.generateSubtleVideoOverlays(level);
            console.log(`\n📹 VIDEO OVERLAYS: ${videoOverlays.length} overlay(s)`);
            videoOverlays.forEach((overlay, i) => {
                console.log(`   ${i+1}. "${overlay.text}" at ${overlay.startTime}s (${overlay.size}, ${overlay.opacity} opacity)`);
            });
            
            // Export for TikTok
            const export_ = subtleComplianceManager.exportSubtleContent(script, persona, product, 'tiktok');
            console.log(`\n🚀 TIKTOK OPTIMIZATION:`);
            console.log(`   Visibility Score: ${export_.subtlety_metrics.visibility_score}/100`);
            console.log(`   Risk Level: ${export_.subtlety_metrics.legal_risk}`);
            console.log(`   Conversion Focus: ${export_.subtlety_metrics.visibility_score < 30 ? 'MAXIMUM' : 'MODERATE'}`);
        }

        // Test compliance validation
        console.log(`\n${'='.repeat(50)}`);
        console.log('🔍 COMPLIANCE VALIDATION TESTS');
        console.log(`${'='.repeat(50)}`);
        
        const testDisclosures = [
            { text: '#ad', type: 'affiliate' },
            { text: 'btw affiliate links below', type: 'affiliate' },
            { text: '🤖', type: 'ai' },
            { text: 'ai assisted', type: 'ai' },
            { text: '', type: 'ai' }
        ];
        
        testDisclosures.forEach(test => {
            const validation = subtleComplianceManager.validateMinimumCompliance(test.text, test.type);
            console.log(`\n   "${test.text}" (${test.type}): ${validation.compliant ? '✅ VALID' : '❌ INVALID'}`);
            if (!validation.compliant) {
                console.log(`      💡 Fix: ${validation.recommendation}`);
            }
        });

        console.log(`\n${'='.repeat(50)}`);
        console.log('🎯 OPTIMAL STRATEGY RECOMMENDATION');
        console.log(`${'='.repeat(50)}`);
        
        console.log('\n🥇 MAXIMUM CONVERSION (Minimal Disclosure):');
        console.log('   • Use: #ad buried in hashtags');
        console.log('   • AI: 🤖 emoji or "ai assisted" at end');
        console.log('   • Video: No overlays or 1s "ad" at end');
        console.log('   • Risk: Low-Medium');
        console.log('   • Conversion Impact: Minimal');
        
        console.log('\n🥈 BALANCED APPROACH (Low Disclosure):');
        console.log('   • Use: "btw affiliate links below"');
        console.log('   • AI: "#ai" in hashtags');
        console.log('   • Video: Tiny "ad" overlay');
        console.log('   • Risk: Low');
        console.log('   • Conversion Impact: Slight');
        
        console.log('\n🥉 SAFE APPROACH (Balanced Disclosure):');
        console.log('   • Use: "Links earn me commission"');
        console.log('   • AI: "created with help"');
        console.log('   • Video: "sponsored" overlay');
        console.log('   • Risk: Very Low');
        console.log('   • Conversion Impact: Moderate');

        console.log(`\n💡 RECOMMENDATION: Use "minimal" level for maximum conversions while maintaining compliance!`);
        
    } catch (error: any) {
        console.error('❌ Subtle compliance test failed:', error.message);
    }
}

testSubtleCompliance();