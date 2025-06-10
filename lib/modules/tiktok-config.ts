/**
 * TikTok Automation Configuration Manager
 * Centralizes all configuration settings and environment variables
 */

import fs from 'fs';
import path from 'path';

enum VideoMode {
  AI_GENERATED = "ai_generated",
  MANUAL_RECORDED = "manual_recorded",
  HYBRID = "hybrid"
}

enum UploadMethod {
  MANUAL = "manual",
  AUTOMATED = "automated"
}

enum ViralityLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  EXTREME = "extreme"
}

interface TikTokConfig {
  // Monetization Settings
  monetization_enabled: boolean;
  follower_threshold: number;
  video_mode: VideoMode;
  upload_method: UploadMethod;
  ai_disclosure_required: boolean;
  username: string;
  
  // API Credentials
  creator_access_token: string;
  app_id: string;
  app_secret: string;
  business_id: string;
  advertiser_id: string;
  affiliate_access_token: string;
  
  // Content Strategy
  generation_frequency: string;
  max_controversy_level: number;
  min_virality_score: ViralityLevel;
  topic_rotation_enabled: boolean;
  
  // Automation Settings
  auto_posting_enabled: boolean;
  post_schedule_morning: string;
  post_schedule_evening: string;
  max_posts_per_day: number;
  
  // Affiliate System
  url_shortener_api: string;
  url_shortener_service: string;
  revenue_tracking_enabled: boolean;
  track_affiliate_conversions: boolean;
  
  // Compliance
  branded_content_disclosure_required: boolean;
  compliance_validation_strict: boolean;
  manual_review_required: boolean;
  
  // AI Services
  ai_face_service: string;
  ai_face_api_key: string;
  ai_voice_service: string;
  ai_voice_api_key: string;
  
  // Performance Tracking
  analytics_enabled: boolean;
  performance_check_interval: number;
  follower_growth_tracking: boolean;
  
  // Notifications
  follower_milestone_webhook: string;
  monetization_activation_webhook: string;
  performance_alert_webhook: string;
  
  // Security
  api_rate_limit_enabled: boolean;
  max_requests_per_hour: number;
  content_filter_enabled: boolean;
  shadowban_risk_monitoring: boolean;
  
  // Development
  development_mode: boolean;
  verbose_logging: boolean;
  test_mode: boolean;
}

interface ValidationResult {
  valid: boolean;
  issues: string[];
  warnings: string[];
  config_summary: {
    monetization_enabled: boolean;
    development_mode: boolean;
    test_mode: boolean;
    auto_posting: boolean;
  };
}

interface DebugInfo {
  config_file: string;
  config_loaded: boolean;
  environment_variables: Record<string, string>;
  config_object: TikTokConfig;
}

export class TikTokConfigManager {
  private envFile: string;
  public config: TikTokConfig;

  constructor(envFile?: string) {
    this.envFile = envFile || ".env";
    this.config = this.loadConfig();
  }

