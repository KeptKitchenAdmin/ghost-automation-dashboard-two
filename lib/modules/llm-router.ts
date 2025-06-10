/**
 * Multi-LLM Task Routing and Management System
 * Handles task assignment, routing, and coordination across multiple LLM providers
 */

import OpenAI from 'openai';
import { logger } from '../utils/logger';

export enum TaskType {
  CLIENT_COMMUNICATION = "client_communication",
  PROPOSAL_GENERATION = "proposal_generation",
  TECHNICAL_BUILD = "technical_build",
  CONTENT_CREATION = "content_creation",
  CODE_GENERATION = "code_generation",
  RESEARCH_ANALYSIS = "research_analysis",
  DOCUMENTATION = "documentation",
  TROUBLESHOOTING = "troubleshooting",
  DATA_ANALYSIS = "data_analysis",
  CREATIVE_WRITING = "creative_writing"
}

export enum LLMProvider {
  CLAUDE_SONNET = "claude_sonnet",
  CLAUDE_HAIKU = "claude_haiku",
  GPT4 = "gpt4",
  GPT4_TURBO = "gpt4_turbo",
  GPT3_5 = "gpt3_5",
  GEMINI_PRO = "gemini_pro",
  PERPLEXITY = "perplexity",
  CLAUDE_CODE = "claude_code"
}

export interface LLMCapability {
  provider: LLMProvider;
  strengths: TaskType[];
  cost_per_1k_tokens: number;
  max_tokens: number;
  response_time_avg: number;
  reliability_score: number;
  specialties: string[];
}

export interface TaskRequest {
  task_id: string;
  task_type: TaskType;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  client_id: string;
  project_id: string;
  description: string;
  context: Record<string, any>;
  requirements: Record<string, any>;
  deadline?: Date;
  preferred_llm?: LLMProvider;
}

export interface RateLimitConfig {
  requests_per_minute: number;
  requests_per_hour: number;
  requests_per_day: number;
  monthly_cost_limit: number;
  emergency_fallback_llm: LLMProvider;
}

export interface ClientUsageStats {
  client_id: string;
  current_month: string;
  requests_today: number;
  requests_this_month: number;
  cost_today: number;
  cost_this_month: number;
  tier: string;
}

export interface TaskExecutionResult {
  output: string;
  tokens_used: number;
  cost_usd: number;
  model_used: string;
  execution_time: string;
  requires_human_llm?: boolean;
  task_details?: Record<string, any>;
}

export interface TaskStatus {
  task_id: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'failed';
  assigned_llm: string;
  progress: string;
  created_at: string;
  completed_at?: string;
  cost_usd: number;
  quality_score: number;
}

export interface LLMPerformanceMetrics {
  [llm: string]: {
    tasks_completed: number;
    average_quality_score: number;
    total_cost_usd: number;
    average_completion_time_seconds: number;
    current_load: number;
  };
}

export class LLMRouter {
  private openai_client?: OpenAI;
  private anthropic_client?: any; // Would need proper Anthropic client
  
  private rate_limits: Record<string, RateLimitConfig> = {
    saas: {
      requests_per_minute: 10,
      requests_per_hour: 100,
      requests_per_day: 500,
      monthly_cost_limit: 50.0,
      emergency_fallback_llm: LLMProvider.CLAUDE_HAIKU
    },
    basic: {
      requests_per_minute: 30,
      requests_per_hour: 300,
      requests_per_day: 2000,
      monthly_cost_limit: 500.0,
      emergency_fallback_llm: LLMProvider.GPT3_5
    },
    pro: {
      requests_per_minute: 100,
      requests_per_hour: 1000,
      requests_per_day: 10000,
      monthly_cost_limit: 2000.0,
      emergency_fallback_llm: LLMProvider.CLAUDE_SONNET
    },
    enterprise: {
      requests_per_minute: 500,
      requests_per_hour: 5000,
      requests_per_day: 50000,
      monthly_cost_limit: 10000.0,
      emergency_fallback_llm: LLMProvider.GPT4
    }
  };

