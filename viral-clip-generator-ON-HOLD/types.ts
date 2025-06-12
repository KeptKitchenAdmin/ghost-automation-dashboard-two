// Core interfaces for the viral clip system - NO EXTERNAL API CALLS
// All processing happens locally or in Cloudflare Workers

export interface ViralMoment {
  startTime: number;
  endTime: number;
  text: string;
  viralScore: number;
  emotion: 'surprise' | 'excitement' | 'controversy' | 'humor' | 'insight';
  reason: string;
}

export interface TranscriptSegment {
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface VideoClip {
  id: string;
  title: string;
  videoPath: string;
  audioPath: string;
  duration: number;
  transcript: TranscriptSegment[];
  viralMoment: ViralMoment;
}

export interface WorkflowState {
  workflowId: string;
  status: 'processing' | 'completed' | 'failed';
  currentStep: string;
  progress: number;
  startTime: number;
  lastUpdated: string;
  error?: string;
}

export interface ProcessingOptions {
  sourceUrl: string;
  backgroundType: 'minecraft' | 'subway_surfers' | 'satisfying' | 'cooking';
  clipDuration: number;
  numberOfClips: number;
  analysisType: 'viral' | 'highlights' | 'emotions';
}

export interface R2UploadResult {
  key: string;
  url: string;
  size: number;
}