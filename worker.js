/**
 * UniTune Cloudflare Worker - Privacy Optimized
 * Version: 1.1.0
 * Last Updated: 2026-02-02
 * 
 * Privacy Features:
 * - No server-side logging of requests or user data
 * - No console.log statements for maximum privacy
 * - GDPR-compliant cookie consent
 * 
 * Environment Variables (configured in wrangler.toml):
 * - ADSENSE_PUBLISHER_ID: Google AdSense publisher ID (e.g., "ca-pub-8547021258440704")
 *   Used in: ads.txt endpoint, AdSense script tags, homepage
 * - UNITUNE_API_ENDPOINT: UniTune API endpoint URL (default: "https://api.unitune.art/v1-alpha.1/links")
 *   Supports different endpoints for staging/production environments
 * - WORKER_VERSION: Worker version for debugging (e.g., "2.2.0")
 * - ENVIRONMENT: Environment name (development, staging, production)
 *   Used for environment-specific configuration and behavior
 * 
 * Environment-Specific Configuration:
 * - Production: Uses production API endpoints and AdSense configuration
 * - Staging: Can use staging API endpoints for testing
 * - Development: Can use local or development API endpoints
 */

import { escapeHtml } from './security/html_escaper.js';
import { RateLimiter, getClientIp, createRateLimitResponse } from './security/rate_limiter.js';
import { addSecurityHeaders } from './security/headers.js';
import { addCacheHeaders, generateETag, checkETag, createNotModifiedResponse, CACHE_CONFIG } from './security/cache_headers.js';

// Initialize rate limiter
const rateLimiter = new RateLimiter();

/**
 * Get configuration values from environment variables with fallbacks
 * Supports different configurations for staging and production
 * 
 * @param {Object} env - Environment variables from Cloudflare Workers
 * @returns {Object} Configuration object
 */
function getConfig(env) {
    return {
        // AdSense Publisher ID (used in ads.txt, AdSense scripts, homepage)
        adsensePublisherId: env.ADSENSE_PUBLISHER_ID || 'ca-pub-8547021258440704',

        // UniTune API endpoint (replaces Odesli)
        // Can be different for staging/production
        // Default: production API
        unituneApiEndpoint: env.UNITUNE_API_ENDPOINT || 'https://api.unitune.art/v1-alpha.1/links',

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

/**
 * Privacy-safe logger that only logs when DEBUG_LOGGING is enabled
 * Sanitizes URLs and sensitive data before logging
 * 
 * @param {Object} config - Configuration object with debugLogging flag
 * @param {string} level - Log level (info, warn, error, debug)
 * @param {string} message - Log message
 * @param {Object} data - Additional data to log (will be sanitized)
 */
function log(config, level, message, data = {}) {
    if (!config.debugLogging) {
        return; // Logging disabled
    }

    // Sanitize data to remove sensitive information
    const sanitizedData = {};
    for (const [key, value] of Object.entries(data)) {
        if (key === 'url' || key === 'musicUrl' || key === 'decodedUrl') {
            // Only log domain and path structure, not full URL
            try {
                const urlObj = new URL(value);
                sanitizedData[key] = `${urlObj.hostname}${urlObj.pathname.substring(0, 20)}...`;
            } catch {
                sanitizedData[key] = '[invalid-url]';
            }
        } else if (key === 'ip' || key === 'clientIp') {
            // Hash IP addresses for privacy
            sanitizedData[key] = '[ip-hidden]';
        } else if (typeof value === 'string' && value.length > 100) {
            // Truncate long strings
            sanitizedData[key] = value.substring(0, 100) + '...';
        } else {
            sanitizedData[key] = value;
        }
    }

    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        version: config.workerVersion,
        environment: config.environment,
        ...sanitizedData
    };

    // Use appropriate console method based on level
    switch (level) {
        case 'error':
            console.error(JSON.stringify(logEntry));
            break;
        case 'warn':
            console.warn(JSON.stringify(logEntry));
            break;
        case 'debug':
            console.debug(JSON.stringify(logEntry));
            break;
        default:
            console.log(JSON.stringify(logEntry));
    }
}

/**
 * Detects if the request is from a social media bot/crawler
 * These bots don't execute JavaScript, so they need server-side rendered content
 * 
 * @param {string} userAgent - The User-Agent header from the request
 * @returns {boolean} - True if the request is from a bot
 */
function isSocialMediaBot(userAgent) {
    if (!userAgent) return false;

    const botPatterns = [
        'facebookexternalhit',      // Facebook
        'WhatsApp',                 // WhatsApp
        'Twitterbot',               // Twitter/X
        'TelegramBot',              // Telegram
        'Slackbot',                 // Slack
        'LinkedInBot',              // LinkedIn
        'Discordbot',               // Discord
        'SkypeUriPreview',          // Skype
        'Snapchat',                 // Snapchat
        'Pinterest',                // Pinterest
        'Googlebot',                // Google (for SEO)
        'bingbot',                  // Bing (for SEO)
    ];

    const lowerUserAgent = userAgent.toLowerCase();
    return botPatterns.some(pattern => lowerUserAgent.includes(pattern.toLowerCase()));
}

// Trusted domains for thumbnail URLs (music service CDNs)
const TRUSTED_THUMBNAIL_DOMAINS = [
    'i.scdn.co',                    // Spotify CDN
    'is1-ssl.mzstatic.com',         // Apple Music CDN
    'is2-ssl.mzstatic.com',         // Apple Music CDN
    'is3-ssl.mzstatic.com',         // Apple Music CDN
    'is4-ssl.mzstatic.com',         // Apple Music CDN
    'is5-ssl.mzstatic.com',         // Apple Music CDN
    'resources.tidal.com',          // TIDAL CDN
    'i.ytimg.com',                  // YouTube CDN
    'lh3.googleusercontent.com',    // YouTube/Google CDN
    'e-cdns-images.dzcdn.net',      // Deezer CDN
    'm.media-amazon.com',           // Amazon Music CDN
    'images-na.ssl-images-amazon.com', // Amazon CDN
];

/**
 * Validates that a thumbnail URL is safe to display
 * - Must use HTTPS protocol
 * - Must be from a trusted music service domain
 * 
 * @param {string} url - The thumbnail URL to validate
 * @returns {boolean} - True if the URL is safe, false otherwise
 */
function isValidThumbnailUrl(url) {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const parsedUrl = new URL(url);

        // Must use HTTPS protocol
        if (parsedUrl.protocol !== 'https:') {
            return false;
        }

        // Must be from a trusted domain
        const hostname = parsedUrl.hostname.toLowerCase();
        return TRUSTED_THUMBNAIL_DOMAINS.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );
    } catch (e) {
        // Invalid URL format
        return false;
    }
}

// Music service configurations using logos from public/assets/logos
// Logos are served as static assets via Cloudflare Workers Assets
const SERVICES = {
    spotify: {
        name: 'Spotify',
        color: '#1DB954',
        logo: '/assets/logos/spotify.png'
    },
    appleMusic: {
        name: 'Apple Music',
        color: '#FA243C',
        logo: '/assets/logos/apple_music.png'
    },
    tidal: {
        name: 'TIDAL',
        color: '#000000',
        logo: '/assets/logos/tidal.png'
    },
    youtubeMusic: {
        name: 'YouTube Music',
        color: '#FF0000',
        logo: '/assets/logos/youtube_music.png'
    },
    deezer: {
        name: 'Deezer',
        color: '#a238ff',
        logo: '/assets/logos/deezer.png'
    },
    amazonMusic: {
        name: 'Amazon Music',
        color: '#00A8E1',
        logo: '/assets/logos/amazon_music.png'
    },
};

/**
 * Reconstructs a music URL from platform, type, and ID
 * 
 * @param {string} platform - Platform identifier (spotify, tidal, etc.)
 * @param {string} type - Content type (track, album, etc.)
 * @param {string} id - Track/content ID
 * @returns {string|null} - Reconstructed URL or null if platform unsupported
 */
