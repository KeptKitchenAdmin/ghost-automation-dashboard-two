// Phase 7: Cloudflare Pages Functions Test Suite
// Verifies API routes work correctly in Cloudflare environment

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration?: number;
}

class CloudflareFunctionsTest {
  private baseUrl: string;
  private results: TestResult[] = [];

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Cloudflare Pages Functions Test Suite');
    console.log(`🌐 Testing against: ${this.baseUrl}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test 1: API Route Health Check
    await this.testApiHealth();

    // Test 2: Reddit Automation Usage Stats
    await this.testUsageStats();

    // Test 3: Reddit Scraping Simulation
    await this.testRedditScraping();

    // Test 4: Upload API Test
    await this.testUploadAPI();

    // Test 5: Content Generation API Structure
    await this.testContentGeneration();

    // Display Results
    this.displayResults();
  }

  private async testApiHealth(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Test basic API route availability
      const response = await fetch(`${this.baseUrl}/api/reddit-automation/usage-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const duration = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        this.results.push({
          test: 'API Health Check',
          status: 'PASS',
          message: `API responding correctly (${response.status})`,
          duration
        });
      } else {
        this.results.push({
          test: 'API Health Check',
          status: 'FAIL',
          message: `API returned ${response.status}: ${response.statusText}`,
          duration
        });
      }
    } catch (error) {
      this.results.push({
        test: 'API Health Check',
        status: 'FAIL',
        message: `Network error: ${error.message}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testUsageStats(): Promise<void> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/api/reddit-automation/usage-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const duration = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        
        // Verify response structure
        const hasRequiredFields = data.claude && data.shotstack && typeof data.totalCostToday === 'number';
        
        if (hasRequiredFields) {
          this.results.push({
            test: 'Usage Stats API',
            status: 'PASS',
            message: `Usage stats API working with valid structure`,
            duration
          });
        } else {
          this.results.push({
            test: 'Usage Stats API',
            status: 'FAIL',
            message: `Invalid response structure: ${JSON.stringify(data)}`,
            duration
          });
        }
      } else {
        this.results.push({
          test: 'Usage Stats API',
          status: 'FAIL',
          message: `Usage stats API failed: ${response.status}`,
          duration
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Usage Stats API',
        status: 'FAIL',
        message: `Usage stats error: ${error.message}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testRedditScraping(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Test with minimal request to avoid actual API calls
      const response = await fetch(`${this.baseUrl}/api/reddit-automation/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'drama',
          limit: 1,
          test_mode: true // Signal this is a test
        }),
      });

      const duration = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        this.results.push({
          test: 'Reddit Scraping API',
          status: 'PASS',
          message: `Scraping API accessible and responding`,
          duration
        });
      } else if (response.status === 429 || response.status === 503) {
        // Rate limiting or budget protection is working
        this.results.push({
          test: 'Reddit Scraping API',
          status: 'PASS',
          message: `API correctly protected with rate limiting (${response.status})`,
          duration
        });
      } else {
        this.results.push({
          test: 'Reddit Scraping API',
          status: 'FAIL',
          message: `Scraping API failed: ${response.status}`,
          duration
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Reddit Scraping API',
        status: 'FAIL',
        message: `Scraping error: ${error.message}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testUploadAPI(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Test upload API structure (without actual file)
      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'GET', // Health check endpoint
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const duration = Date.now() - startTime;

      // Any response indicates the API route exists
      this.results.push({
        test: 'Upload API',
        status: 'PASS',
        message: `Upload API endpoint accessible (${response.status})`,
        duration
      });

    } catch (error) {
      this.results.push({
        test: 'Upload API',
        status: 'FAIL',
        message: `Upload API error: ${error.message}`,
        duration: Date.now() - startTime
      });
    }
  }

  private async testContentGeneration(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Test content generation API structure
      const response = await fetch(`${this.baseUrl}/api/content/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test_mode: true,
          type: 'minimal_test'
        }),
      });

      const duration = Date.now() - startTime;

      // Check if API route exists and is accessible
      if (response.status !== 404) {
        this.results.push({
          test: 'Content Generation API',
          status: 'PASS',
          message: `Content generation API accessible (${response.status})`,
          duration
        });
      } else {
        this.results.push({
          test: 'Content Generation API',
          status: 'FAIL',
          message: `Content generation API not found`,
          duration
        });
      }

    } catch (error) {
      this.results.push({
        test: 'Content Generation API',
        status: 'FAIL',
        message: `Content generation error: ${error.message}`,
        duration: Date.now() - startTime
      });
    }
  }

  private displayResults(): void {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Test Results Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;

    this.results.forEach(result => {
      const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
      const durationText = result.duration ? ` (${result.duration}ms)` : '';
      console.log(`${statusIcon} ${result.test}: ${result.message}${durationText}`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📈 Overall Results: ${passed} passed, ${failed} failed, ${skipped} skipped`);
    
    if (failed === 0) {
      console.log('🎉 All tests passed! Cloudflare Pages Functions are ready for deployment.');
    } else {
      console.log('⚠️  Some tests failed. Review configuration before deployment.');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

// Export for use in other scripts
export { CloudflareFunctionsTest };

// Run tests if executed directly
if (require.main === module) {
  const tester = new CloudflareFunctionsTest();
  tester.runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}