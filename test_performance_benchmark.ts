// Phase 7: Performance Benchmarking Under Load
// Tests system performance under various load conditions

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'PASS' | 'FAIL' | 'WARNING';
}

interface LoadTestResult {
  testName: string;
  duration: number;
  requestCount: number;
  successRate: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  throughput: number;
  errors: string[];
}

class PerformanceBenchmark {
  private metrics: PerformanceMetric[] = [];
  private loadTestResults: LoadTestResult[] = [];

  async runPerformanceBenchmarks(): Promise<{ success: boolean; metrics: PerformanceMetric[]; loadTests: LoadTestResult[] }> {
    console.log('⚡ Starting Phase 7 Performance Benchmarking\n');

    try {
      // Test 1: Page Load Performance
      await this.testPageLoadPerformance();
      
      // Test 2: Reddit Scraping Performance
      await this.testRedditScrapingPerformance();
      
      // Test 3: Cache Performance
      await this.testCachePerformance();
      
      // Test 4: Queue Processing Performance
      await this.testQueuePerformance();
      
      // Test 5: Concurrent Request Handling
      await this.testConcurrentRequests();
      
      // Test 6: Memory Usage
      await this.testMemoryUsage();
      
      // Test 7: Load Testing
      await this.runLoadTests();

      return this.generatePerformanceReport();

    } catch (error) {
      console.error('Performance benchmark failed:', error);
      return { success: false, metrics: this.metrics, loadTests: this.loadTestResults };
    }
  }