function reconstructMusicUrl(platform, type, id) {
    const urls = {
        'spotify': `https://open.spotify.com/${type}/${id}`,
        'tidal': `https://tidal.com/browse/${type}/${id}`,
        'applemusic': `https://music.apple.com/us/song/${id}`,
        'youtubemusic': `https://music.youtube.com/watch?v=${id}`,
        'youtube': `https://youtube.com/watch?v=${id}`,
        'deezer': `https://www.deezer.com/${type}/${id}`,
        'amazonmusic': `https://music.amazon.com/tracks/${id}`
    };
    
    return urls[platform.toLowerCase()] || null;
}

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
async function fetchAndCacheMetadata(musicUrl, encodedPath, config, env) {
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


export default {
    async fetch(request, env, ctx) {
        try {
            // Get configuration from environment variables
            const config = getConfig(env);

            const url = new URL(request.url);

            // Log incoming request (only if debug logging enabled)
            log(config, 'info', 'Incoming request', {
                method: request.method,
                pathname: url.pathname,
                userAgent: request.headers.get('User-Agent')?.substring(0, 50)
            });

            // Health check (no rate limiting)
            if (url.pathname === '/health') {
                return addSecurityHeaders(new Response('OK', { status: 200 }));
            }

            // Privacy policy (no rate limiting)
            if (url.pathname === '/privacy') {
                const content = getPrivacyPolicy();

                // Generate ETag for content
                const etag = await generateETag(content);

                // Check if client has cached version
                if (checkETag(request, etag)) {
                    return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.PRIVACY_POLICY));
                }

                const response = new Response(content, {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });

                return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.PRIVACY_POLICY, content));
            }

            // App-specific privacy policy (no rate limiting)
            if (url.pathname === '/privacy-app') {
                const content = getAppPrivacyPolicy();

                // Generate ETag for content
                const etag = await generateETag(content);

                // Check if client has cached version
                if (checkETag(request, etag)) {
                    return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.PRIVACY_POLICY));
                }

                const response = new Response(content, {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });

                return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.PRIVACY_POLICY, content));
            }

            // ads.txt for Google AdSense (no rate limiting)
            if (url.pathname === '/ads.txt') {
                // Read AdSense publisher ID from environment variable
                const pubId = config.adsensePublisherId.replace('ca-', '');
                const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;

                // Generate ETag for content
                const etag = await generateETag(content);

                // Check if client has cached version
                if (checkETag(request, etag)) {
                    return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
                }

                const response = new Response(content, {
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                });

                return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
            }

            // Android App Links verification (no rate limiting)
            if (url.pathname === '/.well-known/assetlinks.json') {
                const content = getAssetLinks();

                // Generate ETag for content
                const etag = await generateETag(content);

                // Check if client has cached version
                if (checkETag(request, etag)) {
                    return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
                }

                const response = new Response(content, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
            }

            // iOS Universal Links verification (no rate limiting)
            if (url.pathname === '/.well-known/apple-app-site-association') {
                const content = getAppleAppSiteAssociation();

                // Generate ETag for content
                const etag = await generateETag(content);

                // Check if client has cached version
                if (checkETag(request, etag)) {
                    return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.STATIC_ASSETS));
                }

                const response = new Response(content, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.STATIC_ASSETS, content));
            }

            // Apply rate limiting to share links (/s/*) and homepage
            if (url.pathname.startsWith('/s/') || url.pathname === '/') {
                // Get client IP
                const clientIp = getClientIp(request);

                // Check rate limit (only if KV namespace is available)
                if (env.RATE_LIMIT) {
                    const rateLimitResult = await rateLimiter.checkLimit(clientIp, env.RATE_LIMIT);

                    if (!rateLimitResult.allowed) {
                        return createRateLimitResponse(rateLimitResult.retryAfter || 60);
                    }
                }
            }

            // API Proxy for UniTune API (to avoid CORS issues)
            if (url.pathname === '/api/song') {
                const musicUrl = url.searchParams.get('url');

                if (!musicUrl) {
                    return addSecurityHeaders(new Response(
                        JSON.stringify({ error: 'Missing url parameter' }),
                        {
                            status: 400,
                            headers: { 'Content-Type': 'application/json' }
                        }
                    ));
                }

                log(config, 'info', 'API proxy request', {
                    musicUrl: musicUrl.substring(0, 50)
                });

                try {
                    const apiUrl = `${config.unituneApiEndpoint}?url=${encodeURIComponent(musicUrl)}`;

                    const response = await fetch(apiUrl, {
                        headers: {
                            'User-Agent': 'UniTune-Worker/2.2.0 (https://unitune.art)',
                        },
                    });

                    const data = await response.text();

                    log(config, 'info', 'API proxy response', {
                        status: response.status
                    });

                    // Return with CORS headers
                    return addSecurityHeaders(new Response(data, {
                        status: response.status,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': 'https://unitune.art',
                            'Access-Control-Allow-Methods': 'GET, OPTIONS',
                            'Access-Control-Allow-Headers': 'Content-Type',
                        },
                    }));

                } catch (error) {
                    log(config, 'error', 'API proxy error', {
                        error: error.message
                    });

                    return addSecurityHeaders(new Response(
                        JSON.stringify({ error: 'Failed to fetch song data' }),
                        {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': 'https://unitune.art',
                            }
                        }
                    ));
                }
            }

            // Handle OPTIONS requests for CORS preflight
            if (request.method === 'OPTIONS') {
                return addSecurityHeaders(new Response(null, {
                    status: 204,
                    headers: {
                        'Access-Control-Allow-Origin': 'https://unitune.art',
                        'Access-Control-Allow-Methods': 'GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Max-Age': '86400',
                    },
                }));
            }

            // Handle share links: /s/{encodedUrl}
            if (url.pathname.startsWith('/s/')) {
                log(config, 'debug', 'Processing share link', {
                    pathname: url.pathname,
                    fullUrl: url.href
                });

                // Extract everything after /s/ from the pathname
                let pathAfterS = url.pathname.substring(3); // Remove '/s/'

                log(config, 'debug', 'Path after /s/', { pathAfterS });

                // Decode share link (Base64 format)
                let musicUrl = null;

                try {
                    // Try Base64 decode
                    let padded = pathAfterS;
                    while (padded.length % 4 !== 0) {
                        padded += '=';
                    }
                    
                    // Decode Base64 (URL-safe)
                    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
                    
                    log(config, 'debug', 'Base64 decoded', { decoded: decoded.substring(0, 50) });
                    
                    // Check if it's platform:type:id format
                    if (decoded.includes(':') && !decoded.startsWith('http')) {
                        const parts = decoded.split(':');
                        if (parts.length >= 3) {
                            const platform = parts[0];
                            const type = parts[1];
                            const id = parts.slice(2).join(':'); // Handle IDs with colons
                            
                            // Reconstruct music URL
                            musicUrl = reconstructMusicUrl(platform, type, id);
                            
                            if (!musicUrl) {
                                log(config, 'error', 'Unsupported platform', { platform });
                                const errorContent = getErrorPage('Unsupported music platform.');
                                return addSecurityHeaders(new Response(errorContent, {
                                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                                    status: 400,
                                }));
                            }
                            
                            log(config, 'info', 'Reconstructed URL', {
                                platform,
                                type,
                                id: id.substring(0, 20)
                            });
                        }
                    }
                } catch (e) {
                    log(config, 'error', 'Base64 decode failed', {
                        error: e.message,
                        pathAfterS: pathAfterS.substring(0, 50)
                    });
                    
                    const errorContent = getErrorPage('Invalid share link format.');
                    return addSecurityHeaders(new Response(errorContent, {
                        headers: { 'Content-Type': 'text/html; charset=utf-8' },
                        status: 400,
                    }));
                }

                if (!musicUrl) {
                    log(config, 'error', 'Could not decode share link');
                    const errorContent = getErrorPage('Invalid share link.');
                    return addSecurityHeaders(new Response(errorContent, {
                        headers: { 'Content-Type': 'text/html; charset=utf-8' },
                        status: 400,
                    }));
                }

                // Fetch and cache metadata for all requests (bot and user)
                const metadata = await fetchAndCacheMetadata(musicUrl, pathAfterS, config, env);
                
                if (!metadata) {
                    log(config, 'error', 'Failed to fetch metadata');
                    const errorContent = getErrorPage('Song not found. Please try again.');
                    return addSecurityHeaders(new Response(errorContent, {
                        headers: { 'Content-Type': 'text/html; charset=utf-8' },
                        status: 404,
                    }));
                }

                // Check if request is from a social media bot
                const userAgent = request.headers.get('User-Agent') || '';
                const isBot = isSocialMediaBot(userAgent);

                log(config, 'info', 'Request type detected', {
                    isBot,
                    userAgent: userAgent.substring(0, 50)
                });

                if (isBot) {
                    // Bot request: Server-side rendering with metadata
                    log(config, 'info', 'Serving bot with server-side rendering');
                    return getServerSideRenderedPage(musicUrl, metadata, config);
                } else {
                    // Normal user: Client-side loading with metadata for Open Graph
                    log(config, 'info', 'Serving user with client-side loading');
                    return getClientSideLoadingPage(musicUrl, metadata, config);
                }
            }

            // Homepage
            if (url.pathname === '/') {
                const content = getHomePage(config.adsensePublisherId);

                // Generate ETag for content
                const etag = await generateETag(content);

                // Check if client has cached version
                if (checkETag(request, etag)) {
                    return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.HOMEPAGE));
                }

                const response = new Response(content, {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });

                return addSecurityHeaders(await addCacheHeaders(response, CACHE_CONFIG.HOMEPAGE, content));
            }

            // 404 for everything else
            const errorContent = getErrorPage('Page not found.');
            const errorResponse = new Response(errorContent, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                status: 404,
            });

            return addSecurityHeaders(await addCacheHeaders(errorResponse, CACHE_CONFIG.ERROR_PAGES));
        } catch (error) {
            // Global error handler - catch any unhandled errors
            // Log error details when debug logging is enabled
            const config = getConfig(env);
            log(config, 'error', 'Unhandled error in worker', {
                error: error.message,
                stack: error.stack?.substring(0, 200)
            });

            // Return generic error page without exposing error details or stack traces
            const errorContent = getErrorPage('An unexpected error occurred. Please try again later.');
            const errorResponse = new Response(errorContent, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                status: 500,
            });

            return addSecurityHeaders(await addCacheHeaders(errorResponse, CACHE_CONFIG.ERROR_PAGES));
        }
    },
};

/**
 * Server-Side rendering for bots with pre-fetched metadata
 * Metadata is already fetched and cached by the main handler
 */
function getServerSideRenderedPage(musicUrl, metadata, config) {
    try {
        // Extract metadata
        const entities = Object.values(metadata.entitiesByUniqueId || {});
        const firstEntity = entities[0] || {};
        const title = firstEntity.title || 'Unknown Song';
        const artist = firstEntity.artistName || 'Unknown Artist';
        const thumbnail = firstEntity.thumbnailUrl || '';
        const links = metadata.linksByPlatform || {};

        log(config, 'info', 'Rendering page for bot', {
            title: title.substring(0, 30),
            hasThumbnail: !!thumbnail
        });

        // Return full HTML with Open Graph tags
        const html = getLandingPage({
            title,
            artist,
            thumbnail,
            links,
            musicUrl,
            adsensePublisherId: config.adsensePublisherId,
        });

        return addSecurityHeaders(new Response(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }));

    } catch (error) {
        log(config, 'error', 'Error in getServerSideRenderedPage', {
            error: error.message
        });

        const errorContent = getErrorPage('Unable to load song. Please try again later.');
        return addSecurityHeaders(new Response(errorContent, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 500,
        }));
    }
}

/**
 * Client-Side loading page for normal users
 * JavaScript will fetch data via our API proxy
 * Now includes actual metadata in Open Graph tags for messaging app previews
 */