  private llm_capabilities: Record<LLMProvider, LLMCapability> = {
    [LLMProvider.CLAUDE_SONNET]: {
      provider: LLMProvider.CLAUDE_SONNET,
      strengths: [TaskType.CLIENT_COMMUNICATION, TaskType.PROPOSAL_GENERATION, 
                 TaskType.CONTENT_CREATION, TaskType.RESEARCH_ANALYSIS],
      cost_per_1k_tokens: 0.015,
      max_tokens: 200000,
      response_time_avg: 3.5,
      reliability_score: 0.95,
      specialties: ["business_communication", "creative_writing", "analysis"]
    },
    [LLMProvider.CLAUDE_CODE]: {
      provider: LLMProvider.CLAUDE_CODE,
      strengths: [TaskType.TECHNICAL_BUILD, TaskType.CODE_GENERATION, 
                 TaskType.TROUBLESHOOTING, TaskType.DOCUMENTATION],
      cost_per_1k_tokens: 0.015,
      max_tokens: 200000,
      response_time_avg: 4.0,
      reliability_score: 0.98,
      specialties: ["software_engineering", "system_architecture", "automation"]
    },
    [LLMProvider.GPT4]: {
      provider: LLMProvider.GPT4,
      strengths: [TaskType.DATA_ANALYSIS, TaskType.RESEARCH_ANALYSIS, 
                 TaskType.PROPOSAL_GENERATION],
      cost_per_1k_tokens: 0.03,
      max_tokens: 128000,
      response_time_avg: 5.0,
      reliability_score: 0.92,
      specialties: ["data_analysis", "research", "problem_solving"]
    },
    [LLMProvider.GPT3_5]: {
      provider: LLMProvider.GPT3_5,
      strengths: [TaskType.CLIENT_COMMUNICATION, TaskType.CONTENT_CREATION],
      cost_per_1k_tokens: 0.002,
      max_tokens: 16000,
      response_time_avg: 2.0,
      reliability_score: 0.88,
      specialties: ["quick_responses", "simple_tasks", "cost_effective"]
    },
    [LLMProvider.CLAUDE_HAIKU]: {
      provider: LLMProvider.CLAUDE_HAIKU,
      strengths: [TaskType.CLIENT_COMMUNICATION, TaskType.CONTENT_CREATION],
      cost_per_1k_tokens: 0.0025,
      max_tokens: 200000,
      response_time_avg: 1.5,
      reliability_score: 0.90,
      specialties: ["fast_responses", "simple_tasks", "cost_effective"]
    },
    [LLMProvider.GPT4_TURBO]: {
      provider: LLMProvider.GPT4_TURBO,
      strengths: [TaskType.DATA_ANALYSIS, TaskType.CODE_GENERATION],
      cost_per_1k_tokens: 0.01,
      max_tokens: 128000,
      response_time_avg: 3.0,
      reliability_score: 0.94,
      specialties: ["advanced_reasoning", "complex_tasks"]
    },
    [LLMProvider.GEMINI_PRO]: {
      provider: LLMProvider.GEMINI_PRO,
      strengths: [TaskType.RESEARCH_ANALYSIS, TaskType.CONTENT_CREATION],
      cost_per_1k_tokens: 0.0005,
      max_tokens: 32000,
      response_time_avg: 2.5,
      reliability_score: 0.87,
      specialties: ["multimodal", "research", "cost_effective"]
    },
    [LLMProvider.PERPLEXITY]: {
      provider: LLMProvider.PERPLEXITY,
      strengths: [TaskType.RESEARCH_ANALYSIS, TaskType.DATA_ANALYSIS],
      cost_per_1k_tokens: 0.02,
      max_tokens: 4000,
      response_time_avg: 4.0,
      reliability_score: 0.89,
      specialties: ["web_search", "current_events", "fact_checking"]
    }
  };

