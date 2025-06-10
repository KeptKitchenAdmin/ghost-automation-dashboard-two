/**
 * TikTok Affiliate & Service Marketing Compliance Manager
 * Mandatory compliance safeguards for UK ASA, GDPR, TikTok Terms, and service marketing regulations
 */

export enum ComplianceStatus {
  COMPLIANT = "compliant",
  NON_COMPLIANT = "non_compliant",
  REQUIRES_REVIEW = "requires_review",
  PENDING_APPROVAL = "pending_approval"
}

export enum ContentType {
  AFFILIATE_PRODUCT = "affiliate_product",
  SERVICE_PROMOTION = "service_promotion",
  LUXURY_LIFESTYLE = "luxury_lifestyle",
  AUTHORITY_BUILDING = "authority_building",
  CLIENT_TESTIMONIAL = "client_testimonial",
  EDUCATIONAL_CONTENT = "educational_content"
}

export enum TrafficSource {
  ORGANIC_SOCIAL = "organic_social",
  PAID_ADVERTISING = "paid_advertising",
  SEARCH_ENGINE = "search_engine",
  DIRECT_TRAFFIC = "direct_traffic",
  REFERRAL = "referral",
  EMAIL_MARKETING = "email_marketing"
}

export enum CustomerJourneyStage {
  REFERRAL = "referral",
  REGISTRATION = "registration",
  AD_SPEND_TARGET = "ad_spend_target",
  CONVERSION_COMPLETE = "conversion_complete",
  EXPIRED = "expired"
}

export interface AdvertisingDisclosure {
  disclosure_id: string;
  disclosure_text: string;
  placement: string;  // "prominent", "beginning", "overlay"
  visibility_duration: number;  // seconds
  font_size_ratio: number;  // relative to main content
  contrast_ratio: number;
  language?: string;
  compliance_standard?: string;
}

export interface ComplianceResult {
  content_id: string;
  validation_timestamp: Date;
  overall_status: ComplianceStatus;
  compliance_checks: Array<Record<string, any>>;
  issues_found: string[];
  recommendations: string[];
  required_disclosures: AdvertisingDisclosure[];
  compliance_score: number;
}

export interface TrafficRecord {
  user_id: string;
  session_id: string;
  source: TrafficSource;
  timestamp: Date;
  ip_address: string;
  user_agent: string;
  referrer_url?: string;
  geolocation: Record<string, string>;
  quality_score: number;  // 0-1, higher = better quality
  fraud_indicators: string[];
  compliance_flags: string[];
}

export interface CustomerJourney {
  customer_id: string;
  referral_date: Date;
  registration_date?: Date;
  first_ad_spend_date?: Date;
  total_ad_spend: number;
  current_stage: CustomerJourneyStage;
  days_remaining: number;
  alerts_sent: string[];
  conversion_value: number;
  traffic_source: TrafficSource;
}

export interface PrivacyConsent {
  user_id: string;
  consent_date: Date;
  consent_type: string;  // "marketing", "analytics", "personalization"
  consent_method: string;  // "explicit_checkbox", "banner_accept", "email_confirm"
  ip_address: string;
  user_agent: string;
  withdrawal_date?: Date;
  data_retention_period: number;  // days
}

export interface ComplianceValidation {
  content_id: string;
  content_type: string;  // "video", "script", "caption"
  validation_date: Date;
  overall_status: ComplianceStatus;
  advertising_compliance: ComplianceStatus;
  privacy_compliance: ComplianceStatus;
  traffic_quality_compliance: ComplianceStatus;
  issues_found: string[];
  required_actions: string[];
  reviewer_notes?: string;
}

export class ComplianceManager {
  private uk_asa_disclosures: Record<string, AdvertisingDisclosure>;
  private traffic_quality_standards: Record<string, any>;
  private gdpr_retention_periods: Record<string, number>;
  private tiktok_requirements: Record<string, any>;

