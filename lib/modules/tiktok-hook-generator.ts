/**
 * TikTok Hook Generator - Viral Video Script Templates
 * Generates high-retention educational scripts for @mustknowsecrets
 */

import { tikTokContentStrategy } from './tiktok-content-strategy';
import { ContentTopic } from './content-database';
import { v4 as uuidv4 } from 'uuid';

enum HookType {
  SHOCK_REVELATION = "shock_revelation",
  CONSPIRACY_EXPOSE = "conspiracy_expose",
  AUTHORITY_BETRAYAL = "authority_betrayal", 
  PERSONAL_VALIDATION = "personal_validation",
  HIDDEN_TRUTH = "hidden_truth",
  SCIENTIFIC_EXPOSE = "scientific_expose"
}

enum EmotionalTone {
  OUTRAGED = "outraged",
  SHOCKED = "shocked", 
  VALIDATING = "validating",
  CONSPIRATORIAL = "conspiratorial",
  EDUCATIONAL = "educational",
  REBELLIOUS = "rebellious"
}


interface VideoScript {
  id: string;
  topic: any;
  hook_line: string;
  opening_statement: string;
  key_revelation: string;
  emotional_context: string;
  consequence_statement: string;
  call_to_action: string;
  hashtags: string[];
  estimated_duration: number; // seconds
  hook_type: HookType;
  emotional_tone: EmotionalTone;
  ai_face_prompts: Record<string, string>; // For AI human face generation
  voiceover_notes: string;
}

interface EmotionalModifier {
  voice_style: string;
  facial_expression: string;
  body_language: string;
  transition_words: string;
}

export class TikTokHookGenerator {
  private hookTemplates: Record<HookType, string[]>;
  private emotionalModifiers: Record<EmotionalTone, EmotionalModifier>;
  private callToActionTemplates: string[];

  constructor() {
    this.hookTemplates = this.initializeHookTemplates();
    this.emotionalModifiers = this.initializeEmotionalModifiers();
    this.callToActionTemplates = this.initializeCTATemplates();
  }

  private initializeHookTemplates(): Record<HookType, string[]> {
    return {
      [HookType.SHOCK_REVELATION]: [
        "You were never meant to know this about {topic}...",
        "They've been lying to you about {topic} for {timeframe}...",
        "What I'm about to tell you about {topic} will change everything...",
        "The truth about {topic} was buried for a reason...",
        "They don't want you to know what {topic} really does...",
        "This secret about {topic} explains everything...",
        "The {authority} has been hiding this about {topic}...",
        "What you think you know about {topic} is completely wrong..."
      ],
      
      [HookType.CONSPIRACY_EXPOSE]: [
        "The {authority} actually {shocking_action}...",
        "They deleted this from your history books about {topic}...",
        "This was classified for {timeframe} but now we know...",
        "The {industry} paid scientists to lie about {topic}...",
        "There's a reason they don't teach you about {topic} in school...",
        "The same people who {past_crime} are now controlling {current_thing}...",
        "Follow the money on {topic} and you'll see the truth...",
        "This document was leaked and it proves {shocking_fact}..."
      ],
      
      [HookType.AUTHORITY_BETRAYAL]: [
        "Your doctor won't tell you this about {topic}...",
        "The {expert_type} who created {thing} never intended it for {current_use}...",
        "Even the {authority} admits {topic} is dangerous...",
        "The same {institution} that said {past_lie} now wants you to believe {current_lie}...",
        "They teach doctors to ignore {symptom} because it reveals {truth}...",
        "The {authority} makes money when you {harmful_action}...",
        "Your {trusted_figure} is paid to not tell you about {topic}...",
        "The {institution} literally wrote the playbook on {deception}..."
      ],
      
      [HookType.PERSONAL_VALIDATION]: [
        "If you've ever felt like your {problem} is broken, it's not you...",
        "There's a reason {common_struggle} feels impossible...",
        "You're not crazy - {your_experience} was designed to happen...",
        "Everyone who struggles with {issue} has this in common...",
        "The reason {common_problem} keeps happening isn't what you think...",
        "If {relatable_experience}, you need to hear this...",
        "Stop blaming yourself for {struggle} - here's the real reason...",
        "Your {problem} isn't a personal failing, it's by design..."
      ],
      
      [HookType.HIDDEN_TRUTH]: [
        "This 'scientific' fact was made up by {non_expert}...",
        "They want you to think {belief} but the opposite is true...",
        "The study that 'proved' {mainstream_belief} was completely fraudulent...",
        "Before {year}, no one believed {current_myth}...",
        "This myth about {topic} came from a {industry} marketing campaign...",
        "The real research on {topic} shows the exact opposite of what they tell you...",
        "They cherry-picked data to make you believe {false_belief}...",
        "The original study on {topic} actually concluded {opposite_finding}..."
      ],
      
      [HookType.SCIENTIFIC_EXPOSE]: [
        "The scientist who discovered {thing} warned against {current_use}...",
        "This Nobel Prize winner was silenced for revealing {truth}...",
        "The research that could save millions is being buried because {reason}...",
        "They fired the researcher who proved {uncomfortable_truth}...",
        "The patents for {thing} reveal its true purpose...",
        "The animal studies on {topic} show {disturbing_result}...",
        "The peer review process is rigged against research that shows {truth}...",
        "Independent studies consistently show {finding} but you'll never hear about it..."
      ]
    };
  }

