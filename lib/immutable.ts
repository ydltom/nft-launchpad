import { config, passport } from '@imtbl/sdk';

// Read environment variables
// Note: process.env is available client-side in Next.js for vars prefixed with NEXT_PUBLIC_
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const environmentId = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT_ID || '';
const passportClientId = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID || '';
const isTestnet = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT === 'sandbox';

const environment = isTestnet
  ? config.Environment.SANDBOX
  : config.Environment.PRODUCTION;

// Export baseConfig for use with Checkout and potentially other SDK features
export const baseConfig = new config.ImmutableConfiguration({
  environment,
});

// Define passportConfig object
// Check for required variables to avoid runtime errors if env vars are missing
const passportConfigData = (passportClientId && baseURL && environmentId) ? {
    baseConfig,
    clientId: passportClientId,
    redirectUri: `http://localhost:3000/redirect`,
    logoutMode: 'silent',
    logoutRedirectUri: 'http://localhost:3000/silent-logout',
    audience: 'platform_api',
    scope: 'openid offline_access email transact',
} : null;

// Create and export the Passport instance
// It will be null if essential configuration is missing
export const passportInstance: passport.Passport | null = passportConfigData
  ? new passport.Passport(passportConfigData)
  : null;

// Log missing config only once during initialization if applicable
if (!passportConfigData) {
    console.error("Immutable SDK: Missing required environment variables for Passport initialization (NEXT_PUBLIC_PASSPORT_CLIENT_ID, NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT_ID, NEXT_PUBLIC_BASE_URL). Passport features will be disabled.");
}

// Export isTestnet as it's used in multiple places for conditional logic
export { isTestnet }; 