function getClientSideLoadingPage(musicUrl, metadata, config) {
    const escapedMusicUrl = escapeHtml(musicUrl);
    const encodedMusicUrl = encodeURIComponent(musicUrl);
    
    // Extract metadata for Open Graph tags
    const entities = Object.values(metadata?.entitiesByUniqueId || {});
    const firstEntity = entities[0] || {};
    const title = firstEntity.title || 'UniTune - Universal Music Links';
    const artist = firstEntity.artistName || 'Listen on your favorite platform';
    const thumbnail = firstEntity.thumbnailUrl || 'https://unitune.art/logo.png';
    
    // Validate and escape
    const escapedTitle = escapeHtml(title);
    const escapedArtist = escapeHtml(artist);
    const validatedThumbnail = isValidThumbnailUrl(thumbnail) ? escapeHtml(thumbnail) : 'https://unitune.art/logo.png';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="google-adsense-account" content="${config.adsensePublisherId}">
  <title>${escapedTitle} - ${escapedArtist}</title>
  
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedArtist}">
  <meta property="og:image" content="${validatedThumbnail}">
  <meta property="og:url" content="https://unitune.art/s/${encodedMusicUrl}">
  <meta property="og:type" content="music.song">
  <meta name="theme-color" content="#0D1117">
  
  <style>
    ${getCommonStyles()}
    
    .main-wrapper {
        width: 100%;
        max-width: min(480px, 100vw - 32px);
        padding: clamp(16px, 4vw, 24px);
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        justify-content: flex-start;
    }

    #loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        text-align: center;
        animation: fadeIn 0.5s ease-out;
    }

    .spinner {
        border: 4px solid rgba(255,255,255,0.1);
        border-top: 4px solid var(--primary);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite;
        margin-bottom: 24px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading-text {
        font-size: 18px;
        color: var(--text-secondary);
        margin-bottom: 12px;
    }

    .loading-subtext {
        font-size: 14px;
        color: var(--text-muted);
    }

    #content-state {
        display: none;
        width: 100%;
        animation: fadeIn 0.5s ease-out;
    }

    #error-state {
        display: none;
        text-align: center;
        animation: fadeIn 0.5s ease-out;
    }

    .error-icon {
        font-size: 64px;
        margin-bottom: 24px;
    }

    .error-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--text-primary);
    }

    .error-message {
        font-size: 16px;
        color: var(--text-secondary);
        margin-bottom: 24px;
        line-height: 1.5;
    }

    .retry-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .retry-button:hover {
        background: var(--primary-light);
        transform: translateY(-2px);
    }

    .original-link {
        margin-top: 16px;
    }

    .original-link a {
        color: var(--primary);
        text-decoration: none;
        font-size: 14px;
    }

    .original-link a:hover {
        text-decoration: underline;
    }

    /* Content styles (same as landing page) */
    .hero {
        margin-top: 20px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
    }

    /* Get UniTune App Button */
    .get-app-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 16px 24px;
        margin-bottom: 24px;
        text-decoration: none;
        color: var(--text-primary);
        font-size: 16px;
        font-weight: 600;
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.2), rgba(88, 166, 255, 0.1));
        border: 1px solid rgba(88, 166, 255, 0.3);
        animation: scaleIn 0.5s ease-out;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .get-app-btn:hover {
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.3), rgba(88, 166, 255, 0.15));
        box-shadow: 0 0 30px var(--accent-glow);
        transform: translateY(-2px);
    }
    
    .get-app-btn:active {
        transform: scale(0.98);
    }
    
    .app-icon {
        font-size: 20px;
    }

    .album-art-container {
        position: relative;
        width: clamp(180px, 50vw, 240px);
        height: clamp(180px, 50vw, 240px);
        margin-bottom: clamp(24px, 5vw, 32px);
    }

    .album-art {
        width: 100%;
        height: 100%;
        border-radius: 24px;
        object-fit: cover;
        position: relative;
        z-index: 2;
        box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
    }

    .album-glow {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        background-size: cover;
        filter: blur(40px) saturate(180%);
        opacity: 0.5;
        z-index: 1;
        border-radius: 50%;
    }

    .song-info {
        width: 100%;
        padding: 0 10px;
    }

    .song-title {
        font-size: 32px;
        font-weight: 800;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
        line-height: 1.1;
        background: linear-gradient(to right, #fff, #e0e0e0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .artist-name {
        font-size: 18px;
        font-weight: 500;
        color: var(--text-secondary);
        letter-spacing: -0.2px;
    }

    .links-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-bottom: 20px;
    }

    .service-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 14px 18px;
        border-radius: 16px;
        background: var(--glass-base);
        border: 0.5px solid var(--glass-border);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 0 var(--glass-highlight);
        text-decoration: none;
        color: white;
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .service-row:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                    0 0 20px var(--accent-glow);
        border-color: var(--primary);
    }

    .service-left {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .service-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .service-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 6px;
    }

    .service-name {
        font-size: 17px;
        font-weight: 600;
        letter-spacing: -0.3px;
    }

    .service-action {
        font-size: 13px;
        font-weight: 600;
        color: rgba(255,255,255,0.6);
        background: rgba(255,255,255,0.1);
        padding: 6px 14px;
        border-radius: 100px;
    }

    .footer {
        margin-top: auto;
        padding-top: 20px;
        text-align: center;
        font-size: 13px;
        color: rgba(255,255,255,0.3);
        display: flex;
        gap: 15px;
        justify-content: center;
    }

    .footer a {
        color: inherit;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }

    .footer a:hover {
        color: rgba(255,255,255,0.6);
    }
  </style>