  private loadConfig(): TikTokConfig {
    try {
      // Load from .env file if it exists
      const envPath = path.resolve(this.envFile);
      if (fs.existsSync(envPath)) {
        this.loadEnvFile(envPath);
      }
      
      // Create config from environment variables
      const configData: TikTokConfig = {
        // Monetization Settings
        monetization_enabled: this.getBool("TIKTOK_MONETIZATION_ENABLED", false),
        follower_threshold: this.getInt("TIKTOK_FOLLOWER_THRESHOLD", 1000),
        video_mode: this.getEnum("VIDEO_MODE", VideoMode, VideoMode.AI_GENERATED),
        upload_method: this.getEnum("UPLOAD_METHOD", UploadMethod, UploadMethod.MANUAL),
        ai_disclosure_required: this.getBool("AI_DISCLOSURE_REQUIRED", true),
        username: process.env.TIKTOK_USERNAME || "mustknowsecrets",
        
        // API Credentials
        creator_access_token: process.env.TIKTOK_CREATOR_ACCESS_TOKEN || "",
        app_id: process.env.TIKTOK_APP_ID || "",
        app_secret: process.env.TIKTOK_APP_SECRET || "",
        business_id: process.env.TIKTOK_BUSINESS_ID || "",
        advertiser_id: process.env.TIKTOK_ADVERTISER_ID || "",
        affiliate_access_token: process.env.TIKTOK_AFFILIATE_ACCESS_TOKEN || "",
        
        // Content Strategy
        generation_frequency: process.env.CONTENT_GENERATION_FREQUENCY || "daily",
        max_controversy_level: this.getInt("MAX_CONTROVERSY_LEVEL", 8),
        min_virality_score: this.getEnum("MIN_VIRALITY_SCORE", ViralityLevel, ViralityLevel.MEDIUM),
        topic_rotation_enabled: this.getBool("TOPIC_ROTATION_ENABLED", true),
        
        // Automation Settings
        auto_posting_enabled: this.getBool("AUTO_POSTING_ENABLED", false),
        post_schedule_morning: process.env.POST_SCHEDULE_MORNING || "06:00",
        post_schedule_evening: process.env.POST_SCHEDULE_EVENING || "19:00",
        max_posts_per_day: this.getInt("MAX_POSTS_PER_DAY", 2),
        
        // Affiliate System
        url_shortener_api: process.env.URL_SHORTENER_API || "",
        url_shortener_service: process.env.URL_SHORTENER_SERVICE || "bitly",
        revenue_tracking_enabled: this.getBool("REVENUE_TRACKING_ENABLED", true),
        track_affiliate_conversions: this.getBool("TRACK_AFFILIATE_CONVERSIONS", true),
        
        // Compliance
        branded_content_disclosure_required: this.getBool("BRANDED_CONTENT_DISCLOSURE_REQUIRED", true),
        compliance_validation_strict: this.getBool("COMPLIANCE_VALIDATION_STRICT", true),
        manual_review_required: this.getBool("MANUAL_REVIEW_REQUIRED", true),
        
        // AI Services
        ai_face_service: process.env.AI_FACE_SERVICE || "runwayml",
        ai_face_api_key: process.env.AI_FACE_API_KEY || "",
        ai_voice_service: process.env.AI_VOICE_SERVICE || "elevenlabs",
        ai_voice_api_key: process.env.AI_VOICE_API_KEY || "",
        
        // Performance Tracking
        analytics_enabled: this.getBool("TIKTOK_ANALYTICS_ENABLED", true),
        performance_check_interval: this.getInt("PERFORMANCE_CHECK_INTERVAL", 6),
        follower_growth_tracking: this.getBool("FOLLOWER_GROWTH_TRACKING", true),
        
        // Notifications
        follower_milestone_webhook: process.env.FOLLOWER_MILESTONE_WEBHOOK || "",
        monetization_activation_webhook: process.env.MONETIZATION_ACTIVATION_WEBHOOK || "",
        performance_alert_webhook: process.env.PERFORMANCE_ALERT_WEBHOOK || "",
        
        // Security
        api_rate_limit_enabled: this.getBool("API_RATE_LIMIT_ENABLED", true),
        max_requests_per_hour: this.getInt("MAX_REQUESTS_PER_HOUR", 100),
        content_filter_enabled: this.getBool("CONTENT_FILTER_ENABLED", true),
        shadowban_risk_monitoring: this.getBool("SHADOWBAN_RISK_MONITORING", true),
        
        // Development
        development_mode: this.getBool("DEVELOPMENT_MODE", true),
        verbose_logging: this.getBool("VERBOSE_LOGGING", false),
        test_mode: this.getBool("TEST_MODE", true)
      };
      
      console.log("TikTok configuration loaded successfully");
      return configData;
      
    } catch (error) {
      console.error(`Failed to load configuration: ${error}`);
      // Return default configuration
      return this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): TikTokConfig {
    return {
      monetization_enabled: false,
      follower_threshold: 1000,
      video_mode: VideoMode.AI_GENERATED,
      upload_method: UploadMethod.MANUAL,
      ai_disclosure_required: true,
      username: "mustknowsecrets",
      creator_access_token: "",
      app_id: "",
      app_secret: "",
      business_id: "",
      advertiser_id: "",
      affiliate_access_token: "",
      generation_frequency: "daily",
      max_controversy_level: 8,
      min_virality_score: ViralityLevel.MEDIUM,
      topic_rotation_enabled: true,
      auto_posting_enabled: false,
      post_schedule_morning: "06:00",
      post_schedule_evening: "19:00",
      max_posts_per_day: 2,
      url_shortener_api: "",
      url_shortener_service: "bitly",
      revenue_tracking_enabled: true,
      track_affiliate_conversions: true,
      branded_content_disclosure_required: true,
      compliance_validation_strict: true,
      manual_review_required: true,
      ai_face_service: "runwayml",
      ai_face_api_key: "",
      ai_voice_service: "elevenlabs",
      ai_voice_api_key: "",
      analytics_enabled: true,
      performance_check_interval: 6,
      follower_growth_tracking: true,
      follower_milestone_webhook: "",
      monetization_activation_webhook: "",
      performance_alert_webhook: "",
      api_rate_limit_enabled: true,
      max_requests_per_hour: 100,
      content_filter_enabled: true,
      shadowban_risk_monitoring: true,
      development_mode: true,
      verbose_logging: false,
      test_mode: true
    };
  }

  private loadEnvFile(envPath: string): void {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          const value = valueParts.join('=');
          process.env[key.trim()] = value.trim();
        }
      }
    } catch (error) {
      console.warn(`Failed to load .env file: ${error}`);
    }
  }

  private getBool(key: string, defaultValue: boolean): boolean {
    const value = process.env[key]?.toLowerCase() || String(defaultValue);
    return ['true', '1', 'yes', 'on'].includes(value);
  }

  private getInt(key: string, defaultValue: number): number {
    try {
      return parseInt(process.env[key] || String(defaultValue), 10);
    } catch {
      return defaultValue;
    }
  }

  private getEnum<T extends Record<string, string>>(
    key: string,
    enumClass: T,
    defaultValue: T[keyof T]
  ): T[keyof T] {
    try {
      const value = process.env[key] || defaultValue;
      return Object.values(enumClass).includes(value as T[keyof T]) 
        ? (value as T[keyof T]) 
        : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  isMonetizationReady(followerCount: number): boolean {
    return this.config.monetization_enabled && followerCount >= this.config.follower_threshold;
  }

  shouldAutoPost(followerCount: number): boolean {
    return (
      this.config.auto_posting_enabled &&
      this.isMonetizationReady(followerCount) &&
      !this.config.test_mode
    );
  }

  getPostingSchedule(): Record<string, string> {
    return {
      morning: this.config.post_schedule_morning,
      evening: this.config.post_schedule_evening,
      max_per_day: String(this.config.max_posts_per_day)
    };
  }

  getContentStrategyConfig(): Record<string, any> {
    return {
      frequency: this.config.generation_frequency,
      max_controversy: this.config.max_controversy_level,
      min_virality: this.config.min_virality_score,
      rotation_enabled: this.config.topic_rotation_enabled
    };
  }

  getComplianceConfig(): Record<string, boolean> {
    return {
      branded_content_disclosure: this.config.branded_content_disclosure_required,
      strict_validation: this.config.compliance_validation_strict,
      manual_review: this.config.manual_review_required,
      ai_disclosure: this.config.ai_disclosure_required
    };
  }

  updateConfig(updates: Partial<TikTokConfig>): boolean {
    try {
      // Update config object
      Object.assign(this.config, updates);
      
      for (const [key, value] of Object.entries(updates)) {
        console.log(`Updated config: ${key} = ${value}`);
      }
      
      return true;
      
    } catch (error) {
      console.error(`Failed to update configuration: ${error}`);
      return false;
    }
  }

  saveConfigToFile(filepath?: string): boolean {
    try {
      const targetPath = filepath || "tiktok_config.json";
      
      const configJson = JSON.stringify(this.config, null, 2);
      fs.writeFileSync(targetPath, configJson, 'utf8');
      
      console.log(`Configuration saved to ${targetPath}`);
      return true;
      
    } catch (error) {
      console.error(`Failed to save configuration: ${error}`);
      return false;
    }
  }

  validateConfig(): ValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];
    
    // Check API credentials
    if (!this.config.creator_access_token && !this.config.development_mode) {
      issues.push("Missing TikTok Creator API access token");
    }
    
    if (!this.config.app_id && !this.config.development_mode) {
      issues.push("Missing TikTok App ID");
    }
    
    // Check monetization settings
    if (this.config.monetization_enabled && !this.config.affiliate_access_token) {
      warnings.push("Monetization enabled but no affiliate access token configured");
    }
    
    // Check automation settings
    if (this.config.auto_posting_enabled && this.config.manual_review_required) {
      warnings.push("Auto-posting enabled but manual review required (potential conflict)");
    }
    
    // Check AI service configuration
    if (this.config.video_mode === VideoMode.AI_GENERATED && !this.config.ai_face_api_key) {
      warnings.push("AI-generated video mode but no AI face API key configured");
    }
    
    // Check compliance settings
    if (this.config.monetization_enabled && !this.config.branded_content_disclosure_required) {
      issues.push("Monetization enabled but branded content disclosure not required (compliance risk)");
    }
    
    return {
      valid: issues.length === 0,
      issues: issues,
      warnings: warnings,
      config_summary: {
        monetization_enabled: this.config.monetization_enabled,
        development_mode: this.config.development_mode,
        test_mode: this.config.test_mode,
        auto_posting: this.config.auto_posting_enabled
      }
    };
  }

  getDebugInfo(): DebugInfo {
    return {
      config_file: this.envFile,
      config_loaded: true,
      environment_variables: Object.fromEntries(
        Object.entries(process.env)
          .filter(([key]) => key.startsWith("TIKTOK_") || key.startsWith("AI_") || key.startsWith("URL_"))
          .map(([key, value]) => [
            key,
            key.toLowerCase().includes("token") || 
            key.toLowerCase().includes("key") || 
            key.toLowerCase().includes("secret") ? "***" : value || ""
          ])
      ),
      config_object: this.config
    };
  }
}

// Global configuration instance
export const tikTokConfigManager = new TikTokConfigManager();

export function getConfig(): TikTokConfig {
  return tikTokConfigManager.config;
}

export function reloadConfig(): TikTokConfig {
  const newManager = new TikTokConfigManager();
  Object.assign(tikTokConfigManager, newManager);
  return tikTokConfigManager.config;
}