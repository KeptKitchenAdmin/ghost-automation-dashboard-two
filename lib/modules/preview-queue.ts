/**
 * Preview Queue System with Compliance Integration
 * All content must pass compliance validation before publication
 */

import { BaseModel } from '../base-model';

// Enums
export enum VideoStatus {
  GENERATING = "generating",
  COMPLIANCE_REVIEW = "compliance_review",
  READY_FOR_PREVIEW = "ready_for_preview",
  REQUIRES_FIXES = "requires_fixes",
  APPROVED = "approved",
  PUBLISHED = "published",
  REJECTED = "rejected"
}

export enum QueuePriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent"
}

export enum ComplianceStatus {
  PENDING_APPROVAL = "pending_approval",
  COMPLIANT = "compliant",
  NON_COMPLIANT = "non_compliant",
  REQUIRES_REVIEW = "requires_review"
}

// Interfaces
export interface ComplianceValidation {
  overall_status: ComplianceStatus;
  issues_found: string[];
  disclosures_required: string[];
  validation_timestamp: string;
  checks_performed: string[];
  compliance_score: number;
}

export interface VideoQueueItem {
  video_id: string;
  title: string;
  status: VideoStatus;
  priority: QueuePriority;
  created_at: string;
  updated_at: string;
  
  // Content data
  persona_config: Record<string, any>;
  product_data: Record<string, any>;
  video_config: Record<string, any>;
  script_content: Record<string, any>;
  
  // Compliance tracking
  compliance_validation?: ComplianceValidation;
  compliance_status: ComplianceStatus;
  compliance_issues: string[];
  required_disclosures: string[];
  
  // Performance predictions
  engagement_score: number;
  emotional_score: number;
  viral_potential: number;
  
  // Review data
  reviewer_notes?: string;
  approval_date?: string;
  rejection_reason?: string;
  
  // TikTok specific
  hashtags: string[];
  tiktok_metadata: Record<string, any>;
}

export interface FeedbackResponse {
  video_id: string;
  original_feedback: string;
  changes_applied: string[];
  compliance_revalidation: ComplianceValidation;
  new_status: VideoStatus;
  regeneration_required: boolean;
}

export interface QueueStatus {
  total_videos: number;
  status_breakdown: Record<string, number>;
  compliance_breakdown: Record<string, number>;
  pending_compliance_review: Array<{
    video_id: string;
    title: string;
    status: string;
    compliance_issues: string[];
    created_at: string;
  }>;
  ready_for_approval: Array<{
    video_id: string;
    title: string;
    engagement_score: number;
    compliance_status: string;
    created_at: string;
  }>;
  compliance_alerts: ComplianceAlert[];
  queue_health: QueueHealth;
}

export interface ComplianceAlert {
  type: string;
  video_id: string;
  message: string;
  issues?: string[];
  severity: string;
}

export interface QueueHealth {
  status: string;
  score: number;
  compliance_rate: number;
  efficiency_rate: number;
  issues: string[];
}

export class PreviewQueue extends BaseModel {
  private queue: Map<string, VideoQueueItem>;
  private max_queue_size: number;
  private auto_cleanup_days: number;
  private compliance_timeout_hours: number;
  private mandatory_compliance_checks: string[];

  constructor() {
    super();
    this.queue = new Map();
    
    // Queue management settings
    this.max_queue_size = 100;
    this.auto_cleanup_days = 30;
    this.compliance_timeout_hours = 24;
    
    // Compliance requirements (ALL must pass)
    this.mandatory_compliance_checks = [
      "uk_asa_advertising_disclosure",
      "traffic_quality_standards", 
      "privacy_data_protection",
      "tiktok_affiliate_terms",
      "content_authenticity_verification"
    ];
  }

