export class APICostThresholds {
  
  // REAL COST THRESHOLDS (based on actual API pricing)
  private readonly costThresholds = {
    openai: {
      gpt4Input: 0.03 / 1000, // $0.03 per 1K input tokens
      gpt4Output: 0.06 / 1000, // $0.06 per 1K output tokens
      whisper: 0.006 / 60, // $0.006 per minute
      dalle3: 0.04, // $0.04 per image
      daily: { warning: 20, critical: 50, emergency: 100 },
      monthly: { warning: 300, critical: 500, emergency: 1000 },
    },
    anthropic: {
      claudeInput: 0.008 / 1000, // $0.008 per 1K input tokens  
      claudeOutput: 0.024 / 1000, // $0.024 per 1K output tokens
      daily: { warning: 15, critical: 30, emergency: 60 },
      monthly: { warning: 200, critical: 300, emergency: 600 },
    },
    elevenlabs: {
      characterCost: 0.00018, // $0.18 per 1K characters
      daily: { warning: 5, critical: 10, emergency: 20 },
      monthly: { warning: 50, critical: 100, emergency: 200 },
    },
    heygen: {
      minuteCost: 0.30, // $0.30 per minute of video
      daily: { warning: 10, critical: 25, emergency: 50 },
      monthly: { warning: 150, critical: 300, emergency: 500 },
    },
    googleCloud: {
      speechToText: 0.024 / 60, // $0.024 per minute
      daily: { warning: 10, critical: 25, emergency: 50 },
      monthly: { warning: 100, critical: 200, emergency: 400 },
    },
  };

  // Track usage across all services
  private usageTracking = new Map<string, {
    daily: number;
    monthly: number;
    lastReset: { day: string; month: string };
  }>();

  async calculateProcessingCost(
    service: 'openai' | 'anthropic' | 'elevenlabs' | 'heygen' | 'googleCloud',
    usage: {
      inputTokens?: number;
      outputTokens?: number;
      audioMinutes?: number;
      videoMinutes?: number;
      characters?: number;
      images?: number;
    }
  ): Promise<{
    cost: number;
    breakdown: Record<string, number>;
    withinBudget: boolean;
    remainingBudget: {
      daily: number;
      monthly: number;
    };
  }> {
    const breakdown: Record<string, number> = {};
    let totalCost = 0;

    switch (service) {
      case 'openai':
        if (usage.inputTokens) {
          breakdown.inputTokens = usage.inputTokens * this.costThresholds.openai.gpt4Input;
          totalCost += breakdown.inputTokens;
        }
        if (usage.outputTokens) {
          breakdown.outputTokens = usage.outputTokens * this.costThresholds.openai.gpt4Output;
          totalCost += breakdown.outputTokens;
        }
        if (usage.audioMinutes) {
          breakdown.whisper = usage.audioMinutes * this.costThresholds.openai.whisper;
          totalCost += breakdown.whisper;
        }
        if (usage.images) {
          breakdown.dalle = usage.images * this.costThresholds.openai.dalle3;
          totalCost += breakdown.dalle;
        }
        break;

      case 'anthropic':
        if (usage.inputTokens) {
          breakdown.inputTokens = usage.inputTokens * this.costThresholds.anthropic.claudeInput;
          totalCost += breakdown.inputTokens;
        }
        if (usage.outputTokens) {
          breakdown.outputTokens = usage.outputTokens * this.costThresholds.anthropic.claudeOutput;
          totalCost += breakdown.outputTokens;
        }
        break;

      case 'elevenlabs':
        if (usage.characters) {
          breakdown.characters = usage.characters * this.costThresholds.elevenlabs.characterCost;
          totalCost += breakdown.characters;
        }
        break;

      case 'heygen':
        if (usage.videoMinutes) {
          breakdown.videoMinutes = usage.videoMinutes * this.costThresholds.heygen.minuteCost;
          totalCost += breakdown.videoMinutes;
        }
        break;

      case 'googleCloud':
        if (usage.audioMinutes) {
          breakdown.speechToText = usage.audioMinutes * this.costThresholds.googleCloud.speechToText;
          totalCost += breakdown.speechToText;
        }
        break;
    }

    // Update tracking
    await this.updateUsageTracking(service, totalCost);

    // Get current usage
    const currentUsage = this.usageTracking.get(service)!;
    const thresholds = this.costThresholds[service];

    const withinBudget = currentUsage.daily + totalCost < thresholds.daily.warning;
    const remainingBudget = {
      daily: Math.max(0, thresholds.daily.critical - currentUsage.daily),
      monthly: Math.max(0, thresholds.monthly.critical - currentUsage.monthly),
    };

    return {
      cost: totalCost,
      breakdown,
      withinBudget,
      remainingBudget,
    };
  }