  private routing_rules: Record<TaskType, {
    primary: LLMProvider[];
    fallback: LLMProvider[];
    urgency_override: LLMProvider;
  }> = {
    [TaskType.CLIENT_COMMUNICATION]: {
      primary: [LLMProvider.CLAUDE_SONNET, LLMProvider.CLAUDE_HAIKU],
      fallback: [LLMProvider.GPT3_5],
      urgency_override: LLMProvider.CLAUDE_HAIKU
    },
    [TaskType.TECHNICAL_BUILD]: {
      primary: [LLMProvider.CLAUDE_CODE],
      fallback: [LLMProvider.CLAUDE_SONNET, LLMProvider.GPT4],
      urgency_override: LLMProvider.CLAUDE_CODE
    },
    [TaskType.PROPOSAL_GENERATION]: {
      primary: [LLMProvider.CLAUDE_SONNET, LLMProvider.GPT4],
      fallback: [LLMProvider.GPT3_5],
      urgency_override: LLMProvider.CLAUDE_SONNET
    },
    [TaskType.CODE_GENERATION]: {
      primary: [LLMProvider.CLAUDE_CODE],
      fallback: [LLMProvider.GPT4, LLMProvider.CLAUDE_SONNET],
      urgency_override: LLMProvider.CLAUDE_CODE
    },
    [TaskType.CONTENT_CREATION]: {
      primary: [LLMProvider.CLAUDE_SONNET, LLMProvider.CLAUDE_HAIKU],
      fallback: [LLMProvider.GPT3_5],
      urgency_override: LLMProvider.CLAUDE_HAIKU
    },
    [TaskType.RESEARCH_ANALYSIS]: {
      primary: [LLMProvider.GPT4, LLMProvider.PERPLEXITY],
      fallback: [LLMProvider.CLAUDE_SONNET],
      urgency_override: LLMProvider.GPT4
    },
    [TaskType.DOCUMENTATION]: {
      primary: [LLMProvider.CLAUDE_SONNET, LLMProvider.CLAUDE_CODE],
      fallback: [LLMProvider.GPT4],
      urgency_override: LLMProvider.CLAUDE_SONNET
    },
    [TaskType.TROUBLESHOOTING]: {
      primary: [LLMProvider.CLAUDE_CODE, LLMProvider.GPT4],
      fallback: [LLMProvider.CLAUDE_SONNET],
      urgency_override: LLMProvider.CLAUDE_CODE
    },
    [TaskType.DATA_ANALYSIS]: {
      primary: [LLMProvider.GPT4, LLMProvider.GPT4_TURBO],
      fallback: [LLMProvider.CLAUDE_SONNET],
      urgency_override: LLMProvider.GPT4_TURBO
    },
    [TaskType.CREATIVE_WRITING]: {
      primary: [LLMProvider.CLAUDE_SONNET, LLMProvider.CLAUDE_HAIKU],
      fallback: [LLMProvider.GPT3_5],
      urgency_override: LLMProvider.CLAUDE_SONNET
    }
  };

  private llm_load_tracking: Record<LLMProvider, number> = Object.values(LLMProvider).reduce((acc, provider) => {
    acc[provider] = 0;
    return acc;
  }, {} as Record<LLMProvider, number>);

  constructor() {
    // Initialize LLM clients
    const openai_key = process.env.OPENAI_API_KEY;
    if (openai_key) {
      this.openai_client = new OpenAI({ apiKey: openai_key });
    }
    
    // Would initialize other clients here
    logger.info("LLM Router initialized");
  }

  async routeTask(task_request: TaskRequest): Promise<string> {
    try {
      const selected_llm = await this.selectOptimalLLM(task_request);
      const task_assignment = await this.createTaskAssignment(task_request, selected_llm);
      
      this.llm_load_tracking[selected_llm] += 1;
      
      logger.info(`Task ${task_request.task_id} routed to ${selected_llm}`);
      return task_assignment;

    } catch (error) {
      logger.error(`Failed to route task ${task_request.task_id}: ${error}`);
      throw error;
    }
  }

  private async selectOptimalLLM(task_request: TaskRequest): Promise<LLMProvider> {
    if (task_request.preferred_llm) {
      return task_request.preferred_llm;
    }
    
    const rules = this.routing_rules[task_request.task_type];
    if (!rules) {
      return LLMProvider.CLAUDE_SONNET;
    }
    
    if (['urgent', 'high'].includes(task_request.priority)) {
      return rules.urgency_override;
    }
    
    let best_llm: LLMProvider | null = null;
    let best_score = 0;
    
    for (const llm of rules.primary) {
      const score = await this.calculateLLMScore(llm, task_request);
      if (score > best_score) {
        best_score = score;
        best_llm = llm;
      }
    }
    
    if (!best_llm || best_score < 0.5) {
      for (const llm of rules.fallback) {
        const score = await this.calculateLLMScore(llm, task_request);
        if (score > best_score) {
          best_score = score;
          best_llm = llm;
        }
      }
    }
    
    return best_llm || LLMProvider.CLAUDE_SONNET;
  }

