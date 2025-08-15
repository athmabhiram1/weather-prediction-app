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
  return `${baseUrl}${cleanEndpoint}`;
};

export default config;
