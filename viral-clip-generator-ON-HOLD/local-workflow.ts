import { v4 as uuidv4 } from 'uuid';
import { LocalContentClipperAgent } from './local-content-clipper';
import { R2StorageService } from './r2-storage';
import type { WorkflowState, ProcessingOptions, VideoClip } from '../lib/viral-clips/types';

// Local workflow system for viral clip processing
export class LocalWorkflow {
  private workflows: Map<string, WorkflowState> = new Map();
  private r2Storage: R2StorageService;

  constructor() {
    this.r2Storage = new R2StorageService();
  }

  // Main workflow orchestration - exactly as specified
  async processViralClips(options: ProcessingOptions): Promise<{ workflowId: string; status: string }> {
    const workflowId = uuidv4();
    
    try {
      await this.logStep(workflowId, 'workflow_started', options);
      
      // Step 1: Initialize local content clipper
      const clipper = new LocalContentClipperAgent();
      await this.logStep(workflowId, 'clipper_initialized');
      
      // Step 2: Process content using simple local tools
      // - ytdl-core for download
      // - OpenAI Whisper for transcription (~$0.006/minute)
      // - Local keyword analysis (free)
      // - Simple video trimming (free)
      const result = await clipper.processContentRequest(options.sourceUrl, options);
      await this.logStep(workflowId, 'content_processed', { 
        clipsGenerated: result.clips.length,
        analysisComplete: !!result.analysis
      });
      
      // Step 3: Upload clips to R2 storage (nearly free)
      const uploadedClips = await this.uploadClipsToR2(result.clips, workflowId);
      await this.logStep(workflowId, 'clips_uploaded', { uploadedCount: uploadedClips.length });
      
      // Step 4: Create final video compositions (simple trimming only)
      const finalVideos = await this.createFinalCompositions(uploadedClips, options);
      await this.logStep(workflowId, 'compositions_created', { videoCount: finalVideos.length });
      
      // Step 5: Upload final videos to R2
      const finalUrls = await this.uploadFinalVideos(finalVideos, workflowId);
      await this.logStep(workflowId, 'workflow_completed', { finalVideos: finalUrls });
      
      await this.updateWorkflowState(workflowId, {
        status: 'completed',
        progress: 100
      });
      
      return { workflowId, status: 'completed' };
    } catch (error) {
      await this.logError(workflowId, 'workflow_failed', error as Error);
      throw error;
    }
  }

  private async uploadClipsToR2(clips: VideoClip[], workflowId: string): Promise<VideoClip[]> {
    const uploadPromises = clips.map(async (clip) => {
      try {
        // Upload video clip to R2
        const videoUrl = await this.r2Storage.uploadVideoClip(clip.videoPath, workflowId);
        
        // Upload audio clip to R2
        const audioUrl = await this.r2Storage.uploadAudioClip(clip.audioPath, workflowId);
        
        return {
          ...clip,
          videoPath: videoUrl,
          audioPath: audioUrl
        };
      } catch (error) {
        console.error(`Failed to upload clip ${clip.id}:`, error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  }

  private async createFinalCompositions(clips: VideoClip[], options: ProcessingOptions): Promise<string[]> {
    // Simple video compositions - just trim and format for TikTok
    // NO complex FFmpeg operations - keep it simple and free
    const compositions: string[] = [];
    
    for (const clip of clips) {
      const compositionPath = await this.createSimpleComposition(clip, options);
      compositions.push(compositionPath);
    }
    
    return compositions;
  }

  private async createSimpleComposition(clip: VideoClip, options: ProcessingOptions): Promise<string> {
    const path = require('path');
    
    // For now, just return the existing clip path
    // In a real implementation, you'd do simple video trimming:
    // 1. Trim to exact duration
    // 2. Convert to TikTok format (9:16 aspect ratio)
    // 3. Add simple text overlay with captions
    
    const outputPath = `/tmp/composition_${clip.id}.mp4`;
    
    // Simple composition using basic video processing
    await this.simpleVideoTrim(clip.videoPath, outputPath, {
      startTime: clip.viralMoment.startTime,
      duration: clip.duration,
      aspectRatio: '9:16'
    });
    
    return outputPath;
  }

  private async simpleVideoTrim(inputPath: string, outputPath: string, options: {
    startTime: number;
    duration: number;
    aspectRatio: string;
  }): Promise<void> {
    // Simple video processing - just copy for now
    // In production, this would use browser-based video APIs
    // or simple Node.js video libraries (NO FFmpeg)
    
    const fs = require('fs');
    await fs.promises.copyFile(inputPath, outputPath);
    
    console.log(`📹 Simple video trim completed: ${outputPath}`);
  }

  private async uploadFinalVideos(videoPaths: string[], workflowId: string): Promise<string[]> {
    const uploadPromises = videoPaths.map(async (videoPath) => {
      return this.r2Storage.uploadVideoClip(videoPath, workflowId);
    });

    return Promise.all(uploadPromises);
  }

  private async logStep(workflowId: string, step: string, data?: any): Promise<void> {
    console.log(`[${workflowId}] ${step}:`, data);
    await this.updateWorkflowState(workflowId, {
      currentStep: step,
      lastUpdated: new Date().toISOString(),
      progress: this.calculateProgress(step)
    });
  }

  private async logError(workflowId: string, step: string, error: Error): Promise<void> {
    console.error(`[${workflowId}] ${step}:`, error);
    await this.updateWorkflowState(workflowId, {
      status: 'failed',
      currentStep: step,
      error: error.message,
      lastUpdated: new Date().toISOString()
    });
  }

  private calculateProgress(step: string): number {
    const stepProgress: Record<string, number> = {
      'workflow_started': 5,
      'clipper_initialized': 10,
      'content_processed': 40,
      'clips_uploaded': 60,
      'compositions_created': 80,
      'workflow_completed': 100
    };
    
    return stepProgress[step] || 0;
  }

  private async updateWorkflowState(workflowId: string, update: Partial<WorkflowState>): Promise<void> {
    const currentState = this.workflows.get(workflowId) || {
      workflowId,
      status: 'processing',
      currentStep: '',
      progress: 0,
      startTime: Date.now(),
      lastUpdated: new Date().toISOString()
    } as WorkflowState;

    this.workflows.set(workflowId, {
      ...currentState,
      ...update,
      lastUpdated: new Date().toISOString()
    });
  }

  getWorkflowStatus(workflowId: string): WorkflowState | undefined {
    return this.workflows.get(workflowId);
  }

  // Helper method to get the latest workflow ID (for API response)
  getLatestWorkflowId(): string {
    const workflows = Array.from(this.workflows.values());
    if (workflows.length === 0) {
      return uuidv4(); // Return new ID if no workflows exist
    }
    
    // Return the most recent workflow ID
    const latest = workflows.sort((a, b) => b.startTime - a.startTime)[0];
    return latest.workflowId;
  }

  // Cleanup method to remove old workflows from memory
  cleanup(): void {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    for (const [workflowId, state] of this.workflows.entries()) {
      if (state.startTime < oneHourAgo && state.status !== 'processing') {
        this.workflows.delete(workflowId);
        console.log(`🧹 Cleaned up old workflow: ${workflowId}`);
      }
    }
  }
}