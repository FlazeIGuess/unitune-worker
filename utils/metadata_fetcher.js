import { log } from './logger.js';

/**
 * Fetch and cache song metadata from UniTune API
 * Uses Base64 share link ID as cache key for efficient caching
 * 
 * @param {string} musicUrl - The reconstructed music URL
 * @param {string} encodedPath - The Base64 encoded share link ID
 * @param {Object} config - Worker configuration
 * @param {Object} env - Environment bindings (KV namespaces)
 * @returns {Object|null} - Song metadata or null if not found
 */
export async function fetchAndCacheMetadata(musicUrl, encodedPath, config, env) {
    // Use Base64 string as cache key (more efficient than hashing full URL)
    const cacheKey = `metadata:${encodedPath}`;
    
    // Try to get from cache first
    let metadata = null;
    if (env.SONG_CACHE) {
        const cached = await env.SONG_CACHE.get(cacheKey, 'json');
        
        if (cached && cached.timestamp && (Date.now() - cached.timestamp < 86400000)) {
            log(config, 'info', 'Using cached metadata', {
                cacheKey: cacheKey.substring(0, 30)
            });
            return cached.data;
        }
    }
    
    // Not in cache, fetch from API
    log(config, 'info', 'Fetching metadata from API');
    const apiUrl = `${config.unituneApiEndpoint}?url=${encodeURIComponent(musicUrl)}`;
    
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'UniTune-Worker/1.1.0 (https://unitune.art)',
            },
        });
        
        if (response.ok) {
            metadata = await response.json();
            
            // Cache the metadata
            if (env.SONG_CACHE && metadata) {
                await env.SONG_CACHE.put(cacheKey, JSON.stringify({
                    data: metadata,
                    timestamp: Date.now()
                }), {
                    expirationTtl: 86400 // 24 hours
                });
                log(config, 'info', 'Cached metadata', {
                    cacheKey: cacheKey.substring(0, 30)
                });
            }
            
            return metadata;
        } else {
            log(config, 'warn', 'API error', { status: response.status });
            return null;
        }
    } catch (error) {
        log(config, 'error', 'Fetch error', { error: error.message });
        return null;
    }
}