</head>
<body>
  <div class="main-wrapper">
    <!-- Loading State -->
    <div id="loading-state">
      <div class="spinner"></div>
      <div class="loading-text">Loading song information...</div>
      <div class="loading-subtext">Fetching from music platforms</div>
    </div>

    <!-- Content State (filled by JavaScript) -->
    <div id="content-state"></div>

    <!-- Error State -->
    <div id="error-state">
      <h1 class="error-title">Unable to Load</h1>
      <p class="error-message" id="error-message"></p>
      <button class="retry-button" onclick="location.reload()">
        <span>Try Again</span>
      </button>
      <div class="original-link">
        <a href="${escapedMusicUrl}" target="_blank">Open Original Link →</a>
      </div>
    </div>

    <div class="footer">
      <a href="/">UniTune</a>
      <span>•</span>
      <a href="/privacy">Privacy</a>
    </div>
  </div>

  <script>
    const MUSIC_URL = ${JSON.stringify(musicUrl)};
    const API_PROXY = '/api/song'; // UniTune API proxy
    const SERVICES = ${JSON.stringify(SERVICES)};

    // UniTune Logo SVG (dynamically colored)
    const UNITUNE_LOGO_SVG = \`
      <svg viewBox="0 0 842.13 985.84" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <path class="logo-path" d="M27.4,66.27c47.21-1.28,89.07,6.86,126.48,38.09,66.15,55.21,60.95,144.27,61.18,221.93l.08,181.23c-.06,37.69-.86,74.85,1.61,112.49,6.97,106.45,93.55,175.65,199.23,165.87,42.47-3.55,83.05-19.14,116.97-44.95,92.36-69.31,92.93-166.31,91.37-269.59-.81-53.71-.31-108.8-.54-162.62.54-8.04-1.42-37.8,5.3-42.69,16.26-11.84,61.03,23.88,70.98,33.39,40.76,38.96,42.64,101.83,43.46,154.32.27,25.33.36,50.67.3,76-.11,28.44.91,59.71-.19,87.72-3.47,84.27-23.66,162.29-76.5,229.62-127.43,162.4-369.95,181.63-532.07,60.97C60.91,852.85,16.04,761.04,3.14,670.93c-4.6-32.15-2.79-71.35-2.76-104.35l.03-154.11.05-198.05c-.06-37.93-.93-76.13.76-114,.82-18.45,6-31.92,26.19-34.14Z"/>
        <path class="logo-path" d="M548.39.27c32.61-1.76,32.41,4.66,45.8,30.51,13.33,25.75,39.38,45.82,63.55,61.14,59.59,38.01,123.95,60.45,161.72,125.48,35.17,60.55,31.75,164.75-26.84,211.97-1.84,1.48-4.59.74-6.61.17-2.7-2.29-5.04-5.81-5.16-9.34-1.14-34.32-4.14-64.88-16.53-97.5-17.4-45.81-55.32-75.56-99.64-93.86-20.16-8.32-45.76-16.27-67.19-7.41l-1.19.51c-3.33,4.16-8.05,10.61-8.7,15.95-3.52,28.74-2.76,61.05-2.78,89.91l.27,153.28c-.02,33.57,1.23,59.36-1.59,93.15-11.16,83.39-58.86,146.18-141.48,168.21-126.33,33.67-234.19-80.57-162.98-199.56,36.36-60.76,103.18-96.85,173.8-90.85,17.49,1.38,59.93,24.05,67.19-4.54,3.74-26.18,2.01-61.22,1.97-88.52l-.05-205.92c-.01-37.68-.88-75.74.72-113.35.98-23.07,1.95-33.98,25.72-39.44Z"/>
      </svg>
    \`;

    async function loadSongData() {
      try {
        const response = await fetch(
          API_PROXY + '?url=' + encodeURIComponent(MUSIC_URL)
        );

        if (response.status === 429) {
          showError(
            'Too Many Requests',
            'The music service is currently rate-limited. Please wait a moment and try again.\\n\\nRate limit: 10 requests per minute'
          );
          return;
        }

        if (!response.ok) {
          showError(
            'Song Not Found',
            'This song could not be found on streaming platforms. The link might be invalid or the song might not be available.'
          );
          return;
        }

        const data = await response.json();
        renderSongPage(data);

      } catch (error) {
        console.error('Error loading song:', error);
        showError(
          'Connection Error',
          'Unable to connect to the music service. Please check your internet connection and try again.'
        );
      }
    }

    function renderSongPage(data) {
      const entities = Object.values(data.entitiesByUniqueId || {});
      const firstEntity = entities[0] || {};
      const title = firstEntity.title || 'Unknown Song';
      const artist = firstEntity.artistName || 'Unknown Artist';
      const thumbnail = firstEntity.thumbnailUrl || '';
      const links = data.linksByPlatform || {};

      // Update page title
      document.title = title + ' - ' + artist;

      // Build service buttons
      let serviceButtons = '';
      for (const [key, service] of Object.entries(SERVICES)) {
        const link = links[key]?.url;
        if (link) {
          serviceButtons += \`
            <a href="\${link}" class="service-row">
              <div class="service-left">
                <div class="service-icon">
                  <img src="\${service.logo}" alt="\${service.name}" loading="lazy">
                </div>
                <span class="service-name">\${service.name}</span>
              </div>
              <div class="service-action">Play</div>
            </a>
          \`;
        }
      }

      // Render content
      document.getElementById('content-state').innerHTML = \`
        <div class="hero">
          <div class="album-art-container">
            <div class="album-glow" style="background-image: url('\${thumbnail}')"></div>
            \${thumbnail ? \`<img src="\${thumbnail}" alt="Album Art" class="album-art" crossorigin="anonymous" id="album-art-img">\` : ''}
          </div>
          <div class="song-info">
            <h1 class="song-title">\${escapeHtml(title)}</h1>
            <p class="artist-name">\${escapeHtml(artist)}</p>
          </div>
        </div>
        <a href="unitune://open?url=\${encodeURIComponent(MUSIC_URL)}&title=\${encodeURIComponent(title)}&artist=\${encodeURIComponent(artist)}" class="get-app-btn glass-card">
          <div class="app-logo">\${UNITUNE_LOGO_SVG}</div>
          <span>Open in UniTune</span>
        </a>
        <div class="links-container">
          \${serviceButtons}
        </div>
      \`;

      // Show content, hide loading
      document.getElementById('loading-state').style.display = 'none';
      document.getElementById('content-state').style.display = 'block';

      // Extract colors from album art
      if (thumbnail) {
        extractColorsFromImage(thumbnail);
      }
    }

    // Color extraction function
    function extractColorsFromImage(imageUrl) {
      const img = document.getElementById('album-art-img');
      if (!img) return;

      img.addEventListener('load', function() {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          // Sample pixels and find dominant color
          const colorMap = {};
          const sampleRate = 10; // Sample every 10th pixel for performance
          
          for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Skip transparent and very dark/light pixels
            if (a < 125 || (r + g + b) < 50 || (r + g + b) > 700) continue;
            
            // Quantize colors to reduce variations
            const qr = Math.round(r / 10) * 10;
            const qg = Math.round(g / 10) * 10;
            const qb = Math.round(b / 10) * 10;
            const key = \`\${qr},\${qg},\${qb}\`;
            
            colorMap[key] = (colorMap[key] || 0) + 1;
          }
          
          // Find most common color
          let dominantColor = null;
          let maxCount = 0;
          
          for (const [color, count] of Object.entries(colorMap)) {
            if (count > maxCount) {
              maxCount = count;
              dominantColor = color;
            }
          }
          
          if (dominantColor) {
            const [r, g, b] = dominantColor.split(',').map(Number);
            applyDynamicColors(r, g, b);
          }
        } catch (e) {
          console.error('Color extraction failed:', e);
        }
      });
    }

    function applyDynamicColors(r, g, b) {
      const root = document.documentElement;
      
      // Apply primary color
      root.style.setProperty('--primary', \`rgb(\${r}, \${g}, \${b})\`);
      root.style.setProperty('--primary-light', \`rgb(\${Math.min(r + 30, 255)}, \${Math.min(g + 30, 255)}, \${Math.min(b + 30, 255)})\`);
      root.style.setProperty('--primary-dark', \`rgb(\${Math.max(r - 30, 0)}, \${Math.max(g - 30, 0)}, \${Math.max(b - 30, 0)})\`);
      
      // Apply accent glow
      root.style.setProperty('--accent-glow', \`rgba(\${r}, \${g}, \${b}, 0.4)\`);
      
      // Update background gradient
      document.body.style.backgroundImage = \`radial-gradient(ellipse 150% 80% at 50% -10%, rgba(\${r}, \${g}, \${b}, 0.15) 0%, rgba(13, 17, 23, 0.95) 50%, #0D1117 100%)\`;
    }

    function showError(title, message) {
      document.getElementById('error-message').textContent = message;
      document.querySelector('.error-title').textContent = title;
      document.getElementById('loading-state').style.display = 'none';
      document.getElementById('error-state').style.display = 'block';
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Start loading
    loadSongData();

    // Automatic app redirect
    (function() {
      const appUrl = 'unitune://open?url=' + encodeURIComponent(MUSIC_URL);
      let appOpened = false;
      let redirectAttempted = false;

      // Detect if user left the page (app opened)
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          appOpened = true;
        }
      });

      // Try to open app automatically after content loads
      function tryOpenApp() {
        if (redirectAttempted) return;
        redirectAttempted = true;

        // Create invisible iframe for app redirect
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);

        // Also try direct navigation
        setTimeout(function() {
          if (!appOpened) {
            window.location.href = appUrl;
          }
        }, 100);

        // Clean up iframe
        setTimeout(function() {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 2000);

        // If app didn't open after 2.5 seconds, update button text
        setTimeout(function() {
          if (!appOpened) {
            const btn = document.querySelector('.get-app-btn');
            if (btn) {
              btn.innerHTML = '<div class="app-logo">' + UNITUNE_LOGO_SVG + '</div><span>Get UniTune App</span>';
              // Update href to app store
              const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
              btn.href = isIOS ? 'https://apps.apple.com/app/unitune' : 'https://play.google.com/store/apps/details?id=de.unitune.unitune';
            }
          }
        }, 2500);
      }

      // Wait for content to load, then try to open app
      const checkContent = setInterval(function() {
        if (document.getElementById('content-state').style.display === 'block') {
          clearInterval(checkContent);
          setTimeout(tryOpenApp, 500); // Small delay for better UX
        }
      }, 100);
    })();
  </script>
</body>
</html>`;

    return addSecurityHeaders(new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }));
}

async function handleShareLink(encodedUrl, request, config) {
    try {
        const musicUrl = encodedUrl;

        log(config, 'info', 'Handling share link', {
            musicUrl: musicUrl.substring(0, 50)
        });

        // Use environment variable for API endpoint (supports staging/production)
        const odesliUrl = `${config.odesliApiEndpoint}?url=${encodeURIComponent(musicUrl)}`;

        log(config, 'debug', 'Calling Odesli API', {
            endpoint: config.odesliApiEndpoint
        });

        // Retry logic with exponential backoff
        const MAX_RETRIES = 3;
        const INITIAL_DELAY = 500; // ms

        let response = null;
        let lastError = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                log(config, 'debug', `API attempt ${attempt}/${MAX_RETRIES}`);

                response = await fetch(odesliUrl, {
                    headers: {
                        'User-Agent': 'UniTune/2.1.0 (https://unitune.art)',
                    },
                });

                log(config, 'info', 'API response received', {
                    status: response.status,
                    statusText: response.statusText,
                    attempt
                });

                if (response.ok) {
                    break;
                }

                // If rate limited (429) or server error (5xx), retry
                if (response.status === 429 || response.status >= 500) {
                    const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
                    log(config, 'warn', 'API error, retrying', {
                        status: response.status,
                        attempt,
                        delayMs: delay
                    });
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    // For 4xx errors (except 429), don't retry
                    log(config, 'error', 'API client error, not retrying', {
                        status: response.status,
                        statusText: response.statusText
                    });
                    break;
                }
            } catch (fetchError) {
                lastError = fetchError;
                log(config, 'error', 'Fetch error', {
                    error: fetchError.message,
                    attempt
                });

                // Network error - retry if attempts remaining
                if (attempt < MAX_RETRIES) {
                    const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        if (!response || !response.ok) {
            log(config, 'error', 'All API attempts failed', {
                finalStatus: response?.status,
                lastError: lastError?.message
            });

            // Generic error message - don't expose API details or status codes
            const errorContent = getErrorPage('Song not found. Please try again.');
            const errorResponse = new Response(errorContent, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                status: 404,
            });

            return addSecurityHeaders(await addCacheHeaders(errorResponse, CACHE_CONFIG.ERROR_PAGES));
        }

        const data = await response.json();

        log(config, 'debug', 'API response parsed', {
            hasEntities: !!data.entitiesByUniqueId,
            hasLinks: !!data.linksByPlatform,
            entityCount: Object.keys(data.entitiesByUniqueId || {}).length,
            linkCount: Object.keys(data.linksByPlatform || {}).length
        });

        // Extract metadata with safe defaults
        const entities = Object.values(data.entitiesByUniqueId || {});
        const firstEntity = entities[0] || {};
        const title = firstEntity.title || 'Unknown Song';
        const artist = firstEntity.artistName || 'Unknown Artist';
        const thumbnail = firstEntity.thumbnailUrl || '';

        log(config, 'info', 'Song metadata extracted', {
            title: title.substring(0, 30),
            artist: artist.substring(0, 30),
            hasThumbnail: !!thumbnail
        });

        const links = data.linksByPlatform || {};

        const html = getLandingPage({
            title,
            artist,
            thumbnail,
            links,
            musicUrl: musicUrl,
            adsensePublisherId: config.adsensePublisherId,
        });

        // Generate ETag for content
        const etag = await generateETag(html);

        // Check if client has cached version
        if (checkETag(request, etag)) {
            log(config, 'debug', 'Returning cached response (304)');
            return addSecurityHeaders(createNotModifiedResponse(etag, CACHE_CONFIG.SHARE_PAGES));
        }

        const htmlResponse = new Response(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        });

        log(config, 'info', 'Share link processed successfully');

        return addSecurityHeaders(await addCacheHeaders(htmlResponse, CACHE_CONFIG.SHARE_PAGES, html));
    } catch (error) {
        log(config, 'error', 'Error in handleShareLink', {
            error: error.message,
            stack: error.stack?.substring(0, 200)
        });

        // Generic error response - no stack traces or sensitive information
        const errorContent = getErrorPage('Unable to load song. Please try again later.');
        const errorResponse = new Response(errorContent, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
            status: 500,
        });

        return addSecurityHeaders(await addCacheHeaders(errorResponse, CACHE_CONFIG.ERROR_PAGES));
    }
}