  constructor() {
    // UK ASA Disclosure Templates (Mandatory)
    this.uk_asa_disclosures = {
      standard_ad: {
        disclosure_id: "uk_asa_std_001",
        disclosure_text: "AD | This is a paid partnership with [BRAND]",
        placement: "prominent",
        visibility_duration: 3.0,
        font_size_ratio: 0.8,
        contrast_ratio: 4.5,
        language: "en-GB",
        compliance_standard: "UK_ASA_2023"
      },
      affiliate_promotion: {
        disclosure_id: "uk_asa_aff_001",
        disclosure_text: "AD | I earn commission from purchases made through this link",
        placement: "beginning",
        visibility_duration: 4.0,
        font_size_ratio: 0.75,
        contrast_ratio: 4.5,
        language: "en-GB",
        compliance_standard: "UK_ASA_2023"
      },
      sponsored_content: {
        disclosure_id: "uk_asa_spon_001",
        disclosure_text: "SPONSORED | Paid promotion in partnership with [BRAND]",
        placement: "overlay",
        visibility_duration: 5.0,
        font_size_ratio: 0.8,
        contrast_ratio: 4.5,
        language: "en-GB",
        compliance_standard: "UK_ASA_2023"
      }
    };

    // Traffic Quality Standards
    this.traffic_quality_standards = {
      min_session_duration: 30,  // seconds
      max_bounce_rate: 0.7,
      min_pages_per_session: 1.5,
      fraud_detection_threshold: 0.3,
      prohibited_sources: [
        "incentivized_traffic",
        "bot_traffic",
        "purchased_clicks",
        "misleading_ads",
        "spam_traffic"
      ]
    };

    // GDPR Data Retention Policies
    this.gdpr_retention_periods = {
      marketing_data: 730,  // 2 years
      analytics_data: 1095,  // 3 years
      transaction_data: 2555,  // 7 years (financial records)
      consent_records: 2555,  // 7 years
      compliance_logs: 2555   // 7 years
    };

    // TikTok Affiliate Specific Requirements
    this.tiktok_requirements = {
      min_ad_spend_threshold: 50.0,  // $50 USD
      conversion_window_days: 28,
      required_customer_actions: [
        "click_affiliate_link",
        "register_account",
        "spend_minimum_amount"
      ]
    };
  }

  async validateContentCompliance(content: Record<string, any>): Promise<ComplianceValidation> {
    try {
      const content_id = content.id || `content_${new Date().toISOString()}`;

      // Validate advertising compliance
      const ad_compliance = await this.validateAdvertisingCompliance(content);

      // Validate privacy compliance
      const privacy_compliance = await this.validatePrivacyCompliance(content);

      // Validate traffic quality requirements
      const traffic_compliance = await this.validateTrafficQualityCompliance(content);

      // Validate service marketing compliance (for luxury/service content)
      let service_compliance: ComplianceResult | undefined = undefined;
      const content_type = content.content_type || "";
      if (["service_promotion", "luxury_lifestyle", "authority_building"].includes(content_type)) {
        service_compliance = await this.validateServiceMarketingCompliance(content);
      }

      // Determine overall status
      const overall_status = this.determineOverallCompliance(
        ad_compliance, privacy_compliance, traffic_compliance, service_compliance
      );

      // Compile issues and required actions
      const issues = await this.compileComplianceIssues(content, ad_compliance, privacy_compliance, traffic_compliance);
      const actions = await this.generateRequiredActions(issues);

      const validation: ComplianceValidation = {
        content_id,
        content_type: content.type || "unknown",
        validation_date: new Date(),
        overall_status,
        advertising_compliance: ad_compliance,
        privacy_compliance: privacy_compliance,
        traffic_quality_compliance: traffic_compliance,
        issues_found: issues,
        required_actions: actions
      };

      console.log(`Compliance validation completed for ${content_id}: ${overall_status}`);
      return validation;

    } catch (error) {
      console.error(`Compliance validation failed:`, error);
      throw error;
    }
  }

