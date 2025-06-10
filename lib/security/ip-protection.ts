export class IPProtectionService {
  private requestHistory: Map<string, Array<{ timestamp: number; success: boolean }>> = new Map();
  private banDetection: Map<string, { lastBan: number; banCount: number }> = new Map();
  
  private serviceLimits = {
    youtube: { requestsPerHour: 100, cooldownMs: 60000 },
    googleApis: { requestsPerHour: 1000, cooldownMs: 30000 },
    anthropic: { requestsPerMinute: 60, cooldownMs: 1000 },
    openai: { requestsPerMinute: 60, cooldownMs: 1000 },
    elevenlabs: { requestsPerMinute: 20, cooldownMs: 3000 },
    heygen: { requestsPerMinute: 10, cooldownMs: 6000 },
  };

  async isSafeToRequest(service: keyof typeof this.serviceLimits): Promise<{
    safe: boolean;
    waitTime: number;
    reason?: string;
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    const now = Date.now();
    const limits = this.serviceLimits[service];
    const history = this.requestHistory.get(service) || [];

    // Check recent request frequency
    const recentRequests = history.filter(req => now - req.timestamp < 60 * 60 * 1000);
    const recentFailures = recentRequests.filter(req => !req.success);

    // Check for ban indicators
    const banInfo = this.banDetection.get(service);
    if (banInfo && now - banInfo.lastBan < 24 * 60 * 60 * 1000) {
      return {
        safe: false,
        waitTime: 24 * 60 * 60 * 1000 - (now - banInfo.lastBan),
        reason: 'Recent ban detected - waiting 24 hours',
        riskLevel: 'high',
      };
    }

    // Check rate limits
    const requestsPerHour = (limits as any).requestsPerHour;
    const requestsPerMinute = (limits as any).requestsPerMinute;
    
    if (requestsPerHour && recentRequests.length >= requestsPerHour) {
      return {
        safe: false,
        waitTime: 60 * 60 * 1000,
        reason: 'Hourly rate limit reached',
        riskLevel: 'medium',
      };
    }

    if (requestsPerMinute) {
      const recentMinuteRequests = history.filter(req => now - req.timestamp < 60 * 1000);
      if (recentMinuteRequests.length >= requestsPerMinute) {
        return {
          safe: false,
          waitTime: 60 * 1000,
          reason: 'Per-minute rate limit reached',
          riskLevel: 'medium',
        };
      }
    }

    // Check for too many recent failures
    if (recentFailures.length > 5) {
      return {
        safe: false,
        waitTime: 30 * 60 * 1000,
        reason: 'Too many recent failures - cooling down',
        riskLevel: 'high',
      };
    }

    // Check minimum cooldown
    const lastRequest = history[history.length - 1];
    if (lastRequest && now - lastRequest.timestamp < limits.cooldownMs) {
      return {
        safe: false,
        waitTime: limits.cooldownMs - (now - lastRequest.timestamp),
        reason: 'Minimum cooldown not elapsed',
        riskLevel: 'low',
      };
    }

    return { safe: true, waitTime: 0, riskLevel: 'low' };
  }

  async recordRequest(service: keyof typeof this.serviceLimits, success: boolean, responseCode?: number): Promise<void> {
    const now = Date.now();
    const history = this.requestHistory.get(service) || [];
    
    history.push({ timestamp: now, success });
    
    // Keep only last 24 hours of history
    const filtered = history.filter(req => now - req.timestamp < 24 * 60 * 60 * 1000);
    this.requestHistory.set(service, filtered);

    // Detect potential bans
    if (!success && this.isPotentialBan(responseCode)) {
      await this.handlePotentialBan(service, responseCode);
    }
  }

  async getHumanLikeDelay(service: keyof typeof this.serviceLimits): Promise<number> {
    const baseDelay = this.serviceLimits[service].cooldownMs;
    
    // Add randomization to avoid detection
    const jitter = Math.random() * 0.5 + 0.75; // 75% to 125% of base delay
    const humanDelay = baseDelay * jitter;
    
    // Add extra delay based on time of day
    const hour = new Date().getHours();
    const timeMultiplier = this.getTimeBasedMultiplier(hour);
    
    return Math.floor(humanDelay * timeMultiplier);
  }

  async checkForBanIndicators(service: keyof typeof this.serviceLimits): Promise<{
    banned: boolean;
    indicators: string[];
    severity: 'none' | 'warning' | 'critical';
    recommendations: string[];
  }> {
    const indicators: string[] = [];
    const recommendations: string[] = [];
    let severity: 'none' | 'warning' | 'critical' = 'none';

    const history = this.requestHistory.get(service) || [];
    const recent = history.filter(req => Date.now() - req.timestamp < 60 * 60 * 1000);

    // Check failure rate
    if (recent.length > 0) {
      const failureRate = recent.filter(req => !req.success).length / recent.length;
      if (failureRate > 0.5) {
        indicators.push('High failure rate (>50%)');
        severity = 'warning';
        recommendations.push('Reduce request frequency');
      }

      if (failureRate > 0.8) {
        indicators.push('Critical failure rate (>80%)');
        severity = 'critical';
        recommendations.push('Stop requests immediately and wait 24 hours');
      }
    }

    // Check for consecutive failures
    const recentFailures = recent.slice(-5).filter(req => !req.success).length;
    if (recentFailures >= 5) {
      indicators.push('5+ consecutive failures');
      severity = 'critical';
      recommendations.push('IP likely banned - change IP or wait');
    }

    // Check ban history
    const banInfo = this.banDetection.get(service);
    if (banInfo && banInfo.banCount > 2) {
      indicators.push('Multiple previous bans detected');
      severity = 'warning';
      recommendations.push('Consider using VPN or proxy rotation');
    }

    return {
      banned: severity === 'critical',
      indicators,
      severity,
      recommendations,
    };
  }

  async emergencyStop(service: keyof typeof this.serviceLimits, reason: string): Promise<void> {
    console.error(`🚨 EMERGENCY STOP for ${service}: ${reason}`);
    
    // Record emergency stop
    const banInfo = this.banDetection.get(service) || { lastBan: 0, banCount: 0 };
    banInfo.lastBan = Date.now();
    banInfo.banCount++;
    this.banDetection.set(service, banInfo);

    // Clear request queue for this service
    this.requestHistory.set(service, []);

    // Send alert
    await this.sendBanAlert(service, reason);
  }

  private isPotentialBan(responseCode?: number): boolean {
    const banCodes = [429, 403, 401, 503];
    return responseCode ? banCodes.includes(responseCode) : false;
  }

  private async handlePotentialBan(service: keyof typeof this.serviceLimits, responseCode?: number): Promise<void> {
    console.warn(`⚠️ Potential ban detected for ${service} (HTTP ${responseCode})`);
    
    const banInfo = this.banDetection.get(service) || { lastBan: 0, banCount: 0 };
    banInfo.lastBan = Date.now();
    banInfo.banCount++;
    this.banDetection.set(service, banInfo);

    if (banInfo.banCount >= 3) {
      await this.emergencyStop(service, `Multiple ban attempts (${banInfo.banCount})`);
    }
  }

  private getTimeBasedMultiplier(hour: number): number {
    if (hour >= 2 && hour <= 6) return 2.0;
    if (hour >= 9 && hour <= 17) return 1.0;
    if (hour >= 18 && hour <= 22) return 1.2;
    return 1.5;
  }

  private async sendBanAlert(service: string, reason: string): Promise<void> {
    const alert = {
      severity: 'CRITICAL',
      message: `IP protection: Emergency stop for ${service}`,
      reason,
      timestamp: new Date().toISOString(),
      action: 'All requests paused for 24 hours',
    };

    console.error('🚨 IP PROTECTION ALERT:', alert);
  }
}