/**
 * Returns the CSS variables and base styles for the "Clean Dark" Theme
 */
function getCommonStyles() {
    return `
    :root {
        /* UniTune App Theme Colors (from app_theme.dart) */
        --bg-deep: #0D1117;
        --bg-medium: #161B22;
        --bg-card: #21262D;
        --primary: #58A6FF;
        --primary-light: #79C0FF;
        --primary-dark: #1F6FEB;
        --text-primary: #F0F6FC;
        --text-secondary: #8B949E;
        --text-muted: #6E7681;
        
        /* Liquid Glass Variables */
        --glass-base: rgba(255, 255, 255, 0.05);
        --glass-border: rgba(255, 255, 255, 0.1);
        --glass-highlight: rgba(255, 255, 255, 0.15);
        --glass-blur: 12px;
        
        /* Legacy compatibility */
        --card-bg: var(--glass-base);
        --card-border: var(--glass-border);
        --accent-glow: rgba(88, 166, 255, 0.4);
        --btn-hover: rgba(255, 255, 255, 0.1);
        --font-stack: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    
    body {
        font-family: var(--font-stack);
        background-color: var(--bg-deep);
        background-image: radial-gradient(ellipse 150% 80% at 50% -10%, rgba(88, 166, 255, 0.15) 0%, rgba(13, 17, 23, 0.95) 50%, #0D1117 100%);
        min-height: 100vh;
        color: var(--text-primary);
        display: flex;
        flex-direction: column;
        align-items: center;
        background-attachment: fixed;
    }

    ::-webkit-scrollbar { width: 0px; background: transparent; }
    
    /* Liquid Glass Card Base */
    .glass-card {
        background: var(--glass-base);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 0.5px solid var(--glass-border);
        border-radius: 20px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 0 var(--glass-highlight);
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .glass-card:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
    }
    
    .glass-card:active {
        transform: scale(0.98);
    }
    
    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Dynamic Logo Styling */
    .logo-path {
        fill: currentColor;
        stroke-width: 0px;
        transition: fill 0.3s ease;
    }

    .app-logo {
        width: 24px;
        height: 24px;
        color: var(--primary);
        transition: color 0.3s ease;
        flex-shrink: 0;
    }

    .get-app-btn:hover .app-logo {
        color: var(--primary-light);
    }

    .hero-logo {
        width: 80px;
        height: 80px;
        color: var(--primary);
        margin-bottom: 24px;
        filter: drop-shadow(0 10px 30px var(--accent-glow));
        animation: scaleIn 0.6s ease-out;
    }
    `;
}

function getCookieBannerStyles() {
    return `
    /* Privacy Notice */
    #privacy-notice {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px;
        padding-bottom: max(20px, env(safe-area-inset-bottom));
        z-index: 10000;
        display: none;
    }

    #privacy-notice.visible {
        display: block !important;
        animation: slideUpBanner 0.3s ease-out forwards;
    }
    
    @keyframes slideUpBanner {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .notice-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .notice-text {
        color: #E5E7EB;
        font-size: 14px;
        line-height: 1.6;
    }

    .notice-text a {
        color: #4c3bf9;
        text-decoration: none;
    }

    .notice-text a:hover {
        text-decoration: underline;
    }

    .notice-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .action-btn {
        padding: 12px 24px;
        border-radius: 12px;
        border: none;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: var(--font-stack);
    }

    .action-btn-primary {
        background: #4c3bf9;
        color: white;
    }

    .action-btn-primary:hover {
        background: #3d2fd9;
        transform: translateY(-1px);
    }

    .action-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .action-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    .action-btn-tertiary {
        background: transparent;
        color: #9CA3AF;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .action-btn-tertiary:hover {
        background: rgba(255, 255, 255, 0.05);
        color: white;
    }

    @media (min-width: 640px) {
        .notice-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }

        .notice-actions {
            flex-shrink: 0;
        }
    }
    `;
}

function getCookieBannerScript(adsensePublisherId) {
    return `
    <script>
    (function() {
        const COOKIE_NAME = 'unitune_cookie_consent';
        const COOKIE_EXPIRY_DAYS = 365;

        function setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
        }

        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function loadAds() {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}';
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);

            script.onload = function() {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    // Silent fail - no logging for privacy
                }
            };
        }

        function acceptConsent() {
            setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
            const notice = document.getElementById('privacy-notice');
            if (notice) {
                notice.classList.remove('visible');
            }
            loadAds();
        }

        function declineConsent() {
            setCookie(COOKIE_NAME, 'rejected', COOKIE_EXPIRY_DAYS);
            const notice = document.getElementById('privacy-notice');
            if (notice) {
                notice.classList.remove('visible');
            }
        }

        function showMoreInfo() {
            window.location.href = '/privacy';
        }

        function init() {
            const consent = getCookie(COOKIE_NAME);
            
            if (consent === 'accepted') {
                loadAds();
            } else if (consent !== 'rejected') {
                // Show notice for new users
                const notice = document.getElementById('privacy-notice');
                if (notice) {
                    notice.classList.add('visible');
                }
            }

            // Attach event listeners
            const acceptBtn = document.getElementById('notice-accept');
            const declineBtn = document.getElementById('notice-decline');
            const moreBtn = document.getElementById('notice-more');
            
            if (acceptBtn) acceptBtn.addEventListener('click', acceptConsent);
            if (declineBtn) declineBtn.addEventListener('click', declineConsent);
            if (moreBtn) moreBtn.addEventListener('click', showMoreInfo);
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();
    </script>
    `;
}

function getCookieBannerHTML() {
    return `
    <div id="privacy-notice">
        <div class="notice-content">
            <div class="notice-text">
                We use technologies to improve your experience and show relevant content. 
                By clicking "Accept", you consent to our use. 
                <a href="/privacy">Learn more</a>
            </div>
            <div class="notice-actions">
                <button id="notice-accept" class="action-btn action-btn-primary">Accept</button>
                <button id="notice-decline" class="action-btn action-btn-secondary">Decline</button>
                <button id="notice-more" class="action-btn action-btn-tertiary">More Info</button>
            </div>
        </div>
    </div>
    `;
}

