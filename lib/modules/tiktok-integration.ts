/**
 * TikTok API Integration with Compliance Validation
 * Manages TikTok Creator account, affiliate dashboard, and content publishing
 */

import { ComplianceManager, ComplianceStatus } from './compliance-manager';

export enum TikTokContentType {
  VIDEO = "video",
  LIVE = "live",
  CAROUSEL = "carousel"
}

export enum PublishStatus {
  SCHEDULED = "scheduled",
  PUBLISHED = "published",
  FAILED = "failed",
  PENDING_REVIEW = "pending_review",
  COMPLIANCE_BLOCKED = "compliance_blocked"
}

export interface TikTokCredentials {
  creator_access_token: string;
  affiliate_access_token: string;
  app_id: string;
  app_secret: string;
  business_id: string;
  advertiser_id: string;
}

export interface TikTokVideoConfig {
  video_file_path: string;
  title: string;
  description: string;
  hashtags: string[];
  privacy_level?: string;  // public, friends, private
  allow_comments?: boolean;
  allow_duet?: boolean;
  allow_stitch?: boolean;
  affiliate_links?: string[];
  branded_content_disclosure?: boolean;
}

export interface TikTokPublishResult {
  video_id: string;
  tiktok_video_id?: string;
  status: PublishStatus;
  publish_time: Date;
  share_url?: string;
  compliance_validated: boolean;
  error_message?: string;
  performance_metrics?: Record<string, any>;
}

export interface TikTokMetrics {
  video_id: string;
  tiktok_video_id: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  profile_visits: number;
  follows: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  click_through_rate: number;
  affiliate_clicks: number;
  affiliate_conversions: number;
  revenue_generated: number;
}

interface CreatorAccountStatus {
  status: string;
  follower_count: number;
  following_count: number;
  total_videos: number;
  total_likes: number;
  verification_status: string;
  creator_fund_eligible: boolean;
  monetization_ready: boolean;
}

interface AffiliateAccountStatus {
  status: string;
  commission_rate: number;
  total_earnings: number;
  pending_payments: number;
  active_campaigns: number;
  compliance_score: number;
}

interface ComplianceAccountStatus {
  overall_compliance: string;
  community_guideline_strikes: number;
  advertising_policy_violations: number;
  affiliate_compliance_score: number;
  recent_violations: string[];
  compliance_training_completed: boolean;
}

interface MonetizationStatus {
  username: string;
  follower_count: number;
  monetization_ready: boolean;
  followers_needed: number;
  threshold: number;
  last_checked: string;
}

export class TikTokIntegration {
  private compliance_manager: ComplianceManager;
  private base_urls: Record<string, string>;
  private credentials: TikTokCredentials;
  private default_publish_settings: Record<string, any>;
  private compliance_hashtags: string[];

  constructor() {
    this.compliance_manager = new ComplianceManager();
    
    // TikTok API endpoints
    this.base_urls = {
      creator_api: "https://open-api.tiktok.com",
      business_api: "https://business-api.tiktok.com",
      affiliate_api: "https://affiliate-api.tiktok.com"
    };
    
    // Load credentials from environment
    this.credentials = {
      creator_access_token: process.env.TIKTOK_CREATOR_ACCESS_TOKEN || "",
      affiliate_access_token: process.env.TIKTOK_AFFILIATE_ACCESS_TOKEN || "",
      app_id: process.env.TIKTOK_APP_ID || "",
      app_secret: process.env.TIKTOK_APP_SECRET || "",
      business_id: process.env.TIKTOK_BUSINESS_ID || "",
      advertiser_id: process.env.TIKTOK_ADVERTISER_ID || ""
    };
    
    // Publishing settings with compliance defaults
    this.default_publish_settings = {
      privacy_level: "public",
      allow_comments: true,
      allow_duet: true,
      allow_stitch: true,
      branded_content_disclosure: true,  // Always required for affiliate content
      auto_add_compliance_hashtags: true
    };
    
    // Compliance hashtags (automatically added)
    this.compliance_hashtags = [
      "#ad", "#affiliate", "#sponsored", "#paidpartnership"
    ];
  }

