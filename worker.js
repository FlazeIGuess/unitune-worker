/**
 * UniTune Cloudflare Worker - Privacy Optimized
 * Version: 2.0.0 (Refactored)
 * Last Updated: 2026-02-09
 * 
 * Privacy Features:
 * - No server-side logging of requests or user data
 * - No console.log statements for maximum privacy
 * - GDPR-compliant cookie consent
 * 
 * Environment Variables (configured in wrangler.toml):
 * - ADSENSE_PUBLISHER_ID: Google AdSense publisher ID
 * - UNITUNE_API_ENDPOINT: UniTune API endpoint URL
 * - WORKER_VERSION: Worker version for debugging
 * - ENVIRONMENT: Environment name (development, staging, production)
 */

import { getConfig } from './config/environment.js';
import { log } from './utils/logger.js';
import { RateLimiter, getClientIp, createRateLimitResponse } from './security/rate_limiter.js';
import { addSecurityHeaders } from './security/headers.js';
import { addCacheHeaders, CACHE_CONFIG } from './security/cache_headers.js';
import { getErrorPage } from './templates/error_page.js';
import { handleShareLink } from './handlers/share_link_handler.js';
import { handlePlaylistLink } from './handlers/playlist_link_handler.js';
import { handleApiProxy } from './handlers/api_proxy_handler.js';
import { handleDonationsAPI } from './handlers/donations_api_handler.js';
import { handleKofiWebhook } from './handlers/kofi_webhook_handler.js';
import { handleVersion } from './handlers/version_handler.js';
import {
    handleHealth,
    handlePrivacy,
    handleAppPrivacy,
    handleAdsTxt,
    handleAppAdsTxt,
    handleAssetLinks,
    handleAppleAppSiteAssociation,
    handleHomepage,
    handleOptionsRequest,
    handleAbout,
    handleContact,
    handleFaq,
    handleHowItWorks,
    handleFeatures
} from './handlers/static_handler.js';

// Initialize rate limiter
const rateLimiter = new RateLimiter();

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
                return handleHealth();
            }

            // Privacy policy (no rate limiting)
            if (url.pathname === '/privacy') {
                return handlePrivacy(request);
            }

            // App-specific privacy policy (no rate limiting)
            if (url.pathname === '/privacy-app') {
                return handleAppPrivacy(request);
            }

            // ads.txt for Google AdSense (no rate limiting)
            if (url.pathname === '/ads.txt') {
                return handleAdsTxt(request, config);
            }

            // app-ads.txt for Google AdMob (no rate limiting)
            if (url.pathname === '/app-ads.txt') {
                return handleAppAdsTxt(request, config);
            }

            // Android App Links verification (no rate limiting)
            if (url.pathname === '/.well-known/assetlinks.json') {
                return handleAssetLinks(request);
            }

            // iOS Universal Links verification (no rate limiting)
            if (url.pathname === '/.well-known/apple-app-site-association') {
                return handleAppleAppSiteAssociation(request);
            }

            // Content pages (no rate limiting)
            if (url.pathname === '/about') {
                return handleAbout(request, config);
            }

            if (url.pathname === '/contact') {
                return handleContact(request, config);
            }

            if (url.pathname === '/faq') {
                return handleFaq(request, config);
            }

            if (url.pathname === '/how-it-works') {
                return handleHowItWorks(request, config);
            }

            if (url.pathname === '/features') {
                return handleFeatures(request, config);
            }

            // Apply rate limiting to share links (/s/*) and homepage
            if (url.pathname.startsWith('/s/') || url.pathname.startsWith('/p/') || url.pathname === '/') {
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
                return handleApiProxy(url, config);
            }

            // Donations API
            if (url.pathname === '/api/donations') {
                return handleDonationsAPI(config, env);
            }

            // Ko-fi Webhook
            if (url.pathname === '/api/kofi-webhook') {
                return handleKofiWebhook(request, config, env);
            }

            // App version info — no user data processed
            if (url.pathname === '/api/version') {
                return handleVersion(request);
            }

            // Handle OPTIONS requests for CORS preflight
            if (request.method === 'OPTIONS') {
                return handleOptionsRequest();
            }

            // Handle share links: /s/{encodedUrl}
            if (url.pathname.startsWith('/s/')) {
                return handleShareLink(url.pathname, request, config, env);
            }

            if (url.pathname.startsWith('/p/')) {
                return handlePlaylistLink(url.pathname, request, config, env);
            }

            // Homepage
            if (url.pathname === '/') {
                return handleHomepage(request, config);
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