  async monitorRealtimeCosts(): Promise<{
    currentCosts: Record<string, { today: number; month: number; percentOfLimit: number }>;
    alerts: Array<{
      service: string;
      level: 'warning' | 'critical' | 'emergency';
      message: string;
      action: string;
    }>;
    circuitBreaker: Record<string, boolean>;
  }> {
    const currentCosts: Record<string, { today: number; month: number; percentOfLimit: number }> = {};
    const alerts: Array<{ service: string; level: 'warning' | 'critical' | 'emergency'; message: string; action: string }> = [];
    const circuitBreaker: Record<string, boolean> = {};

    for (const [service, thresholds] of Object.entries(this.costThresholds)) {
      const usage = this.usageTracking.get(service) || {
        daily: 0,
        monthly: 0,
        lastReset: { day: new Date().toISOString().split('T')[0], month: new Date().toISOString().slice(0, 7) }
      };

      currentCosts[service] = {
        today: usage.daily,
        month: usage.monthly,
        percentOfLimit: (usage.daily / thresholds.daily.critical) * 100,
      };

      circuitBreaker[service] = false;

      // Check daily thresholds
      if (usage.daily >= thresholds.daily.emergency) {
        alerts.push({
          service,
          level: 'emergency',
          message: `EMERGENCY: Daily cost limit exceeded ($${usage.daily.toFixed(2)})`,
          action: 'ALL REQUESTS STOPPED'
        });
        circuitBreaker[service] = true;
      } else if (usage.daily >= thresholds.daily.critical) {
        alerts.push({
          service,
          level: 'critical',
          message: `CRITICAL: Daily cost limit approaching ($${usage.daily.toFixed(2)})`,
          action: 'Reduce usage immediately'
        });
      } else if (usage.daily >= thresholds.daily.warning) {
        alerts.push({
          service,
          level: 'warning',
          message: `WARNING: Daily cost threshold reached ($${usage.daily.toFixed(2)})`,
          action: 'Monitor usage closely'
        });
      }

      // Check monthly thresholds
      if (usage.monthly >= thresholds.monthly.emergency) {
        alerts.push({
          service,
          level: 'emergency',
          message: `EMERGENCY: Monthly cost limit exceeded ($${usage.monthly.toFixed(2)})`,
          action: 'ALL REQUESTS STOPPED FOR MONTH'
        });
        circuitBreaker[service] = true;
      }
    }

    // Log critical alerts
    alerts.forEach(alert => {
      if (alert.level === 'emergency') {
        console.error(`🚨 ${alert.service}: ${alert.message}`);
      } else if (alert.level === 'critical') {
        console.warn(`⚠️ ${alert.service}: ${alert.message}`);
      }
    });

    return { currentCosts, alerts, circuitBreaker };
  }

  async emergencyCostStop(service: string, cost: number, limit: number): Promise<void> {
    console.error(`🚨 EMERGENCY COST STOP: ${service} exceeded $${limit} (current: $${cost})`);
    
    // Disable all API calls for this service
    process.env[`${service.toUpperCase()}_DISABLED`] = 'true';
    
    // Send immediate alert
    const alert = {
      severity: 'EMERGENCY',
      message: `Cost limit exceeded for ${service}`,
      cost,
      limit,
      timestamp: new Date().toISOString(),
      action: 'All API calls stopped immediately',
    };

    if (process.env.EMERGENCY_WEBHOOK_URL) {
      try {
        await fetch(process.env.EMERGENCY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert),
        });
      } catch (error) {
        console.error('Failed to send emergency alert:', error);
      }
    }
  }

  private async updateUsageTracking(service: string, cost: number): Promise<void> {
    const now = new Date();
    const currentDay = now.toISOString().split('T')[0];
    const currentMonth = now.toISOString().slice(0, 7);

    let usage = this.usageTracking.get(service) || {
      daily: 0,
      monthly: 0,
      lastReset: { day: currentDay, month: currentMonth }
    };

    // Reset daily counter if new day
    if (usage.lastReset.day !== currentDay) {
      usage.daily = 0;
      usage.lastReset.day = currentDay;
    }

    // Reset monthly counter if new month
    if (usage.lastReset.month !== currentMonth) {
      usage.monthly = 0;
      usage.lastReset.month = currentMonth;
    }

    // Update usage
    usage.daily += cost;
    usage.monthly += cost;

    this.usageTracking.set(service, usage);
  }

  async getUsageReport(): Promise<{
    services: Record<string, {
      daily: { used: number; limit: number; percentage: number };
      monthly: { used: number; limit: number; percentage: number };
      status: 'ok' | 'warning' | 'critical' | 'stopped';
    }>;
    totalCost: { daily: number; monthly: number };
  }> {
    const services: Record<string, any> = {};
    let totalDaily = 0;
    let totalMonthly = 0;

    for (const [service, thresholds] of Object.entries(this.costThresholds)) {
      const usage = this.usageTracking.get(service) || {
        daily: 0,
        monthly: 0,
        lastReset: { day: new Date().toISOString().split('T')[0], month: new Date().toISOString().slice(0, 7) }
      };

      let status: 'ok' | 'warning' | 'critical' | 'stopped' = 'ok';
      if (usage.daily >= thresholds.daily.emergency) {
        status = 'stopped';
      } else if (usage.daily >= thresholds.daily.critical) {
        status = 'critical';
      } else if (usage.daily >= thresholds.daily.warning) {
        status = 'warning';
      }

      services[service] = {
        daily: {
          used: usage.daily,
          limit: thresholds.daily.critical,
          percentage: (usage.daily / thresholds.daily.critical) * 100
        },
        monthly: {
          used: usage.monthly,
          limit: thresholds.monthly.critical,
          percentage: (usage.monthly / thresholds.monthly.critical) * 100
        },
        status
      };

      totalDaily += usage.daily;
      totalMonthly += usage.monthly;
    }

    return {
      services,
      totalCost: { daily: totalDaily, monthly: totalMonthly }
    };
  }
}