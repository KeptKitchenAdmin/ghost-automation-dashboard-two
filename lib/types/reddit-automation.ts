export interface RedditStory {
  id: string;
  title: string;
  content: string;
  subreddit: string;
  upvotes: number;
  comments: number;
  created_utc: number;
  url: string;
  viral_score: number;
  category: 'drama' | 'horror' | 'revenge' | 'wholesome' | 'mystery';
  estimated_duration: number;
  enhanced_content?: string;
}

export interface VideoGenerationRequest {
  story: RedditStory;
  background_url: string;
  voice_settings: {
    voice_id: string;
    stability: number;
    similarity_boost: number;
  };
  video_config: {
    duration: number;
    add_captions: boolean;
    music_volume: number;
  };
  userTriggered: boolean;
}

export interface GeneratedVideo {
  id: string;
  story_id: string;
  video_url: string;
  audio_url?: string;
  captions_file?: string;
  duration: number;
  file_size: number;
  created_at: string;
  api_costs?: {
    claude_cost: number;
    shotstack_cost: number;
    elevenlabs_cost: number;
    total_cost: number;
  };
}

export interface WorkflowState {
  workflowId: string;
  status: 'processing' | 'completed' | 'failed';
  currentStep: string;
  progress: number;
  startTime: number;
  lastUpdated: string;
  error?: string;
  costs?: {
    claudeCost: number;
    shotstackCost: number;
    elevenlabsCost: number;
    totalCost: number;
  };
  videos?: GeneratedVideo[];
}

// Reddit API response types for better type safety
export interface RedditApiResponse {
  data: {
    children: Array<{
      data: {
        id: string;
        title: string;
        selftext: string;
        subreddit: string;
        ups: number;
        num_comments: number;
        created_utc: number;
        permalink: string;
        upvote_ratio: number;
        over_18: boolean;
        stickied: boolean;
      };
    }>;
  };
}

// Additional types for Phase 1 foundation
export interface ShotstackConfig {
  apiKey: string;
  environment: 'stage' | 'production';
  webhookUrl?: string;
}

export interface ElevenLabsConfig {
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
}

export interface VideoScript {
  hook: string;
  introduction: string;
  mainContent: string[];
  conclusion: string;
  callToAction: string;
  estimatedDuration: number;
}

export interface R2StorageFile {
  key: string;
  url: string;
  bucket: string;
  size: number;
  contentType: string;
  uploadedAt: string;
}

export interface UsageTracking {
  date: string;
  service: 'claude' | 'shotstack' | 'elevenlabs' | 'reddit';
  operation: string;
  apiCalls: number;
  costUSD: number;
  requestId: string;
  status: 'success' | 'failed';
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  requestId: string;
  timestamp: string;
  usageStats?: UsageTracking;
}