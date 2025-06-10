/**
 * HeyGen API Integration for Human Avatar Video Generation
 * Multi-tier content strategy with human avatars for high-trust content
 */

export interface HeyGenConfig {
  api_key: string
  base_url?: string
  avatar_id: string
  voice_id: string
  background_color?: string
}

export interface HeyGenVideoRequest {
  script: string
  avatar_id: string
  voice_id: string
  background_color: string
  aspect_ratio?: string // Default: "9:16" (TikTok vertical)
  video_quality?: string // Default: "high"
  emotional_tone?: string // Default: "authoritative"
}

export interface HeyGenVideoResponse {
  video_id: string
  status: string
  video_url?: string
  thumbnail_url?: string
  duration?: number
  processing_time?: number
  credits_used?: number
}

export interface ContentTierStats {
  heygen_videos_this_month: number
  heygen_monthly_limit: number
  remaining_heygen_videos: number
  target_heygen_ratio: number
  recommended_tier: 'heygen' | 'image_montage'
}

export interface ContentData {
  topic: string
  category: string
  type: string
  suppressed_fact: string
  personal_impact: string
  evidence: string
  emotional_tone: string
  priority: string
  background_color?: string
  false_belief?: string
  real_fact?: string
  modern_problem?: string
  programmed_behavior?: string
  programming_source?: string
}

export interface ProductData {
  name: string
  category?: string
  description?: string
}

export interface ScriptData {
  product: ProductData
  script: string | { full_script: string }
}

export interface AvatarConfig {
  avatar_id: string
  voice_id: string
  description: string
  best_for: string[]
}

export class ContentTierManager {
  private heygenMonthlyLimit: number = 10 // Free tier limit
  private heygenUsedThisMonth: number = 0
  private tierRatioTarget: number = 0.25 // 25% HeyGen, 75% Image Montage

  shouldUseHeygen(topicCategory: string, contentPriority: string): boolean {
    // High-priority topics that require human trust
    const heygenPriorityTopics = [
      'personal_health_revelations',
      'medical_establishment_lies',
      'psychological_manipulation',
      'government_experiments_on_citizens',
      'suppressed_science_personal_impact'
    ]

    // Check monthly limits
    if (this.heygenUsedThisMonth >= this.heygenMonthlyLimit) {
      return false
    }

    // Check if topic requires human delivery
    if (heygenPriorityTopics.includes(topicCategory)) {
      return true
    }

    // Check if we're under target ratio
    const totalVideosThisMonth = this.tierRatioTarget > 0 ? this.heygenUsedThisMonth / this.tierRatioTarget : 0
    if (this.heygenUsedThisMonth < (totalVideosThisMonth * this.tierRatioTarget)) {
      return true
    }

    return false
  }

  incrementUsage(): void {
    this.heygenUsedThisMonth += 1
  }

  getStats(): ContentTierStats {
    return {
      heygen_videos_this_month: this.heygenUsedThisMonth,
      heygen_monthly_limit: this.heygenMonthlyLimit,
      remaining_heygen_videos: Math.max(0, this.heygenMonthlyLimit - this.heygenUsedThisMonth),
      target_heygen_ratio: this.tierRatioTarget,
      recommended_tier: this.heygenUsedThisMonth < this.heygenMonthlyLimit ? 'heygen' : 'image_montage'
    }
  }
}

