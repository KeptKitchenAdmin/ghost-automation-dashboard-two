/**
 * Email Automation Module
 * Handles nurture sequences and lead follow-up
 */

interface EmailConfig {
  delay_hours: number;
  subject: string;
  template: string;
}

interface ScheduleData {
  email: string;
  name: string;
  sequence_type: string;
  email_index: number;
  send_time: string;
  template: string;
  subject: string;
  lead_data?: Record<string, any>;
}

interface SequenceStatus {
  email: string;
  active_sequences: number;
  scheduled_emails: ScheduleData[];
  error?: string;
}

export class EmailAutomation {
  private smtp_server: string;
  private smtp_port: number;
  private email_user?: string;
  private email_password?: string;
  private from_name: string;
  private sequences: Record<string, EmailConfig[]>;
  private templates: Record<string, string>;

  constructor() {
    this.smtp_server = process.env.SMTP_SERVER || 'smtp.gmail.com';
    this.smtp_port = parseInt(process.env.SMTP_PORT || '587');
    this.email_user = process.env.EMAIL_USER;
    this.email_password = process.env.EMAIL_PASSWORD;
    this.from_name = process.env.FROM_NAME || 'Premium Services Team';
    
    this.sequences = {
      luxury_service_intro: [
        {
          delay_hours: 0,
          subject: 'Welcome to Premium Luxury Services',
          template: 'luxury_welcome'
        },
        {
          delay_hours: 24,
          subject: 'Your Exclusive Service Portfolio Awaits',
          template: 'portfolio_showcase'
        },
        {
          delay_hours: 72,
          subject: 'Limited Time: Complimentary Consultation',
          template: 'consultation_offer'
        }
      ],
      service_follow_up: [
        {
          delay_hours: 2,
          subject: 'Thank You for Your Service Inquiry',
          template: 'immediate_followup'
        },
        {
          delay_hours: 48,
          subject: 'Your Custom Service Proposal',
          template: 'proposal_delivery'
        },
        {
          delay_hours: 120,
          subject: 'Ready to Move Forward?',
          template: 'decision_followup'
        }
      ]
    };
    
    this.templates = {
      luxury_welcome: `
Dear {name},

Welcome to our exclusive network of premium service clients.

Your journey toward exceptional lifestyle enhancement begins now. We've curated a selection of our most sought-after services specifically for discerning clients like yourself.

What sets us apart:
• Personalized concierge-level attention
• Exclusive access to premium vendors
• White-glove service delivery
• 24/7 client support

Your dedicated account manager will be in touch within 24 hours to discuss your specific needs.

Best regards,
{from_name}
Premium Services Team
      `,
      
      portfolio_showcase: `
Dear {name},

I wanted to personally share some recent successes from our premium service portfolio:

🏆 Executive Lifestyle Management
- Complete household staff coordination
- Travel itinerary optimization
- Personal shopping and styling

🏆 Business Authority Building
- Executive presence consulting
- Media placement and PR
- Industry leadership positioning

🏆 Exclusive Event Planning
- Private gatherings and celebrations
- Corporate entertainment
- Luxury travel experiences

Would you like to schedule a private consultation to discuss how we can elevate your lifestyle?

Best regards,
{from_name}
      `,
      
      consultation_offer: `
Dear {name},

For the next 48 hours, I'm offering complimentary strategy consultations for select prospects.

This exclusive session includes:
• Personalized service assessment
• Custom recommendation plan
• Priority placement guarantee
• No-obligation proposal

Only 5 spots available this week.

Ready to secure your consultation?
Reply to this email or call our priority line.

Best regards,
{from_name}
      `,
      
      immediate_followup: `
Dear {name},

Thank you for your interest in our premium services.

I've received your inquiry and am personally reviewing your requirements to ensure we provide the most suitable recommendations.

You can expect:
• Custom proposal within 48 hours
• Direct access to your account manager
• Flexible service packages
• Premium client benefits

I'll be in touch very soon with your personalized service plan.

Best regards,
{from_name}
      `,
      
      proposal_delivery: `
Dear {name},

I'm excited to present your custom service proposal.

Based on our discussion, I've created a tailored package that addresses your specific needs while maximizing value and convenience.

Your proposal includes:
• Detailed service breakdown
• Timeline and milestones
• Investment options
• Exclusive client benefits

Please review the attached proposal and let me know if you have any questions.

I'm available for a call to discuss the details whenever convenient for you.

Best regards,
{from_name}
      `,
      
      decision_followup: `
Dear {name},

I wanted to follow up on the service proposal I sent earlier this week.

I understand that decisions of this nature require careful consideration, and I'm here to address any questions or concerns you might have.

Many of our clients find it helpful to discuss:
• Implementation timeline flexibility
• Service customization options
• Payment plan alternatives
• Success guarantees

Would a brief 15-minute call be helpful to clarify any details?

I'm committed to ensuring you have all the information needed to make the best decision for your needs.

Best regards,
{from_name}
      `
    };
  }