  private initializeEmotionalModifiers(): Record<EmotionalTone, EmotionalModifier> {
    return {
      [EmotionalTone.OUTRAGED]: {
        voice_style: "Angry, passionate, speaking faster",
        facial_expression: "Serious, furrowed brow, direct eye contact",
        body_language: "Leaning forward, emphatic gestures",
        transition_words: "Listen, Here's the thing, This is insane"
      },
      
      [EmotionalTone.SHOCKED]: {
        voice_style: "Breathless, urgent, escalating volume",
        facial_expression: "Wide eyes, raised eyebrows, open mouth",
        body_language: "Quick movements, animated gestures",
        transition_words: "Wait for it, You won't believe this, Get this"
      },
      
      [EmotionalTone.VALIDATING]: {
        voice_style: "Warm, understanding, reassuring pace",
        facial_expression: "Compassionate, nodding, soft eyes",
        body_language: "Open posture, calm gestures",
        transition_words: "I get it, You're not alone, Here's why"
      },
      
      [EmotionalTone.CONSPIRATORIAL]: {
        voice_style: "Lower, secretive, intimate tone",
        facial_expression: "Knowing look, slight smile, raised eyebrow",
        body_language: "Leaning in, subtle gestures",
        transition_words: "Between you and me, They don't want you to know, Here's the real story"
      },
      
      [EmotionalTone.EDUCATIONAL]: {
        voice_style: "Clear, authoritative, measured pace",
        facial_expression: "Focused, serious, maintaining eye contact",
        body_language: "Confident posture, explanatory gestures",
        transition_words: "Here's what really happened, The facts are, Research shows"
      },
      
      [EmotionalTone.REBELLIOUS]: {
        voice_style: "Defiant, challenging, bold delivery",
        facial_expression: "Determined, slight smirk, confident",
        body_language: "Strong posture, pointing gestures",
        transition_words: "Screw what they tell you, It's time to rebel, Wake up"
      }
    };
  }

  private initializeCTATemplates(): string[] {
    return [
      "Follow for more suppressed truths they don't want you to know",
      "Comment if this opened your eyes - let's wake up together",
      "Share this before they try to take it down",
      "Save this and research it yourself - don't take my word for it",
      "Which truth do you want exposed next? Comment below",
      "Follow if you're ready to question everything",
      "Tag someone who needs to see this reality",
      "Part 2 coming tomorrow if this doesn't get censored",
      "Comment 'TRUTH' if you're done being lied to",
      "Follow for daily red pills they don't want you to swallow"
    ];
  }

