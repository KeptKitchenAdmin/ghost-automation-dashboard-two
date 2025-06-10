import { APIKeyProtectionService } from './api-key-protection';
import { IPProtectionService } from './ip-protection';
import { APICostThresholds } from './cost-thresholds';

export class ComprehensiveProtectionService {
  private static instance: ComprehensiveProtectionService;
  private apiKeyProtection: APIKeyProtectionService;
  private ipProtection: IPProtectionService;
  private costMonitor: APICostThresholds;

  private constructor() {
    this.apiKeyProtection = new APIKeyProtectionService();
    this.ipProtection = new IPProtectionService();
    this.costMonitor = new APICostThresholds();
  }

  static getInstance(): ComprehensiveProtectionService {
    if (!ComprehensiveProtectionService.instance) {
      ComprehensiveProtectionService.instance = new ComprehensiveProtectionService();
    }
    return ComprehensiveProtectionService.instance;
  }

  async preRequestCheck(
    service: 'openai' | 'anthropic' | 'googleCloud' | 'youtube' | 'elevenlabs' | 'heygen',
    estimatedUsage?: {
      inputTokens?: number;
      outputTokens?: number;
      audioMinutes?: number;
      videoMinutes?: number;
      characters?: number;
      images?: number;
    }
  ): Promise<{
    allowed: boolean;
    reason?: string;
    waitTime: number;
    alternatives?: string[];
    estimatedCost?: number;
  }> {
    
    // Check API key security
    const keyCheck = await this.apiKeyProtection.validateKeySecurity();
    if (!keyCheck.isSecure) {
      return {
        allowed: false,
        reason: 'API keys compromised - requests blocked',
        waitTime: 0,
        alternatives: ['Rotate API keys immediately'],
      };
    }

    // Check IP safety
    const ipServiceMap: Record<string, keyof typeof this.ipProtection['serviceLimits']> = {
      openai: 'openai',
      anthropic: 'anthropic',
      googleCloud: 'googleApis',
      youtube: 'youtube',
      elevenlabs: 'elevenlabs',
      heygen: 'heygen'
    };

    const ipCheck = await this.ipProtection.isSafeToRequest(ipServiceMap[service]);
    if (!ipCheck.safe) {
      return {
        allowed: false,
        reason: ipCheck.reason,
        waitTime: ipCheck.waitTime,
        alternatives: ['Wait for cooldown', 'Use different service'],
      };
    }

    // Calculate estimated cost if usage provided
    let estimatedCost = 0;
    if (estimatedUsage && ['openai', 'anthropic', 'elevenlabs', 'heygen', 'googleCloud'].includes(service)) {
      const costEstimate = await this.costMonitor.calculateProcessingCost(
        service as any,
        estimatedUsage
      );
      estimatedCost = costEstimate.cost;

      if (!costEstimate.withinBudget) {
        return {
          allowed: false,
          reason: `Estimated cost ($${estimatedCost.toFixed(2)}) exceeds budget`,
          waitTime: 0,
          alternatives: ['Reduce usage', 'Wait for budget reset'],
          estimatedCost,
        };
      }
    }

    // Check cost limits
    const costCheck = await this.costMonitor.monitorRealtimeCosts();
    if (costCheck.circuitBreaker[service]) {
      return {
        allowed: false,
        reason: 'Cost limit exceeded',
        waitTime: 24 * 60 * 60 * 1000, // 24 hours
        alternatives: ['Wait until tomorrow', 'Use free tier services'],
      };
    }

    // Add human-like delay
    const humanDelay = await this.ipProtection.getHumanLikeDelay(ipServiceMap[service]);

    return { 
      allowed: true, 
      waitTime: humanDelay,
      estimatedCost 
    };
  }

  async postRequestRecord(
    service: 'openai' | 'anthropic' | 'googleCloud' | 'youtube' | 'elevenlabs' | 'heygen',
    success: boolean,
    actualUsage?: {
      inputTokens?: number;
      outputTokens?: number;
      audioMinutes?: number;
      videoMinutes?: number;
      characters?: number;
      images?: number;
    },
    responseCode?: number
  ): Promise<void> {
    // Map service names
    const ipServiceMap: Record<string, keyof typeof this.ipProtection['serviceLimits']> = {
      openai: 'openai',
      anthropic: 'anthropic',
      googleCloud: 'googleApis',
      youtube: 'youtube',
      elevenlabs: 'elevenlabs',
      heygen: 'heygen'
    };

    // Record for IP protection
    await this.ipProtection.recordRequest(ipServiceMap[service], success, responseCode);

    // Update cost tracking if usage provided
    if (actualUsage && ['openai', 'anthropic', 'elevenlabs', 'heygen', 'googleCloud'].includes(service)) {
      await this.costMonitor.calculateProcessingCost(
        service as any,
        actualUsage
      );
    }

    // Check for ban indicators
    const banCheck = await this.ipProtection.checkForBanIndicators(ipServiceMap[service]);
    if (banCheck.banned) {
      await this.ipProtection.emergencyStop(ipServiceMap[service], 'Ban detected');
    }
  }

  async getSecurityStatus(): Promise<{
    apiKeys: { secure: boolean; issues: string[] };
    ipStatus: Record<string, { safe: boolean; indicators: string[] }>;
    costStatus: {
      services: Record<string, any>;
      totalCost: { daily: number; monthly: number };
    };
  }> {
    const apiKeys = await this.apiKeyProtection.validateKeySecurity();
    
    const ipStatus: Record<string, { safe: boolean; indicators: string[] }> = {};
    const services = ['openai', 'anthropic', 'googleApis', 'youtube', 'elevenlabs', 'heygen'] as const;
    
    for (const service of services) {
      const check = await this.ipProtection.checkForBanIndicators(service);
      ipStatus[service] = {
        safe: !check.banned,
        indicators: check.indicators
      };
    }

    const costStatus = await this.costMonitor.getUsageReport();

    return {
      apiKeys: {
        secure: apiKeys.isSecure,
        issues: apiKeys.vulnerabilities
      },
      ipStatus,
      costStatus
    };
  }

  async getUsageReport() {
    return this.costMonitor.getUsageReport();
  }
}

// Export singleton instance
export const protectionService = ComprehensiveProtectionService.getInstance();