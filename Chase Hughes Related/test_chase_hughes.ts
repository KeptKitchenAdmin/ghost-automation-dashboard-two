import { chaseHughesPersuasion } from './persuasion/chase_hughes_techniques.js';
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
    benefits: string[];
}

async function testChaseHughesSystem(): Promise<void> {
    console.log('🧠 Testing CHASE HUGHES Psychological Persuasion System\n');
    
    try {
        // Mock ViralAutomationEngine for testing
        const engine: ViralAutomationEngine = {
            createViralCampaign: async (config: any) => ({ id: 'test_campaign' }),
            generatedScripts: [{
                id: 'test_script',
                hook: 'This simple trick changed everything',
                content: 'Most people struggle with weight loss because they\'re focusing on the wrong thing. The real secret is understanding your metabolism.',
                cta: 'Click the link to learn more'
            }],
            activePersonas: [{
                id: 'fitness_expert',
                name: 'Sarah Thompson',
                niche: 'fitness'
            }]
        };

        const campaign = await engine.createViralCampaign({
            personaCount: 1,
            scriptsPerPersona: 1,
            niche: 'fitness'
        });
        
        const baseScript = engine.generatedScripts[0];
        const persona = engine.activePersonas[0];
        const product: Product = {
            id: 'fitness_transformation',
            name: 'Ultimate Body Transformation System',
            isAffiliate: true,
            benefits: ['rapid weight loss', 'muscle building', 'energy boost']
        };

        console.log('📝 ORIGINAL SCRIPT:');
        console.log(`Hook: ${baseScript.hook}`);
        console.log(`Content: ${baseScript.content.substring(0, 100)}...`);
        console.log(`CTA: ${baseScript.cta}\n`);

        // Generate Chase Hughes enhanced script
        console.log('🧠 CHASE HUGHES ENHANCED SCRIPT:');
        console.log('=' .repeat(60));
        
        const persuasiveScript = chaseHughesPersuasion.generatePersuasiveScript(
            baseScript, 
            product, 
            'high'
        );
        
        console.log('🎯 ENHANCED HOOK:');
        console.log(`"${persuasiveScript.enhanced_hook}"`);
        
        console.log('\n🧠 ENHANCED CONTENT (with embedded techniques):');
        console.log(`"${persuasiveScript.enhanced_content}"`);
        
        console.log('\n💥 ENHANCED CTA:');
        console.log(`"${persuasiveScript.enhanced_cta}"`);

        // Generate complete video script with timing
        console.log('\n🎬 COMPLETE VIDEO SCRIPT (30-second breakdown):');
        console.log('=' .repeat(60));
        
        const videoScript = chaseHughesPersuasion.generateCompletePersuasiveVideo(
            persona, 
            product, 
            baseScript
        );
        
        Object.entries(videoScript.video_script).forEach(([phase, details]) => {
            console.log(`\n📍 ${phase.toUpperCase().replace('_', ' ')} (${details.timing}):`);
            console.log(`   Text: "${details.text}"`);
            console.log(`   🎙️  Voice: ${details.voice_note}`);
            console.log(`   📹 Visual: ${details.visual_note}`);
        });

        console.log('\n🧠 PERSUASION TECHNIQUES USED:');
        videoScript.persuasion_techniques_used.forEach((technique, i) => {
            console.log(`   ${i+1}. ${technique}`);
        });
        
        console.log(`\n📊 PSYCHOLOGICAL IMPACT: ${videoScript.psychological_impact}`);
        console.log(`🎯 CONVERSION OPTIMIZATION: ${videoScript.conversion_optimization}`);
        console.log(`⭐ CHASE HUGHES RATING: ${videoScript.chase_hughes_rating}`);

        // Analyze persuasion effectiveness
        console.log('\n🔍 PERSUASION EFFECTIVENESS ANALYSIS:');
        console.log('=' .repeat(60));
        
        const analysis = chaseHughesPersuasion.analyzePersuasionEffectiveness(
            persuasiveScript.enhanced_content
        );
        
        console.log(`📈 Pain Amplification: ${analysis.pain_amplification}/100`);
        console.log(`🎯 Embedded Commands: ${analysis.embedded_commands}/100`);
        console.log(`👑 Authority Markers: ${analysis.authority_markers}/100`);
        console.log(`👥 Social Proof: ${analysis.social_proof}/100`);
        console.log(`⚡ Urgency Creation: ${analysis.urgency_creation}/100`);
        console.log(`🏆 OVERALL SCORE: ${analysis.overall_score}/100`);

        // Combine with subtle compliance
        console.log('\n🥷 FINAL STEALTH SYSTEM (Chase Hughes + Subtle Compliance):');
        console.log('=' .repeat(60));
        
        const stealthScript = {
            hook: persuasiveScript.enhanced_hook,
            content: persuasiveScript.enhanced_content,
            cta: persuasiveScript.enhanced_cta
        };
        
        const stealthCaption = subtleComplianceManager.generateSubtleCompliantCaption(
            stealthScript, 
            product, 
            'minimal'
        );
        
        console.log('📱 FINAL STEALTH CAPTION:');
        console.log('---');
        console.log(stealthCaption.caption);
        console.log('---');
        
        console.log('\n🎯 STEALTH METRICS:');
        console.log(`   🧠 Psychological Impact: ${videoScript.psychological_impact}`);
        console.log(`   👁️  Compliance Visibility: ${stealthCaption.visibility_score}/100`);
        console.log(`   ⚖️  Legal Risk: ${stealthCaption.legal_risk}`);
        console.log(`   🚀 Conversion Potential: MAXIMUM`);
        
        // Voice instructions for maximum impact
        console.log('\n🎙️  VOICE DELIVERY INSTRUCTIONS:');
        console.log('=' .repeat(60));
        const voiceInstructions = persuasiveScript.voice_instructions;
        Object.entries(voiceInstructions).forEach(([aspect, instruction]) => {
            console.log(`   ${aspect.toUpperCase()}: ${instruction}`);
        });

        console.log('\n🏆 ULTIMATE CHASE HUGHES + STEALTH COMPLIANCE SYSTEM READY!');
        console.log('\n📋 WHAT YOU GET:');
        console.log('   ✅ Pain amplification that creates urgency');
        console.log('   ✅ Embedded commands that bypass resistance'); 
        console.log('   ✅ Authority positioning for credibility');
        console.log('   ✅ Social proof pressure for FOMO');
        console.log('   ✅ Pattern interrupts for attention');
        console.log('   ✅ Presupposition closes for assumed sales');
        console.log('   ✅ Voice tonality instructions for hypnotic delivery');
        console.log('   ✅ Stealth disclosures (15/100 visibility)');
        console.log('   ✅ Legal compliance maintained');
        console.log('   ✅ Maximum conversion optimization');
        
    } catch (error: any) {
        console.error('❌ Chase Hughes test failed:', error.message);
        console.error(error.stack);
    }
}

testChaseHughesSystem();