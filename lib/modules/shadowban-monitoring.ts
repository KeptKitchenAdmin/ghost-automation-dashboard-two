/**
 * TikTok Shadowban Monitoring and Detection System
 * Real-time monitoring for account health and shadowban detection
 */

import { open, Database } from '../mocks/sqlite';
import path from 'path';

interface ShadowbanThresholds {
  view_drop_severe: number;
  view_drop_moderate: number;
  reach_decline_severe: number;
  engagement_low: number;
  fyp_disappearance: number;
  comment_visibility: number;
  hashtag_performance: number;
}

interface RecoveryStrategy {
  action: string;
  posting_frequency: string;
  content_changes: string;
  engagement_focus: string;
}

interface RecoveryStrategies {
  low_risk: RecoveryStrategy;
  medium_risk: RecoveryStrategy;
  high_risk: RecoveryStrategy;
  severe_risk: RecoveryStrategy;
}

interface AccountMetrics {
  id?: number;
  account_id: string;
  timestamp?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  following: number;
  fyp_appearances: number;
  reach: number;
  engagement_rate: number;
  video_count: number;
}

interface VideoPerformance {
  id?: number;
  video_id: string;
  account_id: string;
  posted_at?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  hashtags: string;
  content_type?: string;
  safety_score?: number;
  shadowban_risk?: string;
  timestamp?: string;
}

interface ShadowbanAlert {
  id?: number;
  account_id: string;
  alert_type: string;
  severity: string;
  metrics: string;
  recovery_action?: string;
  resolved?: boolean;
  timestamp?: string;
}

interface ShadowbanAnalysis {
  account_id: string;
  risk_level: string;
  risk_score: number;
  risk_factors: string[];
  recovery_strategy: RecoveryStrategy;
  metrics_comparison: {
    recent: Record<string, number>;
    baseline: Record<string, number>;
  };
  recommendations: string[];
  timestamp: string;
}

interface PerformanceTrends {
  views: string;
  engagement: string;
  followers: string;
  overall_direction: string;
}

interface PostingPatterns {
  frequency: {
    frequency: string;
    average_interval_days: number;
    total_posts: number;
    assessment: string;
  };
  optimal_times: {
    best_hours: string[];
    best_days: string[];
    worst_times: string[];
    confidence: string;
  };
  posting_consistency: string;
  recommendations: string[];
}

interface AccountHealthReport {
  account_id: string;
  generated_at: string;
  overall_health: string;
  current_risk: ShadowbanAnalysis;
  recent_alerts: ShadowbanAlert[];
  performance_trends: PerformanceTrends;
  posting_patterns: PostingPatterns;
  recommendations: {
    immediate: string[];
    short_term: string[];
    long_term: string[];
  };
}

export class ShadowbanMonitor {
  private db: Database | null = null;
  private dbPath: string;

  private thresholds: ShadowbanThresholds = {
    view_drop_severe: 70,      // 70%+ view drop
    view_drop_moderate: 40,    // 40%+ view drop
    reach_decline_severe: 60,  // 60%+ reach decline
    engagement_low: 0.015,     // Below 1.5% engagement
    fyp_disappearance: 0.05,   // Less than 5% FYP appearance
    comment_visibility: 0.3,   // Less than 30% comments visible
    hashtag_performance: 0.2   // 20% of normal hashtag performance
  };

  private recoveryStrategies: RecoveryStrategies = {
    low_risk: {
      action: "monitor_closely",
      posting_frequency: "maintain",
      content_changes: "minor_variations",
      engagement_focus: "increase_authentic"
    },
    medium_risk: {
      action: "content_adjustment",
      posting_frequency: "reduce_25_percent",
      content_changes: "moderate_pivot",
      engagement_focus: "community_building"
    },
    high_risk: {
      action: "immediate_pause",
      posting_frequency: "pause_48_hours",
      content_changes: "major_strategy_shift",
      engagement_focus: "organic_only"
    },
    severe_risk: {
      action: "full_reset",
      posting_frequency: "pause_1_week",
      content_changes: "complete_rebrand",
      engagement_focus: "manual_recovery"
    }
  };

  constructor(dbPath: string = "data/shadowban_monitoring.db") {
    this.dbPath = dbPath;
  }