  async addMandatoryDisclosures(content: Record<string, any>): Promise<Record<string, any>> {
    try {
      const content_type = content.type || "video";

      // Determine appropriate disclosure type
      let disclosure: AdvertisingDisclosure;
      if (content.tags?.includes("affiliate")) {
        disclosure = this.uk_asa_disclosures.affiliate_promotion;
      } else if (content.tags?.includes("sponsored")) {
        disclosure = this.uk_asa_disclosures.sponsored_content;
      } else {
        disclosure = this.uk_asa_disclosures.standard_ad;
      }

      // Add disclosure to content
      if (content_type === "video") {
        content = await this.addVideoDisclosure(content, disclosure);
      } else if (content_type === "script") {
        content = await this.addScriptDisclosure(content, disclosure);
      } else if (content_type === "caption") {
        content = await this.addCaptionDisclosure(content, disclosure);
      }

      // Log compliance action
      console.log(`Added UK ASA disclosure ${disclosure.disclosure_id} to content`);

      return content;

    } catch (error) {
      console.error(`Failed to add mandatory disclosures:`, error);
      throw error;
    }
  }

  async trackTrafficQuality(user_session: Record<string, any>): Promise<TrafficRecord> {
    try {
      // Extract session data
      const user_id = user_session.user_id;
      const session_id = user_session.session_id;
      const source = user_session.source || TrafficSource.DIRECT_TRAFFIC;

      // Calculate quality score
      const quality_score = await this.calculateTrafficQualityScore(user_session);

      // Detect fraud indicators
      const fraud_indicators = await this.detectFraudIndicators(user_session);

      // Check compliance flags
      const compliance_flags = await this.checkComplianceFlags(user_session, source);

      // Create traffic record
      const record: TrafficRecord = {
        user_id,
        session_id,
        source: source as TrafficSource,
        timestamp: new Date(),
        ip_address: user_session.ip_address || "",
        user_agent: user_session.user_agent || "",
        referrer_url: user_session.referrer,
        geolocation: user_session.geolocation || {},
        quality_score,
        fraud_indicators,
        compliance_flags
      };

      // Store for compliance reporting
      await this.storeTrafficRecord(record);

      console.log(`Traffic quality tracked for session ${session_id}: ${quality_score.toFixed(2)}`);
      return record;

    } catch (error) {
      console.error(`Traffic quality tracking failed:`, error);
      throw error;
    }
  }

  async validateServiceMarketingCompliance(content_data: Record<string, any>): Promise<ComplianceResult> {
    try {
      const content_type = content_data.content_type || ContentType.SERVICE_PROMOTION;
      const issues_found: string[] = [];
      const compliance_checks: Array<Record<string, any>> = [];

      // Service marketing specific validations
      if ([ContentType.SERVICE_PROMOTION, ContentType.LUXURY_LIFESTYLE, ContentType.AUTHORITY_BUILDING].includes(content_type as ContentType)) {

        // 1. Truthful Claims Validation
        const claims_check = await this.validateServiceClaims(content_data);
        compliance_checks.push(claims_check);
        if (!claims_check.compliant) {
          issues_found.push(...claims_check.issues);
        }

        // 2. Testimonial and Case Study Compliance
        const testimonial_check = await this.validateTestimonials(content_data);
        compliance_checks.push(testimonial_check);
        if (!testimonial_check.compliant) {
          issues_found.push(...testimonial_check.issues);
        }

        // 3. Revenue/Results Claims Validation
        const results_check = await this.validateRevenueClaims(content_data);
        compliance_checks.push(results_check);
        if (!results_check.compliant) {
          issues_found.push(...results_check.issues);
        }

        // 4. Professional Services Disclosure
        const disclosure_check = await this.validateServiceDisclosures(content_data);
        compliance_checks.push(disclosure_check);
        if (!disclosure_check.compliant) {
          issues_found.push(...disclosure_check.issues);
        }

        // 5. Misleading Claims Prevention
        const misleading_check = await this.validateMisleadingPrevention(content_data);
        compliance_checks.push(misleading_check);
        if (!misleading_check.compliant) {
          issues_found.push(...misleading_check.issues);
        }
      }

      // Determine overall compliance status
      let overall_status = issues_found.length === 0 ? ComplianceStatus.COMPLIANT : ComplianceStatus.NON_COMPLIANT;
      if (issues_found.length <= 2 && !issues_found.some(issue => issue.toLowerCase().includes("critical"))) {
        overall_status = ComplianceStatus.REQUIRES_REVIEW;
      }

      return {
        content_id: content_data.id || "unknown",
        validation_timestamp: new Date(),
        overall_status,
        compliance_checks,
        issues_found,
        recommendations: await this.generateServiceComplianceRecommendations(issues_found),
        required_disclosures: await this.generateServiceDisclosures(content_data),
        compliance_score: Math.max(0.0, 1.0 - (issues_found.length * 0.15))
      };

    } catch (error) {
      console.error(`Service marketing compliance validation failed:`, error);
      throw error;
    }
  }