  generateVideoScript(
    topic?: any,
    hookType?: HookType,
    emotionalTone?: EmotionalTone,
    targetDuration: number = 60
  ): VideoScript {
    // Get content topic if not provided
    if (!topic) {
      topic = tikTokContentStrategy.getContentTopic();
    }
    
    // Select hook type based on topic if not specified
    if (!hookType) {
      hookType = this.selectOptimalHookType(topic);
    }
    
    // Select emotional tone based on topic and hook
    if (!emotionalTone) {
      emotionalTone = this.selectOptimalEmotionalTone(topic, hookType);
    }
    
    // Generate hook line
    const hookLine = this.generateHookLine(topic, hookType);
    
    // Generate script components
    const opening = this.generateOpeningStatement(topic, emotionalTone);
    const revelation = this.generateKeyRevelation(topic);
    const context = this.generateEmotionalContext(topic, emotionalTone);
    const consequence = this.generateConsequenceStatement(topic);
    const cta = this.callToActionTemplates[Math.floor(Math.random() * this.callToActionTemplates.length)];
    
    // Generate AI face prompts
    const aiPrompts = this.generateAIFacePrompts(emotionalTone, topic);
    
    // Generate voiceover notes
    const voiceoverNotes = this.generateVoiceoverNotes(emotionalTone, targetDuration);
    
    // Combine hashtags
    const hashtags = this.generateHashtags(topic);
    
    const script: VideoScript = {
      id: `script_${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}`,
      topic: topic,
      hook_line: hookLine,
      opening_statement: opening,
      key_revelation: revelation,
      emotional_context: context,
      consequence_statement: consequence,
      call_to_action: cta,
      hashtags: hashtags,
      estimated_duration: targetDuration,
      hook_type: hookType,
      emotional_tone: emotionalTone,
      ai_face_prompts: aiPrompts,
      voiceover_notes: voiceoverNotes
    };
    
    console.log(`Generated video script: ${topic.title} (${hookType}, ${emotionalTone})`);
    return script;
  }

  private selectOptimalHookType(topic: any): HookType {
    const categoryMappings: Record<string, HookType[]> = {
      "government_coverups": [HookType.CONSPIRACY_EXPOSE, HookType.HIDDEN_TRUTH],
      "health_distortions": [HookType.AUTHORITY_BETRAYAL, HookType.PERSONAL_VALIDATION],
      "suppressed_science": [HookType.SCIENTIFIC_EXPOSE, HookType.SHOCK_REVELATION],
      "behavioral_control": [HookType.SHOCK_REVELATION, HookType.CONSPIRACY_EXPOSE],
      "propaganda_techniques": [HookType.CONSPIRACY_EXPOSE, HookType.AUTHORITY_BETRAYAL],
      "psyops_experiments": [HookType.SHOCK_REVELATION, HookType.SCIENTIFIC_EXPOSE]
    };
    
    const preferredHooks = categoryMappings[topic.category.value] || [HookType.SHOCK_REVELATION];
    return preferredHooks[Math.floor(Math.random() * preferredHooks.length)];
  }

  private selectOptimalEmotionalTone(topic: any, hookType: HookType): EmotionalTone {
    const toneMappings: Record<HookType, EmotionalTone[]> = {
      [HookType.SHOCK_REVELATION]: [EmotionalTone.SHOCKED, EmotionalTone.OUTRAGED],
      [HookType.CONSPIRACY_EXPOSE]: [EmotionalTone.CONSPIRATORIAL, EmotionalTone.REBELLIOUS],
      [HookType.AUTHORITY_BETRAYAL]: [EmotionalTone.OUTRAGED, EmotionalTone.REBELLIOUS],
      [HookType.PERSONAL_VALIDATION]: [EmotionalTone.VALIDATING, EmotionalTone.EDUCATIONAL],
      [HookType.HIDDEN_TRUTH]: [EmotionalTone.EDUCATIONAL, EmotionalTone.CONSPIRATORIAL],
      [HookType.SCIENTIFIC_EXPOSE]: [EmotionalTone.EDUCATIONAL, EmotionalTone.SHOCKED]
    };
    
    // Weight based on topic controversy level
    let preferredTones: EmotionalTone[];
    if (topic.controversy_level >= 8) {
      preferredTones = [EmotionalTone.OUTRAGED, EmotionalTone.REBELLIOUS, EmotionalTone.SHOCKED];
    } else {
      preferredTones = toneMappings[hookType] || [EmotionalTone.EDUCATIONAL];
    }
    
    return preferredTones[Math.floor(Math.random() * preferredTones.length)];
  }

