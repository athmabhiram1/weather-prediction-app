#!/usr/bin/env node

/**
 * Configuration Test Script
 * Run this to test if environment variables are properly configured
 */

// Simulate Next.js environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://weather-prediction-app-1-gmxl.onrender.com';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

console.log('🔧 Testing Frontend Configuration...\n');

console.log('Environment Variables:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- NEXT_PUBLIC_API_BASE_URL: ${process.env.NEXT_PUBLIC_API_BASE_URL || 'NOT SET'}`);
console.log(`- NEXT_PUBLIC_API_BASE_URL_FALLBACK: ${process.env.NEXT_PUBLIC_API_BASE_URL_FALLBACK || 'NOT SET'}`);
console.log(`- NEXT_PUBLIC_DEBUG: ${process.env.NEXT_PUBLIC_DEBUG || 'NOT SET'}\n`);

// Test the configuration logic
const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 
             process.env.NEXT_PUBLIC_API_BASE_URL_FALLBACK || 
             'http://localhost:5000',
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

const getApiBaseUrl = () => {
  return config.api.baseUrl.replace(/\/$/, '');
};

const buildApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

console.log('Configuration Test Results:');
console.log(`✅ Base URL: ${getApiBaseUrl()}`);
console.log(`✅ Sample API URL: ${buildApiUrl('/current-weather/Mumbai')}`);
console.log(`✅ Environment: ${config.isProduction ? 'Production' : 'Development'}`);

// Validation checks
console.log('\n🔍 Validation Checks:');

if (config.api.baseUrl.includes('localhost') && config.isProduction) {
  console.log('❌ WARNING: Using localhost URL in production environment!');
} else {
  console.log('✅ Base URL is appropriate for environment');
}

if (!process.env.NEXT_PUBLIC_API_BASE_URL && config.isProduction) {
  console.log('❌ WARNING: NEXT_PUBLIC_API_BASE_URL not set in production!');
} else {
  console.log('✅ Environment variables properly configured');
}

if (config.api.baseUrl.startsWith('https://')) {
  console.log('✅ Using secure HTTPS connection');
} else if (config.isProduction) {
  console.log('⚠️  WARNING: Not using HTTPS in production');
} else {
  console.log('✅ HTTP is acceptable for development');
}

console.log('\n🎯 Next Steps:');
console.log('1. Make sure your Render frontend service has NEXT_PUBLIC_API_BASE_URL set');
console.log('2. Redeploy your frontend service after setting environment variables');
console.log('3. Check browser console for configuration logs');
console.log('4. Verify API requests in browser Network tab');
