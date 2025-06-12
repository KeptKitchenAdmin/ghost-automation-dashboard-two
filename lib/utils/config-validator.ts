/**
 * API Configuration Validation for Reddit Video Automation
 * Validates environment variables and API configurations before content generation
 */

export interface APIConfigStatus {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  availableServices: string[];
  missingServices: string[];
}

export class ConfigValidator {
  /**
   * Validates all API configurations for Reddit Video Automation
   */
  static validateConfiguration(): APIConfigStatus {
    const errors: string[] = [];
    const warnings: string[] = [];
    const availableServices: string[] = [];
    const missingServices: string[] = [];

    // Validate Anthropic Claude API
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey && anthropicKey !== 'sk-ant-your-key-here') {
      if (anthropicKey.startsWith('sk-ant-')) {
        availableServices.push('Claude AI Story Enhancement');
      } else {
        errors.push('Invalid Anthropic API key format (should start with sk-ant-)');
      }
    } else {
      missingServices.push('Claude AI');
      warnings.push('Claude AI not configured - will use fallback story enhancement');
    }

    // Validate Shotstack API
    const shotstackKey = process.env.SHOTSTACK_API_KEY;
    const shotstackEnv = process.env.SHOTSTACK_ENVIRONMENT;
    if (shotstackKey && shotstackKey !== 'your-shotstack-key-here') {
      availableServices.push('Shotstack Video Generation');
      if (!shotstackEnv || !['stage', 'production'].includes(shotstackEnv)) {
        warnings.push('Shotstack environment not set or invalid - defaulting to stage');
      }
    } else {
      missingServices.push('Shotstack Video');
      warnings.push('Shotstack not configured - will use simulation mode');
    }

    // Validate ElevenLabs API (Optional)
    const elevenlabsKey = process.env.ELEVENLABS_API_KEY;
    if (elevenlabsKey && elevenlabsKey !== 'your-elevenlabs-key-here') {
      availableServices.push('ElevenLabs Voice Synthesis');
    } else {
      missingServices.push('ElevenLabs Voice');
      warnings.push('ElevenLabs not configured - will use basic TTS');
    }

    // Validate Reddit Configuration (always available - public API)
    const userAgent = process.env.REDDIT_USER_AGENT || 'RedditVideoBot/1.0';
    if (userAgent) {
      availableServices.push('Reddit Story Scraping');
    }

    // Validate Cloudflare R2 Storage (Optional)
    const r2AccessKey = process.env.R2_ACCESS_KEY_ID;
    const r2SecretKey = process.env.R2_SECRET_ACCESS_KEY;
    const r2Bucket = process.env.R2_BUCKET_NAME;
    
    if (r2AccessKey && r2SecretKey && r2Bucket) {
      availableServices.push('Cloudflare R2 Storage');
    } else {
      missingServices.push('R2 Storage');
      warnings.push('R2 Storage not configured - using local file storage');
    }

    // Validate Budget Protection Settings
    const claudeLimit = parseFloat(process.env.CLAUDE_DAILY_LIMIT || '1.00');
    const shotstackLimit = parseFloat(process.env.SHOTSTACK_DAILY_LIMIT || '5.00');
    
    if (claudeLimit > 10) {
      warnings.push('Claude daily limit exceeds $10 - ensure this is intentional');
    }
    if (shotstackLimit > 50) {
      warnings.push('Shotstack daily limit exceeds $50 - ensure this is intentional');
    }

    const isValid = errors.length === 0 && availableServices.includes('Reddit Story Scraping');

    return {
      isValid,
      errors,
      warnings,
      availableServices,
      missingServices
    };
  }

  /**
   * Gets a human-readable configuration summary
   */
  static getConfigSummary(): string {
    const config = this.validateConfiguration();
    
    let summary = '🔧 Reddit Video Automation Configuration\n';
    summary += '=' .repeat(50) + '\n\n';
    
    if (config.isValid) {
      summary += '✅ Configuration Status: READY FOR CONTENT GENERATION\n\n';
    } else {
      summary += '❌ Configuration Status: MISSING REQUIRED SERVICES\n\n';
    }

    if (config.availableServices.length > 0) {
      summary += '✅ Available Services:\n';
      config.availableServices.forEach(service => {
        summary += `   • ${service}\n`;
      });
      summary += '\n';
    }

    if (config.missingServices.length > 0) {
      summary += '⚠️ Missing Services:\n';
      config.missingServices.forEach(service => {
        summary += `   • ${service}\n`;
      });
      summary += '\n';
    }

    if (config.warnings.length > 0) {
      summary += '⚠️ Warnings:\n';
      config.warnings.forEach(warning => {
        summary += `   • ${warning}\n`;
      });
      summary += '\n';
    }

    if (config.errors.length > 0) {
      summary += '❌ Errors:\n';
      config.errors.forEach(error => {
        summary += `   • ${error}\n`;
      });
      summary += '\n';
    }

    summary += '💡 To configure missing services:\n';
    summary += '   1. Copy .env.example to .env.local\n';
    summary += '   2. Add your API keys\n';
    summary += '   3. Restart the application\n';

    return summary;
  }

  /**
   * Validates if system is ready for content generation
   */
  static canGenerateContent(): boolean {
    const config = this.validateConfiguration();
    return config.isValid && config.availableServices.includes('Reddit Story Scraping');
  }

  /**
   * Gets minimum required configuration for basic functionality
   */
  static getMinimumRequirements(): string[] {
    return [
      'Reddit Story Scraping (always available)',
      'At least one AI service (Claude or fallback)',
      'Basic file storage (local or R2)'
    ];
  }
}