  // Private helper methods

  private async validateAdvertisingCompliance(content: Record<string, any>): Promise<ComplianceStatus> {
    // Check for required disclosures
    if (!this.hasAdvertisingDisclosure(content)) {
      return ComplianceStatus.NON_COMPLIANT;
    }

    // Check disclosure prominence
    if (!this.isDisclosureProminent(content)) {
      return ComplianceStatus.NON_COMPLIANT;
    }

    // Check for misleading claims
    if (this.hasMisleadingClaims(content)) {
      return ComplianceStatus.NON_COMPLIANT;
    }

    return ComplianceStatus.COMPLIANT;
  }

  private async validatePrivacyCompliance(content: Record<string, any>): Promise<ComplianceStatus> {
    // Check for personal data usage disclosure
    if (this.usesPersonalData(content) && !this.hasPrivacyNotice(content)) {
      return ComplianceStatus.NON_COMPLIANT;
    }

    // Check consent mechanisms
    if (!this.hasProperConsentMechanism(content)) {
      return ComplianceStatus.REQUIRES_REVIEW;
    }

    return ComplianceStatus.COMPLIANT;
  }

  private async validateTrafficQualityCompliance(content: Record<string, any>): Promise<ComplianceStatus> {
    // Check for incentivized traffic indicators
    if (this.encouragesIncentivizedTraffic(content)) {
      return ComplianceStatus.NON_COMPLIANT;
    }

    // Check for legitimate marketing practices
    if (!this.usesLegitimateMarketingPractices(content)) {
      return ComplianceStatus.NON_COMPLIANT;
    }

    return ComplianceStatus.COMPLIANT;
  }

  private determineOverallCompliance(
    ad_status: ComplianceStatus,
    privacy_status: ComplianceStatus,
    traffic_status: ComplianceStatus,
    service_status?: ComplianceResult
  ): ComplianceStatus {
    const statuses = [ad_status, privacy_status, traffic_status];

    if (statuses.includes(ComplianceStatus.NON_COMPLIANT)) {
      return ComplianceStatus.NON_COMPLIANT;
    } else if (statuses.includes(ComplianceStatus.REQUIRES_REVIEW)) {
      return ComplianceStatus.REQUIRES_REVIEW;
    } else {
      return ComplianceStatus.COMPLIANT;
    }
  }

  private async calculateTrafficQualityScore(session: Record<string, any>): Promise<number> {
    let score = 0.5;  // Base score

    // Session duration factor
    const duration = session.duration || 0;
    if (duration >= this.traffic_quality_standards.min_session_duration) {
      score += 0.2;
    }

    // Pages per session factor
    const pages = session.pages_viewed || 1;
    if (pages >= this.traffic_quality_standards.min_pages_per_session) {
      score += 0.2;
    }

    // Source quality factor
    const source = session.source || "";
    if (!this.traffic_quality_standards.prohibited_sources.includes(source)) {
      score += 0.3;
    }

    return Math.min(score, 1.0);
  }