  private async calculateLLMScore(llm: LLMProvider, task_request: TaskRequest): Promise<number> {
    const capabilities = this.llm_capabilities[llm];
    let score = 0.0;
    
    // Task type alignment (40% of score)
    if (capabilities.strengths.includes(task_request.task_type)) {
      score += 0.4;
    }
    
    // Reliability (25% of score)
    score += capabilities.reliability_score * 0.25;
    
    // Current load (20% of score)
    const current_load = this.llm_load_tracking[llm];
    const load_score = Math.max(0, 1 - (current_load / 10));
    score += load_score * 0.20;
    
    // Response time (10% of score)
    if (['urgent', 'high'].includes(task_request.priority)) {
      const time_score = Math.max(0, 1 - (capabilities.response_time_avg / 10));
      score += time_score * 0.10;
    }
    
    // Cost efficiency (5% of score)
    const cost_score = Math.max(0, 1 - (capabilities.cost_per_1k_tokens / 0.05));
    score += cost_score * 0.05;
    
    return score;
  }

  private async createTaskAssignment(task_request: TaskRequest, selected_llm: LLMProvider): Promise<string> {
    // In a real implementation, this would save to database
    logger.info(`Created task assignment: ${task_request.task_id} -> ${selected_llm}`);
    return task_request.task_id;
  }

  async executeTask(task_request: TaskRequest, selected_llm: LLMProvider): Promise<TaskExecutionResult> {
    try {
      await this.updateTaskStatus(task_request.task_id, "in_progress");
      
      let result: TaskExecutionResult;
      
      if ([LLMProvider.CLAUDE_SONNET, LLMProvider.CLAUDE_HAIKU].includes(selected_llm)) {
        result = await this.executeClaudeTask(task_request, selected_llm);
      } else if ([LLMProvider.GPT4, LLMProvider.GPT4_TURBO, LLMProvider.GPT3_5].includes(selected_llm)) {
        result = await this.executeOpenAITask(task_request, selected_llm);
      } else if (selected_llm === LLMProvider.CLAUDE_CODE) {
        result = await this.executeClaudeCodeTask(task_request);
      } else {
        throw new Error(`Unsupported LLM provider: ${selected_llm}`);
      }
      
      await this.updateTaskCompletion(task_request.task_id, result);
      this.llm_load_tracking[selected_llm] -= 1;
      
      return result;

    } catch (error) {
      logger.error(`Task execution failed for ${task_request.task_id}: ${error}`);
      await this.handleTaskFailure(task_request, selected_llm, String(error));
      throw error;
    }
  }

  private async executeClaudeTask(task_request: TaskRequest, llm_provider: LLMProvider): Promise<TaskExecutionResult> {
    // Would use Anthropic client in real implementation
    const prompt = await this.buildTaskPrompt(task_request);
    
    // Mock implementation
    return {
      output: `Claude ${llm_provider} response for: ${task_request.description}`,
      tokens_used: 1000,
      cost_usd: this.calculateCost(1000, llm_provider),
      model_used: llm_provider,
      execution_time: new Date().toISOString()
    };
  }

  private async executeOpenAITask(task_request: TaskRequest, llm_provider: LLMProvider): Promise<TaskExecutionResult> {
    if (!this.openai_client) {
      throw new Error('OpenAI client not initialized');
    }
    
    const model_map: Record<LLMProvider, string> = {
      [LLMProvider.GPT4]: "gpt-4",
      [LLMProvider.GPT4_TURBO]: "gpt-4-turbo-preview",
      [LLMProvider.GPT3_5]: "gpt-3.5-turbo",
      [LLMProvider.CLAUDE_SONNET]: "",
      [LLMProvider.CLAUDE_HAIKU]: "",
      [LLMProvider.CLAUDE_CODE]: "",
      [LLMProvider.GEMINI_PRO]: "",
      [LLMProvider.PERPLEXITY]: ""
    };
    
    const model = model_map[llm_provider];
    const prompt = await this.buildTaskPrompt(task_request);
    
    try {
      const response = await this.openai_client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000
      });
      
