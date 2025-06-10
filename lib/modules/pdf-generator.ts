/**
 * Quick PDF Proposal Generator
 * Generates branded PDF proposals for service requests
 */

interface ProposalData {
  client_name?: string;
  service_name?: string;
  package_tier?: string;
  proposal_id?: string;
  service_description?: string;
  deliverables?: string[];
  price?: number;
  timeline_weeks?: number;
  support_weeks?: number;
}

interface ProjectData {
  project_name?: string;
  client_name?: string;
  status?: string;
  progress_percentage?: number;
  start_date?: string;
  estimated_completion?: string;
  deliverables_completed?: string[];
  deliverables_pending?: string[];
  assigned_llm_primary?: string;
  assigned_llm_secondary?: string[];
  quality_score?: number;
}

export class PDFProposalGenerator {
  private baseStyles: Record<string, any>;

  constructor() {
    // Define CSS-like styles for PDF generation
    this.baseStyles = {
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a365d',
        textAlign: 'center',
        marginBottom: 30
      },
      subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2d3748',
        marginTop: 20,
        marginBottom: 12
      },
      body: {
        fontSize: 11,
        color: '#4a5568',
        marginBottom: 12,
        lineHeight: 1.5
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: 20
      }
    };
  }

  async generateServiceProposal(proposalData: ProposalData): Promise<Blob> {
    try {
      // In a browser environment, we would use a library like jsPDF or PDFKit
      // For now, we'll create an HTML template and convert to PDF
      const htmlContent = this.createProposalHTML(proposalData);
      
      // Create PDF using browser's print functionality or a PDF library
      const blob = await this.htmlToPDF(htmlContent);
      
      return blob;
      
    } catch (error) {
      console.error(`PDF generation failed: ${error}`);
      throw error;
    }
  }

  async generateProjectReport(projectData: ProjectData): Promise<Blob> {
    try {
      const htmlContent = this.createProjectReportHTML(projectData);
      const blob = await this.htmlToPDF(htmlContent);
      
      return blob;
      
    } catch (error) {
      console.error(`Project report generation failed: ${error}`);
      throw error;
    }
  }

  private createProposalHTML(data: ProposalData): string {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Service Proposal</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #1a365d;
            padding-bottom: 20px;
        }
        .title {
            font-size: 28px;
            color: #1a365d;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .subtitle {
            font-size: 18px;
            color: #2d3748;
            margin: 20px 0 12px 0;
            font-weight: bold;
        }
        .info-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .info-table td:first-child {
            font-weight: bold;
            width: 150px;
        }
        .investment-table {
            width: 100%;
            border: 1px solid #e2e8f0;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .investment-table td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        .investment-table td:first-child {
            font-weight: bold;
            background-color: #f7fafc;
            width: 200px;
        }
        .investment-table tr:nth-child(2) {
            background-color: #f7fafc;
        }
        .benefits {
            margin: 20px 0;
        }
        .benefit-item {
            margin: 8px 0;
            color: #2d5a27;
            font-weight: 500;
        }
        .deliverable-item {
            margin: 8px 0;
            padding-left: 20px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #666;
        }
        .next-steps {
            background-color: #f0f9ff;
            padding: 20px;
            border-left: 4px solid #1a365d;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">AI Automation Agency</div>
        <div style="font-size: 16px; color: #666;">Professional Service Proposal</div>
    </div>

    <div class="subtitle">Proposal Details</div>
    <table class="info-table">
        <tr>
            <td>Client:</td>
            <td>${data.client_name || 'N/A'}</td>
        </tr>
        <tr>
            <td>Service:</td>
            <td>${data.service_name || 'N/A'}</td>
        </tr>
        <tr>
            <td>Package:</td>
            <td>${(data.package_tier || 'basic').charAt(0).toUpperCase() + (data.package_tier || 'basic').slice(1)}</td>
        </tr>
        <tr>
            <td>Date:</td>
            <td>${currentDate}</td>
        </tr>
        <tr>
            <td>Proposal ID:</td>
            <td>${data.proposal_id || 'N/A'}</td>
        </tr>
    </table>

    <div class="subtitle">Service Overview</div>
    <p>${data.service_description || 'Premium AI automation service tailored to your business needs.'}</p>

    <div class="subtitle">Project Deliverables</div>
    <div>
        ${(data.deliverables || []).map((deliverable, index) => 
            `<div class="deliverable-item">${index + 1}. ${deliverable}</div>`
        ).join('')}
    </div>

    <div class="subtitle">Investment & Timeline</div>
    <table class="investment-table">
        <tr>
            <td>Service Package:</td>
            <td>${(data.package_tier || 'Basic').charAt(0).toUpperCase() + (data.package_tier || 'Basic').slice(1)} Tier</td>
        </tr>
        <tr>
            <td>Investment:</td>
            <td>$${(data.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr>
            <td>Timeline:</td>
            <td>${data.timeline_weeks || 4} weeks</td>
        </tr>
        <tr>
            <td>Payment Terms:</td>
            <td>Full payment due upon acceptance</td>
        </tr>
        <tr>
            <td>Support Included:</td>
            <td>${data.support_weeks || 4} weeks post-delivery</td>
        </tr>
    </table>

    <div class="subtitle">Why Choose Our AI Automation Agency?</div>
    <div class="benefits">
        <div class="benefit-item">✓ Proven track record with viral content creation</div>
        <div class="benefit-item">✓ Multi-LLM technology stack for optimal results</div>
        <div class="benefit-item">✓ Custom automation solutions tailored to your needs</div>
        <div class="benefit-item">✓ Ongoing support and optimization</div>
        <div class="benefit-item">✓ Transparent reporting and analytics</div>
    </div>

    <div class="next-steps">
        <div class="subtitle" style="margin-top: 0;">Next Steps</div>
        <p>Ready to transform your business with AI automation? Simply reply to accept this proposal and we'll begin immediately. Payment can be processed securely through our client portal.</p>
    </div>

    <div class="footer">
        <p>Questions? Contact us at support@aiautomationagency.com</p>
    </div>
</body>
</html>
    `;
  }

  private createProjectReportHTML(data: ProjectData): string {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Project Status Report</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #1a365d;
            padding-bottom: 20px;
        }
        .title {
            font-size: 28px;
            color: #1a365d;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .subtitle {
            font-size: 18px;
            color: #2d3748;
            margin: 20px 0 12px 0;
            font-weight: bold;
        }
        .info-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .info-table td:first-child {
            font-weight: bold;
            width: 150px;
        }
        .completed-item {
            margin: 8px 0;
            color: #2d5a27;
        }
        .pending-item {
            margin: 8px 0;
            color: #744210;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background-color: #38a169;
            transition: width 0.3s ease;
        }
        .ai-section {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Project Status Report</div>
    </div>

    <table class="info-table">
        <tr>
            <td>Project:</td>
            <td>${data.project_name || 'N/A'}</td>
        </tr>
        <tr>
            <td>Client:</td>
            <td>${data.client_name || 'N/A'}</td>
        </tr>
        <tr>
            <td>Status:</td>
            <td>${(data.status || 'in-progress').charAt(0).toUpperCase() + (data.status || 'in-progress').slice(1)}</td>
        </tr>
        <tr>
            <td>Progress:</td>
            <td>
                ${(data.progress_percentage || 0).toFixed(1)}%
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.progress_percentage || 0}%"></div>
                </div>
            </td>
        </tr>
        <tr>
            <td>Start Date:</td>
            <td>${data.start_date || 'N/A'}</td>
        </tr>
        <tr>
            <td>Est. Completion:</td>
            <td>${data.estimated_completion || 'N/A'}</td>
        </tr>
    </table>

    <div class="subtitle">Completed Deliverables</div>
    <div>
        ${(data.deliverables_completed || []).length > 0 
            ? (data.deliverables_completed || []).map(deliverable => 
                `<div class="completed-item">✓ ${deliverable}</div>`
              ).join('')
            : '<p>No deliverables completed yet.</p>'
        }
    </div>

    <div class="subtitle">Upcoming Deliverables</div>
    <div>
        ${(data.deliverables_pending || []).length > 0 
            ? (data.deliverables_pending || []).map(deliverable => 
                `<div class="pending-item">• ${deliverable}</div>`
              ).join('')
            : '<p>All deliverables completed!</p>'
        }
    </div>

    <div class="subtitle">AI Team Assignments</div>
    <div class="ai-section">
        <p><strong>Primary AI:</strong> ${data.assigned_llm_primary || 'Claude Sonnet'}</p>
        <p><strong>Support AI:</strong> ${(data.assigned_llm_secondary || ['GPT-4']).join(', ')}</p>
        <p><strong>Quality Score:</strong> ${(data.quality_score || 0.95).toFixed(2)}/1.00</p>
    </div>

    <div class="footer">
        <p>Report generated on ${currentDate}</p>
    </div>
</body>
</html>
    `;
  }

  private async htmlToPDF(htmlContent: string): Promise<Blob> {
    // In a real implementation, you would use a library like:
    // - jsPDF with html2canvas
    // - Puppeteer (server-side)
    // - PDFKit
    // - A server-side API that converts HTML to PDF
    
    // For now, we'll create a simple text-based PDF or return HTML as blob
    // In production, replace this with actual PDF generation
    
    try {
      // Option 1: Use browser's print to PDF (requires user interaction)
      // window.print() with CSS @media print
      
      // Option 2: Convert to blob for download as HTML (temporary solution)
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Option 3: Use a PDF library (recommended for production)
      // const pdf = await this.generatePDFWithLibrary(htmlContent);
      
      return blob;
      
    } catch (error) {
      console.error('HTML to PDF conversion failed:', error);
      throw error;
    }
  }

  // Method to trigger download of generated PDF
  async downloadProposal(proposalData: ProposalData, filename?: string): Promise<void> {
    try {
      const blob = await this.generateServiceProposal(proposalData);
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `proposal_${proposalData.proposal_id || Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  async downloadProjectReport(projectData: ProjectData, filename?: string): Promise<void> {
    try {
      const blob = await this.generateProjectReport(projectData);
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `project_report_${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  // Method to preview PDF content before generation
  previewProposal(proposalData: ProposalData): string {
    return this.createProposalHTML(proposalData);
  }

  previewProjectReport(projectData: ProjectData): string {
    return this.createProjectReportHTML(projectData);
  }

  // Method to send PDF via API (for email attachment, etc.)
  async sendProposalViaAPI(proposalData: ProposalData, recipient: string): Promise<boolean> {
    try {
      const htmlContent = this.createProposalHTML(proposalData);
      
      const response = await fetch('/api/send-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlContent,
          recipient: recipient,
          type: 'proposal',
          filename: `proposal_${proposalData.proposal_id}.pdf`
        }),
      });

      return response.ok;
      
    } catch (error) {
      console.error('Failed to send proposal via API:', error);
      return false;
    }
  }
}

// Global PDF generator instance
export const pdfGenerator = new PDFProposalGenerator();

// Example usage function
export async function testPDFGeneration(): Promise<void> {
  const sampleProposal: ProposalData = {
    client_name: "John Smith",
    service_name: "AI Content Automation",
    package_tier: "premium",
    proposal_id: "PROP-2024-001",
    service_description: "Complete AI-powered content creation and automation system for viral growth.",
    deliverables: [
      "Custom AI content generation system",
      "TikTok automation workflow",
      "Analytics dashboard",
      "30-day optimization support"
    ],
    price: 15000,
    timeline_weeks: 6,
    support_weeks: 8
  };

  const sampleProject: ProjectData = {
    project_name: "AI Automation Implementation",
    client_name: "Tech Startup Inc",
    status: "in-progress",
    progress_percentage: 65,
    start_date: "March 1, 2024",
    estimated_completion: "April 15, 2024",
    deliverables_completed: [
      "Initial system setup",
      "Content generation pipeline",
      "Basic analytics integration"
    ],
    deliverables_pending: [
      "Advanced automation rules",
      "Full dashboard implementation",
      "Performance optimization"
    ],
    assigned_llm_primary: "Claude Sonnet",
    assigned_llm_secondary: ["GPT-4", "Gemini Pro"],
    quality_score: 0.92
  };

  try {
    // Test proposal generation
    const proposal = await pdfGenerator.generateServiceProposal(sampleProposal);
    console.log('Proposal generated successfully:', proposal.size, 'bytes');

    // Test project report generation
    const report = await pdfGenerator.generateProjectReport(sampleProject);
    console.log('Project report generated successfully:', report.size, 'bytes');

  } catch (error) {
    console.error('PDF generation test failed:', error);
  }
}