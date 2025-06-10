// Security module exports
export { APIKeyProtectionService } from './api-key-protection';
export { IPProtectionService } from './ip-protection';
export { APICostThresholds } from './cost-thresholds';
export { ComprehensiveProtectionService, protectionService } from './comprehensive-protection';

// Security initialization
export async function initializeSecurity() {
  console.log('🔒 Initializing security protocols...');
  
  try {
    // Validate environment variables
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('⚠️ ANTHROPIC_API_KEY not found in environment');
    }
    
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not found in environment');
    }

    // Initialize protection service
    const status = await protectionService.getSecurityStatus();
    
    if (!status.apiKeys.secure) {
      console.error('🚨 API Key security issues detected:', status.apiKeys.issues);
    }
    
    console.log('✅ Security protocols initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize security protocols:', error);
    return false;
  }
}

// Helper function for API requests with protection
export async function protectedAPIRequest<T>(
  service: 'openai' | 'anthropic' | 'googleCloud' | 'youtube' | 'elevenlabs' | 'heygen',
  requestFn: () => Promise<T>,
  estimatedUsage?: {
    inputTokens?: number;
    outputTokens?: number;
    audioMinutes?: number;
    videoMinutes?: number;
    characters?: number;
    images?: number;
  }
): Promise<T> {
  // Pre-request check
  const check = await protectionService.preRequestCheck(service, estimatedUsage);
  
  if (!check.allowed) {
    throw new Error(`Request blocked: ${check.reason}`);
  }
  
  // Wait for human-like delay
  if (check.waitTime > 0) {
    await new Promise(resolve => setTimeout(resolve, check.waitTime));
  }
  
  let success = false;
  let responseCode: number | undefined;
  
  try {
    const result = await requestFn();
    success = true;
    return result;
  } catch (error: any) {
    success = false;
    responseCode = error.response?.status || error.status;
    throw error;
  } finally {
    // Post-request recording
    await protectionService.postRequestRecord(service, success, estimatedUsage, responseCode);
  }
}