export class HeyGenIntegration {
  private apiKey: string
  private baseUrl: string
  private tierManager: ContentTierManager
  private avatarConfigs: Record<string, AvatarConfig>
  private scriptTemplates: Record<string, Record<string, string>>

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.HEYGEN_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('HeyGen API key is required')
    }

    this.baseUrl = 'https://api.heygen.com/v2'
    this.tierManager = new ContentTierManager()

    // Avatar configurations for different product demographics
    this.avatarConfigs = {
      female_25_35_beauty_enthusiast: {
        avatar_id: 'monica_medieval_A',
        voice_id: 'default_voice_1',
        description: 'Young female for beauty/lifestyle products',
        best_for: ['beauty', 'skincare', 'fashion', 'lifestyle']
      },
      male_25_35_tech_reviewer: {
        avatar_id: 'josh_lite_20230714',
        voice_id: 'default_voice_2',
        description: 'Professional male for tech/gadget reviews',
        best_for: ['tech', 'gadgets', 'electronics', 'automotive']
      },
      female_30_45_home_organizer: {
        avatar_id: 'susan_text_3_20231225',
        voice_id: 'default_voice_3',
        description: 'Mature female for home/kitchen products',
        best_for: ['home', 'kitchen', 'organization', 'parenting']
      },
      neutral_25_35_general: {
        avatar_id: 'wayne_20240711',
        voice_id: 'default_voice_4',
        description: 'Neutral presenter for general products',
        best_for: ['fitness', 'health', 'general', 'business']
      },
      authoritative_male: {
        avatar_id: 'daniel_authoritative_20240301',
        voice_id: 'authoritative_voice_1',
        description: 'Authoritative male for serious content',
        best_for: ['government', 'science', 'medical', 'authority']
      },
      expert_neutral: {
        avatar_id: 'alex_expert_20240301',
        voice_id: 'expert_voice_1',
        description: 'Expert neutral for educational content',
        best_for: ['education', 'psychology', 'research', 'analysis']
      },
      concerned_female: {
        avatar_id: 'sarah_concerned_20240301',
        voice_id: 'concerned_voice_1',
        description: 'Concerned female for health topics',
        best_for: ['health', 'nutrition', 'wellness', 'personal']
      }
    }

    // Script templates for different revelation types
    this.scriptTemplates = {
      suppressed_science: {
        hook: 'You were never supposed to know this...',
        revelation: '{scientific_fact}',
        personal_impact: 'This affects you because {personal_connection}',
        authority: 'Declassified documents prove {evidence}',
        cta: 'Follow for more suppressed truths they don\'t want you to know'
      },
      medical_establishment: {
        hook: 'Your doctor won\'t tell you this...',
        revelation: '{medical_lie}',
        personal_impact: 'You\'ve been told {false_belief} but the truth is {real_fact}',
        authority: 'Internal documents show {evidence}',
        cta: 'Follow to expose more medical lies'
      },
      government_experiments: {
        hook: 'The government did this to unwitting Americans...',
        revelation: '{experiment_description}',
        personal_impact: 'This explains why {modern_problem}',
        authority: 'Declassified files prove {evidence}',
        cta: 'Follow for more government secrets'
      },
      psychological_manipulation: {
        hook: 'They\'ve been controlling your mind...',
        revelation: '{manipulation_technique}',
        personal_impact: 'You do {behavior} because of {programmed_response}',
        authority: 'Research documents show {evidence}',
        cta: 'Follow to break free from mental manipulation'
      }
    }
  }

  async createProductVideo(scriptData: ScriptData, avatarType?: string): Promise<HeyGenVideoResponse> {
    try {
      const product = scriptData.product
      const script = scriptData.script

      console.log(`🎥 Creating HeyGen video for product: ${product.name || 'Unknown'}`)

      // Auto-select avatar if not specified
      if (!avatarType) {
        avatarType = this.selectAvatarForProduct(product)
      }

      // Get avatar configuration
      const avatarConfig = this.avatarConfigs[avatarType] || this.avatarConfigs.neutral_25_35_general

      // Extract script text
      const scriptText = typeof script === 'object' && script.full_script ? script.full_script : String(script)

      // Create video request
      const videoRequest: HeyGenVideoRequest = {
        script: scriptText,
        avatar_id: avatarConfig.avatar_id,
        voice_id: avatarConfig.voice_id,
        background_color: '#FFFFFF',
        aspect_ratio: '9:16', // TikTok format
        video_quality: 'high',
        emotional_tone: 'Excited'
      }

      // Submit to HeyGen API
      const response = await this.submitVideoGeneration(videoRequest)

      console.log(`✅ HeyGen video created: ${response.video_id}`)
      return response

    } catch (error) {
      console.error('Product video creation failed:', error)
      throw error
    }
  }

  selectAvatarForProduct(product: ProductData): string {
    const name = product.name?.toLowerCase() || ''

    // Beauty/skincare products
    if (['beauty', 'skincare', 'makeup', 'serum', 'cream', 'mask'].some(word => name.includes(word))) {
      return 'female_25_35_beauty_enthusiast'
    }

    // Tech/gadget products
    if (['tech', 'phone', 'gadget', 'electronic', 'smart', 'wireless'].some(word => name.includes(word))) {
      return 'male_25_35_tech_reviewer'
    }

    // Home/kitchen products
    if (['kitchen', 'home', 'cooking', 'organization', 'storage'].some(word => name.includes(word))) {
      return 'female_30_45_home_organizer'
    }

    // Default to neutral
    return 'neutral_25_35_general'
  }

  async createHumanAvatarVideo(contentData: ContentData): Promise<HeyGenVideoResponse> {
    try {
      console.log(`🎥 Creating HeyGen video for topic: ${contentData.topic}`)

      // Check if we should use HeyGen for this content
      const shouldUseHeygen = this.tierManager.shouldUseHeygen(
        contentData.category,
        contentData.priority
      )

      if (!shouldUseHeygen) {
        throw new Error('Content tier manager suggests using image montage instead')
      }

      // Select optimal avatar for content type
      const avatarConfig = await this.selectOptimalAvatar(contentData)

      // Generate script using content strategy
      const script = await this.generateAuthorityScript(contentData, avatarConfig)

      // Create video request
      const videoRequest: HeyGenVideoRequest = {
        script: script,
        avatar_id: avatarConfig.avatar_id,
        voice_id: avatarConfig.voice_id,
        background_color: contentData.background_color || '#FFFFFF',
        aspect_ratio: '9:16',
        video_quality: 'high',
        emotional_tone: contentData.emotional_tone || 'authoritative'
      }

      // Submit to HeyGen API
      const response = await this.submitVideoGeneration(videoRequest)

      // Track usage
      this.tierManager.incrementUsage()

      console.log(`✅ HeyGen video created: ${response.video_id}`)
      return response

    } catch (error) {
      console.error('HeyGen video creation failed:', error)
      throw error
    }
  }

  private async selectOptimalAvatar(contentData: ContentData): Promise<AvatarConfig> {
    const contentCategory = contentData.category.toLowerCase()
    const emotionalTone = contentData.emotional_tone || 'authoritative'

    // Map content categories to avatar types
    if (['government_coverups', 'suppressed_science', 'mkultra'].includes(contentCategory)) {
      if (['authoritative', 'serious'].includes(emotionalTone)) {
        return this.avatarConfigs.authoritative_male
      } else {
        return this.avatarConfigs.expert_neutral
      }
    } else if (['personal_health', 'medical_lies', 'nutrition'].includes(contentCategory)) {
      if (['concerned', 'empathetic'].includes(emotionalTone)) {
        return this.avatarConfigs.concerned_female
      } else {
        return this.avatarConfigs.authoritative_male
      }
    } else if (['psychological_manipulation', 'behavior_control'].includes(contentCategory)) {
      return this.avatarConfigs.expert_neutral
    } else {
      // Default to authoritative male for general content
      return this.avatarConfigs.authoritative_male
    }
  }

  private async generateAuthorityScript(contentData: ContentData, avatarConfig: AvatarConfig): Promise<string> {
    const contentType = contentData.type || 'suppressed_science'
    const template = this.scriptTemplates[contentType] || this.scriptTemplates.suppressed_science

    // Extract content elements
    const topic = contentData.topic || ''
    const fact = contentData.suppressed_fact || ''
    const personalImpact = contentData.personal_impact || ''
    const evidence = contentData.evidence || ''

    // Build script from template
    const scriptParts: string[] = []

    // Hook - grab attention immediately
    scriptParts.push(template.hook)

    // Revelation - the suppressed fact
    const revelation = template.revelation
      .replace('{scientific_fact}', fact)
      .replace('{medical_lie}', fact)
      .replace('{experiment_description}', fact)
      .replace('{manipulation_technique}', fact)
    scriptParts.push(revelation)

    // Personal impact - why this matters to viewer
    if (personalImpact) {
      const impactText = template.personal_impact
        .replace('{personal_connection}', personalImpact)
        .replace('{false_belief}', contentData.false_belief || '')
        .replace('{real_fact}', fact)
        .replace('{modern_problem}', contentData.modern_problem || '')
        .replace('{behavior}', contentData.programmed_behavior || '')
        .replace('{programmed_response}', contentData.programming_source || '')
      scriptParts.push(impactText)
    }

    // Authority/evidence - prove credibility
    if (evidence) {
      const authorityText = template.authority.replace('{evidence}', evidence)
      scriptParts.push(authorityText)
    }

    // Call to action
    scriptParts.push(template.cta)

    // Combine with natural pauses for human delivery
    let fullScript = scriptParts.join(' ... ')

    // Optimize script length for TikTok (aim for 15-30 seconds spoken)
    const wordCount = fullScript.split(' ').length
    if (wordCount > 75) { // ~30 seconds at normal pace
      fullScript = await this.condenseScript(fullScript, 75)
    }

    return fullScript
  }

  private async condenseScript(script: string, maxWords: number): Promise<string> {
    const words = script.split(' ')
    if (words.length <= maxWords) {
      return script
    }

    // Keep hook, main fact, and CTA - compress middle
    const scriptParts = script.split(' ... ')
    if (scriptParts.length >= 3) {
      // Keep first (hook) and last (CTA), condense middle
      const condensedMiddle: string[] = []
      for (const part of scriptParts.slice(1, -1)) {
        if (part.split(' ').length > 15) {
          // Compress this part
          const partWords = part.split(' ')
          const condensedPart = partWords.slice(0, 12).join(' ') + '...'
          condensedMiddle.push(condensedPart)
        } else {
          condensedMiddle.push(part)
        }
      }

      return [scriptParts[0], ...condensedMiddle, scriptParts[scriptParts.length - 1]].join(' ... ')
    }

    // Fallback: just truncate
    return words.slice(0, maxWords).join(' ') + '...'
  }

  private async submitVideoGeneration(request: HeyGenVideoRequest): Promise<HeyGenVideoResponse> {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'X-API-Version': 'v2'
    }

    const payload = {
      video_inputs: [{
        character: {
          type: 'avatar',
          avatar_id: request.avatar_id,
          avatar_style: 'normal'
        },
        voice: {
          type: 'text',
          input_text: request.script,
          voice_id: request.voice_id,
          speed: 1.0,
          emotion: request.emotional_tone
        },
        background: {
          type: 'color',
          value: request.background_color
        }
      }],
      aspect_ratio: request.aspect_ratio,
      video_quality: request.video_quality,
      callback_id: `tiktok_content_${Date.now()}`
    }

    try {
      const response = await fetch(`${this.baseUrl}/video/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        return {
          video_id: data.video_id || '',
          status: 'processing',
          processing_time: 0
        }
      } else {
        const errorText = await response.text()
        throw new Error(`HeyGen API error ${response.status}: ${errorText}`)
      }

    } catch (error) {
      console.error('HeyGen API request failed:', error)
      throw error
    }
  }

  async checkVideoStatus(videoId: string): Promise<HeyGenVideoResponse> {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'X-API-Version': 'v2'
    }

    try {
      const response = await fetch(`${this.baseUrl}/video/${videoId}`, {
        method: 'GET',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        return {
          video_id: videoId,
          status: data.status || 'unknown',
          video_url: data.video_url,
          thumbnail_url: data.thumbnail_url,
          duration: data.duration,
          credits_used: data.credits_used
        }
      } else {
        const errorText = await response.text()
        throw new Error(`Status check failed ${response.status}: ${errorText}`)
      }

    } catch (error) {
      console.error('Video status check failed:', error)
      throw error
    }
  }

  async waitForCompletion(videoId: string, maxWaitTime: number = 300): Promise<HeyGenVideoResponse> {
    const startTime = Date.now()

    while (Date.now() - startTime < maxWaitTime * 1000) {
      const statusResponse = await this.checkVideoStatus(videoId)

      if (statusResponse.status === 'completed') {
        console.log(`✅ Video ${videoId} completed successfully`)
        return statusResponse
      } else if (statusResponse.status === 'failed') {
        throw new Error(`Video generation failed for ${videoId}`)
      }

      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, 10000))
    }

    throw new Error(`Video generation timeout after ${maxWaitTime} seconds`)
  }

  async downloadVideo(videoUrl: string, outputPath: string): Promise<string> {
    try {
      const response = await fetch(videoUrl)
      
      if (response.ok && response.body) {
        const arrayBuffer = await response.arrayBuffer()
        
        // In a real implementation, you'd save to file system
        // For now, we'll return a mock path
        console.log(`📁 Video downloaded to: ${outputPath}`)
        return outputPath
      } else {
        throw new Error(`Download failed: ${response.status}`)
      }

    } catch (error) {
      console.error('Video download failed:', error)
      throw error
    }
  }

  getContentTierStats(): ContentTierStats {
    return this.tierManager.getStats()
  }

  // Mock avatar configurations (in production, these would be real HeyGen avatar IDs)
  getAvailableAvatars(): Record<string, AvatarConfig> {
    return this.avatarConfigs
  }

  // Content generation helper
  async generateContentExample(contentType: 'suppressed_science' | 'medical_establishment' | 'government_experiments'): Promise<ContentData> {
    const examples: Record<string, ContentData> = {
      suppressed_science: {
        topic: 'minnesota_starvation_experiment',
        category: 'suppressed_science',
        type: 'government_experiments',
        suppressed_fact: 'The government studied starvation psychology on 36 Americans for 40 years',
        personal_impact: 'this explains why diets fail and create food obsession',
        evidence: 'declassified University of Minnesota documents show the psychological damage',
        emotional_tone: 'authoritative',
        priority: 'high'
      },
      medical_establishment: {
        topic: 'bmi_astronomer_invention',
        category: 'medical_lies',
        type: 'medical_establishment',
        suppressed_fact: 'BMI was invented by an astronomer in 1830, not a doctor',
        personal_impact: 'you\'ve been shamed about your body using fake science',
        evidence: 'medical journals admit BMI was never validated for health',
        emotional_tone: 'concerned',
        priority: 'medium'
      },
      government_experiments: {
        topic: 'mkultra_lsd_experiments',
        category: 'government_coverups',
        type: 'government_experiments',
        suppressed_fact: 'CIA gave LSD to unwitting Americans in hospitals for 20 years',
        personal_impact: 'thousands suffered permanent psychological damage',
        evidence: 'Senate Church Committee hearings revealed the full scope',
        emotional_tone: 'serious',
        priority: 'high'
      }
    }

    return examples[contentType]
  }
}

export const heygenIntegration = new HeyGenIntegration()