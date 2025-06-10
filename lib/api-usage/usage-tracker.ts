// Simple Usage Tracking - ONLY logs when content is generated
// NO external API calls except when actually creating content

interface UsageEntry {
  timestamp: string;
  service: 'openai' | 'anthropic' | 'elevenlabs' | 'heygen' | 'googleCloud';
  tokens?: number;
  requests?: number;
  cost: number;
  operation: string; // e.g., 'text-generation', 'voice-synthesis', 'video-creation'
}

interface DailyUsage {
  date: string;
  entries: UsageEntry[];
  totals: {
    openai: { tokens: number; cost: number; requests: number };
    anthropic: { tokens: number; cost: number; requests: number };
    elevenlabs: { requests: number; cost: number };
    heygen: { requests: number; cost: number };
    googleCloud: { requests: number; cost: number };
  };
}

export class UsageTracker {
  
  // Log usage when content is generated
  static async logUsage(
    service: 'openai' | 'anthropic' | 'elevenlabs' | 'heygen' | 'googleCloud',
    data: {
      tokens?: number;
      requests?: number;
      cost: number;
      operation: string;
    }
  ): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const entry: UsageEntry = {
        timestamp: new Date().toISOString(),
        service,
        tokens: data.tokens,
        requests: data.requests || 1,
        cost: data.cost,
        operation: data.operation
      };

      // Store in R2 using the logging endpoint
      await fetch('/api/usage/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today, entry })
      });

    } catch (error) {
      console.warn(`Failed to log ${service} usage:`, error);
    }
  }

  // Get usage statistics from R2 storage
  static async getUsageStats(): Promise<{
    daily: Record<string, { tokens?: number; requests: number; cost: number }>;
    monthly: Record<string, { tokens?: number; requests: number; cost: number }>;
    lastUpdated: string;
  }> {
    try {
      const response = await fetch('/api/usage/stats');
      const data = await response.json();
      
      if (data.success) {
        return data.stats;
      }
      
      return this.createEmptyStats();
    } catch (error) {
      console.warn('Failed to fetch usage stats:', error);
      return this.createEmptyStats();
    }
  }

  private static createEmptyStats() {
    return {
      daily: {
        openai: { tokens: 0, requests: 0, cost: 0 },
        anthropic: { tokens: 0, requests: 0, cost: 0 },
        elevenlabs: { requests: 0, cost: 0 },
        heygen: { requests: 0, cost: 0 },
        googleCloud: { requests: 0, cost: 0 }
      },
      monthly: {
        openai: { tokens: 0, requests: 0, cost: 0 },
        anthropic: { tokens: 0, requests: 0, cost: 0 },
        elevenlabs: { requests: 0, cost: 0 },
        heygen: { requests: 0, cost: 0 },
        googleCloud: { requests: 0, cost: 0 }
      },
      lastUpdated: new Date().toISOString()
    };
  }
}

// Usage examples for when you generate content:

// After OpenAI call:
// await UsageTracker.logUsage('openai', {
//   tokens: 1500,
//   cost: 0.045,
//   operation: 'text-generation'
// });

// After ElevenLabs call:
// await UsageTracker.logUsage('elevenlabs', {
//   cost: 0.002,
//   operation: 'voice-synthesis'
// });

// After HeyGen call:
// await UsageTracker.logUsage('heygen', {
//   cost: 0.30,
//   operation: 'video-creation'
// });

export default UsageTracker;