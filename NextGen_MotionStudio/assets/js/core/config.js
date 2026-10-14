/**
 * MotionStudio Core - Global Configuration
 * NextGen • Developed by A.K.Antal
 */

export const APP_CONFIG = {
  appName: 'MotionStudio',
  version: '2.4.0',
  parentCompany: 'NextGen Technologies',
  storageKeys: {
    theme: 'motionstudio_theme',
    themePreference: 'motionstudio_theme_preference',
    legacyTheme: 'tc_theme',
    userSession: 'motionstudio_user_session',
    projects: 'motionstudio_projects'
  },
  themes: {
    DARK: 'dark',
    LIGHT: 'light'
  },
  breakpoints: {
    mobile: 600,
    tablet: 860,
    desktop: 1200
  }
};
