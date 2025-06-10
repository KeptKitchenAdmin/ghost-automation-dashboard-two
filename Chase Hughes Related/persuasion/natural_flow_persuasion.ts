import { ChaseHughesPersuasion } from './chase_hughes_techniques.js';

interface HandGesture {
    name: string;
    description: string;
    when_to_use: string;
    psychological_effect: string;
}

interface EyePattern {
    name: string;
    description: string;
    when_to_use: string;
    timing: string;
}

interface ExpressionControl {
    name: string;
    description: string;
    when_to_use: string;
    psychological_effect: string;
}

interface PowerPosition {
    name: string;
    description: string;
    when_to_use: string;
    psychological_effect: string;
}

interface PausePattern {
    name: string;
    description: string;
    purpose: string;
    placement: string;
}

interface NonVerbalTechniques {
    hand_gestures: {
        authority_gestures: HandGesture[];
        persuasion_gestures: HandGesture[];
        rapport_gestures: HandGesture[];
    };
    facial_techniques: {
        eye_patterns: EyePattern[];
        expression_control: ExpressionControl[];
    };
    body_positioning: {
        power_positions: PowerPosition[];
    };
    timing_techniques: {
        pause_patterns: PausePattern[];
    };
}

interface NaturalScript {
    hook: string;
    content: string;
    cta: string;
    nonVerbalInstructions: Record<string, any>;
    voiceInstructions: VoiceInstructions;
    persuasionAnalysis: PersuasionAnalysis;
}

interface VoiceInstructions {
    overall_tone: string;
    pace_strategy: string;
    emphasis_technique: string;
    pause_strategy: string;
    specific_instructions: Record<string, string>;
}

interface PersuasionAnalysis {
    grammar_score: number;
    flow_score: number;
    naturalness_score: number;
    suspicion_risk: string;
    overall_naturalness: number;
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
    benefits: string[];
}

interface QualityMetrics {
    naturalness: PersuasionAnalysis;
    persuasion_power: string;
    detection_risk: string;
}

interface ProductionNotes {
    camera_angles: string;
    lighting: string;
    background: string;
}

interface NaturalPackage {
    script: NaturalScript;
    delivery_guide: {
        voice_instructions: VoiceInstructions;
        nonverbal_sequence: Record<string, any>;
        timing_notes: string;
    };
    quality_metrics: QualityMetrics;
    production_notes: ProductionNotes;
}

class NaturalFlowPersuasion {
    private naturalEmbeddedCommands: string[];
    private naturalPresuppositions: string[];
    private naturalAuthorityMarkers: string[];
    private transitionPhrases: string[];
    private nonVerbalTechniques: NonVerbalTechniques;

