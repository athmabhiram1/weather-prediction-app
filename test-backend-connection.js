const https = require('https');

console.log('🔍 Testing Backend Connection...\n');

const backendUrl = 'https://weather-prediction-app-1-gmxl.onrender.com';

// Test 1: Health endpoint
console.log('1. Testing Health Endpoint...');
https.get(`${backendUrl}/health`, (res) => {
  console.log(`   Status: ${res.statusCode}`);
  console.log(`   Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('   Response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('   Raw Response:', data);
    }
    
    // Test 2: Root endpoint
    console.log('\n2. Testing Root Endpoint...');
    https.get(`${backendUrl}/`, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('   Response:', JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log('   Raw Response:', data);
        }
        
        // Test 3: CORS headers
        console.log('\n3. Testing CORS...');
        const req = https.request(`${backendUrl}/health`, {
          method: 'OPTIONS',
          headers: {
            'Origin': 'https://weather-prediction-app-wt9d.onrender.com',
            'Access-Control-Request-Method': 'GET'
          }
        }, (res) => {
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   CORS Headers:`);
          Object.keys(res.headers).forEach(key => {
            if (key.toLowerCase().includes('access-control')) {
              console.log(`     ${key}: ${res.headers[key]}`);
            }
          });
          
          console.log('\n✅ Backend connection test completed!');
        });
        
        req.on('error', (e) => {
          console.log('   CORS Test Error:', e.message);
        });
        
        req.end();
      });
    }).on('error', (e) => {
      console.log('   Root endpoint error:', e.message);
    });
  });
}).on('error', (e) => {
  console.log('   Health endpoint error:', e.message);
  
  // If health endpoint fails, try a simple connection test
  console.log('\n🔍 Testing basic connectivity...');
  const req = https.request(`${backendUrl}/`, { method: 'HEAD' }, (res) => {
    console.log(`   Basic connection status: ${res.statusCode}`);
  });
  
  req.on('error', (e) => {
    console.log('   ❌ Cannot connect to backend at all:', e.message);
    console.log('\n🚨 Possible issues:');
    console.log('   1. Backend service is down');
    console.log('   2. Network connectivity issues');
    console.log('   3. SSL/TLS certificate problems');
    console.log('   4. Render service sleeping (free tier)');
  });
  
  req.end();
});