      return {
        output: response.choices?.[0]?.message?.content || '',
        tokens_used: response.usage?.total_tokens || 0,
        cost_usd: this.calculateCost(response.usage?.total_tokens || 0, llm_provider),
        model_used: model,
        execution_time: new Date().toISOString()
      };
      
    } catch (error) {
      logger.error(`OpenAI execution failed: ${error}`);
      throw error;
    }
  }

  private async executeClaudeCodeTask(task_request: TaskRequest): Promise<TaskExecutionResult> {
    return {
      output: `CLAUDE_CODE_TASK_REQUIRED: ${task_request.description}`,
      task_details: {
        task_type: task_request.task_type,
        context: task_request.context,
        requirements: task_request.requirements,
        client_id: task_request.client_id,
        project_id: task_request.project_id
      },
      tokens_used: 0,
      cost_usd: 0.0,
      model_used: "claude_code",
      execution_time: new Date().toISOString(),
      requires_human_llm: true
    };
  }

  private async buildTaskPrompt(task_request: TaskRequest): Promise<string> {
    let base_context = `
Task Type: ${task_request.task_type}
Priority: ${task_request.priority}
Client ID: ${task_request.client_id}
Project ID: ${task_request.project_id}

Task Description: ${task_request.description}
`;
    
    if (task_request.context) {
      base_context += `\n\nContext: ${JSON.stringify(task_request.context, null, 2)}`;
    }
    
    if (task_request.requirements) {
      base_context += `\n\nRequirements: ${JSON.stringify(task_request.requirements, null, 2)}`;
    }
    
    const task_instructions: Record<TaskType, string> = {
      [TaskType.CLIENT_COMMUNICATION]: `
You are communicating with a client for our AI automation agency. Be professional, 
helpful, and focus on understanding their needs. Maintain a warm but professional tone.
`,
      [TaskType.PROPOSAL_GENERATION]: `
Generate a professional proposal based on the client requirements. Include pricing,
timeline, deliverables, and clear value propositions. Make it compelling but honest.
`,
      [TaskType.TECHNICAL_BUILD]: `
This is a technical implementation task. Provide detailed, working code or technical
specifications. Focus on best practices, scalability, and maintainability.
`,
      [TaskType.CONTENT_CREATION]: `
Create engaging, high-quality content that aligns with the specified requirements.
Make it compelling and audience-appropriate.
`,
      [TaskType.CODE_GENERATION]: `
Generate clean, efficient, and well-documented code. Follow best practices and include
appropriate comments and error handling.
`,
      [TaskType.RESEARCH_ANALYSIS]: `
Conduct thorough research and provide comprehensive analysis. Include credible sources
and actionable insights.
`,
      [TaskType.DOCUMENTATION]: `
Create clear, comprehensive documentation that is easy to understand and follow.
Include examples and best practices.
`,
      [TaskType.TROUBLESHOOTING]: `
Analyze the problem systematically and provide step-by-step troubleshooting guidance.
Include prevention strategies.
`,
      [TaskType.DATA_ANALYSIS]: `
Perform thorough data analysis and provide insights with supporting evidence.
Include visualizations if appropriate.
`,
      [TaskType.CREATIVE_WRITING]: `
Create engaging, original content that captures the intended voice and style.
Make it compelling and memorable.
`
    };
    
    const instruction = task_instructions[task_request.task_type] || 
      "Complete the requested task professionally and thoroughly.";
    
    return `${instruction}\n\n${base_context}`;
  }

  private calculateCost(tokens: number, llm_provider: LLMProvider): number {
    const capabilities = this.llm_capabilities[llm_provider];
    return (tokens / 1000) * capabilities.cost_per_1k_tokens;
  }

  private async updateTaskStatus(task_id: string, status: string): Promise<void> {
    // Would update database in real implementation
    logger.info(`Task ${task_id} status updated to: ${status}`);
  }

  private async updateTaskCompletion(task_id: string, result: TaskExecutionResult): Promise<void> {
    // Would update database in real implementation
    logger.info(`Task ${task_id} completed successfully`);
  }

  private async handleTaskFailure(task_request: TaskRequest, failed_llm: LLMProvider, error: string): Promise<void> {
    // Would implement retry logic in real implementation
    logger.error(`Task ${task_request.task_id} failed on ${failed_llm}: ${error}`);
  }

  async getTaskStatus(task_id: string): Promise<TaskStatus | null> {
    // Would query database in real implementation
    return {
      task_id,
      status: 'completed',
      assigned_llm: LLMProvider.CLAUDE_SONNET,
      progress: 'completed',
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      cost_usd: 0.05,
      quality_score: 0.9
    };
  }

  async getLLMPerformanceMetrics(): Promise<LLMPerformanceMetrics> {
    // Would calculate from database in real implementation
    const metrics: LLMPerformanceMetrics = {};
    
    for (const provider of Object.values(LLMProvider)) {
      metrics[provider] = {
        tasks_completed: Math.floor(Math.random() * 100),
        average_quality_score: 0.85 + Math.random() * 0.15,
        total_cost_usd: Math.random() * 1000,
        average_completion_time_seconds: 30 + Math.random() * 120,
        current_load: this.llm_load_tracking[provider]
      };
    }
    
    return metrics;
  }
}

// Global router instance
export const llmRouter = new LLMRouter();

// Export default
export default LLMRouter;