    constructor() {
        // Natural-sounding embedded commands that flow perfectly
        this.naturalEmbeddedCommands = [
            "You might find yourself {ACTION} as you {CONTEXT}",
            "Most people discover they {ACTION} when they {CONTEXT}",
            "As you {CONTEXT}, you'll naturally {ACTION}",
            "The interesting thing is how you can {ACTION} while you {CONTEXT}",
            "What's fascinating is when you {CONTEXT}, you automatically {ACTION}"
        ];

        // Seamless presuppositions that sound conversational
        this.naturalPresuppositions = [
            "When you decide to {ACTION}, you'll notice...",
            "After you {ACTION}, the first thing you'll see is...",
            "Once you start {ACTION}, you'll understand why...",
            "Before you {ACTION}, it's worth knowing that...",
            "As soon as you {ACTION}, you'll realize..."
        ];

        // Natural authority statements that don't sound boastful
        this.naturalAuthorityMarkers = [
            "In my experience working with people, I've noticed...",
            "What I've learned from helping others is...",
            "The pattern I keep seeing is...",
            "Time and again, I've observed that...",
            "One thing that consistently works is..."
        ];

        // Smooth transitions between psychological triggers
        this.transitionPhrases = [
            "Here's the thing though...",
            "But what's really interesting is...",
            "Now, here's where it gets good...",
            "The reality is...",
            "What most people don't realize is...",
            "The truth is...",
            "Here's what I've discovered..."
        ];

        // Chase Hughes non-verbal techniques
        this.nonVerbalTechniques = {
            hand_gestures: {
                // Specific hand movements for different psychological effects
                authority_gestures: [
                    {
                        name: "Steepling",
                        description: "Fingertips touching, forming a steeple",
                        when_to_use: "When establishing authority or expertise",
                        psychological_effect: "Increases perceived competence and confidence"
                    },
                    {
                        name: "Open Palm Display",
                        description: "Palms facing camera, fingers relaxed",
                        when_to_use: "When making honest or vulnerable statements",
                        psychological_effect: "Builds trust and openness"
                    },
                    {
                        name: "Precision Grip",
                        description: "Thumb and index finger almost touching",
                        when_to_use: "When making specific or important points",
                        psychological_effect: "Conveys precision and attention to detail"
                    }
                ],
                
                persuasion_gestures: [
                    {
                        name: "Slow Point",
                        description: "Slow, deliberate pointing toward camera",
                        when_to_use: "During embedded commands or direct suggestions",
                        psychological_effect: "Creates personal connection and compliance"
                    },
                    {
                        name: "Container Gesture",
                        description: "Hands forming invisible box or container",
                        when_to_use: "When describing problems or solutions",
                        psychological_effect: "Makes abstract concepts feel tangible"
                    },
                    {
                        name: "Number Counting",
                        description: "Counting on fingers while making points",
                        when_to_use: "When listing benefits or steps",
                        psychological_effect: "Increases retention and perceived value"
                    }
                ],
                
                rapport_gestures: [
                    {
                        name: "Mirroring Setup",
                        description: "Relaxed, open posture that invites mirroring",
                        when_to_use: "Throughout video to build unconscious rapport",
                        psychological_effect: "Creates unconscious connection with viewer"
                    },
                    {
                        name: "Heart Touch",
                        description: "Light touch to chest/heart area",
                        when_to_use: "When sharing personal stories or emotions",
                        psychological_effect: "Increases emotional connection and trust"
                    }
                ]
            },
            
            facial_techniques: {
                eye_patterns: [
                    {
                        name: "Direct Gaze",
                        description: "Looking directly into camera lens",
                        when_to_use: "During commands, important points, and CTAs",
                        timing: "3-5 second holds"
                    },
                    {
                        name: "Thoughtful Look Away",
                        description: "Brief look up and to the side",
                        when_to_use: "When accessing memories or appearing thoughtful",
                        timing: "1-2 seconds before returning to camera"
                    },
                    {
                        name: "Micro-Expressions",
                        description: "Slight surprise, concern, or excitement",
                        when_to_use: "To punctuate emotional moments",
                        timing: "Brief flashes, 0.5-1 second"
                    }
                ],
                
                expression_control: [
                    {
                        name: "Asymmetrical Smile",
                        description: "Slight smile that's higher on one side",
                        when_to_use: "When sharing 'secrets' or insider knowledge",
                        psychological_effect: "Creates sense of conspiracy and exclusivity"
                    },
                    {
                        name: "Concerned Furrow",
                        description: "Slight brow furrow showing concern",
                        when_to_use: "When discussing problems or pain points",
                        psychological_effect: "Shows empathy and understanding"
                    },
                    {
                        name: "Confident Nod",
                        description: "Slow, deliberate head nods",
                        when_to_use: "During affirmative statements and CTAs",
                        psychological_effect: "Encourages viewer agreement and compliance"
                    }
                ]
            },
            
            body_positioning: {
                power_positions: [
                    {
                        name: "Open Authority Stance",
                        description: "Shoulders back, chest open, feet planted",
                        when_to_use: "When establishing credibility",
                        psychological_effect: "Projects confidence and expertise"
                    },
                    {
                        name: "Slight Forward Lean",
                        description: "Leaning slightly toward camera",
                        when_to_use: "During intimate or important revelations",
                        psychological_effect: "Creates intimacy and importance"
                    },
                    {
                        name: "Relaxed Confidence",
                        description: "Comfortable, unstressed posture",
                        when_to_use: "Throughout video as baseline",
                        psychological_effect: "Builds trust and relatability"
                    }
                ]
            },
            
            timing_techniques: {
                pause_patterns: [
                    {
                        name: "Command Pause",
                        description: "1-2 second pause after embedded commands",
                        purpose: "Allows unconscious processing",
                        placement: "After 'you might find yourself...'"
                    },
                    {
                        name: "Revelation Pause",
                        description: "3-4 second pause before big reveals",
                        purpose: "Builds anticipation and importance",
                        placement: "Before sharing the 'secret' or solution"
                    },
                    {
                        name: "Decision Pause",
                        description: "2-3 second pause after CTAs",
                        purpose: "Gives time for decision making",
                        placement: "After 'the choice is yours...'"
                    }
                ]
            }
        };
    }

