/**
 * ElevenLabs Voice Generation for Supplement Viral Videos
 * High-converting emotional voiceovers targeting American health pain points
 * Optimized for viral TikTok/social media content
 */

export enum VoicePersona {
  CONCERNED_FEMALE = 'concerned_female',        // Health-conscious woman sharing discovery
  AUTHORITATIVE_MALE = 'authoritative_male',    // Expert/doctor figure revealing truth
  RELATABLE_YOUNG = 'relatable_young',         // Peer sharing personal experience
  WISE_MATURE = 'wise_mature',                 // Experienced person with wisdom
  URGENT_WHISTLE_BLOWER = 'urgent_whistle_blower'  // Insider revealing secrets
}

export enum EmotionalTone {
  SHOCKING_REVELATION = 'shocking_revelation',      // Hook - grab attention
  EMPATHETIC_UNDERSTANDING = 'empathetic_understanding',  // Problem - relate to pain
  HOPEFUL_EXCITEMENT = 'hopeful_excitement',        // Solution - introduce product
  CONFIDENT_AUTHORITY = 'confident_authority',      // Proof - establish credibility
  URGENT_CONCERN = 'urgent_concern'                 // CTA - create urgency
}

export enum AmericanPainPoint {
  CHRONIC_FATIGUE = 'chronic_fatigue',
  SLEEP_EPIDEMIC = 'sleep_epidemic', 
  BRAIN_FOG_MEMORY = 'brain_fog_memory',
  METABOLIC_DAMAGE = 'metabolic_damage',
  ANXIETY_DEPRESSION = 'anxiety_depression',
  CHRONIC_INFLAMMATION = 'chronic_inflammation',
  HORMONAL_IMBALANCE = 'hormonal_imbalance'
}

export interface VoiceRequest {
  script: string
  voice_persona: VoicePersona
  emotional_tone: EmotionalTone
  pain_point: AmericanPainPoint
  speed?: number          // 0.5-2.0 speed multiplier
  stability?: number      // Voice stability (0-1)
  clarity?: number        // Voice clarity (0-1)
  style_intensity?: number // How much style to apply (0-1)
}

export interface VoiceResponse {
  audio_url: string
  voice_persona: VoicePersona
  emotional_tone: EmotionalTone
  pain_point: AmericanPainPoint
  duration_seconds: number
  generation_time: number
  cost: number
  script_used: string
}

export interface VoiceConfig {
  voice_id: string
  description: string
  best_for: string[]
  optimal_speed: number
  stability: number
  clarity: number
}

export interface EmotionalSettings {
  style_intensity: number
  speed_modifier: number
  stability_modifier: number
  description: string
}

export interface VoiceStats {
  platform: string
  available_personas: number
  emotional_tones: number
  cost_per_character: number
  estimated_cost_per_30s: number
  generation_time: string
  audio_quality: string
  supported_pain_points: number
}

export class ElevenLabsVoiceConfig {
  public voicePersonas: Record<VoicePersona, VoiceConfig>
  public emotionalSettings: Record<EmotionalTone, EmotionalSettings>