  async sendEmail(
    to_email: string,
    subject: string,
    body: string,
    attachments?: string[]
  ): Promise<boolean> {
    try {
      // In a browser environment, we would use a different approach
      // This would typically call an API endpoint that handles email sending
      const emailData = {
        to: to_email,
        subject: subject,
        body: body,
        attachments: attachments || [],
        from: `${this.from_name} <${this.email_user}>`
      };

      // Call backend API to send email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        console.log(`Email sent successfully to ${to_email}`);
        return true;
      } else {
        console.error(`Failed to send email to ${to_email}: ${response.statusText}`);
        return false;
      }
      
    } catch (error) {
      console.error(`Failed to send email to ${to_email}: ${error}`);
      return false;
    }
  }

  async startSequence(
    email: string,
    name: string,
    sequence_type: string,
    lead_data?: Record<string, any>
  ): Promise<boolean> {
    try {
      if (!(sequence_type in this.sequences)) {
        console.error(`Unknown sequence type: ${sequence_type}`);
        return false;
      }
      
      const sequence = this.sequences[sequence_type];
      
      // Send first email immediately
      const first_email = sequence[0];
      const template_content = this.templates[first_email.template];
      
      // Format template with lead data
      const formatted_content = this.formatTemplate(template_content, {
        name: name,
        from_name: this.from_name,
        ...(lead_data || {})
      });
      
      const success = await this.sendEmail(email, first_email.subject, formatted_content);
      
      if (success) {
        // Schedule remaining emails
        await this.scheduleRemainingEmails(email, name, sequence_type, lead_data, sequence.slice(1));
        console.log(`Started ${sequence_type} sequence for ${email}`);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error(`Failed to start sequence for ${email}: ${error}`);
      return false;
    }
  }

  private formatTemplate(template: string, data: Record<string, any>): string {
    let formatted = template;
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{${key}}`;
      formatted = formatted.replace(new RegExp(placeholder, 'g'), String(value));
    }
    return formatted;
  }

  private async scheduleRemainingEmails(
    email: string,
    name: string,
    sequence_type: string,
    lead_data?: Record<string, any>,
    remaining_emails: EmailConfig[] = []
  ): Promise<void> {
    // In production, integrate with task queue or scheduling service
    // For now, schedule using browser APIs or call backend
    
    for (let i = 0; i < remaining_emails.length; i++) {
      const email_config = remaining_emails[i];
      const send_time = new Date(Date.now() + email_config.delay_hours * 60 * 60 * 1000);
      
      console.log(`Scheduled email ${i + 2} for ${email} at ${send_time}`);
      
      // Store in database for actual scheduling
      const schedule_data: ScheduleData = {
        email: email,
        name: name,
        sequence_type: sequence_type,
        email_index: i + 1,
        send_time: send_time.toISOString(),
        template: email_config.template,
        subject: email_config.subject,
        lead_data: lead_data
      };
      
      await this.saveScheduledEmail(schedule_data);
    }
  }

  private async saveScheduledEmail(schedule_data: ScheduleData): Promise<void> {
    try {
      // In browser environment, save to backend API
      await fetch('/api/schedule-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schedule_data),
      });
      
    } catch (error) {
      console.error(`Failed to save scheduled email: ${error}`);
    }
  }

  async sendServiceProposal(
    email: string,
    name: string,
    service_type: string,
    proposal_pdf_path?: string
  ): Promise<boolean> {
    try {
      const subject = `Your Custom ${service_type} Service Proposal`;
      
      const template = this.templates['proposal_delivery'];
      const body = this.formatTemplate(template, {
        name: name,
        from_name: this.from_name
      });
      
      const attachments = proposal_pdf_path ? [proposal_pdf_path] : [];
      
      return await this.sendEmail(email, subject, body, attachments);
      
    } catch (error) {
      console.error(`Failed to send proposal to ${email}: ${error}`);
      return false;
    }
  }

  async sendWelcomeSequence(
    email: string,
    name: string,
    lead_source: string = 'website'
  ): Promise<boolean> {
    const lead_data = {
      lead_source: lead_source,
      signup_date: new Date().toISOString().split('T')[0]
    };
    
    return await this.startSequence(email, name, 'luxury_service_intro', lead_data);
  }

  async sendFollowupSequence(
    email: string,
    name: string,
    service_type: string
  ): Promise<boolean> {
    const lead_data = {
      service_type: service_type,
      inquiry_date: new Date().toISOString().split('T')[0]
    };
    
    return await this.startSequence(email, name, 'service_follow_up', lead_data);
  }

  async getSequenceStatus(email: string): Promise<SequenceStatus> {
    try {
      // In browser environment, call backend API to get status
      const response = await fetch(`/api/email-status/${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          email: email,
          active_sequences: data.active_sequences || 0,
          scheduled_emails: data.scheduled_emails || []
        };
      } else {
        throw new Error(`Failed to get sequence status: ${response.statusText}`);
      }
      
    } catch (error) {
      console.error(`Failed to get sequence status for ${email}: ${error}`);
      return {
        email: email,
        active_sequences: 0,
        scheduled_emails: [],
        error: String(error)
      };
    }
  }

  // Utility methods for template management
  addTemplate(name: string, content: string): void {
    this.templates[name] = content;
  }

  addSequence(name: string, emails: EmailConfig[]): void {
    this.sequences[name] = emails;
  }

  getAvailableSequences(): string[] {
    return Object.keys(this.sequences);
  }

  getAvailableTemplates(): string[] {
    return Object.keys(this.templates);
  }

  // Method to preview formatted template
  previewTemplate(
    template_name: string,
    data: Record<string, any>
  ): string {
    const template = this.templates[template_name];
    if (!template) {
      throw new Error(`Template not found: ${template_name}`);
    }
    
    return this.formatTemplate(template, {
      from_name: this.from_name,
      ...data
    });
  }
}

// Test function
export async function testEmailAutomation(): Promise<boolean> {
  const automation = new EmailAutomation();
  
  // Test template formatting
  const test_email = "test@example.com";
  const test_name = "John Smith";
  
  // Test welcome sequence
  console.log("Testing welcome sequence...");
  await automation.sendWelcomeSequence(test_email, test_name, 'tiktok_viral');
  
  // Test service follow-up
  console.log("Testing service follow-up...");
  await automation.sendFollowupSequence(test_email, test_name, 'luxury_lifestyle');
  
  // Check sequence status
  const status = await automation.getSequenceStatus(test_email);
  console.log(`Sequence status:`, status);
  
  return true;
}

// Export default instance
export const emailAutomation = new EmailAutomation();