    // Generate natural, grammatically correct script with embedded persuasion
    generateNaturalPersuasiveScript(baseScript: BaseScript, product: Product, persona: any): NaturalScript {
        const naturalScript: NaturalScript = {
            hook: this.createNaturalHook(baseScript.hook, product),
            content: this.createFlowingContent(baseScript, product, persona),
            cta: this.createNaturalCTA(),
            nonVerbalInstructions: this.generateNonVerbalSequence(),
            voiceInstructions: this.generateNaturalVoiceInstructions(),
            persuasionAnalysis: this.analyzePersuasionNaturalness()
        };

        return naturalScript;
    }

    // Create natural-sounding hook with embedded persuasion
    private createNaturalHook(originalHook: string, product: Product): string {
        const naturalHooks = [
            "You know that moment when you realize you've been doing something completely wrong?",
            "I wasn't going to share this, but too many people are struggling with the same thing I used to.",
            "Someone asked me why some people get incredible results while others stay stuck...",
            "Here's something I wish someone had told me years ago about getting real results.",
            "The other day, someone pointed out something that completely changed how I think about this."
        ];

        return this.getRandomElement(naturalHooks);
    }

    // Create flowing, natural content with seamless persuasion
    private createFlowingContent(baseScript: BaseScript, product: Product, persona: any): string {
        const contentBlocks: string[] = [];

        // 1. Natural pain identification
        contentBlocks.push(this.createNaturalPainBlock());
        
        // 2. Seamless embedded command
        contentBlocks.push(this.createNaturalEmbeddedCommand());
        
        // 3. Natural authority establishment
        contentBlocks.push(this.createNaturalAuthorityStatement());
        
        // 4. Smooth transition to solution
        contentBlocks.push(this.createNaturalSolutionIntro());
        
        // 5. Natural social proof
        contentBlocks.push(this.createNaturalSocialProof());
        
        // 6. Natural presupposition
        contentBlocks.push(this.createNaturalPresupposition());

        // Connect with smooth transitions
        return this.connectWithTransitions(contentBlocks);
    }

    private createNaturalPainBlock(): string {
        const painBlocks = [
            "You know that frustrating feeling when you're putting in all this effort but not seeing the results you want?",
            "I used to think I was doing everything right, but something was clearly missing.",
            "It's like you're following all the advice, but somehow you're still stuck in the same place.",
            "The worst part is when you start wondering if maybe you're just not meant to succeed at this."
        ];
        return this.getRandomElement(painBlocks);
    }

    private createNaturalEmbeddedCommand(): string {
        const commands = [
            "What's interesting is how you can start seeing changes when you approach this differently.",
            "Most people find they begin noticing improvements once they understand the real issue.",
            "You might discover that success comes easier when you focus on the right things.",
            "The fascinating thing is how quickly things can shift when you make this one adjustment."
        ];
        return this.getRandomElement(commands);
    }

    private createNaturalAuthorityStatement(): string {
        const statements = [
            "In my experience helping people with this exact problem, there's usually one thing that makes all the difference.",
            "What I've learned from working with so many people is that most of us are missing this crucial piece.",
            "Time and again, I've seen the same pattern - people struggle until they discover this one thing.",
            "The breakthrough moment usually comes when someone realizes they've been focusing on the wrong area entirely."
        ];
        return this.getRandomElement(statements);
    }

    private createNaturalSolutionIntro(): string {
        const intros = [
            "The real game-changer is understanding that this isn't actually about willpower or trying harder.",
            "What actually works is addressing the root cause instead of just treating the symptoms.",
            "The solution is simpler than most people think, but it requires a different approach.",
            "Once you know what to look for, everything starts making sense."
        ];
        return this.getRandomElement(intros);
    }

