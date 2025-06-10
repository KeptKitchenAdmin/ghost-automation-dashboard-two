/**
 * Lead Generation Tracking System
 * Tracks service leads, consultations, and conversion funnel for luxury content
 */

export enum LeadSource {
  TIKTOK_COMMENT = "tiktok_comment",
  TIKTOK_DM = "tiktok_dm",
  BIO_LINK = "bio_link",
  DIRECT_INQUIRY = "direct_inquiry",
  REFERRAL = "referral"
}

export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  CONSULTATION_BOOKED = "consultation_booked",
  PROPOSAL_SENT = "proposal_sent",
  NEGOTIATING = "negotiating",
  CLOSED_WON = "closed_won",
  CLOSED_LOST = "closed_lost",
  NURTURING = "nurturing"
}

export enum ServiceType {
  AI_AUTOMATION = "ai_automation",
  CONTENT_SYSTEMS = "content_systems",
  LEAD_GENERATION = "lead_generation",
  BUSINESS_GROWTH = "business_growth",
  CUSTOM_DEVELOPMENT = "custom_development"
}

export interface Lead {
  lead_id: string;
  source: LeadSource;
  status: LeadStatus;
  created_at: Date;
  updated_at: Date;
  
  // Contact information
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  social_handle?: string;
  company_name?: string;
  
  // Lead qualification
  service_interest: ServiceType;
  budget_range?: string;
  timeline?: string;
  pain_points: string[];
  current_solutions: string[];
  
  // Engagement tracking
  content_interactions: Array<Record<string, any>>;
  response_history: Array<Record<string, any>>;
  consultation_notes: Array<Record<string, any>>;
  
  // Conversion tracking
  estimated_value: number;
  actual_value: number;
  conversion_probability: number;
  next_action?: string;
  next_action_date?: Date;
  
  // Attribution
  referral_content_id?: string;
  referral_video_id?: string;
  referral_campaign?: string;
}

export interface ConsultationBooking {
  booking_id: string;
  lead_id: string;
  scheduled_date: Date;
  duration_minutes: number;
  consultation_type: string;  // "discovery", "strategy", "technical", "proposal"
  status: string;  // "scheduled", "completed", "cancelled", "rescheduled"
  
  // Pre-consultation
  client_questionnaire: Record<string, any>;
  preparation_notes: string;
  
  // Post-consultation
  meeting_notes: string;
  next_steps: string[];
  proposal_required: boolean;
  follow_up_date?: Date;
}

export interface ServiceProposal {
  proposal_id: string;
  lead_id: string;
  consultation_id: string;
  created_at: Date;
  
  // Proposal details
  service_scope: Record<string, any>;
  timeline_weeks: number;
  total_value: number;
  payment_terms: string;
  deliverables: string[];
  
  // Tracking
  sent_date?: Date;
  viewed_date?: Date;
  status: string;  // "draft", "sent", "viewed", "accepted", "rejected", "negotiating"
  client_feedback: Array<Record<string, any>>;
  revisions: Array<Record<string, any>>;
}

export interface ConversionFunnel {
  period_start: Date;
  period_end: Date;
  
  // Funnel stages
  total_leads: number;
  qualified_leads: number;
  consultations_booked: number;
  consultations_completed: number;
  proposals_sent: number;
  deals_closed: number;
  
  // Conversion rates
  lead_to_qualified_rate: number;
  qualified_to_consultation_rate: number;
  consultation_to_proposal_rate: number;
  proposal_to_close_rate: number;
  overall_conversion_rate: number;
  
  // Revenue metrics
  total_pipeline_value: number;
  closed_revenue: number;
  average_deal_size: number;
  
  // Lead source breakdown
  source_breakdown: Record<LeadSource, Record<string, any>>;
}

interface ServicePricing {
  base_price: number;
  hourly_rate: number;
  typical_project_size: number;
}

export class LeadGenerationTracker {
  private leads: Map<string, Lead>;
  private consultations: Map<string, ConsultationBooking>;
  private proposals: Map<string, ServiceProposal>;
  private lead_scoring_weights: Record<string, number>;
  private service_pricing: Record<ServiceType, ServicePricing>;

