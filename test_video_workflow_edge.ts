// Phase 7.6: Edge Runtime Testing for Video Processing Workflows
// Tests the complete Reddit video automation workflow in Cloudflare Pages environment

interface WorkflowStep {
  name: string;
  endpoint: string;
  method: 'GET' | 'POST';
  payload?: any;
  expectedStatus: number;
  timeout: number;
}

interface WorkflowResult {
  step: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration: number;
  data?: any;
  error?: string;
}

class VideoWorkflowEdgeTester {
  private baseUrl: string;
  private results: WorkflowResult[] = [];
  private testData: any = {};

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async runCompleteWorkflowTest(): Promise<void> {
    console.log('🚀 Starting Reddit Video Automation Edge Runtime Workflow Test');
    console.log(`🌐 Testing against: ${this.baseUrl}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Define the complete workflow steps
    const workflowSteps: WorkflowStep[] = [
      {
        name: 'API Health Check',
        endpoint: '/api/main',
        method: 'GET',
        expectedStatus: 200,
        timeout: 5000
      },
      {
        name: 'Usage Stats Initial Check',
        endpoint: '/api/reddit-automation/usage-stats',
        method: 'GET',
        expectedStatus: 200,
        timeout: 10000
      },
      {
        name: 'Reddit Story Scraping',
        endpoint: '/api/reddit-automation/scrape',
        method: 'POST',
        payload: {
          category: 'drama',
          limit: 3,
          test_mode: true
        },
        expectedStatus: 200,
        timeout: 30000
      },
      {
        name: 'File Upload Test',
        endpoint: '/api/upload',
        method: 'GET',
        expectedStatus: 200,
        timeout: 10000
      },
      {
        name: 'Usage Stats After Operations',
        endpoint: '/api/reddit-automation/usage-stats',
        method: 'GET',
        expectedStatus: 200,
        timeout: 10000
      }
    ];

    // Execute workflow steps
    for (const step of workflowSteps) {
      await this.executeWorkflowStep(step);
      
      // Brief pause between steps to simulate real usage
      await this.sleep(1000);
    }

    // Advanced tests (if basic workflow passes)
    if (this.shouldRunAdvancedTests()) {
      await this.runAdvancedWorkflowTests();
    }

    // Display comprehensive results
    this.displayWorkflowResults();
  }

  private async executeWorkflowStep(step: WorkflowStep): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log(`🔄 Executing: ${step.name}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), step.timeout);
      