function getLandingPage({ title, artist, thumbnail, links, musicUrl, adsensePublisherId }) {
    const encodedMusicUrl = encodeURIComponent(musicUrl);

    // Escape user-provided data to prevent XSS attacks
    const escapedTitle = escapeHtml(title);
    const escapedArtist = escapeHtml(artist);

    // Validate and sanitize thumbnail URL
    // Only use thumbnail if it's from a trusted HTTPS source
    const validatedThumbnail = isValidThumbnailUrl(thumbnail) ? escapeHtml(thumbnail) : '';
    const escapedThumbnail = validatedThumbnail;

    // UniTune Logo SVG
    const unituneLogoSvg = `
      <svg viewBox="0 0 842.13 985.84" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <path class="logo-path" d="M27.4,66.27c47.21-1.28,89.07,6.86,126.48,38.09,66.15,55.21,60.95,144.27,61.18,221.93l.08,181.23c-.06,37.69-.86,74.85,1.61,112.49,6.97,106.45,93.55,175.65,199.23,165.87,42.47-3.55,83.05-19.14,116.97-44.95,92.36-69.31,92.93-166.31,91.37-269.59-.81-53.71-.31-108.8-.54-162.62.54-8.04-1.42-37.8,5.3-42.69,16.26-11.84,61.03,23.88,70.98,33.39,40.76,38.96,42.64,101.83,43.46,154.32.27,25.33.36,50.67.3,76-.11,28.44.91,59.71-.19,87.72-3.47,84.27-23.66,162.29-76.5,229.62-127.43,162.4-369.95,181.63-532.07,60.97C60.91,852.85,16.04,761.04,3.14,670.93c-4.6-32.15-2.79-71.35-2.76-104.35l.03-154.11.05-198.05c-.06-37.93-.93-76.13.76-114,.82-18.45,6-31.92,26.19-34.14Z"/>
        <path class="logo-path" d="M548.39.27c32.61-1.76,32.41,4.66,45.8,30.51,13.33,25.75,39.38,45.82,63.55,61.14,59.59,38.01,123.95,60.45,161.72,125.48,35.17,60.55,31.75,164.75-26.84,211.97-1.84,1.48-4.59.74-6.61.17-2.7-2.29-5.04-5.81-5.16-9.34-1.14-34.32-4.14-64.88-16.53-97.5-17.4-45.81-55.32-75.56-99.64-93.86-20.16-8.32-45.76-16.27-67.19-7.41l-1.19.51c-3.33,4.16-8.05,10.61-8.7,15.95-3.52,28.74-2.76,61.05-2.78,89.91l.27,153.28c-.02,33.57,1.23,59.36-1.59,93.15-11.16,83.39-58.86,146.18-141.48,168.21-126.33,33.67-234.19-80.57-162.98-199.56,36.36-60.76,103.18-96.85,173.8-90.85,17.49,1.38,59.93,24.05,67.19-4.54,3.74-26.18,2.01-61.22,1.97-88.52l-.05-205.92c-.01-37.68-.88-75.74.72-113.35.98-23.07,1.95-33.98,25.72-39.44Z"/>
      </svg>
    `;

    let serviceButtons = '';
    for (const [key, service] of Object.entries(SERVICES)) {
        const link = links[key]?.url;
        if (link) {
            serviceButtons += `
            <a href="${link}" class="service-row">
                <div class="service-left">
                    <div class="service-icon">
                        <img src="${service.logo}" alt="${service.name}" width="24" height="24" loading="lazy">
                    </div>
                    <span class="service-name">${service.name}</span>
                </div>
                <div class="service-action">Play</div>
            </a>
            `;
        }
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="google-adsense-account" content="${adsensePublisherId}">
  <title>${escapedTitle} - ${escapedArtist}</title>
  
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedArtist}">
  <meta property="og:image" content="${escapedThumbnail}">
  <meta property="og:url" content="https://unitune.art/s/${encodedMusicUrl}">
  <meta property="og:type" content="music.song">
  <meta property="og:site_name" content="UniTune">
  <meta name="theme-color" content="#0D1117">
  <meta name="apple-itunes-app" content="app-id=YOUR_APP_ID, app-argument=unitune://open?url=${encodedMusicUrl}">
  
  <style>
    ${getCommonStyles()}
    ${getCookieBannerStyles()}

    .main-wrapper {
        width: 100%;
        max-width: min(480px, 100vw - 32px);
        padding: clamp(16px, 4vw, 24px);
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
    }

    /* Hero Section with Album Art */
    .hero {
        margin-top: 20px;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
        animation: fadeIn 0.6s ease-out;
    }

    /* Get UniTune App Button */
    .get-app-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 16px 24px;
        margin-bottom: 24px;
        text-decoration: none;
        color: var(--text-primary);
        font-size: 16px;
        font-weight: 600;
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.2), rgba(88, 166, 255, 0.1));
        border: 1px solid rgba(88, 166, 255, 0.3);
        animation: scaleIn 0.5s ease-out;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .get-app-btn:hover {
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.3), rgba(88, 166, 255, 0.15));
        box-shadow: 0 0 30px var(--accent-glow);
        transform: translateY(-2px);
    }
    
    .get-app-btn:active {
        transform: scale(0.98);
    }
    
    .app-icon {
        font-size: 20px;
    }

    .album-art-container {
        position: relative;
        width: clamp(180px, 50vw, 240px);
        height: clamp(180px, 50vw, 240px);
        margin-bottom: clamp(24px, 5vw, 32px);
    }

    .album-art {
        width: 100%;
        height: 100%;
        border-radius: 24px;
        object-fit: cover;
        position: relative;
        z-index: 2;
        box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
    }

    /* The glowing effect behind the album art */
    .album-glow {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        background-image: url('${thumbnail}');
        background-size: cover;
        filter: blur(50px) saturate(200%) brightness(1.2);
        opacity: 0.6;
        z-index: 1;
        border-radius: 50%;
        animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
    }

    .song-info {
        width: 100%;
        padding: 0 10px;
    }

    .song-title {
        font-size: 32px;
        font-weight: 800;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
        line-height: 1.1;
        background: linear-gradient(to right, #fff, #e0e0e0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .artist-name {
        font-size: 18px;
        font-weight: 500;
        color: var(--text-secondary);
        letter-spacing: -0.2px;
    }

    /* Ad Container */
    .ad-container {
        width: 100%;
        padding: 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        margin-top: 16px;
        margin-bottom: 24px;
        text-align: center;
    }

    .ad-label {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.3);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        font-weight: 600;
    }

    .adsbygoogle {
        background: transparent !important;
        min-height: 50px;
        max-height: 100px;
        display: block;
        border-radius: 8px;
        overflow: hidden;
    }
    
    @media (min-width: 640px) {
        .adsbygoogle {
            min-height: 90px;
            max-height: 120px;
        }
    }
    
    /* Open in App Button */
    .open-app-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 16px 24px;
        margin-bottom: 24px;
        text-decoration: none;
        color: var(--text-primary);
        font-size: 16px;
        font-weight: 600;
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.2), rgba(88, 166, 255, 0.1));
        border-color: rgba(88, 166, 255, 0.3);
        animation: scaleIn 0.5s ease-out;
    }
    
    .open-app-btn:hover {
        background: linear-gradient(135deg, rgba(88, 166, 255, 0.3), rgba(88, 166, 255, 0.15));
        box-shadow: 0 0 30px rgba(88, 166, 255, 0.3);
    }
    
    .app-icon {
        font-size: 20px;
    }

    /* List Container */
    .links-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-bottom: 20px;
    }

    .service-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 14px 18px;
        border-radius: 16px;
        
        /* Liquid Glass Effect */
        background: var(--glass-base);
        border: 0.5px solid var(--glass-border);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 0 var(--glass-highlight);
        
        text-decoration: none;
        color: white;
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .service-row:nth-child(1) { animation: slideUp 0.4s ease-out 0.1s backwards; }
    .service-row:nth-child(2) { animation: slideUp 0.4s ease-out 0.15s backwards; }
    .service-row:nth-child(3) { animation: slideUp 0.4s ease-out 0.2s backwards; }
    .service-row:nth-child(4) { animation: slideUp 0.4s ease-out 0.25s backwards; }
    .service-row:nth-child(5) { animation: slideUp 0.4s ease-out 0.3s backwards; }
    .service-row:nth-child(6) { animation: slideUp 0.4s ease-out 0.35s backwards; }


    .service-row:hover {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                    0 0 20px var(--accent-glow);
        border-color: var(--primary);
    }

    .service-row:active {
        transform: scale(0.98);
        background: rgba(255,255,255,0.06);
    }

    .service-left {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .service-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .service-icon img,
    .service-icon svg {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 6px;
    }

    .service-name {
        font-size: 17px;
        font-weight: 600;
        letter-spacing: -0.3px;
    }

    .service-action {
        font-size: 13px;
        font-weight: 600;
        color: rgba(255,255,255,0.6);
        background: rgba(255,255,255,0.1);
        padding: 6px 14px;
        border-radius: 100px;
        transition: background 0.2s;
    }
    
    .service-row:hover .service-action {
        background: rgba(255,255,255,0.2);
        color: white;
    }

    /* Footer */
    .footer {
        margin-top: auto;
        padding-top: 20px;
        text-align: center;
        font-size: 13px;
        color: rgba(255,255,255,0.3);
        display: flex;
        gap: 15px;
        justify-content: center;
    }

    .footer a {
        color: inherit;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }

    .footer a:hover {
        color: rgba(255,255,255,0.6);
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="main-wrapper">
    <div class="hero">
        <div class="album-art-container">
            <div class="album-glow"></div>
            ${thumbnail ? `<img src="${escapedThumbnail}" alt="Album Art" class="album-art" crossorigin="anonymous" id="album-art-img">` : ''}
        </div>
        <div class="song-info">
            <h1 class="song-title">${escapedTitle}</h1>
            <p class="artist-name">${escapedArtist}</p>
        </div>
    </div>
    <a href="unitune://open?url=${encodedMusicUrl}&title=${encodeURIComponent(escapedTitle)}&artist=${encodeURIComponent(escapedArtist)}&source=web" id="open-app-btn" class="get-app-btn glass-card">
        <div class="app-logo">${unituneLogoSvg}</div>
        <span>Open in UniTune</span>
    </a>
    
    <div class="links-container">
        ${serviceButtons}
    </div>
    
    <!-- Google AdSense (GDPR-compliant, loaded only with consent) -->
    <div class="ad-container" id="ad-container-bottom">
        <div class="ad-label">Advertisement</div>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${adsensePublisherId}"
             data-ad-slot="1801419133"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
    </div>
    
    <div class="footer">
        <a href="/">UniTune</a>
        <span>•</span>
        <a href="/privacy">Privacy</a>
    </div>
  </div>
  
  ${getCookieBannerHTML()}
  
  ${getCookieBannerScript(adsensePublisherId)}
  
  <script>
    (function() {
        const appUrl = 'unitune://open?url=${encodedMusicUrl}&title=${encodeURIComponent(escapedTitle)}&artist=${encodeURIComponent(escapedArtist)}&source=web';
        const appStoreUrl = 'https://apps.apple.com/app/unitune'; // TODO: Update with real App Store ID
        const playStoreUrl = 'https://play.google.com/store/apps/details?id=de.unitune.unitune';
        
        let appOpened = false;
        let hiddenTime = null;
        
        // Detect if user left the page (app opened)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                hiddenTime = Date.now();
                appOpened = true;
            }
        });
        
        // Try to open app automatically
        function tryOpenApp() {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = appUrl;
            document.body.appendChild(iframe);
            
            // Also try direct navigation after short delay
            setTimeout(function() {
                if (!appOpened) {
                    window.location.href = appUrl;
                }
            }, 100);
            
            // Check if app opened after timeout
            setTimeout(function() {
                if (iframe.parentNode) {
                    document.body.removeChild(iframe);
                }
                if (!appOpened) {
                    // App not installed - show the "Open in App" button as download
                    const openAppBtn = document.getElementById('open-app-btn');
                    if (openAppBtn) {
                        openAppBtn.innerHTML = '<div class="app-logo">${unituneLogoSvg.replace(/'/g, "\\'")}</div><span>Get UniTune App</span>';
                        openAppBtn.href = /iPhone|iPad|iPod/.test(navigator.userAgent) ? appStoreUrl : playStoreUrl;
                    }
                }
            }, 2000);
        }
        
        // Try opening app on page load
        setTimeout(tryOpenApp, 500);

        // Color extraction for dynamic theming
        const img = document.getElementById('album-art-img');
        if (img && img.complete) {
            extractColors();
        } else if (img) {
            img.addEventListener('load', extractColors);
        }

        function extractColors() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = document.getElementById('album-art-img');
                
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                
                const colorMap = {};
                const sampleRate = 10;
                
                for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const a = pixels[i + 3];
                    
                    if (a < 125 || (r + g + b) < 50 || (r + g + b) > 700) continue;
                    
                    const qr = Math.round(r / 10) * 10;
                    const qg = Math.round(g / 10) * 10;
                    const qb = Math.round(b / 10) * 10;
                    const key = qr + ',' + qg + ',' + qb;
                    
                    colorMap[key] = (colorMap[key] || 0) + 1;
                }
                
                let dominantColor = null;
                let maxCount = 0;
                
                for (const color in colorMap) {
                    if (colorMap[color] > maxCount) {
                        maxCount = colorMap[color];
                        dominantColor = color;
                    }
                }
                
                if (dominantColor) {
                    const parts = dominantColor.split(',');
                    const r = parseInt(parts[0]);
                    const g = parseInt(parts[1]);
                    const b = parseInt(parts[2]);
                    
                    const root = document.documentElement;
                    root.style.setProperty('--primary', 'rgb(' + r + ', ' + g + ', ' + b + ')');
                    root.style.setProperty('--primary-light', 'rgb(' + Math.min(r + 30, 255) + ', ' + Math.min(g + 30, 255) + ', ' + Math.min(b + 30, 255) + ')');
                    root.style.setProperty('--primary-dark', 'rgb(' + Math.max(r - 30, 0) + ', ' + Math.max(g - 30, 0) + ', ' + Math.max(b - 30, 0) + ')');
                    root.style.setProperty('--accent-glow', 'rgba(' + r + ', ' + g + ', ' + b + ', 0.4)');
                    
                    document.body.style.backgroundImage = 'radial-gradient(ellipse 150% 80% at 50% -10%, rgba(' + r + ', ' + g + ', ' + b + ', 0.15) 0%, rgba(13, 17, 23, 0.95) 50%, #0D1117 100%)';
                }
            } catch (e) {
                console.error('Color extraction failed:', e);
            }
        }
    })();
  </script>
