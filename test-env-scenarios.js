#!/usr/bin/env node

/**
 * Environment Variable Test for Render Deployment
 */

console.log('🔧 Environment Variable Configuration Test\n');

// Simulate different environment scenarios
const scenarios = [
  {
    name: 'Current Local (.env.local)',
    env: {
      NEXT_PUBLIC_API_BASE_URL: 'https://weather-prediction-app-1-gmxl.onrender.com',
      NEXT_PUBLIC_API_BASE_URL_FALLBACK: 'http://localhost:5000',
      NODE_ENV: 'development'
    }
  },
  {
    name: 'Render without Environment Variable',
    env: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'Render with Correct Environment Variable',
    env: {
      NEXT_PUBLIC_API_BASE_URL: 'https://weather-prediction-app-1-gmxl.onrender.com',
      NODE_ENV: 'production'
    }
  }
];

scenarios.forEach((scenario, index) => {
  console.log(`${index + 1}️⃣ Scenario: ${scenario.name}`);
  
  // Simulate the config logic
  const baseUrl = scenario.env.NEXT_PUBLIC_API_BASE_URL || 
                 scenario.env.NEXT_PUBLIC_API_BASE_URL_FALLBACK || 
                 'http://localhost:5000';
  
  console.log(`   Environment Variables:`);
  Object.entries(scenario.env).forEach(([key, value]) => {
    console.log(`     ${key}=${value}`);
  });
  
  console.log(`   Resulting API Base URL: ${baseUrl}`);
  
  if (baseUrl.includes('localhost') && scenario.env.NODE_ENV === 'production') {
    console.log(`   ❌ PROBLEM: Using localhost in production!`);
  } else if (baseUrl === 'https://weather-prediction-app-1-gmxl.onrender.com') {
    console.log(`   ✅ CORRECT: Using production backend URL`);
  } else {
    console.log(`   ⚠️  WARNING: Unexpected configuration`);
  }
  
  console.log('');
});

console.log('🎯 SOLUTION:');
console.log('In Render Frontend Service Environment Settings, add:');
console.log('Key: NEXT_PUBLIC_API_BASE_URL');
console.log('Value: https://weather-prediction-app-1-gmxl.onrender.com');
console.log('');
console.log('This will make scenario #3 active, which is the correct configuration! ✅');
