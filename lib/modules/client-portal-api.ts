/**
 * Client Portal API
 * FastAPI-based client portal for service requests, project management, and communication
 */

interface DashboardStats {
  total_clients: number;
  active_projects: number;
  monthly_revenue: number;
  pending_requests: number;
  completed_projects: number;
  avg_project_value: number;
}

interface ClientData {
  id: string;
  email: string;
  name: string;
  company?: string;
  tier: string;
  created_at: string;
  last_login?: string;
  total_spent: number;
  active_projects: number;
}

interface ServiceRequest {
  id: string;
  client_id: string;
  service_type: string;
  description: string;
  requirements: Record<string, any>;
  status: string;
  priority: string;
  estimated_price: number;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  client_id: string;
  service_request_id: string;
  name: string;
  description: string;
  status: string;
  progress_percentage: number;
  deliverables: string[];
  timeline_weeks: number;
  start_date?: string;
  end_date?: string;
  total_value: number;
}

interface ClientCommunication {
  id: string;
  client_id: string;
  project_id?: string;
  type: string;
  subject: string;
  message: string;
  sender: string;
  created_at: string;
  read_status: boolean;
}

export class ClientPortalAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.CLIENT_PORTAL_URL || 'http://localhost:8000';
    this.apiKey = process.env.CLIENT_PORTAL_API_KEY || '';
  }

  private async makeRequest<T>(
    endpoint: string, 
    method: string = 'GET', 
    data?: any
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Client portal API error: ${error}`);
      throw error;
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.makeRequest<DashboardStats>('/api/dashboard/stats');
  }

  async getClients(): Promise<ClientData[]> {
    return this.makeRequest<ClientData[]>('/api/clients');
  }

  async getClientById(clientId: string): Promise<ClientData> {
    return this.makeRequest<ClientData>(`/api/clients/${clientId}`);
  }

  async getServiceRequests(status?: string): Promise<ServiceRequest[]> {
    const endpoint = status ? `/api/service-requests?status=${status}` : '/api/service-requests';
    return this.makeRequest<ServiceRequest[]>(endpoint);
  }

  async createServiceRequest(request: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceRequest> {
    return this.makeRequest<ServiceRequest>('/api/service-requests', 'POST', request);
  }

  async updateServiceRequest(requestId: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    return this.makeRequest<ServiceRequest>(`/api/service-requests/${requestId}`, 'PUT', updates);
  }

  async getProjects(clientId?: string): Promise<Project[]> {
    const endpoint = clientId ? `/api/projects?client_id=${clientId}` : '/api/projects';
    return this.makeRequest<Project[]>(endpoint);
  }

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    return this.makeRequest<Project>('/api/projects', 'POST', project);
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    return this.makeRequest<Project>(`/api/projects/${projectId}`, 'PUT', updates);
  }

  async getCommunications(clientId?: string, projectId?: string): Promise<ClientCommunication[]> {
    let endpoint = '/api/communications';
    const params = [];
    
    if (clientId) params.push(`client_id=${clientId}`);
    if (projectId) params.push(`project_id=${projectId}`);
    
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }

    return this.makeRequest<ClientCommunication[]>(endpoint);
  }

  async sendCommunication(communication: Omit<ClientCommunication, 'id' | 'created_at'>): Promise<ClientCommunication> {
    return this.makeRequest<ClientCommunication>('/api/communications', 'POST', communication);
  }

  async processPayment(clientId: string, amount: number, description: string): Promise<{ success: boolean; payment_id?: string; error?: string }> {
    return this.makeRequest<{ success: boolean; payment_id?: string; error?: string }>('/api/payments/process', 'POST', {
      client_id: clientId,
      amount: amount,
      description: description
    });
  }

  async getClientProjects(clientId: string): Promise<Project[]> {
    return this.makeRequest<Project[]>(`/api/clients/${clientId}/projects`);
  }

  async getClientInvoices(clientId: string): Promise<any[]> {
    return this.makeRequest<any[]>(`/api/clients/${clientId}/invoices`);
  }

  async generateProjectProposal(serviceRequestId: string): Promise<{ proposal_url: string }> {
    return this.makeRequest<{ proposal_url: string }>(`/api/service-requests/${serviceRequestId}/proposal`, 'POST');
  }
}

export const clientPortalAPI = new ClientPortalAPI();