#!/usr/bin/env node

/**
 * Quick Test Script - Test Backend Connection
 * Run this to verify your backend is working correctly
 */

const https = require('https');

const BACKEND_URL = 'https://weather-prediction-app-1-gmxl.onrender.com';

console.log('🧪 Testing Backend Connection...\n');

// Test 1: Health Check
console.log('1️⃣ Testing Health Endpoint...');
testEndpoint('/health')
  .then(() => {
    console.log('✅ Health check passed!\n');
    
    // Test 2: Weather API
    console.log('2️⃣ Testing Weather Endpoint...');
    return testEndpoint('/current-weather/Mumbai');
  })
  .then(() => {
    console.log('✅ Weather API working!\n');
    console.log('🎉 Backend is fully functional!');
    console.log('\n📋 Next Steps:');
    console.log('1. Set NEXT_PUBLIC_API_BASE_URL in Render frontend service');
    console.log('2. Redeploy frontend service');
    console.log('3. Test your app at https://weather-prediction-app-wt9d.onrender.com');
  })
  .catch(error => {
    console.error('❌ Backend test failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('- Check if backend service is running');
    console.log('- Verify backend URL is correct');
    console.log('- Check Render backend service logs');
  });

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const url = `${BACKEND_URL}${path}`;
    console.log(`   Testing: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`   ✅ Status: ${res.statusCode}`);
          try {
            const parsed = JSON.parse(data);
            console.log(`   📄 Response: ${JSON.stringify(parsed, null, 2).substring(0, 100)}...`);
          } catch (e) {
            console.log(`   📄 Response: ${data.substring(0, 100)}...`);
          }
          resolve();
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}