</body>
</html>`;
}

function getHomePage(adsensePublisherId) {
    // UniTune Logo SVG
    const unituneLogoSvg = `
      <svg viewBox="0 0 842.13 985.84" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <path class="logo-path" d="M27.4,66.27c47.21-1.28,89.07,6.86,126.48,38.09,66.15,55.21,60.95,144.27,61.18,221.93l.08,181.23c-.06,37.69-.86,74.85,1.61,112.49,6.97,106.45,93.55,175.65,199.23,165.87,42.47-3.55,83.05-19.14,116.97-44.95,92.36-69.31,92.93-166.31,91.37-269.59-.81-53.71-.31-108.8-.54-162.62.54-8.04-1.42-37.8,5.3-42.69,16.26-11.84,61.03,23.88,70.98,33.39,40.76,38.96,42.64,101.83,43.46,154.32.27,25.33.36,50.67.3,76-.11,28.44.91,59.71-.19,87.72-3.47,84.27-23.66,162.29-76.5,229.62-127.43,162.4-369.95,181.63-532.07,60.97C60.91,852.85,16.04,761.04,3.14,670.93c-4.6-32.15-2.79-71.35-2.76-104.35l.03-154.11.05-198.05c-.06-37.93-.93-76.13.76-114,.82-18.45,6-31.92,26.19-34.14Z"/>
        <path class="logo-path" d="M548.39.27c32.61-1.76,32.41,4.66,45.8,30.51,13.33,25.75,39.38,45.82,63.55,61.14,59.59,38.01,123.95,60.45,161.72,125.48,35.17,60.55,31.75,164.75-26.84,211.97-1.84,1.48-4.59.74-6.61.17-2.7-2.29-5.04-5.81-5.16-9.34-1.14-34.32-4.14-64.88-16.53-97.5-17.4-45.81-55.32-75.56-99.64-93.86-20.16-8.32-45.76-16.27-67.19-7.41l-1.19.51c-3.33,4.16-8.05,10.61-8.7,15.95-3.52,28.74-2.76,61.05-2.78,89.91l.27,153.28c-.02,33.57,1.23,59.36-1.59,93.15-11.16,83.39-58.86,146.18-141.48,168.21-126.33,33.67-234.19-80.57-162.98-199.56,36.36-60.76,103.18-96.85,173.8-90.85,17.49,1.38,59.93,24.05,67.19-4.54,3.74-26.18,2.01-61.22,1.97-88.52l-.05-205.92c-.01-37.68-.88-75.74.72-113.35.98-23.07,1.95-33.98,25.72-39.44Z"/>
      </svg>
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="google-adsense-account" content="${adsensePublisherId}">
  <title>UniTune</title>
  <style>
    ${getCommonStyles()}
    ${getCookieBannerStyles()}
    
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        padding: 30px;
    }
    
    .logo-area {
        margin-bottom: 40px;
        position: relative;
    }
    
    h1 {
        font-size: 48px;
        font-weight: 800;
        letter-spacing: -1.5px;
        margin-bottom: 16px;
        background: linear-gradient(to bottom, #fff, #aaa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    p.subtitle {
        font-size: 19px;
        color: var(--text-secondary);
        max-width: 320px;
        line-height: 1.5;
        margin-bottom: 40px;
    }
    
    .feature-pill {
        display: inline-flex;
        align-items: center;
        padding: 10px 18px;
        background: var(--glass-base);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-radius: 100px;
        font-size: 14px;
        font-weight: 500;
        margin: 5px;
        color: var(--text-primary);
        border: 0.5px solid var(--glass-border);
        animation: fadeIn 0.5s ease-out backwards;
    }
    
    .feature-pill:nth-child(1) { animation-delay: 0.2s; }
    .feature-pill:nth-child(2) { animation-delay: 0.3s; }
    .feature-pill:nth-child(3) { animation-delay: 0.4s; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-area">
        <div class="hero-logo">${unituneLogoSvg}</div>
    </div>
    <h1>UniTune</h1>
    <p class="subtitle">Share music universally. No tracking, just music.</p>
    
    <div>
        <div class="feature-pill">Spotify</div>
        <div class="feature-pill">Apple Music</div>
        <div class="feature-pill">YouTube</div>
    </div>
  </div>
  
  ${getCookieBannerHTML()}
  ${getCookieBannerScript(adsensePublisherId)}
</body>
</html>`;
}

function getErrorPage(message) {
    // Escape error message to prevent XSS
    const escapedMessage = escapeHtml(message);

    return `<!DOCTYPE html>
<html>
<head>
    <title>Error - UniTune</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0D1117">
    <style>
        ${getCommonStyles()}
        body { 
            justify-content: center; 
            text-align: center; 
            padding: 40px;
            min-height: 100vh;
        }
        .error-container {
            max-width: 400px;
            padding: 40px;
            animation: scaleIn 0.5s ease-out;
        }
        .error-icon {
            font-size: 64px;
            margin-bottom: 24px;
            animation: fadeIn 0.5s ease-out;
        }
        h1 { 
            font-size: 24px; 
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--text-primary);
        }
        p { 
            color: var(--text-secondary);
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.2s;
        }
        .back-link:hover {
            opacity: 0.8;
        }
    </style>
</head>
<body>
  <div class="error-container glass-card">
    <h1>Something went wrong</h1>
    <p>${escapedMessage}</p>
    <a href="/" class="back-link">← Back to Home</a>
  </div>
</body>
</html>`;
}

function getPrivacyPolicy() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - UniTune</title>
  <style>
    ${getCommonStyles()}
    .content { max-width: 700px; padding: 40px 24px; width: 100%; align-self: center; }
    h1 { font-size: 32px; margin-bottom: 16px; letter-spacing: -0.5px; }
    h2 { font-size: 20px; color: white; margin-top: 40px; margin-bottom: 16px; }
    h3 { font-size: 16px; color: white; margin-top: 24px; margin-bottom: 12px; }
    p, li { color: #A0AEC0; line-height: 1.6; font-size: 16px; margin-bottom: 12px; }
    ul { padding-left: 20px; margin-bottom: 20px; }
    a { color: #4c3bf9; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .last-updated { color: #6B7280; font-size: 14px; margin-bottom: 32px; }
    .section { margin-bottom: 32px; }
  </style>
</head>
<body>
  <div class="content">
    <h1>Privacy Policy</h1>
    <p class="last-updated">Last Updated: February 2, 2026</p>
    
    <div class="section">
      <p>UniTune is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information in compliance with the General Data Protection Regulation (GDPR) and other applicable privacy laws.</p>
    </div>

    <div class="section">
      <h2>1. Data Controller</h2>
      <p>The data controller responsible for your personal data is:</p>
      <p><strong>UniTune</strong><br>
      Website: unitune.art<br>
      Contact: victor.boiting@gmail.com</p>
    </div>

    <div class="section">
      <h2>2. Data We Collect</h2>
      
      <h3>2.1 Data We DO NOT Collect</h3>
      <p>We believe in privacy by design. UniTune does NOT collect or store:</p>
      <ul>
        <li>Personal identification information (name, email, phone number)</li>
        <li>IP addresses</li>
        <li>Device identifiers or fingerprints</li>
        <li>Listening history or music preferences</li>
        <li>Location data</li>
        <li>Cookies for tracking purposes</li>
      </ul>

      <h3>2.2 Technical Data</h3>
      <p>Our service processes the following data temporarily without storage:</p>
      <ul>
        <li><strong>Music URLs:</strong> When you share a music link, we temporarily process it through our UniTune API (hosted by Uberspace in Düsseldorf, Germany) to generate universal links. This data is not stored and is not logged on our servers.</li>
        <li><strong>Song Metadata Caching:</strong> To improve performance and reduce server load, we temporarily cache public song information (titles, artists, cover images) for up to 24 hours. This cached data contains no personal information and is shared across all users requesting the same song.</li>
        <li><strong>No Server Logging:</strong> UniTune does not log any request data, URLs, or user interactions on our servers. We have removed all server-side logging for maximum privacy.</li>
        <li><strong>Cloudflare:</strong> Our hosting provider Cloudflare may temporarily process requests for security purposes. These are automatically deleted.</li>
      </ul>
    </div>

    <div class="section">
      <h2>3. Advertising</h2>
      <p>We display advertisements through Google AdSense to support our service.</p>
      
      <h3>3.1 Google AdSense</h3>
      <p>Google AdSense may use cookies and similar technologies to:</p>
      <ul>
        <li>Display relevant advertisements</li>
        <li>Measure ad performance</li>
        <li>Prevent fraud</li>
      </ul>
      
      <h3>3.2 Your Advertising Choices</h3>
      <p>You have control over personalized advertising:</p>
      <ul>
        <li><strong>Opt-out of personalized ads:</strong> Visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ad Settings</a></li>
        <li><strong>Learn more:</strong> <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google Advertising Policies</a></li>
        <li><strong>European users:</strong> You can manage consent through the consent banner displayed on first visit</li>
      </ul>
    </div>

    <div class="section">
      <h2>4. Third-Party Services</h2>
      
      <h3>4.1 UniTune API</h3>
      <p>We operate our own music link conversion API, hosted by Uberspace in Düsseldorf, Germany (EU). When you use our service:</p>
      <ul>
        <li>The music URL is processed by our API servers in the EU</li>
        <li>No personal data is collected or stored</li>
        <li>No IP addresses are logged</li>
        <li>Data is processed in compliance with GDPR</li>
      </ul>

      <h3>4.2 Music Streaming Services</h3>
      <p>When you click on a music service link (Spotify, Apple Music, etc.), you are redirected to that service. Their respective privacy policies apply:</p>
      <ul>
        <li><a href="https://www.spotify.com/privacy" target="_blank" rel="noopener">Spotify Privacy Policy</a></li>
        <li><a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener">Apple Privacy Policy</a></li>
        <li><a href="https://tidal.com/privacy" target="_blank" rel="noopener">TIDAL Privacy Policy</a></li>
        <li><a href="https://www.youtube.com/privacy" target="_blank" rel="noopener">YouTube Privacy Policy</a></li>
        <li><a href="https://www.deezer.com/legal/personal-datas" target="_blank" rel="noopener">Deezer Privacy Policy</a></li>
        <li><a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496" target="_blank" rel="noopener">Amazon Privacy Policy</a></li>
      </ul>

      <h3>4.3 Cloudflare</h3>
      <p>Our service is hosted on Cloudflare Workers. Cloudflare may process technical data for security and performance. Learn more: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare Privacy Policy</a></p>
    </div>

    <div class="section">
      <h2>5. Your Rights Under GDPR</h2>
      <p>As a user in the European Economic Area (EEA), you have the following rights:</p>
      <ul>
        <li><strong>Right to Access:</strong> Request information about data we process (we process none)</li>
        <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
        <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
        <li><strong>Right to Restriction:</strong> Request limitation of data processing</li>
        <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
        <li><strong>Right to Object:</strong> Object to data processing, including for advertising</li>
        <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
        <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
      </ul>
      <p>Since we do not collect or store personal data, most of these rights are automatically fulfilled. For advertising-related requests, please use Google's opt-out tools.</p>
    </div>

    <div class="section">
      <h2>6. Legal Basis for Processing</h2>
      <p>Under GDPR, we process data based on:</p>
      <ul>
        <li><strong>Legitimate Interest (Art. 6(1)(f) GDPR):</strong> To provide and improve our service</li>
        <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> For personalized advertising (where applicable)</li>
      </ul>
    </div>

    <div class="section">
      <h2>7. Data Retention</h2>
      <p>We do not retain personal data. Technical logs are automatically deleted after 24 hours.</p>
    </div>

    <div class="section">
      <h2>8. International Data Transfers</h2>
      <p>Our service uses Cloudflare's global network. Data may be processed in countries outside the EEA. Cloudflare complies with GDPR through Standard Contractual Clauses (SCCs).</p>
    </div>

    <div class="section">
      <h2>9. Children's Privacy</h2>
      <p>Our service is not directed to children under 16. We do not knowingly collect data from children.</p>
    </div>

    <div class="section">
      <h2>10. Changes to This Policy</h2>
      <p>We may update this Privacy Policy. Changes will be posted on this page with an updated "Last Updated" date.</p>
    </div>

    <div class="section">
      <h2>11. Contact Us</h2>
      <p>For privacy-related questions or to exercise your rights, contact us at:</p>
      <p><strong>Email:</strong> victor.boiting@gmail.com<br>
      <strong>Website:</strong> <a href="https://unitune.art">unitune.art</a></p>
    </div>

    <div class="section">
      <h2>12. Data Protection Authority</h2>
      <p>If you are in the EEA and have concerns about our data practices, you can contact your local data protection authority. Find your authority: <a href="https://edpb.europa.eu/about-edpb/board/members_en" target="_blank" rel="noopener">EDPB Member List</a></p>
    </div>
    
    <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
        <a href="/">&larr; Back to Home</a>
    </div>
  </div>
</body>
</html>`;
}