  async initDatabase(): Promise<void> {
    try {
      // Ensure data directory exists
      const fs = await import('fs/promises');
      const dbDir = path.dirname(this.dbPath);
      await fs.mkdir(dbDir, { recursive: true });

      // Open database
      this.db = await open({
        filename: this.dbPath
      });

      // Create tables
      await this.createTables();
      console.log('Shadowban monitoring database initialized');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    // Account metrics table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS account_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        views INTEGER,
        likes INTEGER,
        comments INTEGER,
        shares INTEGER,
        followers INTEGER,
        following INTEGER,
        fyp_appearances INTEGER,
        reach INTEGER,
        engagement_rate REAL,
        video_count INTEGER
      )
    `);

    // Video performance table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS video_performance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT NOT NULL,
        account_id TEXT NOT NULL,
        posted_at DATETIME,
        views INTEGER,
        likes INTEGER,
        comments INTEGER,
        shares INTEGER,
        hashtags TEXT,
        content_type TEXT,
        safety_score INTEGER,
        shadowban_risk TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Shadowban alerts table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS shadowban_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id TEXT NOT NULL,
        alert_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        metrics TEXT,
        recovery_action TEXT,
        resolved BOOLEAN DEFAULT FALSE,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async recordAccountMetrics(accountId: string, metrics: Partial<AccountMetrics>): Promise<ShadowbanAnalysis> {
    if (!this.db) {
      await this.initDatabase();
    }

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    await this.db.run(`
      INSERT INTO account_metrics 
      (account_id, views, likes, comments, shares, followers, following, 
       fyp_appearances, reach, engagement_rate, video_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      accountId,
      metrics.views || 0,
      metrics.likes || 0,
      metrics.comments || 0,
      metrics.shares || 0,
      metrics.followers || 0,
      metrics.following || 0,
      metrics.fyp_appearances || 0,
      metrics.reach || 0,
      metrics.engagement_rate || 0.0,
      metrics.video_count || 0
    ]);

