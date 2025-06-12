// Phase 7.4: Cloudflare R2 Storage Integration Testing
// Comprehensive test suite for R2 storage functionality

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

interface R2TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration?: number;
  details?: any;
}

class R2IntegrationTest {
  private r2Client: S3Client | null = null;
  private bucketName: string;
  private results: R2TestResult[] = [];
  private testFileKeys: string[] = [];

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME || 'ghosttrace-output';
    this.initializeR2Client();
  }

  private initializeR2Client(): void {
    try {
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const accessKeyId = process.env.R2_ACCESS_KEY_ID;
      const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

      if (!accountId || !accessKeyId || !secretAccessKey) {
        console.log('⚠️  R2 credentials not found - some tests will be skipped');
        return;
      }

      this.r2Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      console.log('✅ R2 Client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize R2 client:', error);
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting R2 Storage Integration Test Suite');
    console.log(`🪣 Bucket: ${this.bucketName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test 1: Environment Variables Check
    await this.testEnvironmentVariables();

    // Test 2: R2 Client Connection
    await this.testR2Connection();

    // Test 3: Bucket Access
    await this.testBucketAccess();

    // Test 4: File Upload (Small)
    await this.testSmallFileUpload();

    // Test 5: File Upload (Large simulation)
    await this.testLargeFileUpload();

    // Test 6: File Download
    await this.testFileDownload();

    // Test 7: Usage Logging
    await this.testUsageLogging();

    // Test 8: File Cleanup
    await this.testFileCleanup();

    // Display Results
    this.displayResults();
  }

  private async testEnvironmentVariables(): Promise<void> {
    const startTime = Date.now();
    
    const requiredVars = {
      'CLOUDFLARE_ACCOUNT_ID': process.env.CLOUDFLARE_ACCOUNT_ID,
      'R2_ACCESS_KEY_ID': process.env.R2_ACCESS_KEY_ID,
      'R2_SECRET_ACCESS_KEY': process.env.R2_SECRET_ACCESS_KEY,
      'R2_BUCKET_NAME': process.env.R2_BUCKET_NAME
    };

    const missing = Object.entries(requiredVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    const duration = Date.now() - startTime;

    if (missing.length === 0) {
      this.results.push({
        test: 'Environment Variables',
        status: 'PASS',
        message: 'All required R2 environment variables are set',
        duration,
        details: { vars_checked: Object.keys(requiredVars).length }
      });
    } else {
      this.results.push({
        test: 'Environment Variables',
        status: 'FAIL',
        message: `Missing variables: ${missing.join(', ')}`,
        duration,
        details: { missing_vars: missing }
      });
    }
  }

  private async testR2Connection(): Promise<void> {
    const startTime = Date.now();
    
    if (!this.r2Client) {
      this.results.push({
        test: 'R2 Connection',
        status: 'SKIP',
        message: 'R2 client not initialized (missing credentials)',
        duration: Date.now() - startTime
      });
      return;
    }

    try {
      // Test connection by listing objects (should not fail even if empty)
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 1
      });

      await this.r2Client.send(command);
      
      this.results.push({
        test: 'R2 Connection',
        status: 'PASS',
        message: 'Successfully connected to R2 storage',
        duration: Date.now() - startTime
      });
    } catch (error: any) {
      this.results.push({
        test: 'R2 Connection',
        status: 'FAIL',
        message: `Connection failed: ${error.message}`,
        duration: Date.now() - startTime,
        details: { error_code: error.Code || 'Unknown' }
      });
    }
  }

  private async testBucketAccess(): Promise<void> {
    const startTime = Date.now();
    
    if (!this.r2Client) {
      this.results.push({
        test: 'Bucket Access',
        status: 'SKIP',
        message: 'R2 client not available',
        duration: Date.now() - startTime
      });
      return;
    }

    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 5
      });

      const response = await this.r2Client.send(command);
      
      this.results.push({
        test: 'Bucket Access',
        status: 'PASS',
        message: `Bucket accessible, contains ${response.KeyCount || 0} objects`,
        duration: Date.now() - startTime,
        details: { 
          bucket: this.bucketName,
          object_count: response.KeyCount || 0,
          truncated: response.IsTruncated || false
        }
      });
    } catch (error: any) {
      this.results.push({
        test: 'Bucket Access',
        status: 'FAIL',
        message: `Bucket access failed: ${error.message}`,
        duration: Date.now() - startTime,
        details: { bucket: this.bucketName, error_code: error.Code }
      });
    }
  }

  private async testSmallFileUpload(): Promise<void> {
    const startTime = Date.now();
    
    if (!this.r2Client) {
      this.results.push({
        test: 'Small File Upload',
        status: 'SKIP',
        message: 'R2 client not available',
        duration: Date.now() - startTime
      });
      return;
    }

    try {
      const testContent = JSON.stringify({
        test: 'R2 Integration Test',
        timestamp: new Date().toISOString(),
        purpose: 'Verify R2 upload functionality',
        size: 'small'
      }, null, 2);

      const key = `test-files/small-test-${Date.now()}.json`;
      this.testFileKeys.push(key);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: Buffer.from(testContent),
        ContentType: 'application/json',
      });

      await this.r2Client.send(command);
      
      this.results.push({
        test: 'Small File Upload',
        status: 'PASS',
        message: `Successfully uploaded small file (${testContent.length} bytes)`,
        duration: Date.now() - startTime,
        details: { 
          key,
          size_bytes: testContent.length,
          content_type: 'application/json'
        }
      });
    } catch (error: any) {
      this.results.push({
        test: 'Small File Upload',
        status: 'FAIL',
        message: `Upload failed: ${error.message}`,
        duration: Date.now() - startTime,
        details: { error_code: error.Code }
      });
    }
  }

  private async testLargeFileUpload(): Promise<void> {
    const startTime = Date.now();
    
    if (!this.r2Client) {
      this.results.push({
        test: 'Large File Upload',
        status: 'SKIP',
        message: 'R2 client not available',
        duration: Date.now() - startTime
      });
      return;
    }

    try {
      // Simulate a larger file (1MB of test data)
      const chunkSize = 1024; // 1KB chunks
      const chunks = 1024; // 1024 chunks = 1MB
      const largeContent = Buffer.alloc(chunkSize * chunks, 'A');

      const key = `test-files/large-test-${Date.now()}.bin`;
      this.testFileKeys.push(key);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: largeContent,
        ContentType: 'application/octet-stream',
      });

      await this.r2Client.send(command);
      
      this.results.push({
        test: 'Large File Upload',
        status: 'PASS',
        message: `Successfully uploaded large file (${largeContent.length} bytes)`,
        duration: Date.now() - startTime,
        details: { 
          key,
          size_bytes: largeContent.length,
          size_mb: (largeContent.length / 1024 / 1024).toFixed(2)
        }
      });
    } catch (error: any) {
      this.results.push({
        test: 'Large File Upload',
        status: 'FAIL',
        message: `Large upload failed: ${error.message}`,
        duration: Date.now() - startTime,
        details: { error_code: error.Code }
      });
    }
  }

  private async testFileDownload(): Promise<void> {
    const startTime = Date.now();
    
    if (!this.r2Client || this.testFileKeys.length === 0) {
      this.results.push({
        test: 'File Download',
        status: 'SKIP',
        message: 'No test files available for download',
        duration: Date.now() - startTime
      });
      return;
    }

    try {
      const key = this.testFileKeys[0]; // Download the first uploaded file

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.r2Client.send(command);
      const contentLength = response.ContentLength || 0;
      
      this.results.push({
        test: 'File Download',
        status: 'PASS',
        message: `Successfully downloaded file (${contentLength} bytes)`,
        duration: Date.now() - startTime,
        details: { 
          key,
          content_length: contentLength,
          content_type: response.ContentType
        }
      });
    } catch (error: any) {
      this.results.push({
        test: 'File Download',
        status: 'FAIL',
        message: `Download failed: ${error.message}`,
        duration: Date.now() - startTime,
        details: { error_code: error.Code }
      });
    }
  }

  private async testUsageLogging(): Promise<void> {
    const startTime = Date.now();
    
    if (!this.r2Client) {
      this.results.push({
        test: 'Usage Logging',
        status: 'SKIP',
        message: 'R2 client not available',
        duration: Date.now() - startTime
      });
      return;
    }

    try {
      const usageLog = {
        timestamp: new Date().toISOString(),
        service: 'r2_integration_test',
        cost: 0.001,
        metadata: {
          test_type: 'usage_logging',
          api_calls: 1,
          bytes_transferred: 1024
        },
        type: 'test_usage_log',
        userTriggered: true,
        safety_note: 'API called only during test workflow'
      };

      const logKey = `usage-logs/${new Date().toISOString().split('T')[0]}/test_${Date.now()}.json`;
      this.testFileKeys.push(logKey);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: logKey,
        Body: Buffer.from(JSON.stringify(usageLog, null, 2)),
        ContentType: 'application/json',
      });

      await this.r2Client.send(command);
      
      this.results.push({
        test: 'Usage Logging',
        status: 'PASS',
        message: 'Successfully logged usage data to R2',
        duration: Date.now() - startTime,
        details: { 
          log_key: logKey,
          log_size: JSON.stringify(usageLog).length
        }
      });
    } catch (error: any) {
      this.results.push({
        test: 'Usage Logging',
        status: 'FAIL',
        message: `Usage logging failed: ${error.message}`,
        duration: Date.now() - startTime,
        details: { error_code: error.Code }
      });
    }
  }

  private async testFileCleanup(): Promise<void> {
    const startTime = Date.now();
    
    if (!this.r2Client || this.testFileKeys.length === 0) {
      this.results.push({
        test: 'File Cleanup',
        status: 'SKIP',
        message: 'No test files to clean up',
        duration: Date.now() - startTime
      });
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const key of this.testFileKeys) {
      try {
        const command = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });

        await this.r2Client.send(command);
        successCount++;
      } catch (error) {
        errorCount++;
        console.warn(`Failed to delete test file: ${key}`, error);
      }
    }

    const duration = Date.now() - startTime;

    if (errorCount === 0) {
      this.results.push({
        test: 'File Cleanup',
        status: 'PASS',
        message: `Successfully cleaned up ${successCount} test files`,
        duration,
        details: { 
          files_deleted: successCount,
          errors: errorCount
        }
      });
    } else {
      this.results.push({
        test: 'File Cleanup',
        status: 'FAIL',
        message: `Cleanup partially failed: ${successCount} deleted, ${errorCount} errors`,
        duration,
        details: { 
          files_deleted: successCount,
          errors: errorCount
        }
      });
    }
  }

  private displayResults(): void {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 R2 Storage Integration Test Results');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;

    this.results.forEach(result => {
      const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
      const durationText = result.duration ? ` (${result.duration}ms)` : '';
      console.log(`${statusIcon} ${result.test}: ${result.message}${durationText}`);
      
      if (result.details && Object.keys(result.details).length > 0) {
        console.log(`   └─ Details: ${JSON.stringify(result.details)}`);
      }
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📈 Overall Results: ${passed} passed, ${failed} failed, ${skipped} skipped`);
    
    if (failed === 0 && passed > 0) {
      console.log('🎉 All R2 storage tests passed! Storage integration is ready for production.');
    } else if (skipped === this.results.length) {
      console.log('⚠️  All tests skipped - please set R2 environment variables and try again.');
    } else {
      console.log('⚠️  Some tests failed. Review R2 configuration before deployment.');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Summary for Phase 7.4
    console.log('📋 Phase 7.4 R2 Integration Summary:');
    console.log(`   • Environment variables: ${this.results.find(r => r.test === 'Environment Variables')?.status || 'NOT TESTED'}`);
    console.log(`   • R2 connection: ${this.results.find(r => r.test === 'R2 Connection')?.status || 'NOT TESTED'}`);
    console.log(`   • File uploads: ${this.results.find(r => r.test === 'Small File Upload')?.status || 'NOT TESTED'}`);
    console.log(`   • Usage logging: ${this.results.find(r => r.test === 'Usage Logging')?.status || 'NOT TESTED'}`);
    
    if (failed === 0 && passed >= 4) {
      console.log('✅ Phase 7.4 COMPLETE: R2 storage integration verified and ready');
    } else {
      console.log('⚠️  Phase 7.4 INCOMPLETE: R2 integration requires attention');
    }
  }
}

// Export for use in other scripts
export { R2IntegrationTest };

// Run tests if executed directly
if (require.main === module) {
  const tester = new R2IntegrationTest();
  tester.runAllTests().catch(error => {
    console.error('❌ R2 integration test suite failed:', error);
    process.exit(1);
  });
}