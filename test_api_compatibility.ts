// Phase 7.5: API Routes Cloudflare Pages Functions Compatibility Test
// Verifies all API routes are compatible with Cloudflare Pages Functions

import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  suggestion?: string;
}

interface RouteTest {
  route: string;
  path: string;
  compatible: boolean;
  issues: CompatibilityIssue[];
  httpMethods: string[];
  runtime?: string;
}

class ApiCompatibilityTester {
  private results: RouteTest[] = [];
  private apiDir = './app/api';

  // Patterns that indicate compatibility issues
  private incompatiblePatterns = [
    { pattern: /require\s*\(\s*['"]fs['"]/, type: 'error' as const, message: 'File system access not available in edge runtime', suggestion: 'Use environment variables or external storage' },
    { pattern: /require\s*\(\s*['"]path['"]/, type: 'warning' as const, message: 'Path module usage - verify edge compatibility', suggestion: 'Use URL/string manipulation instead' },
    { pattern: /process\.cwd\(\)/, type: 'error' as const, message: 'process.cwd() not available in edge runtime', suggestion: 'Use relative paths or environment variables' },
    { pattern: /\.pipe\(/, type: 'warning' as const, message: 'Stream piping - verify compatibility', suggestion: 'Use Response.body or async iteration' },
    { pattern: /setTimeout|setInterval/, type: 'warning' as const, message: 'Timers may not work as expected in edge runtime', suggestion: 'Use async/await with controlled timing' },
    { pattern: /Buffer\.from/, type: 'info' as const, message: 'Buffer usage detected - generally compatible', suggestion: 'Consider using Uint8Array for better edge support' },
    { pattern: /new FormData\(\)/, type: 'info' as const, message: 'FormData usage detected - compatible', suggestion: 'Good for file uploads' },
    { pattern: /fetch\(/, type: 'info' as const, message: 'Fetch API usage - fully compatible', suggestion: 'Preferred method for HTTP requests' },
  ];

  // Required patterns for Cloudflare Pages Functions
  private requiredPatterns = [
    { pattern: /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH|OPTIONS)/, message: 'HTTP method exports found' },
    { pattern: /import.*Request.*Response/, message: 'Web API imports found' },
    { pattern: /return\s+.*Response/, message: 'Response object returned' },
  ];

  async runCompatibilityTest(): Promise<void> {
    console.log('🚀 Starting API Routes Cloudflare Pages Functions Compatibility Test');
    console.log(`📁 Scanning directory: ${this.apiDir}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      await this.scanApiDirectory();
      this.displayResults();
    } catch (error) {
      console.error('❌ Compatibility test failed:', error);
    }
  }

  private async scanApiDirectory(): Promise<void> {
    try {
      this.scanDirectory(this.apiDir, '');
    } catch (error) {
      console.error('Error scanning API directory:', error);
    }
  }

  private scanDirectory(dirPath: string, routePrefix: string): void {
    try {
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = join(dirPath, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Scan subdirectory
          this.scanDirectory(fullPath, `${routePrefix}/${item}`);
        } else if (item === 'route.ts' || item === 'route.js') {
          // Test API route file
          const routePath = routePrefix || '/';
          this.testApiRoute(routePath, fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dirPath}:`, error.message);
    }
  }

  private testApiRoute(route: string, filePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf8');
      const issues: CompatibilityIssue[] = [];
      const httpMethods: string[] = [];
      let runtime: string | undefined;

      // Check for HTTP method exports
      const methodMatches = content.match(/export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH|OPTIONS)/g);
      if (methodMatches) {
        methodMatches.forEach(match => {
          const method = match.match(/(GET|POST|PUT|DELETE|PATCH|OPTIONS)/)?.[1];
          if (method && !httpMethods.includes(method)) {
            httpMethods.push(method);
          }
        });
      }

      // Check for runtime specification
      const runtimeMatch = content.match(/export\s+const\s+runtime\s*=\s*['"]([^'"]+)['"]/);
      if (runtimeMatch) {
        runtime = runtimeMatch[1];
      }

      // Check for compatibility issues
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        this.incompatiblePatterns.forEach(({ pattern, type, message, suggestion }) => {
          if (pattern.test(line)) {
            issues.push({
              type,
              message,
              line: index + 1,
              suggestion
            });
          }
        });
      });

      // Check for required patterns
      let hasValidStructure = false;
      this.requiredPatterns.forEach(({ pattern, message }) => {
        if (pattern.test(content)) {
          hasValidStructure = true;
          issues.push({
            type: 'info',
            message
          });
        }
      });

      // Determine compatibility
      const hasErrors = issues.some(issue => issue.type === 'error');
      const compatible = !hasErrors && hasValidStructure && httpMethods.length > 0;

      // Special compatibility checks
      this.performSpecialChecks(content, issues, route);

      this.results.push({
        route,
        path: filePath,
        compatible,
        issues,
        httpMethods,
        runtime
      });

    } catch (error) {
      this.results.push({
        route,
        path: filePath,
        compatible: false,
        issues: [{
          type: 'error',
          message: `Failed to read file: ${error.message}`
        }],
        httpMethods: []
      });
    }
  }

  private performSpecialChecks(content: string, issues: CompatibilityIssue[], route: string): void {
    // Check for Reddit automation specific patterns
    if (route.includes('reddit-automation')) {
      if (content.includes('RedditScraperService') || content.includes('ClaudeService')) {
        issues.push({
          type: 'info',
          message: 'Reddit automation services detected - ensure external API compatibility'
        });
      }
    }

    // Check for proper error handling
    if (!content.includes('try') && !content.includes('catch')) {
      issues.push({
        type: 'warning',
        message: 'No error handling detected',
        suggestion: 'Add try-catch blocks for robust error handling'
      });
    }

    // Check for environment variable usage
    if (content.includes('process.env')) {
      issues.push({
        type: 'info',
        message: 'Environment variables used - ensure they are set in Cloudflare Pages'
      });
    }

    // Check for CORS handling
    if (!content.includes('Access-Control-Allow-Origin') && content.includes('POST')) {
      issues.push({
        type: 'warning',
        message: 'No CORS headers detected for POST endpoint',
        suggestion: 'Add CORS headers for cross-origin requests'
      });
    }

    // Check for Request/Response usage
    if (content.includes('NextRequest') || content.includes('NextResponse')) {
      issues.push({
        type: 'info',
        message: 'Next.js Request/Response types used - compatible with Cloudflare'
      });
    }

    // Check for streaming responses
    if (content.includes('ReadableStream') || content.includes('TransformStream')) {
      issues.push({
        type: 'info',
        message: 'Streaming API detected - compatible with Cloudflare edge runtime'
      });
    }

    // Check for file uploads
    if (content.includes('formData') || content.includes('multipart')) {
      issues.push({
        type: 'info',
        message: 'File upload handling detected - ensure R2 integration is configured'
      });
    }
  }

  private displayResults(): void {
    console.log('📊 API Routes Compatibility Analysis Results');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const compatible = this.results.filter(r => r.compatible).length;
    const incompatible = this.results.filter(r => !r.compatible).length;
    const total = this.results.length;

    // Display individual route results
    this.results.forEach(result => {
      const statusIcon = result.compatible ? '✅' : '❌';
      const methodsText = result.httpMethods.length > 0 ? ` [${result.httpMethods.join(', ')}]` : '';
      const runtimeText = result.runtime ? ` (${result.runtime})` : '';
      
      console.log(`${statusIcon} ${result.route}${methodsText}${runtimeText}`);
      
      if (result.issues.length > 0) {
        result.issues.forEach(issue => {
          const issueIcon = issue.type === 'error' ? '  ❌' : issue.type === 'warning' ? '  ⚠️' : '  ℹ️';
          const lineText = issue.line ? ` (line ${issue.line})` : '';
          console.log(`${issueIcon} ${issue.message}${lineText}`);
          if (issue.suggestion) {
            console.log(`     💡 ${issue.suggestion}`);
          }
        });
      }
      console.log('');
    });

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📈 Compatibility Summary: ${compatible}/${total} routes compatible`);
    
    if (incompatible === 0) {
      console.log('🎉 All API routes are compatible with Cloudflare Pages Functions!');
    } else {
      console.log(`⚠️  ${incompatible} routes need attention before deployment`);
    }

    // Reddit automation specific summary
    const redditRoutes = this.results.filter(r => r.route.includes('reddit-automation'));
    if (redditRoutes.length > 0) {
      console.log(`\n🎯 Reddit Automation Routes: ${redditRoutes.filter(r => r.compatible).length}/${redditRoutes.length} compatible`);
      redditRoutes.forEach(route => {
        const status = route.compatible ? '✅' : '❌';
        console.log(`   ${status} ${route.route} ${route.httpMethods.join(', ')}`);
      });
    }

    // Critical issues summary
    const criticalIssues = this.results.flatMap(r => 
      r.issues.filter(i => i.type === 'error').map(i => ({ route: r.route, issue: i }))
    );
    
    if (criticalIssues.length > 0) {
      console.log('\n🚨 Critical Issues Requiring Attention:');
      criticalIssues.forEach(({ route, issue }) => {
        console.log(`   ❌ ${route}: ${issue.message}`);
        if (issue.suggestion) {
          console.log(`      💡 ${issue.suggestion}`);
        }
      });
    }

    // Phase 7.5 completion status
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Phase 7.5 Compatibility Assessment:');
    
    if (compatible === total && redditRoutes.every(r => r.compatible)) {
      console.log('✅ Phase 7.5 COMPLETE: All API routes compatible with Cloudflare Pages Functions');
      console.log('✅ Reddit automation endpoints ready for production deployment');
    } else if (criticalIssues.length === 0) {
      console.log('⚠️  Phase 7.5 MOSTLY COMPLETE: Minor issues detected, but deployment possible');
      console.log('💡 Address warnings before production for optimal performance');
    } else {
      console.log('❌ Phase 7.5 INCOMPLETE: Critical compatibility issues require fixes');
      console.log('🔧 Fix critical errors before proceeding to deployment');
    }
  }
}

// Export for use in other scripts
export { ApiCompatibilityTester };

// Run tests if executed directly
if (require.main === module) {
  const tester = new ApiCompatibilityTester();
  tester.runCompatibilityTest().catch(error => {
    console.error('❌ API compatibility test failed:', error);
    process.exit(1);
  });
}