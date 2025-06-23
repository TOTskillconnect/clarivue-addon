// Environment configuration for different deployment stages

export interface Environment {
  API_BASE_URL: string;
  WS_BASE_URL: string;
  GOOGLE_CLOUD_PROJECT_NUMBER?: string;
  FIREBASE_CONFIG?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
  };
  AI_PROVIDER?: 'openai' | 'anthropic' | 'custom';
  ENABLE_REAL_TIME_API: boolean;
  DEBUG_MODE: boolean;
}

// Development environment
const development: Environment = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  WS_BASE_URL: process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8000',
  GOOGLE_CLOUD_PROJECT_NUMBER: process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_NUMBER,
  FIREBASE_CONFIG: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || ''
  },
  AI_PROVIDER: (process.env.REACT_APP_AI_PROVIDER as 'openai' | 'anthropic' | 'custom') || 'openai',
  ENABLE_REAL_TIME_API: process.env.REACT_APP_ENABLE_REAL_TIME_API === 'true',
  DEBUG_MODE: true
};

// Production environment
const production: Environment = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.clarivue.com',
  WS_BASE_URL: process.env.REACT_APP_WS_BASE_URL || 'wss://api.clarivue.com',
  GOOGLE_CLOUD_PROJECT_NUMBER: process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_NUMBER,
  FIREBASE_CONFIG: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || ''
  },
  AI_PROVIDER: (process.env.REACT_APP_AI_PROVIDER as 'openai' | 'anthropic' | 'custom') || 'openai',
  ENABLE_REAL_TIME_API: process.env.REACT_APP_ENABLE_REAL_TIME_API !== 'false',
  DEBUG_MODE: false
};

// Staging environment
const staging: Environment = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://staging-api.clarivue.com',
  WS_BASE_URL: process.env.REACT_APP_WS_BASE_URL || 'wss://staging-api.clarivue.com',
  GOOGLE_CLOUD_PROJECT_NUMBER: process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_NUMBER,
  FIREBASE_CONFIG: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || ''
  },
  AI_PROVIDER: (process.env.REACT_APP_AI_PROVIDER as 'openai' | 'anthropic' | 'custom') || 'openai',
  ENABLE_REAL_TIME_API: process.env.REACT_APP_ENABLE_REAL_TIME_API !== 'false',
  DEBUG_MODE: true
};

// Get current environment
const getEnvironment = (): Environment => {
  const env = process.env.NODE_ENV || 'development';
  const stage = process.env.REACT_APP_STAGE || env;

  switch (stage) {
    case 'production':
      return production;
    case 'staging':
      return staging;
    case 'development':
    default:
      return development;
  }
};

export const environment = getEnvironment();

// Helper functions
export const isProduction = () => environment === production;
export const isDevelopment = () => environment === development;
export const isStaging = () => environment === staging;

// API endpoints
export const API_ENDPOINTS = {
  SESSIONS: `${environment.API_BASE_URL}/api/meetings/sessions`,
  EVENTS: `${environment.API_BASE_URL}/api/meetings/events`,
  QUESTIONS: `${environment.API_BASE_URL}/api/questions`,
  CUES: `${environment.API_BASE_URL}/api/cues`,
  AI_SUGGESTIONS: `${environment.API_BASE_URL}/api/ai/suggestions`,
  WEBSOCKET: `${environment.WS_BASE_URL}/ws/meetings`
};

// Clarivue Platform endpoints for authentication and account integration
export const CLARIVUE_ENDPOINTS = {
  AUTH_VERIFY: `${environment.API_BASE_URL}/v1/auth/verify`,
  LOGIN: `${environment.API_BASE_URL}/auth/google-meet-login`,
  SIGNUP: `${environment.API_BASE_URL}/signup`,
  DASHBOARD: `${environment.API_BASE_URL}/dashboard/meetings`,
  SETTINGS: `${environment.API_BASE_URL}/settings/integrations`,
  QUESTIONS: `${environment.API_BASE_URL}/v1/questions/meeting-suggestions`,
  TONE_ANALYSIS: `${environment.WS_BASE_URL}/v1/tone/live`,
  MEETINGS: `${environment.API_BASE_URL}/v1/meetings`
};

// Feature flags
export const FEATURES = {
  REAL_TIME_API: environment.ENABLE_REAL_TIME_API,
  DEBUG_LOGGING: environment.DEBUG_MODE,
  MOCK_DATA_FALLBACK: true, // Always enabled for demo purposes
  ANALYTICS: isProduction(),
  ERROR_REPORTING: isProduction() || isStaging(),
  CLARIVUE_AUTHENTICATION: true, // Enable Clarivue platform authentication
  TONE_ANALYSIS: true, // Feature flag for tone analysis
  AI_SUGGESTIONS: true // Feature flag for AI suggestions
}; 