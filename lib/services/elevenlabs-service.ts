// ElevenLabs Text-to-Speech Service
// Converts video scripts to natural-sounding audio

import { 
  ElevenLabsConfig, 
  VideoScript, 
  R2StorageFile, 
  UsageTracking, 
  APIResponse 
} from '../types/reddit-automation'

export class ElevenLabsService {
  private apiKey: string
  private baseUrl = 'https://api.elevenlabs.io/v1'
  private config: ElevenLabsConfig

  constructor(apiKey: string, config: ElevenLabsConfig) {
    this.apiKey = apiKey
    this.config = config
  }

  /**
   * Generate audio from video script
   */
  async generateAudio(script: VideoScript): Promise<APIResponse<R2StorageFile>> {
    const requestId = `elevenlabs_${Date.now()}`
    
    try {
      // Combine all script sections into one text
      const fullText = this.buildFullScript(script)
      
      // Check character count for cost estimation
      const characterCount = fullText.length
      const estimatedCost = this.calculateCost(characterCount)
      
      // Generate audio
      const audioResponse = await this.synthesizeSpeech(fullText)
      
      if (!audioResponse.ok) {
        throw new Error(`ElevenLabs API error: ${audioResponse.status} ${audioResponse.statusText}`)
      }

      // Get audio blob
      const audioBlob = await audioResponse.blob()
      
      // Upload to R2 storage
      const filename = `audio/script_${requestId}.mp3`
      const uploadResponse = await this.uploadAudioToR2(audioBlob, filename)
      
      if (!uploadResponse.success) {
        throw new Error('Failed to upload audio to R2')
      }

      // Log usage
      const usageStats: UsageTracking = {
        date: new Date().toISOString().split('T')[0],
        service: 'elevenlabs',
        operation: 'text_to_speech',
        charactersUsed: characterCount,
        apiCalls: 1,
        costUSD: estimatedCost,
        requestId,
        status: 'success'
      }

      await this.logUsage(usageStats)

      return {
        success: true,
        data: uploadResponse.data!,
        requestId,
        timestamp: new Date().toISOString(),
        usageStats
      }
    } catch (error) {
      // Log failed usage
      const failureStats: UsageTracking = {
        date: new Date().toISOString().split('T')[0],
        service: 'elevenlabs',
        operation: 'text_to_speech',
        apiCalls: 1,
        costUSD: 0,
        requestId,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
      
      await this.logUsage(failureStats)

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Audio generation failed',
        errorCode: 'ELEVENLABS_GENERATION_FAILED',
        requestId,
        timestamp: new Date().toISOString(),
        usageStats: failureStats
      }
    }
  }

  /**
   * Build full script text with proper pacing and pauses
   */
  private buildFullScript(script: VideoScript): string {
    const sections = []
    
    // Hook (with emphasis)
    sections.push(script.hook)
    sections.push('...') // Short pause
    
    // Introduction
    sections.push(script.introduction)
    sections.push('......') // Medium pause
    
    // Main content sections with pauses
    script.mainContent.forEach((content, index) => {
      sections.push(content)
      if (index < script.mainContent.length - 1) {
        sections.push('...') // Short pause between sections
      }
    })
    
    sections.push('......') // Medium pause before conclusion
    
    // Conclusion
    sections.push(script.conclusion)
    sections.push('...') // Short pause
    
    // Call to action (with emphasis)
    sections.push(script.callToAction)
    
    return sections.join(' ')
  }