    // Check for shadowban indicators after recording
    return this.analyzeShadowbanRisk(accountId);
  }

  async recordVideoPerformance(videoData: Partial<VideoPerformance>): Promise<void> {
    if (!this.db) {
      await this.initDatabase();
    }

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    await this.db.run(`
      INSERT INTO video_performance 
      (video_id, account_id, posted_at, views, likes, comments, shares, 
       hashtags, content_type, safety_score, shadowban_risk)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      videoData.video_id,
      videoData.account_id,
      videoData.posted_at,
      videoData.views || 0,
      videoData.likes || 0,
      videoData.comments || 0,
      videoData.shares || 0,
      JSON.stringify(videoData.hashtags || []),
      videoData.content_type,
      videoData.safety_score || 0,
      videoData.shadowban_risk || 'unknown'
    ]);
  }

  async analyzeShadowbanRisk(accountId: string): Promise<ShadowbanAnalysis> {
    // Get recent metrics (last 7 days)
    const recentMetrics = await this.getRecentMetrics(accountId, 7);
    if (recentMetrics.length < 2) {
      return {
        account_id: accountId,
        risk_level: "insufficient_data",
        risk_score: 0,
        risk_factors: ["Need more data points"],
        recovery_strategy: this.recoveryStrategies.low_risk,
        metrics_comparison: { recent: {}, baseline: {} },
        recommendations: [],
        timestamp: new Date().toISOString()
      };
    }

    // Get baseline metrics (7-14 days ago)
    const baselineMetrics = await this.getBaselineMetrics(accountId, 14);
    if (baselineMetrics.length < 2) {
      return {
        account_id: accountId,
        risk_level: "insufficient_baseline",
        risk_score: 0,
        risk_factors: ["Need baseline data"],
        recovery_strategy: this.recoveryStrategies.low_risk,
        metrics_comparison: { recent: {}, baseline: {} },
        recommendations: [],
        timestamp: new Date().toISOString()
      };
    }

    const riskFactors: string[] = [];
    let riskScore = 0;

    // Calculate average metrics
    const recentAvg = this.calculateAverageMetrics(recentMetrics);
    const baselineAvg = this.calculateAverageMetrics(baselineMetrics);

    // 1. Check view drop
    if (baselineAvg.views > 0) {
      const viewDrop = ((baselineAvg.views - recentAvg.views) / baselineAvg.views) * 100;

      if (viewDrop >= this.thresholds.view_drop_severe) {
        riskFactors.push(`Severe view drop: ${viewDrop.toFixed(1)}%`);
        riskScore += 40;
      } else if (viewDrop >= this.thresholds.view_drop_moderate) {
        riskFactors.push(`Moderate view drop: ${viewDrop.toFixed(1)}%`);
        riskScore += 20;
      }
    }

    // 2. Check reach decline
    if (baselineAvg.reach > 0) {
      const reachDecline = ((baselineAvg.reach - recentAvg.reach) / baselineAvg.reach) * 100;

      if (reachDecline >= this.thresholds.reach_decline_severe) {
        riskFactors.push(`Severe reach decline: ${reachDecline.toFixed(1)}%`);
        riskScore += 35;
      }
    }

    // 3. Check engagement rate
    if (recentAvg.engagement_rate < this.thresholds.engagement_low) {
      riskFactors.push(`Low engagement rate: ${recentAvg.engagement_rate.toFixed(3)}`);
      riskScore += 25;
    }

    // 4. Check FYP appearances
    if (recentAvg.fyp_appearances < this.thresholds.fyp_disappearance) {
      riskFactors.push("FYP disappearance detected");
      riskScore += 30;
    }

    // 5. Check hashtag performance
    const hashtagPerformance = await this.analyzeHashtagPerformance(accountId);
    if (hashtagPerformance < this.thresholds.hashtag_performance) {
      riskFactors.push(`Poor hashtag performance: ${(hashtagPerformance * 100).toFixed(1)}%`);
      riskScore += 15;
    }

    // Determine risk level
    let riskLevel: string;
    if (riskScore >= 80) {
      riskLevel = "severe";
    } else if (riskScore >= 60) {
      riskLevel = "high";
    } else if (riskScore >= 30) {
      riskLevel = "medium";
    } else if (riskScore >= 15) {
      riskLevel = "low";
    } else {
      riskLevel = "minimal";
    }

    // Generate alert if necessary
    if (["medium", "high", "severe"].includes(riskLevel)) {
      await this.createShadowbanAlert(accountId, riskLevel, riskFactors, recentAvg);
    }

    const recoveryKey = `${riskLevel}_risk` as keyof RecoveryStrategies;
    
    return {
      account_id: accountId,
      risk_level: riskLevel,
      risk_score: riskScore,
      risk_factors: riskFactors,
      recovery_strategy: this.recoveryStrategies[recoveryKey] || this.recoveryStrategies.low_risk,
      metrics_comparison: {
        recent: recentAvg,
        baseline: baselineAvg
      },
      recommendations: this.getRecoveryRecommendations(riskLevel, riskFactors),
      timestamp: new Date().toISOString()
    };
  }

  private async getRecentMetrics(accountId: string, days: number = 7): Promise<AccountMetrics[]> {
    if (!this.db) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const rows = await this.db.all(`
      SELECT * FROM account_metrics 
      WHERE account_id = ? AND timestamp >= ?
      ORDER BY timestamp DESC
    `, [accountId, cutoffDate.toISOString()]);

    return rows as AccountMetrics[];
  }

  private async getBaselineMetrics(accountId: string, days: number = 14): Promise<AccountMetrics[]> {
    if (!this.db) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - Math.floor(days / 2));

    const rows = await this.db.all(`
      SELECT * FROM account_metrics 
      WHERE account_id = ? AND timestamp BETWEEN ? AND ?
      ORDER BY timestamp DESC
    `, [accountId, startDate.toISOString(), endDate.toISOString()]);

    return rows as AccountMetrics[];
  }

  private calculateAverageMetrics(metrics: AccountMetrics[]): Record<string, number> {
    if (metrics.length === 0) {
      return {};
    }

    const numericFields = ['views', 'likes', 'comments', 'shares', 'followers', 
                          'fyp_appearances', 'reach', 'engagement_rate'];

    const averages: Record<string, number> = {};
    
    for (const field of numericFields) {
      const values = metrics
        .map(m => (m as any)[field])
        .filter(v => v != null && !isNaN(v));
      
      averages[field] = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }

    return averages;
  }

  private async analyzeHashtagPerformance(accountId: string): Promise<number> {
    if (!this.db) return 0.5;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    const recentVideos = await this.db.all(`
      SELECT views, hashtags FROM video_performance 
      WHERE account_id = ? AND timestamp >= ?
      ORDER BY timestamp DESC LIMIT 10
    `, [accountId, cutoffDate.toISOString()]);

    if (recentVideos.length === 0) {
      return 0.5; // Default moderate performance
    }

    // Simple hashtag performance calculation
    const totalViews = recentVideos.reduce((sum, video) => sum + (video.views || 0), 0);
    const avgViews = totalViews / recentVideos.length;

    // Compare to account baseline (simplified)
    const baselineAvg = 1000; // This would be calculated from historical data

    const performanceRatio = baselineAvg > 0 ? avgViews / baselineAvg : 0.5;

    return Math.min(performanceRatio, 1.0);
  }

  private async createShadowbanAlert(
    accountId: string,
    severity: string,
    riskFactors: string[],
    metrics: Record<string, number>
  ): Promise<void> {
    if (!this.db) return;

    const recoveryKey = `${severity}_risk` as keyof RecoveryStrategies;
    const recoveryAction = this.recoveryStrategies[recoveryKey]?.action || "monitor";

    await this.db.run(`
      INSERT INTO shadowban_alerts 
      (account_id, alert_type, severity, metrics, recovery_action)
      VALUES (?, ?, ?, ?, ?)
    `, [
      accountId,
      "shadowban_risk_detected",
      severity,
      JSON.stringify({
        risk_factors: riskFactors,
        metrics: metrics
      }),
      recoveryAction
    ]);

    console.warn(`Shadowban alert created for ${accountId}: ${severity} risk`);
  }

  private getRecoveryRecommendations(riskLevel: string, riskFactors: string[]): string[] {
    const recommendations: string[] = [];

    if (["high", "severe"].includes(riskLevel)) {
      recommendations.push("IMMEDIATE: Pause all posting for 48-72 hours");
      recommendations.push("Review recent content for community guideline violations");
      recommendations.push("Engage authentically with other accounts (no automation)");
    }

    const riskFactorsStr = riskFactors.join(" ").toLowerCase();

    if (riskFactorsStr.includes("view drop")) {
      recommendations.push("Diversify content types and formats");
      recommendations.push("Use trending but relevant hashtags");
      recommendations.push("Post at different times to test optimal schedule");
    }

    if (riskFactorsStr.includes("engagement")) {
      recommendations.push("Focus on community building over promotion");
      recommendations.push("Ask questions and encourage comments");
      recommendations.push("Respond to all comments quickly");
    }

    if (riskFactorsStr.includes("fyp")) {
      recommendations.push("Create more discoverable content");
      recommendations.push("Use popular trending sounds");
      recommendations.push("Optimize video length for your audience");
    }

    if (riskFactorsStr.includes("hashtag")) {
      recommendations.push("Research and use new relevant hashtags");
      recommendations.push("Mix popular and niche hashtags");
      recommendations.push("Avoid overused or flagged hashtags");
    }

    // Always include general recommendations
    recommendations.push(
      "Monitor metrics daily for improvement",
      "Maintain consistent but not excessive posting",
      "Focus on educational and entertaining content"
    );

    return recommendations;
  }

  async getAccountHealthReport(accountId: string): Promise<AccountHealthReport> {
    // Get current risk analysis
    const riskAnalysis = await this.analyzeShadowbanRisk(accountId);

    // Get recent alerts
    const recentAlerts = await this.getRecentAlerts(accountId, 30);

    // Get performance trends
    const performanceTrends = await this.calculatePerformanceTrends(accountId);

    // Get posting pattern analysis
    const postingPatterns = await this.analyzePostingPatterns(accountId);

    return {
      account_id: accountId,
      generated_at: new Date().toISOString(),
      overall_health: this.calculateOverallHealth(riskAnalysis, recentAlerts),
      current_risk: riskAnalysis,
      recent_alerts: recentAlerts,
      performance_trends: performanceTrends,
      posting_patterns: postingPatterns,
      recommendations: {
        immediate: this.getImmediateActions(riskAnalysis),
        short_term: this.getShortTermStrategy(riskAnalysis),
        long_term: this.getLongTermStrategy(performanceTrends)
      }
    };
  }

  private async getRecentAlerts(accountId: string, days: number = 30): Promise<ShadowbanAlert[]> {
    if (!this.db) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const rows = await this.db.all(`
      SELECT * FROM shadowban_alerts 
      WHERE account_id = ? AND timestamp >= ?
      ORDER BY timestamp DESC
    `, [accountId, cutoffDate.toISOString()]);

    return rows as ShadowbanAlert[];
  }

  private async calculatePerformanceTrends(accountId: string): Promise<PerformanceTrends> {
    const metrics = await this.getRecentMetrics(accountId, 30);

    if (metrics.length < 3) {
      return {
        views: "insufficient_data",
        engagement: "insufficient_data", 
        followers: "insufficient_data",
        overall_direction: "insufficient_data"
      };
    }

    // Calculate trends for key metrics
    const viewsTrend = this.calculateTrend(metrics.map(m => m.views));
    const engagementTrend = this.calculateTrend(metrics.map(m => m.engagement_rate));
    const followerTrend = this.calculateTrend(metrics.map(m => m.followers));

    return {
      views: viewsTrend,
      engagement: engagementTrend,
      followers: followerTrend,
      overall_direction: this.determineOverallDirection([viewsTrend, engagementTrend, followerTrend])
    };
  }

  private calculateTrend(values: number[]): string {
    if (values.length < 2) {
      return "stable";
    }

    // Simple trend calculation
    const halfLength = Math.floor(values.length / 2);
    const recentAvg = values.slice(0, halfLength).reduce((a, b) => a + b, 0) / halfLength;
    const olderAvg = values.slice(halfLength).reduce((a, b) => a + b, 0) / (values.length - halfLength);

    const changePercent = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg * 100) : 0;

    if (changePercent > 10) {
      return "improving";
    } else if (changePercent < -10) {
      return "declining";
    } else {
      return "stable";
    }
  }

  private determineOverallDirection(trends: string[]): string {
    if (trends.every(t => t === "improving")) {
      return "strong_growth";
    } else if (trends.some(t => t === "improving") && trends.every(t => t !== "declining")) {
      return "growing";
    } else if (trends.every(t => t === "stable")) {
      return "stable";
    } else if (trends.some(t => t === "declining")) {
      return "at_risk";
    } else {
      return "mixed";
    }
  }

  private async analyzePostingPatterns(accountId: string): Promise<PostingPatterns> {
    if (!this.db) {
      return {
        frequency: { frequency: "no_data", average_interval_days: 0, total_posts: 0, assessment: "no_data" },
        optimal_times: { best_hours: [], best_days: [], worst_times: [], confidence: "low" },
        posting_consistency: "no_data",
        recommendations: []
      };
    }

    const videos = await this.db.all(`
      SELECT posted_at, views FROM video_performance 
      WHERE account_id = ? AND posted_at IS NOT NULL
      ORDER BY posted_at DESC LIMIT 30
    `, [accountId]);

    if (videos.length === 0) {
      return {
        frequency: { frequency: "no_data", average_interval_days: 0, total_posts: 0, assessment: "no_data" },
        optimal_times: { best_hours: [], best_days: [], worst_times: [], confidence: "low" },
        posting_consistency: "no_data",
        recommendations: []
      };
    }

    // Analyze posting frequency
    const postDates = videos.map(v => new Date(v.posted_at)).sort((a, b) => b.getTime() - a.getTime());
    const frequencyAnalysis = this.analyzeFrequency(postDates);

    // Analyze performance by time
    const timePerformance = this.analyzeTimePerformance(videos);

    return {
      frequency: frequencyAnalysis,
      optimal_times: timePerformance,
      posting_consistency: this.calculateConsistency(postDates),
      recommendations: this.getPostingRecommendations(frequencyAnalysis, timePerformance)
    };
  }

  private analyzeFrequency(postDates: Date[]): PostingPatterns['frequency'] {
    if (postDates.length < 2) {
      return { frequency: "insufficient_data", average_interval_days: 0, total_posts: 0, assessment: "insufficient_data" };
    }

    // Calculate average days between posts
    const intervals: number[] = [];
    for (let i = 1; i < postDates.length; i++) {
      const interval = (postDates[i-1].getTime() - postDates[i].getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(interval);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

    let frequency: string;
    if (avgInterval < 1) {
      frequency = "multiple_daily";
    } else if (avgInterval < 2) {
      frequency = "daily";
    } else if (avgInterval < 4) {
      frequency = "every_few_days";
    } else {
      frequency = "weekly_or_less";
    }

    return {
      frequency: frequency,
      average_interval_days: avgInterval,
      total_posts: postDates.length,
      assessment: this.assessFrequency(frequency, avgInterval)
    };
  }

  private assessFrequency(frequency: string, avgInterval: number): string {
    if (frequency === "multiple_daily") {
      return "too_frequent_risk";
    } else if (frequency === "daily" && avgInterval <= 1.2) {
      return "optimal";
    } else if (["every_few_days", "weekly_or_less"].includes(frequency)) {
      return "too_infrequent";
    } else {
      return "moderate";
    }
  }

  private analyzeTimePerformance(videos: any[]): PostingPatterns['optimal_times'] {
    // This would analyze views by hour/day of posting
    // Simplified for now
    return {
      best_hours: ["7-9 AM", "12-2 PM", "7-9 PM"],
      best_days: ["Tuesday", "Wednesday", "Thursday"],
      worst_times: ["Late night", "Early morning"],
      confidence: "medium"
    };
  }

  private calculateConsistency(postDates: Date[]): string {
    if (postDates.length < 3) {
      return "insufficient_data";
    }

    // Calculate variance in posting intervals
    const intervals: number[] = [];
    for (let i = 1; i < postDates.length; i++) {
      const interval = (postDates[i-1].getTime() - postDates[i].getTime()) / (1000 * 60 * 60); // hours
      intervals.push(interval);
    }

    if (intervals.length === 0) {
      return "no_pattern";
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, x) => sum + Math.pow(x - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    const consistencyRatio = avgInterval > 0 ? stdDev / avgInterval : 1;

    if (consistencyRatio < 0.3) {
      return "very_consistent";
    } else if (consistencyRatio < 0.6) {
      return "consistent";
    } else if (consistencyRatio < 1.0) {
      return "somewhat_irregular";
    } else {
      return "very_irregular";
    }
  }

  private getPostingRecommendations(frequencyAnalysis: any, timePerformance: any): string[] {
    const recommendations: string[] = [];

    const frequency = frequencyAnalysis.frequency;
    const assessment = frequencyAnalysis.assessment;

    if (assessment === "too_frequent_risk") {
      recommendations.push("Reduce posting frequency to avoid spam detection");
      recommendations.push("Space posts at least 4-6 hours apart");
    } else if (assessment === "too_infrequent") {
      recommendations.push("Increase posting frequency for better algorithm favor");
      recommendations.push("Aim for 1 post every 1-2 days");
    }

    // Add optimal timing recommendations
    const bestHours = timePerformance.best_hours || [];
    if (bestHours.length > 0) {
      recommendations.push(`Post during optimal hours: ${bestHours.join(', ')}`);
    }

    return recommendations;
  }

  private calculateOverallHealth(riskAnalysis: ShadowbanAnalysis, recentAlerts: ShadowbanAlert[]): string {
    const riskLevel = riskAnalysis.risk_level;
    const alertCount = recentAlerts.filter(a => ["high", "severe"].includes(a.severity)).length;

    if (riskLevel === "severe" || alertCount >= 3) {
      return "critical";
    } else if (riskLevel === "high" || alertCount >= 2) {
      return "poor";
    } else if (riskLevel === "medium" || alertCount >= 1) {
      return "fair";
    } else if (["low", "minimal"].includes(riskLevel)) {
      return "good";
    } else {
      return "excellent";
    }
  }

  private getImmediateActions(riskAnalysis: ShadowbanAnalysis): string[] {
    const riskLevel = riskAnalysis.risk_level;

    if (["high", "severe"].includes(riskLevel)) {
      return [
        "STOP posting immediately for 48-72 hours",
        "Review all recent content for violations",
        "Check for automated engagement tools and disable",
        "Engage manually with your community only"
      ];
    } else if (riskLevel === "medium") {
      return [
        "Reduce posting frequency by 50%",
        "Focus on high-quality educational content only",
        "Avoid trending but controversial topics",
        "Increase authentic engagement with followers"
      ];
    } else {
      return [
        "Continue current strategy with minor adjustments",
        "Monitor metrics daily",
        "Maintain consistent posting schedule"
      ];
    }
  }

  private getShortTermStrategy(riskAnalysis: ShadowbanAnalysis): string[] {
    return [
      "Focus on educational and valuable content",
      "Build genuine community engagement",
      "Test different posting times and frequencies",
      "Monitor all metrics closely for improvements"
    ];
  }

  private getLongTermStrategy(performanceTrends: PerformanceTrends): string[] {
    return [
      "Develop signature content style and format",
      "Build email list for audience diversification",
      "Create content series for sustained engagement",
      "Establish thought leadership in your niche"
    ];
  }
}

// Global instance
export const shadowbanMonitor = new ShadowbanMonitor();