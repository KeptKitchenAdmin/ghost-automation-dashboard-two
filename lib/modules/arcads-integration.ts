/**
 * Arcads AI Integration for UGC-Style Video Generation
 * Multi-actor, marketing-focused content with variations
 */

interface ArcadsConfig {
  api_key: string;
  base_url: string;
  actor_id: string;
  language: string;
  style: string;
}

interface ArcadsVideoRequest {
  script: string;
  actor_id: string;
  language: string;
  style: string; // "ugc", "commercial", "testimonial", "demo"
  aspect_ratio: string; // TikTok vertical
  background_music: boolean;
  voice_tone: string;
}

export interface ArcadsVideoResponse {
  video_id: string;
  status: string;
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  processing_time?: number;
  actor_used?: string;
  variation_id?: string;
}

export class ArcadsIntegration {
  private config: ArcadsConfig;
  private apiUrl: string;

  constructor() {
    this.config = {
      api_key: process.env.ARCADS_API_KEY || '',
      base_url: "https://api.arcads.ai/v1",
      actor_id: process.env.ARCADS_ACTOR_ID || '',
      language: "en",
      style: "ugc"
    };
    this.apiUrl = this.config.base_url;
  }

  async generateVideo(request: ArcadsVideoRequest): Promise<ArcadsVideoResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.api_key}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Arcads API error: ${response.status}`);
      }

      const data = await response.json();
      return data as ArcadsVideoResponse;

    } catch (error) {
      console.error(`Arcads video generation failed: ${error}`);
      throw error;
    }
  }

  async checkVideoStatus(videoId: string): Promise<ArcadsVideoResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/video/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.api_key}`
        }
      });

      if (!response.ok) {
        throw new Error(`Arcads API error: ${response.status}`);
      }

      const data = await response.json();
      return data as ArcadsVideoResponse;

    } catch (error) {
      console.error(`Arcads status check failed: ${error}`);
      throw error;
    }
  }

  async generateMarketingVariations(
    script: string, 
    actorIds: string[] = [], 
    variationCount: number = 3
  ): Promise<ArcadsVideoResponse[]> {
    const requests: ArcadsVideoRequest[] = [];
    
    for (let i = 0; i < variationCount; i++) {
      const actorId = actorIds[i % actorIds.length] || this.config.actor_id;
      
      requests.push({
        script: script,
        actor_id: actorId,
        language: this.config.language,
        style: "ugc",
        aspect_ratio: "9:16",
        background_music: true,
        voice_tone: "enthusiastic"
      });
    }

    const results = await Promise.all(
      requests.map(req => this.generateVideo(req))
    );

    return results;
  }

  getDefaultActors(): string[] {
    return [
      "actor_friendly_woman_1",
      "actor_friendly_man_1", 
      "actor_energetic_woman_1",
      "actor_professional_man_1"
    ];
  }

  async createMultipleVariations(
    scriptData: any,
    actorCount: number = 3
  ): Promise<ArcadsVideoResponse[]> {
    const actors = this.getDefaultActors();
    return this.generateMarketingVariations(
      scriptData.script || scriptData.content,
      actors.slice(0, actorCount),
      actorCount
    );
  }

  async createUGCVideo(scriptData: any): Promise<ArcadsVideoResponse> {
    const request: ArcadsVideoRequest = {
      script: scriptData.script || scriptData.content,
      actor_id: this.config.actor_id,
      language: this.config.language,
      style: "ugc",
      aspect_ratio: "9:16",
      background_music: true,
      voice_tone: "conversational"
    };

    return this.generateVideo(request);
  }
}

export const arcadsIntegration = new ArcadsIntegration();