    private createNaturalSocialProof(): string {
        const proofs = [
            "I can't tell you how many messages I get from people saying this completely changed their perspective.",
            "The feedback has been incredible - people are seeing results they never thought possible.",
            "What's amazing is hearing from people who thought they'd tried everything, and then this works.",
            "It's becoming a bit of a trend - people are sharing their success stories everywhere."
        ];
        return this.getRandomElement(proofs);
    }

    private createNaturalPresupposition(): string {
        const presuppositions = [
            "When you decide to try this approach, you'll probably notice the difference pretty quickly.",
            "Once you start implementing this, the first thing you'll see is how much easier everything becomes.",
            "After you make this shift, you'll wonder why you waited so long to address it this way.",
            "Before you dive in, just know that this tends to work faster than most people expect."
        ];
        return this.getRandomElement(presuppositions);
    }

    private createNaturalCTA(): string {
        const ctas = [
            "If this resonates with you, there's a link in my bio where you can learn more about this approach.",
            "I've put together more details about this method - check the link in my bio if you're curious.",
            "For those who want to dive deeper into this, I've shared more information in my bio.",
            "If you're ready to try something different, the link in my bio has everything you need to get started."
        ];
        return this.getRandomElement(ctas);
    }

    // Connect content blocks with smooth transitions
    private connectWithTransitions(contentBlocks: string[]): string {
        const transitions = [...this.transitionPhrases];
        const connectedContent = [contentBlocks[0]]; // Start with first block

        for (let i = 1; i < contentBlocks.length; i++) {
            const transition = transitions[i - 1] || "Here's the thing...";
            connectedContent.push(transition);
            connectedContent.push(contentBlocks[i]);
        }

        return connectedContent.join(' ');
    }

    // Generate complete non-verbal instruction sequence
    private generateNonVerbalSequence(): Record<string, any> {
        return {
            opening_3_seconds: {
                gesture: this.nonVerbalTechniques.hand_gestures.rapport_gestures[0],
                facial: this.nonVerbalTechniques.facial_techniques.eye_patterns[0],
                body: this.nonVerbalTechniques.body_positioning.power_positions[2],
                instruction: "Start with relaxed confidence, direct eye contact, open posture"
            },
            
            pain_phase_8_seconds: {
                gesture: this.nonVerbalTechniques.hand_gestures.authority_gestures[1],
                facial: this.nonVerbalTechniques.facial_techniques.expression_control[1],
                body: this.nonVerbalTechniques.body_positioning.power_positions[1],
                instruction: "Open palms showing honesty, concerned expression, slight lean forward"
            },
            
            authority_phase_12_seconds: {
                gesture: this.nonVerbalTechniques.hand_gestures.authority_gestures[0],
                facial: this.nonVerbalTechniques.facial_techniques.expression_control[2],
                body: this.nonVerbalTechniques.body_positioning.power_positions[0],
                instruction: "Steepling hands for authority, confident nods, strong posture"
            },
            
            embedded_command_18_seconds: {
                gesture: this.nonVerbalTechniques.hand_gestures.persuasion_gestures[0],
                facial: this.nonVerbalTechniques.facial_techniques.eye_patterns[0],
                timing: this.nonVerbalTechniques.timing_techniques.pause_patterns[0],
                instruction: "Slow point toward camera during command, maintain eye contact, pause after"
            },
            
            social_proof_24_seconds: {
                gesture: this.nonVerbalTechniques.hand_gestures.persuasion_gestures[2],
                facial: this.nonVerbalTechniques.facial_techniques.expression_control[0],
                body: this.nonVerbalTechniques.body_positioning.power_positions[2],
                instruction: "Count benefits on fingers, asymmetrical smile, relaxed confidence"
            },
            
            cta_30_seconds: {
                gesture: this.nonVerbalTechniques.hand_gestures.authority_gestures[1],
                facial: this.nonVerbalTechniques.facial_techniques.eye_patterns[0],
                timing: this.nonVerbalTechniques.timing_techniques.pause_patterns[2],
                instruction: "Open palm display, direct gaze, pause after CTA for decision time"
            }
        };
    }

