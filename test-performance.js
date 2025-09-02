#!/usr/bin/env node

/**
 * Performance Testing Suite
 * Tests app performance, load handling, and optimization
 */

const { performance } = require('perf_hooks');

console.log('⚡ PERFORMANCE TESTING SUITE\n');

class PerformanceTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.results = { passed: 0, failed: 0, warnings: 0 };
  }

  async runTest(name, testFn) {
    console.log(`🔍 Testing: ${name}...`);
    try {
      const result = await testFn();
      if (result.success) {
        console.log(`✅ ${name} - PASSED`);
        if (result.metric) {
          console.log(`   📊 ${result.metric}`);
        }
        if (result.warning) {
          console.log(`⚠️  Warning: ${result.warning}`);
          this.results.warnings++;
        }
        this.results.passed++;
      } else {
        console.log(`❌ ${name} - FAILED: ${result.error}`);
        this.results.failed++;
      }
    } catch (error) {
      console.log(`❌ ${name} - ERROR: ${error.message}`);
      this.results.failed++;
    }
    console.log('');
  }

  async measureRequestTime(path) {
    const start = performance.now();
    try {
      const response = await fetch(`${this.baseUrl}${path}`);
      const end = performance.now();
      return {
        time: end - start,
        status: response.status,
        ok: response.ok
      };
    } catch (error) {
      const end = performance.now();
      return {
        time: end - start,
        error: error.message,
        ok: false
      };
    }
  }

  async testAPIResponseTime() {
    const paths = ['/health', '/'];
    let totalTime = 0;
    let successCount = 0;

    for (const path of paths) {
      const result = await this.measureRequestTime(path);
      if (result.ok) {
        totalTime += result.time;
        successCount++;
      } else {
        return { success: false, error: `Failed to fetch ${path}` };
      }
    }

    const avgTime = totalTime / successCount;
    
    if (avgTime > 1000) {
      return { 
        success: true, 
        warning: `Slow response time: ${avgTime.toFixed(2)}ms`,
        metric: `Average response time: ${avgTime.toFixed(2)}ms`
      };
    }

    return { 
      success: true, 
      metric: `Average response time: ${avgTime.toFixed(2)}ms` 
    };
  }

  async testConcurrentRequests() {
    const concurrency = 10;
    const promises = [];

    console.log(`   🔄 Testing ${concurrency} concurrent requests...`);
    
    for (let i = 0; i < concurrency; i++) {
      promises.push(this.measureRequestTime('/health'));
    }

    const start = performance.now();
    const results = await Promise.all(promises);
    const end = performance.now();

    const successful = results.filter(r => r.ok).length;
    const failed = results.length - successful;
    const totalTime = end - start;

    if (failed > 0) {
      return { 
        success: false, 
        error: `${failed} out of ${concurrency} requests failed` 
      };
    }

    if (totalTime > 5000) {
      return {
        success: true,
        warning: `Slow concurrent processing: ${totalTime.toFixed(2)}ms`,
        metric: `${concurrency} concurrent requests in ${totalTime.toFixed(2)}ms`
      };
    }

    return { 
      success: true, 
      metric: `${concurrency} concurrent requests in ${totalTime.toFixed(2)}ms` 
    };
  }

  async testMemoryUsage() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      const memoryMB = {
        rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100,
        heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100,
        external: Math.round(usage.external / 1024 / 1024 * 100) / 100
      };

      if (memoryMB.heapUsed > 100) {
        return {
          success: true,
          warning: `High memory usage: ${memoryMB.heapUsed}MB heap`,
          metric: `Memory: ${memoryMB.heapUsed}MB heap, ${memoryMB.rss}MB RSS`
        };
      }

      return {
        success: true,
        metric: `Memory: ${memoryMB.heapUsed}MB heap, ${memoryMB.rss}MB RSS`
      };
    }

    return { success: true, metric: 'Memory monitoring not available' };
  }

  async testFileStructureOptimization() {
    const fs = require('fs');
    
    // Check for potential optimization issues
    const issues = [];
    
    // Check for large files that might slow loading
    const checkFileSize = (filePath, maxSizeMB = 1) => {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeMB = stats.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
          issues.push(`Large file: ${filePath} (${sizeMB.toFixed(2)}MB)`);
        }
      }
    };

    // Check critical frontend files
    const frontendFiles = [
      'app/(tabs)/index.tsx',
      'app/(tabs)/search.tsx',
      'app/enhanced-search.tsx',
      'app/enhanced-pro-onboarding.tsx'
    ];

    frontendFiles.forEach(file => checkFileSize(file, 0.5));

    // Check for too many files in critical directories
    const checkDirSize = (dirPath, maxFiles = 20) => {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        if (files.length > maxFiles) {
          issues.push(`Too many files in ${dirPath}: ${files.length} files`);
        }
      }
    };

    checkDirSize('app/(tabs)', 10);
    checkDirSize('components', 15);
    checkDirSize('backend/src/trpc', 12);

    if (issues.length > 0) {
      return {
        success: true,
        warning: `Optimization opportunities: ${issues.join(', ')}`
      };
    }

    return { success: true, metric: 'File structure optimized' };
  }

  async testDependencySize() {
    const fs = require('fs');
    
    try {
      // Check package.json sizes
      const frontendPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));

      const frontendDepCount = Object.keys({
        ...frontendPkg.dependencies,
        ...frontendPkg.devDependencies
      }).length;

      const backendDepCount = Object.keys({
        ...backendPkg.dependencies,
        ...backendPkg.devDependencies
      }).length;

      const totalDeps = frontendDepCount + backendDepCount;

      if (totalDeps > 100) {
        return {
          success: true,
          warning: `High dependency count: ${totalDeps} total dependencies`,
          metric: `Dependencies: ${frontendDepCount} frontend, ${backendDepCount} backend`
        };
      }

      return {
        success: true,
        metric: `Dependencies: ${frontendDepCount} frontend, ${backendDepCount} backend`
      };
    } catch (error) {
      return { success: false, error: `Dependency analysis failed: ${error.message}` };
    }
  }

  async testBuildPerformance() {
    console.log('   🔧 Testing build performance...');
    
    const start = performance.now();
    
    return new Promise((resolve) => {
      const { exec } = require('child_process');
      
      exec('cd backend && npx tsc --noEmit', { timeout: 30000 }, (error, stdout, stderr) => {
        const end = performance.now();
        const buildTime = end - start;
        
        if (error) {
          resolve({ success: false, error: `Build failed: ${error.message}` });
        } else if (buildTime > 10000) {
          resolve({
            success: true,
            warning: `Slow build time: ${buildTime.toFixed(0)}ms`,
            metric: `TypeScript compilation: ${buildTime.toFixed(0)}ms`
          });
        } else {
          resolve({
            success: true,
            metric: `TypeScript compilation: ${buildTime.toFixed(0)}ms`
          });
        }
      });
    });
  }

  async testDatabasePerformance() {
    const fs = require('fs');
    
    // Check if database queries are optimized (look for indexes)
    const migrationFiles = [
      'backend/src/db/migrations/001_initial_schema.sql',
      'backend/src/db/migrations/005_enhance_professional_profiles.sql'
    ];

    let indexCount = 0;
    
    for (const file of migrationFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const indexes = content.match(/CREATE INDEX/gi);
        if (indexes) {
          indexCount += indexes.length;
        }
      }
    }

    if (indexCount < 5) {
      return {
        success: true,
        warning: `Few database indexes found: ${indexCount}`,
        metric: `Database indexes: ${indexCount}`
      };
    }

    return {
      success: true,
      metric: `Database indexes: ${indexCount}`
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Performance Tests...\n');

    await this.runTest('API Response Time', () => this.testAPIResponseTime());
    await this.runTest('Concurrent Request Handling', () => this.testConcurrentRequests());
    await this.runTest('Memory Usage', () => this.testMemoryUsage());
    await this.runTest('File Structure Optimization', () => this.testFileStructureOptimization());
    await this.runTest('Dependency Size Analysis', () => this.testDependencySize());
    await this.runTest('Build Performance', () => this.testBuildPerformance());
    await this.runTest('Database Performance', () => this.testDatabasePerformance());

    this.printResults();
  }

  printResults() {
    console.log('📊 PERFORMANCE TEST RESULTS:');
    console.log('=============================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log('');

    const total = this.results.passed + this.results.failed;
    const successRate = Math.round((this.results.passed / total) * 100);

    if (this.results.failed === 0) {
      console.log(`🎉 PERFORMANCE READY! (${successRate}% success rate)`);
      if (this.results.warnings === 0) {
        console.log('✅ Excellent performance optimization!');
      } else {
        console.log('✅ Good performance with room for optimization.');
      }
    } else {
      console.log(`⚠️  PERFORMANCE ISSUES (${successRate}% success rate)`);
      console.log('❌ Performance problems need to be addressed.');
    }

    if (this.results.warnings > 0) {
      console.log(`⚠️  ${this.results.warnings} performance optimizations recommended.`);
    }
  }
}

// Run the tests
const tester = new PerformanceTester();
tester.runAllTests().catch(console.error);