  async add_video(video_config: Record<string, any>): Promise<string> {
    try {
      const video_id = `video_${this.generateVideoId()}`;
      
      console.log(`Adding video ${video_id} to preview queue`);
      
      // Create queue item
      const queue_item: VideoQueueItem = {
        video_id,
        title: this.generate_video_title(video_config),
        status: VideoStatus.GENERATING,
        priority: QueuePriority.NORMAL,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        persona_config: video_config.persona || {},
        product_data: video_config.product || {},
        video_config: video_config.video_settings || {},
        script_content: video_config.script || {},
        compliance_status: ComplianceStatus.PENDING_APPROVAL,
        compliance_issues: [],
        required_disclosures: [],
        engagement_score: 0.0,
        emotional_score: 0.0,
        viral_potential: 0.0,
        hashtags: [],
        tiktok_metadata: {}
      };
      
      // Perform immediate compliance pre-check
      const compliance_result = await this.perform_compliance_precheck(queue_item);
      queue_item.compliance_validation = compliance_result;
      queue_item.compliance_status = compliance_result.overall_status;
      
      // Update status based on compliance
      if (compliance_result.overall_status === ComplianceStatus.NON_COMPLIANT) {
        queue_item.status = VideoStatus.REQUIRES_FIXES;
        queue_item.compliance_issues = compliance_result.issues_found;
      } else {
        queue_item.status = VideoStatus.COMPLIANCE_REVIEW;
      }
      
      // Add mandatory disclosures
      await this.add_mandatory_compliance_elements(queue_item);
      
      // Store in queue
      this.queue.set(video_id, queue_item);
      
      // Log compliance status
      console.log(`Video ${video_id} compliance status: ${compliance_result.overall_status}`);
      
      return video_id;
      
    } catch (error) {
      console.error(`Failed to add video to queue: ${error}`);
      throw error;
    }
  }

  async update_video(video_id: string, changes: Record<string, any>): Promise<VideoQueueItem> {
    try {
      const queue_item = this.queue.get(video_id);
      if (!queue_item) {
        throw new Error(`Video ${video_id} not found in queue`);
      }
      
      console.log(`Updating video ${video_id} with changes`);
      
      // Apply changes
      this.apply_changes(queue_item, changes);
      
      // MANDATORY: Re-validate compliance after any changes
      const compliance_result = await this.perform_full_compliance_validation(queue_item);
      queue_item.compliance_validation = compliance_result;
      queue_item.compliance_status = compliance_result.overall_status;
      
      // Update status based on new compliance validation
      if (compliance_result.overall_status === ComplianceStatus.NON_COMPLIANT) {
        queue_item.status = VideoStatus.REQUIRES_FIXES;
        queue_item.compliance_issues = compliance_result.issues_found;
      } else if (compliance_result.overall_status === ComplianceStatus.REQUIRES_REVIEW) {
        queue_item.status = VideoStatus.COMPLIANCE_REVIEW;
      } else {
        queue_item.status = VideoStatus.READY_FOR_PREVIEW;
      }
      
      queue_item.updated_at = new Date().toISOString();
      
      // Re-add mandatory compliance elements if needed
      await this.ensure_mandatory_compliance_elements(queue_item);
      
      console.log(`Video ${video_id} updated with compliance status: ${compliance_result.overall_status}`);
      
      return queue_item;
      
    } catch (error) {
      console.error(`Failed to update video ${video_id}: ${error}`);
      throw error;
    }
  }

  async approve_video(video_id: string, reviewer_notes?: string): Promise<VideoQueueItem> {
    try {
      const queue_item = this.queue.get(video_id);
      if (!queue_item) {
        throw new Error(`Video ${video_id} not found in queue`);
      }
      
      // MANDATORY: Final compliance validation before approval
      const final_compliance = await this.perform_final_compliance_check(queue_item);
      
      if (final_compliance.overall_status !== ComplianceStatus.COMPLIANT) {
        throw new Error(`Cannot approve video ${video_id}: Compliance issues remain - ${final_compliance.issues_found.join(', ')}`);
      }
      
      // Update approval status
      queue_item.status = VideoStatus.APPROVED;
      queue_item.approval_date = new Date().toISOString();
      queue_item.reviewer_notes = reviewer_notes;
      queue_item.compliance_validation = final_compliance;
      queue_item.updated_at = new Date().toISOString();
      
      console.log(`Video ${video_id} approved for publication`);
      
      return queue_item;
      
    } catch (error) {
      console.error(`Failed to approve video ${video_id}: ${error}`);
      throw error;
    }
  }

  async reject_video(video_id: string, reason: string): Promise<VideoQueueItem> {
    try {
      const queue_item = this.queue.get(video_id);
      if (!queue_item) {
        throw new Error(`Video ${video_id} not found in queue`);
      }
      
      queue_item.status = VideoStatus.REJECTED;
      queue_item.rejection_reason = reason;
      queue_item.updated_at = new Date().toISOString();
      
      console.log(`Video ${video_id} rejected: ${reason}`);
      
      return queue_item;
      
    } catch (error) {
      console.error(`Failed to reject video ${video_id}: ${error}`);
      throw error;
    }
  }