    // Generate natural voice instructions that enhance persuasion
    private generateNaturalVoiceInstructions(): VoiceInstructions {
        return {
            overall_tone: "Conversational and helpful, like talking to a good friend",
            pace_strategy: "Slightly slower on important points, normal speed elsewhere",
            emphasis_technique: "Natural stress on key words, not forced",
            pause_strategy: "Natural conversation pauses, slightly longer before revelations",
            
            specific_instructions: {
                embedded_commands: "Slight downward inflection, as if stating a fact",
                pain_points: "Empathetic tone, slower pace to let it sink in",
                authority_statements: "Confident but not arrogant, matter-of-fact delivery",
                social_proof: "Excited but authentic, like sharing good news",
                cta: "Helpful and inviting, not pushy or demanding"
            }
        };
    }

    // Analyze how natural the persuasion sounds
    private analyzePersuasionNaturalness(script?: string): PersuasionAnalysis {
        const analysis: PersuasionAnalysis = {
            grammar_score: this.checkGrammar(script),
            flow_score: this.checkFlow(script),
            naturalness_score: this.checkNaturalness(script),
            suspicion_risk: this.assessSuspicionRisk(script),
            overall_naturalness: 0
        };

        analysis.overall_naturalness = Math.round(
            (analysis.grammar_score + analysis.flow_score + analysis.naturalness_score) / 3
        );

        return analysis;
    }

    private checkGrammar(script?: string): number {
        // Simplified grammar check - in production would use NLP library
        const commonErrors = [',,', '..', '  ', 'you you', 'the the'];
        let errorCount = 0;
        
        commonErrors.forEach(error => {
            if (script && script.includes(error)) errorCount++;
        });
        
        return Math.max(0, 100 - (errorCount * 20));
    }

    private checkFlow(script?: string): number {
        // Check for smooth transitions and logical progression
        const transitionWords = ['but', 'however', 'meanwhile', 'therefore', 'because', 'since'];
        const transitionCount = transitionWords.filter(word => 
            script && script.toLowerCase().includes(word)
        ).length;
        
        return Math.min(100, transitionCount * 15 + 40);
    }

    private checkNaturalness(script?: string): number {
        // Check for conversational language vs overly formal
        const conversationalMarkers = ["you know", "here's the thing", "what's interesting", "the reality is"];
        const formalMarkers = ["furthermore", "consequently", "nevertheless", "henceforth"];
        
        if (!script) return 50;
        
        const conversationalCount = conversationalMarkers.filter(marker => 
            script.toLowerCase().includes(marker)
        ).length;
        
        const formalCount = formalMarkers.filter(marker => 
            script.toLowerCase().includes(marker)
        ).length;
        
        return Math.min(100, (conversationalCount * 20) - (formalCount * 15) + 50);
    }

    private assessSuspicionRisk(script?: string): string {
        const suspiciousPatterns = [
            'you must', 'you will', 'you have to', 'you need to',
            'buy now', 'act fast', 'limited time', 'don\'t miss out'
        ];
        
        if (!script) return 'low';
        
        const suspiciousCount = suspiciousPatterns.filter(pattern => 
            script.toLowerCase().includes(pattern)
        ).length;
        
        if (suspiciousCount === 0) return 'very_low';
        if (suspiciousCount <= 2) return 'low';
        if (suspiciousCount <= 4) return 'medium';
        return 'high';
    }

    private getRandomElement<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Generate complete natural persuasion package
    generateCompleteNaturalPackage(baseScript: BaseScript, product: Product, persona: any): NaturalPackage {
        const naturalScript = this.generateNaturalPersuasiveScript(baseScript, product, persona);
        
        return {
            script: naturalScript,
            delivery_guide: {
                voice_instructions: naturalScript.voiceInstructions,
                nonverbal_sequence: naturalScript.nonVerbalInstructions,
                timing_notes: "Natural conversation pace with strategic pauses"
            },
            quality_metrics: {
                naturalness: this.analyzePersuasionNaturalness(naturalScript.content),
                persuasion_power: "High but concealed",
                detection_risk: "Very Low"
            },
            production_notes: {
                camera_angles: "Medium shot to show hand gestures, close-ups for eye contact moments",
                lighting: "Soft, natural lighting to enhance trustworthiness",
                background: "Simple, non-distracting to keep focus on speaker"
            }
        };
    }
}

// Create singleton instance
const naturalFlowPersuasion = new NaturalFlowPersuasion();

export { NaturalFlowPersuasion, naturalFlowPersuasion };