/**
 * CampusCircle Core - Global Configuration
 * Application constants, storage keys, and system thresholds.
 */

export const APP_CONFIG = {
  appName: 'CampusCircle',
  version: '2.0.0',
  storageKeys: {
    theme: 'campuscircle_theme_preference',
    userSession: 'campuscircle_user_session',
    recentSearches: 'campuscircle_recent_searches'
  },
  themes: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  breakpoints: {
    mobile: 600,
    tablet: 900,
    desktop: 1200
  },
  animationDuration: {
    fast: 180,
    base: 300,
    slow: 500
  }
};