  async get_status(): Promise<QueueStatus> {
    try {
      const total_videos = this.queue.size;
      
      // Count by status
      const status_counts: Record<string, number> = {};
      Object.values(VideoStatus).forEach(status => {
        status_counts[status] = 0;
      });
      
      // Count by compliance status  
      const compliance_counts: Record<string, number> = {};
      Object.values(ComplianceStatus).forEach(status => {
        compliance_counts[status] = 0;
      });
      
      // Process queue items
      const pending_compliance: Array<{
        video_id: string;
        title: string;
        status: string;
        compliance_issues: string[];
        created_at: string;
      }> = [];
      
      const ready_for_approval: Array<{
        video_id: string;
        title: string;
        engagement_score: number;
        compliance_status: string;
        created_at: string;
      }> = [];
      
      for (const item of this.queue.values()) {
        status_counts[item.status]++;
        compliance_counts[item.compliance_status]++;
        
        if ([VideoStatus.COMPLIANCE_REVIEW, VideoStatus.REQUIRES_FIXES].includes(item.status)) {
          pending_compliance.push({
            video_id: item.video_id,
            title: item.title,
            status: item.status,
            compliance_issues: item.compliance_issues,
            created_at: item.created_at
          });
        }
        
        if (item.status === VideoStatus.READY_FOR_PREVIEW && item.compliance_status === ComplianceStatus.COMPLIANT) {
          ready_for_approval.push({
            video_id: item.video_id,
            title: item.title,
            engagement_score: item.engagement_score,
            compliance_status: item.compliance_status,
            created_at: item.created_at
          });
        }
      }
      
      return {
        total_videos,
        status_breakdown: status_counts,
        compliance_breakdown: compliance_counts,
        pending_compliance_review: pending_compliance,
        ready_for_approval,
        compliance_alerts: await this.get_compliance_alerts(),
        queue_health: await this.assess_queue_health()
      };
      
    } catch (error) {
      console.error(`Failed to get queue status: ${error}`);
      throw error;
    }
  }

  async update_video_status(
    video_id: string, 
    status: string, 
    files?: Record<string, any>, 
    error?: string
  ): Promise<void> {
    try {
      const queue_item = this.queue.get(video_id);
      if (!queue_item) {
        console.warn(`Video ${video_id} not found in queue for status update`);
        return;
      }
      
      if (status === "completed") {
        if (files) {
          queue_item.video_config.generated_files = files;
        }
        
        // Perform post-generation compliance check
        const post_gen_compliance = await this.perform_post_generation_compliance_check(queue_item);
        queue_item.compliance_validation = post_gen_compliance;
        queue_item.compliance_status = post_gen_compliance.overall_status;
        
        if (post_gen_compliance.overall_status === ComplianceStatus.COMPLIANT) {
          queue_item.status = VideoStatus.READY_FOR_PREVIEW;
        } else {
          queue_item.status = VideoStatus.REQUIRES_FIXES;
          queue_item.compliance_issues = post_gen_compliance.issues_found;
        }
        
      } else if (status === "failed") {
        queue_item.status = VideoStatus.REJECTED;
        queue_item.rejection_reason = error || "Generation failed";
      }
      
      queue_item.updated_at = new Date().toISOString();
      
      console.log(`Updated video ${video_id} status to ${queue_item.status}`);
      
    } catch (error) {
      console.error(`Failed to update video status: ${error}`);
    }
  }

