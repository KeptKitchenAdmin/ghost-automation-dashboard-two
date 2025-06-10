/**
 * Simple Rate Limiting and Cost Controls
 * Lightweight implementation for fast deployment
 */

interface RateLimit {
  requests_per_hour: number;
  daily_cost_limit: number;
  monthly_cost_limit: number;
}

interface UsageTracking {
  hourly: Record<string, number>;
  daily: Record<string, number>;
  monthly: Record<string, number>;
}

interface RateLimitCheck {
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
  resets_at?: string;
  remaining?: {
    hourly_requests: number;
    daily_cost_budget: number;
    monthly_cost_budget: number;
  };
}

interface UsageSummary {
  current_hour_requests: number;
  current_day_cost: number;
  current_month_cost: number;
  last_updated: string;
  error?: string;
}

interface ResetResult {
  status: string;
  type?: string;
  message?: string;
}

export class SimpleRateLimiter {
  private tierLimits: Record<string, RateLimit>;
  private usageTracking: Record<string, UsageTracking> = {};
  private llmCosts: Record<string, number>;

  constructor() {
    // Client tier limits
    this.tierLimits = {
      saas: {
        requests_per_hour: 50,
        daily_cost_limit: 5.0,
        monthly_cost_limit: 50.0
      },
      basic: {
        requests_per_hour: 100,
        daily_cost_limit: 20.0,
        monthly_cost_limit: 500.0
      },
      pro: {
        requests_per_hour: 500,
        daily_cost_limit: 100.0,
        monthly_cost_limit: 2000.0
      },
      enterprise: {
        requests_per_hour: 2000,
        daily_cost_limit: 500.0,
        monthly_cost_limit: 10000.0
      }
    };

    // LLM cost per 1k tokens (approximate)
    this.llmCosts = {
      claude_sonnet: 0.015,
      claude_haiku: 0.0025,
      gpt4: 0.03,
      gpt3_5: 0.002
    };
  }

