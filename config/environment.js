/**
 * Get configuration values from environment variables with fallbacks
 * Supports different configurations for staging and production
 * 
 * @param {Object} env - Environment variables from Cloudflare Workers
 * @returns {Object} Configuration object
 */
export function getConfig(env) {
    return {
        // AdSense Publisher ID (used in ads.txt, AdSense scripts, homepage)
        adsensePublisherId: env.ADSENSE_PUBLISHER_ID || 'ca-pub-8547021258440704',

        // UniTune API endpoint (replaces Odesli)
        // Can be different for staging/production
        // Default: production API
        unituneApiEndpoint: env.UNITUNE_API_ENDPOINT || 'https://api.unitune.art/v1-alpha.1/links',
        unitunePlaylistEndpoint: env.UNITUNE_PLAYLIST_API_ENDPOINT || 'https://api.unitune.art/v1/playlists',

        // Worker version for debugging
        workerVersion: env.WORKER_VERSION || '2.2.0',

        // Environment name (development, staging, production)
        environment: env.ENVIRONMENT || 'production',

        // Environment-specific settings
        isProduction: (env.ENVIRONMENT || 'production') === 'production',
        isStaging: (env.ENVIRONMENT || 'production') === 'staging',
        isDevelopment: (env.ENVIRONMENT || 'production') === 'development',

        // Debug logging (enabled via DEBUG_LOGGING env var)
        debugLogging: env.DEBUG_LOGGING === 'true' || env.DEBUG_LOGGING === '1',
    };
}