  async process_feedback(video_id: string, feedback: string): Promise<FeedbackResponse> {
    try {
      const queue_item = this.queue.get(video_id);
      if (!queue_item) {
        throw new Error(`Video ${video_id} not found in queue`);
      }
      
      // Parse feedback into actionable changes
      const changes = await this.parse_feedback_to_changes(feedback);
      
      // Apply changes
      this.apply_changes(queue_item, changes);
      
      // MANDATORY: Re-validate compliance after feedback changes
      const compliance_revalidation = await this.perform_full_compliance_validation(queue_item);
      queue_item.compliance_validation = compliance_revalidation;
      queue_item.compliance_status = compliance_revalidation.overall_status;
      
      // Determine if regeneration is required
      const regeneration_required = await this.requires_regeneration(changes);
      
      // Update status
      if (compliance_revalidation.overall_status === ComplianceStatus.NON_COMPLIANT) {
        queue_item.status = VideoStatus.REQUIRES_FIXES;
      } else if (regeneration_required) {
        queue_item.status = VideoStatus.GENERATING;
      } else {
        queue_item.status = VideoStatus.READY_FOR_PREVIEW;
      }
      
      queue_item.updated_at = new Date().toISOString();
      
      const response: FeedbackResponse = {
        video_id,
        original_feedback: feedback,
        changes_applied: Object.keys(changes),
        compliance_revalidation,
        new_status: queue_item.status,
        regeneration_required
      };
      
      console.log(`Processed feedback for video ${video_id}: ${Object.keys(changes).length} changes applied`);
      
      return response;
      
    } catch (error) {
      console.error(`Failed to process feedback for video ${video_id}: ${error}`);
      throw error;
    }
  }

  // Private helper methods
  private async perform_compliance_precheck(item: VideoQueueItem): Promise<ComplianceValidation> {
    // Mock compliance validation - replace with actual compliance checking logic
    return {
      overall_status: ComplianceStatus.REQUIRES_REVIEW,
      issues_found: [],
      disclosures_required: ["advertising_disclosure", "affiliate_disclosure"],
      validation_timestamp: new Date().toISOString(),
      checks_performed: this.mandatory_compliance_checks,
      compliance_score: 0.8
    };
  }

  private async perform_full_compliance_validation(item: VideoQueueItem): Promise<ComplianceValidation> {
    // Mock comprehensive compliance validation
    return {
      overall_status: ComplianceStatus.COMPLIANT,
      issues_found: [],
      disclosures_required: ["advertising_disclosure"],
      validation_timestamp: new Date().toISOString(),
      checks_performed: this.mandatory_compliance_checks,
      compliance_score: 0.95
    };
  }

  private async perform_final_compliance_check(item: VideoQueueItem): Promise<ComplianceValidation> {
    const validation = await this.perform_full_compliance_validation(item);
    
    // Additional final checks
    if (!this.has_all_mandatory_disclosures(item)) {
      validation.issues_found.push("Missing mandatory disclosure elements");
      validation.overall_status = ComplianceStatus.NON_COMPLIANT;
    }
    
    return validation;
  }

  private async perform_post_generation_compliance_check(item: VideoQueueItem): Promise<ComplianceValidation> {
    return await this.perform_full_compliance_validation(item);
  }

  private async add_mandatory_compliance_elements(item: VideoQueueItem): Promise<void> {
    // Add UK ASA disclosures and other mandatory compliance elements
    item.required_disclosures = ["advertising_disclosure", "affiliate_disclosure"];
    
    // Add disclosure text to script if not present
    const script_text = JSON.stringify(item.script_content).toLowerCase();
    if (!script_text.includes('ad') && !script_text.includes('sponsored')) {
      item.script_content.disclosure = "This is a paid advertisement";
    }
  }

  private async ensure_mandatory_compliance_elements(item: VideoQueueItem): Promise<void> {
    await this.add_mandatory_compliance_elements(item);
  }

  private has_all_mandatory_disclosures(item: VideoQueueItem): boolean {
    const script_text = JSON.stringify(item.script_content).toLowerCase();
    const has_advertising_disclosure = ['ad', 'advertisement', 'sponsored', 'paid partnership'].some(
      keyword => script_text.includes(keyword)
    );
    const has_affiliate_disclosure = ['affiliate', 'commission', 'earn from'].some(
      keyword => script_text.includes(keyword)
    );
    
    return has_advertising_disclosure && has_affiliate_disclosure;
  }