  private async detectFraudIndicators(session: Record<string, any>): Promise<string[]> {
    const indicators: string[] = [];

    // Check for bot-like behavior
    if ((session.duration || 0) < 5) {  // Very short session
      indicators.push("suspicious_short_session");
    }

    // Check user agent
    const user_agent = (session.user_agent || "").toLowerCase();
    if (user_agent.includes("bot") || user_agent.includes("crawler")) {
      indicators.push("bot_user_agent");
    }

    // Check for rapid clicks
    if ((session.click_rate || 0) > 10) {  // More than 10 clicks per minute
      indicators.push("rapid_clicking");
    }

    return indicators;
  }

  private async checkComplianceFlags(session: Record<string, any>, source: TrafficSource): Promise<string[]> {
    const flags: string[] = [];

    // Check for compliance issues based on source
    if (this.traffic_quality_standards.prohibited_sources.includes(source)) {
      flags.push("prohibited_traffic_source");
    }

    return flags;
  }

  private async compileComplianceIssues(
    content: Record<string, any>,
    ad_compliance: ComplianceStatus,
    privacy_compliance: ComplianceStatus,
    traffic_compliance: ComplianceStatus
  ): Promise<string[]> {
    const issues: string[] = [];

    if (ad_compliance !== ComplianceStatus.COMPLIANT) {
      issues.push("Advertising compliance issues detected");
    }

    if (privacy_compliance !== ComplianceStatus.COMPLIANT) {
      issues.push("Privacy compliance issues detected");
    }

    if (traffic_compliance !== ComplianceStatus.COMPLIANT) {
      issues.push("Traffic quality compliance issues detected");
    }

    return issues;
  }

  private async generateRequiredActions(issues: string[]): Promise<string[]> {
    const actions: string[] = [];

    issues.forEach(issue => {
      if (issue.includes("advertising")) {
        actions.push("Add proper advertising disclosures");
      }
      if (issue.includes("privacy")) {
        actions.push("Update privacy notices and consent mechanisms");
      }
      if (issue.includes("traffic")) {
        actions.push("Review traffic generation methods");
      }
    });

    return actions;
  }

  // Content validation helper methods
  private hasAdvertisingDisclosure(content: Record<string, any>): boolean {
    const text = (content.text || "").toLowerCase();
    const script = (content.script || "").toLowerCase();

    const disclosure_keywords = ["ad", "advertisement", "sponsored", "paid partnership", "affiliate"];

    return disclosure_keywords.some(keyword => text.includes(keyword) || script.includes(keyword));
  }

  private isDisclosureProminent(content: Record<string, any>): boolean {
    // For video content, check if disclosure appears early
    if (content.type === "video") {
      const disclosure_timing = content.disclosure_timing || {};
      return (disclosure_timing.start_time || 999) <= 3.0;  // Within first 3 seconds
    }

    // For text content, check if disclosure is at the beginning
    const text = content.text || "";
    if (text) {
      const first_50_chars = text.substring(0, 50).toLowerCase();
      return ["ad", "sponsored", "paid"].some(keyword => first_50_chars.includes(keyword));
    }

    return false;
  }

  private hasMisleadingClaims(content: Record<string, any>): boolean {
    const text = ((content.text || "") + " " + (content.script || "")).toLowerCase();

    const misleading_phrases = [
      "guaranteed results",
      "100% effective",
      "miracle cure",
      "instant success",
      "no risk",
      "everyone will love"
    ];

    return misleading_phrases.some(phrase => text.includes(phrase));
  }

  private usesPersonalData(content: Record<string, any>): boolean {
    return ["email", "phone", "address", "location", "tracking", "analytics"].some(
      keyword => JSON.stringify(content).toLowerCase().includes(keyword)
    );
  }