  constructor() {
    // In-memory storage (replace with database in production)
    this.leads = new Map();
    this.consultations = new Map();
    this.proposals = new Map();
    
    // Lead scoring weights
    this.lead_scoring_weights = {
      budget_qualification: 0.3,
      timeline_urgency: 0.2,
      engagement_level: 0.2,
      service_fit: 0.15,
      company_size: 0.15
    };
    
    // Service pricing templates
    this.service_pricing = {
      [ServiceType.AI_AUTOMATION]: {
        base_price: 5000,
        hourly_rate: 150,
        typical_project_size: 15000
      },
      [ServiceType.CONTENT_SYSTEMS]: {
        base_price: 3000,
        hourly_rate: 125,
        typical_project_size: 8000
      },
      [ServiceType.LEAD_GENERATION]: {
        base_price: 4000,
        hourly_rate: 140,
        typical_project_size: 12000
      },
      [ServiceType.BUSINESS_GROWTH]: {
        base_price: 7500,
        hourly_rate: 200,
        typical_project_size: 25000
      },
      [ServiceType.CUSTOM_DEVELOPMENT]: {
        base_price: 6000,
        hourly_rate: 175,
        typical_project_size: 18000
      }
    };
  }

  async captureLead(
    source: LeadSource,
    service_interest: ServiceType,
    initial_data: Record<string, any>,
    content_id?: string
  ): Promise<string> {
    try {
      const lead_id = this.generateUUID();
      
      const lead: Lead = {
        lead_id,
        source,
        status: LeadStatus.NEW,
        created_at: new Date(),
        updated_at: new Date(),
        service_interest,
        referral_content_id: content_id,
        pain_points: [],
        current_solutions: [],
        content_interactions: [],
        response_history: [],
        consultation_notes: [],
        estimated_value: 0.0,
        actual_value: 0.0,
        conversion_probability: 0.0,
        ...initial_data
      };
      
      // Initial lead scoring
      lead.conversion_probability = await this.calculateLeadScore(lead);
      
      // Estimate potential value
      lead.estimated_value = await this.estimateLeadValue(lead);
      
      // Set next action
      lead.next_action = await this.determineNextAction(lead);
      lead.next_action_date = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      this.leads.set(lead_id, lead);
      
      // Log lead capture
      console.log(`Captured new lead: ${lead_id} from ${source} for ${service_interest}`);
      
      // Trigger automated follow-up
      await this.triggerAutomatedFollowUp(lead);
      
      return lead_id;
      
    } catch (error) {
      console.error(`Lead capture failed: ${error}`);
      throw error;
    }
  }

  async updateLeadStatus(
    lead_id: string,
    new_status: LeadStatus,
    notes?: string
  ): Promise<boolean> {
    try {
      const lead = this.leads.get(lead_id);
      if (!lead) {
        throw new Error(`Lead not found: ${lead_id}`);
      }
      
      const old_status = lead.status;
      
      // Update status
      lead.status = new_status;
      lead.updated_at = new Date();
      
      // Add status change to history
      const status_change = {
        timestamp: new Date(),
        from_status: old_status,
        to_status: new_status,
        notes: notes
      };
      lead.response_history.push(status_change);
      
      // Recalculate conversion probability
      lead.conversion_probability = await this.calculateLeadScore(lead);
      
      // Update next action
      lead.next_action = await this.determineNextAction(lead);
      lead.next_action_date = await this.calculateNextActionDate(lead);
      
      console.log(`Updated lead ${lead_id} status: ${old_status} -> ${new_status}`);
      
      // Trigger status-specific actions
      await this.handleStatusChange(lead, old_status, new_status);
      
      return true;
      
    } catch (error) {
      console.error(`Lead status update failed: ${error}`);
      throw error;
    }
  }

