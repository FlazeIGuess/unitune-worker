/**
 * Cache Headers Module
 * 
 * Provides utilities for setting appropriate Cache-Control headers and ETags
 * for different types of content to optimize caching while ensuring freshness.
 * 
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6
 */

/**
 * Generates an ETag for content
 * Uses a simple hash of the content for cache validation
 * 
 * @param {string} content - The content to generate an ETag for
 * @returns {string} - The ETag value
 */
export async function generateETag(content) {
    // Convert string to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    
    // Generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Return as ETag (first 16 characters for brevity)
    return `"${hashHex.substring(0, 16)}"`;
}

/**
 * Cache configuration for different content types
 */
export const CACHE_CONFIG = {
    // Static assets: 24 hours (86400 seconds)
    STATIC_ASSETS: {
        maxAge: 86400,
        directive: 'public, max-age=86400',
        includeETag: true,
    },
    
    // Share pages: 1 hour (3600 seconds)
    SHARE_PAGES: {
        maxAge: 3600,
        directive: 'public, max-age=3600',
        includeETag: true,
    },
    
    // Homepage: 1 hour (3600 seconds)
    HOMEPAGE: {
        maxAge: 3600,
        directive: 'public, max-age=3600',
        includeETag: true,
    },
    
    // Error pages: no caching
    ERROR_PAGES: {
        maxAge: 0,
        directive: 'no-cache',
        includeETag: false,
    },
    
    // Privacy policy: 1 hour
    PRIVACY_POLICY: {
        maxAge: 3600,
        directive: 'public, max-age=3600',
        includeETag: true,
    },
};

/**
 * Adds cache headers to a response
 * 
 * @param {Response} response - The response to add cache headers to
 * @param {Object} cacheConfig - Cache configuration object
 * @param {string} content - Optional content for ETag generation
 * @returns {Promise<Response>} - Response with cache headers
 */
export async function addCacheHeaders(response, cacheConfig, content = null) {
    const headers = new Headers(response.headers);
    
    // Set Cache-Control header
    headers.set('Cache-Control', cacheConfig.directive);
    
    // Generate and set ETag if configured and content provided
    if (cacheConfig.includeETag && content) {
        const etag = await generateETag(content);
        headers.set('ETag', etag);
    }
    
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers,
    });
}

/**
 * Checks if a request has a matching ETag (for conditional requests)
 * 
 * @param {Request} request - The incoming request
 * @param {string} etag - The current ETag value
 * @returns {boolean} - True if ETags match (304 Not Modified should be returned)
 */
export function checkETag(request, etag) {
    const ifNoneMatch = request.headers.get('If-None-Match');
    return ifNoneMatch === etag;
}

/**
 * Creates a 304 Not Modified response
 * 
 * @param {string} etag - The ETag value
 * @param {Object} cacheConfig - Cache configuration object
 * @returns {Response} - 304 Not Modified response
 */
export function createNotModifiedResponse(etag, cacheConfig) {
    return new Response(null, {
        status: 304,
        statusText: 'Not Modified',
        headers: {
            'ETag': etag,
            'Cache-Control': cacheConfig.directive,
        },
    });
}
