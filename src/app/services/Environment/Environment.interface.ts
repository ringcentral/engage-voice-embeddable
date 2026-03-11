/**
 * Environment options for configuration
 */
export interface EnvironmentOptions {
  // Optional configuration options
}

/**
 * Environment data for setting
 */
export interface EnvironmentData {
  server: string;
  recordingHost: string;
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  evAuthServer: string;
}

/**
 * SDK Configuration interface
 */
export interface SdkConfig {
  server: string;
  clientId: string;
  clientSecret?: string;
  appName?: string;
  appVersion?: string;
  cachePrefix?: string;
}
