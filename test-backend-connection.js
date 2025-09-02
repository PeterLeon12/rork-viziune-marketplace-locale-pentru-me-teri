// Test script to verify backend connection
const BACKEND_URL = 'https://rork-viziune-marketplace-locale-pentru-me-teri-production.up.railway.app';

console.log('🧪 Testing Romanian Marketplace Backend Connection...\n');

// Test 1: Basic health check
fetch(`${BACKEND_URL}/`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Health Check:', data);
  })
  .catch(error => {
    console.error('❌ Health Check Failed:', error.message);
  });

// Test 2: Categories API
fetch(`${BACKEND_URL}/trpc/profiles.getCategories`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Categories API:', `Found ${data.result.data.length} categories`);
    console.log('   First category:', data.result.data[0]);
  })
  .catch(error => {
    console.error('❌ Categories API Failed:', error.message);
  });

// Test 3: Areas API
fetch(`${BACKEND_URL}/trpc/profiles.getAreas`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Areas API:', `Found ${data.result.data.length} Romanian cities`);
    console.log('   Cities include:', data.result.data.slice(0, 5).map(area => area.name).join(', '));
  })
  .catch(error => {
    console.error('❌ Areas API Failed:', error.message);
  });

console.log('\n🚀 Testing complete! Check the results above.');