  async bookConsultation(
    lead_id: string,
    consultation_type: string,
    scheduled_date: Date,
    duration_minutes: number = 60
  ): Promise<string> {
    try {
      const lead = this.leads.get(lead_id);
      if (!lead) {
        throw new Error(`Lead not found: ${lead_id}`);
      }
      
      const booking_id = this.generateUUID();
      
      const consultation: ConsultationBooking = {
        booking_id,
        lead_id,
        scheduled_date,
        duration_minutes,
        consultation_type,
        status: "scheduled",
        client_questionnaire: {},
        preparation_notes: "",
        meeting_notes: "",
        next_steps: [],
        proposal_required: false
      };
      
      this.consultations.set(booking_id, consultation);
      
      // Update lead status
      await this.updateLeadStatus(lead_id, LeadStatus.CONSULTATION_BOOKED, 
                                  `Consultation booked: ${consultation_type}`);
      
      console.log(`Booked consultation ${booking_id} for lead ${lead_id}`);
      
      // Send confirmation and preparation materials
      await this.sendConsultationConfirmation(consultation);
      
      return booking_id;
      
    } catch (error) {
      console.error(`Consultation booking failed: ${error}`);
      throw error;
    }
  }

  async completeConsultation(
    booking_id: string,
    meeting_notes: string,
    next_steps: string[],
    proposal_required: boolean = false
  ): Promise<boolean> {
    try {
      const consultation = this.consultations.get(booking_id);
      if (!consultation) {
        throw new Error(`Consultation not found: ${booking_id}`);
      }
      
      consultation.status = "completed";
      consultation.meeting_notes = meeting_notes;
      consultation.next_steps = next_steps;
      consultation.proposal_required = proposal_required;
      
      // Update lead status
      const lead_id = consultation.lead_id;
      if (proposal_required) {
        await this.updateLeadStatus(lead_id, LeadStatus.PROPOSAL_SENT);
      } else {
        await this.updateLeadStatus(lead_id, LeadStatus.NURTURING);
      }
      
      // Add consultation notes to lead
      const lead = this.leads.get(lead_id);
      if (lead) {
        const consultation_record = {
          timestamp: new Date(),
          consultation_id: booking_id,
          type: consultation.consultation_type,
          notes: meeting_notes,
          next_steps: next_steps,
          proposal_required: proposal_required
        };
        lead.consultation_notes.push(consultation_record);
      }
      
      console.log(`Completed consultation ${booking_id}`);
      
      // Auto-generate proposal if required
      if (proposal_required) {
        await this.autoGenerateProposal(consultation);
      }
      
      return true;
      
    } catch (error) {
      console.error(`Consultation completion failed: ${error}`);
      throw error;
    }
  }

  async createProposal(
    lead_id: string,
    consultation_id: string,
    service_scope: Record<string, any>,
    timeline_weeks: number,
    total_value: number
  ): Promise<string> {
    try {
      const proposal_id = this.generateUUID();
      
      const proposal: ServiceProposal = {
        proposal_id,
        lead_id,
        consultation_id,
        created_at: new Date(),
        service_scope,
        timeline_weeks,
        total_value,
        payment_terms: "50% upfront, 50% on completion",
        deliverables: await this.generateDeliverables(service_scope),
        status: "draft",
        client_feedback: [],
        revisions: []
      };
      
      this.proposals.set(proposal_id, proposal);
      
      // Update lead with proposal value
      const lead = this.leads.get(lead_id);
      if (lead) {
        lead.estimated_value = total_value;
      }
      
      console.log(`Created proposal ${proposal_id} for lead ${lead_id}`);
      
      return proposal_id;
      
    } catch (error) {
      console.error(`Proposal creation failed: ${error}`);
      throw error;
    }
  }

