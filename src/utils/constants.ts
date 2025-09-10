// SPTrans API Configuration
export const SPTRANS_API_CONFIG = {
  BASE_URL: 'http://api.olhovivo.sptrans.com.br/v2.1',
  API_KEY: 'ee3d9c992c310e7df120272647178e753edb5027f8fd67951b297fab1a1164b3',
  TIMEOUT: 10000,
  MAX_RETRIES: 3
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'BusSP',
  VERSION: '1.0.0',
  ENVIRONMENT: __DEV__ ? 'development' : 'production'
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_REGION: {
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  },
  SAO_PAULO_BOUNDS: {
    northeast: { lat: -23.3569, lng: -46.3658 },
    southwest: { lat: -23.7773, lng: -46.8277 }
  },
  ZOOM_LEVELS: {
    city: 10,
    district: 13,
    street: 15,
    building: 18
  }
};

// Cache Configuration
export const CACHE_CONFIG = {
  EXPIRY_TIMES: {
    BUS_POSITIONS: 30 * 1000, // 30 seconds
    BUS_LINES: 24 * 60 * 60 * 1000, // 24 hours
    BUS_STOPS: 7 * 24 * 60 * 60 * 1000, // 7 days
    SEARCH_RESULTS: 60 * 60 * 1000 // 1 hour
  },
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_HISTORY_ITEMS: 100
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  CHANNELS: {
    BUS_ARRIVALS: 'bus-arrivals',
    SERVICE_ALERTS: 'service-alerts',
    GENERAL: 'general'
  },
  DEFAULT_SOUND: true,
  DEFAULT_VIBRATION: true
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  SEARCH_MIN_LENGTH: 2
};

// Feature Flags
export const FEATURE_FLAGS = {
  BIOMETRIC_AUTH: true,
  PUSH_NOTIFICATIONS: true,
  OFFLINE_MODE: true,
  ACCESSIBILITY: true,
  ANALYTICS: true
};