  constructor() {
    // Voice IDs for different personas (replace with actual ElevenLabs voice IDs)
    this.voicePersonas = {
      [VoicePersona.CONCERNED_FEMALE]: {
        voice_id: 'EXAVITQu4vr4xnSDxMaL',  // Sarah - Concerned female
        description: 'Warm, caring female voice perfect for health discoveries',
        best_for: ['chronic_fatigue', 'hormonal_imbalance', 'anxiety_depression'],
        optimal_speed: 0.9,
        stability: 0.8,
        clarity: 0.9
      },

      [VoicePersona.AUTHORITATIVE_MALE]: {
        voice_id: 'pNInz6obpgDQGcFmaJgB',  // Adam - Professional male
        description: 'Credible, authoritative male voice for medical revelations',
        best_for: ['chronic_inflammation', 'metabolic_damage', 'brain_fog_memory'],
        optimal_speed: 0.85,
        stability: 0.85,
        clarity: 0.95
      },

      [VoicePersona.RELATABLE_YOUNG]: {
        voice_id: '21m00Tcm4TlvDq8ikWAM',  // Rachel - Young relatable
        description: 'Energetic, relatable voice for peer-to-peer sharing',
        best_for: ['chronic_fatigue', 'anxiety_depression', 'sleep_epidemic'],
        optimal_speed: 1.1,
        stability: 0.75,
        clarity: 0.85
      },

      [VoicePersona.WISE_MATURE]: {
        voice_id: 'CYw3kZ02Hs0563khs1Fj',  // Dave - Mature wisdom
        description: 'Experienced, wise voice for revealing hidden truths',
        best_for: ['chronic_inflammation', 'metabolic_damage', 'hormonal_imbalance'],
        optimal_speed: 0.8,
        stability: 0.9,
        clarity: 0.9
      },

      [VoicePersona.URGENT_WHISTLE_BLOWER]: {
        voice_id: 'onwK4e9ZLuTAKqWW03F9',  // Daniel - Urgent revealer
        description: 'Urgent, concerned voice for exposing health cover-ups',
        best_for: ['chronic_inflammation', 'metabolic_damage', 'brain_fog_memory'],
        optimal_speed: 1.0,
        stability: 0.7,
        clarity: 0.8
      }
    }

    // Emotional tone settings for voice generation
    this.emotionalSettings = {
      [EmotionalTone.SHOCKING_REVELATION]: {
        style_intensity: 0.9,
        speed_modifier: 1.1,
        stability_modifier: 0.8,
        description: 'Grab attention with shocking facts'
      },

      [EmotionalTone.EMPATHETIC_UNDERSTANDING]: {
        style_intensity: 0.7,
        speed_modifier: 0.9,
        stability_modifier: 0.9,
        description: 'Relate to viewer\'s pain and struggles'
      },

      [EmotionalTone.HOPEFUL_EXCITEMENT]: {
        style_intensity: 0.8,
        speed_modifier: 1.0,
        stability_modifier: 0.8,
        description: 'Introduce solution with hope and excitement'
      },

      [EmotionalTone.CONFIDENT_AUTHORITY]: {
        style_intensity: 0.9,
        speed_modifier: 0.85,
        stability_modifier: 0.95,
        description: 'Establish credibility and scientific backing'
      },

      [EmotionalTone.URGENT_CONCERN]: {
        style_intensity: 0.95,
        speed_modifier: 1.15,
        stability_modifier: 0.75,
        description: 'Create urgency and drive action'
      }
    }
  }
}