  /**
   * Synthesize speech using ElevenLabs API
   */
  private async synthesizeSpeech(text: string): Promise<Response> {
    const url = `${this.baseUrl}/text-to-speech/${this.config.voiceId}`
    
    const requestBody = {
      text: text,
      model_id: this.config.modelId,
      voice_settings: {
        stability: this.config.stability,
        similarity_boost: this.config.similarityBoost,
        style: this.config.style,
        use_speaker_boost: this.config.useSpeakerBoost
      }
    }

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify(requestBody)
    })
  }

  /**
   * Upload generated audio to R2 storage
   * NOTE: Phase 1 implementation - API routes in Phase 2
   */
  private async uploadAudioToR2(
    audioBlob: Blob, 
    filename: string
  ): Promise<APIResponse<R2StorageFile>> {
    try {
      // Phase 1: Create mock response for testing
      const mockUrl = URL.createObjectURL(audioBlob)
      
      const r2File: R2StorageFile = {
        key: filename,
        url: mockUrl,
        bucket: 'mock-bucket',
        size: audioBlob.size,
        contentType: 'audio/mpeg',
        uploadedAt: new Date().toISOString()
      }

      // Store reference locally for Phase 1
      if (typeof window !== 'undefined') {
        const audioFiles = JSON.parse(localStorage.getItem('audio_files') || '[]')
        audioFiles.push(r2File)
        localStorage.setItem('audio_files', JSON.stringify(audioFiles))
      }

      return {
        success: true,
        data: r2File,
        requestId: `r2_upload_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Audio upload failed',
        errorCode: 'AUDIO_UPLOAD_FAILED',
        requestId: `r2_upload_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Calculate cost based on character count
   */
  private calculateCost(characterCount: number): number {
    // ElevenLabs pricing: roughly $0.0002 per character for standard voices
    return characterCount * 0.0002
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<APIResponse<any[]>> {
    const requestId = `elevenlabs_voices_${Date.now()}`
    
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs voices error: ${response.status}`)
      }

      const data = await response.json()

      return {
        success: true,
        data: data.voices || [],
        requestId,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get voices',
        errorCode: 'ELEVENLABS_VOICES_FAILED',
        requestId,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Get voice details
   */
  async getVoiceDetails(voiceId: string): Promise<APIResponse<any>> {
    const requestId = `elevenlabs_voice_details_${Date.now()}`
    
    try {
      const response = await fetch(`${this.baseUrl}/voices/${voiceId}`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs voice details error: ${response.status}`)
      }

      const data = await response.json()

      return {
        success: true,
        data: data,
        requestId,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get voice details',
        errorCode: 'ELEVENLABS_VOICE_DETAILS_FAILED',
        requestId,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Get current usage/quota information
   */
  async getUsageInfo(): Promise<APIResponse<{
    characterCount: number
    characterLimit: number
    canMakeRequest: boolean
    resetDate: string
  }>> {
    const requestId = `elevenlabs_usage_${Date.now()}`
    
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs usage error: ${response.status}`)
      }

      const data = await response.json()

      return {
        success: true,
        data: {
          characterCount: data.subscription?.character_count || 0,
          characterLimit: data.subscription?.character_limit || 10000,
          canMakeRequest: (data.subscription?.character_count || 0) < (data.subscription?.character_limit || 10000),
          resetDate: data.subscription?.next_character_count_reset_unix 
            ? new Date(data.subscription.next_character_count_reset_unix * 1000).toISOString()
            : new Date().toISOString()
        },
        requestId,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get usage info',
        errorCode: 'ELEVENLABS_USAGE_FAILED',
        requestId,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Log usage to local storage (Phase 1 implementation)
   */
  private async logUsage(stats: UsageTracking): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const existingLogs = JSON.parse(localStorage.getItem('elevenlabs_usage_logs') || '[]')
        existingLogs.push(stats)
        localStorage.setItem('elevenlabs_usage_logs', JSON.stringify(existingLogs))
      } else {
        console.log('ElevenLabs usage:', stats)
      }
    } catch (error) {
      console.error('Error logging ElevenLabs usage:', error)
    }
  }

  /**
   * Test ElevenLabs API connection
   */
  async testConnection(): Promise<APIResponse<boolean>> {
    const requestId = `elevenlabs_test_${Date.now()}`
    
    try {
      // Test with voices endpoint as it's lightweight
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      })

      return {
        success: response.ok,
        data: response.ok,
        requestId,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        data: false,
        error: error instanceof Error ? error.message : 'ElevenLabs connection failed',
        errorCode: 'ELEVENLABS_CONNECTION_FAILED',
        requestId,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Get recommended voice settings for different content types
   */
  getRecommendedSettings(contentType: 'educational' | 'entertainment' | 'commentary' | 'storytime'): Partial<ElevenLabsConfig> {
    const settings = {
      educational: {
        stability: 0.75,
        similarityBoost: 0.65,
        style: 0.2,
        useSpeakerBoost: true
      },
      entertainment: {
        stability: 0.65,
        similarityBoost: 0.7,
        style: 0.4,
        useSpeakerBoost: true
      },
      commentary: {
        stability: 0.7,
        similarityBoost: 0.75,
        style: 0.3,
        useSpeakerBoost: true
      },
      storytime: {
        stability: 0.6,
        similarityBoost: 0.8,
        style: 0.5,
        useSpeakerBoost: true
      }
    }

    return settings[contentType]
  }
}