  async publishVideo(video_id: string, video_config?: TikTokVideoConfig): Promise<TikTokPublishResult> {
    try {
      console.log(`Publishing video ${video_id} to TikTok`);
      
      if (!video_config) {
        throw new Error('Video config is required');
      }
      
      // MANDATORY: Final compliance check before publishing
      const compliance_result = await this.validatePrePublishCompliance(video_id, video_config);
      
      if (compliance_result.overall_status !== ComplianceStatus.COMPLIANT) {
        return {
          video_id,
          status: PublishStatus.COMPLIANCE_BLOCKED,
          publish_time: new Date(),
          compliance_validated: false,
          error_message: `Compliance validation failed: ${compliance_result.issues_found}`
        };
      }
      
      // Add mandatory compliance elements
      const compliant_config = await this.addComplianceElements(video_config);
      
      // Upload video to TikTok
      const upload_result = await this.uploadVideoToTikTok(compliant_config);
      
      if (!upload_result.success) {
        return {
          video_id,
          status: PublishStatus.FAILED,
          publish_time: new Date(),
          compliance_validated: true,
          error_message: upload_result.error
        };
      }
      
      // Create post with metadata
      const post_result = await this.createTikTokPost(upload_result.upload_id || '', compliant_config);
      
      // Track affiliate links
      if (compliant_config.affiliate_links) {
        await this.trackAffiliateLinks(video_id, compliant_config.affiliate_links);
      }
      
      // Log compliance-validated publication
      await this.logCompliantPublication(video_id, post_result.tiktok_video_id);
      
      const result: TikTokPublishResult = {
        video_id,
        tiktok_video_id: post_result.tiktok_video_id,
        status: PublishStatus.PUBLISHED,
        publish_time: new Date(),
        share_url: post_result.share_url,
        compliance_validated: true
      };
      
      console.log(`Successfully published video ${video_id} to TikTok: ${post_result.tiktok_video_id}`);
      return result;
      
    } catch (error) {
      console.error(`Failed to publish video ${video_id}:`, error);
      return {
        video_id,
        status: PublishStatus.FAILED,
        publish_time: new Date(),
        compliance_validated: false,
        error_message: String(error)
      };
    }
  }

  async scheduleVideo(
    video_id: string,
    publish_time: Date,
    video_config: TikTokVideoConfig
  ): Promise<TikTokPublishResult> {
    try {
      console.log(`Scheduling video ${video_id} for ${publish_time}`);
      
      // Validate compliance for scheduled content
      const compliance_result = await this.validatePrePublishCompliance(video_id, video_config);
      
      if (compliance_result.overall_status !== ComplianceStatus.COMPLIANT) {
        return {
          video_id,
          status: PublishStatus.COMPLIANCE_BLOCKED,
          publish_time,
          compliance_validated: false,
          error_message: `Compliance validation failed: ${compliance_result.issues_found}`
        };
      }
      
      // Add compliance elements
      const compliant_config = await this.addComplianceElements(video_config);
      
      // Schedule with TikTok API
      const schedule_result = await this.scheduleTikTokPost(compliant_config, publish_time);
      
      const result: TikTokPublishResult = {
        video_id,
        tiktok_video_id: schedule_result.scheduled_id,
        status: PublishStatus.SCHEDULED,
        publish_time,
        compliance_validated: true
      };
      
      console.log(`Successfully scheduled video ${video_id} for ${publish_time}`);
      return result;
      
    } catch (error) {
      console.error(`Failed to schedule video ${video_id}:`, error);
      throw error;
    }
  }

  async getVideoMetrics(tiktok_video_id: string): Promise<TikTokMetrics> {
    try {
      // Get basic video metrics from Creator API
      const video_metrics = await this.getCreatorVideoMetrics(tiktok_video_id);
      
      // Get affiliate performance metrics
      const affiliate_metrics = await this.getAffiliateMetrics(tiktok_video_id);
      
      // Calculate derived metrics
      const engagement_rate = this.calculateEngagementRate(video_metrics);
      const click_through_rate = this.calculateClickThroughRate(video_metrics, affiliate_metrics);
      
      const metrics: TikTokMetrics = {
        video_id: "",  // Would be mapped from internal tracking
        tiktok_video_id,
        views: video_metrics.views || 0,
        likes: video_metrics.likes || 0,
        comments: video_metrics.comments || 0,
        shares: video_metrics.shares || 0,
        profile_visits: video_metrics.profile_visits || 0,
        follows: video_metrics.follows || 0,
        engagement_rate,
        reach: video_metrics.reach || 0,
        impressions: video_metrics.impressions || 0,
        click_through_rate,
        affiliate_clicks: affiliate_metrics.clicks || 0,
        affiliate_conversions: affiliate_metrics.conversions || 0,
        revenue_generated: affiliate_metrics.revenue || 0.0
      };
      
      console.log(`Retrieved metrics for video ${tiktok_video_id}`);
      return metrics;
      
    } catch (error) {
      console.error(`Failed to get metrics for video ${tiktok_video_id}:`, error);
      throw error;
    }
  }