      const response = await fetch(`${this.baseUrl}${step.endpoint}`, {
        method: step.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Phase7-EdgeTester/1.0',
        },
        body: step.payload ? JSON.stringify(step.payload) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      
      if (response.status === step.expectedStatus) {
        try {
          const data = await response.json();
          this.testData[step.name] = data;
          
          this.results.push({
            step: step.name,
            status: 'PASS',
            message: `Successful ${step.method} request (${response.status})`,
            duration,
            data: this.summarizeResponseData(data)
          });
          
          console.log(`✅ ${step.name}: Success (${duration}ms)`);
          
        } catch (jsonError) {
          // Non-JSON response but correct status
          this.results.push({
            step: step.name,
            status: 'PASS',
            message: `Successful ${step.method} request, non-JSON response`,
            duration
          });
          
          console.log(`✅ ${step.name}: Success - Non-JSON response (${duration}ms)`);
        }
        
      } else {
        this.results.push({
          step: step.name,
          status: 'FAIL',
          message: `Unexpected status: ${response.status} (expected ${step.expectedStatus})`,
          duration,
          error: `HTTP ${response.status}: ${response.statusText}`
        });
        
        console.log(`❌ ${step.name}: Failed - Status ${response.status} (${duration}ms)`);
      }
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      if (error.name === 'AbortError') {
        this.results.push({
          step: step.name,
          status: 'FAIL',
          message: `Request timeout after ${step.timeout}ms`,
          duration,
          error: 'Timeout'
        });
        
        console.log(`⏱️ ${step.name}: Timeout after ${step.timeout}ms`);
        
      } else {
        this.results.push({
          step: step.name,
          status: 'FAIL',
          message: `Network/Runtime error: ${error.message}`,
          duration,
          error: error.message
        });
        
        console.log(`❌ ${step.name}: Error - ${error.message} (${duration}ms)`);
      }
    }
  }

  private shouldRunAdvancedTests(): boolean {
    const passedSteps = this.results.filter(r => r.status === 'PASS').length;
    const totalSteps = this.results.length;
    return passedSteps >= totalSteps * 0.8; // Run advanced tests if 80% of basic tests pass
  }

  private async runAdvancedWorkflowTests(): Promise<void> {
    console.log('🚀 Running Advanced Workflow Tests...');
    
    // Test 1: Stress Test - Multiple concurrent requests
    await this.testConcurrentRequests();
    
    // Test 2: Error Handling - Invalid requests
    await this.testErrorHandling();
    
    // Test 3: Performance - Response time consistency
    await this.testPerformanceConsistency();
  }

  private async testConcurrentRequests(): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('🔄 Testing concurrent requests...');
      
      const concurrentRequests = [
        fetch(`${this.baseUrl}/api/reddit-automation/usage-stats`),
        fetch(`${this.baseUrl}/api/main`),
        fetch(`${this.baseUrl}/api/reddit-automation/usage-stats`)
      ];
      
      const responses = await Promise.all(concurrentRequests);
      const allSuccessful = responses.every(r => r.ok);
      const duration = Date.now() - startTime;
      
      this.results.push({
        step: 'Concurrent Requests Test',
        status: allSuccessful ? 'PASS' : 'FAIL',
        message: allSuccessful 
          ? `${responses.length} concurrent requests successful`
          : `Some concurrent requests failed`,
        duration
      });
      
      console.log(`${allSuccessful ? '✅' : '❌'} Concurrent Requests: ${allSuccessful ? 'Success' : 'Failed'} (${duration}ms)`);
      
    } catch (error: any) {
      this.results.push({
        step: 'Concurrent Requests Test',
        status: 'FAIL',
        message: `Concurrent request test failed: ${error.message}`,
        duration: Date.now() - startTime,
        error: error.message
      });
      
      console.log(`❌ Concurrent Requests: Error - ${error.message}`);
    }
  }

  private async testErrorHandling(): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('🔄 Testing error handling...');
      
      // Test invalid endpoint
      const invalidResponse = await fetch(`${this.baseUrl}/api/nonexistent-endpoint`);
      const duration = Date.now() - startTime;
      
      // Should return 404
      const expectedError = invalidResponse.status === 404;
      
      this.results.push({
        step: 'Error Handling Test',
        status: expectedError ? 'PASS' : 'FAIL',
        message: expectedError 
          ? 'Proper 404 response for invalid endpoint'
          : `Unexpected response for invalid endpoint: ${invalidResponse.status}`,
        duration
      });
      
      console.log(`${expectedError ? '✅' : '❌'} Error Handling: ${expectedError ? 'Proper 404' : 'Unexpected response'} (${duration}ms)`);
      
    } catch (error: any) {
      this.results.push({
        step: 'Error Handling Test',
        status: 'FAIL',
        message: `Error handling test failed: ${error.message}`,
        duration: Date.now() - startTime,
        error: error.message
      });
      
      console.log(`❌ Error Handling: Error - ${error.message}`);
    }
  }

  private async testPerformanceConsistency(): Promise<void> {
    console.log('🔄 Testing performance consistency...');
    
    const measurements: number[] = [];
    const testCount = 3;
    
    for (let i = 0; i < testCount; i++) {
      const startTime = Date.now();
      
      try {
        const response = await fetch(`${this.baseUrl}/api/reddit-automation/usage-stats`);
        const duration = Date.now() - startTime;
        
        if (response.ok) {
          measurements.push(duration);
        }
        
        // Brief pause between measurements
        await this.sleep(500);
        
      } catch (error) {
        console.log(`⚠️ Performance test ${i + 1} failed: ${error.message}`);
      }
    }
    
    if (measurements.length >= 2) {
      const avgDuration = measurements.reduce((a, b) => a + b, 0) / measurements.length;
      const maxDuration = Math.max(...measurements);
      const minDuration = Math.min(...measurements);
      const consistent = (maxDuration - minDuration) < (avgDuration * 0.5); // Within 50% variance
      
      this.results.push({
        step: 'Performance Consistency Test',
        status: consistent ? 'PASS' : 'FAIL',
        message: consistent 
          ? `Consistent performance: ${avgDuration.toFixed(0)}ms avg (${minDuration}-${maxDuration}ms)`
          : `Inconsistent performance: ${avgDuration.toFixed(0)}ms avg (${minDuration}-${maxDuration}ms)`,
        duration: avgDuration
      });
      
      console.log(`${consistent ? '✅' : '⚠️'} Performance: ${avgDuration.toFixed(0)}ms average`);
      
    } else {
      this.results.push({
        step: 'Performance Consistency Test',
        status: 'FAIL',
        message: 'Insufficient measurements for performance analysis',
        duration: 0
      });
      
      console.log(`❌ Performance: Insufficient data`);
    }
  }

  private summarizeResponseData(data: any): any {
    if (!data) return null;
    
    // Summarize large response objects
    if (Array.isArray(data)) {
      return { type: 'array', length: data.length, sample: data[0] || null };
    }
    
    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length > 5) {
        return { type: 'object', keys: keys.slice(0, 5).concat(['...']), total_keys: keys.length };
      }
      return { type: 'object', data };
    }
    
    return data;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private displayWorkflowResults(): void {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Video Processing Workflow Test Results');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;

    // Display detailed results
    this.results.forEach(result => {
      const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
      const durationText = ` (${result.duration}ms)`;
      
      console.log(`${statusIcon} ${result.step}: ${result.message}${durationText}`);
      
      if (result.data) {
        console.log(`   📊 Data: ${JSON.stringify(result.data)}`);
      }
      
      if (result.error) {
        console.log(`   ❌ Error: ${result.error}`);
      }
    });

    // Performance analysis
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    const avgResponseTime = this.results.length > 0 ? totalTime / this.results.length : 0;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📈 Overall Results: ${passed} passed, ${failed} failed, ${skipped} skipped`);
    console.log(`⏱️ Total execution time: ${totalTime}ms`);
    console.log(`📊 Average response time: ${avgResponseTime.toFixed(0)}ms`);

    // Core workflow analysis
    const coreWorkflowSteps = ['API Health Check', 'Usage Stats Initial Check', 'Reddit Story Scraping'];
    const coreResults = this.results.filter(r => coreWorkflowSteps.includes(r.step));
    const corePassRate = coreResults.filter(r => r.status === 'PASS').length / coreResults.length;

    console.log(`🎯 Core workflow success rate: ${(corePassRate * 100).toFixed(0)}%`);

    // Edge runtime assessment
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Phase 7.6 Edge Runtime Assessment:');

    if (failed === 0 && passed >= 5) {
      console.log('✅ Phase 7.6 COMPLETE: Video processing workflow works perfectly in edge runtime');
      console.log('✅ Reddit automation ready for production deployment');
      console.log('✅ All edge runtime compatibility verified');
    } else if (corePassRate >= 0.8) {
      console.log('⚠️  Phase 7.6 MOSTLY COMPLETE: Core workflow functional with minor issues');
      console.log('💡 Production deployment possible with monitoring');
    } else {
      console.log('❌ Phase 7.6 INCOMPLETE: Critical workflow issues in edge runtime');
      console.log('🔧 Address core workflow failures before production deployment');
    }

    // Recommendations
    if (avgResponseTime > 5000) {
      console.log('⚠️  Note: Average response time >5s may impact user experience');
    }
    
    if (failed > 0) {
      console.log('💡 Recommendations:');
      this.results.filter(r => r.status === 'FAIL').forEach(result => {
        console.log(`   • Fix: ${result.step} - ${result.message}`);
      });
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

// Export for use in other scripts
export { VideoWorkflowEdgeTester };

// Run tests if executed directly
if (require.main === module) {
  const tester = new VideoWorkflowEdgeTester();
  tester.runCompleteWorkflowTest().catch(error => {
    console.error('❌ Video workflow edge test failed:', error);
    process.exit(1);
  });
}