  private async testPageLoadPerformance(): Promise<void> {
    console.log('📊 Testing Page Load Performance...');
    
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        // DOM Content Loaded
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        this.addMetric('DOM Content Loaded', domContentLoaded, 'ms', 2000);
        
        // Page Load Complete
        const pageLoadComplete = navigation.loadEventEnd - navigation.loadEventStart;
        this.addMetric('Page Load Complete', pageLoadComplete, 'ms', 3000);
        
        // First Byte
        const firstByte = navigation.responseStart - navigation.requestStart;
        this.addMetric('Time to First Byte', firstByte, 'ms', 500);
        
        // DNS Lookup
        const dnsLookup = navigation.domainLookupEnd - navigation.domainLookupStart;
        this.addMetric('DNS Lookup Time', dnsLookup, 'ms', 100);
      } else {
        this.addMetric('Page Load Performance', 0, 'ms', 0, 'WARNING', 'Navigation timing not available');
      }
    } else {
      // Node.js environment - simulate page load test
      const startTime = Date.now();
      
      // Simulate component loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const loadTime = Date.now() - startTime;
      this.addMetric('Simulated Page Load', loadTime, 'ms', 3000);
    }
  }

  private async testRedditScrapingPerformance(): Promise<void> {
    console.log('🔍 Testing Reddit Scraping Performance...');
    
    try {
      const { RedditScraperService } = await import('./lib/services/reddit-scraper');
      const scraper = new RedditScraperService();
      
      const startTime = Date.now();
      const stories = await scraper.scrapeRedditStories('drama', 10);
      const scrapingTime = Date.now() - startTime;
      
      this.addMetric('Reddit Scraping (10 stories)', scrapingTime, 'ms', 5000);
      
      if (stories.length > 0) {
        const timePerStory = scrapingTime / stories.length;
        this.addMetric('Time per Story', timePerStory, 'ms', 500);
      }
      
    } catch (error) {
      this.addMetric('Reddit Scraping Performance', 0, 'ms', 0, 'FAIL', `Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  private async testCachePerformance(): Promise<void> {
    console.log('💾 Testing Cache Performance...');
    
    try {
      const { RedditCacheService } = await import('./lib/services/reddit-cache-service');
      const cache = new RedditCacheService();
      
      // Test cache write performance
      const testData = Array.from({ length: 100 }, (_, i) => ({
        id: `story_${i}`,
        title: `Test Story ${i}`,
        content: 'Test content '.repeat(50),
        subreddit: 'test',
        upvotes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        created_utc: Date.now() / 1000,
        url: `https://test.com/${i}`,
        viral_score: Math.random() * 10,
        category: 'drama' as const,
        estimated_duration: 180
      }));
      
      const writeStartTime = Date.now();
      await cache.cacheStories('drama', testData);
      const writeTime = Date.now() - writeStartTime;
      
      this.addMetric('Cache Write (100 stories)', writeTime, 'ms', 1000);
      
      // Test cache read performance
      const readStartTime = Date.now();
      const cachedData = await cache.getCachedStories('drama');
      const readTime = Date.now() - readStartTime;
      
      this.addMetric('Cache Read (100 stories)', readTime, 'ms', 100);
      
      // Test cache hit ratio
      if (cachedData && cachedData.length === testData.length) {
        this.addMetric('Cache Hit Ratio', 100, '%', 95);
      } else {
        this.addMetric('Cache Hit Ratio', 0, '%', 95, 'FAIL');
      }
      
    } catch (error) {
      this.addMetric('Cache Performance', 0, 'ms', 0, 'FAIL', `Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  private async testQueuePerformance(): Promise<void> {
    console.log('🔄 Testing Queue Processing Performance...');
    
    try {
      const { getQueueManager } = await import('./lib/services/client-queue-manager');
      const queueManager = getQueueManager();
      
      // Test adding multiple jobs
      const startTime = Date.now();
      const jobIds: string[] = [];
      
      for (let i = 0; i < 20; i++) {
        const jobId = queueManager.addJob('story_enhancement', {
          story: { id: `test_${i}`, content: 'Test content' },
          targetDuration: 5
        }, 'medium');
        jobIds.push(jobId);
      }
      
      const addJobsTime = Date.now() - startTime;
      this.addMetric('Add 20 Jobs to Queue', addJobsTime, 'ms', 500);
      
      // Test queue statistics retrieval
      const statsStartTime = Date.now();
      const stats = queueManager.getQueueStats();
      const statsTime = Date.now() - statsStartTime;
      
      this.addMetric('Queue Stats Retrieval', statsTime, 'ms', 50);
      
      // Test job status retrieval
      const statusStartTime = Date.now();
      jobIds.forEach(id => queueManager.getJobStatus(id));
      const statusTime = Date.now() - statusStartTime;
      
      this.addMetric('Job Status Retrieval (20 jobs)', statusTime, 'ms', 100);
      
    } catch (error) {
      this.addMetric('Queue Performance', 0, 'ms', 0, 'FAIL', `Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  private async testConcurrentRequests(): Promise<void> {
    console.log('🔀 Testing Concurrent Request Handling...');
    
    try {
      const { getScalingManager } = await import('./lib/utils/cloudflare-scaling');
      const scalingManager = getScalingManager();
      
      // Create multiple concurrent requests
      const concurrentRequests = Array.from({ length: 5 }, (_, i) => 
        () => new Promise(resolve => {
          setTimeout(() => resolve(`Request ${i} completed`), Math.random() * 1000);
        })
      );
      
      const startTime = Date.now();
      const results = await scalingManager.batchAPIRequests(concurrentRequests, 3);
      const concurrentTime = Date.now() - startTime;
      
      this.addMetric('Concurrent Requests (5 requests)', concurrentTime, 'ms', 2000);
      
      if (results.length === 5) {
        this.addMetric('Concurrent Request Success Rate', 100, '%', 100);
      } else {
        this.addMetric('Concurrent Request Success Rate', (results.length / 5) * 100, '%', 100, 'WARNING');
      }
      
    } catch (error) {
      this.addMetric('Concurrent Request Performance', 0, 'ms', 0, 'FAIL', `Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  private async testMemoryUsage(): Promise<void> {
    console.log('🧠 Testing Memory Usage...');
    
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      
      this.addMetric('Used JS Heap Size', memory.usedJSHeapSize / 1024 / 1024, 'MB', 50);
      this.addMetric('Total JS Heap Size', memory.totalJSHeapSize / 1024 / 1024, 'MB', 100);
      this.addMetric('JS Heap Size Limit', memory.jsHeapSizeLimit / 1024 / 1024, 'MB', 2000);
      
      // Calculate memory efficiency
      const efficiency = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
      this.addMetric('Memory Efficiency', efficiency, '%', 80);
      
    } else if (typeof process !== 'undefined' && process.memoryUsage) {
      const memory = process.memoryUsage();
      
      this.addMetric('RSS Memory', memory.rss / 1024 / 1024, 'MB', 100);
      this.addMetric('Heap Used', memory.heapUsed / 1024 / 1024, 'MB', 50);
      this.addMetric('Heap Total', memory.heapTotal / 1024 / 1024, 'MB', 100);
      this.addMetric('External Memory', memory.external / 1024 / 1024, 'MB', 50);
      
    } else {
      this.addMetric('Memory Usage', 0, 'MB', 0, 'WARNING', 'Memory API not available');
    }
  }

  private async runLoadTests(): Promise<void> {
    console.log('🔥 Running Load Tests...');
    
    // Load Test 1: Reddit Scraping under load
    await this.runRedditScrapingLoadTest();
    
    // Load Test 2: Queue processing under load
    await this.runQueueLoadTest();
    
    // Load Test 3: Cache operations under load
    await this.runCacheLoadTest();
  }

  private async runRedditScrapingLoadTest(): Promise<void> {
    const testName = 'Reddit Scraping Load Test';
    const duration = 10000; // 10 seconds
    const startTime = Date.now();
    let requestCount = 0;
    let successCount = 0;
    const responseTimes: number[] = [];
    const errors: string[] = [];
    
    try {
      const { RedditScraperService } = await import('./lib/services/reddit-scraper');
      
      while (Date.now() - startTime < duration) {
        const requestStart = Date.now();
        requestCount++;
        
        try {
          const scraper = new RedditScraperService();
          await scraper.scrapeRedditStories('drama', 5);
          successCount++;
          responseTimes.push(Date.now() - requestStart);
        } catch (error) {
          errors.push(`Request ${requestCount}: ${error instanceof Error ? error.message : 'Unknown'}`);
        }
        
        // Small delay to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const actualDuration = Date.now() - startTime;
      const successRate = (successCount / requestCount) * 100;
      const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;
      const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
      const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
      const throughput = (successCount / actualDuration) * 1000; // requests per second
      
      this.loadTestResults.push({
        testName,
        duration: actualDuration,
        requestCount,
        successRate,
        averageResponseTime,
        maxResponseTime,
        minResponseTime,
        throughput,
        errors: errors.slice(0, 5) // Keep only first 5 errors
      });
      
    } catch (error) {
      this.loadTestResults.push({
        testName,
        duration: 0,
        requestCount: 0,
        successRate: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0,
        throughput: 0,
        errors: [`Load test failed: ${error instanceof Error ? error.message : 'Unknown'}`]
      });
    }
  }

  private async runQueueLoadTest(): Promise<void> {
    const testName = 'Queue Processing Load Test';
    const jobCount = 100;
    const startTime = Date.now();
    let successCount = 0;
    const errors: string[] = [];
    
    try {
      const { getQueueManager } = await import('./lib/services/client-queue-manager');
      const queueManager = getQueueManager();
      
      // Add many jobs rapidly
      for (let i = 0; i < jobCount; i++) {
        try {
          queueManager.addJob('story_enhancement', {
            story: { id: `load_test_${i}`, content: `Load test content ${i}` },
            targetDuration: 5
          }, 'low');
          successCount++;
        } catch (error) {
          errors.push(`Job ${i}: ${error instanceof Error ? error.message : 'Unknown'}`);
        }
      }
      
      const duration = Date.now() - startTime;
      const successRate = (successCount / jobCount) * 100;
      const throughput = (successCount / duration) * 1000;
      
      this.loadTestResults.push({
        testName,
        duration,
        requestCount: jobCount,
        successRate,
        averageResponseTime: duration / jobCount,
        maxResponseTime: duration,
        minResponseTime: 0,
        throughput,
        errors: errors.slice(0, 5)
      });
      
    } catch (error) {
      this.loadTestResults.push({
        testName,
        duration: 0,
        requestCount: 0,
        successRate: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0,
        throughput: 0,
        errors: [`Load test failed: ${error instanceof Error ? error.message : 'Unknown'}`]
      });
    }
  }

  private async runCacheLoadTest(): Promise<void> {
    const testName = 'Cache Operations Load Test';
    const operationCount = 1000;
    const startTime = Date.now();
    let successCount = 0;
    const responseTimes: number[] = [];
    const errors: string[] = [];
    
    try {
      const { RedditCacheService } = await import('./lib/services/reddit-cache-service');
      const cache = new RedditCacheService();
      
      // Mix of read and write operations
      for (let i = 0; i < operationCount; i++) {
        const operationStart = Date.now();
        
        try {
          if (i % 2 === 0) {
            // Write operation
            const testData = [{
              id: `cache_test_${i}`,
              title: `Cache Test ${i}`,
              content: 'Cache test content',
              subreddit: 'test',
              upvotes: 100,
              comments: 10,
              created_utc: Date.now() / 1000,
              url: `https://test.com/${i}`,
              viral_score: 5.0,
              category: 'drama' as const,
              estimated_duration: 180
            }];
            await cache.cacheStories('drama', testData);
          } else {
            // Read operation
            await cache.getCachedStories('drama');
          }
          
          successCount++;
          responseTimes.push(Date.now() - operationStart);
        } catch (error) {
          errors.push(`Operation ${i}: ${error instanceof Error ? error.message : 'Unknown'}`);
        }
      }
      
      const duration = Date.now() - startTime;
      const successRate = (successCount / operationCount) * 100;
      const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;
      const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
      const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
      const throughput = (successCount / duration) * 1000;
      
      this.loadTestResults.push({
        testName,
        duration,
        requestCount: operationCount,
        successRate,
        averageResponseTime,
        maxResponseTime,
        minResponseTime,
        throughput,
        errors: errors.slice(0, 5)
      });
      
    } catch (error) {
      this.loadTestResults.push({
        testName,
        duration: 0,
        requestCount: 0,
        successRate: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0,
        throughput: 0,
        errors: [`Load test failed: ${error instanceof Error ? error.message : 'Unknown'}`]
      });
    }
  }

  private addMetric(name: string, value: number, unit: string, threshold: number, status?: 'PASS' | 'FAIL' | 'WARNING', note?: string): void {
    const finalStatus = status || (value <= threshold ? 'PASS' : value <= threshold * 1.2 ? 'WARNING' : 'FAIL');
    
    this.metrics.push({
      name,
      value,
      unit,
      threshold,
      status: finalStatus
    });
    
    const emoji = finalStatus === 'PASS' ? '✅' : finalStatus === 'FAIL' ? '❌' : '⚠️';
    const noteText = note ? ` (${note})` : '';
    console.log(`${emoji} ${name}: ${value}${unit} (threshold: ${threshold}${unit})${noteText}`);
  }

  private generatePerformanceReport(): { success: boolean; metrics: PerformanceMetric[]; loadTests: LoadTestResult[] } {
    const passCount = this.metrics.filter(m => m.status === 'PASS').length;
    const failCount = this.metrics.filter(m => m.status === 'FAIL').length;
    const warningCount = this.metrics.filter(m => m.status === 'WARNING').length;
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 PHASE 7 PERFORMANCE BENCHMARK REPORT');
    console.log('='.repeat(80));
    console.log(`Performance Metrics: ${this.metrics.length}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⚠️ Warnings: ${warningCount}`);
    console.log('');
    
    console.log('🔥 LOAD TEST RESULTS:');
    this.loadTestResults.forEach(result => {
      console.log(`\n📋 ${result.testName}:`);
      console.log(`   Duration: ${result.duration}ms`);
      console.log(`   Requests: ${result.requestCount}`);
      console.log(`   Success Rate: ${result.successRate.toFixed(1)}%`);
      console.log(`   Avg Response: ${result.averageResponseTime.toFixed(1)}ms`);
      console.log(`   Throughput: ${result.throughput.toFixed(2)} req/s`);
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.length}`);
      }
    });
    
    const success = failCount === 0;
    const status = success ? (warningCount > 0 ? 'PASS WITH WARNINGS' : 'COMPLETE PASS') : 'FAILED';
    
    console.log('');
    console.log(`🎯 PERFORMANCE STATUS: ${status}`);
    console.log('='.repeat(80));
    
    return { success, metrics: this.metrics, loadTests: this.loadTestResults };
  }
}

// Export for use in other tests
export { PerformanceBenchmark };

// Run test if executed directly
if (typeof window === 'undefined' && require.main === module) {
  const benchmark = new PerformanceBenchmark();
  benchmark.runPerformanceBenchmarks().then(report => {
    process.exit(report.success ? 0 : 1);
  });
}