  async getAccountStatus(): Promise<Record<string, any>> {
    try {
      // Creator account status
      const creator_status = await this.getCreatorAccountStatus();
      
      // Affiliate account status
      const affiliate_status = await this.getAffiliateAccountStatus();
      
      // Compliance status
      const compliance_status = await this.getAccountComplianceStatus();
      
      return {
        creator_account: creator_status,
        affiliate_account: affiliate_status,
        compliance_status: compliance_status,
        overall_health: await this.assessAccountHealth(creator_status, affiliate_status, compliance_status),
        recommendations: await this.generateAccountRecommendations(creator_status, affiliate_status, compliance_status)
      };
      
    } catch (error) {
      console.error(`Failed to get account status:`, error);
      throw error;
    }
  }

  async getTrendingHashtags(category?: string): Promise<Array<Record<string, any>>> {
    try {
      // Get trending hashtags from TikTok Research API
      const trending_data = await this.getTrendingHashtagsFromAPI(category);
      
      // Filter for compliance (remove potentially problematic hashtags)
      const compliant_hashtags = await this.filterCompliantHashtags(trending_data);
      
      // Add performance scores
      const scored_hashtags = await this.scoreHashtagPerformance(compliant_hashtags);
      
      console.log(`Retrieved ${scored_hashtags.length} trending hashtags for category: ${category}`);
      return scored_hashtags;
      
    } catch (error) {
      console.error(`Failed to get trending hashtags:`, error);
      throw error;
    }
  }

  async validateContentPolicies(video_config: TikTokVideoConfig): Promise<Record<string, any>> {
    try {
      // Check community guidelines
      const community_check = await this.checkCommunityGuidelines(video_config);
      
      // Check advertising policies
      const advertising_check = await this.checkAdvertisingPolicies(video_config);
      
      // Check affiliate-specific policies
      const affiliate_check = await this.checkAffiliatePolicies(video_config);
      
      // Overall validation result
      const is_compliant = community_check.compliant && 
                          advertising_check.compliant && 
                          affiliate_check.compliant;
      
      const issues = [
        ...(community_check.issues || []),
        ...(advertising_check.issues || []),
        ...(affiliate_check.issues || [])
      ];
      
      return {
        compliant: is_compliant,
        community_guidelines: community_check,
        advertising_policies: advertising_check,
        affiliate_policies: affiliate_check,
        issues,
        recommendations: await this.generatePolicyRecommendations(issues)
      };
      
    } catch (error) {
      console.error(`Content policy validation failed:`, error);
      throw error;
    }
  }

