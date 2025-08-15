/**
 * Frontend Configuration Utility
 * Centralized configuration management for environment variables
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 
             process.env.NEXT_PUBLIC_API_BASE_URL_FALLBACK || 
             'http://localhost:5000',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  },
  
  // Environment Detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Feature Flags (if needed)
  features: {
    debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
    analytics: process.env.NEXT_PUBLIC_ANALYTICS === 'true',
  }
};

/**
 * Get the properly formatted API base URL
 * Removes trailing slashes and ensures consistent formatting
 */
export const getApiBaseUrl = (): string => {
  return config.api.baseUrl.replace(/\/$/, '');
};

/**
 * Build API endpoint URL
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${cleanEndpoint}`;
  
  // Log the URL being used (only in development or when debug is enabled)
  if (config.isDevelopment || config.features.debug) {
    console.log(`Building API URL: ${fullUrl}`);
    console.log(`Base URL: ${baseUrl}`);
    console.log(`Endpoint: ${cleanEndpoint}`);
  }
  
  return fullUrl;
};

/**
 * Validate configuration and log important information
 */
export const validateAndLogConfig = (): void => {
  console.log('🔧 Frontend Configuration:');
  console.log(`- API Base URL: ${config.api.baseUrl}`);
  console.log(`- Environment: ${config.isDevelopment ? 'Development' : 'Production'}`);
  console.log(`- Debug Mode: ${config.features.debug}`);
  
  // Check for common configuration issues
  if (config.api.baseUrl.includes('localhost') && config.isProduction) {
    console.warn('⚠️  WARNING: Using localhost URL in production environment!');
  }
  
  if (!process.env.NEXT_PUBLIC_API_BASE_URL && config.isProduction) {
    console.warn('⚠️  WARNING: NEXT_PUBLIC_API_BASE_URL not set in production!');
  }
  
  console.log('Environment variables:');
  console.log(`- NEXT_PUBLIC_API_BASE_URL: ${process.env.NEXT_PUBLIC_API_BASE_URL || 'not set'}`);
  console.log(`- NEXT_PUBLIC_API_BASE_URL_FALLBACK: ${process.env.NEXT_PUBLIC_API_BASE_URL_FALLBACK || 'not set'}`);
};

export default config;
