// Shotstack Video Generation Service
// Creates 5-10 minute YouTube videos with voice narration

import { 
  ShotstackConfig, 
  VideoScript, 
  R2StorageFile, 
  UsageTracking, 
  APIResponse 
} from '../types/reddit-automation'

export class ShotstackService {
  private apiKey: string
  private baseUrl = 'https://api.shotstack.io/stage' // Use 'production' for live
  private stagingUrl = 'https://api.shotstack.io/stage'
  private productionUrl = 'https://api.shotstack.io/v1'

  constructor(apiKey: string, isProduction = false) {
    this.apiKey = apiKey
    this.baseUrl = isProduction ? this.productionUrl : this.stagingUrl
  }

  /**
   * Generate video from script and audio file
   */
  async generateVideo(
    script: VideoScript,
    audioFile: R2StorageFile,
    options: {
      background: 'gradient' | 'stock' | 'animated'
      resolution: '1080x1920' | '1920x1080' | '1280x720'
      style: 'modern' | 'minimal' | 'dynamic'
    }
  ): Promise<APIResponse<{ renderId: string; estimatedDuration: number }>> {
    const requestId = `shotstack_${Date.now()}`
    
    try {
      const timeline = this.buildVideoTimeline(script, audioFile, options)
      
      const renderRequest = {
        timeline,
        output: {
          format: 'mp4',
          resolution: options.resolution,
          fps: 30,
          quality: 'high'
        },
        merge: []
      }

      const response = await fetch(`${this.baseUrl}/render`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify(renderRequest)
      })

      if (!response.ok) {
        throw new Error(`Shotstack API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Log usage
      const usageStats: UsageTracking = {
        date: new Date().toISOString().split('T')[0],
        service: 'shotstack',
        operation: 'render_video',
        apiCalls: 1,
        costUSD: this.calculateRenderCost(script.estimatedDuration),
        requestId,
        status: 'success'
      }

      await this.logUsage(usageStats)

      return {
        success: true,
        data: {
          renderId: data.response.id,
          estimatedDuration: script.estimatedDuration
        },
        requestId,
        timestamp: new Date().toISOString(),
        usageStats
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video generation failed',
        errorCode: 'SHOTSTACK_RENDER_FAILED',
        requestId,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Check render status and get download URL when complete
   */
  async getRenderStatus(renderId: string): Promise<APIResponse<{
    status: 'queued' | 'fetching' | 'rendering' | 'saving' | 'done' | 'failed'
    progress: number
    downloadUrl?: string
    error?: string
  }>> {
    const requestId = `shotstack_status_${Date.now()}`
    
    try {
      const response = await fetch(`${this.baseUrl}/render/${renderId}`, {
        headers: {
          'x-api-key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`Shotstack status error: ${response.status}`)
      }

      const data = await response.json()
      const status = data.response.status
      const progress = data.response.progress || 0

      return {
        success: true,
        data: {
          status,
          progress,
          downloadUrl: status === 'done' ? data.response.url : undefined,
          error: status === 'failed' ? data.response.error : undefined
        },
        requestId,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Status check failed',
        errorCode: 'SHOTSTACK_STATUS_FAILED',
        requestId,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Build Shotstack timeline from script and audio
   */
  private buildVideoTimeline(
    script: VideoScript, 
    audioFile: R2StorageFile,
    options: any
  ): any {
    const totalDuration = script.estimatedDuration
    
    // Build text tracks for each script section
    const textTracks = this.buildTextTracks(script, totalDuration)
    
    // Build background track
    const backgroundTrack = this.buildBackgroundTrack(totalDuration, options)
    
    // Audio track
    const audioTrack = {
      clips: [{
        asset: {
          type: 'audio',
          src: audioFile.url
        },
        start: 0,
        length: totalDuration
      }]
    }

    return {
      background: '#000000',
      tracks: [
        audioTrack,      // Track 0: Audio
        backgroundTrack, // Track 1: Background
        ...textTracks    // Track 2+: Text overlays
      ]
    }
  }

  /**
   * Build text overlay tracks for script sections
   */
  private buildTextTracks(script: VideoScript, totalDuration: number): any[] {
    const tracks = []
    let currentTime = 0
    
    // Hook text (0-5 seconds)
    const hookDuration = 5
    tracks.push({
      clips: [{
        asset: {
          type: 'title',
          text: script.hook,
          style: 'modern',
          color: '#ffffff',
          size: 'large',
          background: 'transparent',
          position: 'center'
        },
        start: currentTime,
        length: hookDuration,
        effect: 'zoomIn',
        transition: {
          in: 'fade',
          out: 'fade'
        }
      }]
    })
    currentTime += hookDuration

    // Introduction text (5-30 seconds)
    const introDuration = 25
    tracks.push({
      clips: [{
        asset: {
          type: 'title',
          text: this.splitText(script.introduction, 40), // Wrap long text
          style: 'subtitle',
          color: '#ffffff',
          size: 'medium',
          background: 'rgba(0,0,0,0.5)',
          position: 'bottom'
        },
        start: currentTime,
        length: introDuration,
        transition: {
          in: 'slideUp',
          out: 'slideDown'
        }
      }]
    })
    currentTime += introDuration

    // Main content sections
    const remainingTime = totalDuration - currentTime - 40 // Leave 40s for conclusion + CTA
    const sectionDuration = remainingTime / script.mainContent.length

    script.mainContent.forEach((content, index) => {
      tracks.push({
        clips: [{
          asset: {
            type: 'title',
            text: this.splitText(content, 50),
            style: 'subtitle',
            color: '#ffffff',
            size: 'medium',
            background: 'rgba(0,0,0,0.3)',
            position: 'bottom'
          },
          start: currentTime,
          length: sectionDuration,
          transition: {
            in: 'fade',
            out: 'fade'
          }
        }]
      })
      currentTime += sectionDuration
    })

    // Conclusion (last 30 seconds)
    tracks.push({
      clips: [{
        asset: {
          type: 'title',
          text: this.splitText(script.conclusion, 40),
          style: 'modern',
          color: '#ffffff',
          size: 'large',
          background: 'rgba(0,0,0,0.6)',
          position: 'center'
        },
        start: currentTime,
        length: 30,
        transition: {
          in: 'slideUp',
          out: 'fade'
        }
      }]
    })

    // Call to action (last 10 seconds)
    tracks.push({
      clips: [{
        asset: {
          type: 'title',
          text: script.callToAction,
          style: 'modern',
          color: '#ffff00',
          size: 'large',
          background: 'rgba(255,0,0,0.8)',
          position: 'center'
        },
        start: totalDuration - 10,
        length: 10,
        effect: 'zoomIn',
        transition: {
          in: 'zoomIn',
          out: 'fade'
        }
      }]
    })

    return tracks
  }

  /**
   * Build background video/image track
   */
  private buildBackgroundTrack(duration: number, options: any): any {
    const clips = []
    
    switch (options.background) {
      case 'gradient':
        clips.push({
          asset: {
            type: 'video',
            src: 'https://templates.shotstack.io/basic/asset/video/gradient-loop.mp4'
          },
          start: 0,
          length: duration,
          effect: 'zoomInSlow'
        })
        break
        
      case 'animated':
        // Use multiple short clips for variety
        const clipDuration = 15
        const numClips = Math.ceil(duration / clipDuration)
        
        for (let i = 0; i < numClips; i++) {
          clips.push({
            asset: {
              type: 'video',
              src: `https://templates.shotstack.io/basic/asset/video/abstract-${(i % 3) + 1}.mp4`
            },
            start: i * clipDuration,
            length: Math.min(clipDuration, duration - (i * clipDuration)),
            effect: i % 2 === 0 ? 'zoomIn' : 'zoomOut'
          })
        }
        break
        
      default: // stock
        clips.push({
          asset: {
            type: 'image',
            src: 'https://templates.shotstack.io/basic/asset/image/gradient-blue.jpg'
          },
          start: 0,
          length: duration,
          effect: 'zoomInSlow'
        })
    }

    return { clips }
  }

  /**
   * Split long text into multiple lines
   */
  private splitText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    
    const words = text.split(' ')
    const lines = []
    let currentLine = ''
    
    for (const word of words) {
      if ((currentLine + ' ' + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word
      } else {
        if (currentLine) lines.push(currentLine)
        currentLine = word
      }
    }
    
    if (currentLine) lines.push(currentLine)
    
    return lines.join('\n')
  }

  /**
   * Calculate render cost based on duration
   */
  private calculateRenderCost(durationSeconds: number): number {
    // Shotstack pricing: roughly $0.05 per minute
    const minutes = Math.ceil(durationSeconds / 60)
    return minutes * 0.05
  }

  /**
   * Download completed video and store locally (Phase 1 implementation)
   */
  async downloadAndStoreVideo(
    downloadUrl: string, 
    filename: string
  ): Promise<APIResponse<R2StorageFile>> {
    const requestId = `shotstack_download_${Date.now()}`
    
    try {
      // Download video from Shotstack
      const videoResponse = await fetch(downloadUrl)
      if (!videoResponse.ok) {
        throw new Error('Failed to download video from Shotstack')
      }

      const videoBlob = await videoResponse.blob()
      
      // Phase 1: Create mock storage response
      const mockUrl = URL.createObjectURL(videoBlob)
      
      const r2File: R2StorageFile = {
        key: filename,
        url: mockUrl,
        bucket: 'mock-bucket',
        size: videoBlob.size,
        contentType: 'video/mp4',
        uploadedAt: new Date().toISOString()
      }

      // Store reference locally
      if (typeof window !== 'undefined') {
        const videoFiles = JSON.parse(localStorage.getItem('video_files') || '[]')
        videoFiles.push(r2File)
        localStorage.setItem('video_files', JSON.stringify(videoFiles))
      }

      return {
        success: true,
        data: r2File,
        requestId,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video download/storage failed',
        errorCode: 'VIDEO_STORAGE_FAILED',
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
        const existingLogs = JSON.parse(localStorage.getItem('shotstack_usage_logs') || '[]')
        existingLogs.push(stats)
        localStorage.setItem('shotstack_usage_logs', JSON.stringify(existingLogs))
      } else {
        console.log('Shotstack usage:', stats)
      }
    } catch (error) {
      console.error('Error logging Shotstack usage:', error)
    }
  }

  /**
   * Test Shotstack API connection
   */
  async testConnection(): Promise<APIResponse<boolean>> {
    const requestId = `shotstack_test_${Date.now()}`
    
    try {
      const response = await fetch(`${this.baseUrl}/probe`, {
        headers: {
          'x-api-key': this.apiKey
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
        error: error instanceof Error ? error.message : 'Shotstack connection failed',
        errorCode: 'SHOTSTACK_CONNECTION_FAILED',
        requestId,
        timestamp: new Date().toISOString()
      }
    }
  }
}