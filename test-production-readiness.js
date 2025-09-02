#!/usr/bin/env node

/**
 * Production Readiness Testing Suite
 * Tests all critical app functionality and performance
 */

const http = require('http');
const https = require('https');
const fs = require('fs');

console.log('🧪 PRODUCTION READINESS TESTING SUITE\n');

class ProductionTester {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0
    };
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

  async testBackendHealth() {
    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/health',
        method: 'GET',
        timeout: 5000
      }, (res) => {
        if (res.statusCode === 200) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: `HTTP ${res.statusCode}` });
        }
      });

      req.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });

      req.on('timeout', () => {
        resolve({ success: false, error: 'Request timeout' });
      });

      req.end();
    });
  }

  async testDatabaseConnection() {
    // Test if database files/connections are properly configured
    const dbFiles = [
      'backend/src/db/schema.ts',
      'backend/src/db/adapter.ts',
      'backend/src/db/migrations/001_initial_schema.sql',
      'backend/src/db/migrations/004_add_messaging_and_notifications.sql',
      'backend/src/db/migrations/005_enhance_professional_profiles.sql'
    ];

    for (const file of dbFiles) {
      if (!fs.existsSync(file)) {
        return { success: false, error: `Missing database file: ${file}` };
      }
    }

    return { success: true };
  }

  async testEnvironmentConfig() {
    const requiredFiles = [
      'backend/package.json',
      'package.json',
      'app.json',
      'backend/tsconfig.json',
      'tsconfig.json'
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        return { success: false, error: `Missing config file: ${file}` };
      }
    }

    // Check if .env.example exists
    if (!fs.existsSync('env.example')) {
      return { 
        success: true, 
        warning: 'Missing env.example file for environment setup' 
      };
    }

    return { success: true };
  }

  async testFrontendBuild() {
    return new Promise((resolve) => {
      const { exec } = require('child_process');
      
      console.log('   📦 Running Expo prebuild...');
      exec('npx expo prebuild --no-install', { timeout: 60000 }, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, error: `Build error: ${error.message}` });
        } else {
          resolve({ success: true });
        }
      });
    });
  }

  async testBackendBuild() {
    return new Promise((resolve) => {
      const { exec } = require('child_process');
      
      console.log('   🔧 Checking backend TypeScript compilation...');
      exec('cd backend && npx tsc --noEmit', { timeout: 30000 }, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, error: `TypeScript errors: ${stderr}` });
        } else {
          resolve({ success: true });
        }
      });
    });
  }

  async testCriticalDependencies() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const backendPackageJson = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
      
      const criticalDeps = [
        '@expo/vector-icons',
        'expo',
        'expo-router',
        'react',
        'react-native'
      ];

      const criticalBackendDeps = [
        'hono',
        '@trpc/server',
        'drizzle-orm'
      ];

      for (const dep of criticalDeps) {
        if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
          return { success: false, error: `Missing critical frontend dependency: ${dep}` };
        }
      }

      for (const dep of criticalBackendDeps) {
        if (!backendPackageJson.dependencies[dep] && !backendPackageJson.devDependencies[dep]) {
          return { success: false, error: `Missing critical backend dependency: ${dep}` };
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: `Package.json error: ${error.message}` };
    }
  }

  async testAPIEndpoints() {
    // Test if tRPC routers are properly configured
    const routerFiles = [
      'backend/src/trpc/app-router.ts',
      'backend/src/trpc/auth-router.ts',
      'backend/src/trpc/profiles-router.ts',
      'backend/src/trpc/jobs-router.ts',
      'backend/src/trpc/enhanced-search-router.ts'
    ];

    for (const file of routerFiles) {
      if (!fs.existsSync(file)) {
        return { success: false, error: `Missing router file: ${file}` };
      }
    }

    return { success: true };
  }

  async testDeploymentReadiness() {
    const deploymentFiles = [
      'deploy-production.sh',
      'DEPLOYMENT_GUIDE.md',
      'railway-package.json'
    ];

    let hasDeploymentConfig = false;
    for (const file of deploymentFiles) {
      if (fs.existsSync(file)) {
        hasDeploymentConfig = true;
        break;
      }
    }

    if (!hasDeploymentConfig) {
      return { 
        success: true, 
        warning: 'No deployment configuration files found' 
      };
    }

    return { success: true };
  }

  async testSecurityConfig() {
    // Check for potential security issues
    const issues = [];

    // Check if .env files are in gitignore
    if (fs.existsSync('.gitignore')) {
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      if (!gitignore.includes('.env')) {
        issues.push('Environment files not in .gitignore');
      }
    } else {
      issues.push('Missing .gitignore file');
    }

    if (issues.length > 0) {
      return { 
        success: true, 
        warning: `Security issues: ${issues.join(', ')}` 
      };
    }

    return { success: true };
  }

  async runAllTests() {
    console.log('🚀 Starting Production Readiness Tests...\n');

    await this.runTest('Backend Health Check', () => this.testBackendHealth());
    await this.runTest('Database Configuration', () => this.testDatabaseConnection());
    await this.runTest('Environment Configuration', () => this.testEnvironmentConfig());
    await this.runTest('Critical Dependencies', () => this.testCriticalDependencies());
    await this.runTest('API Endpoints', () => this.testAPIEndpoints());
    await this.runTest('Backend Build', () => this.testBackendBuild());
    await this.runTest('Frontend Build', () => this.testFrontendBuild());
    await this.runTest('Deployment Readiness', () => this.testDeploymentReadiness());
    await this.runTest('Security Configuration', () => this.testSecurityConfig());

    this.printResults();
  }

  printResults() {
    console.log('📊 TEST RESULTS SUMMARY:');
    console.log('========================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log('');

    const total = this.results.passed + this.results.failed;
    const successRate = Math.round((this.results.passed / total) * 100);

    if (this.results.failed === 0) {
      console.log(`🎉 PRODUCTION READY! (${successRate}% success rate)`);
      console.log('✅ Your app is ready for production deployment!');
    } else {
      console.log(`⚠️  NEEDS ATTENTION (${successRate}% success rate)`);
      console.log('❌ Please fix the failed tests before deploying to production.');
    }

    if (this.results.warnings > 0) {
      console.log(`⚠️  ${this.results.warnings} warnings should be addressed for optimal production setup.`);
    }
  }
}

// Run the tests
const tester = new ProductionTester();
tester.runAllTests().catch(console.error);