  checkRateLimit(clientId: string, clientTier: string): RateLimitCheck {
    try {
      const now = new Date();
      const currentHour = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}`;
      const currentDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Get client limits
      const limits = this.tierLimits[clientTier] || this.tierLimits.basic;

      // Initialize tracking if needed
      if (!this.usageTracking[clientId]) {
        this.usageTracking[clientId] = {
          hourly: {},
          daily: {},
          monthly: {}
        };
      }

      const clientUsage = this.usageTracking[clientId];

      // Check hourly request limit
      const hourlyRequests = clientUsage.hourly[currentHour] || 0;
      if (hourlyRequests >= limits.requests_per_hour) {
        const nextHour = new Date(now);
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        
        return {
          allowed: false,
          reason: "hourly_request_limit",
          limit: limits.requests_per_hour,
          current: hourlyRequests,
          resets_at: nextHour.toISOString()
        };
      }

      // Check daily cost limit
      const dailyCost = clientUsage.daily[currentDay] || 0.0;
      if (dailyCost >= limits.daily_cost_limit) {
        const nextDay = new Date(now);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        
        return {
          allowed: false,
          reason: "daily_cost_limit",
          limit: limits.daily_cost_limit,
          current: dailyCost,
          resets_at: nextDay.toISOString()
        };
      }

      // Check monthly cost limit
      const monthlyCost = clientUsage.monthly[currentMonth] || 0.0;
      if (monthlyCost >= limits.monthly_cost_limit) {
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
        nextMonth.setHours(0, 0, 0, 0);
        
        return {
          allowed: false,
          reason: "monthly_cost_limit",
          limit: limits.monthly_cost_limit,
          current: monthlyCost,
          resets_at: nextMonth.toISOString()
        };
      }

      return {
        allowed: true,
        remaining: {
          hourly_requests: limits.requests_per_hour - hourlyRequests,
          daily_cost_budget: limits.daily_cost_limit - dailyCost,
          monthly_cost_budget: limits.monthly_cost_limit - monthlyCost
        }
      };

    } catch (error) {
      console.error(`Rate limit check failed: ${error}`);
      return { allowed: false, reason: "system_error" };
    }
  }

  recordUsage(clientId: string, llmProvider: string, tokensUsed: number): number {
    try {
      const now = new Date();
      const currentHour = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}`;
      const currentDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Calculate cost
      const costPer1k = this.llmCosts[llmProvider] || 0.015;
      const cost = (tokensUsed / 1000) * costPer1k;

      // Initialize tracking if needed
      if (!this.usageTracking[clientId]) {
        this.usageTracking[clientId] = {
          hourly: {},
          daily: {},
          monthly: {}
        };
      }

      const clientUsage = this.usageTracking[clientId];

      // Update request counts
      clientUsage.hourly[currentHour] = (clientUsage.hourly[currentHour] || 0) + 1;

      // Update costs
      clientUsage.daily[currentDay] = (clientUsage.daily[currentDay] || 0.0) + cost;
      clientUsage.monthly[currentMonth] = (clientUsage.monthly[currentMonth] || 0.0) + cost;

      // Clean old data (keep last 48 hours for hourly, 60 days for daily, 12 months for monthly)
      this.cleanupOldData();

      return cost;

    } catch (error) {
      console.error(`Usage recording failed: ${error}`);
      return 0.0;
    }
  }

  getUsageSummary(clientId: string): UsageSummary {
    try {
      const now = new Date();
      const currentHour = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}`;
      const currentDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      if (!this.usageTracking[clientId]) {
        return {
          current_hour_requests: 0,
          current_day_cost: 0.0,
          current_month_cost: 0.0,
          last_updated: now.toISOString()
        };
      }

      const clientUsage = this.usageTracking[clientId];

      return {
        current_hour_requests: clientUsage.hourly[currentHour] || 0,
        current_day_cost: clientUsage.daily[currentDay] || 0.0,
        current_month_cost: clientUsage.monthly[currentMonth] || 0.0,
        last_updated: now.toISOString()
      };

    } catch (error) {
      console.error(`Usage summary failed: ${error}`);
      return { 
        current_hour_requests: 0,
        current_day_cost: 0,
        current_month_cost: 0,
        last_updated: new Date().toISOString(),
        error: String(error) 
      };
    }
  }

  suggestFallbackLlm(clientTier: string, preferredLlm: string): string {
    const fallbackMap: Record<string, string> = {
      saas: "claude_haiku",      // Cheapest option
      basic: "gpt3_5",           // Good balance
      pro: "claude_sonnet",      // Higher quality
      enterprise: "gpt4"         // Best quality
    };

    // If preferred LLM is already the fallback, suggest the cheapest
    const suggested = fallbackMap[clientTier] || "claude_haiku";
    if (suggested === preferredLlm) {
      return "claude_haiku"; // Always fall back to cheapest
    }

    return suggested;
  }

  private cleanupOldData(): void {
    try {
      const now = new Date();
      
      const cutoffHour = new Date(now);
      cutoffHour.setHours(cutoffHour.getHours() - 48);
      const cutoffHourStr = `${cutoffHour.getFullYear()}-${String(cutoffHour.getMonth() + 1).padStart(2, '0')}-${String(cutoffHour.getDate()).padStart(2, '0')}-${String(cutoffHour.getHours()).padStart(2, '0')}`;
      
      const cutoffDay = new Date(now);
      cutoffDay.setDate(cutoffDay.getDate() - 60);
      const cutoffDayStr = `${cutoffDay.getFullYear()}-${String(cutoffDay.getMonth() + 1).padStart(2, '0')}-${String(cutoffDay.getDate()).padStart(2, '0')}`;
      
      const cutoffMonth = new Date(now);
      cutoffMonth.setFullYear(cutoffMonth.getFullYear() - 1);
      const cutoffMonthStr = `${cutoffMonth.getFullYear()}-${String(cutoffMonth.getMonth() + 1).padStart(2, '0')}`;

      for (const clientId in this.usageTracking) {
        const clientUsage = this.usageTracking[clientId];

        // Clean hourly data
        clientUsage.hourly = Object.fromEntries(
          Object.entries(clientUsage.hourly).filter(([hour]) => hour >= cutoffHourStr)
        );

        // Clean daily data
        clientUsage.daily = Object.fromEntries(
          Object.entries(clientUsage.daily).filter(([day]) => day >= cutoffDayStr)
        );

        // Clean monthly data
        clientUsage.monthly = Object.fromEntries(
          Object.entries(clientUsage.monthly).filter(([month]) => month >= cutoffMonthStr)
        );
      }

    } catch (error) {
      console.error(`Data cleanup failed: ${error}`);
    }
  }

  resetClientLimits(clientId: string, resetType: string = "all"): ResetResult {
    try {
      if (!this.usageTracking[clientId]) {
        return { status: "no_data" };
      }

      if (resetType === "hourly") {
        this.usageTracking[clientId].hourly = {};
      } else if (resetType === "daily") {
        this.usageTracking[clientId].daily = {};
      } else if (resetType === "monthly") {
        this.usageTracking[clientId].monthly = {};
      } else if (resetType === "all") {
        this.usageTracking[clientId] = { hourly: {}, daily: {}, monthly: {} };
      }

      return { status: "reset", type: resetType };

    } catch (error) {
      console.error(`Limit reset failed: ${error}`);
      return { status: "error", message: String(error) };
    }
  }
}

// Global rate limiter instance
export const rateLimiter = new SimpleRateLimiter();