  async getConversionFunnel(start_date: Date, end_date: Date): Promise<ConversionFunnel> {
    try {
      // Filter leads by date range
      const period_leads = Array.from(this.leads.values()).filter(
        lead => start_date <= lead.created_at && lead.created_at <= end_date
      );
      
      // Calculate funnel metrics
      const total_leads = period_leads.length;
      const qualified_leads = period_leads.filter(l => [
        LeadStatus.QUALIFIED, LeadStatus.CONSULTATION_BOOKED, 
        LeadStatus.PROPOSAL_SENT, LeadStatus.CLOSED_WON
      ].includes(l.status)).length;
      
      const consultations_booked = period_leads.filter(l => [
        LeadStatus.CONSULTATION_BOOKED, LeadStatus.PROPOSAL_SENT, LeadStatus.CLOSED_WON
      ].includes(l.status)).length;
      
      const proposals_sent = period_leads.filter(l => [
        LeadStatus.PROPOSAL_SENT, LeadStatus.CLOSED_WON
      ].includes(l.status)).length;
      
      const deals_closed = period_leads.filter(l => l.status === LeadStatus.CLOSED_WON).length;
      
      // Calculate conversion rates
      const lead_to_qualified_rate = total_leads > 0 ? qualified_leads / total_leads : 0;
      const qualified_to_consultation_rate = qualified_leads > 0 ? consultations_booked / qualified_leads : 0;
      const consultation_to_proposal_rate = consultations_booked > 0 ? proposals_sent / consultations_booked : 0;
      const proposal_to_close_rate = proposals_sent > 0 ? deals_closed / proposals_sent : 0;
      const overall_conversion_rate = total_leads > 0 ? deals_closed / total_leads : 0;
      
      // Calculate revenue metrics
      const closed_revenue = period_leads
        .filter(l => l.status === LeadStatus.CLOSED_WON)
        .reduce((sum, l) => sum + l.actual_value, 0);
      const total_pipeline_value = period_leads.reduce((sum, l) => sum + l.estimated_value, 0);
      const average_deal_size = deals_closed > 0 ? closed_revenue / deals_closed : 0;
      
      // Calculate source breakdown
      const source_breakdown = await this.calculateSourceBreakdown(period_leads);
      
      const funnel: ConversionFunnel = {
        period_start: start_date,
        period_end: end_date,
        total_leads,
        qualified_leads,
        consultations_booked,
        consultations_completed: consultations_booked,  // Simplified
        proposals_sent,
        deals_closed,
        lead_to_qualified_rate,
        qualified_to_consultation_rate,
        consultation_to_proposal_rate,
        proposal_to_close_rate,
        overall_conversion_rate,
        total_pipeline_value,
        closed_revenue,
        average_deal_size,
        source_breakdown
      };
      
      return funnel;
      
    } catch (error) {
      console.error(`Conversion funnel calculation failed: ${error}`);
      throw error;
    }
  }

  // Helper methods

  private async calculateLeadScore(lead: Lead): Promise<number> {
    let score = 0.0;
    
    // Budget qualification
    if (lead.budget_range) {
      if (lead.budget_range.toLowerCase().includes("10k+")) {
        score += 0.3;
      } else if (lead.budget_range.toLowerCase().includes("5k+")) {
        score += 0.2;
      } else {
        score += 0.1;
      }
    }
    
    // Timeline urgency
    if (lead.timeline) {
      const timeline_lower = lead.timeline.toLowerCase();
      if (timeline_lower.includes("immediate") || timeline_lower.includes("asap")) {
        score += 0.2;
      } else if (timeline_lower.includes("month")) {
        score += 0.15;
      } else {
        score += 0.1;
      }
    }
    
    // Engagement level
    const engagement_score = lead.content_interactions.length * 0.05;
    score += Math.min(engagement_score, 0.2);
    
    // Service fit
    const pricing = this.service_pricing[lead.service_interest];
    if (pricing && lead.budget_range) {
      // Check if budget aligns with typical project size
      score += 0.15;
    }
    
    return Math.min(score, 1.0);
  }

  private async estimateLeadValue(lead: Lead): Promise<number> {
    const pricing = this.service_pricing[lead.service_interest];
    if (!pricing) {
      return 5000;  // Default estimate
    }
    
    let base_value = pricing.typical_project_size;
    
    // Adjust based on company indicators
    if (lead.company_name) {
      base_value *= 1.2;  // Business leads typically higher value
    }
    
    return base_value;
  }