  private async get_compliance_alerts(): Promise<ComplianceAlert[]> {
    const alerts: ComplianceAlert[] = [];
    const compliance_timeout = new Date(Date.now() - this.compliance_timeout_hours * 60 * 60 * 1000);
    
    for (const item of this.queue.values()) {
      const created_date = new Date(item.created_at);
      
      if (item.status === VideoStatus.COMPLIANCE_REVIEW && created_date < compliance_timeout) {
        alerts.push({
          type: "compliance_timeout",
          video_id: item.video_id,
          message: `Video ${item.video_id} stuck in compliance review for ${this.compliance_timeout_hours}+ hours`,
          severity: "high"
        });
      }
      
      if (item.status === VideoStatus.REQUIRES_FIXES && item.compliance_issues.length > 0) {
        alerts.push({
          type: "compliance_issues",
          video_id: item.video_id,
          message: `Video ${item.video_id} has ${item.compliance_issues.length} compliance issues`,
          issues: item.compliance_issues,
          severity: "medium"
        });
      }
    }
    
    return alerts;
  }

  private async assess_queue_health(): Promise<QueueHealth> {
    const total_videos = this.queue.size;
    if (total_videos === 0) {
      return { status: "healthy", score: 1.0, compliance_rate: 1.0, efficiency_rate: 1.0, issues: [] };
    }
    
    // Calculate compliance rate
    const compliant_videos = Array.from(this.queue.values()).filter(
      item => item.compliance_status === ComplianceStatus.COMPLIANT
    ).length;
    const compliance_rate = compliant_videos / total_videos;
    
    // Calculate processing efficiency
    const stuck_videos = Array.from(this.queue.values()).filter(
      item => [VideoStatus.COMPLIANCE_REVIEW, VideoStatus.REQUIRES_FIXES].includes(item.status)
    ).length;
    const efficiency_rate = 1.0 - (stuck_videos / total_videos);
    
    // Overall health score
    const health_score = (compliance_rate * 0.7) + (efficiency_rate * 0.3);
    
    const issues: string[] = [];
    if (compliance_rate < 0.8) {
      issues.push("Low compliance rate - review content generation process");
    }
    if (efficiency_rate < 0.7) {
      issues.push("High number of videos stuck in review - check compliance validation");
    }
    
    const status = health_score > 0.8 ? "healthy" : health_score > 0.6 ? "needs_attention" : "unhealthy";
    
    return {
      status,
      score: health_score,
      compliance_rate,
      efficiency_rate,
      issues
    };
  }

  private generate_video_title(config: Record<string, any>): string {
    const product_name = config.product?.name || "Product";
    const persona_type = config.persona?.voice_type || "persona";
    return `${product_name} - ${persona_type.charAt(0).toUpperCase() + persona_type.slice(1)} Video`;
  }

  private apply_changes(item: VideoQueueItem, changes: Record<string, any>): void {
    for (const [key, value] of Object.entries(changes)) {
      if (key.startsWith("persona_")) {
        item.persona_config[key.replace("persona_", "")] = value;
      } else if (key.startsWith("script_")) {
        item.script_content[key.replace("script_", "")] = value;
      } else if (key.startsWith("video_")) {
        item.video_config[key.replace("video_", "")] = value;
      }
    }
  }

  private async parse_feedback_to_changes(feedback: string): Promise<Record<string, any>> {
    const changes: Record<string, any> = {};
    const feedback_lower = feedback.toLowerCase();
    
    // Hair/appearance changes
    if (feedback_lower.includes("hair")) {
      if (feedback_lower.includes("shorter")) {
        changes["persona_hair_length"] = "short";
      } else if (feedback_lower.includes("longer")) {
        changes["persona_hair_length"] = "long";
      }
    }
    
    // Lighting changes
    if (feedback_lower.includes("lighting")) {
      if (feedback_lower.includes("blue")) {
        changes["video_lighting_color"] = "blue";
      } else if (feedback_lower.includes("warm")) {
        changes["video_lighting_color"] = "warm";
      }
    }
    
    // Pacing changes
    if (feedback_lower.includes("slow") || feedback_lower.includes("pacing")) {
      if (feedback_lower.includes("faster")) {
        changes["script_pacing"] = "fast";
      } else if (feedback_lower.includes("slower")) {
        changes["script_pacing"] = "slow";
      }
    }
    
    return changes;
  }

  private async requires_regeneration(changes: Record<string, any>): Promise<boolean> {
    const regeneration_triggers = [
      "persona_appearance", "persona_hair", "persona_clothing",
      "video_lighting", "video_background", "script_content"
    ];
    
    return Object.keys(changes).some(key => 
      regeneration_triggers.some(trigger => key.startsWith(trigger))
    );
  }

  private generateVideoId(): string {
    return Math.random().toString(36).substr(2, 8);
  }
}