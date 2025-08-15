// CORS Test Script
console.log('🌐 Testing CORS from Frontend to Backend...\n');

const backendUrl = 'https://weather-prediction-app-1-gmxl.onrender.com';
const frontendUrl = 'https://weather-prediction-app-wt9d.onrender.com';

// Test CORS preflight request
fetch(`${backendUrl}/health`, {
  method: 'OPTIONS',
  headers: {
    'Origin': frontendUrl,
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'Content-Type'
  }
})
.then(response => {
  console.log('✅ CORS Preflight Response:');
  console.log(`   Status: ${response.status}`);
  console.log(`   Headers:`);
  
  response.headers.forEach((value, key) => {
    if (key.toLowerCase().includes('access-control')) {
      console.log(`     ${key}: ${value}`);
    }
  });
  
  if (response.status === 200) {
    console.log('✅ CORS is properly configured!');
  } else {
    console.log('❌ CORS preflight failed');
  }
})
.catch(error => {
  console.log('❌ CORS Test Failed:', error.message);
  console.log('\n🔧 Fix: Add this environment variable to your backend:');
  console.log(`   FRONTEND_URL=${frontendUrl}`);
});

// Test actual API call
console.log('\n🔍 Testing actual API call...');
fetch(`${backendUrl}/health`)
.then(response => response.json())
.then(data => {
  console.log('✅ API Call Success:', data);
})
.catch(error => {
  console.log('❌ API Call Failed:', error.message);
  
  if (error.message.includes('CORS')) {
    console.log('\n🚨 CORS Error Detected!');
    console.log('📝 Solution:');
    console.log('1. Go to Render Dashboard');
    console.log('2. Open Backend Service');
    console.log('3. Go to Environment tab');
    console.log(`4. Add: FRONTEND_URL=${frontendUrl}`);
    console.log('5. Redeploy backend service');
  }
});