  private hasPrivacyNotice(content: Record<string, any>): boolean {
    const contentStr = JSON.stringify(content).toLowerCase();
    return contentStr.includes("privacy") || contentStr.includes("data protection");
  }

  private hasProperConsentMechanism(content: Record<string, any>): boolean {
    return content.has_consent_checkbox || content.has_privacy_link;
  }

  private encouragesIncentivizedTraffic(content: Record<string, any>): boolean {
    const text = JSON.stringify(content).toLowerCase();
    const prohibited_phrases = [
      "get paid to click",
      "earn money by visiting",
      "rewards for signing up",
      "cash for clicks"
    ];

    return prohibited_phrases.some(phrase => text.includes(phrase));
  }

  private usesLegitimateMarketingPractices(content: Record<string, any>): boolean {
    const text = JSON.stringify(content).toLowerCase();

    // Red flags for illegitimate practices
    const red_flags = [
      "guaranteed income",
      "get rich quick",
      "no effort required",
      "secret method",
      "limited time only" // Can be legitimate but requires careful review
    ];

    return !red_flags.some(flag => text.includes(flag));
  }

  // Storage methods (would connect to actual database in production)
  private async storeTrafficRecord(record: TrafficRecord): Promise<void> {
    console.log(`Stored traffic record for session ${record.session_id}`);
    // Implementation would store to database via API
  }

  private async addVideoDisclosure(content: Record<string, any>, disclosure: AdvertisingDisclosure): Promise<Record<string, any>> {
    // Add disclosure to video content
    content.disclosures = content.disclosures || [];
    content.disclosures.push(disclosure);
    return content;
  }

  private async addScriptDisclosure(content: Record<string, any>, disclosure: AdvertisingDisclosure): Promise<Record<string, any>> {
    // Add disclosure to script content
    content.script = `${disclosure.disclosure_text}\n\n${content.script || ""}`;
    return content;
  }

  private async addCaptionDisclosure(content: Record<string, any>, disclosure: AdvertisingDisclosure): Promise<Record<string, any>> {
    // Add disclosure to caption content
    content.caption = `${disclosure.disclosure_text} ${content.caption || ""}`;
    return content;
  }

  // Service marketing validation methods
  private async validateServiceClaims(content_data: Record<string, any>): Promise<{ compliant: boolean; check_type: string; issues: string[] }> {
    const issues: string[] = [];

    const content_text = (content_data.description || "") + " " + (content_data.title || "");

    const problematic_claims = [
      /guaranteed (\d+)%|guaranteed \$[\d,]+|100% success|never fails/i,
      /instant results|overnight success|24 hour transformation/i,
      /secret system|hidden method|exclusive technique no one knows/i,
      /makes? \$[\d,]+ per (day|week|month) guaranteed/i
    ];

    problematic_claims.forEach(pattern => {
      if (pattern.test(content_text)) {
        issues.push(`Potentially unsubstantiated claim detected: pattern '${pattern.source}'`);
      }
    });

    return {
      compliant: issues.length === 0,
      check_type: "service_claims_validation",
      issues
    };
  }

  private async validateTestimonials(content_data: Record<string, any>): Promise<{ compliant: boolean; check_type: string; issues: string[] }> {
    const issues: string[] = [];

    const content_text = (content_data.description || "") + " " + (content_data.title || "");

    if (["client", "customer", "testimonial", "case study"].some(word => content_text.toLowerCase().includes(word))) {
      const required_disclaimers = [
        "results not typical",
        "individual results may vary",
        "past performance",
        "no guarantee"
      ];

      const has_disclaimer = required_disclaimers.some(disclaimer => content_text.toLowerCase().includes(disclaimer));

      if (!has_disclaimer) {
        issues.push("Testimonial content requires 'results not typical' or similar disclaimer");
      }
    }

    return {
      compliant: issues.length === 0,
      check_type: "testimonial_validation",
      issues
    };
  }