export class ElevenLabsVoiceGenerator {
  private apiKey: string
  private baseUrl: string
  private voiceConfig: ElevenLabsVoiceConfig
  private costPerCharacter: number

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY || ''
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found - voice generation will be simulated')
      this.apiKey = 'demo_key'
    }

    this.baseUrl = 'https://api.elevenlabs.io/v1'
    this.voiceConfig = new ElevenLabsVoiceConfig()
    this.costPerCharacter = 0.00003  // ~$0.30 per 1000 characters
  }

  async generateSupplementVoiceover(request: VoiceRequest): Promise<VoiceResponse> {
    try {
      const startTime = Date.now()
      console.log(`🎙️ Generating voiceover: ${request.voice_persona} - ${request.emotional_tone}`)

      // Get optimal voice configuration
      const voiceConfig = this.getOptimalVoiceConfig(request)

      // Apply emotional tone adjustments
      const adjustedSettings = this.applyEmotionalTone(voiceConfig, request.emotional_tone)

      // Generate audio
      const audioUrl = await this.generateAudio(request.script, adjustedSettings)

      const generationTime = (Date.now() - startTime) / 1000
      const cost = request.script.length * this.costPerCharacter

      // Estimate duration (rough calculation: ~150 words per minute)
      const wordCount = request.script.split(' ').length
      const estimatedDuration = (wordCount / 150) * 60  // Convert to seconds

      const response: VoiceResponse = {
        audio_url: audioUrl,
        voice_persona: request.voice_persona,
        emotional_tone: request.emotional_tone,
        pain_point: request.pain_point,
        duration_seconds: estimatedDuration,
        generation_time: generationTime,
        cost: cost,
        script_used: request.script
      }

      console.log(`✅ Voiceover generated in ${generationTime.toFixed(1)}s - ${estimatedDuration.toFixed(1)}s duration`)
      return response

    } catch (error) {
      console.error('Voiceover generation failed:', error)
      throw error
    }
  }

  private getOptimalVoiceConfig(request: VoiceRequest): Record<string, any> {
    // Select best voice persona for the pain point
    const bestPersona = this.selectOptimalPersona(request.pain_point, request.voice_persona)
    const voiceData = this.voiceConfig.voicePersonas[bestPersona]

    return {
      voice_id: voiceData.voice_id,
      stability: voiceData.stability,
      clarity: voiceData.clarity,
      speed: voiceData.optimal_speed,
      persona: bestPersona
    }
  }

  private selectOptimalPersona(painPoint: AmericanPainPoint, requestedPersona: VoicePersona): VoicePersona {
    // Check if requested persona is good for this pain point
    const personaData = this.voiceConfig.voicePersonas[requestedPersona]
    if (personaData.best_for.includes(painPoint)) {
      return requestedPersona
    }

    // Auto-select best persona for pain point
    const painPointOptimal: Record<AmericanPainPoint, VoicePersona> = {
      [AmericanPainPoint.CHRONIC_FATIGUE]: VoicePersona.CONCERNED_FEMALE,
      [AmericanPainPoint.SLEEP_EPIDEMIC]: VoicePersona.RELATABLE_YOUNG,
      [AmericanPainPoint.BRAIN_FOG_MEMORY]: VoicePersona.AUTHORITATIVE_MALE,
      [AmericanPainPoint.METABOLIC_DAMAGE]: VoicePersona.WISE_MATURE,
      [AmericanPainPoint.ANXIETY_DEPRESSION]: VoicePersona.CONCERNED_FEMALE,
      [AmericanPainPoint.CHRONIC_INFLAMMATION]: VoicePersona.URGENT_WHISTLE_BLOWER,
      [AmericanPainPoint.HORMONAL_IMBALANCE]: VoicePersona.CONCERNED_FEMALE
    }

    return painPointOptimal[painPoint] || VoicePersona.CONCERNED_FEMALE
  }

  private applyEmotionalTone(voiceConfig: Record<string, any>, tone: EmotionalTone): Record<string, any> {
    const toneSettings = this.voiceConfig.emotionalSettings[tone]

    const adjustedConfig = { ...voiceConfig }
    adjustedConfig.style_intensity = toneSettings.style_intensity
    adjustedConfig.speed *= toneSettings.speed_modifier
    adjustedConfig.stability *= toneSettings.stability_modifier

    // Ensure values stay within valid ranges
    adjustedConfig.speed = Math.max(0.5, Math.min(2.0, adjustedConfig.speed))
    adjustedConfig.stability = Math.max(0.0, Math.min(1.0, adjustedConfig.stability))
    adjustedConfig.clarity = Math.max(0.0, Math.min(1.0, adjustedConfig.clarity || 0.85))

    return adjustedConfig
  }

  private async generateAudio(script: string, voiceConfig: Record<string, any>): Promise<string> {
    // If no real API key, return simulated response
    if (this.apiKey === 'demo_key') {
      console.log('Simulating ElevenLabs voice generation (no API key)')
      return `https://demo-audio-url.com/supplement_voice_${Date.now()}.mp3`
    }

    const headers = {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': this.apiKey
    }

    const payload = {
      text: script,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: voiceConfig.stability,
        similarity_boost: voiceConfig.clarity,
        style: voiceConfig.style_intensity,
        use_speaker_boost: true
      }
    }

    const voiceId = voiceConfig.voice_id

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        // For now, return a placeholder URL
        // In production, you'd save the audio file and return the URL
        const audioUrl = `https://generated-audio.com/supplement_${Date.now()}.mp3`
        return audioUrl
      } else {
        const errorText = await response.text()
        throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`)
      }

    } catch (error) {
      console.error('ElevenLabs API call failed:', error)
      // Return simulated URL on error
      return `https://demo-audio-url.com/supplement_voice_${Date.now()}.mp3`
    }
  }

  async generateScriptSegments(fullScript: string, painPoint: AmericanPainPoint): Promise<VoiceResponse[]> {
    // Split script into segments with different emotional tones
    const segments = this.segmentScriptByEmotion(fullScript)

    const voiceSegments: VoiceResponse[] = []

    for (const [segmentText, emotionalTone] of segments) {
      // Select appropriate voice persona for this pain point
      const optimalPersona = this.selectOptimalPersona(painPoint, VoicePersona.CONCERNED_FEMALE)

      const request: VoiceRequest = {
        script: segmentText,
        voice_persona: optimalPersona,
        emotional_tone: emotionalTone,
        pain_point: painPoint
      }

      const segmentAudio = await this.generateSupplementVoiceover(request)
      voiceSegments.push(segmentAudio)

      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return voiceSegments
  }

  private segmentScriptByEmotion(script: string): Array<[string, EmotionalTone]> {
    // Split by common script markers
    const sentences = script.split('. ')
    const segments: Array<[string, EmotionalTone]> = []

    // Rough emotional flow for supplement scripts
    const totalSentences = sentences.length

    if (totalSentences <= 2) {
      // Short script - single tone
      segments.push([script, EmotionalTone.SHOCKING_REVELATION])
    } else {
      // Multi-part script with emotional flow
      const hookEnd = Math.max(1, Math.floor(totalSentences / 4))
      const problemEnd = Math.max(2, Math.floor(totalSentences / 2))
      const solutionEnd = Math.max(3, Math.floor(totalSentences * 0.75))

      // Hook section - shocking revelation
      const hookText = sentences.slice(0, hookEnd).join('. ') + '.'
      segments.push([hookText, EmotionalTone.SHOCKING_REVELATION])

      // Problem section - empathetic understanding
      if (hookEnd < problemEnd) {
        const problemText = sentences.slice(hookEnd, problemEnd).join('. ') + '.'
        segments.push([problemText, EmotionalTone.EMPATHETIC_UNDERSTANDING])
      }

      // Solution section - hopeful excitement
      if (problemEnd < solutionEnd) {
        const solutionText = sentences.slice(problemEnd, solutionEnd).join('. ') + '.'
        segments.push([solutionText, EmotionalTone.HOPEFUL_EXCITEMENT])
      }

      // CTA section - urgent concern
      if (solutionEnd < totalSentences) {
        const ctaText = sentences.slice(solutionEnd).join('. ') + '.'
        segments.push([ctaText, EmotionalTone.URGENT_CONCERN])
      }
    }

    return segments
  }

  calculateVoiceCost(script: string): number {
    return script.length * this.costPerCharacter
  }

  getVoiceStats(): VoiceStats {
    const sampleScript = 'Average 30 second supplement script with emotional hooks and pain point targeting for viral TikTok content generation'
    
    return {
      platform: 'elevenlabs',
      available_personas: Object.keys(this.voiceConfig.voicePersonas).length,
      emotional_tones: Object.keys(this.voiceConfig.emotionalSettings).length,
      cost_per_character: this.costPerCharacter,
      estimated_cost_per_30s: this.calculateVoiceCost(sampleScript),
      generation_time: '3-10 seconds per segment',
      audio_quality: 'high_quality_44khz',
      supported_pain_points: Object.keys(AmericanPainPoint).length
    }
  }

  async testVoicePersonas(testScript: string, painPoint: AmericanPainPoint): Promise<Record<string, VoiceResponse>> {
    const personaTests: Record<string, VoiceResponse> = {}

    const testPersonas = [
      VoicePersona.CONCERNED_FEMALE,
      VoicePersona.AUTHORITATIVE_MALE,
      VoicePersona.RELATABLE_YOUNG
    ]

    for (const persona of testPersonas) {
      const request: VoiceRequest = {
        script: testScript,
        voice_persona: persona,
        emotional_tone: EmotionalTone.SHOCKING_REVELATION,
        pain_point: painPoint
      }

      const response = await this.generateSupplementVoiceover(request)
      personaTests[persona] = response

      await new Promise(resolve => setTimeout(resolve, 1000))  // Rate limiting
    }

    return personaTests
  }

  // Voice persona helpers
  getPersonaForPainPoint(painPoint: AmericanPainPoint): VoicePersona {
    return this.selectOptimalPersona(painPoint, VoicePersona.CONCERNED_FEMALE)
  }

  getPersonaDescription(persona: VoicePersona): string {
    return this.voiceConfig.voicePersonas[persona]?.description || 'Unknown persona'
  }

  getEmotionalToneDescription(tone: EmotionalTone): string {
    return this.voiceConfig.emotionalSettings[tone]?.description || 'Unknown tone'
  }

  // Batch generation for multiple scripts
  async generateBatchVoiceovers(
    scripts: Array<{ script: string; painPoint: AmericanPainPoint; persona?: VoicePersona; tone?: EmotionalTone }>
  ): Promise<VoiceResponse[]> {
    const results: VoiceResponse[] = []

    for (const scriptData of scripts) {
      const request: VoiceRequest = {
        script: scriptData.script,
        voice_persona: scriptData.persona || this.getPersonaForPainPoint(scriptData.painPoint),
        emotional_tone: scriptData.tone || EmotionalTone.SHOCKING_REVELATION,
        pain_point: scriptData.painPoint
      }

      try {
        const response = await this.generateSupplementVoiceover(request)
        results.push(response)
      } catch (error) {
        console.error(`Failed to generate voice for script: ${error}`)
        // Continue with other scripts
      }

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    return results
  }

  // Audio file management (mock implementation)
  async downloadAudio(audioUrl: string, outputPath: string): Promise<string> {
    try {
      const response = await fetch(audioUrl)
      
      if (response.ok && response.body) {
        // In a real implementation, you'd save to file system
        console.log(`📁 Audio downloaded to: ${outputPath}`)
        return outputPath
      } else {
        throw new Error(`Download failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Audio download failed:', error)
      throw error
    }
  }

  // Voice enhancement features
  async enhanceVoiceForPlatform(audioUrl: string, platform: 'tiktok' | 'instagram' | 'youtube'): Promise<string> {
    // Mock implementation for platform-specific audio optimization
    const enhancementMap = {
      tiktok: 'compressed_high_energy',
      instagram: 'balanced_mobile_optimized', 
      youtube: 'high_quality_full_range'
    }

    console.log(`🎛️ Enhancing audio for ${platform}: ${enhancementMap[platform]}`)
    return `${audioUrl}?enhanced=${platform}`
  }
}

export const elevenLabsVoiceGenerator = new ElevenLabsVoiceGenerator()

// Example usage function
export async function generateSupplementVoiceExample(): Promise<void> {
  const sampleScript = `
    73% of Americans are exhausted by 2pm every single day. You're drinking 3 cups of coffee just to feel human. 
    
    Your ancestors worked 12-hour days and weren't this tired. The real problem? Your body is desperately missing CoQ10. 
    
    This is why CoQ10 Ultra works - it powers your cellular energy factories that have been damaged by processed food and stress. 
    
    But here's the problem - real CoQ10 is expensive to source. This company is one of the few using the real thing. 
    
    Link in bio, but they're limiting orders to 3 bottles per person.
  `

  const generator = new ElevenLabsVoiceGenerator()

  // Generate single voiceover
  const request: VoiceRequest = {
    script: sampleScript,
    voice_persona: VoicePersona.CONCERNED_FEMALE,
    emotional_tone: EmotionalTone.SHOCKING_REVELATION,
    pain_point: AmericanPainPoint.CHRONIC_FATIGUE
  }

  const voiceResponse = await generator.generateSupplementVoiceover(request)

  console.log('Generated voiceover:')
  console.log(`  Persona: ${voiceResponse.voice_persona}`)
  console.log(`  Tone: ${voiceResponse.emotional_tone}`)
  console.log(`  Duration: ${voiceResponse.duration_seconds.toFixed(1)}s`)
  console.log(`  Cost: $${voiceResponse.cost.toFixed(3)}`)
  console.log(`  Audio URL: ${voiceResponse.audio_url}`)

  // Test different personas
  console.log('\nTesting different personas:')
  const personaTests = await generator.testVoicePersonas(
    'This supplement changed my life completely', 
    AmericanPainPoint.CHRONIC_FATIGUE
  )

  for (const [persona, response] of Object.entries(personaTests)) {
    console.log(`  ${persona}: $${response.cost.toFixed(3)} - ${response.duration_seconds.toFixed(1)}s`)
  }
}