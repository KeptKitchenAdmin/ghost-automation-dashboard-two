// R2-Based Usage Logger - ZERO EXTERNAL API CALLS
// Only logs usage data to R2 storage during content generation

interface UsageEntry {
  timestamp: string;
  service: 'openai' | 'anthropic' | 'elevenlabs' | 'heygen' | 'googleCloud';
  operation: string; // 'text-generation', 'voice-synthesis', 'video-creation', etc.
  tokens?: number;
  characters?: number;
  requests: number;
  cost: number;
  model?: string;
}

interface DailyUsageLog {
  date: string;
  entries: UsageEntry[];
  totals: {
    openai: { tokens: number; requests: number; cost: number };
    anthropic: { tokens: number; requests: number; cost: number };
    elevenlabs: { characters: number; requests: number; cost: number };
    heygen: { requests: number; cost: number };
    googleCloud: { requests: number; cost: number };
  };
  lastUpdated: string;
}

export class R2UsageLogger {
  
  // Log usage ONLY during content generation
  static async logUsage(entry: Omit<UsageEntry, 'timestamp'>): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const fullEntry: UsageEntry = {
        ...entry,
        timestamp: new Date().toISOString()
      };

      // Store to R2 via API route (NO external API calls)
      await fetch('/api/usage/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          entry: fullEntry
        })
      });

      console.log(`✅ Logged ${entry.service} usage: $${entry.cost.toFixed(4)}`);
    } catch (error) {
      console.error('Failed to log usage to R2:', error);
    }
  }

  // Convenience methods for each service
  static async logOpenAI(data: {
    operation: string;
    tokens: number;
    cost: number;
    model?: string;
  }): Promise<void> {
    await this.logUsage({
      service: 'openai',
      operation: data.operation,
      tokens: data.tokens,
      requests: 1,
      cost: data.cost,
      model: data.model
    });
  }

  static async logAnthropic(data: {
    operation: string;
    tokens: number;
    cost: number;
    model?: string;
  }): Promise<void> {
    await this.logUsage({
      service: 'anthropic',
      operation: data.operation,
      tokens: data.tokens,
      requests: 1,
      cost: data.cost,
      model: data.model
    });
  }

  static async logElevenLabs(data: {
    operation: string;
    characters: number;
    cost: number;
  }): Promise<void> {
    await this.logUsage({
      service: 'elevenlabs',
      operation: data.operation,
      characters: data.characters,
      requests: 1,
      cost: data.cost
    });
  }

  static async logHeyGen(data: {
    operation: string;
    cost: number;
  }): Promise<void> {
    await this.logUsage({
      service: 'heygen',
      operation: data.operation,
      requests: 1,
      cost: data.cost
    });
  }

  static async logGoogleCloud(data: {
    operation: string;
    cost: number;
  }): Promise<void> {
    await this.logUsage({
      service: 'googleCloud',
      operation: data.operation,
      requests: 1,
      cost: data.cost
    });
  }
}

// Usage examples for content generation:

// After OpenAI call:
// await R2UsageLogger.logOpenAI({
//   operation: 'script-generation',
//   tokens: 1500,
//   cost: 0.045,
//   model: 'gpt-4'
// });

// After HeyGen call:
// await R2UsageLogger.logHeyGen({
//   operation: 'video-generation',
//   cost: 0.30
// });

// After ElevenLabs call:
// await R2UsageLogger.logElevenLabs({
//   operation: 'voice-synthesis',
//   characters: 500,
//   cost: 0.002
// });

export default R2UsageLogger;