  private generateHookLine(topic: any, hookType: HookType): string {
    const templates = this.hookTemplates[hookType];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Fill in template variables based on topic
    const variables: Record<string, string> = {
      topic: topic.title.toLowerCase(),
      authority: this.extractAuthority(topic),
      timeframe: "decades",
      shocking_action: this.extractShockingAction(topic),
      industry: this.extractIndustry(topic),
      problem: this.extractCommonProblem(topic),
      expert_type: this.extractExpertType(topic)
    };
    
    // Use topic's hook_line if it fits the template style
    if (Object.keys(variables).some(variable => template.includes(`{${variable}}`))) {
      try {
        return this.replaceVariables(template, variables);
      } catch {
        return topic.hook_line;
      }
    } else {
      return topic.hook_line;
    }
  }

  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
  }

  private generateOpeningStatement(topic: any, tone: EmotionalTone): string {
    const toneModifiers = this.emotionalModifiers[tone];
    const transitions = toneModifiers.transition_words.split(', ');
    const transition = transitions[Math.floor(Math.random() * transitions.length)];
    
    return transition + " " + topic.key_fact;
  }

  private generateKeyRevelation(topic: any): string {
    return topic.key_fact;
  }

  private generateEmotionalContext(topic: any, tone: EmotionalTone): string {
    const baseContext = topic.emotional_context;
    
    switch (tone) {
      case EmotionalTone.OUTRAGED:
        return "This is absolutely insane. " + baseContext;
      case EmotionalTone.VALIDATING:
        return "And if you've ever struggled with this, now you know why. " + baseContext;
      case EmotionalTone.CONSPIRATORIAL:
        return "Here's what they don't want you to realize: " + baseContext;
      default:
        return baseContext;
    }
  }

  private generateConsequenceStatement(topic: any): string {
    return "And this is why " + topic.consequence;
  }

  private generateAIFacePrompts(tone: EmotionalTone, topic: any): Record<string, string> {
    const toneData = this.emotionalModifiers[tone];
    
    return {
      hook_prompt: `Confident person, ${toneData.facial_expression}, direct eye contact, ${toneData.body_language}, professional lighting`,
      revelation_prompt: `Same person, ${toneData.facial_expression}, explaining something important, engaging expression`,
      context_prompt: `Same person, ${toneData.facial_expression}, passionate about topic, clear communication`,
      consequence_prompt: `Same person, serious expression, direct eye contact, compelling delivery`,
      cta_prompt: `Same person, confident smile, encouraging expression, call-to-action energy`
    };
  }

  private generateVoiceoverNotes(tone: EmotionalTone, duration: number): string {
    const toneData = this.emotionalModifiers[tone];
    const pacing = duration <= 30 ? "fast" : duration <= 60 ? "medium" : "slower";
    
    return `Voice style: ${toneData.voice_style}. Pacing: ${pacing}. Duration: ${duration}s. Emphasize hook and consequence statements.`;
  }

  private generateHashtags(topic: any): string[] {
    const baseHashtags = ["#truth", "#exposed", "#awakening", "#redpill", "#conspiracy"];
    const topicHashtags = topic.hashtags.slice(0, 5); // Limit topic-specific hashtags
    const viralHashtags = ["#fyp", "#viral", "#mindblown", "#shocking", "#hidden"];
    
    // Combine and limit to 15 hashtags max
    const allHashtags = [...baseHashtags, ...topicHashtags, ...viralHashtags];
    return [...new Set(allHashtags)].slice(0, 15);
  }

  private extractAuthority(topic: any): string {
    const authorities = ["government", "FDA", "medical establishment", "big pharma", "scientists", "experts"];
    const lowercaseKeyFact = topic.key_fact.toLowerCase();
    const lowercaseContext = topic.emotional_context.toLowerCase();
    
    for (const auth of authorities) {
      if (lowercaseKeyFact.includes(auth) || lowercaseContext.includes(auth)) {
        return auth;
      }
    }
    return "establishment";
  }

  private extractShockingAction(topic: any): string {
    const lowercaseKeyFact = topic.key_fact.toLowerCase();
    
    if (lowercaseKeyFact.includes("experiment")) {
      return "experimented on citizens";
    } else if (lowercaseKeyFact.includes("paid")) {
      return "paid scientists to lie";
    } else if (lowercaseKeyFact.includes("covered up")) {
      return "covered up the truth";
    }
    return "deceived the public";
  }

  private extractIndustry(topic: any): string {
    const industries = ["sugar industry", "pharmaceutical industry", "diet industry", "medical industry"];
    const lowercaseKeyFact = topic.key_fact.toLowerCase();
    
    for (const industry of industries) {
      if (industry.split(' ').some(word => lowercaseKeyFact.includes(word))) {
        return industry;
      }
    }
    return "industry";
  }

  private extractCommonProblem(topic: any): string {
    const lowercaseTitle = topic.title.toLowerCase();
    const lowercaseKeyFact = topic.key_fact.toLowerCase();
    
    if (lowercaseTitle.includes("weight") || lowercaseTitle.includes("diet")) {
      return "weight";
    } else if (lowercaseKeyFact.includes("hunger")) {
      return "hunger";
    } else if (lowercaseKeyFact.includes("metabolism")) {
      return "metabolism";
    }
    return "health";
  }

  private extractExpertType(topic: any): string {
    const lowercaseKeyFact = topic.key_fact.toLowerCase();
    
    if (lowercaseKeyFact.includes("astronomer")) {
      return "astronomer";
    } else if (lowercaseKeyFact.includes("scientist")) {
      return "scientist";
    } else if (lowercaseKeyFact.includes("researcher")) {
      return "researcher";
    }
    return "expert";
  }

  generateContentVariations(baseScript: VideoScript, count: number = 3): VideoScript[] {
    const variations: VideoScript[] = [];
    
    for (let i = 0; i < count; i++) {
      // Vary emotional tone and hook type
      const tones = Object.values(EmotionalTone);
      const hookTypes = Object.values(HookType);
      
      const newTone = tones[Math.floor(Math.random() * tones.length)];
      const newHookType = hookTypes[Math.floor(Math.random() * hookTypes.length)];
      
      const variation = this.generateVideoScript(
        baseScript.topic,
        newHookType,
        newTone,
        baseScript.estimated_duration
      );
      
      variations.push(variation);
    }
    
    return variations;
  }

  optimizeScriptForRetention(script: VideoScript): VideoScript {
    // Add retention hooks every 15 seconds
    const duration = script.estimated_duration;
    const retentionHooks: string[] = [];
    
    for (let timestamp = 15; timestamp < duration; timestamp += 15) {
      const hooks = [
        "But wait, it gets worse...",
        "Here's the part they really don't want you to know...",
        "And this is where it gets really crazy...",
        "But that's not even the worst part...",
        "Hold on, because this will blow your mind..."
      ];
      const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
      retentionHooks.push(`[${timestamp}s] ${randomHook}`);
    }
    
    // Update script with retention elements
    script.voiceover_notes += ` Retention hooks: ${retentionHooks.join('; ')}`;
    
    return script;
  }
}

export const tikTokHookGenerator = new TikTokHookGenerator();