  private async validateRevenueClaims(content_data: Record<string, any>): Promise<{ compliant: boolean; check_type: string; issues: string[] }> {
    const issues: string[] = [];

    const content_text = (content_data.description || "") + " " + (content_data.title || "");

    const income_patterns = [
      /\$[\d,]+ (per|a|\/) (month|week|day|year)/i,
      /(made|earned|generated) \$[\d,]+/i,
      /(\d+)-figure|six figure|seven figure/i,
      /passive income|residual income/i
    ];

    const has_income_claim = income_patterns.some(pattern => pattern.test(content_text));

    if (has_income_claim) {
      const income_disclaimers = [
        "results not typical",
        "individual results vary",
        "not guaranteed",
        "past performance"
      ];

      const has_disclaimer = income_disclaimers.some(disclaimer => content_text.toLowerCase().includes(disclaimer));

      if (!has_disclaimer) {
        issues.push("Income claims require appropriate disclaimers about typical results");
      }
    }

    return {
      compliant: issues.length === 0,
      check_type: "revenue_claims_validation",
      issues
    };
  }

  private async validateServiceDisclosures(content_data: Record<string, any>): Promise<{ compliant: boolean; check_type: string; issues: string[] }> {
    const issues: string[] = [];

    const content_text = (content_data.description || "") + " " + (content_data.title || "");

    const is_service_content = ["consultation", "service", "hire me", "work with me", "dm me", "book a call"].some(
      word => content_text.toLowerCase().includes(word)
    );

    if (is_service_content) {
      const has_disclosure = ["business service", "professional service", "consultation", "paid service"].some(
        phrase => content_text.toLowerCase().includes(phrase)
      );

      if (!has_disclosure) {
        issues.push("Service promotion content should clearly indicate professional/paid service");
      }
    }

    return {
      compliant: issues.length === 0,
      check_type: "service_disclosure_validation",
      issues
    };
  }

  private async validateMisleadingPrevention(content_data: Record<string, any>): Promise<{ compliant: boolean; check_type: string; issues: string[] }> {
    const issues: string[] = [];

    const content_text = (content_data.description || "") + " " + (content_data.title || "");

    const misleading_patterns = [
      /only \d+ spots left|limited time only/i,
      /this will be removed|taking this down/i,
      /secret that \w+ don't want you to know/i,
      /one weird trick|doctors hate this/i
    ];

    misleading_patterns.forEach(pattern => {
      if (pattern.test(content_text)) {
        issues.push("Potentially misleading marketing phrase detected");
      }
    });

    return {
      compliant: issues.length === 0,
      check_type: "misleading_prevention",
      issues
    };
  }

  private async generateServiceComplianceRecommendations(issues: string[]): Promise<string[]> {
    const recommendations: string[] = [];

    if (issues.some(issue => issue.includes("unsubstantiated claim"))) {
      recommendations.push("Add disclaimers about typical results and individual variation");
    }

    if (issues.some(issue => issue.includes("testimonial"))) {
      recommendations.push("Include 'results not typical' disclaimer for all testimonials");
    }

    if (issues.some(issue => issue.includes("income claims"))) {
      recommendations.push("Add income disclaimers and substantiation documentation");
    }

    if (issues.some(issue => issue.includes("service disclosure"))) {
      recommendations.push("Clearly identify content as professional service promotion");
    }

    return recommendations;
  }

  private async generateServiceDisclosures(content_data: Record<string, any>): Promise<AdvertisingDisclosure[]> {
    const disclosures: AdvertisingDisclosure[] = [];

    if (["service_promotion", "luxury_lifestyle"].includes(content_data.content_type)) {
      disclosures.push({
        disclosure_id: "service_disclosure_001",
        disclosure_text: "Professional business service - individual results may vary",
        placement: "prominent",
        visibility_duration: 3.0,
        font_size_ratio: 0.8,
        contrast_ratio: 4.5
      });
    }

    return disclosures;
  }
}

// Export default instance
export const complianceManager = new ComplianceManager();