  private async determineNextAction(lead: Lead): Promise<string> {
    const status_actions: Record<LeadStatus, string> = {
      [LeadStatus.NEW]: "Initial outreach and qualification",
      [LeadStatus.CONTACTED]: "Follow up on initial conversation",
      [LeadStatus.QUALIFIED]: "Schedule discovery consultation",
      [LeadStatus.CONSULTATION_BOOKED]: "Prepare for consultation",
      [LeadStatus.PROPOSAL_SENT]: "Follow up on proposal",
      [LeadStatus.NEGOTIATING]: "Continue negotiation process",
      [LeadStatus.NURTURING]: "Provide value and stay in touch",
      [LeadStatus.CLOSED_WON]: "Project delivery and satisfaction",
      [LeadStatus.CLOSED_LOST]: "Archive and learn from feedback"
    };
    return status_actions[lead.status] || "Review lead status";
  }

  private async calculateNextActionDate(lead: Lead): Promise<Date> {
    const status_delays: Record<LeadStatus, number> = {
      [LeadStatus.NEW]: 24 * 60 * 60 * 1000,        // 24 hours
      [LeadStatus.CONTACTED]: 3 * 24 * 60 * 60 * 1000,      // 3 days
      [LeadStatus.QUALIFIED]: 5 * 24 * 60 * 60 * 1000,      // 5 days
      [LeadStatus.CONSULTATION_BOOKED]: 24 * 60 * 60 * 1000,  // 1 day
      [LeadStatus.PROPOSAL_SENT]: 7 * 24 * 60 * 60 * 1000,   // 7 days
      [LeadStatus.NEGOTIATING]: 3 * 24 * 60 * 60 * 1000,     // 3 days
      [LeadStatus.NURTURING]: 14 * 24 * 60 * 60 * 1000,      // 14 days
      [LeadStatus.CLOSED_WON]: 30 * 24 * 60 * 60 * 1000,     // 30 days
      [LeadStatus.CLOSED_LOST]: 0  // No action needed
    };
    const delay = status_delays[lead.status] || 7 * 24 * 60 * 60 * 1000; // Default 7 days
    return new Date(Date.now() + delay);
  }

  private async triggerAutomatedFollowUp(lead: Lead): Promise<void> {
    // Mock implementation - would integrate with email/messaging systems
    console.log(`Triggered automated follow-up for lead ${lead.lead_id}`);
  }

  private async handleStatusChange(lead: Lead, old_status: LeadStatus, new_status: LeadStatus): Promise<void> {
    // Mock implementation - would trigger automated workflows
    console.log(`Handling status change for lead ${lead.lead_id}: ${old_status} -> ${new_status}`);
  }

  private async sendConsultationConfirmation(consultation: ConsultationBooking): Promise<void> {
    // Mock implementation - would send actual emails
    console.log(`Sent consultation confirmation for ${consultation.booking_id}`);
  }

  private async autoGenerateProposal(consultation: ConsultationBooking): Promise<void> {
    // Mock implementation - would create proposal template
    console.log(`Auto-generating proposal for consultation ${consultation.booking_id}`);
  }

  private async generateDeliverables(service_scope: Record<string, any>): Promise<string[]> {
    // Mock implementation - would generate based on service type
    return [
      "Custom AI automation system",
      "Implementation and training",
      "30-day support and optimization",
      "Documentation and handover"
    ];
  }

  private async calculateSourceBreakdown(leads: Lead[]): Promise<Record<LeadSource, Record<string, any>>> {
    const source_data: Record<LeadSource, Record<string, any>> = {} as any;
    
    for (const source of Object.values(LeadSource)) {
      const source_leads = leads.filter(l => l.source === source);
      source_data[source] = {
        total_leads: source_leads.length,
        conversion_rate: source_leads.length > 0 ? 
          source_leads.filter(l => l.status === LeadStatus.CLOSED_WON).length / source_leads.length : 0,
        average_value: source_leads.length > 0 ? 
          source_leads.reduce((sum, l) => sum + l.actual_value, 0) / source_leads.length : 0
      };
    }
    
    return source_data;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Public getters for accessing data
  getLeads(): Lead[] {
    return Array.from(this.leads.values());
  }

  getConsultations(): ConsultationBooking[] {
    return Array.from(this.consultations.values());
  }

  getProposals(): ServiceProposal[] {
    return Array.from(this.proposals.values());
  }

  getLead(lead_id: string): Lead | undefined {
    return this.leads.get(lead_id);
  }
}