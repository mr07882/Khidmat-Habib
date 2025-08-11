// Backend configuration
// Update these values based on your environment

const BACKEND_CONFIG = {
  // Development - use your computer's IP address
  development: {
    baseURL: 'http://192.168.100.23:5000', // Your actual IP address
    timeout: 10000,
  },
  
  // Production - use your actual domain
  production: {
    baseURL: 'https://your-domain.com', // CHANGE THIS TO YOUR PRODUCTION URL
    timeout: 15000,
  }
};

// Get current environment
const getCurrentEnvironment = () => {
  // You can set this to 'production' when deploying
  return __DEV__ ? 'development' : 'production';
};

// Get current config
const getBackendConfig = () => {
  const env = getCurrentEnvironment();
  return BACKEND_CONFIG[env];
};

// Export configuration
export const BACKEND_URL = getBackendConfig().baseURL;
export const BACKEND_TIMEOUT = getBackendConfig().timeout;

// Helper function to build full URLs
export const buildBackendURL = (endpoint) => {
  return `${BACKEND_URL}${endpoint}`;
}; 