function getAppPrivacyPolicy() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Privacy Policy - UniTune</title>
  <style>
    ${getCommonStyles()}
    .content { max-width: 700px; padding: 40px 24px; width: 100%; align-self: center; }
    h1 { font-size: 32px; margin-bottom: 16px; letter-spacing: -0.5px; }
    h2 { font-size: 20px; color: white; margin-top: 40px; margin-bottom: 16px; }
    h3 { font-size: 16px; color: white; margin-top: 24px; margin-bottom: 12px; }
    p, li { color: #A0AEC0; line-height: 1.6; font-size: 16px; margin-bottom: 12px; }
    ul { padding-left: 20px; margin-bottom: 20px; }
    a { color: #4c3bf9; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .last-updated { color: #6B7280; font-size: 14px; margin-bottom: 32px; }
    .section { margin-bottom: 32px; }
    .highlight { background: rgba(76, 59, 249, 0.1); border-left: 3px solid #4c3bf9; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="content">
    <h1>UniTune App Privacy Policy</h1>
    <p class="last-updated">Last Updated: February 2, 2026</p>
    
    <div class="highlight">
      <strong>Privacy by Design:</strong> UniTune does not collect, store, or transmit any personal data. The app works entirely on your device.
    </div>

    <div class="section">
      <h2>1. What Data We Collect</h2>
      <p><strong>None.</strong> UniTune is designed with privacy as a core principle:</p>
      <ul>
        <li>No user accounts required</li>
        <li>No personal information collected</li>
        <li>No analytics or tracking</li>
        <li>No advertising in the app</li>
        <li>No data sent to our servers</li>
      </ul>
    </div>

    <div class="section">
      <h2>2. How the App Works</h2>
      <p>When you share a music link through UniTune:</p>
      <ul>
        <li>The link is processed locally or via our privacy-respecting API</li>
        <li>No personal data is attached to the request</li>
        <li>Your music preferences are never stored or analyzed</li>
        <li>Share history is stored <strong>only on your device</strong></li>
      </ul>
    </div>

    <div class="section">
      <h2>3. Permissions Used</h2>
      <h3>Android</h3>
      <ul>
        <li><strong>Internet:</strong> To convert music links between platforms</li>
        <li><strong>Receive Share Intent:</strong> To receive music links from other apps</li>
      </ul>
      <h3>iOS</h3>
      <ul>
        <li><strong>Network Access:</strong> To convert music links between platforms</li>
        <li><strong>Share Extension:</strong> To receive music links from other apps</li>
      </ul>
    </div>

    <div class="section">
      <h2>4. Third-Party Services</h2>
      <p>UniTune uses the following external services:</p>
      <ul>
        <li><strong>UniTune API:</strong> Converts music links between platforms. Only the music URL is sent - no personal data.</li>
        <li><strong>Music Streaming Services:</strong> When you open a link, you're redirected to the respective service (Spotify, Apple Music, etc.)</li>
      </ul>
    </div>

    <div class="section">
      <h2>5. Data Storage</h2>
      <ul>
        <li><strong>On-Device Only:</strong> Your share history and preferences are stored locally on your device</li>
        <li><strong>No Cloud Sync:</strong> Your data is not uploaded anywhere</li>
        <li><strong>Easy Deletion:</strong> Uninstalling the app removes all data</li>
      </ul>
    </div>

    <div class="section">
      <h2>6. Children's Privacy</h2>
      <p>Our app does not collect any personal information from anyone, including children under 13.</p>
    </div>

    <div class="section">
      <h2>7. Your Rights</h2>
      <p>Since we don't collect personal data, GDPR rights (access, deletion, portability) are automatically fulfilled. Your data stays with you.</p>
    </div>

    <div class="section">
      <h2>8. Contact</h2>
      <p>Questions about this policy? Contact us at:<br>
      <strong>Email:</strong> privacy@unitune.art<br>
      <strong>Website:</strong> <a href="https://unitune.art">unitune.art</a></p>
    </div>
    
    <div style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
        <a href="/">&larr; Back to Home</a>
        <span style="margin: 0 10px; color: rgba(255,255,255,0.3);">•</span>
        <a href="/privacy">Website Privacy Policy</a>
    </div>
  </div>
</body>
</html>`;
}

function getAssetLinks() {
    return JSON.stringify([
        {
            "relation": ["delegate_permission/common.handle_all_urls"],
            "target": {
                "namespace": "android_app",
                "package_name": "de.unitune.unitune",
                "sha256_cert_fingerprints": [
                    "C7:90:95:58:38:47:AE:48:50:03:87:47:A8:CE:54:8E:91:40:35:8B:C5:A0:51:A3:64:E0:8B:56:E2:B8:A8:86"
                ]
            }
        }
    ], null, 2);
}

function getAppleAppSiteAssociation() {
    // TODO: Replace TEAM_ID with your actual Apple Developer Team ID before iOS release
    // You can find your Team ID at: https://developer.apple.com/account -> Membership
    return JSON.stringify({
        "applinks": {
            "apps": [],
            "details": [
                {
                    "appID": "TEAM_ID.de.unitune.unitune",
                    "paths": ["/s/*", "/"]
                }
            ]
        },
        "webcredentials": {
            "apps": ["TEAM_ID.de.unitune.unitune"]
        }
    }, null, 2);
}