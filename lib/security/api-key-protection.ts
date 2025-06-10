export class APIKeyProtectionService {
  private keyPatterns = {
    openai: /sk-[a-zA-Z0-9]{48}/g,
    anthropic: /sk-ant-[a-zA-Z0-9\-_]{95}/g,
    googleCloud: /[A-Za-z0-9_]{39}/g,
    elevenlabs: /[a-zA-Z0-9]{32}/g,
    heygen: /[a-zA-Z0-9\-_]{40,}/g,
  };

  async scanForExposedKeys(content: string): Promise<{
    hasExposedKeys: boolean;
    exposedKeys: Array<{ type: string; partial: string; location: string }>;
    riskLevel: 'none' | 'low' | 'high' | 'critical';
  }> {
    const exposedKeys: Array<{ type: string; partial: string; location: string }> = [];

    Object.entries(this.keyPatterns).forEach(([type, pattern]) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          exposedKeys.push({
            type,
            partial: this.maskKey(match),
            location: this.findKeyLocation(content, match),
          });
        });
      }
    });

    const riskLevel = this.assessExposureRisk(exposedKeys, content);

    if (exposedKeys.length > 0) {
      console.error('🚨 EXPOSED API KEYS DETECTED:', exposedKeys);
      await this.sendKeyExposureAlert(exposedKeys);
    }

    return {
      hasExposedKeys: exposedKeys.length > 0,
      exposedKeys,
      riskLevel,
    };
  }

  async validateKeySecurity(): Promise<{
    isSecure: boolean;
    vulnerabilities: string[];
    recommendations: string[];
  }> {
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    // Check environment variable security
    if (!process.env.ANTHROPIC_API_KEY?.startsWith('sk-ant-')) {
      vulnerabilities.push('Anthropic API key format invalid or missing');
      recommendations.push('Verify ANTHROPIC_API_KEY is correctly set');
    }

    if (!process.env.OPENAI_API_KEY?.startsWith('sk-')) {
      vulnerabilities.push('OpenAI API key format invalid or missing');
      recommendations.push('Verify OPENAI_API_KEY is correctly set');
    }

    // Check for keys in common risky locations
    const riskyFiles = ['.env.example', 'config.js', 'package.json', 'README.md'];
    for (const file of riskyFiles) {
      if (await this.checkFileForKeys(file)) {
        vulnerabilities.push(`API keys found in ${file}`);
        recommendations.push(`Remove keys from ${file} immediately`);
      }
    }

    return {
      isSecure: vulnerabilities.length === 0,
      vulnerabilities,
      recommendations,
    };
  }

  async initiateKeyRotation(compromisedServices: string[]): Promise<{
    rotationSteps: string[];
    estimatedDowntime: number;
    urgency: 'low' | 'high' | 'immediate';
  }> {
    const rotationSteps: string[] = [];
    let estimatedDowntime = 0;
    let urgency: 'low' | 'high' | 'immediate' = 'low';

    for (const service of compromisedServices) {
      switch (service) {
        case 'openai':
          rotationSteps.push('1. Generate new OpenAI API key from dashboard');
          rotationSteps.push('2. Update OPENAI_API_KEY environment variable');
          rotationSteps.push('3. Restart application');
          rotationSteps.push('4. Revoke old OpenAI key');
          estimatedDowntime += 5;
          urgency = 'immediate';
          break;

        case 'anthropic':
          rotationSteps.push('1. Generate new Anthropic API key');
          rotationSteps.push('2. Update ANTHROPIC_API_KEY environment variable');
          rotationSteps.push('3. Test connection');
          rotationSteps.push('4. Revoke old Anthropic key');
          estimatedDowntime += 3;
          urgency = 'immediate';
          break;

        case 'elevenlabs':
          rotationSteps.push('1. Generate new ElevenLabs API key');
          rotationSteps.push('2. Update ELEVENLABS_API_KEY environment variable');
          rotationSteps.push('3. Test voice generation');
          rotationSteps.push('4. Delete old key');
          estimatedDowntime += 5;
          urgency = 'high';
          break;

        case 'heygen':
          rotationSteps.push('1. Generate new HeyGen API key');
          rotationSteps.push('2. Update HEYGEN_API_KEY environment variable');
          rotationSteps.push('3. Test video generation');
          rotationSteps.push('4. Revoke old key');
          estimatedDowntime += 5;
          urgency = 'high';
          break;
      }
    }

    return { rotationSteps, estimatedDowntime, urgency };
  }

  private maskKey(key: string): string {
    if (key.length <= 8) return '***';
    return key.substring(0, 4) + '***' + key.substring(key.length - 4);
  }

  private findKeyLocation(content: string, key: string): string {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(key)) {
        return `Line ${i + 1}`;
      }
    }
    return 'Unknown location';
  }

  private assessExposureRisk(exposedKeys: any[], content: string): 'none' | 'low' | 'high' | 'critical' {
    if (exposedKeys.length === 0) return 'none';
    
    if (content.includes('github.com') || content.includes('public')) return 'critical';
    if (content.includes('error') || content.includes('log')) return 'high';
    
    return 'low';
  }

  private async checkFileForKeys(filename: string): Promise<boolean> {
    // Skip file system checks in browser environment
    if (typeof window !== 'undefined') {
      return false;
    }
    
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), filename);
      
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const scan = await this.scanForExposedKeys(content);
        return scan.hasExposedKeys;
      } catch {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  private async sendKeyExposureAlert(exposedKeys: any[]): Promise<void> {
    const alert = {
      severity: 'CRITICAL',
      message: 'API keys exposed in code',
      exposedKeys: exposedKeys.map(k => ({ type: k.type, partial: k.partial })),
      timestamp: new Date().toISOString(),
      action: 'Immediate key rotation required',
    };

    console.error('🚨 CRITICAL SECURITY ALERT:', alert);
    
    if (process.env.SECURITY_WEBHOOK_URL) {
      try {
        await fetch(process.env.SECURITY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert),
        });
      } catch (error) {
        console.error('Failed to send security alert:', error);
      }
    }
  }
}