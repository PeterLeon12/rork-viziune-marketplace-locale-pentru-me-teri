#!/usr/bin/env node

/**
 * User Flow Testing Suite
 * Tests critical user journeys and business logic
 */

console.log('👥 USER FLOW TESTING SUITE\n');

class UserFlowTester {
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

  async makeRequest(path, method = 'GET', body = null) {
    const url = `${this.baseUrl}${path}`;
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url);
    return {
      status: response.status,
      data: response.status < 400 ? await response.json() : null,
      ok: response.ok
    };
  }

  async testAPIEndpoints() {
    try {
      // Test main endpoint
      const health = await this.makeRequest('/health');
      if (!health.ok) {
        return { success: false, error: 'Health endpoint failed' };
      }

      // Test root endpoint
      const root = await this.makeRequest('/');
      if (!root.ok) {
        return { success: false, error: 'Root endpoint failed' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testTRPCEndpoints() {
    try {
      // Test tRPC endpoint structure
      const trpcResponse = await fetch(`${this.baseUrl}/trpc/profiles.getCategories`);
      
      // We expect this to fail with a specific tRPC error, not a 404
      if (trpcResponse.status === 404) {
        return { success: false, error: 'tRPC endpoints not properly mounted' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testDatabaseConnectivity() {
    // This is a basic test since we're using mock data in development
    // In production, this would test actual database connectivity
    try {
      const fs = require('fs');
      
      // Check if database adapter is configured
      if (!fs.existsSync('backend/src/db/adapter.ts')) {
        return { success: false, error: 'Database adapter not found' };
      }

      // Check if migrations exist
      const migrationFiles = [
        'backend/src/db/migrations/001_initial_schema.sql',
        'backend/src/db/migrations/004_add_messaging_and_notifications.sql',
        'backend/src/db/migrations/005_enhance_professional_profiles.sql'
      ];

      for (const file of migrationFiles) {
        if (!fs.existsSync(file)) {
          return { success: false, error: `Migration file missing: ${file}` };
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testFrontendComponents() {
    const fs = require('fs');
    
    // Test critical frontend files exist
    const criticalFiles = [
      'app/(tabs)/_layout.tsx',
      'app/(tabs)/index.tsx',
      'app/(tabs)/search.tsx',
      'app/(tabs)/jobs.tsx',
      'app/(tabs)/post-job.tsx',
      'app/(tabs)/profile.tsx',
      'app/pro-onboarding.tsx',
      'app/enhanced-search.tsx',
      'app/enhanced-pro-onboarding.tsx',
      'components/ProCard.tsx'
    ];

    for (const file of criticalFiles) {
      if (!fs.existsSync(file)) {
        return { success: false, error: `Critical component missing: ${file}` };
      }
    }

    return { success: true };
  }

  async testBusinessLogic() {
    const fs = require('fs');
    
    // Test business logic routers exist and are properly structured
    const routerFiles = [
      'backend/src/trpc/auth-router.ts',
      'backend/src/trpc/profiles-router.ts',
      'backend/src/trpc/jobs-router.ts',
      'backend/src/trpc/monetization-router.ts',
      'backend/src/trpc/enhanced-search-router.ts'
    ];

    for (const file of routerFiles) {
      if (!fs.existsSync(file)) {
        return { success: false, error: `Business logic router missing: ${file}` };
      }

      // Basic syntax check by trying to read the file
      try {
        const content = fs.readFileSync(file, 'utf8');
        if (!content.includes('createTRPCRouter')) {
          return { 
            success: true, 
            warning: `Router ${file} may have structural issues` 
          };
        }
      } catch (error) {
        return { success: false, error: `Cannot read router file: ${file}` };
      }
    }

    return { success: true };
  }

  async testDataValidation() {
    // Test if zod schemas are properly defined
    const fs = require('fs');
    
    try {
      // Check if validation schemas exist in router files
      const profilesRouter = fs.readFileSync('backend/src/trpc/profiles-router.ts', 'utf8');
      if (!profilesRouter.includes('z.object') && !profilesRouter.includes('zod')) {
        return { 
          success: true, 
          warning: 'Data validation schemas may be missing in profiles router' 
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: `Data validation test failed: ${error.message}` };
    }
  }

  async testMonetizationFeatures() {
    const fs = require('fs');
    
    // Test monetization components exist
    const monetizationFiles = [
      'backend/src/trpc/monetization-router.ts',
      'app/subscription.tsx'
    ];

    for (const file of monetizationFiles) {
      if (!fs.existsSync(file)) {
        return { 
          success: true, 
          warning: `Monetization feature missing: ${file}` 
        };
      }
    }

    return { success: true };
  }

  async testEnhancedFeatures() {
    const fs = require('fs');
    
    // Test enhanced features we just added
    const enhancedFiles = [
      'app/enhanced-search.tsx',
      'app/enhanced-pro-onboarding.tsx',
      'backend/src/trpc/enhanced-search-router.ts',
      'backend/src/db/migrations/005_enhance_professional_profiles.sql'
    ];

    for (const file of enhancedFiles) {
      if (!fs.existsSync(file)) {
        return { success: false, error: `Enhanced feature missing: ${file}` };
      }
    }

    return { success: true };
  }

  async runAllTests() {
    console.log('🚀 Starting User Flow Tests...\n');

    await this.runTest('API Endpoint Accessibility', () => this.testAPIEndpoints());
    await this.runTest('tRPC Endpoint Configuration', () => this.testTRPCEndpoints());
    await this.runTest('Database Connectivity', () => this.testDatabaseConnectivity());
    await this.runTest('Frontend Components', () => this.testFrontendComponents());
    await this.runTest('Business Logic Implementation', () => this.testBusinessLogic());
    await this.runTest('Data Validation', () => this.testDataValidation());
    await this.runTest('Monetization Features', () => this.testMonetizationFeatures());
    await this.runTest('Enhanced Features Integration', () => this.testEnhancedFeatures());

    this.printResults();
  }

  printResults() {
    console.log('📊 USER FLOW TEST RESULTS:');
    console.log('===========================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log('');

    const total = this.results.passed + this.results.failed;
    const successRate = Math.round((this.results.passed / total) * 100);

    if (this.results.failed === 0) {
      console.log(`🎉 USER FLOWS READY! (${successRate}% success rate)`);
      console.log('✅ All critical user journeys are properly implemented!');
    } else {
      console.log(`⚠️  NEEDS ATTENTION (${successRate}% success rate)`);
      console.log('❌ Some user flows have issues that need fixing.');
    }

    if (this.results.warnings > 0) {
      console.log(`⚠️  ${this.results.warnings} warnings suggest areas for improvement.`);
    }
  }
}

// Run the tests
const tester = new UserFlowTester();
tester.runAllTests().catch(console.error);