  async getFollowerCount(username: string = "mustknowsecrets"): Promise<number> {
    try {
      if (!this.credentials.creator_access_token) {
        // Mock for development - simulate growing follower count
        const base_count = 750;
        const growth_simulation = Math.floor((Date.now() % 86400000) / 86400000 * 50);  // Simulate daily growth
        return base_count + growth_simulation;
      }
      
      // Call TikTok API
      const response = await fetch(`${this.base_urls.creator_api}/v2/user/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.credentials.creator_access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.data?.user?.follower_count) {
          return result.data.user.follower_count;
        } else if (result.data?.follower_count) {
          return result.data.follower_count;
        } else {
          console.warn(`Unexpected API response structure:`, result);
          return await this.getCachedFollowerCount(username);
        }
      } else {
        const error_text = await response.text();
        console.warn(`TikTok API error ${response.status}: ${error_text}`);
        return await this.getCachedFollowerCount(username);
      }
      
    } catch (error) {
      console.error(`Failed to get follower count:`, error);
      return await this.getCachedFollowerCount(username);
    }
  }

  async checkMonetizationEligibility(username: string = "mustknowsecrets"): Promise<MonetizationStatus> {
    try {
      const follower_count = await this.getFollowerCount(username);
      const monetization_ready = follower_count >= 1000;
      
      const status_data: MonetizationStatus = {
        username,
        follower_count,
        monetization_ready,
        followers_needed: Math.max(0, 1000 - follower_count),
        threshold: 1000,
        last_checked: new Date().toISOString()
      };
      
      // Store in tracking database
      await this.storeFollowerTracking(status_data);
      
      console.log(`Monetization check for @${username}: ${follower_count} followers, eligible: ${monetization_ready}`);
      return status_data;
      
    } catch (error) {
      console.error(`Failed to check monetization eligibility:`, error);
      throw error;
    }
  }

  // Private helper methods

  private async validatePrePublishCompliance(video_id: string, config: TikTokVideoConfig): Promise<any> {
    const content_data = {
      id: video_id,
      type: "tiktok_video",
      title: config.title,
      description: config.description,
      hashtags: config.hashtags,
      affiliate_links: config.affiliate_links || [],
      platform: "tiktok",
      branded_content: config.branded_content_disclosure || true
    };
    
    return await this.compliance_manager.validateContentCompliance(content_data);
  }

  private async addComplianceElements(config: TikTokVideoConfig): Promise<TikTokVideoConfig> {
    // Ensure branded content disclosure is enabled
    config.branded_content_disclosure = true;
    
    // Add compliance hashtags if not present
    const compliance_hashtags_needed = this.compliance_hashtags.filter(
      tag => !config.hashtags.includes(tag)
    );
    config.hashtags.push(...compliance_hashtags_needed);
    
    // Add disclosure to description if needed
    const disclosure_words = ["ad", "affiliate", "sponsored", "partnership"];
    if (!disclosure_words.some(word => config.description.toLowerCase().includes(word))) {
      config.description = `AD | ${config.description}`;
    }
    
    return config;
  }

  private async uploadVideoToTikTok(config: TikTokVideoConfig): Promise<{ success: boolean; upload_id?: string; error?: string }> {
    try {
      if (!this.credentials.creator_access_token) {
        console.warn("TikTok Creator API not configured, using mock upload");
        return { success: true, upload_id: `mock_upload_${new Date().toISOString()}` };
      }
      
      // In browser environment, we would handle file upload differently
      // This would typically go through a backend API endpoint
      const response = await fetch('/api/tiktok/upload-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          credentials: this.credentials
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        return { success: true, upload_id: result.upload_id };
      } else {
        const error = await response.text();
        return { success: false, error };
      }
      
    } catch (error) {
      console.error('Video upload failed:', error);
      return { success: false, error: String(error) };
    }
  }

  private async createTikTokPost(upload_id: string, config: TikTokVideoConfig): Promise<{ tiktok_video_id: string; share_url: string }> {
    try {
      if (!this.credentials.creator_access_token) {
        // Mock response for development
        return {
          tiktok_video_id: `mock_video_${new Date().toISOString()}`,
          share_url: `https://www.tiktok.com/@mock/video/mock_video_${new Date().toISOString()}`
        };
      }
      
      // In browser environment, call backend API
      const response = await fetch('/api/tiktok/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upload_id,
          config,
          credentials: this.credentials
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        return {
          tiktok_video_id: result.video_id,
          share_url: result.share_url
        };
      } else {
        const error = await response.text();
        throw new Error(`Post creation failed: ${error}`);
      }
      
    } catch (error) {
      console.error('Post creation failed:', error);
      throw error;
    }
  }

  private async trackAffiliateLinks(video_id: string, affiliate_links: string[]): Promise<void> {
    for (const link of affiliate_links) {
      console.log(`Tracking affiliate link for video ${video_id}: ${link}`);
      await this.storeAffiliateLinkRecord(video_id, link);
    }
  }

  private async logCompliantPublication(video_id: string, tiktok_video_id: string): Promise<void> {
    const publication_record = {
      video_id,
      tiktok_video_id,
      publication_time: new Date().toISOString(),
      compliance_validated: true,
      platform: "tiktok"
    };
    
    console.log(`Logged compliant publication: ${video_id} -> ${tiktok_video_id}`);
    // Store in compliance database via API
    await fetch('/api/compliance/log-publication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publication_record)
    });
  }

  private async getCreatorVideoMetrics(tiktok_video_id: string): Promise<Record<string, any>> {
    // Mock implementation - replace with actual API calls
    return {
      views: 10000,
      likes: 500,
      comments: 50,
      shares: 25,
      profile_visits: 100,
      follows: 10,
      reach: 8000,
      impressions: 12000
    };
  }

  private async getAffiliateMetrics(tiktok_video_id: string): Promise<Record<string, any>> {
    // Mock implementation - replace with actual affiliate API calls
    return {
      clicks: 250,
      conversions: 12,
      revenue: 180.50
    };
  }

  private calculateEngagementRate(metrics: Record<string, any>): number {
    const views = metrics.views || 0;
    if (views === 0) return 0.0;
    
    const engagements = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
    return engagements / views;
  }

  private calculateClickThroughRate(video_metrics: Record<string, any>, affiliate_metrics: Record<string, any>): number {
    const views = video_metrics.views || 0;
    const clicks = affiliate_metrics.clicks || 0;
    
    if (views === 0) return 0.0;
    return clicks / views;
  }

  private async getCachedFollowerCount(username: string): Promise<number> {
    // Would read from local cache/database
    // For now, return a reasonable mock value
    return 950;  // Just under 1K threshold
  }

  private async storeFollowerTracking(data: MonetizationStatus): Promise<void> {
    console.log(`Stored follower tracking: ${data.follower_count} followers for @${data.username}`);
    // Would store in database for historical tracking via API
    await fetch('/api/tiktok/follower-tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  private async getCreatorAccountStatus(): Promise<CreatorAccountStatus> {
    const follower_count = await this.getFollowerCount();
    
    return {
      status: "active",
      follower_count,
      following_count: 500,
      total_videos: 25,
      total_likes: 50000,
      verification_status: "unverified",
      creator_fund_eligible: follower_count >= 1000,
      monetization_ready: follower_count >= 1000
    };
  }

  private async getAffiliateAccountStatus(): Promise<AffiliateAccountStatus> {
    return {
      status: "approved",
      commission_rate: 0.08,
      total_earnings: 1250.75,
      pending_payments: 89.25,
      active_campaigns: 3,
      compliance_score: 0.95
    };
  }

  private async getAccountComplianceStatus(): Promise<ComplianceAccountStatus> {
    return {
      overall_compliance: "good",
      community_guideline_strikes: 0,
      advertising_policy_violations: 0,
      affiliate_compliance_score: 0.98,
      recent_violations: [],
      compliance_training_completed: true
    };
  }

  private async assessAccountHealth(
    creator: CreatorAccountStatus,
    affiliate: AffiliateAccountStatus,
    compliance: ComplianceAccountStatus
  ): Promise<string> {
    if (creator.status === "active" && 
        affiliate.status === "approved" &&
        compliance.overall_compliance === "good") {
      return "excellent";
    } else if (compliance.community_guideline_strikes > 0) {
      return "needs_attention";
    } else {
      return "good";
    }
  }

  private async generateAccountRecommendations(
    creator: CreatorAccountStatus,
    affiliate: AffiliateAccountStatus,
    compliance: ComplianceAccountStatus
  ): Promise<string[]> {
    const recommendations: string[] = [];
    
    if (creator.follower_count < 10000) {
      recommendations.push("Focus on growing follower base to 10K+ for better monetization");
    }
    
    if (affiliate.compliance_score < 0.95) {
      recommendations.push("Review affiliate compliance training to improve score");
    }
    
    return recommendations;
  }

  // Additional helper methods

  private async storeAffiliateLinkRecord(video_id: string, link: string): Promise<void> {
    console.log(`Stored affiliate link record for ${video_id}`);
    await fetch('/api/compliance/affiliate-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_id, link, timestamp: new Date().toISOString() })
    });
  }

  private async scheduleTikTokPost(config: TikTokVideoConfig, publish_time: Date): Promise<{ scheduled_id: string }> {
    return { scheduled_id: `scheduled_${new Date().toISOString()}` };
  }

  private async getTrendingHashtagsFromAPI(category?: string): Promise<Array<Record<string, any>>> {
    return [{ hashtag: "#trending1", usage_count: 1000000 }];
  }

  private async filterCompliantHashtags(hashtags: Array<Record<string, any>>): Promise<Array<Record<string, any>>> {
    return hashtags;  // Would implement filtering logic
  }

  private async scoreHashtagPerformance(hashtags: Array<Record<string, any>>): Promise<Array<Record<string, any>>> {
    return hashtags;  // Would implement scoring logic
  }

  private async checkCommunityGuidelines(config: TikTokVideoConfig): Promise<{ compliant: boolean; issues: string[] }> {
    return { compliant: true, issues: [] };
  }

  private async checkAdvertisingPolicies(config: TikTokVideoConfig): Promise<{ compliant: boolean; issues: string[] }> {
    return { compliant: true, issues: [] };
  }

  private async checkAffiliatePolicies(config: TikTokVideoConfig): Promise<{ compliant: boolean; issues: string[] }> {
    return { compliant: true, issues: [] };
  }

  private async generatePolicyRecommendations(issues: string[]): Promise<string[]> {
    return ["Ensure all affiliate content includes proper disclosure"];
  }
}

// Export default instance
export const tiktokIntegration = new TikTokIntegration();